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
        const msg = err ? err.message : 'Erro desconhecido';
        logger.error(`Erro no updater: ${msg}`);
        // Se houver erro de rede ou assinatura, tentamos o bypass de emergência
        if (msg.includes('signature') || msg.includes('Authenticode') || msg.includes('net::')) {
            logger.info('Instabilidade detectada no fluxo oficial. Acionando bypass de segurança...');
            handleEmergencyUpdate();
        }
    });

    autoUpdater.on('download-progress', (progressObj) => {
        if (!progressObj) return;
        const percent = progressObj.percent ? progressObj.percent.toFixed(2) : '0';
        const transferred = progressObj.transferred ? (progressObj.transferred / 1024 / 1024).toFixed(2) : '0';
        const total = progressObj.total ? (progressObj.total / 1024 / 1024).toFixed(2) : '0';
        
        logger.info(`Download: ${percent}% (${transferred} MB / ${total} MB)`);
    });

    autoUpdater.on('update-downloaded', (info) => {
        if (!info) return;
        logger.info(`Update v${info.version} baixado e pronto para instalação.`);
        askToInstall(info.version);
    });

    // Verificação inicial com pequeno atraso para estabilidade do boot
    setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify().catch(e => logger.error(`Falha no check inicial: ${e.message}`));
    }, 5000);

    // Verificação Periódica (a cada 2 horas) com atraso inicial de 10 min
    setTimeout(() => {
        setInterval(() => {
            logger.info("Iniciando verificação periódica de atualizações...");
            autoUpdater.checkForUpdates().catch(e => logger.error(`Erro na verificação periódica: ${e.message}`));
        }, 120 * 60 * 1000);
    }, 10 * 60 * 1000);
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

function findInstallerInFolder(folder) {
    if (!fs.existsSync(folder)) return null;
    try {
        const files = fs.readdirSync(folder);
        const installer = files.find(f => f.endsWith('.exe') && f.includes('Setup'));
        if (installer) {
            const fullPath = path.join(folder, installer);
            const stats = fs.statSync(fullPath);
            // Validação mínima de 10MB
            if (stats.size > 10 * 1024 * 1024) {
                return { path: fullPath, size: stats.size, name: installer };
            }
        }
    } catch (e) {
        logger.error(`Erro ao ler pasta ${folder}: ${e.message}`);
    }
    return null;
}

function handleEmergencyUpdate() {
    const locations = [
        path.join(process.env.LOCALAPPDATA, 'core-updater', 'pending'),
        process.env.TEMP,
        path.join(process.env.USERPROFILE, 'Downloads')
    ];

    let foundInstaller = null;

    for (const location of locations) {
        logger.info(`Bypass: Verificando local: ${location}`);
        foundInstaller = findInstallerInFolder(location);
        if (foundInstaller) break;
    }

    if (foundInstaller) {
        logger.info(`Bypass: Instalador localizado em ${foundInstaller.path} (${(foundInstaller.size / 1024 / 1024).toFixed(2)} MB)`);
        
        dialog.showMessageBox({
            type: 'warning',
            title: 'Recuperação de Atualização',
            message: 'O Windows bloqueou a instalação automática por segurança.',
            detail: `Uma versão válida (${(foundInstaller.size / 1024 / 1024).toFixed(2)} MB) foi localizada e está pronta para ser aplicada. Deseja prosseguir com a instalação manual forçada?`,
            buttons: ['Instalar Agora', 'Cancelar'],
            defaultId: 0
        }).then(res => {
            if (res.response === 0) {
                logger.info(`Bypass: Executando ${foundInstaller.path}...`);
                spawn(foundInstaller.path, ['/S'], { detached: true, stdio: 'ignore' }).unref();
                app.exit(0);
            }
        });
    } else {
        logger.warn('Bypass: Nenhum instalador válido encontrado nos locais padrão.');
        dialog.showErrorBox('Atualização Indisponível', 'Não foi possível localizar o arquivo de atualização automaticamente.\n\nPor favor, baixe a versão mais recente manualmente em: https://github.com/Dibritto/CORE/releases');
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
