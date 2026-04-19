const path = require('path');
const fs = require('fs');

// Mock do logger para capturar os logs
const mockLogger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`)
};

// Simulando as funções do fs que são usadas no bypass
const originalExistsSync = fs.existsSync;
const originalReaddirSync = fs.readdirSync;
const originalStatSync = fs.statSync;

console.log("=== INICIANDO TESTE DO BYPASS DE ATUALIZAÇÃO ===");

// Configurando um cenário onde o instalador existe na pasta Downloads
const mockDownloadsFolder = path.join(process.env.USERPROFILE || '', 'Downloads');
const mockInstallerName = 'CORE PDV Setup 1.0.28.exe';

fs.existsSync = (folder) => {
    if (folder === mockDownloadsFolder) return true;
    return originalExistsSync(folder);
};

fs.readdirSync = (folder) => {
    if (folder === mockDownloadsFolder) return [mockInstallerName];
    return originalReaddirSync(folder);
};

fs.statSync = (fullPath) => {
    if (fullPath.includes(mockInstallerName)) {
        return { size: 15 * 1024 * 1024 }; // 15MB para passar no check de > 10MB
    }
    return originalStatSync(fullPath);
};

// Testando a função `findInstallerInFolder` de forma isolada
function findInstallerInFolder(folder) {
    if (!fs.existsSync(folder)) return null;
    try {
        const files = fs.readdirSync(folder);
        const installer = files.find(f => f.endsWith('.exe') && f.includes('Setup'));
        if (installer) {
            const fullPath = path.join(folder, installer);
            const stats = fs.statSync(fullPath);
            if (stats.size > 10 * 1024 * 1024) {
                return { path: fullPath, size: stats.size, name: installer };
            }
        }
    } catch (e) {
        mockLogger.error(`Erro ao ler pasta ${folder}: ${e.message}`);
    }
    return null;
}

const result = findInstallerInFolder(mockDownloadsFolder);
if (result && result.name === mockInstallerName) {
    console.log("✅ Sucesso: O script de bypass encontrou o instalador mockado corretamente.");
    console.log(`   Caminho: ${result.path} | Tamanho: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
} else {
    console.log("❌ Falha: O script de bypass não encontrou o instalador.");
}

// Restaurando as funções originais
fs.existsSync = originalExistsSync;
fs.readdirSync = originalReaddirSync;
fs.statSync = originalStatSync;

console.log("=== FIM DO TESTE ===");
