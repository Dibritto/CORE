const { contextBridge, ipcRenderer } = require('electron');

// Expõe canais de comunicação seguros para o processo de renderização (frontend)
contextBridge.exposeInMainWorld('api', {
  // Funções que o frontend pode invocar
  invoke: (channel, data) => {
    // Lista de canais permitidos para invocação (segurança)
    const allowedInvokeChannels = [
      'get-products', 'create-order', 'get-stock-history', 'update-order-status',
      'login-user', 'get-sales-report', 'print-order', 'create-product',
      'create-cash-movement', 'get-z-report', 'print-z-report', 'print-label',
      'get-order-details', 'process-return', 'replenish-stock', 'update-product',
      'delete-product', 'get-dashboard-data', 'park-cart', 'get-parked-carts',
      'unpark-cart', 'create-customer', 'get-customers', 'get-setting',
      'save-setting', 'select-folder', 'get-low-stock-report', 'pay-customer-debt',
      'share-whatsapp', 'share-z-whatsapp', 'get-orders-by-date', 'get-audit-logs'
    ];
    if (allowedInvokeChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  },
  // Funções para o backend enviar eventos para o frontend
  on: (channel, func) => {
    // Lista de canais permitidos para escuta (segurança)
    const allowedOnChannels = ['show-help'];
    if (allowedOnChannels.includes(channel)) {
      // Envolve o callback para evitar vazamento de referências
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      // Retorna uma função para remover o listener
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  }
});
