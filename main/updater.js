const { autoUpdater } = require('electron-updater');
const logger = require('./logger');
const { dialog, app } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;

function initAutoUpdater(win) {
    mainWindow = win;
    autoUpdater.logger = logger;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = false; // Desligamos a trava padrão

    // No modo dev, o updater usará o arquivo dev-app-update.yml
    if (!app.isPackaged) {
        autoUpdater.forceDevUpdateConfig = true;
    }

    autoUpdater.on('error', (err) => {
        logger.error(`Erro no auto-updater: ${err.message}`);
        
        // TRATAMENTO DE CHOQUE: Se o erro for de assinatura, tentamos forçar a instalação manual
        if (err.message.includes('Get-AuthenticodeSignature') || err.message.includes('signature')) {
            logger.info('Detectada falha de assinatura. Tentando disparador manual de emergência...');
            attemptManualInstall();
        }
    });

    autoUpdater.on('download-progress', (progressObj) => {
        const percent = Math.round(progressObj.percent);
        if (mainWindow) mainWindow.webContents.send('update-progress', percent);
    });

    autoUpdater.on('update-downloaded', (info) => {
        logger.info('Update baixado com sucesso via canal oficial.');
        showInstallDialog(info.version);
    });

    autoUpdater.checkForUpdatesAndNotify().catch(e => {
        logger.error(`Falha na busca: ${e.message}`);
    });
}

function showInstallDialog(version) {
    dialog.showMessageBox({
        type: 'info',
        title: 'CØRE Update',
        message: `Versão v${version} pronta para instalar!`,
        detail: 'Deseja aplicar a atualização agora?',
        buttons: ['Instalar Agora', 'Depois'],
        defaultId: 0
    }).then((result) => {
        if (result.response === 0) {
            forceExtremeInstallation();
        }
    });
}

// Tenta localizar o executável na pasta de downloads temporários do electron-updater
function attemptManualInstall() {
    const pendingFolder = path.join(app.getPath('userData'), '..', 'Local', 'core-updater', 'pending');
    
    if (fs.existsSync(pendingFolder)) {
        const files = fs.readdirSync(pendingFolder);
        const installer = files.find(f => f.endsWith('.exe'));
        
        if (installer) {
            const fullPath = path.join(pendingFolder, installer);
            logger.info(`Instalador encontrado: ${fullPath}. Disparando...`);
            
            dialog.showMessageBox({
                type: 'warning',
                title: 'Atualização Forçada',
                message: 'Detectamos uma atualização pronta, mas o Windows impediu a verificação de segurança.',
                detail: 'Deseja forçar a instalação manual agora? O sistema será fechado.',
                buttons: ['Forçar Instalação', 'Cancelar']
            }).then(res => {
                if (res.response === 0) {
                    runExternalInstaller(fullPath);
                }
            });
        }
    }
}

function forceExtremeInstallation() {
    logger.info('Executando instalação via canal oficial...');
    try {
        autoUpdater.quitAndInstall(false, true);
    } catch (e) {
        logger.error('Falha no quitAndInstall padrão. Recorrendo ao manual...');
        attemptManualInstall();
    }
}

function runExternalInstaller(installerPath) {
    const child = spawn(installerPath, ['/S'], {
        detached: true,
        stdio: 'ignore'
    });
    child.unref();
    app.exit(0);
}

async function checkForUpdatesManual() {
    try {
        await autoUpdater.checkForUpdates();
    } catch (e) {
        logger.error(`Erro manual: ${e.message}`);
        attemptManualInstall(); // Tenta o manual se o oficial falhar na conexão/assinatura
    }
}

module.exports = { initAutoUpdater, checkForUpdatesManual };
