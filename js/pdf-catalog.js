/**
 * CatalogSmith - PDF Lookbook & Share Engine
 * Phone-first, zero-backend PDF generation, printable lookbook, and mobile sharing.
 */

(function () {
  'use strict';

  function getCurrencySymbol(code) {
    if (!code) return '₦';
    const map = {
      NGN: '₦', USD: '$', EUR: '€', GBP: '£',
      KES: 'KSh ', GHS: 'GH₵ ', ZAR: 'R ', CAD: '$', AUD: '$'
    };
    return map[code.toUpperCase()] || (code + ' ');
  }

  function formatPrice(amount, currency) {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return 'Ask for price';
    }
    return getCurrencySymbol(currency) + Number(amount).toLocaleString();
  }

  function buildWaUrl(phone, text) {
    const clean = String(phone || '').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text);
    return clean ? `https://wa.me/${clean}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Generate Lookbook HTML
  function createLookbookHTML(data) {
    const vendorName = data.vendor_name || 'Vendor Catalog';
    const vendorPhone = data.vendor_phone || '';
    const currency = data.currency_default || 'NGN';
    const tagline = data.tagline || 'Direct Orders via WhatsApp';
    const products = Array.isArray(data.products) ? data.products : [];
    const theme = data.theme || 'emerald';

    // Theme color palettes
    const themeColors = {
      'emerald': { primary: '#047857', accent: '#10b981', bg: '#f8fafc', cardBg: '#ffffff', border: '#e2e8f0', wa: '#25D366' },
      'luxury-gold': { primary: '#b45309', accent: '#d97706', bg: '#fffdfa', cardBg: '#ffffff', border: '#fde68a', wa: '#d97706' },
      'sunset': { primary: '#c2410c', accent: '#ea580c', bg: '#fffbf5', cardBg: '#ffffff', border: '#fed7aa', wa: '#ea580c' },
      'tech-blue': { primary: '#0369a1', accent: '#0284c7', bg: '#f0f9ff', cardBg: '#ffffff', border: '#bae6fd', wa: '#0284c7' },
      'blush': { primary: '#be123c', accent: '#e11d48', bg: '#fff1f2', cardBg: '#ffffff', border: '#fecdd3', wa: '#e11d48' },
      'minimal': { primary: '#18181b', accent: '#27272a', bg: '#fafafa', cardBg: '#ffffff', border: '#e4e4e7', wa: '#27272a' }
    };

    const palette = themeColors[theme] || themeColors['emerald'];
    const issueDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(vendorName)} - Product Catalog PDF</title>
  <style>
    :root {
      --color-primary: ${palette.primary};
      --color-accent: ${palette.accent};
      --color-bg: ${palette.bg};
      --color-card: ${palette.cardBg};
      --color-border: ${palette.border};
      --color-wa: ${palette.wa};
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--color-bg);
      color: #0f172a;
      line-height: 1.45;
      padding: 20px;
    }

    /* Floating No-Print Toolbar */
    .lookbook-toolbar {
      position: sticky;
      top: 12px;
      z-index: 1000;
      max-width: 860px;
      margin: 0 auto 20px auto;
      padding: 12px 18px;
      background: rgba(15, 23, 42, 0.94);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
      color: #ffffff;
    }

    .toolbar-title {
      font-size: 0.875rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .toolbar-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .btn-print {
      background-color: #10b981;
      color: #ffffff;
    }
    .btn-print:hover { background-color: #059669; }

    .btn-share {
      background-color: #25D366;
      color: #ffffff;
    }
    .btn-share:hover { background-color: #1ebc59; }

    .btn-close {
      background-color: rgba(255, 255, 255, 0.15);
      color: #ffffff;
    }
    .btn-close:hover { background-color: rgba(255, 255, 255, 0.25); }

    /* Printable Catalog Sheet */
    .lookbook-container {
      max-width: 860px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px 36px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid var(--color-border);
    }

    /* Catalog Header */
    .catalog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding-bottom: 24px;
      border-bottom: 2px solid var(--color-border);
      margin-bottom: 28px;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .vendor-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 800;
      flex-shrink: 0;
    }

    .vendor-name {
      font-size: 1.625rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .vendor-tagline {
      font-size: 0.9375rem;
      color: #475569;
      margin-top: 2px;
    }

    .contact-box {
      text-align: right;
    }

    .wa-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: rgba(37, 211, 102, 0.12);
      color: #047857;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 700;
      text-decoration: none;
    }

    .meta-line {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 6px;
    }

    /* Product Grid */
    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @media (max-width: 600px) {
      .catalog-grid {
        grid-template-columns: 1fr;
      }
    }

    .product-card {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .product-image-box {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      background-color: #f1f5f9;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .product-image-empty {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 0.8125rem;
      background: #f8fafc;
    }

    .category-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(15, 23, 42, 0.75);
      color: #ffffff;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 9999px;
    }

    .product-info {
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-title {
      font-size: 1.0625rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      margin-bottom: 4px;
    }

    .product-desc {
      font-size: 0.8125rem;
      color: #475569;
      line-height: 1.4;
      margin-bottom: 12px;
      flex: 1;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: auto;
      padding-top: 10px;
      border-top: 1px dashed var(--color-border);
    }

    .product-price {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-primary);
    }

    .btn-order-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: var(--color-wa);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }

    /* Catalog Footer */
    .catalog-footer {
      margin-top: 32px;
      padding-top: 18px;
      border-top: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
    }

    /* Print Specific Styling */
    @media print {
      body {
        background-color: #ffffff !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
      .lookbook-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      @page {
        size: A4 portrait;
        margin: 12mm 10mm;
      }
      .product-card {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        border: 1px solid #cbd5e1 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Floating Toolbar (Excluded from print) -->
  <div class="lookbook-toolbar no-print">
    <div class="toolbar-title">
      <span>📄</span>
      <span>${escapeHtml(vendorName)} - PDF Catalog</span>
    </div>
    <div class="toolbar-actions">
      <button class="toolbar-btn btn-print" onclick="window.print()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        <span>Save as PDF / Print</span>
      </button>
      <button class="toolbar-btn btn-share" onclick="shareCatalogNow()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span>Share Catalog</span>
      </button>
      <button class="toolbar-btn btn-close" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <!-- Printable Lookbook Sheet -->
  <div class="lookbook-container">
    <header class="catalog-header">
      <div class="brand-section">
        <div class="vendor-avatar">${escapeHtml(vendorName.trim().charAt(0).toUpperCase() || 'S')}</div>
        <div>
          <h1 class="vendor-name">${escapeHtml(vendorName)}</h1>
          <p class="vendor-tagline">${escapeHtml(tagline)}</p>
        </div>
      </div>
      <div class="contact-box">
        <a href="${buildWaUrl(vendorPhone, `Hello ${vendorName}! I am viewing your PDF product catalog and would like to order.`)}" target="_blank" class="wa-badge">
          <span>💬 Order on WhatsApp: ${escapeHtml(vendorPhone || 'Chat')}</span>
        </a>
        <div class="meta-line">Issue: ${issueDate} &bull; ${products.length} Products Listed</div>
      </div>
    </header>

    <main class="catalog-grid">
      ${products.map(p => {
        const hasPrice = p.price && p.price.amount !== null && !isNaN(p.price.amount);
        const priceStr = hasPrice ? formatPrice(p.price.amount, p.price.currency || currency) : 'Ask for price';
        const orderMsg = hasPrice
          ? `Hello ${vendorName}! I would like to order *${p.name}* (${priceStr}) from your PDF catalog.`
          : `Hello ${vendorName}! What is the price and availability for *${p.name}* from your PDF catalog?`;
        const orderUrl = buildWaUrl(vendorPhone, orderMsg);

        return `
        <article class="product-card">
          <div class="product-image-box">
            ${p.category ? `<span class="category-badge">${escapeHtml(p.category)}</span>` : ''}
            ${p.image ? `<img src="${p.image}" class="product-image" alt="${escapeHtml(p.name)}">` : `<div class="product-image-empty"><span>No Photo</span></div>`}
          </div>
          <div class="product-info">
            <h2 class="product-title">${escapeHtml(p.name)}</h2>
            <p class="product-desc">${escapeHtml(p.description || '')}</p>
            <div class="product-footer">
              <span class="product-price">${priceStr}</span>
              <a href="${orderUrl}" target="_blank" class="btn-order-link">Order on WhatsApp &rarr;</a>
            </div>
          </div>
        </article>`;
      }).join('\n')}
    </main>

    <footer class="catalog-footer">
      <span>Official WhatsApp Product Catalog &bull; Direct Vendor Checkout</span>
      <span>Powered by CatalogSmith</span>
    </footer>
  </div>

  <script>
    function shareCatalogNow() {
      if (navigator.share) {
        navigator.share({
          title: "${escapeHtml(vendorName)} - Product Catalog",
          text: "Browse our official product catalog (${products.length} items) and order directly on WhatsApp!",
          url: window.location.href
        }).catch(function() {});
      } else {
        const text = encodeURIComponent("Hello! Check out our product catalog from ${escapeHtml(vendorName)}: " + window.location.href);
        window.open("https://wa.me/?text=" + text, "_blank");
      }
    }
  </script>
</body>
</html>`;
  }

  // Open Printable Lookbook in new tab/window and trigger print
  function openPrintableLookbook(data) {
    const html = createLookbookHTML(data);
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
      // Auto-trigger print dialog after render
      setTimeout(() => {
        try {
          win.print();
        } catch (e) {
          console.warn('Auto print was blocked:', e);
        }
      }, 500);
    } else {
      // If popup blocker intervened, create a downloadable HTML lookbook
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const filename = `${(data.vendor_name || 'store').toLowerCase().replace(/[^a-z0-9]/g, '-')}-catalog-lookbook.html`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Direct Binary PDF Generation (Client-Side, Pure JS, 0 dependencies)
  async function generateCatalogPDFBlob(data) {
    const vendorName = data.vendor_name || 'Vendor Catalog';
    const vendorPhone = data.vendor_phone || '';
    const currency = data.currency_default || 'NGN';
    const products = Array.isArray(data.products) ? data.products : [];

    // Render pages onto high-res canvas (1240 x 1754 px at 150 DPI A4)
    const pageW = 1240;
    const pageH = 1754;
    const itemsPerPage = 4;
    const pageCount = Math.max(1, Math.ceil(products.length / itemsPerPage));
    const pageBlobs = [];

    for (let pIdx = 0; pIdx < pageCount; pIdx++) {
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = pageW;
      pageCanvas.height = pageH;
      const ctx = pageCanvas.getContext('2d');

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageW, pageH);

      // Header Banner
      const grad = ctx.createLinearGradient(0, 0, pageW, 0);
      grad.addColorStop(0, '#047857');
      grad.addColorStop(1, '#10b981');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, pageW, 140);

      // Header text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px -apple-system, sans-serif';
      ctx.fillText(vendorName.slice(0, 32), 60, 75);

      ctx.font = '22px -apple-system, sans-serif';
      ctx.fillText((data.tagline || 'Direct Orders via WhatsApp') + ' • WhatsApp: ' + (vendorPhone || 'Chat'), 60, 115);

      // Page Meta
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`PAGE ${pIdx + 1} OF ${pageCount}`, pageW - 60, 80);
      ctx.fillText(`${products.length} PRODUCTS`, pageW - 60, 110);
      ctx.textAlign = 'left';

      // 4 Products Grid (2x2)
      const pageItems = products.slice(pIdx * itemsPerPage, (pIdx + 1) * itemsPerPage);
      const cols = 2;
      const cardW = 540;
      const cardH = 720;
      const startX = 60;
      const startY = 180;
      const gapX = 40;
      const gapY = 40;

      for (let i = 0; i < pageItems.length; i++) {
        const prod = pageItems[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cardW + gapX);
        const y = startY + row * (cardH + gapY);

        // Card Container
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 20);
        ctx.fill();
        ctx.stroke();

        // Product Image Area
        const imgW = cardW - 32;
        const imgH = 400;
        const imgX = x + 16;
        const imgY = y + 16;

        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, 14);
        ctx.fill();

        // Draw image if available
        if (prod.image) {
          try {
            await new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(imgX, imgY, imgW, imgH, 14);
                ctx.clip();
                ctx.drawImage(img, imgX, imgY, imgW, imgH);
                ctx.restore();
                resolve();
              };
              img.onerror = resolve;
              img.src = prod.image;
            });
          } catch (e) {}
        } else {
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('NO PRODUCT PHOTO', imgX + imgW / 2, imgY + imgH / 2);
          ctx.textAlign = 'left';
        }

        // Category Tag
        if (prod.category) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.beginPath();
          ctx.roundRect(imgX + 16, imgY + 16, 160, 34, 17);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(prod.category.toUpperCase().slice(0, 16), imgX + 28, imgY + 39);
        }

        // Product Name
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 28px -apple-system, sans-serif';
        const nameTxt = prod.name.length > 28 ? prod.name.slice(0, 26) + '...' : prod.name;
        ctx.fillText(nameTxt, x + 20, y + 460);

        // Product Description
        ctx.fillStyle = '#64748b';
        ctx.font = '19px -apple-system, sans-serif';
        const descTxt = (prod.description || 'Verified vendor item').slice(0, 48);
        ctx.fillText(descTxt, x + 20, y + 500);

        // Price
        const hasPrice = prod.price && prod.price.amount !== null && !isNaN(prod.price.amount);
        const priceTxt = hasPrice ? formatPrice(prod.price.amount, prod.price.currency || currency) : 'Ask for Price';
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 36px -apple-system, sans-serif';
        ctx.fillText(priceTxt, x + 20, y + 570);

        // Order WhatsApp Button
        ctx.fillStyle = '#25D366';
        ctx.beginPath();
        ctx.roundRect(x + 20, y + 610, cardW - 40, 60, 12);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💬 ORDER ON WHATSAPP', x + cardW / 2, y + 648);
        ctx.textAlign = 'left';
      }

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '16px -apple-system, sans-serif';
      ctx.fillText('Catalog generated by CatalogSmith • Direct Mobile WhatsApp Storefront', 60, pageH - 40);

      const jpegDataUrl = pageCanvas.toDataURL('image/jpeg', 0.85);
      pageBlobs.push(jpegDataUrl);
    }

    // Assemble Multi-page PDF 1.4 Binary
    return assemblePdfFromJpegPages(pageBlobs);
  }

  // Pure Client-side PDF-1.4 binary assembler
  function assemblePdfFromJpegPages(jpegDataUrls) {
    const ptWidth = 595.28;
    const ptHeight = 841.89;
    const objOffsets = [];
    let binaryParts = [];
    let currentByteLength = 0;

    function writeString(str) {
      const bytes = new TextEncoder().encode(str);
      binaryParts.push(bytes);
      currentByteLength += bytes.length;
    }

    function writeBinary(uint8) {
      binaryParts.push(uint8);
      currentByteLength += uint8.length;
    }

    // 1. PDF Header
    writeString('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    const totalPages = jpegDataUrls.length;
    let nextObj = 1;

    const catalogObj = nextObj++;
    const pagesObj = nextObj++;

    const pageObjNums = [];
    const imageObjNums = [];
    const contentObjNums = [];

    for (let i = 0; i < totalPages; i++) {
      pageObjNums.push(nextObj++);
      imageObjNums.push(nextObj++);
      contentObjNums.push(nextObj++);
    }

    // Obj 1: Catalog
    objOffsets[catalogObj] = currentByteLength;
    writeString(`${catalogObj} 0 obj\n<< /Type /Catalog /Pages ${pagesObj} 0 R >>\nendobj\n`);

    // Obj 2: Pages
    objOffsets[pagesObj] = currentByteLength;
    const kidsStr = pageObjNums.map(n => `${n} 0 R`).join(' ');
    writeString(`${pagesObj} 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${totalPages} >>\nendobj\n`);

    // Per Page Objects
    for (let i = 0; i < totalPages; i++) {
      const pNum = pageObjNums[i];
      const imgNum = imageObjNums[i];
      const cNum = contentObjNums[i];
      const dataUrl = jpegDataUrls[i];

      // Decode base64 JPEG to binary
      const b64 = dataUrl.split(',')[1];
      const binStr = atob(b64);
      const imgBytes = new Uint8Array(binStr.length);
      for (let b = 0; b < binStr.length; b++) {
        imgBytes[b] = binStr.charCodeAt(b);
      }

      // Page Object
      objOffsets[pNum] = currentByteLength;
      writeString(`${pNum} 0 obj\n<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${ptWidth} ${ptHeight}] /Resources << /XObject << /Im${i + 1} ${imgNum} 0 R >> >> /Contents ${cNum} 0 R >>\nendobj\n`);

      // Image XObject (JPEG DCT stream)
      objOffsets[imgNum] = currentByteLength;
      writeString(`${imgNum} 0 obj\n<< /Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`);
      writeBinary(imgBytes);
      writeString('\nendstream\nendobj\n');

      // Content Stream (Draws image scaled to full A4 page)
      objOffsets[cNum] = currentByteLength;
      const contentCmd = `q ${ptWidth.toFixed(2)} 0 0 ${ptHeight.toFixed(2)} 0 0 cm /Im${i + 1} Do Q\n`;
      const cBytes = new TextEncoder().encode(contentCmd);
      writeString(`${cNum} 0 obj\n<< /Length ${cBytes.length} >>\nstream\n${contentCmd}endstream\nendobj\n`);
    }

    // XREF Table
    const startXref = currentByteLength;
    writeString(`xref\n0 ${nextObj}\n0000000000 65535 f \n`);
    for (let i = 1; i < nextObj; i++) {
      const offset = String(objOffsets[i]).padStart(10, '0');
      writeString(`${offset} 00000 n \n`);
    }

    // Trailer
    writeString(`trailer\n<< /Size ${nextObj} /Root ${catalogObj} 0 R >>\nstartxref\n${startXref}\n%%EOF\n`);

    return new Blob(binaryParts, { type: 'application/pdf' });
  }

  // Trigger Download
  async function downloadCatalogPDF(data) {
    const filename = `catalogsmith-${(data.vendor_name || 'store').toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
    try {
      const blob = await generateCatalogPDFBlob(data);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (err) {
      console.warn('Binary PDF generation fallback to lookbook:', err);
      openPrintableLookbook(data);
      return false;
    }
  }

  // Share Catalog via Web Share or WhatsApp
  async function shareCatalog(data) {
    if (window.CatalogStore && window.CatalogStore.openShareModal) {
      window.CatalogStore.openShareModal(data);
      return;
    }

    const vendorName = data.name || data.vendor_name || 'Vendor Catalog';
    const products = Array.isArray(data.products) ? data.products : [];
    const shareUrl = window.CatalogStore ? window.CatalogStore.getSharableUrl(data) : window.location.href;
    const shareText = `🛍️ *${vendorName} - Product Catalog*\n${data.tagline || 'Direct orders via WhatsApp'}\n\nBrowse ${products.length} verified products and order directly on WhatsApp!\nPhone: ${data.vendor_phone || data.phone || 'Direct Chat'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vendorName} - Product Catalog`,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (e) {}
    }

    // Fallback: Open WhatsApp directly
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    window.open(waUrl, '_blank');
  }

  // Expose Global
  window.CatalogSmithPDF = {
    createLookbookHTML,
    openPrintableLookbook,
    generateCatalogPDFBlob,
    downloadCatalogPDF,
    shareCatalog
  };
})();
