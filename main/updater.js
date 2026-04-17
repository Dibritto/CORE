const { autoUpdater } = require('electron-updater');
const logger = require('./logger');
const { dialog, app } = require('electron');

function initAutoUpdater() {
    // Configura o logger do electron-updater para usar o nosso logger (electron-log no futuro, se integrado)
    autoUpdater.logger = logger;
    autoUpdater.autoDownload = true; // Baixa no background, offline-first não bloqueia

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

async function checkForUpdatesManual() {
    const { dialog, app } = require('electron');
    
    // Em modo dev, o electron-updater agora usará o arquivo dev-app-update.yml
    if (!app.isPackaged) {
        logger.info('Verificação manual de update iniciada em modo desenvolvimento.');
    }

    try {
        const result = await autoUpdater.checkForUpdates();
        
        // Se chegar aqui sem erro e o resultado indicar que a versão é a mesma, informa o usuário positivamente.
        if (result && result.updateInfo.version === autoUpdater.currentVersion.version) {
            dialog.showMessageBox({
                type: 'info',
                title: 'CØRE Update',
                message: 'Sistema Atualizado!',
                detail: `Você já está usando a versão mais recente do CØRE PDV (v${autoUpdater.currentVersion.version}).`
            });
        }
    } catch (e) {
        logger.error(`Erro na verificação manual de update: ${e.message}`);
        
        // Tratamento para 404 ou arquivo manifesto ausente: interpreta como "já atualizado" para o usuário
        if (e.message.indexOf('404') !== -1 || e.message.indexOf('latest.yml') !== -1) {
            dialog.showMessageBox({
                type: 'info',
                title: 'CØRE Update',
                message: 'Nenhuma nova atualização encontrada.',
                detail: `O sistema está operando na versão v${require('electron').app.getVersion()} e não há manifestos de novas versões no servidor.`
            });
        } else {
            dialog.showErrorBox('Erro de Conexão', 'Não foi possível conectar ao servidor de atualizações.\n\nVerifique sua internet ou tente novamente em alguns minutos. Se o erro persistir, consulte o suporte.');
        }
    }
}

module.exports = { initAutoUpdater, checkForUpdatesManual };
