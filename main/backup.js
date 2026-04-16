const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { getDB } = require('../database/db'); // dbPath is not needed for the copy itself

function performBackup() {
    try {
        const backupDir = path.join(app.getPath('userData'), 'backups');
        
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
        const backupFilename = `core_backup_${timestamp}.db`;
        const localBackupPath = path.join(backupDir, backupFilename);

        // Usa a API de backup online do SQLite para evitar corrupção
        const backupProcess = getDB().backup(localBackupPath, (err) => {
            if (err) {
                console.error('CØRE: Falha crítica na API de backup:', err.message);
                return;
            }

            console.log(`CØRE: Backup seguro realizado com sucesso em ${localBackupPath}`);

            // Após o backup local ser concluído com sucesso, procede com a cópia para nuvem e rotação.
            
            // 1. Cópia para Nuvem
            getDB().get("SELECT value FROM settings WHERE key = 'cloud_backup_path'", (err, row) => {
                if (err) {
                   return console.error("CØRE: Erro ao ler configuração de backup em nuvem:", err.message);
                }
                if (row && row.value) {
                    try {
                        if (fs.existsSync(row.value)) {
                            const cloudDest = path.join(row.value, backupFilename);
                            fs.copyFileSync(localBackupPath, cloudDest);
                            console.log(`CØRE: Backup em nuvem sincronizado para ${cloudDest}`);
                        } else {
                            console.warn(`CØRE: Pasta de backup em nuvem não encontrada: ${row.value}`);
                        }
                    } catch (cloudErr) {
                        console.error("CØRE: Falha na cópia do backup para nuvem:", cloudErr.message);
                    }
                }
            });

            // 2. Rotação de Backups Antigos
            try {
                const files = fs.readdirSync(backupDir).map(file => ({
                    name: file,
                    time: fs.statSync(path.join(backupDir, file)).mtime.getTime()
                })).sort((a, b) => b.time - a.time); // Mais novos primeiro

                if (files.length > 7) {
                    files.slice(7).forEach(file => {
                        fs.unlinkSync(path.join(backupDir, file.name));
                        console.log(`CØRE: Backup antigo removido: ${file.name}`);
                    });
                }
            } catch (rotationErr) {
                console.error("CØRE: Falha na rotação de backups:", rotationErr.message);
            }
        });

    } catch (err) {
        console.error('CØRE: Falha ao iniciar o processo de backup:', err.message);
    }
}

module.exports = { performBackup };
