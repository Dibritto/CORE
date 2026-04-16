const fs = require('fs');
const path = require('path');
const { app } = require('electron');

let logStream;
let logPath; // Manter o caminho acessível se necessário

function initializeLogger() {
    if (logStream) return; // Evita reinicialização

    try {
        // Log é salvo na pasta de dados do usuário (%APPDATA%/CORE/core.log)
        // Acessa 'app' somente quando a função é chamada pela primeira vez
        logPath = path.join(app.getPath('userData'), 'core.log');

        // Facilita a localização do log durante o desenvolvimento
        if (!app.isPackaged) {
            console.log(`CØRE: Arquivo de log sendo gerado em: ${logPath}`);
        }

        logStream = fs.createWriteStream(logPath, { flags: 'a' });

        logStream.on('error', (err) => {
            console.error("CØRE: Erro no stream do logger:", err);
            // Se o stream falhar, passa a logar no console
            logStream = process.stdout;
        });

    } catch (err) {
        // Fallback para o console se a inicialização falhar
        console.error("CØRE: FALHA AO INICIAR LOGGER. Usando console como fallback.", err);
        logStream = process.stdout; 
    }
}

function formatMsg(level, message) {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n`;
}

function writeLog(level, message) {
    // Garante que o logger está inicializado antes de qualquer escrita
    if (!logStream) {
        initializeLogger();
    }
    
    const formattedMessage = formatMsg(level, message);
    
    // Loga no stream (arquivo ou stdout)
    logStream.write(formattedMessage);

    // Adicionalmente, loga no console para visibilidade em desenvolvimento
    if (!app.isPackaged) {
        if (level === 'error') console.error(message);
        else if (level === 'warn') console.warn(message);
        else console.log(message);
    }
}

const logger = {
    info: (message) => writeLog('info', message),
    warn: (message) => writeLog('warn', message),
    error: (message) => writeLog('error', message),
    // Expõe o caminho do log de forma dinâmica
    getLogPath: () => {
        if (!logPath) initializeLogger();
        return logPath;
    }
};

module.exports = logger;
