

let products = [];
let cart = [];
let currentUser = null;
let currentDiscount = 0; // Valor em centavos
let currentCustomer = null; // Objeto cliente selecionado
let isSelectingCustomer = false; // Flag para controlar o modo da tela de clientes

const searchInput = document.getElementById('search-input');
const productListEl = document.getElementById('product-list');
const cartListEl = document.getElementById('cart-list');
const totalBox = document.getElementById('total-box');
const statusBar = document.getElementById('status-bar');
const loginOverlay = document.getElementById('login-overlay');
const loginUserIn = document.getElementById('login-user');
const loginPassIn = document.getElementById('login-pass');
const loginBtn = document.getElementById('login-btn');
const userDisplay = document.getElementById('user-display');
const loginMsg = document.getElementById('login-msg');
const mainMenuBtn = document.getElementById('main-menu-btn');
const mainMenuOverlay = document.getElementById('main-menu-overlay');
const closeMenuBtn = document.getElementById('close-menu-btn');
const reportBtn = document.getElementById('report-btn');
const lowStockBtn = document.getElementById('low-stock-btn');
const reportOverlay = document.getElementById('report-overlay');
const reportTitle = document.getElementById('report-title');
const reportTableBody = document.getElementById('report-table-body');
const reportMsg = document.getElementById('report-msg');
const closeReportBtn = document.getElementById('close-report-btn');
const dashboardBtn = document.getElementById('dashboard-btn');
const dashboardOverlay = document.getElementById('dashboard-overlay');
const salesChart = document.getElementById('sales-chart');
const topProductsList = document.getElementById('top-products-list');
const closeDashboardBtn = document.getElementById('close-dashboard-btn');
const discountBtn = document.getElementById('discount-btn');
const discountOverlay = document.getElementById('discount-overlay');
const discountInput = document.getElementById('discount-input');
const discountMsg = document.getElementById('discount-msg');
const confirmDiscountBtn = document.getElementById('confirm-discount-btn');
const closeDiscountBtn = document.getElementById('close-discount-btn');
const parkBtn = document.getElementById('park-btn');
const parkedOverlay = document.getElementById('parked-overlay');
const parkedList = document.getElementById('parked-list');
const parkedMsg = document.getElementById('parked-msg');
const closeParkedBtn = document.getElementById('close-parked-btn');
const parkInputOverlay = document.getElementById('park-input-overlay');
const parkNameInput = document.getElementById('park-name-input');
const parkMsg = document.getElementById('park-msg');
const confirmParkBtn = document.getElementById('confirm-park-btn');
const closeParkInputBtn = document.getElementById('close-park-input-btn');
const identifyBtn = document.getElementById('identify-btn');
const customerDisplay = document.getElementById('customer-display');
const customersBtn = document.getElementById('customers-btn');
const customersOverlay = document.getElementById('customers-overlay');
const customersList = document.getElementById('customers-list');
const openNewCustomerBtn = document.getElementById('open-new-customer-btn');
const closeCustomersBtn = document.getElementById('close-customers-btn');
const customerFormOverlay = document.getElementById('customer-form-overlay');
const custNameIn = document.getElementById('cust-name');
const custPhoneIn = document.getElementById('cust-phone');
const custCpfIn = document.getElementById('cust-cpf');
const custEmailIn = document.getElementById('cust-email');
const custMsg = document.getElementById('cust-msg');
const saveCustomerBtn = document.getElementById('save-customer-btn');
const closeCustomerFormBtn = document.getElementById('close-customer-form-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsMsg = document.getElementById('settings-msg');
const cloudPathInput = document.getElementById('cloud-path-input');
const selectFolderBtn = document.getElementById('select-folder-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');

const storeNameInput = document.getElementById('store-name-input');
const themeColorInput = document.getElementById('theme-color-input');
const themeColorPicker = document.getElementById('theme-color-picker');
const receiptModeInput = document.getElementById('receipt-mode-input');
const headerStoreName = document.getElementById('header-store-name');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const clearDbBtn = document.getElementById('clear-db-btn');
const newProdBtn = document.getElementById('new-prod-btn');
const productOverlay = document.getElementById('product-overlay');
const prodTitle = document.getElementById('prod-title');
const prodIdIn = document.getElementById('prod-id');
const prodNameIn = document.getElementById('prod-name');
const prodPriceIn = document.getElementById('prod-price');
const prodStockIn = document.getElementById('prod-stock');
const prodEanIn = document.getElementById('prod-ean');
const saveProdBtn = document.getElementById('save-prod-btn');
const closeProdBtn = document.getElementById('close-prod-btn');
const prodMsg = document.getElementById('prod-msg');
const cashBtn = document.getElementById('cash-btn');
const cashOverlay = document.getElementById('cash-overlay');
const cashTypeIn = document.getElementById('cash-type');
const cashAmountIn = document.getElementById('cash-amount');
const cashReasonIn = document.getElementById('cash-reason');
const saveCashBtn = document.getElementById('save-cash-btn');
const closeCashBtn = document.getElementById('close-cash-btn');
const cashMsg = document.getElementById('cash-msg');
const returnBtn = document.getElementById('return-btn');
const zBtn = document.getElementById('z-btn');
const zOverlay = document.getElementById('z-overlay');
const zSalesCash = document.getElementById('z-sales-cash');
const zSalesFiado = document.getElementById('z-sales-fiado');
const zIn = document.getElementById('z-in');
const zOut = document.getElementById('z-out');
const zBalance = document.getElementById('z-balance');
const printZBtn = document.getElementById('print-z-btn');
const shareZBtn = document.getElementById('share-z-btn');
const closeZBtn = document.getElementById('close-z-btn');
const helpOverlay = document.getElementById('help-overlay');
const closeHelpBtn = document.getElementById('close-help-btn');
const returnOverlay = document.getElementById('return-overlay');
const returnItemsOverlay = document.getElementById('return-items-overlay');
const returnOrderIdIn = document.getElementById('return-order-id');
const returnMsg = document.getElementById('return-msg');
const searchReturnBtn = document.getElementById('search-return-btn');
const closeReturnBtn = document.getElementById('close-return-btn');
const returnTableBody = document.getElementById('return-table-body');
const returnItemsMsg = document.getElementById('return-items-msg');
const confirmReturnBtn = document.getElementById('confirm-return-btn');
const cancelReturnItemsBtn = document.getElementById('cancel-return-items-btn');
const returnOrderDisplay = document.getElementById('return-order-display');
const stockOverlay = document.getElementById('stock-overlay');
const stockProdName = document.getElementById('stock-prod-name');
const stockHistoryBody = document.getElementById('stock-history-body');
const stockMsg = document.getElementById('stock-msg');
const replenishArea = document.getElementById('replenish-area');
const replenishQtyIn = document.getElementById('replenish-qty');
const confirmReplenishBtn = document.getElementById('confirm-replenish-btn');
const printLabelBtn = document.getElementById('print-label-btn');
const editProdBtn = document.getElementById('edit-prod-btn');
const deleteProdBtn = document.getElementById('delete-prod-btn');
const closeStockBtn = document.getElementById('close-stock-btn');
const confirmOverlay = document.getElementById('confirm-overlay');
const confirmText = document.getElementById('confirm-text');
const confirmYesBtn = document.getElementById('confirm-yes-btn');
const confirmNoBtn = document.getElementById('confirm-no-btn');
let resolveConfirm = null; // Variável para controlar a Promise do modal de confirmação
let currentStockProduct = null;
let currentZData = null;
let statusTimeout;
let selectedIndex = 0; // Controle da seleção por teclado
let currentFiltered = []; // Lista atual na tela
let isProcessing = false; // Bloqueio de UI para operações assíncronas
let payingCustomer = null; // Cliente sendo pago

const payDebtOverlay = document.getElementById('pay-debt-overlay');
const payDebtInfo = document.getElementById('pay-debt-info');
const payDebtInput = document.getElementById('pay-debt-input');
const payDebtMsg = document.getElementById('pay-debt-msg');
const confirmPayDebtBtn = document.getElementById('confirm-pay-debt-btn');
const closePayDebtBtn = document.getElementById('close-pay-debt-btn');
const auditBtn = document.getElementById('audit-btn');
const auditOverlay = document.getElementById('audit-overlay');
const auditTableBody = document.getElementById('audit-table-body');
const closeAuditBtn = document.getElementById('close-audit-btn');

// --- GESTÃO DE JANELAS (MUTEX) ---
const ALL_OVERLAYS = [
    'loginOverlay', 'confirmOverlay', 'mainMenuOverlay', 'reportOverlay', 'dashboardOverlay', 
    'discountOverlay', 'parkedOverlay', 'parkInputOverlay', 'customersOverlay', 
    'customerFormOverlay', 'settingsOverlay', 'productOverlay', 'stockOverlay', 
    'cashOverlay', 'returnOverlay', 'returnItemsOverlay', 'zOverlay', 
    'helpOverlay', 'payDebtOverlay'
];

function closeAllModals(except = []) {
    const overlays = [
        loginOverlay, confirmOverlay, mainMenuOverlay, reportOverlay, dashboardOverlay, 
        discountOverlay, parkedOverlay, parkInputOverlay, customersOverlay, 
        customerFormOverlay, settingsOverlay, productOverlay, stockOverlay, 
        cashOverlay, returnOverlay, returnItemsOverlay, zOverlay, 
        helpOverlay, payDebtOverlay
    ];
    overlays.forEach(el => {
        if (el && !except.includes(el) && !except.includes(el.id)) {
            el.style.display = 'none';
        }
    });
}

// Inicialização
async function init() {
    closeAllModals(['login-overlay']);
    configureMenuNavigation();
    
    const storeName = await window.api.invoke('get-setting', 'store_name') || 'CØRE PDV';
    const themeColor = await window.api.invoke('get-setting', 'theme_color') || 'var(--color-primary)';
    applySettings(storeName, themeColor);
    
    loginUserIn.focus();
}

function applySettings(name, color) {
    document.documentElement.style.setProperty('--color-neon-green', color || '#00FF00');
    document.documentElement.style.setProperty('--color-border', color || '#00FF00');
    if(headerStoreName) {
        const title = name ? name.toUpperCase() : 'CØRE PDV';
        headerStoreName.innerText = `${title} :: TERMINAL 01`;
    }
}

function configureMenuNavigation() {
    const menuButtons = [
        parkBtn, reportBtn, lowStockBtn, dashboardBtn, discountBtn,
        identifyBtn, customersBtn, settingsBtn, newProdBtn, cashBtn,
        zBtn, returnBtn, auditBtn, closeMenuBtn
    ];

    menuButtons.forEach(btn => {
        if (btn) {
            btn.classList.add('menu-btn');
            btn.setAttribute('tabindex', '0');
        }
    });
}

// Escuta comando do Menu Principal (Backend -> Frontend)
window.api.on('show-help', () => {
    helpOverlay.style.display = 'flex';
});

// Renderização da Lista de Produtos
function renderProducts(list) {
    currentFiltered = list;
    productListEl.innerHTML = '';
    const displayList = list.slice(0, 50);

    displayList.forEach((p, index) => {
        const el = document.createElement('div');
        el.className = `product-item ${index === selectedIndex ? 'selected' : ''}`; 
        
        const nameGroup = document.createElement('div');
        nameGroup.className = 'p-name';
        nameGroup.innerHTML = `<span>${p.name}</span><span class="p-ean">${p.ean || ''}</span>`;

        const priceSpan = document.createElement('span');
        priceSpan.className = 'p-price';
        priceSpan.textContent = `R$ ${(p.price / 100).toFixed(2)}`;

        const stockSpan = document.createElement('span');
        stockSpan.className = 'p-stock';
        stockSpan.textContent = `QTY: ${p.stock}`;

        el.appendChild(nameGroup);
        el.appendChild(priceSpan);
        el.appendChild(stockSpan);

        el.onclick = () => addToCart(p);
        productListEl.appendChild(el);
    });

    const selectedEl = productListEl.children[selectedIndex];
    if (selectedEl) selectedEl.scrollIntoView({ block: 'nearest' });
}

// Renderização do Carrinho
function renderCart() {
    cartListEl.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        el.innerHTML = `
            <span>${item.quantity}x ${item.name}</span>
            <span>R$ ${(itemTotal / 100).toFixed(2)}</span>
        `;
        el.onclick = () => removeFromCart(index);
        cartListEl.appendChild(el);
    });

    let finalTotal = total - currentDiscount;
    if (finalTotal < 0) finalTotal = 0;

    totalBox.innerText = `R$ ${(finalTotal / 100).toFixed(2)}`;
    if (currentDiscount > 0) {
        const descEl = document.createElement('div');
        descEl.style.fontSize = '1.2rem';
        descEl.style.color = 'var(--color-err-red)';
        descEl.innerText = `DESC: -R$ ${(currentDiscount / 100).toFixed(2)}`;
        totalBox.appendChild(descEl);
    }
}

// Lógica de Negócio
function addToCart(product, quantityToAdd = 1) {
    const existing = cart.find(i => i.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    // Bloqueio Total para Usuários comuns
    if ((!currentUser || currentUser.role !== 'manager') && (currentQty + quantityToAdd > product.stock)) {
        return showStatus(`ESTOQUE INSUFICIENTE: ${product.name}`, true);
    }

    // Alerta de Confirmação para Gerentes (Evita erro por distração)
    if (currentUser && currentUser.role === 'manager' && (currentQty + quantityToAdd > product.stock)) {
        const confirmMsg = `PRODUTO SEM ESTOQUE: "${product.name.toUpperCase()}"\nEstoque atual: ${product.stock}\nDeseja vender mesmo assim?`;
        // Como addToCart não é async e showConfirm é, precisamos lidar com isso.
        // Vou transformar addToCart em async para suportar o modal.
        handleManagerStockOverflow(product, quantityToAdd);
        return;
    }

    if (existing) {
        existing.quantity += quantityToAdd;
    } else {
        cart.push({ ...product, quantity: quantityToAdd });
    }
    renderCart();
    searchInput.value = ''; // Limpa busca
    renderProducts(products); // Reseta lista
    searchInput.focus(); // Devolve foco
}

async function handleManagerStockOverflow(product, quantityToAdd) {
    const confirmMsg = `ATENÇÃO: "${product.name.toUpperCase()}" está sem estoque suficiente (${product.stock}).\n\nDeseja realizar a venda em modo NEGATIVO?`;
    if (await showConfirm(confirmMsg)) {
        const existing = cart.find(i => i.id === product.id);
        if (existing) {
            existing.quantity += quantityToAdd;
        } else {
            cart.push({ ...product, quantity: quantityToAdd });
        }
        renderCart();
        searchInput.value = '';
        renderProducts(products);
        searchInput.focus();
    }
}

function removeFromCart(index) {
    const item = cart[index];
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
    searchInput.focus();
}

function clearCart() {
    if (cart.length === 0 && !currentCustomer && currentDiscount === 0) return;
    // Som de erro ou confirmação visual seria ideal aqui no futuro
    cart = [];
    currentDiscount = 0;
    resetCustomer();
    renderCart();
    showStatus('PEDIDO CANCELADO');
    searchInput.focus();
}

async function finalizeOrder() {
    if (isProcessing) return;
    if (cart.length === 0) return showStatus('Carrinho vazio!', true);

    let paymentMethod = 'cash';
    if (currentCustomer) {
        // Se houver cliente, pergunta se é Fiado ou Dinheiro
        const isFiado = await showConfirm(`Deseja registrar esta venda como FIADO para ${currentCustomer.name.toUpperCase()}?`);
        if (isFiado) paymentMethod = 'fiado';
    }

    isProcessing = true;
    showStatus('Processando...');

    try {
        const itemsToSave = cart.map(i => ({ id: i.id, quantity: i.quantity }));
        const result = await window.api.invoke('create-order', {
            items: itemsToSave,
            discount: currentDiscount,
            customerId: currentCustomer ? currentCustomer.id : null,
            paymentMethod: paymentMethod,
            userId: currentUser ? currentUser.id : null
        });

        if (result.success) {
            // Impressão Automática e Whatsapp
            try {
                showStatus('Processando comprovante...', false);
                
                const storeName = await window.api.invoke('get-setting', 'store_name') || 'CØRE PDV';
                const receiptMode = await window.api.invoke('get-setting', 'receipt_mode') || 'print';
                
                const orderData = {
                    orderId: result.orderId,
                    total: result.total,
                    discount: result.discount,
                    paymentMethod: paymentMethod,
                    customerName: currentCustomer ? currentCustomer.name : null,
                    items: cart, // Envia o carrinho atual com nomes e preços
                    date: new Date().toLocaleString('pt-BR'),
                    storeName: storeName
                };

                // Define o modo de arquivo/compartilhamento (Sempre salva em disco agora)
                let shareMode = 'save-only';
                if (receiptMode === 'whatsapp_text' || receiptMode === 'both_text') shareMode = 'text';
                else if (receiptMode === 'whatsapp_img' || receiptMode === 'both_img') shareMode = 'image';
                else if (receiptMode === 'whatsapp_pdf' || receiptMode === 'both_pdf') shareMode = 'pdf';
                
                // Dispara o processamento de arquivos/compartilhamento
                await window.api.invoke('share-whatsapp', { orderData: orderData, mode: shareMode });

                // Dispara impressão física se configurado
                if (receiptMode === 'print' || receiptMode === 'both_img' || receiptMode === 'both_text' || receiptMode === 'both_pdf') {
                    window.api.invoke('print-order', orderData);
                }
            } catch (printErr) {
                console.error("Erro no comprovante:", printErr);
                // Não bloqueia o fluxo se falhar
            }

            cart = [];
            currentDiscount = 0;
            resetCustomer();
            renderCart();
            showStatus(`VENDA #${result.orderId} SUCESSO! Total: R$ ${(result.total / 100).toFixed(2)}`);
            // Recarrega produtos para atualizar estoque visual
            products = await window.api.invoke('get-products');
            renderProducts(products);
        } else {
            showStatus('ERRO: ' + result.error, true);
        }
    } catch (err) {
        showStatus('ERRO CRÍTICO: ' + err.message, true);
    } finally {
        isProcessing = false;
    }
}

function applyDiscount() {
    const val = parseFloat(discountInput.value.replace(',', '.'));
    if (isNaN(val) || val < 0) return setOverlayMessage(discountMsg, 'Valor inválido', true);

    currentDiscount = Math.round(val * 100);
    discountOverlay.style.display = 'none';
    discountInput.value = '';
    renderCart();
    showStatus(`Desconto de R$ ${val.toFixed(2)} aplicado.`);
    searchInput.focus();
}

async function manageStock(product) {
    closeAllModals(['stock-overlay']);
    currentStockProduct = product;
    stockProdName.innerText = product.name;
    replenishQtyIn.value = '';

    // Mostra área de reposição apenas para gerentes
    if (currentUser && currentUser.role === 'manager') {
        replenishArea.style.display = 'block';
    } else {
        replenishArea.style.display = 'none';
    }

    try {
        const history = await window.api.invoke('get-stock-history', product.id);
        setOverlayMessage(stockMsg, '', false);
        stockHistoryBody.innerHTML = '';
        history.forEach(h => {
            const tr = document.createElement('tr');
            const color = h.type === 'in' ? 'var(--color-primary)' : '#f55';
            const sign = h.type === 'in' ? '+' : '-';
            tr.innerHTML = `
                <td>${new Date(h.created_at).toLocaleString('pt-BR')}</td>
                <td style="color: ${color}; font-weight: bold;">${sign}${h.quantity}</td>
                <td>${h.reason}</td>
            `;
            stockHistoryBody.appendChild(tr);
        });
        stockOverlay.style.display = 'flex';
        if (currentUser.role === 'manager') {
            replenishQtyIn.focus();
        } else {
            closeStockBtn.focus();
        }
    } catch (err) {
        showStatus('Erro ao buscar histórico: ' + err.message, true); // Janela não abriu
    }
}

async function confirmReplenish() {
    if (!currentStockProduct) return;
    const qty = parseInt(replenishQtyIn.value);
    if (!qty || qty <= 0) return setOverlayMessage(stockMsg, 'Digite uma quantidade válida.', true);

    const result = await window.api.invoke('replenish-stock', { productId: currentStockProduct.id, quantity: qty });

    if (result.success) {
        showStatus('Estoque atualizado com sucesso!');
        stockOverlay.style.display = 'none';
        // Atualiza lista principal
        products = await window.api.invoke('get-products');
        renderProducts(products);
    } else {
        setOverlayMessage(stockMsg, 'Erro: ' + result.error, true);
    }
}

async function printProductLabel() {
    if (!currentStockProduct) return;
    try {
        const result = await window.api.invoke('print-label', currentStockProduct);
        if (result.success) {
            setOverlayMessage(stockMsg, 'Etiqueta enviada para impressão.', false);
        } else {
            setOverlayMessage(stockMsg, 'Erro: ' + result.error, true);
        }
    } catch (err) {
        setOverlayMessage(stockMsg, 'Erro ao imprimir: ' + err.message, true);
    }
}

function showStatus(msg, isError = false) {
    statusBar.innerText = msg;
    statusBar.style.color = isError ? 'var(--color-err-red)' : 'var(--color-neon-green)';

    if (statusTimeout) clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
        statusBar.innerText = 'CØRE PDV | PRONTO | [F1] FINALIZAR | [F2] MENU';
        statusBar.style.color = 'var(--color-neon-green-dim)';
    }, 5000);
}


// Login Logic
async function performLogin() {
    const username = loginUserIn.value;
    const password = loginPassIn.value;

    if (!username || !password) return setLoginMessage('Preencha usuário e senha', true);

    setLoginMessage('Verificando...', false);

    try {
        const result = await window.api.invoke('login-user', { username, password });

        if (result.success) {
            currentUser = result.user;
            closeAllModals();
            userDisplay.innerText = `${currentUser.name.toUpperCase()} [${currentUser.role.toUpperCase()}]`;

            // Botão Menu disponível para todos
            mainMenuBtn.style.display = 'inline-block';

            // Botões operacionais disponíveis para o CAIXA e GERENTE
            parkBtn.style.display = 'block'; // Espera
            discountBtn.style.display = 'block'; // Desconto
            identifyBtn.style.display = 'block'; // Identificar
            customersBtn.style.display = 'block'; // Clientes
            cashBtn.style.display = 'block'; // Movimentar Caixa
            zBtn.style.display = 'block'; // Fechar Caixa
            returnBtn.style.display = 'block'; // Devolução

            // Mostra botões administrativos apenas para GERENTES
            if (currentUser.role === 'manager') {
                reportBtn.style.display = 'block';
                lowStockBtn.style.display = 'block';
                dashboardBtn.style.display = 'block';
                settingsBtn.style.display = 'block';
                newProdBtn.style.display = 'block';
                auditBtn.style.display = 'block';
            }

            // Carrega dados iniciais
            products = await window.api.invoke('get-products');
            renderProducts(products);
            searchInput.focus();
        } else {
            setLoginMessage('Erro: ' + result.error, true);
            loginPassIn.value = '';
            loginPassIn.focus(); // Garante que o usuário possa digitar imediatamente
        }
    } catch (err) {
        setLoginMessage('Erro: ' + err.message, true);
        loginPassIn.value = '';
        loginPassIn.focus(); // Garante que o usuário possa digitar imediatamente
    }
}

function setLoginMessage(msg, isError) {
    if (loginMsg) {
        loginMsg.innerText = msg;
        loginMsg.style.color = isError ? 'var(--color-err-red)' : 'var(--color-neon-green-dim)';
    } else if (isError) {
        alert(msg); // Fallback de segurança
    }
}

// Report Logic
async function showReports() {
    closeAllModals(['report-overlay']);
    try {
        const data = await window.api.invoke('get-sales-report');
        setOverlayMessage(reportMsg, '', false);
        reportTitle.innerText = "RELATÓRIO DE VENDAS (30 DIAS)";
        reportTableBody.innerHTML = `
            <tr>
                <th>DATA</th>
                <th>PEDIDOS</th>
                <th>TOTAL</th>
                <th>AÇÕES</th>
            </tr>
        `;

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.date}</td>
                <td>${row.count}</td>
                <td style="color: var(--color-primary);">R$ ${(row.total / 100).toFixed(2)}</td>
                <td><button class="login-btn" style="width: auto; padding: 5px 10px; font-size: 0.8rem;" onclick="showDailyOrders('${row.raw_date}')">VER VENDAS</button></td>
            `;
            reportTableBody.appendChild(tr);
        });
        reportOverlay.style.display = 'flex';
        closeReportBtn.focus(); // Foca no botão fechar
    } catch (err) {
        showStatus('Erro ao carregar relatório: ' + err.message, true);
    }
}

async function showDailyOrders(rawDate) {
    try {
        const orders = await window.api.invoke('get-orders-by-date', rawDate);
        reportTitle.innerText = `VENDAS EM ${rawDate}`;
        reportTableBody.innerHTML = `
            <tr>
                <th>PEDIDO</th>
                <th>CLIENTE</th>
                <th>TOTAL</th>
                <th>AÇÕES</th>
            </tr>
        `;

        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.customer_name || 'CONSUMIDOR'}</td>
                <td style="color: var(--color-primary);">R$ ${(order.total / 100).toFixed(2)}</td>
                <td style="display: flex; gap: 5px;">
                    <button class="login-btn" style="width: auto; padding: 5px 10px; font-size: 0.8rem; background: #25D366;" onclick="resendOrderShare(${order.id}, 'image')">ZAP (IMG)</button>
                    <button class="login-btn" style="width: auto; padding: 5px 10px; font-size: 0.8rem; background: #333;" onclick="resendOrderShare(${order.id}, 'text')">ZAP (TXT)</button>
                </td>
            `;
            reportTableBody.appendChild(tr);
        });
    } catch (err) {
        showStatus('Erro ao carregar vendas diárias: ' + err.message, true);
    }
}

async function resendOrderShare(orderId, mode) {
    try {
        const details = await window.api.invoke('get-order-details', orderId);
        const storeName = await window.api.invoke('get-setting', 'store_name');
        
        const orderData = {
            orderId: details.order.id,
            total: details.order.total,
            discount: details.order.discount || 0,
            paymentMethod: details.order.payment_method,
            customerName: details.order.customer_name || 'CONSUMIDOR',
            date: new Date(details.order.created_at).toLocaleString('pt-BR'),
            items: details.items,
            storeName: storeName
        };

        await window.api.invoke('share-whatsapp', { orderData, mode });
        showStatus('Comprovante enviado!', false);
    } catch (err) {
        showStatus('Erro ao reenviar: ' + err.message, true);
    }
}

// Global Exports for inline HTML events
window.showDailyOrders = showDailyOrders;
window.resendOrderShare = resendOrderShare;

async function showLowStockReport() {
    closeAllModals(['report-overlay']);
    reportTitle.innerText = 'ESTOQUE BAIXO (ALERTA)';
    try {
        const data = await window.api.invoke('get-low-stock-report');
        setOverlayMessage(reportMsg, '', false);
        reportTitle.innerText = "ALERTA DE ESTOQUE BAIXO (< 5)";
        reportTableBody.innerHTML = `
            <tr>
                <th>PRODUTO</th>
                <th>ESTOQUE</th>
                <th>PREÇO</th>
                <th>AÇÕES</th>
            </tr>
        `;

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.name}</td>
                <td style="color: #ff5555; font-weight: bold;">${row.stock}</td>
                <td>R$ ${(row.price / 100).toFixed(2)}</td>
                <td>
                    <button class="login-btn" style="width: auto; padding: 5px 10px; font-size: 0.8rem;" onclick="openReplenishFromReport(${row.id})">REPOR</button>
                </td>
            `;
            reportTableBody.appendChild(tr);
        });
        reportOverlay.style.display = 'flex';
        closeReportBtn.focus();
    } catch (err) {
        showStatus('Erro ao carregar relatório: ' + err.message, true);
    }
}

// Helper para abrir gestão de estoque a partir do relatório
async function openReplenishFromReport(productId) {
    const productsList = await window.api.invoke('get-products');
    const product = productsList.find(p => p.id === productId);
    if (product) {
        reportOverlay.style.display = 'none';
        manageStock(product);
    }
}
window.openReplenishFromReport = openReplenishFromReport;

// Dashboard Logic
async function showDashboard() {
    closeAllModals(['dashboard-overlay']);
    
    // Estado de Carregamento
    salesChart.innerHTML = '<div class="muted" style="padding: 20px;">CALCULANDO MÉTRICAS...</div>';
    topProductsList.innerHTML = '';
    dashboardOverlay.style.display = 'flex';

    try {
        const data = await window.api.invoke('get-dashboard-data');
        if (data.error) throw new Error(data.error);

        // Renderizar Gráfico de Vendas
        salesChart.innerHTML = '';
        const maxTotal = Math.max(...data.last7Days.map(d => d.total), 1);

        data.last7Days.forEach(day => {
            const heightPercent = (day.total / maxTotal) * 100;
            const barHtml = `
                <div class="bar-group">
                    <div class="bar-value">R$${(day.total / 100).toFixed(0)}</div>
                    <div class="bar" style="height: 0%;"></div>
                    <div class="bar-label">${day.date}</div>
                </div>
            `;
            salesChart.innerHTML += barHtml;
            
            // Animação de crescimento
            setTimeout(() => {
                const bars = salesChart.querySelectorAll('.bar');
                if (bars.length > 0) bars[bars.length - 1].style.height = heightPercent + '%';
            }, 50);
        });

        // Renderizar Top Produtos
        topProductsList.innerHTML = '';
        const maxQty = Math.max(...data.topProducts.map(p => p.qty), 1);

        data.topProducts.forEach(prod => {
            const widthPercent = (prod.qty / maxQty) * 100;
            const rowHtml = `
                <div class="top-prod-row">
                    <div class="top-prod-name">
                        <span>${prod.name.toUpperCase()}</span>
                        <span class="top-prod-qty">${prod.qty} UN</span>
                    </div>
                    <div class="top-prod-bar-bg">
                        <div class="top-prod-bar-fill" style="width: 0%"></div>
                    </div>
                </div>
            `;
            topProductsList.innerHTML += rowHtml;

            // Animação horizontal
            setTimeout(() => {
                const fills = topProductsList.querySelectorAll('.top-prod-bar-fill');
                if (fills.length > 0) fills[fills.length - 1].style.width = widthPercent + '%';
            }, 100);
        });

        closeDashboardBtn.focus();
    } catch (err) {
        showStatus('Erro ao carregar dashboard: ' + err.message, true);
    }
}

// Product Registration Logic
async function saveProduct() {
    const id = prodIdIn.value;
    const name = prodNameIn.value;
    const priceRaw = prodPriceIn.value;
    const stock = parseInt(prodStockIn.value) || 0;
    const ean = prodEanIn.value;

    if (!name || !priceRaw) return setProductMessage('Nome e Preço são obrigatórios.', true);

    // Converte preço para centavos (R$ 10.50 -> 1050)
    const price = Math.round(parseFloat(priceRaw.replace(',', '.')) * 100);

    setProductMessage('Salvando...', false);

    try {
        let result;
        if (id) {
            // Edição
            result = await window.api.invoke('update-product', { data: { id, name, price, ean }, userId: currentUser.id });
        } else {
            // Criação
            result = await window.api.invoke('create-product', { productData: { name, price, stock, ean }, userId: currentUser.id });
        }

        if (result.success) {
            showStatus(id ? 'Produto atualizado!' : 'Produto cadastrado!');
            productOverlay.style.display = 'none';
            stockOverlay.style.display = 'none'; // Fecha gestão se estiver aberta
            currentStockProduct = null;
            // Limpa campos
            prodNameIn.value = ''; prodPriceIn.value = ''; prodStockIn.value = ''; prodEanIn.value = '';
            // Recarrega lista
            products = await window.api.invoke('get-products');
            renderProducts(products);
        } else {
            setProductMessage('Erro: ' + result.error, true);
        }
    } catch (err) {
        setProductMessage('Erro crítico: ' + err.message, true);
    }
}

function setProductMessage(msg, isError) {
    if (prodMsg) {
        prodMsg.innerText = msg;
        prodMsg.style.color = isError ? '#ff5555' : '#888';
    }
}

function openEditProduct() {
    if (!currentStockProduct) return;

    prodTitle.innerText = "EDITAR PRODUTO";
    prodIdIn.value = currentStockProduct.id;
    prodNameIn.value = currentStockProduct.name;
    prodPriceIn.value = (currentStockProduct.price / 100).toFixed(2);
    prodStockIn.value = currentStockProduct.stock;
    prodStockIn.disabled = true; // Estoque não edita por aqui, apenas via reposição
    prodEanIn.value = currentStockProduct.ean || '';
    setProductMessage('', false);

    productOverlay.style.display = 'flex';
    prodNameIn.focus();
}

async function deleteProduct() {
    if (!currentStockProduct) return;
    if (!await showConfirm(`Tem certeza que deseja EXCLUIR "${currentStockProduct.name}"?\nEle não aparecerá mais nas vendas.`)) return;

    const result = await window.api.invoke('delete-product', { id: currentStockProduct.id, userId: currentUser.id });
    if (result.success) {
        showStatus('Produto excluído com sucesso.');
        stockOverlay.style.display = 'none';
        currentStockProduct = null;
        products = await window.api.invoke('get-products');
        renderProducts(products);
    } else {
        setOverlayMessage(stockMsg, 'Erro ao excluir: ' + result.error, true);
    }
}

// Cash Movement Logic
async function saveCashMovement() {
    const type = cashTypeIn.value;
    const amountRaw = cashAmountIn.value;
    const reason = cashReasonIn.value;

    if (!amountRaw || !reason) return setCashMessage('Valor e Motivo são obrigatórios.', true);

    const amount = Math.round(parseFloat(amountRaw.replace(',', '.')) * 100);

    setCashMessage('Registrando...', false);

    try {
        const result = await window.api.invoke('create-cash-movement', {
            type, amount, reason, userId: currentUser.id
        });

        if (result.success) {
            cashOverlay.style.display = 'none';
            cashAmountIn.value = ''; cashReasonIn.value = '';
            showStatus('Movimentação registrada com sucesso!');
        } else {
            setCashMessage('Erro: ' + result.error, true);
        }
    } catch (err) {
        setCashMessage('Erro crítico: ' + err.message, true);
    }
}

function setCashMessage(msg, isError) {
    if (cashMsg) {
        cashMsg.innerText = msg;
        cashMsg.style.color = isError ? '#ff5555' : '#888';
    }
}

// Return Logic
async function searchReturnOrder() {
    const orderId = returnOrderIdIn.value;
    if (!orderId) return setReturnMessage('Digite o número do pedido.', true);

    setReturnMessage('Buscando...', false);

    const result = await window.api.invoke('get-order-details', orderId);
    if (result.error) return setReturnMessage(result.error, true);

    returnOrderDisplay.innerText = orderId;
    returnTableBody.innerHTML = `
        <tr>
            <th>PRODUTO</th>
            <th>QTD COMPRADA</th>
            <th>JÁ DEVOLVIDO</th>
            <th>DEVOLVER AGORA</th>
        </tr>
    `;

    result.items.forEach(item => {
        const available = item.quantity - (item.returned_quantity || 0);
        if (available > 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.returned_quantity || 0}</td>
                <td><input type="number" min="0" max="${available}" class="login-input" style="width: 80px; margin:0;" data-id="${item.id}" placeholder="0"></td>
            `;
            // Permite confirmar com Enter direto no input
            const input = tr.querySelector('input');
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') confirmReturn();
            });
            returnTableBody.appendChild(tr);
        }
    });

    returnOverlay.style.display = 'none';
    setReturnItemsMessage('', false); // Limpa msg anterior
    returnItemsOverlay.style.display = 'flex';

    // Foca no primeiro input para agilizar a digitação
    const firstInput = returnTableBody.querySelector('input');
    if (firstInput) firstInput.focus();
    else confirmReturnBtn.focus();
}

async function confirmReturn() {
    const inputs = returnTableBody.querySelectorAll('input');
    const itemsToReturn = [];
    const orderId = returnOrderDisplay.innerText;

    inputs.forEach(input => {
        const qty = parseInt(input.value) || 0;
        if (qty > 0) {
            itemsToReturn.push({ id: input.getAttribute('data-id'), quantity: qty });
        }
    });

    if (itemsToReturn.length === 0) return setReturnItemsMessage('Nenhum item selecionado (Qtd > 0).', true);

    setReturnItemsMessage('Processando...', false);

    const result = await window.api.invoke('process-return', { orderId, items: itemsToReturn, userId: currentUser.id });

    if (result.success) {
        showStatus(`Devolução realizada! Reembolso: R$ ${(result.totalRefund / 100).toFixed(2)}`);
        returnItemsOverlay.style.display = 'none';
        returnOrderIdIn.value = '';
    } else {
        setReturnItemsMessage('Erro: ' + result.error, true);
    }
}

// Z Report Logic
async function showZReport() {
    closeAllModals(['z-overlay']);
    try {
        const data = await window.api.invoke('get-z-report');
        currentZData = data;
        zSalesCash.innerText = `R$ ${(data.salesCash / 100).toFixed(2)}`;
        zSalesFiado.innerText = `R$ ${(data.salesFiado / 100).toFixed(2)}`;
        zIn.innerText = `R$ ${(data.cashIn / 100).toFixed(2)}`;
        zOut.innerText = `R$ ${(data.cashOut / 100).toFixed(2)}`;
        zBalance.innerText = `R$ ${(data.finalBalance / 100).toFixed(2)}`;
        zOverlay.style.display = 'flex';
        printZBtn.focus();
    } catch (err) {
        showStatus('Erro ao gerar fechamento: ' + err.message, true);
    }
}

shareZBtn.onclick = async () => {
    if (!currentZData) return;
    const storeName = await window.api.invoke('get-setting', 'store_name');
    await window.api.invoke('share-z-whatsapp', { ...currentZData, storeName });
};

async function printZReport() {
    if (!currentZData) return;
    try {
        const result = await window.api.invoke('print-z-report', currentZData);
        if (result.success) {
            showStatus('Enviado para impressão.');
        } else {
            showStatus('Erro na impressão: ' + result.error, true);
        }
    } catch (err) {
        showStatus('Erro na impressão: ' + err.message, true);
    }
}

// Park/Unpark Logic
async function handleParkButton() {
    // Se tem itens no carrinho, tenta estacionar
    if (cart.length > 0) {
        parkNameInput.value = 'Cliente';
        setOverlayMessage(parkMsg, '', false);
        parkInputOverlay.style.display = 'flex';
        parkNameInput.focus();
        parkNameInput.select();
    } else {
        // Se carrinho vazio, mostra lista de espera
        showParkedList();
    }
}

async function confirmPark() {
    const name = parkNameInput.value;
    let total = 0;
    cart.forEach(i => total += (i.price * i.quantity));
    total -= currentDiscount;

    const result = await window.api.invoke('park-cart', {
        userId: currentUser.id,
        name: name || 'Cliente',
        items: cart,
        total: total,
        discount: currentDiscount
    });

    if (result.success) {
        cart = [];
        currentDiscount = 0;
        resetCustomer();
        renderCart();
        showStatus('Pedido colocado em espera.');
        parkInputOverlay.style.display = 'none';
    } else {
        setOverlayMessage(parkMsg, 'Erro: ' + result.error, true);
    }
}

async function showParkedList() {
    const list = await window.api.invoke('get-parked-carts');
    parkedList.innerHTML = '';

    if (list.length === 0) {
        parkedList.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Nenhum pedido em espera.</div>';
    }

    list.forEach(p => {
        const el = document.createElement('div');
        el.className = 'parked-item';
        el.tabIndex = 0; // Permite foco via TAB
        el.innerHTML = `
            <div>
                <div style="color:#fff; font-weight:bold;">${p.customer_name}</div>
                <div style="color:#888; font-size:0.8rem;">${new Date(p.created_at).toLocaleTimeString('pt-BR')}</div>
            </div>
            <div style="color:var(--color-primary);">R$ ${(p.total / 100).toFixed(2)}</div>
        `;
        el.onclick = () => restoreParkedCart(p.id);
        // Seleção via Enter
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') restoreParkedCart(p.id);
        });
        parkedList.appendChild(el);
    });

    parkedOverlay.style.display = 'flex';
    setOverlayMessage(parkedMsg, '', false);
    // Foca no primeiro item para navegação imediata
    if (list.length > 0) {
        const first = parkedList.querySelector('.parked-item');
        if (first) first.focus();
    } else {
        closeParkedBtn.focus();
    }
}

async function restoreParkedCart(id) {
    if (cart.length > 0) {
        if (!await showConfirm("O carrinho atual não está vazio. Deseja substituí-lo pelo pedido em espera?")) return;
    }

    const result = await window.api.invoke('unpark-cart', id);
    if (result.success) {
        cart = result.items;
        currentDiscount = result.discount || 0;

        renderCart();
        parkedOverlay.style.display = 'none';
        showStatus('Pedido recuperado da fila.');
    } else {
        setOverlayMessage(parkedMsg, 'Erro ao recuperar: ' + result.error, true);
    }
}

// Customers Logic
async function showCustomers() {
    closeAllModals(['customers-overlay']);
    try {
        const list = await window.api.invoke('get-customers');
        customersList.innerHTML = '';

        if (list.length === 0) {
            customersList.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Nenhum cliente cadastrado.</div>';
        }

        list.forEach(c => {
            const el = document.createElement('div');
            el.className = 'customer-item';
            el.tabIndex = 0;
            el.style.borderBottom = '1px solid #333';
            el.style.padding = '8px';

            const header = document.createElement('div');
            header.style.color = '#fff';
            header.style.fontWeight = 'bold';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = c.name;
            header.appendChild(nameSpan);

            if (isSelectingCustomer) {
                const selSpan = document.createElement('span');
                selSpan.style.color = 'var(--color-primary)';
                selSpan.style.fontSize = '0.8rem';
                selSpan.textContent = '[SELECIONAR]';
                header.appendChild(selSpan);
            } else if (c.debt > 0) {
                const btn = document.createElement('button');
                btn.className = 'login-btn';
                btn.style.width = 'auto';
                btn.style.padding = '2px 5px';
                btn.style.fontSize = '0.7rem';
                btn.style.margin = '0';
                btn.textContent = 'QUITAR DÍVIDA';
                btn.onclick = (e) => {
                    e.stopPropagation();
                    showPayDebt(c.id, c.name, c.debt);
                };
                header.appendChild(btn);
            }

            const infoRow = document.createElement('div');
            infoRow.style.color = '#888';
            infoRow.style.fontSize = '0.8rem';
            infoRow.textContent = `${c.phone ? formatPhone(c.phone) : '-'} | ${c.cpf ? formatCPF(c.cpf) : '-'} `;
            
            const debtSpan = document.createElement('span');
            debtSpan.style.color = c.debt > 0 ? '#ff5555' : '#888';
            debtSpan.style.marginLeft = '10px';
            debtSpan.textContent = `Dívida: R$ ${(c.debt / 100).toFixed(2)}`;
            infoRow.appendChild(debtSpan);

            el.appendChild(header);
            el.appendChild(infoRow);

            if (isSelectingCustomer) {
                el.style.cursor = 'pointer';
                el.onclick = () => selectCustomer(c);
                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') selectCustomer(c);
                });
            }

            customersList.appendChild(el);
        });

        customersOverlay.style.display = 'flex';
        if (list.length > 0) {
            const first = customersList.querySelector('.customer-item');
            if (first) first.focus();
        } else {
            document.getElementById('open-new-customer-btn').focus();
        }
    } catch (err) {
        showStatus('Erro ao listar clientes: ' + err.message, true);
    }
}

function showPayDebt(id, name, debt) {
    payingCustomer = { id, name, debt };
    payDebtInfo.innerText = `Cliente: ${name}\nDívida Atual: R$ ${(debt / 100).toFixed(2)}`;
    payDebtInput.value = '';
    setOverlayMessage(payDebtMsg, '', false);
    payDebtOverlay.style.display = 'flex';
    customersOverlay.style.display = 'none'; // Esconde lista temp
    payDebtInput.focus();
}

async function confirmPayDebt() {
    if (!payingCustomer) return;
    const amount = parseMoney(payDebtInput.value);

    if (amount <= 0) return setOverlayMessage(payDebtMsg, 'Valor inválido.', true);
    if (amount > payingCustomer.debt) return setOverlayMessage(payDebtMsg, 'Valor maior que a dívida.', true);

    const result = await window.api.invoke('pay-customer-debt', {
        customerId: payingCustomer.id,
        amount: amount,
        userId: currentUser.id
    });

    if (result.success) {
        showStatus('Dívida atualizada com sucesso!');
        payDebtOverlay.style.display = 'none';
        showCustomers(); // Reabre lista atualizada
    } else {
        setOverlayMessage(payDebtMsg, 'Erro: ' + result.error, true);
    }
}

function selectCustomer(customer) {
    currentCustomer = customer;
    customerDisplay.innerText = `CLIENTE: ${customer.name.toUpperCase()}`;
    customerDisplay.style.color = 'var(--color-primary)';
    customersOverlay.style.display = 'none';
    showStatus(`Cliente ${customer.name} vinculado.`);
}

function parseMoney(val) {
    if (!val) return 0;
    // Aceita 10,50 ou 10.50
    const clean = val.replace(',', '.');
    return Math.round(parseFloat(clean) * 100);
}

function resetCustomer() {
    currentCustomer = null;
    customerDisplay.innerText = 'CLIENTE: CONSUMIDOR FINAL';
    customerDisplay.style.color = '#aaa';
}

async function saveCustomer() {
    const name = custNameIn.value;
    const phone = custPhoneIn.value.replace(/\D/g, ''); // Salva apenas números
    const cpf = custCpfIn.value.replace(/\D/g, '');     // Salva apenas números
    const email = custEmailIn.value;

    if (!name) return setOverlayMessage(custMsg, 'Nome é obrigatório.', true);

    const result = await window.api.invoke('create-customer', { name, phone, cpf, email });
    if (result.success) {
        showStatus('Cliente cadastrado com sucesso!');
        customerFormOverlay.style.display = 'none';
        showCustomers(); // Recarrega lista
    } else {
        setOverlayMessage(custMsg, 'Erro: ' + result.error, true);
    }
}

// Settings Logic
async function showSettings() {
    closeAllModals(['settings-overlay']);
    const path = await window.api.invoke('get-setting', 'cloud_backup_path');
    cloudPathInput.value = path || '';
    
    const storeName = await window.api.invoke('get-setting', 'store_name') || 'CØRE PDV';
    const themeColor = await window.api.invoke('get-setting', 'theme_color') || '#00FF00';
    const receiptMode = await window.api.invoke('get-setting', 'receipt_mode') || 'print';

    storeNameInput.value = storeName;
    themeColorInput.value = themeColor.toUpperCase();
    if (/^#[0-9A-F]{6}$/i.test(themeColor)) {
        themeColorPicker.value = themeColor;
    }
    receiptModeInput.value = receiptMode;

    setOverlayMessage(settingsMsg, '', false);
    settingsOverlay.style.display = 'flex';
    closeSettingsBtn.focus();
}

async function saveSettings() {
    const color = themeColorInput.value.toUpperCase();
    await window.api.invoke('save-setting', { key: 'store_name', value: storeNameInput.value });
    await window.api.invoke('save-setting', { key: 'theme_color', value: color });
    await window.api.invoke('save-setting', { key: 'receipt_mode', value: receiptModeInput.value });
    
    applySettings(storeNameInput.value, color);
    
    setOverlayMessage(settingsMsg, 'CONFIGURAÇÕES APLICADAS!', false);
    setTimeout(() => {
        settingsOverlay.style.display = 'none';
        openMainMenu();
    }, 800);
}

// Event Listeners para Sincronização de Cores
themeColorPicker.addEventListener('input', (e) => {
    themeColorInput.value = e.target.value.toUpperCase();
});

themeColorInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(val)) {
        themeColorPicker.value = val;
    }
});

clearDbBtn.onclick = () => {
    showConfirm('DESEJA LIMPAR TODO O BANCO DE DADOS? ESTA OPERAÇÃO IRÁ APAGAR TODOS OS PRODUTOS E VENDAS CADASTRADOS E É IRREVERSÍVEL.', async () => {
        const result = await window.api.invoke('clear-database');
        if (result.success) {
            showStatus('BANCO DE DADOS REINICIALIZADO.');
            window.location.reload();
        } else {
            showStatus('Erro ao limpar banco: ' + result.error, true);
        }
    });
};

async function selectBackupFolder() {
    const path = await window.api.invoke('select-folder');
    if (path) {
        cloudPathInput.value = path;
        await window.api.invoke('save-setting', { key: 'cloud_backup_path', value: path });
        setOverlayMessage(settingsMsg, 'Caminho salvo! Backup será copiado na próxima inicialização.', false);
    }
}

// Eventos de Teclado (Foco em produtividade)
searchInput.addEventListener('input', (e) => {
    const raw = e.target.value;
    // Regex para detectar multiplicador (ex: "3*cafe" ou "3xcafe")
    const match = raw.match(/^(\d+)[*x]\s*(.*)/i);
    let term = raw.toLowerCase();

    if (match) {
        term = (match[2] || '').toLowerCase().trim();
    }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.ean && p.ean.includes(term))
    );
    selectedIndex = 0; // Reseta seleção ao buscar
    renderProducts(filtered);
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const raw = searchInput.value;
        const match = raw.match(/^(\d+)[*x]\s*(.*)/i);
        let qty = match ? parseInt(match[1], 10) : 1;

        if (currentFiltered.length > 0) {
            addToCart(currentFiltered[selectedIndex], qty);
        }
    }
});


loginBtn.onclick = performLogin;
loginPassIn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performLogin();
});
loginUserIn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginPassIn.focus();
});

function openMainMenu() {
    closeAllModals(['main-menu-overlay']);
    mainMenuOverlay.style.display = 'flex';
    if(window.CORE_ICONS) window.CORE_ICONS.injectIcons();
    // Foca no primeiro botão visível para permitir navegação imediata
    requestAnimationFrame(() => {
        setTimeout(() => {
            const visibleButtons = Array.from(mainMenuOverlay.querySelectorAll('.btn')).filter(b => b.offsetParent !== null);
            if (visibleButtons.length > 0) visibleButtons[0].focus();
        }, 100);
    });
}

mainMenuBtn.onclick = openMainMenu;
closeMenuBtn.onclick = () => { mainMenuOverlay.style.display = 'none'; searchInput.focus(); };

reportBtn.onclick = () => { showReports(); mainMenuOverlay.style.display = 'none'; };
closeReportBtn.onclick = () => { reportOverlay.style.display = 'none'; openMainMenu(); };
lowStockBtn.onclick = () => { showLowStockReport(); mainMenuOverlay.style.display = 'none'; };

dashboardBtn.onclick = () => { showDashboard(); mainMenuOverlay.style.display = 'none'; };
closeDashboardBtn.onclick = () => { dashboardOverlay.style.display = 'none'; openMainMenu(); };

discountBtn.onclick = () => { closeAllModals(['discount-overlay']); discountOverlay.style.display = 'flex'; setOverlayMessage(discountMsg, '', false); discountInput.focus(); };
closeDiscountBtn.onclick = () => { discountOverlay.style.display = 'none'; openMainMenu(); };
confirmDiscountBtn.onclick = applyDiscount;

parkBtn.onclick = () => { handleParkButton(); mainMenuOverlay.style.display = 'none'; };
closeParkedBtn.onclick = () => { parkedOverlay.style.display = 'none'; openMainMenu(); };
confirmParkBtn.onclick = confirmPark;
closeParkInputBtn.onclick = () => { parkInputOverlay.style.display = 'none'; searchInput.focus(); };
parkNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmPark();
});

customersBtn.onclick = () => { isSelectingCustomer = false; showCustomers(); mainMenuOverlay.style.display = 'none'; };
identifyBtn.onclick = () => { isSelectingCustomer = true; showCustomers(); mainMenuOverlay.style.display = 'none'; };

closeCustomersBtn.onclick = () => { customersOverlay.style.display = 'none'; openMainMenu(); };
openNewCustomerBtn.onclick = () => {
    custNameIn.value = ''; custPhoneIn.value = ''; custCpfIn.value = ''; custEmailIn.value = '';
    setOverlayMessage(custMsg, '', false);
    customerFormOverlay.style.display = 'flex';
    custNameIn.focus();
};
closeCustomerFormBtn.onclick = () => { customerFormOverlay.style.display = 'none'; };
saveCustomerBtn.onclick = saveCustomer;

settingsBtn.onclick = () => { showSettings(); mainMenuOverlay.style.display = 'none'; };
closeSettingsBtn.onclick = () => { settingsOverlay.style.display = 'none'; openMainMenu(); };
selectFolderBtn.onclick = selectBackupFolder;
saveSettingsBtn.onclick = saveSettings;

auditBtn.onclick = () => { showAuditLogs(); mainMenuOverlay.style.display = 'none'; };
closeAuditBtn.onclick = () => { auditOverlay.style.display = 'none'; openMainMenu(); };

async function showAuditLogs() {
    closeAllModals(['audit-overlay']);
    try {
        const logs = await window.api.invoke('get-audit-logs');
        auditTableBody.innerHTML = '';
        
        if (!logs) throw new Error("A resposta do backend foi indefinida.");
        if (logs.error) throw new Error(logs.error);
        if (!Array.isArray(logs)) throw new Error("A resposta do backend não é uma lista de logs.");
        
        logs.forEach(log => {
            const tr = document.createElement('tr');
            
            let actionColor = 'var(--color-text-muted)';
            if(log.action.includes('DELETE')) actionColor = 'var(--color-err-red)';
            if(log.action.includes('CREATE')) actionColor = 'var(--color-neon-green)';
            if(log.action.includes('CASH')) actionColor = 'var(--color-primary)';
            
            tr.innerHTML = `
                <td style="font-size: 0.75rem;">${new Date(log.created_at).toLocaleString('pt-BR')}</td>
                <td style="font-weight: bold;">${log.user_name || 'SISTEMA'}</td>
                <td style="color: ${actionColor}; font-weight: bold;">${log.action}</td>
                <td style="font-size: 0.8rem;">${log.target} - ${log.details || ''}</td>
            `;
            auditTableBody.appendChild(tr);
        });
        
        auditOverlay.style.display = 'flex';
    } catch (err) {
        showStatus('Erro ao carregar auditoria: ' + err.message, true);
    }
}

newProdBtn.onclick = () => {
    prodTitle.innerText = "NOVO PRODUTO";
    prodIdIn.value = '';
    prodNameIn.value = ''; prodPriceIn.value = ''; prodStockIn.value = ''; prodEanIn.value = '';
    prodStockIn.disabled = false;
    setProductMessage('', false);
    productOverlay.style.display = 'flex';
    mainMenuOverlay.style.display = 'none';
    prodNameIn.focus();
};

closeProdBtn.onclick = () => {
    productOverlay.style.display = 'none';
    // Se estava editando (tem ID), não abre o menu, apenas fecha (volta pro estoque)
    // Se estava criando (sem ID), volta pro menu
    if (!prodIdIn.value) {
        openMainMenu();
    }
};
saveProdBtn.onclick = saveProduct;

cashBtn.onclick = () => { cashOverlay.style.display = 'flex'; cashAmountIn.focus(); setCashMessage('', false); mainMenuOverlay.style.display = 'none'; };
closeCashBtn.onclick = () => { cashOverlay.style.display = 'none'; openMainMenu(); };
saveCashBtn.onclick = saveCashMovement;

returnBtn.onclick = () => {
    returnOverlay.style.display = 'flex';
    returnOrderIdIn.value = '';
    setReturnMessage('', false);
    returnOrderIdIn.focus();
    mainMenuOverlay.style.display = 'none';
};
closeReturnBtn.onclick = () => { returnOverlay.style.display = 'none'; openMainMenu(); };
returnOrderIdIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchReturnOrder(); });

searchReturnBtn.onclick = searchReturnOrder;
cancelReturnItemsBtn.onclick = () => { returnItemsOverlay.style.display = 'none'; returnOverlay.style.display = 'flex'; };
confirmReturnBtn.onclick = confirmReturn;

zBtn.onclick = () => { showZReport(); mainMenuOverlay.style.display = 'none'; };
closeZBtn.onclick = () => { zOverlay.style.display = 'none'; openMainMenu(); };
printZBtn.onclick = printZReport;

closeHelpBtn.onclick = () => { helpOverlay.style.display = 'none'; searchInput.focus(); };

closeStockBtn.onclick = () => { stockOverlay.style.display = 'none'; currentStockProduct = null; searchInput.focus(); };
confirmReplenishBtn.onclick = confirmReplenish;
editProdBtn.onclick = openEditProduct;
printLabelBtn.onclick = printProductLabel;
deleteProdBtn.onclick = deleteProduct;

// --- LISTENERS DE NAVEGAÇÃO (FORMULÁRIOS) ---

// Reposição de Estoque
replenishQtyIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmReplenish(); });

// Desconto
discountInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyDiscount(); });

// Movimentação de Caixa
cashAmountIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') cashReasonIn.focus(); });
cashReasonIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveCashMovement(); });

// Cadastro de Produto
prodNameIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') prodPriceIn.focus(); });
prodPriceIn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (prodStockIn.disabled) prodEanIn.focus(); // Pula estoque se estiver editando
        else prodStockIn.focus();
    }
});
prodStockIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') prodEanIn.focus(); });
prodEanIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveProduct(); });

// Cadastro de Cliente
custNameIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') custPhoneIn.focus(); });
custPhoneIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') custCpfIn.focus(); });
custCpfIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') custEmailIn.focus(); });
custEmailIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveCustomer(); });

// Pagar Dívida
closePayDebtBtn.onclick = () => { payDebtOverlay.style.display = 'none'; showCustomers(); };
confirmPayDebtBtn.onclick = confirmPayDebt;
payDebtInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmPayDebt(); });

// --- MÁSCARAS DE ENTRADA ---

custCpfIn.addEventListener('input', (e) => {
    e.target.value = formatCPF(e.target.value);
});

custPhoneIn.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
});

// Listener Global de Teclado (Unificado e Hierárquico)
// Helper para Focus Trap e Navegação Padronizada
function handleFocusTrap(e, container, selector, keysPrev, keysNext) {
    // Encontra elementos focáveis visíveis
    const focusables = Array.from(container.querySelectorAll(selector)).filter(el => {
        return el.offsetParent !== null && !el.disabled;
    });

    if (focusables.length === 0) return false;

    const current = document.activeElement;
    const currentIndex = focusables.indexOf(current);

    const isNext = keysNext.includes(e.key) || (e.key === 'Tab' && !e.shiftKey);
    const isPrev = keysPrev.includes(e.key) || (e.key === 'Tab' && e.shiftKey);

    if (!isNext && !isPrev) return false;

    e.preventDefault();

    let nextIndex;
    if (isNext) {
        if (currentIndex === -1) nextIndex = 0;
        else nextIndex = (currentIndex + 1) % focusables.length;
    } else {
        if (currentIndex === -1) nextIndex = focusables.length - 1;
        else nextIndex = (currentIndex - 1 + focusables.length) % focusables.length;
    }

    const target = focusables[nextIndex];
    if (target) {
        target.focus();
        if (target.scrollIntoView) target.scrollIntoView({ block: 'nearest' });
    }
    return true;
}

// Listener Global de Teclado (Unificado e Hierárquico)
document.addEventListener('keydown', (e) => {

    // --- 1. MODAL DE CONFIRMAÇÃO ---
    if (confirmOverlay.style.display === 'flex') {
        if (e.key === 'Escape') { /* Deixa passar para o handler global de Escape */ }
        else {
            if (handleFocusTrap(e, confirmOverlay, 'button', ['ArrowLeft', 'ArrowUp'], ['ArrowRight', 'ArrowDown'])) return;
        }
    }

    // --- 2. MODAL DE DEVOLUÇÃO (Inputs) ---
    if (returnItemsOverlay.style.display === 'flex') {
        // Apenas Vertical para não atrapalhar cursor dentro do input (Esquerda/Direita)
        if (handleFocusTrap(e, returnTableBody, 'input', ['ArrowUp'], ['ArrowDown'])) return;
    }

    // --- 3. MENUS DE LISTA (Menu Principal, Clientes, Espera) ---
    if (mainMenuOverlay.style.display === 'flex') {
        if (handleFocusTrap(e, mainMenuOverlay, '.menu-btn', ['ArrowUp', 'ArrowLeft'], ['ArrowDown', 'ArrowRight'])) return;
    }
    if (parkedOverlay.style.display === 'flex') {
        if (handleFocusTrap(e, parkedList, '.parked-item', ['ArrowUp'], ['ArrowDown'])) return;
    }
    if (customersOverlay.style.display === 'flex') {
        if (handleFocusTrap(e, customersList, '.customer-item', ['ArrowUp'], ['ArrowDown'])) return;
    }

    // --- 4. ATALHOS GLOBAIS (F-Keys) ---

    if (e.key === 'F1') {
        e.preventDefault();
        finalizeOrder();
        return;
    }

    if (e.key === 'F12') {
        e.preventDefault();
        closeAllModals(['help-overlay']);
        helpOverlay.style.display = 'flex';
        return;
    }

    if (e.key === 'F2') {
        e.preventDefault();
        openMainMenu();
        return;
    }

    // --- 5. NAVEGAÇÃO LISTA PRINCIPAL (Fallback quando sem modais) ---
    // Permite navegar pelos produtos mesmo se o input de busca perder o foco
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (e.defaultPrevented) return; // Já tratado (ex: searchInput ou overlays acima)

        // Verifica se há algum overlay aberto para não mover a lista de fundo
        const overlays = [
            loginOverlay, helpOverlay, reportOverlay, dashboardOverlay, discountOverlay,
            parkedOverlay, customersOverlay, settingsOverlay, productOverlay,
            stockOverlay, cashOverlay, returnOverlay, zOverlay, mainMenuOverlay,
            confirmOverlay, customerFormOverlay, parkInputOverlay, returnItemsOverlay
        ];

        const isOverlayOpen = overlays.some(o => o && o.style.display === 'flex');

        if (!isOverlayOpen) {
            e.preventDefault();
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                if (selectedIndex < currentFiltered.length - 1) {
                    selectedIndex++;
                    renderProducts(currentFiltered);
                }
            } else {
                if (selectedIndex > 0) {
                    selectedIndex--;
                    renderProducts(currentFiltered);
                }
            }
            return;
        }
    }

    // --- 6. ESCAPE (Fechar Modais / Limpar Carrinho) ---
    if (e.key === 'Escape') {
        e.preventDefault();

        // 6.1 Modal de Confirmação (Prioridade Absoluta)
        if (confirmOverlay.style.display === 'flex') {
            confirmOverlay.style.display = 'none';
            if (resolveConfirm) resolveConfirm(false);
            return;
        }

        // 6.2 Sub-modais
        if (customerFormOverlay.style.display === 'flex') { customerFormOverlay.style.display = 'none'; return; }
        if (parkInputOverlay.style.display === 'flex') { parkInputOverlay.style.display = 'none'; return; }
        if (payDebtOverlay.style.display === 'flex') { payDebtOverlay.style.display = 'none'; showCustomers(); return; }
        if (returnItemsOverlay.style.display === 'flex') { returnItemsOverlay.style.display = 'none'; returnOverlay.style.display = 'flex'; returnOrderIdIn.focus(); return; }

        // 6.3 Modais de Funcionalidade
        const overlays = [
            helpOverlay, reportOverlay, dashboardOverlay, discountOverlay,
            parkedOverlay, customersOverlay, settingsOverlay, productOverlay,
            stockOverlay, cashOverlay, returnOverlay, zOverlay, mainMenuOverlay, auditOverlay
        ];

        for (let overlay of overlays) {
            if (overlay.style.display === 'flex') {
                overlay.style.display = 'none';
                if (overlay === stockOverlay) currentStockProduct = null;
                searchInput.focus();
                return;
            }
        }

        // 6.4 Limpeza do Carrinho (Só se nenhuma janela estiver aberta)
        clearCart();
    }
});

function setReturnMessage(msg, isError) {
    if (returnMsg) {
        returnMsg.innerText = msg;
        returnMsg.style.color = isError ? '#ff5555' : '#888';
    }
}

function setReturnItemsMessage(msg, isError) {
    if (returnItemsMsg) {
        returnItemsMsg.innerText = msg;
        returnItemsMsg.style.color = isError ? '#ff5555' : '#888';
    }
}

function setOverlayMessage(element, msg, isError) {
    if (element) {
        element.innerText = msg;
        element.style.color = isError ? 'var(--color-err-red)' : 'var(--color-neon-green-dim)';
    }
}

function showConfirm(message) {
    return new Promise((resolve) => {
        resolveConfirm = resolve;
        confirmText.innerText = message;
        confirmOverlay.style.display = 'flex';
        confirmNoBtn.focus(); // Foca no "NÃO" por segurança

        confirmYesBtn.onclick = () => {
            confirmOverlay.style.display = 'none';
            resolve(true);
        };

        confirmNoBtn.onclick = () => {
            confirmOverlay.style.display = 'none';
            resolve(false);
        };
    });
}

function formatCPF(v) {
    v = v.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
}

function formatPhone(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    return v;
}

init();
