const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcryptjs = require('bcryptjs');

let db;
let dbPath;

function getDB() {
    if (db) {
        return db;
    }

    const electronUrl = require('electron');
    const app = electronUrl ? electronUrl.app : null;

    dbPath = (app && app.isPackaged)
        ? path.join(app.getPath('userData'), 'core.db')
        : path.join(__dirname, 'core.db');

    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('CØRE: Erro crítico ao conectar no banco:', err.message);
            throw err;
        } else {
            console.log('CØRE: Banco de dados conectado em', dbPath);
            db.run('PRAGMA foreign_keys = ON', (pragmaErr) => {
                if (pragmaErr) {
                    console.error("CØRE: Falha ao ativar chaves estrangeiras:", pragmaErr.message);
                }
            });
        }
    });

    return db;
}

function getDbPath() {
    if (!dbPath) {
        getDB(); // Ensure dbPath is initialized
    }
    return dbPath;
}

function initDB() {
    const database = getDB();

    database.serialize(() => {
        // Criação das tabelas
        database.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            stock INTEGER DEFAULT 0,
            ean TEXT,
            active INTEGER DEFAULT 1
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            total INTEGER DEFAULT 0,
            discount INTEGER DEFAULT 0,
            customer_id INTEGER,
            status TEXT DEFAULT 'open',
            uuid TEXT,
            sync_status INTEGER DEFAULT 0,
            payment_method TEXT DEFAULT 'cash'
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            price_at_sale INTEGER,
            returned_quantity INTEGER DEFAULT 0,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS stock_movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            quantity INTEGER,
            type TEXT,
            reason TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            sync_status INTEGER DEFAULT 0,
            FOREIGN KEY(product_id) REFERENCES products(id)
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS cash_movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            amount INTEGER NOT NULL,
            reason TEXT,
            user_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            uuid TEXT,
            sync_status INTEGER DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'cashier'
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS parked_carts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            customer_name TEXT,
            items_json TEXT,
            total INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            cpf TEXT,
            address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            active INTEGER DEFAULT 1,
            debt INTEGER DEFAULT 0
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT NOT NULL,
            target TEXT,
            details TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        const safeAlter = (sql) => {
            database.run(sql, (err) => {
                if (err && !err.message.includes('duplicate column')) console.error('Migration Warning:', err.message);
            });
        };

        safeAlter("ALTER TABLE orders ADD COLUMN uuid TEXT");
        safeAlter("ALTER TABLE orders ADD COLUMN sync_status INTEGER DEFAULT 0");
        safeAlter("ALTER TABLE stock_movements ADD COLUMN sync_status INTEGER DEFAULT 0");
        safeAlter("ALTER TABLE products ADD COLUMN ean TEXT");
        safeAlter("ALTER TABLE order_items ADD COLUMN returned_quantity INTEGER DEFAULT 0");
        safeAlter("ALTER TABLE products ADD COLUMN active INTEGER DEFAULT 1");
        safeAlter("ALTER TABLE orders ADD COLUMN discount INTEGER DEFAULT 0");
        safeAlter("ALTER TABLE orders ADD COLUMN customer_id INTEGER");
        safeAlter("ALTER TABLE customers ADD COLUMN debt INTEGER DEFAULT 0");
        safeAlter("ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'cash'");
        safeAlter("ALTER TABLE parked_carts ADD COLUMN discount INTEGER DEFAULT 0");
        // Garantia de criação da tabela de auditoria em migrations
        database.run(`CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT NOT NULL,
            target TEXT,
            details TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        database.get("SELECT count(*) as count FROM products", (err, row) => {
            if (row && row.count === 0) {
                console.log("CØRE: Banco vazio. Inserindo produtos de teste...");
                const stmt = database.prepare("INSERT INTO products (name, price, stock, ean) VALUES (?, ?, ?, ?)");
                stmt.run("Café Expresso", 500, 5, "789000000001");
                stmt.run("Pão de Queijo", 350, 5, "789000000002");
                stmt.finalize();
            }
        });

        database.get("SELECT count(*) as count FROM users", (err, row) => {
            if (row && row.count === 0) {
                console.log("CØRE: Criando usuários padrão...");
                const saltRounds = 10;
                const stmt = database.prepare("INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)");

                try {
                    const adminHash = bcryptjs.hashSync("1234", saltRounds);
                    stmt.run("Gerente", "admin", adminHash, "manager");

                    const cashierHash = bcryptjs.hashSync("1234", saltRounds);
                    stmt.run("Caixa 01", "caixa", cashierHash, "cashier");

                    stmt.finalize();
                } catch (err) {
                    console.error('Erro ao gerar hash inicial:', err);
                }
            }
        });
    });
}

module.exports = { getDB, initDB, getDbPath };
