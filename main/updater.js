const { autoUpdater } = require('electron-updater');
const logger = require('./logger');
const { dialog } = require('electron');

function initAutoUpdater(win) {
    // Configuração limpa do logger
    autoUpdater.logger = logger;
    autoUpdater.autoDownload = true;

    // Eventos essenciais para feedback do usuário
    autoUpdater.on('update-available', (info) => {
        logger.info(`Nova versão encontrada: ${info.version}`);
    });

    autoUpdater.on('error', (err) => {
        logger.error(`Erro no updater: ${err.message}`);
    });

    autoUpdater.on('update-downloaded', (info) => {
        logger.info('Download concluído.');
        dialog.showMessageBox({
            type: 'info',
            title: 'CØRE Update',
            message: 'Atualização Pronta',
            detail: `A versão v${info.version} foi baixada e está pronta para ser instalada. Deseja reiniciar agora?`,
            buttons: ['Reiniciar Agora', 'Depois'],
            defaultId: 0
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });

    // Dispara a verificação
    autoUpdater.checkForUpdatesAndNotify().catch(err => {
        logger.error(`Falha ao iniciar verificação: ${err.message}`);
    });
}

async function checkForUpdatesManual() {
    try {
        await autoUpdater.checkForUpdates();
    } catch (err) {
        logger.error(`Erro na verificação manual: ${err.message}`);
    }
}

module.exports = { initAutoUpdater, checkForUpdatesManual };
