const { autoUpdater } = require('electron-updater');
const logger = require('./logger');
const { dialog, app } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function initAutoUpdater(win) {
    autoUpdater.logger = logger;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = false;

    autoUpdater.on('error', (err) => {
        logger.error(`Erro no updater: ${err.message}`);
        // Se o erro for de assinatura (o que está acontecendo agora), forçamos o manual
        if (err.message.includes('signature') || err.message.includes('Authenticode')) {
            logger.info('Bloqueio de assinatura detectado. Acionando bypass...');
            handleEmergencyUpdate();
        }
    });

    autoUpdater.on('update-downloaded', (info) => {
        logger.info('Update baixado via canal oficial.');
        askToInstall(info.version);
    });

    autoUpdater.checkForUpdatesAndNotify().catch(e => logger.error(e.message));
}

function askToInstall(version) {
    dialog.showMessageBox({
        type: 'info',
        title: 'CØRE Update',
        message: 'Nova Versão Pronta',
        detail: `Deseja instalar a v${version} agora?`,
        buttons: ['Instalar e Reiniciar', 'Mais Tarde'],
        defaultId: 0
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall(false, true);
        }
    });
}

function handleEmergencyUpdate() {
    // Caminho padrão onde o Windows esconde o download falho por assinatura
    const pendingFolder = path.join(process.env.LOCALAPPDATA, 'core-updater', 'pending');
    if (fs.existsSync(pendingFolder)) {
        const files = fs.readdirSync(pendingFolder);
        const installer = files.find(f => f.endsWith('.exe'));
        if (installer) {
            const fullPath = path.join(pendingFolder, installer);
            dialog.showMessageBox({
                type: 'warning',
                title: 'Atualização Independente',
                message: 'O Windows bloqueou a verificação automática, mas o arquivo está pronto.',
                detail: 'Deseja forçar a instalação manual? O sistema será reiniciado.',
                buttons: ['Forçar Agora', 'Cancelar']
            }).then(res => {
                if (res.response === 0) {
                    spawn(fullPath, ['/S'], { detached: true, stdio: 'ignore' }).unref();
                    app.exit(0);
                }
            });
        }
    }
}

async function checkForUpdatesManual() {
    try {
        await autoUpdater.checkForUpdates();
    } catch (e) {
        handleEmergencyUpdate();
    }
}

module.exports = { initAutoUpdater, checkForUpdatesManual };
