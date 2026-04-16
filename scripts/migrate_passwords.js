// scripts/migrate_passwords.js
const sqlite3 = require('sqlite3').verbose(); // Keep for potential other uses, though not directly used for db connection here
const path = require('path');
const bcrypt = require('bcryptjs');
const { getDB, getDbPath } = require('../database/db'); // Import getDB and getDbPath

// Este script assume que está na pasta 'scripts' e o db está em 'database'
// O dbPath agora é obtido de forma mais robusta
const dbPath = getDbPath(); 
const db = getDB(); // Usa a função getDB para obter a instância do banco

const saltRounds = 10;

console.log('Iniciando migração de senhas...');

db.all("SELECT id, password FROM users", [], (err, rows) => {
    if (err) {
        return console.error('Erro ao ler usuários:', err.message);
    }

    let migrations = 0;
    const totalUsers = rows.length;

    if (totalUsers === 0) {
        console.log('Nenhum usuário no banco de dados. Migração não necessária.');
        db.close(); // Fecha a conexão do banco
        return;
    }

    rows.forEach(user => {
        // Se a senha já for um hash do bcrypt (começa com $2a$, $2b$ ou $2y$), pula
        if (user.password && user.password.startsWith('$2')) {
            console.log(`Senha do usuário ID ${user.id} já parece ser um hash. Pulando.`);
            if (++migrations === totalUsers) {
                console.log('Migração concluída. Nenhuma senha precisou ser atualizada.');
                db.close(); // Fecha a conexão do banco
            }
            return;
        }

        // Se a senha for texto plano (ex: '1234')
        console.log(`Gerando hash para a senha do usuário ID ${user.id}...`);
        bcrypt.hash(user.password, saltRounds, (err, hash) => {
            if (err) {
                console.error(`Erro ao gerar hash para o usuário ID ${user.id}:`, err.message);
                if (++migrations === totalUsers) db.close();
                return;
            }

            db.run("UPDATE users SET password = ? WHERE id = ?", [hash, user.id], function(updateErr) {
                if (updateErr) {
                    console.error(`Erro ao atualizar senha do usuário ID ${user.id}:`, updateErr.message);
                } else {
                    console.log(`Senha do usuário ID ${user.id} atualizada com sucesso.`);
                }

                if (++migrations === totalUsers) {
                    console.log('Migração de senhas concluída.');
                    db.close(); // Fecha a conexão do banco
                }
            });
        });
    });
});