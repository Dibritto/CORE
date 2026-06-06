const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const logger = require('./logger');

logger.info("--- CØRE Iniciando Processo Principal ---");

// Robustez Extrema: Desabilita GPU via Command Line antes do app estar pronto
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.disableHardwareAcceleration();

// Bloqueio de Instância Única: Garante que apenas um CØRE esteja aberto por vez
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Se tentarem abrir outra instância, focamos na janela principal atual
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

// Tratamento de Erros Críticos (Global) - deve ser early as possible
process.on('uncaughtException', (err) => {
    logger.error(`CRASH FATAL: ${err.stack}`);
    if (app.isPackaged) {
        dialog.showErrorBox('Erro Crítico', `O sistema encontrou um erro fatal:\n\n${err.message}\n\nConsulte o suporte técnico enviando o print desta tela.`);
        app.exit(1);
    }
});

process.on('unhandledRejection', (reason) => {
    logger.error(`PROMISE REJECTION: ${reason}`);
});

const { initDB } = require('../database/db');
const { startSyncService } = require('./sync');
const { performBackup } = require('./backup');
const { registerIpcHandlers } = require('./ipcHandlers');

let mainWindow;

function createApplicationMenu() {
  const template = [
    {
      label: 'CØRE',
      submenu: [
        {
          label: 'Sobre o Sistema',
          click: async () => {
            const { app, shell, dialog } = require('electron');
            const { checkForUpdatesManual } = require('./updater');
            const version = app.getVersion();
            const { response } = await dialog.showMessageBox({
              type: 'info',
              title: 'Sobre o CØRE',
              message: `CØRE PDV - v${version}`,
              detail: `Desenvolvido por: Edmilson Britto\nContato: dimedebritto@gmail.com\n\nSistema Operacional Comercial Híbrido especializado em balcão industrial e comercial.`,
              buttons: ['OK', 'Verificar Atualizações', 'Notas de Versão', 'Suporte'],
              defaultId: 0
            });

            if (response === 1) checkForUpdatesManual();
            if (response === 2) shell.openExternal('https://github.com/Dibritto/CORE/releases');
            if (response === 3) shell.openExternal('https://dibritto-dev.blogspot.com/');
          }
        },
        { type: 'separator' },
        { label: 'Sair', role: 'quit' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { label: 'Recarregar', role: 'reload' },
        { label: 'Alternar Tela Cheia', role: 'togglefullscreen' },
        { type: 'separator' },
        { label: 'Aumentar Zoom', role: 'zoomIn' },
        { label: 'Diminuir Zoom', role: 'zoomOut' },
        { label: 'Restaurar Zoom', role: 'resetZoom' }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Lista de Atalhos (F12)',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('show-help');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: "CØRE",
    icon: path.join(__dirname, '../assets/icon.ico'),
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false, // Desabilitado por segurança
      contextIsolation: true, // Habilitado por segurança
      preload: path.join(__dirname, 'preload.js') // Ponte segura para o backend
    }
  });

  // Aponta para a pasta renderer correta
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
    try {
        logger.info("Sistema CØRE: Sinal 'ready' recebido. Iniciando componentes...");
        
        try {
            initDB();
            logger.info("Banco de dados inicializado com sucesso.");
        } catch (dbErr) {
            logger.error(`Erro crítico no Banco de Dados: ${dbErr.message}`);
            dialog.showErrorBox("Erro de Banco de Dados", "O driver de banco de dados (SQLite3) falhou ao iniciar.\n\nCertifique-se de ter o 'Visual C++ Redistributable' instalado.");
        }

        performBackup(); 
        createApplicationMenu(); 
        startSyncService();
        
        createWindow();

        const { initAutoUpdater } = require('./updater');
        initAutoUpdater(mainWindow);

        registerIpcHandlers(mainWindow);
    } catch (criticalErr) {
        logger.error(`FALHA CRÍTICA NA INICIALIZAÇÃO: ${criticalErr.stack}`);
        dialog.showErrorBox("Erro de Inicialização", "Ocorreu uma falha grave ao iniciar o CØRE. Verifique os logs.");
    }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
