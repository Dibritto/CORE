const { ipcMain, dialog } = require('electron');
const {
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
  getOrdersByDate,
  getAuditLogs
} = require('./service');
const { printOrder, printZReport, printLabel, shareOrderWhatsApp, shareZOrderWhatsApp } = require('./printer');

function registerIpcHandlers(mainWindow) {
  // Canal de Comunicação: Frontend -> Backend
  ipcMain.handle('get-products', async () => {
    return await getProducts();
  });

  ipcMain.handle('create-order', async (event, { items, discount, customerId, paymentMethod, userId }) => {
    try {
      return await createOrder(items, discount, customerId, paymentMethod, userId);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-stock-history', async (event, productId) => {
    return await getStockHistory(productId);
  });

  ipcMain.handle('update-order-status', async (event, { orderId, status }) => {
    try {
      return await updateOrderStatus(orderId, status);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('login-user', async (event, { username, password }) => {
    try {
      return await loginUser(username, password);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-sales-report', async () => {
    return await getSalesReport();
  });

  ipcMain.handle('print-order', async (event, orderData) => {
    try {
      await printOrder(orderData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('create-product', async (event, { productData, userId }) => {
    try {
      return await createProduct(productData, userId);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('create-cash-movement', async (event, data) => {
    try {
      return await createCashMovement(data);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-z-report', async () => {
    return await getZReport();
  });

  ipcMain.handle('print-z-report', async (event, data) => {
    try {
      await printZReport(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('print-label', async (event, product) => {
    try {
      await printLabel(product);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-order-details', async (event, orderId) => {
    try {
      return await getOrderDetails(orderId);
    } catch (err) {
      return { error: err.message };
    }
  });

  ipcMain.handle('process-return', async (event, data) => {
    try {
      return await processReturn(data);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('replenish-stock', async (event, data) => {
    try {
      return await replenishStock(data);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('update-product', async (event, { data, userId }) => {
    try {
      return await updateProduct(data, userId);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('delete-product', async (event, { id, userId }) => {
    try {
      return await deleteProduct(id, userId);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-dashboard-data', async () => {
    try {
      return await getDashboardData();
    } catch (err) {
      return { error: err.message };
    }
  });

  ipcMain.handle('park-cart', async (event, data) => {
    try {
      return await parkCart(data);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-parked-carts', async () => {
    try {
      return await getParkedCarts();
    } catch (err) {
      return { error: err.message };
    }
  });

  ipcMain.handle('unpark-cart', async (event, id) => {
    try {
      return await unparkCart(id);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('create-customer', async (event, data) => {
    try {
      return await createCustomer(data);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-customers', async () => {
    try {
      return await getCustomers();
    } catch (err) {
      return { error: err.message };
    }
  });

  ipcMain.handle('get-setting', async (event, key) => {
    return await getSetting(key);
  });

  ipcMain.handle('save-setting', async (event, { key, value }) => {
    return await saveSetting(key, value);
  });

  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Selecione a pasta do Google Drive/Dropbox'
    });
    if (result.canceled) return null;
    return result.filePaths[0];
  });

  ipcMain.handle('get-low-stock-report', async () => {
    return await getLowStockReport();
  });

  ipcMain.handle('pay-customer-debt', async (event, data) => {
    try {
      return await payCustomerDebt(data);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
  ipcMain.handle('share-whatsapp', async (event, payload) => {
    const logger = require('./logger');
    try {
      logger.info(`[IPC] Recebido share-whatsapp: ${payload.mode}`);
      return await shareOrderWhatsApp(payload);
    } catch (err) {
      logger.error(`[IPC] Erro em share-whatsapp: ${err.message}`);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('share-z-whatsapp', async (event, zData) => {
    try {
      return await shareZOrderWhatsApp(zData);
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-orders-by-date', async (event, rawDate) => {
    try {
      return await getOrdersByDate(rawDate);
    } catch (err) {
      return { error: err.message };
    }
  });
  
  ipcMain.handle('get-audit-logs', async () => {
    try {
      return await getAuditLogs();
    } catch (err) {
      return { error: err.message };
    }
  });
}

module.exports = { registerIpcHandlers };
