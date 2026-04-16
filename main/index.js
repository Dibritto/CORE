const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const logger = require('./logger');

// Robustez: Desabilita aceleração de hardware para evitar erros de renderização/rede em PDVs
app.disableHardwareAcceleration();

// Tratamento de Erros Críticos (Global) - deve ser early as possible
process.on('uncaughtException', (err) => {
    logger.error(`CRASH FATAL: ${err.stack}`);
    if (app.isPackaged) {
        dialog.showErrorBox('Erro Crítico', 'O sistema encontrou um erro fatal.\nConsulte o suporte técnico.');
    process.exit(1);
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
            const { response } = await dialog.showMessageBox({
              type: 'info',
              title: 'Sobre o CØRE',
              message: 'CØRE PDV',
              detail: 'Sistema Operacional Comercial Híbrido.\nVersão 1.0.0\n\nSuporte: https://dibritto-dev.blogspot.com/',
              buttons: ['OK', 'Acessar Blog']
            });
            if (response === 1) {
              shell.openExternal('https://dibritto-dev.blogspot.com/');
            }
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
  logger.info("Sistema CØRE iniciado.");
  initDB();
  performBackup(); // Realiza backup antes de qualquer operação
  createApplicationMenu(); // Carrega o menu personalizado em PT-BR
  startSyncService();
  
  // Assíncrono com a abertura da tela para evitar bloqueio offline
  const { initAutoUpdater } = require('./updater');
  initAutoUpdater();

  // Registra todos os manipuladores de IPC a partir do módulo dedicado
  registerIpcHandlers(mainWindow);

  createWindow();
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
