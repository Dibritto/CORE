const { getDB } = require('../database/db');

function startSyncService() {
    console.log('CØRE: Serviço de Sincronização Iniciado (Background)');
    
    // Loop de verificação a cada 30 segundos (simulação)
    setInterval(() => {
        checkPendingData();
    }, 30000);
}

function checkPendingData() {
    const db = getDB();
    if (!db) return;

    // Verifica pedidos pendentes
    db.get("SELECT count(*) as count FROM orders WHERE sync_status = 0", (err, row) => {
        if (!err && row && row.count > 0) {
            console.log(`[SYNC] Existem ${row.count} pedidos pendentes de envio para a nuvem.`);
        }
    });

    // Verifica estoque pendente
    db.get("SELECT count(*) as count FROM stock_movements WHERE sync_status = 0", (err, row) => {
        if (!err && row && row.count > 0) {
            console.log(`[SYNC] Existem ${row.count} movimentações de estoque pendentes.`);
        }
    });
}

module.exports = { startSyncService };