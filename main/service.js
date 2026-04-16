const { getDB } = require('../database/db');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Helpers para usar async/await com SQLite (que usa callbacks nativamente)
const run = (sql, params) => new Promise((resolve, reject) => {
    getDB().run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
    });
});

const get = (sql, params) => new Promise((resolve, reject) => {
    getDB().get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});

const all = (sql, params) => new Promise((resolve, reject) => {
    getDB().all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});

// Fila de execução para transações (Mutex)
let transactionQueue = Promise.resolve();

// Auditoria Operacional
async function createAuditLog(userId, action, target, details) {
    try {
        await run("INSERT INTO audit_logs (user_id, action, target, details) VALUES (?, ?, ?, ?)",
            [userId, action, target, details]);
    } catch (err) {
        console.error("CØRE: Falha ao registrar log de auditoria:", err.message);
    }
}

// Função Central: Criar Pedido (Atomicidade garantida)
async function createOrder(items, discount = 0, customerId = null, paymentMethod = 'cash', userId = null) {
    // items: Array de { id, quantity }
    if (!items || items.length === 0) throw new Error("Pedido vazio não permitido.");
    if (discount < 0) throw new Error("Desconto não pode ser negativo.");

    if (paymentMethod === 'fiado' && !customerId) {
        throw new Error("Venda fiado exige um cliente identificado.");
    }

    // Enfileira a operação para evitar conflito de transações
    const operation = async () => {
        try {
            // Inicia Transação: Tudo ou nada
            await run("BEGIN TRANSACTION");

            let subtotal = 0;
            const orderItemsData = [];

            // 1. Validação e Cálculo
            for (let item of items) {
                const product = await get("SELECT * FROM products WHERE id = ?", [item.id]);
                if (!product) throw new Error(`Produto ID ${item.id} não encontrado.`);

                // Verifica permissão de gerente para estoque negativo
                let allowNegativeStock = false;
                if (userId) {
                    const user = await get("SELECT role FROM users WHERE id = ?", [userId]);
                    if (user && user.role === 'manager') {
                        allowNegativeStock = true;
                    }
                }

                // Regra: Estoque não pode ficar negativo (exceto Gerentes)
                if (!allowNegativeStock && product.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para: ${product.name}`);
                }

                const itemTotal = product.price * item.quantity;
                subtotal += itemTotal;

                orderItemsData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price, // Congela o preço no momento da venda
                    name: product.name
                });
            }

            if (discount > subtotal) throw new Error("Desconto não pode ser maior que o total.");
            const total = subtotal - discount;

            // 2. Inserir Pedido (Cabeçalho)
            const uuid = crypto.randomUUID();
            const resultOrder = await run("INSERT INTO orders (total, discount, customer_id, payment_method, status, uuid, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?)", [total, discount, customerId, paymentMethod, 'recebido', uuid, 0]);
            const orderId = resultOrder.lastID;

            // 3. Inserir Itens e Baixar Estoque
            for (let data of orderItemsData) {
                // Registra item do pedido
                await run("INSERT INTO order_items (order_id, product_id, quantity, price_at_sale) VALUES (?, ?, ?, ?)",
                    [orderId, data.productId, data.quantity, data.price]);

                // Baixa estoque
                await run("UPDATE products SET stock = stock - ? WHERE id = ?", [data.quantity, data.productId]);

                // Auditoria de movimento
                await run("INSERT INTO stock_movements (product_id, quantity, type, reason, sync_status) VALUES (?, ?, ?, ?, ?)",
                    [data.productId, data.quantity, 'out', `Venda #${orderId}`, 0]);
            }

            // 4. Atualizar Dívida do Cliente (Se for Fiado)
            if (paymentMethod === 'fiado' && customerId) {
                await run("UPDATE customers SET debt = debt + ? WHERE id = ?", [total, customerId]);
            }

            // Confirma Transação
            await run("COMMIT");
            console.log(`CØRE: Pedido #${orderId} [recebido] criado com sucesso. Total: ${total}`);
            return { success: true, orderId, total, discount, subtotal };

        } catch (err) {
            // Em caso de erro, desfaz tudo
            await run("ROLLBACK");
            console.error("CØRE: Erro na transação de pedido:", err.message);
            throw err; // Repassa o erro para a UI tratar
        }
    };

    const result = transactionQueue.then(operation);
    transactionQueue = result.catch(() => { });
    return result;
}

async function getProducts() {
    return await all("SELECT * FROM products WHERE active = 1");
}

async function getStockHistory(productId) {
    return await all("SELECT * FROM stock_movements WHERE product_id = ? ORDER BY created_at DESC LIMIT 10", [productId]);
}

async function updateOrderStatus(orderId, status) {
    const validStates = ['recebido', 'em preparo', 'pronto', 'entregue', 'cancelado'];

    if (!validStates.includes(status)) {
        throw new Error(`Estado inválido: ${status}`);
    }

    await run("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    console.log(`CØRE: Status do Pedido #${orderId} atualizado para '${status}'`);
    return { success: true, orderId, status };
}

async function loginUser(username, password) {
    const user = await get("SELECT * FROM users WHERE username = ?", [username]);
    if (!user) throw new Error("Credenciais inválidas.");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Credenciais inválidas.");

    // Remove a senha do objeto retornado
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
}

async function getSalesReport() {
    // Agrupa vendas por dia (últimos 30 dias)
    return await all(`
        SELECT 
            strftime('%Y-%m-%d', created_at) as raw_date,
            strftime('%d/%m/%Y', created_at) as date,
            COUNT(*) as count,
            SUM(total) as total
        FROM orders
        WHERE status != 'cancelado'
        GROUP BY strftime('%Y-%m-%d', created_at)
        ORDER BY created_at DESC
        LIMIT 30
    `);
}

async function getOrdersByDate(rawDate) {
    return await all(`
        SELECT o.*, c.name as customer_name
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE date(o.created_at, 'localtime') = ? AND o.status != 'cancelado'
        ORDER BY o.created_at DESC
    `, [rawDate]);
}

async function createProduct(data, userId) {
    const { name, price, stock, ean } = data;
    if (!name || price === undefined) throw new Error("Nome e preço são obrigatórios.");

    await run("INSERT INTO products (name, price, stock, ean) VALUES (?, ?, ?, ?)", [name, price, stock || 0, ean || null]);
    await createAuditLog(userId, 'CREATE_PROD', name, `Preço: R$ ${price / 100} | Estoque inicial: ${stock || 0}`);
    console.log(`CØRE: Produto '${name}' cadastrado com sucesso.`);
    return { success: true };
}

async function createCashMovement(data) {
    const { type, amount, reason, userId } = data;
    if (!['in', 'out'].includes(type)) throw new Error("Tipo de movimentação inválido.");
    if (!amount || amount <= 0) throw new Error("Valor deve ser positivo.");
    if (!userId) throw new Error("Usuário não identificado.");

    const uuid = crypto.randomUUID();
    await run("INSERT INTO cash_movements (type, amount, reason, user_id, uuid, sync_status) VALUES (?, ?, ?, ?, ?, ?)",
        [type, amount, reason, userId, uuid, 0]);

    await createAuditLog(userId, type === 'in' ? 'CASH_IN' : 'CASH_OUT', `R$ ${amount / 100}`, reason);
    console.log(`CØRE: Movimentação de caixa (${type}) de ${amount} registrada.`);
    return { success: true };
}

async function getZReport() {
    // Data de hoje no fuso local
    const todaySQL = "date('now', 'localtime')";

    // Total Vendas
    const sales = await all(`
        SELECT payment_method, COUNT(*) as count, SUM(total) as total
        FROM orders
        WHERE status != 'cancelado' AND date(created_at, 'localtime') = ${todaySQL}
        GROUP BY payment_method
    `);

    // Movimentações de Caixa
    const movements = await all(`
        SELECT type, SUM(amount) as total
        FROM cash_movements
        WHERE date(created_at, 'localtime') = ${todaySQL}
        GROUP BY type
    `);

    let salesCash = 0;
    let salesFiado = 0;
    let salesCount = 0;

    sales.forEach(s => {
        salesCount += s.count;
        if (s.payment_method === 'fiado') salesFiado += s.total;
        else salesCash += s.total; // cash, etc.
    });

    let cashIn = 0;
    let cashOut = 0;

    movements.forEach(m => {
        if (m.type === 'in') cashIn = m.total;
        if (m.type === 'out') cashOut = m.total;
    });

    // Saldo Final = Vendas em Dinheiro + Entradas - Saídas
    const finalBalance = salesCash + cashIn - cashOut;

    return {
        date: new Date().toLocaleString('pt-BR'),
        salesCount,
        salesCash,
        salesFiado,
        cashIn,
        cashOut,
        finalBalance
    };
}

async function getOrderDetails(orderId) {
    const order = await get(`
        SELECT o.*, c.name as customer_name
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE o.id = ?
    `, [orderId]);
    if (!order) throw new Error("Pedido não encontrado.");

    const items = await all(`
        SELECT oi.*, p.name 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `, [orderId]);

    return { order, items };
}

async function processReturn(data) {
    const { orderId, items, userId } = data; // items: [{ id (order_item_id), quantity }]

    const operation = async () => {
        await run("BEGIN TRANSACTION");
        try {
            // Busca dados do pedido para verificar método de pagamento
            const order = await get("SELECT * FROM orders WHERE id = ?", [orderId]);
            if (!order) throw new Error("Pedido original não encontrado.");

            let totalRefund = 0;

            for (let item of items) {
                const orderItem = await get("SELECT * FROM order_items WHERE id = ?", [item.id]);
                if (!orderItem) throw new Error(`Item ID ${item.id} não encontrado.`);

                // Validação: Não devolver mais do que foi comprado (menos o que já foi devolvido)
                const availableToReturn = orderItem.quantity - (orderItem.returned_quantity || 0);
                if (item.quantity > availableToReturn) throw new Error(`Qtd inválida para o item ${orderItem.product_id}. Disp: ${availableToReturn}`);

                // Atualiza item do pedido, estoque e gera log
                await run("UPDATE order_items SET returned_quantity = COALESCE(returned_quantity, 0) + ? WHERE id = ?", [item.quantity, item.id]);
                await run("UPDATE products SET stock = stock + ? WHERE id = ?", [item.quantity, orderItem.product_id]);
                await run("INSERT INTO stock_movements (product_id, quantity, type, reason, sync_status) VALUES (?, ?, ?, ?, ?)",
                    [orderItem.product_id, item.quantity, 'in', `Devolução Pedido #${orderId}`, 0]);

                totalRefund += (orderItem.price_at_sale * item.quantity);
            }

            // Processa o Reembolso
            if (totalRefund > 0) {
                if (order.payment_method === 'fiado' && order.customer_id) {
                    const customer = await get("SELECT debt FROM customers WHERE id = ?", [order.customer_id]);
                    const newDebt = customer ? Math.max(0, customer.debt - totalRefund) : 0;
                    await run("UPDATE customers SET debt = ? WHERE id = ?", [newDebt, order.customer_id]);
                    console.log(`CØRE: Dívida do cliente ${order.customer_id} ajustada para ${newDebt}`);
                } else {
                    // Se foi dinheiro/outros, gera saída de caixa
                    const uuid = crypto.randomUUID();
                    await run("INSERT INTO cash_movements (type, amount, reason, user_id, uuid, sync_status) VALUES (?, ?, ?, ?, ?, ?)",
                        ['out', totalRefund, `Reembolso Pedido #${orderId}`, userId, uuid, 0]);
                }
            }

            await run("COMMIT");
            console.log(`CØRE: Devolução processada para Pedido #${orderId}. Reembolso: ${totalRefund}`);
            return { success: true, totalRefund };
        } catch (err) {
            await run("ROLLBACK");
            throw err;
        }
    };

    const result = transactionQueue.then(operation);
    transactionQueue = result.catch(() => { });
    return result;
}

async function replenishStock(data) {
    const { productId, quantity } = data;

    if (!productId) throw new Error("Produto não identificado.");
    if (!quantity || quantity <= 0) throw new Error("Quantidade deve ser maior que zero.");

    const operation = async () => {
        await run("BEGIN TRANSACTION");
        try {
            await run("UPDATE products SET stock = stock + ? WHERE id = ?", [quantity, productId]);

            await run("INSERT INTO stock_movements (product_id, quantity, type, reason, sync_status) VALUES (?, ?, ?, ?, ?)",
                [productId, quantity, 'in', 'Reposição Manual', 0]);

            await run("COMMIT");
            console.log(`CØRE: Estoque do produto ${productId} reposto em +${quantity}`);
            return { success: true };
        } catch (err) {
            await run("ROLLBACK");
            throw err;
        }
    };

    const result = transactionQueue.then(operation);
    transactionQueue = result.catch(() => { });
    return result;
}

async function updateProduct(data, userId) {
    const { id, name, price, ean } = data;
    if (!id) throw new Error("ID do produto obrigatório.");
    if (!name || price === undefined) throw new Error("Nome e preço são obrigatórios.");

    const old = await get("SELECT * FROM products WHERE id = ?", [id]);
    await run("UPDATE products SET name = ?, price = ?, ean = ? WHERE id = ?", [name, price, ean, id]);
    
    let details = `Preço: R$ ${old.price / 100} -> R$ ${price / 100}`;
    if (old.name !== name) details += ` | Nome alterado de: ${old.name}`;
    
    await createAuditLog(userId, 'UPDATE_PROD', name, details);
    console.log(`CØRE: Produto ${id} atualizado.`);
    return { success: true };
}

async function deleteProduct(id, userId) {
    if (!id) throw new Error("ID obrigatório.");
    const prod = await get("SELECT name FROM products WHERE id = ?", [id]);
    // Soft delete: Apenas inativa o produto
    await run("UPDATE products SET active = 0 WHERE id = ?", [id]);
    await createAuditLog(userId, 'DELETE_PROD', prod ? prod.name : 'ID '+id, 'Produto inativado no sistema');
    console.log(`CØRE: Produto ${id} inativado.`);
    return { success: true };
}

async function getDashboardData() {
    // Vendas dos últimos 7 dias
    const last7Days = await all(`
        SELECT 
            strftime('%d/%m', created_at) as date,
            SUM(total) as total
        FROM orders 
        WHERE created_at >= date('now', '-6 days') AND status != 'cancelado'
        GROUP BY strftime('%Y-%m-%d', created_at)
        ORDER BY created_at ASC
    `);

    // Top 5 Produtos Mais Vendidos
    const topProducts = await all(`
        SELECT p.name, SUM(oi.quantity) as qty 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status != 'cancelado'
        GROUP BY p.id 
        ORDER BY qty DESC 
        LIMIT 5
    `);

    return { last7Days, topProducts };
}

async function parkCart(data) {
    const { userId, name, items, total, discount } = data;
    if (!items || items.length === 0) throw new Error("Carrinho vazio.");

    const json = JSON.stringify(items);
    await run("INSERT INTO parked_carts (user_id, customer_name, items_json, total, discount) VALUES (?, ?, ?, ?, ?)",
        [userId, name || 'Cliente', json, total, discount || 0]);

    console.log(`CØRE: Pedido de ${name} colocado em espera.`);
    return { success: true };
}

async function getParkedCarts() {
    return await all("SELECT * FROM parked_carts ORDER BY created_at ASC");
}

async function unparkCart(id) {
    const cart = await get("SELECT * FROM parked_carts WHERE id = ?", [id]);
    if (!cart) throw new Error("Pedido em espera não encontrado.");
    await run("DELETE FROM parked_carts WHERE id = ?", [id]);
    return { success: true, items: JSON.parse(cart.items_json), total: cart.total, discount: cart.discount || 0 };
}

async function createCustomer(data) {
    const { name, phone, email, cpf, address } = data;
    if (!name) throw new Error("Nome é obrigatório.");
    await run("INSERT INTO customers (name, phone, email, cpf, address) VALUES (?, ?, ?, ?, ?)", [name, phone, email, cpf, address]);
    return { success: true };
}

async function getCustomers() {
    return await all("SELECT * FROM customers WHERE active = 1 ORDER BY name ASC");
}

async function getSetting(key) {
    const row = await get("SELECT value FROM settings WHERE key = ?", [key]);
    return row ? row.value : null;
}

async function saveSetting(key, value) {
    await run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
    return { success: true };
}

async function getLowStockReport() {
    return await all("SELECT * FROM products WHERE stock <= 5 AND active = 1 ORDER BY stock ASC");
}

async function payCustomerDebt(data) {
    const { customerId, amount, userId } = data;
    if (!customerId) throw new Error("Cliente não informado.");
    if (!amount || amount <= 0) throw new Error("Valor inválido.");
    if (!userId) throw new Error("Caixa não identificado.");

    const customer = await get("SELECT * FROM customers WHERE id = ?", [customerId]);
    if (!customer) throw new Error("Cliente não encontrado.");

    if (amount > customer.debt) throw new Error(`Valor maior que a dívida (R$ ${(customer.debt / 100).toFixed(2)})`);

    await run("BEGIN TRANSACTION");
    try {
        // 1. Registra entrada no caixa
        const uuid = crypto.randomUUID();
        await run("INSERT INTO cash_movements (type, amount, reason, user_id, uuid, sync_status) VALUES (?, ?, ?, ?, ?, ?)",
            ['in', amount, `Pagamento Dívida: ${customer.name}`, userId, uuid, 0]);

        // 2. Abate dívida do cliente
        await run("UPDATE customers SET debt = debt - ? WHERE id = ?", [amount, customerId]);

        await run("COMMIT");
        console.log(`CØRE: Pagamento de dívida de ${customer.name}: R$ ${amount / 100}`);
        return { success: true };
    } catch (err) {
        await run("ROLLBACK");
        throw err;
    }
}
async function getAuditLogs() {
    return await all(`
        SELECT a.*, u.name as user_name 
        FROM audit_logs a
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC 
        LIMIT 100
    `);
}

module.exports = {
    createOrder,
    getProducts,
    getStockHistory,
    updateOrderStatus,
    loginUser,
    getSalesReport,
    createProduct,
    createCashMovement,
    getZReport,
    getOrderDetails,
    processReturn,
    replenishStock,
    updateProduct,
    deleteProduct,
    getDashboardData,
    parkCart,
    getParkedCarts,
    unparkCart,
    createCustomer,
    getCustomers,
    getSetting,
    saveSetting,
    getLowStockReport,
    payCustomerDebt,
    getSalesReport,
    getOrdersByDate,
    getAuditLogs
};