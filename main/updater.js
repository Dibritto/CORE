const { autoUpdater } = require('electron-updater');
const logger = require('./logger');
const { dialog, app } = require('electron');

let mainWindow;

function initAutoUpdater(win) {
    mainWindow = win;
    // Configura o logger do electron-updater para usar o nosso logger (electron-log no futuro, se integrado)
    autoUpdater.logger = logger;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    // No modo dev, o updater usará o arquivo dev-app-update.yml para simular o ambiente de produção
    if (!app.isPackaged) {
        autoUpdater.forceDevUpdateConfig = true;
        logger.info('Auto-updater rodando em modo desenvolvimento (forceDevUpdateConfig ativo).');
    }

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
        const percent = Math.round(progressObj.percent);
        logger.info(`Baixando atualização: ${percent}%`);
        if (mainWindow) {
            mainWindow.webContents.send('update-progress', percent);
        }
    });

    autoUpdater.on('update-downloaded', (info) => {
        logger.info('Atualização baixada.');
        if (mainWindow) {
            mainWindow.webContents.send('update-progress', 100);
        }
        dialog.showMessageBox({
            type: 'info',
            title: 'CØRE Update',
            message: `A versão v${info.version} está pronta!`,
            detail: 'O download foi concluído. Deseja reiniciar o sistema agora para aplicar a atualização?',
            buttons: ['Reiniciar e Instalar', 'Mais Tarde'],
            defaultId: 0
        }).then((result) => {
            if (result.response === 0) {
                logger.info('Solicitando quitAndInstall para o Windows...');
                setTimeout(() => {
                    autoUpdater.quitAndInstall(false, true);
                }, 1000);
            }
        });
    });

    // Inicia a verificação sem interromper o fluxo local
    autoUpdater.checkForUpdatesAndNotify().catch(e => {
        logger.error(`Aviso: falha na conectividade ao tentar buscar update - ${e.message}`);
    });
}

async function checkForUpdatesManual() {
    const { dialog, app } = require('electron');
    
    logger.info('Solicitação de verificação manual de atualizações.');

    try {
        // Feedback básico se for possível (opcional, mas bom para debug)
        const result = await autoUpdater.checkForUpdates();
        
        if (!result) {
            dialog.showMessageBox({
                type: 'info',
                title: 'CØRE Update',
                message: 'Verificação concluída.',
                detail: 'O servidor não retornou informações. Tente novamente em instantes.'
            });
            return;
        }

        const currentVer = autoUpdater.currentVersion ? autoUpdater.currentVersion.version : app.getVersion();
        const latestVer = result.updateInfo.version;

        if (latestVer === currentVer) {
            dialog.showMessageBox({
                type: 'info',
                title: 'CØRE Update',
                message: 'Sistema Atualizado!',
                detail: `Você já está usando a versão mais recente (v${currentVer}).`
            });
        } else {
            // Caso encontre uma versão diferente
            dialog.showMessageBox({
                type: 'info',
                title: 'CØRE Update',
                message: 'Nova atualização encontrada!',
                detail: `A versão v${latestVer} está disponível e o download já começou em segundo plano.\nVocê será avisado quando estiver pronto para instalar.`
            });
        }

    } catch (e) {
        logger.error(`Erro na verificação manual de update: ${e.message}`);
        
        // Tratamento amigável para 404/manifesto ausente
        if (e.message.includes('404') || e.message.includes('latest.yml') || e.message.includes('dev-app-update.yml')) {
            dialog.showMessageBox({
                type: 'info',
                title: 'CØRE Update',
                message: 'Nenhuma atualização pendente.',
                detail: `O sistema v${app.getVersion()} está operando com a versão mais recente disponível no servidor.`
            });
        } else {
            dialog.showErrorBox('Erro de Conexão', 'Não foi possível buscar atualizações agora.\n\nVerifique sua conexão ou tente mais tarde.\nDetalhe: ' + e.message);
        }
    }
}

module.exports = { initAutoUpdater, checkForUpdatesManual };
