const { autoUpdater } = require('electron-updater');
const logger = require('./logger');
const { dialog } = require('electron');

function initAutoUpdater() {
    // Configura o logger do electron-updater para usar o nosso logger (electron-log no futuro, se integrado)
    autoUpdater.logger = logger;
    autoUpdater.autoDownload = true; // Baixa no background, offline-first não bloqueia

    // Quando rodando em dev, não tentará atualizar para não crashear
    if (process.env.NODE_ENV !== 'production' && !require('electron').app.isPackaged) return;

    logger.info('Inicializando electron-updater...');

    autoUpdater.on('checking-for-update', () => {
        logger.info('Procurando por atualizações...');
    });

    autoUpdater.on('update-available', (info) => {
        logger.info(`Atualização disponível: V.${info.version}`);
    });

    autoUpdater.on('update-not-available', (info) => {
        logger.info('O sistema já está atualizado na versão mais recente.');
    });

    autoUpdater.on('error', (err) => {
        logger.error(`Erro no auto-updater: ${err.message}`);
        // Fallback offline garantido: erros no update não travam o sistema
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let msg = `Baixando atualização: ${Math.round(progressObj.percent)}%`;
        logger.info(msg);
    });

    autoUpdater.on('update-downloaded', (info) => {
        logger.info('Atualização baixada. O sistema será atualizado no próximo reinício.');
        dialog.showMessageBox({
            type: 'info',
            title: 'Atualização Pronta',
            message: `A versão ${info.version} foi baixada no fundo.\nDeseja reiniciar o CØRE PDV agora para atualizar?`,
            buttons: ['Reiniciar Agora', 'Depois']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });

    // Inicia a verificação sem interromper o fluxo local
    autoUpdater.checkForUpdatesAndNotify().catch(e => {
        logger.error(`Aviso: falha na conectividade ao tentar buscar update - ${e.message}`);
    });
}

module.exports = { initAutoUpdater };
