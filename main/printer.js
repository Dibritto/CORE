const { BrowserWindow } = require('electron');

function printOrder(orderData) {
    return new Promise((resolve, reject) => {
        // Cria uma janela invisível para renderizar o cupom
        const win = new BrowserWindow({
            show: false,
            width: 300, // Largura aproximada para simular layout de bobina
            webPreferences: { nodeIntegration: true }
        });

        const htmlContent = generateReceiptHTML(orderData);

        // Carrega o HTML via data URL
        win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

        win.webContents.on('did-finish-load', () => {
            safePrint(win, resolve, reject);
        });
    });
}

function generateReceiptHTML(data) {
    const itemsHtml = data.items.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 3px;">
            <span style="flex: 1;">${item.quantity}x ${item.name.substring(0, 22)}</span>
            <span style="width: 70px; text-align: right;">R$ ${(item.price * item.quantity / 100).toFixed(2)}</span>
        </div>
    `).join('');

    let totalsHtml = '';
    if (data.discount > 0) {
        totalsHtml += `<div style="text-align: right; font-size: 12px; margin-top:5px;">SUBTOTAL: R$ ${((data.total + data.discount) / 100).toFixed(2)}</div>`;
        totalsHtml += `<div style="text-align: right; font-size: 12px;">DESCONTO: -R$ ${(data.discount / 100).toFixed(2)}</div>`;
    }

    const paymentLabel = data.paymentMethod === 'fiado' ? 'FIADO' : 'DINHEIRO';
    totalsHtml += `
        <div class="total">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span>TOTAL:</span>
                <span>R$ ${(data.total / 100).toFixed(2)}</span>
            </div>
            <div style="text-align: right; font-weight: normal; font-size: 11px; margin-top: 2px;">PAGAMENTO: ${paymentLabel}</div>
        </div>`;

    let customerHtml = '';
    if (data.customerName) {
        customerHtml = `<div style="font-size: 12px; margin-top: 5px; border-top: 1px dashed #000; padding-top: 8px;">CLIENTE: ${data.customerName}</div>`;
    }

    return `
    <html>
    <head>
        <title>Comprovante #${data.orderId}</title>
        <style>
            @page { margin: 0; }
            body { 
                font-family: 'Courier New', monospace; 
                width: 300px; 
                margin: 0; 
                padding: 10px; 
                background: #fff; 
                color: #000;
                overflow: hidden;
            }
            #receipt { width: 100%; padding: 5px; box-sizing: border-box; }
            .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .total { font-weight: bold; font-size: 18px; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px; }
            .footer { text-align: center; font-size: 11px; margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; }
            .items { margin-top: 10px; }
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
        </style>
    </head>
    <body>
        <div id="receipt">
            <div class="header">
                <h2 style="margin:0; font-size: 20px; text-transform: uppercase;">${data.storeName || 'CØRE PDV'}</h2>
                <div style="font-size: 10px; color: #555;">CØRE PDV v1.0.0</div>
                <div style="font-size: 14px; margin-top: 8px; font-weight: bold;">PEDIDO #${data.orderId}</div>
                <div style="font-size: 11px;">${data.date}</div>
                ${customerHtml}
            </div>
            <div class="items">
                ${itemsHtml}
            </div>
            ${totalsHtml}
            <div class="footer">OBRIGADO PELA PREFERÊNCIA!</div>
        </div>
    </body>
    </html>`;
}

function printZReport(data) {
    return new Promise((resolve, reject) => {
        const win = new BrowserWindow({ show: false, width: 300, webPreferences: { nodeIntegration: true } });

        const htmlContent = `
        <html>
        <head>
            <title>Fechamento Z - ${data.date}</title>
            <style>
                body { font-family: 'Courier New', monospace; width: 100%; margin: 0; padding: 0; color: #000; background: #fff; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
                .row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; }
                .total { font-weight: bold; font-size: 14px; border-top: 1px dashed #000; padding-top: 5px; margin-top: 10px; }
                .footer { text-align: center; font-size: 10px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2 style="margin:0;">FECHAMENTO (Z)</h2>
                <div style="font-size: 10px;">${data.date}</div>
            </div>
            <div class="row"><span>VENDAS DINHEIRO:</span> <span>+ R$ ${(data.salesCash / 100).toFixed(2)}</span></div>
            <div class="row"><span>VENDAS FIADO:</span> <span>(R$ ${(data.salesFiado / 100).toFixed(2)})</span></div>
            <div class="row"><span>SUPRIMENTOS:</span> <span>+ R$ ${(data.cashIn / 100).toFixed(2)}</span></div>
            <div class="row"><span>SANGRIAS:</span> <span>- R$ ${(data.cashOut / 100).toFixed(2)}</span></div>
            <div class="row total">
                <span>SALDO FINAL:</span>
                <span>R$ ${(data.finalBalance / 100).toFixed(2)}</span>
            </div>
            <div class="footer">--- FIM DO RELATÓRIO ---</div>
        </body>
        </html>`;

        win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

        win.webContents.on('did-finish-load', () => {
            safePrint(win, resolve, reject);
        });
    });
}

function printLabel(product) {
    return new Promise((resolve, reject) => {
        const win = new BrowserWindow({ show: false, width: 300, height: 200, webPreferences: { nodeIntegration: true } });

        const htmlContent = `
        <html>
        <head>
            <style>
                body { font-family: sans-serif; margin: 0; padding: 5px; text-align: center; border: 2px solid #000; height: 95vh; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; }
                .name { font-size: 16px; font-weight: bold; margin-bottom: 5px; line-height: 1.1; text-transform: uppercase; }
                .price { font-size: 32px; font-weight: bold; margin: 5px 0; }
                .ean { font-size: 12px; letter-spacing: 2px; margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class="name">${product.name}</div>
            <div class="price">R$ ${(product.price / 100).toFixed(2)}</div>
            <div class="ean">${product.ean || ''}</div>
        </body>
        </html>`;

        win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

        win.webContents.on('did-finish-load', () => {
            safePrint(win, resolve, reject);
        });
    });
}

// Helper para impressão segura em ambientes sem impressora (DEV)
async function safePrint(win, resolve, reject) {
    const logger = require('./logger');
    try {
        const printers = await win.webContents.getPrintersAsync();
        
        // Filtra para ver se tem impressora física (ignora as virtuais de PDF que criam os arquivos fantasmas)
        const physicalPrinters = printers.filter(p => 
            !p.name.toLowerCase().includes('pdf') && 
            !p.name.toLowerCase().includes('onemessage') &&
            !p.name.toLowerCase().includes('onenote') &&
            !p.name.toLowerCase().includes('xps')
        );

        if (physicalPrinters.length === 0) {
            logger.info("[PRINTER] Nenhuma impressora física detectada. Pulando impressão silenciosa para evitar arquivos fantasmas.");
            resolve(true);
            setTimeout(() => win.close(), 500);
            return;
        }

        win.webContents.print({ silent: true, printBackground: true }, (success, errorType) => {
            if (!success) {
                logger.error(`[PRINTER] Falha na impressão física: ${errorType}`);
                reject(errorType);
            } else {
                logger.info("[PRINTER] Impressão física enviada com sucesso.");
                resolve(true);
            }
            setTimeout(() => win.close(), 500);
        });
    } catch (err) {
        logger.error(`[PRINTER] Erro no processo de impressão física: ${err.message}`);
        resolve(true);
        setTimeout(() => win.close(), 500);
    }
}

async function shareOrderWhatsApp(payload) {
    const logger = require('./logger');
    const path = require('path');
    const fs = require('fs');
    const { app, BrowserWindow, clipboard, shell } = require('electron');
    
    const data = payload.orderData || payload;
    const mode = payload.mode || 'text';
    
    logger.info(`[PRINTER] Gerando arquivos de comprovante #${data.orderId}`);

    return new Promise((resolve, reject) => {
        const win = new BrowserWindow({
            show: true, opacity: 0, width: 310, height: 800, frame: false,
            focusable: false, skipTaskbar: true,
            webPreferences: { nodeIntegration: true }
        });

        const htmlContent = generateReceiptHTML(data);
        win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

        win.webContents.once('did-finish-load', async () => {
            try {
                await new Promise(r => setTimeout(r, 1200));

                let h = 600; 
                try {
                    h = await win.webContents.executeJavaScript(`
                        (() => {
                            const el = document.getElementById('receipt');
                            return el ? Math.ceil(el.getBoundingClientRect().height) : 600;
                        })()
                    `);
                } catch (e) {}

                const finalHeight = h + 100; 
                win.setSize(350, finalHeight);
                
                const desktopPath = app.getPath('desktop');
                const receiptsFolder = path.join(desktopPath, 'CØRE Recibos');
                if (!fs.existsSync(receiptsFolder)) fs.mkdirSync(receiptsFolder, { recursive: true });

                const dateObj = new Date();
                const timeClean = `${dateObj.getHours()}-${dateObj.getMinutes()}-${dateObj.getSeconds()}`;
                const dateClean = data.date.split(',')[0].replace(/\//g, '-').trim();
                
                const baseName = `Pedido_${data.orderId}_${dateClean}_${timeClean}`;
                const pngPath = path.join(receiptsFolder, `${baseName}.png`);
                const pdfPath = path.join(receiptsFolder, `${baseName}.pdf`);

                const image = await win.webContents.capturePage();
                const pngBuffer = image.toPNG();
                fs.writeFileSync(pngPath, pngBuffer);

                // GERA PDF A PARTIR DA IMAGEM com espera de carregamento estendida
                const pdfWin = new BrowserWindow({ show: false, width: 400, height: finalHeight + 200 });
                const imgBase64 = pngBuffer.toString('base64');
                const pdfHtml = `
                    <html>
                    <body style="margin:0; padding:40px; background: white;">
                        <img src="data:image/png;base64,${imgBase64}" style="width: 300px; display: block; border: 1px solid #eee;">
                    </body>
                    </html>`;
                
                await pdfWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(pdfHtml)}`);
                
                // Delay estendido para garantir renderização de imagem pesada
                await new Promise(r => setTimeout(r, 1500));

                const pdfBuffer = await pdfWin.webContents.printToPDF({
                    marginsType: 0,
                    printBackground: true,
                    pageSize: 'A4',
                    landscape: false
                });
                fs.writeFileSync(pdfPath, pdfBuffer);
                pdfWin.destroy();
                
                logger.info(`[PRINTER] Cupom #${data.orderId} finalizado com sucesso total.`);
                shell.showItemInFolder(pngPath);

                // Ação final com TEXTO DETALHADO
                if (mode === 'text' || mode === 'save-only') {
                    let textMsg = `*COMPROVANTE DE VENDA - ${data.storeName || 'CØRE'}*\n`;
                    textMsg += `Pedido #${data.orderId} - ${data.date}\n\n`;
                    
                    if (data.customerName) textMsg += `Cliente: ${data.customerName}\n`;
                    
                    textMsg += `\n*ITENS:*\n`;
                    data.items.forEach(i => {
                        textMsg += `• ${i.quantity}x ${i.name} = R$ ${(i.price * i.quantity / 100).toFixed(2)}\n`;
                    });

                    if (data.discount > 0) {
                        textMsg += `\nSubtotal: R$ ${((data.total + data.discount) / 100).toFixed(2)}`;
                        textMsg += `\nDesconto: -R$ ${(data.discount / 100).toFixed(2)}`;
                    }

                    const paymentLabel = data.paymentMethod === 'fiado' ? 'FIADO' : 'DINHEIRO';
                    textMsg += `\n*TOTAL: R$ ${(data.total / 100).toFixed(2)}*`;
                    textMsg += `\n_(Pagamento: ${paymentLabel})_`;
                    textMsg += `\n\n_Obrigado pela preferência!_`;
                    
                    if (mode === 'text') {
                        shell.openExternal(`https://wa.me/?text=${encodeURIComponent(textMsg)}`);
                    }
                } else if (mode === 'image') {
                    clipboard.writeImage(image);
                    shell.openExternal('https://wa.me/');
                } else if (mode === 'pdf') {
                    shell.openPath(pdfPath);
                    shell.openExternal('https://wa.me/');
                }
                
                if (!win.isDestroyed()) win.destroy();
                resolve({ success: true });
            } catch (err) {
                logger.error(`[PRINTER] Erro no Layout: ${err.message}`);
                if (!win.isDestroyed()) win.destroy();
                reject(err);
            }
        });

        win.webContents.on('did-fail-load', (e, code, desc) => {
            logger.error(`[PRINTER] Falha did-fail-load: ${desc}`);
            if (!win.isDestroyed()) win.destroy();
            reject(new Error(desc));
        });
    });
}

async function shareZOrderWhatsApp(data) {
    const { shell } = require('electron');
    let text = `*FECHAMENTO DE CAIXA (Z) - ${data.storeName || 'CØRE PDV'}*\n`;
    text += `Data: ${data.date}\n\n`;
    text += `VENDAS DINHEIRO: + R$ ${(data.salesCash / 100).toFixed(2)}\n`;
    text += `VENDAS FIADO: R$ ${(data.salesFiado / 100).toFixed(2)}\n`;
    text += `SUPRIMENTOS: + R$ ${(data.cashIn / 100).toFixed(2)}\n`;
    text += `SANGRIAS: - R$ ${(data.cashOut / 100).toFixed(2)}\n\n`;
    text += `*SALDO FINAL: R$ ${(data.finalBalance / 100).toFixed(2)}*\n\n`;
    text += `_Gerado por CØRE PDV v1.0.0_`;

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/?text=${encodedText}`;
    shell.openExternal(url);
    return { success: true };
}

module.exports = { printOrder, printZReport, printLabel, shareOrderWhatsApp, shareZOrderWhatsApp };