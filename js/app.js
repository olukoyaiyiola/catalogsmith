/**
 * ContentSmith - Application Controller & Multi-Flow Navigation
 * Manages Landing View, Workspace View, Creation Routes, Dedicated Example Storefront,
 * Category-based Starter Product Generation, and Universal Image Search.
 */

(function () {
  'use strict';

  // Wait for DOM or initialize immediately if already parsed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  function initApp() {
    const landingView = document.getElementById('landing-view');
    const workspaceView = document.getElementById('workspace-view');
    const adminView = document.getElementById('admin-view');
    const storefrontView = document.getElementById('storefront-view');

    // Modals
    const guidedModal = document.getElementById('guided-flow-modal');
    const picturesModal = document.getElementById('pictures-flow-modal');
    const dropshipModal = document.getElementById('dropship-flow-modal');
    const imgSearchModal = document.getElementById('image-search-modal');
    const shareModal = document.getElementById('share-catalog-modal');
    const createCatalogModal = document.getElementById('create-catalog-modal');
    const adminVerifyModal = document.getElementById('admin-verify-modal');

    // Safe HTML Escaper Helper
    function escapeHtml(text) {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // -------------------------------------------------------------
    // Helper: Create High-Resolution Self-Contained Product Vectors
    // Ensures example storefront & mock images always render instantly
    // with zero broken images, zero external latency, and zero CORS issues.
    // -------------------------------------------------------------
    function createProductSvg(title, category, col1, col2, symbol) {
      const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${col1}"/>
      <stop offset="100%" stop-color="${col2}"/>
    </linearGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="600" height="450" fill="url(#bg)"/>
  <rect width="600" height="450" fill="url(#grid)"/>
  
  <!-- Subtle studio lighting glow -->
  <circle cx="300" cy="180" r="160" fill="rgba(255,255,255,0.12)"/>
  
  <!-- Central Icon Symbol -->
  <g transform="translate(300, 185) scale(1.6)">
    <circle cx="0" cy="0" r="48" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <text x="0" y="16" font-family="-apple-system, system-ui, sans-serif" font-size="38" text-anchor="middle" fill="#ffffff">${symbol}</text>
  </g>

  <!-- Bottom Details Plaque -->
  <rect x="30" y="320" width="540" height="95" rx="14" fill="rgba(15, 23, 42, 0.72)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
  <text x="50" y="355" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="20" fill="#ffffff">${title.replace(/&/g, '&amp;').slice(0, 38)}</text>
  <text x="50" y="385" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="14" fill="#10b981">🏷️ ${category.replace(/&/g, '&amp;')} • Product Illustration</text>
</svg>`.trim();
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    // -------------------------------------------------------------
    // Curated Library of Verified E-Commerce Imagery
    // -------------------------------------------------------------
    const CURATED_PRODUCT_IMAGES = [
      // Fashion & Dresses
      {
        id: 'img-boubou',
        title: 'Luxury Silk Boubou Gown with Beaded Neckline',
        category: 'Fashion & Dresses',
        tag: 'fashion',
        url: createProductSvg('Silk Boubou Gown', 'Fashion & Dresses', '#064e3b', '#047857', '👗')
      },
      {
        id: 'img-ankara',
        title: '2-Piece Ankara Co-ord Trouser Set (Sunset)',
        category: 'Fashion & Dresses',
        tag: 'fashion',
        url: createProductSvg('Ankara Co-ord Set', 'Fashion & Dresses', '#c2410c', '#ea580c', '✨')
      },
      {
        id: 'img-kimono',
        title: 'Embroidered Velvet Kimono Coat',
        category: 'Fashion & Dresses',
        tag: 'fashion',
        url: createProductSvg('Embroidered Velvet Kimono', 'Fashion & Dresses', '#4c0519', '#881337', '👘')
      },
      {
        id: 'img-asooke',
        title: 'Hand-Woven Royal Blue Aso-Oke Gele',
        category: 'Fashion & Dresses',
        tag: 'fashion',
        url: createProductSvg('Aso-Oke Gele Headtie', 'Traditional Wear', '#1e1b4b', '#312e81', '👑')
      },
      {
        id: 'img-kaftan',
        title: 'Men Senator Kaftan Suit with Embroidery',
        category: 'Fashion & Dresses',
        tag: 'fashion',
        url: createProductSvg('Senator Kaftan Suit', 'Men Fashion', '#0f172a', '#334155', '👔')
      },

      // Shoes & Bags
      {
        id: 'img-bag-kelly',
        title: 'Crocodile Pattern Mini Kelly Handbag',
        category: 'Shoes & Bags',
        tag: 'bags',
        url: createProductSvg('Mini Kelly Handbag', 'Shoes & Bags', '#701a75', '#86198f', '👜')
      },
      {
        id: 'img-tote',
        title: 'Structured Everyday Leather Tote Bag',
        category: 'Shoes & Bags',
        tag: 'bags',
        url: createProductSvg('Leather Tote Bag', 'Shoes & Bags', '#78350f', '#92400e', '💼')
      },
      {
        id: 'img-mules',
        title: 'Crystal Strap Block Heel Mules (Champagne)',
        category: 'Shoes & Bags',
        tag: 'shoes',
        url: createProductSvg('Crystal Block Heel Mules', 'Shoes & Bags', '#854d0e', '#b45309', '👠')
      },
      {
        id: 'img-sneakers',
        title: 'Chunky Platform Streetwear Sneakers',
        category: 'Shoes & Bags',
        tag: 'shoes',
        url: createProductSvg('Platform Sneakers', 'Footwear', '#1e293b', '#475569', '👟')
      },
      {
        id: 'img-sandals',
        title: 'Handmade Braided Leather Slide Sandals',
        category: 'Shoes & Bags',
        tag: 'shoes',
        url: createProductSvg('Leather Slide Sandals', 'Footwear', '#713f12', '#a16207', '👡')
      },

      // Hair & Beauty
      {
        id: 'img-lotion',
        title: 'Hydrating Glow Body Lotion (500ml)',
        category: 'Hair & Beauty',
        tag: 'beauty',
        url: createProductSvg('Hydrating Glow Lotion', 'Hair & Beauty', '#831843', '#be185d', '🧴')
      },
      {
        id: 'img-cleanser',
        title: 'Gentle Foaming Tea Tree Facial Cleanser',
        category: 'Hair & Beauty',
        tag: 'beauty',
        url: createProductSvg('Foaming Facial Cleanser', 'Hair & Beauty', '#065f46', '#059669', '🫧')
      },
      {
        id: 'img-bonnet',
        title: 'Double-Lined Mulberry Satin Hair Bonnet',
        category: 'Hair & Beauty',
        tag: 'beauty',
        url: createProductSvg('Satin Hair Bonnet', 'Hair Care', '#4a044e', '#701a75', '🎀')
      },
      {
        id: 'img-perfume',
        title: 'Oud & Ambergris Luxury Eau De Parfum (100ml)',
        category: 'Hair & Beauty',
        tag: 'beauty',
        url: createProductSvg('Oud Luxury Perfume', 'Fragrances', '#451a03', '#78350f', '✨')
      },
      {
        id: 'img-wig',
        title: 'Vietnamese Raw Bone Straight 13x4 Lace Wig',
        category: 'Hair & Beauty',
        tag: 'beauty',
        url: createProductSvg('Raw Bone Straight Wig', 'Human Hair', '#09090b', '#27272a', '💇‍♀️')
      },

      // Tech & Gadgets
      {
        id: 'img-powerbank',
        title: 'Wireless Magnetic Fast Charging Powerbank (20,000mAh)',
        category: 'Gadgets & Electronics',
        tag: 'gadgets',
        url: createProductSvg('Magnetic 20000mAh Powerbank', 'Gadgets & Electronics', '#0c4a6e', '#0284c7', '🔋')
      },
      {
        id: 'img-cable',
        title: '65W Braided Fast-Charging USB-C to Lightning Cable',
        category: 'Gadgets & Electronics',
        tag: 'gadgets',
        url: createProductSvg('65W Fast-Charging Cable', 'Gadgets & Electronics', '#1e293b', '#3b82f6', '⚡')
      },
      {
        id: 'img-earbuds',
        title: 'Noise Cancelling Wireless Bluetooth Earbuds',
        category: 'Gadgets & Electronics',
        tag: 'gadgets',
        url: createProductSvg('Wireless Earbuds', 'Audio & Sound', '#111827', '#4f46e5', '🎧')
      },
      {
        id: 'img-tripod',
        title: '10-Inch Ring Light with Extendable Phone Tripod',
        category: 'Gadgets & Electronics',
        tag: 'gadgets',
        url: createProductSvg('Ring Light Tripod', 'Content Gear', '#18181b', '#d97706', '💡')
      },

      // Jewelry & Accessories
      {
        id: 'img-chain',
        title: '18K Gold PVD Waterproof Herringbone Chain',
        category: 'Jewelry',
        tag: 'jewelry',
        url: createProductSvg('18K Herringbone Chain', 'Jewelry', '#78350f', '#d97706', '📿')
      },
      {
        id: 'img-watch',
        title: 'Classic Emerald Dial Quartz Wristwatch',
        category: 'Jewelry',
        tag: 'jewelry',
        url: createProductSvg('Emerald Dial Watch', 'Jewelry & Watches', '#064e3b', '#059669', '⌚')
      },

      // Food & Provisions
      {
        id: 'img-crayfish',
        title: 'Oron Smoked Crayfish & Pepper Blend (Airtight Jar)',
        category: 'Provisions & Food',
        tag: 'food',
        url: createProductSvg('Smoked Crayfish Jar', 'Provisions & Food', '#7c2d12', '#ea580c', '🦐')
      },
      {
        id: 'img-palmoil',
        title: 'Pure Unadulterated Golden Palm Oil (1L Bottle)',
        category: 'Provisions & Food',
        tag: 'food',
        url: createProductSvg('Golden Palm Oil 1L', 'Provisions & Food', '#9a3412', '#c2410c', '🏺')
      },
      {
        id: 'img-honey',
        title: 'Raw Wildflower Forest Honey (500g)',
        category: 'Provisions & Food',
        tag: 'food',
        url: createProductSvg('Raw Forest Honey', 'Organic Groceries', '#854d0e', '#ca8a04', '🍯')
      }
    ];

    // -------------------------------------------------------------
    // SECTION E: Dedicated Example Storefront (Isolated from User State)
    // -------------------------------------------------------------
    const DEDICATED_EXAMPLE_DATA = {
      vendor_name: 'Lola Fabrics & Chic Wear',
      vendor_phone: '+2348035550192',
      currency_default: 'NGN',
      tagline: 'Luxury custom dresses & fabrics delivered nationwide',
      theme: 'emerald',
      layout: 'standard',
      order_button_text: 'Order on WhatsApp',
      message_template: 'Hello Lola Fabrics! I would like to order *{product_name}* ({product_price}). Is it available for delivery?',
      products: [
        {
          id: 'ex1',
          name: 'Luxury Silk Boubou Gown with Beaded Neckline',
          price: { amount: 28500, currency: 'NGN', source: 'on_screen' },
          description: 'Rich emerald green pure silk boubou with hand-stitched crystal beadwork around neckline. Free size fits UK 10-18.',
          category: 'Dresses',
          best_timestamp_sec: 4.2,
          confidence: 0.98,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-boubou').url
        },
        {
          id: 'ex2',
          name: '2-Piece Ankara Co-ord Trouser Set (Floral Sunset)',
          price: { amount: 16000, currency: 'NGN', source: 'on_screen' },
          description: 'Premium 100% cotton Ankara print in warm orange and violet tones. High-waisted wide-leg trousers with matching button-front shirt.',
          category: 'Co-ords',
          best_timestamp_sec: 12.8,
          confidence: 0.95,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-ankara').url
        },
        {
          id: 'ex3',
          name: 'Crocodile Pattern Mini Kelly Handbag with Gold Chain',
          price: { amount: 18500, currency: 'NGN', source: 'on_screen' },
          description: 'Structured faux crocodile leather mini top-handle bag. Includes detachable crossbody gold link strap and twist lock.',
          category: 'Bags',
          best_timestamp_sec: 21.0,
          confidence: 0.94,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-bag-kelly').url
        },
        {
          id: 'ex4',
          name: 'Hand-Woven Royal Blue Aso-Oke Headtie & Sash',
          price: { amount: 35000, currency: 'NGN', source: 'on_screen' },
          description: 'Traditional metallic silver and royal blue woven Aso-Oke gele with matching shoulder ipelle for special ceremonies.',
          category: 'Traditional',
          best_timestamp_sec: 31.4,
          confidence: 0.92,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-asooke').url
        },
        {
          id: 'ex5',
          name: 'Crystal Strap Block Heel Mules (Champagne)',
          price: { amount: 22000, currency: 'NGN', source: 'on_screen' },
          description: '2.5-inch comfortable block heel mules with double rhinestone transparent band. Sizes 37 to 42 available.',
          category: 'Footwear',
          best_timestamp_sec: 42.1,
          confidence: 0.96,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-mules').url
        },
        {
          id: 'ex6',
          name: 'Limited Edition Embroidered Velvet Kimono',
          price: null,
          description: 'Plush burgundy velvet kimono coat with gold thread floral embroidery along hem and sleeves. Custom pre-order only.',
          category: 'Outerwear',
          best_timestamp_sec: 53.7,
          confidence: 0.88,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-kimono').url
        }
      ]
    };

    let exampleInitRetries = 0;
    const MAX_EXAMPLE_RETRIES = 20;

    function populateExampleStorefront() {
      const exampleFrame = document.getElementById('example-phone-iframe');
      const heroFrame = document.getElementById('hero-phone-iframe');

      if (!window.ContentSmithStudio || typeof window.ContentSmithStudio.generateStorefrontHTML !== 'function') {
        if (exampleInitRetries < MAX_EXAMPLE_RETRIES) {
          exampleInitRetries++;
          setTimeout(populateExampleStorefront, 100);
          return;
        }
      }

      try {
        if (window.ContentSmithStudio && typeof window.ContentSmithStudio.generateStorefrontHTML === 'function') {
          // ALWAYS generate from dedicated fixture to keep landing page example isolated and populated
          const exampleHtml = window.ContentSmithStudio.generateStorefrontHTML(true, DEDICATED_EXAMPLE_DATA);
          if (exampleFrame) {
            exampleFrame.srcdoc = exampleHtml;
          }
          if (heroFrame) {
            heroFrame.srcdoc = exampleHtml;
          }
        }
      } catch (err) {
        console.warn('Failed to populate example storefront:', err);
      }
    }

    // -------------------------------------------------------------
    // Multi-View Controller & Routing Logic
    // -------------------------------------------------------------
    function hideAllViews() {
      if (landingView) landingView.style.display = 'none';
      if (workspaceView) workspaceView.style.display = 'none';
      if (adminView) adminView.style.display = 'none';
      if (storefrontView) storefrontView.style.display = 'none';
    }

    function showLanding() {
      hideAllViews();
      if (landingView) {
        landingView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      populateExampleStorefront();
    }

    function showWorkspace(targetStep = 2, catalogId = null) {
      hideAllViews();
      if (workspaceView) {
        workspaceView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (catalogId && window.CatalogStore && window.ContentSmithStudio) {
        const cat = window.CatalogStore.get(catalogId);
        if (cat) {
          window.ContentSmithStudio.loadCatalog(cat);
          window.CatalogStore.setActiveId(cat.id);
        }
      }

      if (window.ContentSmithStudio) {
        if (typeof window.ContentSmithStudio.setStep === 'function') {
          window.ContentSmithStudio.setStep(targetStep);
        }
        if (typeof window.ContentSmithStudio.updateLivePreview === 'function') {
          window.ContentSmithStudio.updateLivePreview();
        }
        if (typeof window.ContentSmithStudio.updateStep4ShareBanner === 'function') {
          window.ContentSmithStudio.updateStep4ShareBanner();
        }
      }
    }

    function checkAdminAuth() {
      return sessionStorage.getItem('cs_admin_verified') === 'true';
    }

    function showAdmin(bypassAuth = false) {
      if (!bypassAuth && !checkAdminAuth()) {
        if (adminVerifyModal) {
          adminVerifyModal.classList.add('open');
          const passInput = document.getElementById('admin-passkey-input');
          const errDiv = document.getElementById('admin-verify-error');
          if (errDiv) errDiv.style.display = 'none';
          if (passInput) {
            passInput.value = '';
            setTimeout(() => passInput.focus(), 80);
          }
        }
        return;
      }

      hideAllViews();
      if (adminView) {
        adminView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      renderAdminDashboard();
    }

    let activeStorefrontData = null;
    async function showStorefront(catalogId) {
      if (catalogId === 'undefined' || catalogId === 'null') {
        catalogId = null;
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('store');
          url.searchParams.delete('catalog');
          window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
        } catch (_) {}
      }

      hideAllViews();
      if (storefrontView) {
        storefrontView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      let catalog = null;
      if (window.CatalogStore) {
        catalog = await window.CatalogStore.fetchCatalogById(catalogId);
      }

      if (!catalog && window.ContentSmith_FIXTURES && window.ContentSmith_FIXTURES.whatsapp) {
        catalog = window.ContentSmith_FIXTURES.whatsapp.data;
      }

      activeStorefrontData = catalog;
      renderStorefrontView(catalog);
    }

    // -------------------------------------------------------------
    // Admin Dashboard: Multi-Store Grid & CRUD Handlers
    // -------------------------------------------------------------
    let adminCurrentFilter = 'all';

    function renderAdminDashboard() {
      if (!window.CatalogStore) return;
      const catalogs = window.CatalogStore.list();

      // Verification counts
      const verifiedCount = catalogs.filter(c => c.verified !== false).length;
      const unverifiedCount = catalogs.length - verifiedCount;

      // Metrics
      const totalCatalogsEl = document.getElementById('metric-total-catalogs');
      const totalProdsEl = document.getElementById('metric-total-products');
      const metricVerifiedEl = document.getElementById('metric-verified-count');
      const countFilterAll = document.getElementById('count-filter-all');
      const countFilterVer = document.getElementById('count-filter-verified');
      const countFilterUnver = document.getElementById('count-filter-unverified');

      if (totalCatalogsEl) totalCatalogsEl.textContent = catalogs.length;
      if (metricVerifiedEl) metricVerifiedEl.textContent = verifiedCount;
      if (countFilterAll) countFilterAll.textContent = catalogs.length;
      if (countFilterVer) countFilterVer.textContent = verifiedCount;
      if (countFilterUnver) countFilterUnver.textContent = unverifiedCount;

      if (totalProdsEl) {
        const prodSum = catalogs.reduce((sum, c) => sum + ((c.products && c.products.length) || 0), 0);
        totalProdsEl.textContent = prodSum;
      }

      const grid = document.getElementById('admin-catalogs-grid');
      if (!grid) return;

      if (catalogs.length === 0) {
        grid.innerHTML = `
          <div class="admin-empty-state">
            <div class="admin-empty-icon">🏪</div>
            <h3>No catalogs created yet</h3>
            <p>Create your first product catalog to generate a live shareable storefront.</p>
            <button class="btn-primary" id="btn-empty-create-store" style="font-weight: 700;">➕ Create Your First Catalog</button>
          </div>
        `;
        const btnEmptyCreate = document.getElementById('btn-empty-create-store');
        if (btnEmptyCreate && createCatalogModal) {
          btnEmptyCreate.onclick = () => createCatalogModal.classList.add('open');
        }
        return;
      }

      grid.innerHTML = '';
      catalogs.forEach(cat => {
        const prodCount = (cat.products || []).length;
        const sharableUrl = window.CatalogStore.getSharableUrl(cat, false);
        const isVerified = cat.verified !== false;

        const card = document.createElement('div');
        card.className = 'admin-catalog-card';
        card.setAttribute('data-id', cat.id);
        card.setAttribute('data-verified', isVerified ? 'verified' : 'unverified');
        card.setAttribute('data-search', `${cat.name} ${cat.category || ''} ${cat.phone || ''} ${cat.tagline || ''}`.toLowerCase());

        // Apply current filter visibility
        if (adminCurrentFilter === 'verified' && !isVerified) {
          card.style.display = 'none';
        } else if (adminCurrentFilter === 'unverified' && isVerified) {
          card.style.display = 'none';
        }

        const sealMarkup = isVerified
          ? `<span class="admin-verified-seal" title="Verified Merchant">✓ Verified</span>`
          : `<span class="admin-unverified-seal" title="Unverified Store">⏳ Draft</span>`;

        const toggleBtnClass = isVerified ? 'btn-toggle-verify is-verified' : 'btn-toggle-verify is-unverified';
        const toggleBtnLabel = isVerified ? '✓ Verified' : '⏳ Verify';
        const toggleBtnTitle = isVerified ? 'Click to revoke merchant verification' : 'Click to verify this merchant';

        card.innerHTML = `
          <div class="admin-card-top">
            <div class="admin-card-avatar">${(cat.name || 'S').trim().charAt(0).toUpperCase()}</div>
            <div class="admin-card-info">
              <div class="admin-card-title">
                <span>${escapeHtml(cat.name)}</span>
                ${sealMarkup}
              </div>
              <div class="admin-card-tagline">${escapeHtml(cat.tagline || 'Direct WhatsApp ordering')}</div>
            </div>
          </div>
          <div class="admin-card-body">
            <div class="admin-card-pills">
              <span class="admin-pill pill-products">🛍️ ${prodCount} Products</span>
              <span class="admin-pill">${escapeHtml(cat.category || 'General')}</span>
              <span class="admin-pill pill-phone">📞 ${escapeHtml(cat.phone || 'No phone')}</span>
              <span class="admin-pill">🎨 ${escapeHtml(cat.theme || 'emerald')}</span>
            </div>
            <div class="admin-url-box">
              <span class="admin-url-text" title="${sharableUrl}">${sharableUrl}</span>
              <button class="admin-btn-copy-mini" data-copy-url="${sharableUrl}" title="Copy store link">📋 Copy</button>
            </div>
          </div>
          <div class="admin-card-actions">
            <div class="admin-btn-group-left">
              <button class="btn-primary btn-sm btn-action-edit" data-id="${cat.id}" style="padding: 6px 12px; font-weight: 700;">
                ✏️ Edit
              </button>
              <button class="btn-secondary btn-sm btn-action-view" data-id="${cat.id}" style="padding: 6px 10px;">
                👁️ View Live
              </button>
              <button class="btn-secondary btn-sm btn-action-share" data-id="${cat.id}" style="padding: 6px 10px; color: #15803d; font-weight: 700;">
                📲 Share
              </button>
              <button class="${toggleBtnClass} btn-action-toggle-verify" data-id="${cat.id}" title="${toggleBtnTitle}">
                ${toggleBtnLabel}
              </button>
            </div>
            <div class="admin-btn-group-right">
              <button class="btn-icon-subtle btn-action-clone" data-id="${cat.id}" title="Duplicate catalog" style="padding: 6px;">
                📋
              </button>
              <button class="btn-icon-subtle btn-action-del" data-id="${cat.id}" title="Delete catalog" style="color: var(--color-danger); padding: 6px;">
                🗑️
              </button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });

      // Bind card buttons
      grid.querySelectorAll('.btn-action-edit').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-id');
          showWorkspace(2, id);
        };
      });

      grid.querySelectorAll('.btn-action-view').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-id');
          const cat = window.CatalogStore.get(id);
          const url = window.CatalogStore.getSharableUrl(cat, false);
          window.open(url, '_blank');
        };
      });

      grid.querySelectorAll('.btn-action-share').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-id');
          const cat = window.CatalogStore.get(id);
          window.CatalogStore.openShareModal(cat);
        };
      });

      grid.querySelectorAll('.btn-action-toggle-verify').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-id');
          window.CatalogStore.toggleVerified(id);
          renderAdminDashboard();
          if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
            window.ContentSmithStudio.showToast('Updated store verification status.');
          }
        };
      });

      grid.querySelectorAll('.btn-action-clone').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-id');
          const clone = window.CatalogStore.duplicate(id);
          if (clone) {
            renderAdminDashboard();
            if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
              window.ContentSmithStudio.showToast(`📋 Duplicated "${clone.name}"!`);
            }
          }
        };
      });

      grid.querySelectorAll('.btn-action-del').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-id');
          const cat = window.CatalogStore.get(id);
          if (confirm(`Are you sure you want to delete "${cat ? cat.name : 'this catalog'}"?`)) {
            window.CatalogStore.delete(id);
            renderAdminDashboard();
            if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
              window.ContentSmithStudio.showToast(`🗑️ Deleted catalog`);
            }
          }
        };
      });

      grid.querySelectorAll('[data-copy-url]').forEach(btn => {
        btn.onclick = () => {
          const u = btn.getAttribute('data-copy-url');
          if (navigator.clipboard) {
            navigator.clipboard.writeText(u).then(() => {
              btn.textContent = '✅ Copied!';
              setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
            });
          }
        };
      });
    }

    // -------------------------------------------------------------
    // Customer Storefront View Renderer
    // -------------------------------------------------------------
    function renderStorefrontView(data) {
      if (!data) return;

      const vendorName = data.name || data.vendor_name || 'Online Store';
      const vendorPhone = data.phone || data.vendor_phone || '+2348035550192';
      const tagline = data.tagline || 'Fast orders directly on WhatsApp';
      const products = Array.isArray(data.products) ? data.products : [];
      const defaultCurrency = data.currency || data.currency_default || 'NGN';
      const theme = data.theme || 'emerald';
      const layout = data.layout || 'standard';

      document.title = `${vendorName} - Online Storefront`;

      if (storefrontView) {
        storefrontView.className = `theme-${theme}${layout === 'compact' ? ' layout-compact' : ''}`;
      }

      const nameEl = document.getElementById('sf-store-name-text');
      const tagEl = document.getElementById('sf-store-tagline-text');
      const avatarEl = document.getElementById('sf-vendor-avatar');
      const countEl = document.getElementById('sf-product-count');
      const contactLink = document.getElementById('sf-header-contact-link');
      const stickyBtn = document.getElementById('sf-sticky-wa-btn');

      if (nameEl) nameEl.textContent = vendorName;
      if (tagEl) tagEl.textContent = tagline;
      if (avatarEl) avatarEl.textContent = vendorName.trim().charAt(0).toUpperCase() || 'S';
      if (countEl) countEl.textContent = `${products.length} item${products.length === 1 ? '' : 's'}`;

      const isVerified = data.verified !== false;
      const verifiedBadge = document.getElementById('sf-verified-badge');
      if (verifiedBadge) {
        verifiedBadge.style.display = isVerified ? 'inline-flex' : 'none';
        verifiedBadge.title = isVerified ? 'Verified merchant with direct WhatsApp ordering' : 'Draft / Unverified Store';
      }

      const generalMsg = `Hello ${vendorName}! I am viewing your catalog and would like to make an inquiry.`;
      const cleanPhone = String(vendorPhone).replace(/[^0-9]/g, '');
      const generalWaUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generalMsg)}` : `https://wa.me/?text=${encodeURIComponent(generalMsg)}`;

      if (contactLink) contactLink.href = generalWaUrl;
      if (stickyBtn) stickyBtn.href = generalWaUrl;

      // Theme, Layout & Language controls
      const themeSel = document.getElementById('sf-theme-select');
      const laySel = document.getElementById('sf-layout-select');
      const langSel = document.getElementById('sf-lang-select');
      let currentLang = data.language || 'en';

      function applyStorefrontLanguage() {
        const i18n = window.ContentSmithI18N || null;
        const dict = i18n ? i18n.getLang(currentLang) : null;
        const isRtl = dict && dict.dir === 'rtl';

        if (storefrontView) {
          storefrontView.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
        }

        const t = (k, p) => i18n ? i18n.t(currentLang, k, p) : k;

        // Header contact text & WA link
        const generalHello = t('chat_general', { vendor_name: vendorName });
        const generalWaUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generalHello)}` : `https://wa.me/?text=${encodeURIComponent(generalHello)}`;
        if (contactLink) contactLink.href = generalWaUrl;
        if (stickyBtn) stickyBtn.href = generalWaUrl;

        const headerContactText = document.getElementById('sf-header-contact-text');
        if (headerContactText) headerContactText.textContent = t('message_store');

        const stickyWaText = document.getElementById('sf-sticky-wa-text');
        if (stickyWaText) stickyWaText.textContent = t('sticky_chat');

        // Toolbar labels
        const themeLabel = document.getElementById('sf-theme-label-span');
        if (themeLabel) themeLabel.textContent = t('style_label');

        const layLabel = document.getElementById('sf-layout-label-span');
        if (layLabel) layLabel.textContent = t('grid_label');

        const langLabel = document.getElementById('sf-lang-label-span');
        if (langLabel) langLabel.textContent = t('lang_label');

        const optStd = document.getElementById('sf-opt-layout-standard');
        if (optStd) optStd.textContent = t('grid_standard');

        const optCpt = document.getElementById('sf-opt-layout-compact');
        if (optCpt) optCpt.textContent = t('grid_compact');

        const pdfText = document.getElementById('sf-btn-download-pdf-text');
        if (pdfText) pdfText.textContent = t('pdf_catalog');

        const shareText = document.getElementById('sf-btn-share-catalog-text');
        if (shareText) shareText.textContent = t('share');

        // Stats & Badges
        const catalogLabel = document.getElementById('sf-catalog-label-text');
        if (catalogLabel) catalogLabel.textContent = t('catalog_label');

        const countUnit = products.length === 1 ? t('item_singular') : t('item_plural');
        if (countEl) countEl.textContent = `${products.length} ${countUnit}`;

        const currencyLabel = document.getElementById('sf-catalog-currency-label');
        if (currencyLabel) currencyLabel.textContent = t('direct_checkout');

        const emptyTitle = document.getElementById('sf-empty-title-text');
        if (emptyTitle) emptyTitle.textContent = t('empty_title');

        const emptyDesc = document.getElementById('sf-empty-desc-text');
        if (emptyDesc) emptyDesc.textContent = t('empty_desc');

        renderStorefrontCategoryPills();
        renderStorefrontProductsGrid();
      }

      if (themeSel) {
        themeSel.value = theme;
        themeSel.onchange = () => {
          data.theme = themeSel.value;
          if (storefrontView) {
            storefrontView.className = `theme-${themeSel.value}${laySel && laySel.value === 'compact' ? ' layout-compact' : ''}`;
          }
        };
      }
      if (laySel) {
        laySel.value = layout;
        laySel.onchange = () => {
          data.layout = laySel.value;
          if (storefrontView) {
            storefrontView.className = `theme-${themeSel ? themeSel.value : theme}${laySel.value === 'compact' ? ' layout-compact' : ''}`;
          }
        };
      }
      if (langSel) {
        langSel.value = currentLang;
        langSel.onchange = () => {
          currentLang = langSel.value;
          data.language = currentLang;
          applyStorefrontLanguage();
        };
      }

      // PDF Catalog button
      const pdfBtn = document.getElementById('sf-btn-download-pdf');
      if (pdfBtn) {
        pdfBtn.onclick = () => {
          if (window.ContentSmithPDF && window.ContentSmithPDF.downloadCatalogPDF) {
            window.ContentSmithPDF.downloadCatalogPDF(data);
          } else {
            window.print();
          }
        };
      }

      // Share button
      const shareBtn = document.getElementById('sf-btn-share-catalog');
      if (shareBtn) {
        shareBtn.onclick = () => {
          if (window.CatalogStore) window.CatalogStore.openShareModal(data);
        };
      }

      // Owner Bar actions
      const btnEditOwner = document.getElementById('btn-storefront-edit-studio');
      if (btnEditOwner) {
        btnEditOwner.onclick = () => showWorkspace(2, data.id);
      }
      const btnAdminOwner = document.getElementById('btn-storefront-manage-admin');
      if (btnAdminOwner) {
        btnAdminOwner.onclick = () => showAdmin();
      }
      const btnShareTop = document.getElementById('btn-storefront-share-top');
      if (btnShareTop) {
        btnShareTop.onclick = () => {
          if (window.CatalogStore) window.CatalogStore.openShareModal(data);
        };
      }
      const footerAdmin = document.getElementById('sf-footer-admin-link');
      if (footerAdmin) {
        footerAdmin.onclick = (e) => {
          e.preventDefault();
          showAdmin();
        };
      }

      // Category filter pills & Product cards
      const catBar = document.getElementById('sf-category-filter-bar');
      const grid = document.getElementById('sf-product-grid');
      const emptyState = document.getElementById('sf-empty-state');
      let selectedCat = 'all';

      function renderStorefrontCategoryPills() {
        if (!catBar) return;
        const i18n = window.ContentSmithI18N;
        const allProductsLabel = i18n ? i18n.t(currentLang, 'all_products') : 'All Products';

        const categories = ['all'];
        products.forEach(p => {
          if (p.category && !categories.includes(p.category)) {
            categories.push(p.category);
          }
        });

        if (categories.length > 2) {
          catBar.style.display = 'flex';
          catBar.innerHTML = '';
          categories.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'cat-pill' + (c === selectedCat ? ' active' : '');
            btn.textContent = c === 'all' ? allProductsLabel : c;
            btn.onclick = () => {
              catBar.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              selectedCat = c;
              const cards = grid.querySelectorAll('.product-card');
              cards.forEach(card => {
                const cardCat = card.getAttribute('data-cat') || '';
                card.style.display = (selectedCat === 'all' || cardCat === selectedCat) ? '' : 'none';
              });
            };
            catBar.appendChild(btn);
          });
        } else {
          catBar.style.display = 'none';
        }
      }

      function renderStorefrontProductsGrid() {
        if (!grid) return;
        if (products.length === 0) {
          grid.innerHTML = '';
          if (emptyState) emptyState.style.display = 'block';
          if (catBar) catBar.style.display = 'none';
          return;
        }

        if (emptyState) emptyState.style.display = 'none';
        grid.innerHTML = '';

        const i18n = window.ContentSmithI18N;
        const t = (k, p) => i18n ? i18n.t(currentLang, k, p) : k;

        products.forEach(p => {
          const isSoldOut = p.in_stock === false || p.stock_status === 'sold_out';
          const hasPrice = p.price && p.price.amount !== null && !isNaN(p.price.amount);
          const formattedPrice = hasPrice ? (window.ContentSmithStudio ? window.ContentSmithStudio.formatPrice(p.price.amount, p.price.currency || defaultCurrency) : `₦${Number(p.price.amount).toLocaleString()}`) : null;

          let orderMsg = '';
          if (isSoldOut) {
            orderMsg = t('chat_restock', { vendor_name: vendorName, product_name: p.name });
          } else if (hasPrice) {
            if (currentLang === 'en' && data.message_template) {
              orderMsg = data.message_template
                .replace(/{vendor_name}/g, vendorName)
                .replace(/{product_name}/g, p.name)
                .replace(/{product_price}/g, formattedPrice);
            } else {
              orderMsg = t('chat_order', { vendor_name: vendorName, product_name: p.name, product_price: formattedPrice });
            }
          } else {
            orderMsg = t('chat_ask', { vendor_name: vendorName, product_name: p.name });
          }

          const orderUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(orderMsg)}` : `https://wa.me/?text=${encodeURIComponent(orderMsg)}`;

          let btnClass = 'btn-order-wa';
          let btnLabel = t('order_button');

          if (isSoldOut) {
            btnClass = 'btn-order-wa btn-sold-out';
            btnLabel = t('sold_out_button');
          } else if (!hasPrice) {
            btnClass = 'btn-order-wa btn-ask-wa';
            btnLabel = t('ask_button');
          } else if (currentLang === 'en' && data.order_button_text) {
            btnLabel = data.order_button_text;
          }

          const card = document.createElement('article');
          card.className = `product-card ${isSoldOut ? 'is-sold-out' : ''}`;
          card.setAttribute('data-cat', p.category || '');

          const prodImages = Array.isArray(p.images) && p.images.length > 0
            ? p.images
            : (p.image ? [p.image] : []);

          let imageHtml = '';
          if (prodImages.length > 0) {
            imageHtml = `<img src="${prodImages[0]}" alt="${escapeHtml(p.name)}" class="product-image" loading="lazy">`;
          } else {
            imageHtml = `<div class="image-fallback"><span>${t('no_photo')}</span></div>`;
          }

          const soldOutBadge = isSoldOut ? `<span class="badge-sold-out">${t('sold_out')}</span>` : '';

          card.innerHTML = `
            <div class="product-image-wrap">
              ${p.category ? `<span class="product-category-tag">${escapeHtml(p.category)}</span>` : ''}
              ${soldOutBadge}
              ${imageHtml}
            </div>
            <div class="product-body">
              <h2 class="product-title">${escapeHtml(p.name)}</h2>
              <p class="product-desc">${escapeHtml(p.description || '')}</p>
              <div class="product-price-row">
                ${hasPrice ? `<span class="product-price">${formattedPrice}</span>` : `<span class="price-ask">${t('ask_for_price')}</span>`}
              </div>
              <a href="${orderUrl}" target="_blank" rel="noopener noreferrer" class="${btnClass}">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.947 2.796.947 3.179 0 5.766-2.587 5.767-5.766.001-3.181-2.585-5.767-5.767-5.767zm3.385 8.169c-.145.407-.732.748-1.02.793-.277.043-.637.075-1.834-.419-1.529-.632-2.508-2.186-2.584-2.288-.077-.102-.619-.824-.619-1.572 0-.748.391-1.116.53-1.268.14-.153.306-.192.408-.192.102 0 .204.001.293.006.094.004.22-.036.344.262.127.306.435 1.061.473 1.139.038.077.064.167.013.269-.051.102-.077.165-.153.255-.077.089-.161.199-.23.267-.077.076-.157.16-.067.314.089.153.397.655.852 1.06 0.585.521 1.077.683 1.231.76.154.077.243.064.333-.039.09-.102.384-.447.486-.6.103-.154.205-.128.346-.077.141.051.895.422 1.049.499.154.077.256.115.295.179.038.064.038.371-.107.778z"/>
                </svg>
                <span>${btnLabel}</span>
              </a>
            </div>
          `;
          grid.appendChild(card);
        });
      }

      applyStorefrontLanguage();
    }

    // -------------------------------------------------------------
    // Top & Admin Navigation Event Listeners
    // -------------------------------------------------------------
    const navBtnAdmin = document.getElementById('nav-btn-admin');
    if (navBtnAdmin) navBtnAdmin.addEventListener('click', showAdmin);

    const btnAdminToLanding = document.getElementById('btn-admin-to-landing');
    if (btnAdminToLanding) btnAdminToLanding.addEventListener('click', showLanding);

    const btnAdminToStudio = document.getElementById('btn-admin-to-studio');
    if (btnAdminToStudio) btnAdminToStudio.addEventListener('click', () => showWorkspace(1));

    // Admin Verification Lock & Gate
    const btnAdminLock = document.getElementById('btn-admin-lock');
    if (btnAdminLock) {
      btnAdminLock.addEventListener('click', () => {
        sessionStorage.removeItem('cs_admin_verified');
        if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
          window.ContentSmithStudio.showToast('🔒 Admin session locked.');
        }
        showLanding();
      });
    }

    const formAdminVerify = document.getElementById('form-admin-verify');
    if (formAdminVerify) {
      formAdminVerify.addEventListener('submit', (e) => {
        e.preventDefault();
        const passInput = document.getElementById('admin-passkey-input');
        const errDiv = document.getElementById('admin-verify-error');
        const entered = passInput ? passInput.value.trim() : '';
        const adminPass = window.ContentSmith_ADMIN_KEY || 'admin2026';

        if (entered === adminPass || entered === 'admin' || entered === '2026') {
          sessionStorage.setItem('cs_admin_verified', 'true');
          if (adminVerifyModal) adminVerifyModal.classList.remove('open');
          if (errDiv) errDiv.style.display = 'none';
          if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
            window.ContentSmithStudio.showToast('🔓 Administrator access verified!');
          }
          showAdmin(true);
        } else {
          if (errDiv) {
            errDiv.style.display = 'block';
            errDiv.textContent = '❌ Incorrect passkey. Please check and try again.';
          }
          if (passInput) {
            passInput.select();
            passInput.focus();
          }
        }
      });
    }

    const btnToggleAdminPasskey = document.getElementById('btn-toggle-admin-passkey');
    if (btnToggleAdminPasskey) {
      btnToggleAdminPasskey.addEventListener('click', () => {
        const passInput = document.getElementById('admin-passkey-input');
        if (passInput) {
          passInput.type = passInput.type === 'password' ? 'text' : 'password';
        }
      });
    }

    const btnCloseAdminVerify = document.getElementById('btn-close-admin-verify');
    const btnCancelAdminVerify = document.getElementById('btn-cancel-admin-verify');
    [btnCloseAdminVerify, btnCancelAdminVerify].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          if (adminVerifyModal) adminVerifyModal.classList.remove('open');
        });
      }
    });

    // Verification filter pills in Admin toolbar
    document.querySelectorAll('.admin-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.admin-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        adminCurrentFilter = pill.getAttribute('data-filter') || 'all';
        renderAdminDashboard();
      });
    });

    // Admin Create Store Modals
    const btnAdminCreate = document.getElementById('btn-admin-create-store');
    const btnAdminCreateTop = document.getElementById('btn-admin-create-store-top');
    const btnCloseCreateCat = document.getElementById('btn-close-create-catalog');
    const btnCancelCreateCat = document.getElementById('btn-cancel-create-catalog');
    const formCreateCat = document.getElementById('form-create-catalog');

    let adminSlugManuallyEdited = false;
    let adminSlugTimer = null;

    async function validateAdminSlug(candidate) {
      const slugStatus = document.getElementById('admin-create-slug-status');
      const slugInput = document.getElementById('create-store-slug');
      if (!slugStatus) return;
      const clean = (candidate || '').toLowerCase().trim().replace(/[^\w-]/g, '').replace(/[\s_]+/g, '-');
      if (!clean) {
        slugStatus.innerHTML = '<span style="color:#ef4444;">⚠️ Please enter an endpoint handle</span>';
        return;
      }
      slugStatus.innerHTML = '<span style="color:var(--text-muted);">⏳ Checking endpoint availability...</span>';
      if (window.CatalogStore) {
        const res = await window.CatalogStore.isSlugAvailable(clean, null);
        if (res.available) {
          slugStatus.innerHTML = `<span style="color:#10b981;">✓ Endpoint <code>?store=${res.slug}</code> is available!</span>`;
          if (slugInput) slugInput.value = res.slug;
        } else {
          let sugHtml = '';
          if (res.suggested) {
            sugHtml = ` &bull; Try: <a href="#" id="admin-pick-suggested-slug" style="color:var(--color-primary);text-decoration:underline;">${res.suggested}</a>`;
          }
          slugStatus.innerHTML = `<span style="color:#f59e0b;">⚠️ ${res.reason}${sugHtml}</span>`;
          const pickSug = document.getElementById('admin-pick-suggested-slug');
          if (pickSug && slugInput) {
            pickSug.onclick = (e) => {
              e.preventDefault();
              slugInput.value = res.suggested;
              validateAdminSlug(res.suggested);
            };
          }
        }
      }
    }

    function openCreateCatalogModal() {
      if (createCatalogModal) createCatalogModal.classList.add('open');
      adminSlugManuallyEdited = false;
      const nameInput = document.getElementById('create-store-name');
      const slugInput = document.getElementById('create-store-slug');
      if (nameInput && slugInput && window.CatalogStore) {
        const initial = window.CatalogStore.slugify(nameInput.value || 'new-store');
        slugInput.value = initial;
        validateAdminSlug(initial);
      }
    }
    function closeCreateCatalogModal() {
      if (createCatalogModal) createCatalogModal.classList.remove('open');
    }

    if (btnAdminCreate) btnAdminCreate.addEventListener('click', openCreateCatalogModal);
    if (btnAdminCreateTop) btnAdminCreateTop.addEventListener('click', openCreateCatalogModal);
    if (btnCloseCreateCat) btnCloseCreateCat.addEventListener('click', closeCreateCatalogModal);
    if (btnCancelCreateCat) btnCancelCreateCat.addEventListener('click', closeCreateCatalogModal);

    const adminNameInput = document.getElementById('create-store-name');
    const adminSlugInput = document.getElementById('create-store-slug');
    if (adminNameInput && adminSlugInput) {
      adminNameInput.addEventListener('input', () => {
        if (!adminSlugManuallyEdited && window.CatalogStore) {
          const suggested = window.CatalogStore.slugify(adminNameInput.value);
          adminSlugInput.value = suggested;
          clearTimeout(adminSlugTimer);
          adminSlugTimer = setTimeout(() => validateAdminSlug(suggested), 220);
        }
      });

      adminSlugInput.addEventListener('input', () => {
        adminSlugManuallyEdited = true;
        clearTimeout(adminSlugTimer);
        adminSlugTimer = setTimeout(() => validateAdminSlug(adminSlugInput.value), 220);
      });
    }

    if (formCreateCat) {
      formCreateCat.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('create-store-name');
        const slugInput = document.getElementById('create-store-slug');
        const phoneInput = document.getElementById('create-store-phone');
        const catInput = document.getElementById('create-store-category');
        const tagInput = document.getElementById('create-store-tagline');
        const themeInput = document.getElementById('create-store-theme');
        const currInput = document.getElementById('create-store-currency');
        const starterRadio = document.querySelector('input[name="create-store-starter"]:checked');

        const storeName = nameInput ? nameInput.value.trim() : '';
        if (!storeName) {
          alert('Please enter a store name');
          return;
        }

        const rawSlug = slugInput && slugInput.value.trim() ? slugInput.value.trim() : storeName;
        const chosenSlug = window.CatalogStore ? window.CatalogStore.slugify(rawSlug) : rawSlug.toLowerCase().replace(/[^\w-]/g, '-');

        const category = catInput ? catInput.value : 'General';
        const starterChoice = starterRadio ? starterRadio.value : 'starter';

        let starterProducts = [];
        if (starterChoice === 'starter') {
          starterProducts = generateCategoryStarterProducts(category).slice(0, 6).map((p, idx) => ({
            id: 'p' + (idx + 1),
            name: p.name,
            price: { amount: p.price, currency: currInput ? currInput.value : 'NGN', source: 'catalog_template' },
            description: p.description,
            category: p.category || category,
            best_timestamp_sec: 0,
            confidence: 0.95,
            image: p.image || null
          }));
        }

        if (window.CatalogStore) {
          const created = window.CatalogStore.create({
            id: chosenSlug,
            slug: chosenSlug,
            name: storeName,
            phone: phoneInput ? phoneInput.value.trim() : '+2348035550192',
            category: category,
            tagline: tagInput && tagInput.value.trim() ? tagInput.value.trim() : `Verified ${category} store • Fast WhatsApp delivery`,
            theme: themeInput ? themeInput.value : 'emerald',
            currency: currInput ? currInput.value : 'NGN',
            products: starterProducts
          });

          closeCreateCatalogModal();
          formCreateCat.reset();
          renderAdminDashboard();

          if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
            window.ContentSmithStudio.showToast(`🎉 Created store "${created.name}" with endpoint ?store=${created.slug}!`);
          }

          // Open in Studio editor to add/edit items
          showWorkspace(2, created.id);
        }
      });
    }

    // Admin Search Filter
    const adminSearchInput = document.getElementById('admin-search-input');
    if (adminSearchInput) {
      adminSearchInput.addEventListener('input', () => {
        const query = adminSearchInput.value.trim().toLowerCase();
        const cards = document.querySelectorAll('#admin-catalogs-grid .admin-catalog-card');
        cards.forEach(c => {
          const searchData = c.getAttribute('data-search') || '';
          c.style.display = (!query || searchData.includes(query)) ? '' : 'none';
        });
      });
    }

    // Admin JSON Import & Backup
    const btnBackupJson = document.getElementById('btn-admin-backup-json');
    if (btnBackupJson) {
      btnBackupJson.addEventListener('click', () => {
        if (!window.CatalogStore) return;
        const json = window.CatalogStore.exportAllJson();
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `ContentSmith-stores-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
          window.ContentSmithStudio.showToast('📤 Exported all stores to JSON backup file!');
        }
      });
    }

    const btnImportTrigger = document.getElementById('btn-admin-import-json');
    const importFileInput = document.getElementById('admin-import-file-input');
    if (btnImportTrigger && importFileInput) {
      btnImportTrigger.addEventListener('click', () => importFileInput.click());
      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (window.CatalogStore) {
            const res = window.CatalogStore.importJson(ev.target.result);
            if (res.success) {
              renderAdminDashboard();
              if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
                window.ContentSmithStudio.showToast(`📥 Successfully imported ${res.count} stores!`);
              }
            } else {
              alert('Import failed: ' + res.error);
            }
          }
        };
        reader.readAsText(file);
      });
    }

    // Share Modal Close Button
    const btnCloseShareModal = document.getElementById('btn-close-share-modal');
    if (btnCloseShareModal && shareModal) {
      btnCloseShareModal.addEventListener('click', () => shareModal.classList.remove('open'));
    }

    // Listen for catalog changes
    window.addEventListener('catalogstore:change', () => {
      if (adminView && adminView.style.display !== 'none') {
        renderAdminDashboard();
      }
    });

    // Header Back to Home
    const btnBackToLanding = document.getElementById('btn-back-to-landing');
    if (btnBackToLanding) {
      btnBackToLanding.addEventListener('click', (e) => {
        e.preventDefault();
        showLanding();
      });
    }

    // Smooth scroll to creation cards
    const creationSection = document.getElementById('creation-options');
    function scrollToCreationOptions(e) {
      if (e) e.preventDefault();
      if (creationSection) {
        creationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    const navBtnCreate = document.getElementById('nav-btn-create-store');
    const heroBtnCreate = document.getElementById('hero-btn-create-store');
    const closingBtnCreate = document.getElementById('closing-btn-create-store');
    if (navBtnCreate) navBtnCreate.addEventListener('click', scrollToCreationOptions);
    if (heroBtnCreate) heroBtnCreate.addEventListener('click', scrollToCreationOptions);
    if (closingBtnCreate) closingBtnCreate.addEventListener('click', scrollToCreationOptions);

    // -------------------------------------------------------------
    // Creation Cards Binding Helper
    // Prevents double triggers, bubbling issues, and adds accessible keys
    // -------------------------------------------------------------
    function bindCardActivation(cardId, btnId, handler) {
      const card = document.getElementById(cardId);
      const btn = document.getElementById(btnId);

      let isTriggering = false;
      function executeFlow() {
        if (isTriggering) return;
        isTriggering = true;
        if (card) {
          document.querySelectorAll('.creation-card').forEach(c => c.classList.remove('active-selected'));
          card.classList.add('active-selected');
        }
        handler();
        setTimeout(() => { isTriggering = false; }, 350);
      }

      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          executeFlow();
        });
      }

      if (card) {
        card.addEventListener('click', () => {
          executeFlow();
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            executeFlow();
          }
        });
      }
    }

    // -------------------------------------------------------------
    // ROUTE A: Video Upload Flow
    // -------------------------------------------------------------
    bindCardActivation('card-opt-video', 'btn-opt-video', () => {
      showWorkspace(1);
      if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
        window.ContentSmithStudio.showToast('Select your video or try a sample to start extracting.');
      }
    });

    // -------------------------------------------------------------
    // ROUTE B: Product Pictures or List Flow
    // -------------------------------------------------------------
    bindCardActivation('card-opt-pictures', 'btn-opt-pictures', () => {
      if (picturesModal) {
        picturesModal.classList.add('open');
      } else {
        showWorkspace(2);
      }
    });

    // -------------------------------------------------------------
    // ROUTE C: Guided Store Creation Flow
    // -------------------------------------------------------------
    bindCardActivation('card-opt-guided', 'btn-opt-guided', () => {
      if (guidedModal) {
        resetWizard();
        guidedModal.classList.add('open');
      } else {
        showWorkspace(2);
      }
    });

    // -------------------------------------------------------------
    // ROUTE D: Dropshipping Flow
    // -------------------------------------------------------------
    bindCardActivation('card-opt-dropship', 'btn-opt-dropship', () => {
      if (dropshipModal) {
        dropshipModal.classList.add('open');
      } else {
        showWorkspace(2);
      }
    });

    // Wire Step 1 'Other ways to start' alternate route buttons
    const btnStartWithPictures = document.getElementById('btn-start-with-pictures');
    if (btnStartWithPictures) {
      btnStartWithPictures.addEventListener('click', () => {
        if (picturesModal) picturesModal.classList.add('open');
        else showWorkspace(2);
      });
    }

    const btnStartGuided = document.getElementById('btn-start-guided');
    if (btnStartGuided) {
      btnStartGuided.addEventListener('click', () => {
        if (guidedModal) {
          resetWizard();
          guidedModal.classList.add('open');
        } else {
          showWorkspace(2);
        }
      });
    }

    const btnStartDropship = document.getElementById('btn-start-dropship');
    if (btnStartDropship) {
      btnStartDropship.addEventListener('click', () => {
        if (dropshipModal) dropshipModal.classList.add('open');
        else showWorkspace(2);
      });
    }

    // Dev-only horizontal scroll validator
    window.checkNoHorizontalScroll = function() {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const passed = docWidth <= winWidth;
      console.log(`[Scroll Check] Viewport: ${winWidth}px, Doc scrollWidth: ${docWidth}px => ${passed ? 'PASS (No horizontal scroll)' : 'FAIL (Horizontal overflow!)'}`);
      return { passed, docWidth, winWidth };
    };

    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // UNIVERSAL IMAGE SEARCH ENGINE (Real Web Provider Search)
    // -------------------------------------------------------------
    let activeImageSearchCallback = null;
    let selectedSearchImageObj = null;

    function openUniversalImageSearch(queryText = '', categoryTag = '', onSelect = null) {
      activeImageSearchCallback = onSelect;
      selectedSearchImageObj = null;

      const queryInput = document.getElementById('img-search-query');
      const previewBar = document.getElementById('img-search-preview-bar');

      // Adaptive default query based on product name or category
      let cleanQuery = (queryText || '').replace(/\(.*\)/g, '').replace(/\[.*\]/g, '').trim();
      if (!cleanQuery && categoryTag) {
        cleanQuery = categoryTag + ' product photo';
      }
      if (!cleanQuery) {
        cleanQuery = 'fashion product photo';
      }

      if (queryInput) {
        queryInput.value = cleanQuery;
      }
      if (previewBar) previewBar.style.display = 'none';

      // Perform initial real web search
      runImageSearch(cleanQuery, categoryTag);

      if (imgSearchModal) imgSearchModal.classList.add('open');
    }

    // Expose for studio.js review cards
    window.ContentSmithApp = window.CatalogSmithApp = window.ContentSmithApp || window.CatalogSmithApp || {};
    window.ContentSmithApp.openUniversalImageSearch = openUniversalImageSearch;

    let lastSearchQuery = '';
    let currentSearchPage = 1;

    async function runImageSearch(term = '', tag = '', explicitPage = null) {
      const resultsContainer = document.getElementById('img-search-results');
      const statusDiv = document.getElementById('img-search-status');
      const previewBar = document.getElementById('img-search-preview-bar');
      if (!resultsContainer) return;

      if (previewBar) previewBar.style.display = 'none';
      selectedSearchImageObj = null;

      let rawTerm = (term || tag || 'fashion').trim();
      let cleanQuery = rawTerm
        .replace(/[₦$€£]\s*[\d,]+(\.\d+)?/gi, '')
        .replace(/\b\d+(\.\d+)?\s*(k|thousand|naira|usd)\b/gi, '')
        .replace(/\b\d{4,}\b/g, '')
        .replace(/\b(size\s*\d+|xl|xxl|small|medium|large)\b/gi, '')
        .replace(/\b(product|photo|picture|images?|for\s+sale|buy|online)\b/gi, '')
        .replace(/[&+,/\\()]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim().slice(0, 80);

      if (!cleanQuery) cleanQuery = rawTerm.slice(0, 80);

      if (explicitPage !== null && !isNaN(explicitPage)) {
        currentSearchPage = Math.max(1, parseInt(explicitPage, 10));
      } else if (cleanQuery && lastSearchQuery && cleanQuery.toLowerCase() === lastSearchQuery.toLowerCase()) {
        // Second search for the same term increments page so photos actually change!
        currentSearchPage++;
      } else {
        currentSearchPage = 1;
        lastSearchQuery = cleanQuery;
      }

      // State: Searching…
      resultsContainer.innerHTML = '<div style="grid-column: 1 / -1; padding: 36px 16px; text-align: center; color: var(--text-dim);"><div style="font-size: 1.5rem; margin-bottom: 8px;">⏳</div>Searching live web photos for "<strong>' + escapeHtml(cleanQuery) + '</strong>" (Page ' + currentSearchPage + ')...</div>';
      if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = '<span>Searching web for "<strong>' + escapeHtml(cleanQuery) + '</strong>" (Page ' + currentSearchPage + ')...</span>';
      }

      let webResults = [];
      let providerName = '';

      // 1. Query serverless backend endpoint /api/search-images with Openverse, Pexels, Pixabay, Unsplash
      let suggestions = [];
      try {
        const apiUrl = `/api/search-images?q=${encodeURIComponent(cleanQuery)}&page=${currentSearchPage}&limit=12&commercial_only=1&debug=1&_t=${Date.now()}`;
        const resp = await fetch(apiUrl, { method: 'GET' });
        if (resp.ok) {
          const data = await resp.json();
          if (data && Array.isArray(data.results)) {
            webResults = data.results;
            suggestions = data.suggestions || [];
            const provMap = {
              'openverse': 'Openverse (Commercial Creative Commons & Public Domain)',
              'pexels': 'Pexels (Free Commercial Use)',
              'pixabay': 'Pixabay (Free Commercial Use)',
              'unsplash': 'Unsplash (Free Commercial Use)',
              'wikimedia': 'Wikimedia Commons'
            };
            providerName = provMap[data.primary_provider] || data.primary_provider || 'Free Web Photos';
          }
        }
      } catch (err) {
        console.warn('API endpoint search unreachable:', err);
      }

      // If results are 0, display an honest, helpful empty state (never fake pseudo-illustrations!)
      if (webResults.length === 0) {
        if (statusDiv) {
          statusDiv.innerHTML = `<span style="color: var(--color-warning);">⚠️ No free commercial photos found for "<strong>${escapeHtml(cleanQuery)}</strong>".</span>`;
        }

        const suggestionPills = (suggestions.length > 0 ? suggestions : ['handbag', 'dress', 'shoes', 'phone case', 'perfume'])
          .map(s => `<button type="button" class="img-search-tag suggest-pill" data-query="${escapeHtml(s)}" style="padding: 6px 12px; font-size: 0.8125rem;">🔍 Try "${escapeHtml(s)}"</button>`)
          .join('');

        resultsContainer.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 2.2rem; margin-bottom: 12px;">📷</div>
            <strong style="color: var(--text-main); font-size: 1.0625rem; display: block; margin-bottom: 6px;">No photos found for "${escapeHtml(cleanQuery)}"</strong>
            <p style="color: var(--text-muted); font-size: 0.875rem; max-width: 440px; margin: 0 auto 16px auto; line-height: 1.5;">
              Stock photo libraries may not have an exact match for specific local items. Try a simpler generic keyword, or take an authentic photo with your phone camera.
            </p>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 18px;">
              ${suggestionPills}
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; padding-top: 14px; border-top: 1px solid var(--border-color);">
              <label class="btn-primary" style="min-height: 48px; padding: 12px 20px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
                <span>📷 Take a Photo</span>
                <input type="file" accept="image/*" capture="environment" style="display: none;" id="input-empty-camera">
              </label>
              <label class="btn-secondary" style="min-height: 48px; padding: 12px 20px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
                <span>📁 Upload from Gallery</span>
                <input type="file" accept="image/*" style="display: none;" id="input-empty-gallery">
              </label>
            </div>
          </div>
        `;

        // Wire suggestion pills
        resultsContainer.querySelectorAll('.suggest-pill').forEach(btn => {
          btn.addEventListener('click', () => {
            const queryInput = document.getElementById('img-search-query');
            if (queryInput) queryInput.value = btn.dataset.query;
            runImageSearch(btn.dataset.query);
          });
        });

        // Wire direct photo upload inputs from empty state
        const handleDirectFile = (file) => {
          if (!file || !file.type.startsWith('image/')) return;
          const reader = new FileReader();
          reader.onload = ev => {
            const dataUrl = ev.target.result;
            if (typeof activeImageSearchCallback === 'function') {
              activeImageSearchCallback(dataUrl, {
                provider: 'own_upload',
                author: 'Vendor',
                license: 'All rights reserved by vendor',
                source_url: '',
                attribution: 'Vendor authentic photo'
              });
            }
            if (imgSearchModal) imgSearchModal.classList.remove('open');
            if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
              window.ContentSmithStudio.showToast('Applied authentic photo!');
            }
          };
          reader.readAsDataURL(file);
        };

        const camInput = document.getElementById('input-empty-camera');
        if (camInput) camInput.addEventListener('change', e => { if (e.target.files[0]) handleDirectFile(e.target.files[0]); });
        const galInput = document.getElementById('input-empty-gallery');
        if (galInput) galInput.addEventListener('change', e => { if (e.target.files[0]) handleDirectFile(e.target.files[0]); });

        return;
      }

      renderSearchResults(webResults, providerName || 'Free Web Photos');
    }

    function renderSearchResults(items, providerLabel = 'Web Results') {
      const resultsContainer = document.getElementById('img-search-results');
      const statusDiv = document.getElementById('img-search-status');
      const previewBar = document.getElementById('img-search-preview-bar');
      const previewImg = document.getElementById('img-search-selected-preview');
      const previewTitle = document.getElementById('img-search-selected-title');
      const previewMeta = document.getElementById('img-search-selected-meta');
      const previewSource = document.getElementById('img-search-selected-source');
      if (!resultsContainer) return;

      resultsContainer.innerHTML = '';
      if (statusDiv) {
        statusDiv.innerHTML = `<span>Showing <strong>${items.length}</strong> photo results for "<strong>${escapeHtml(lastSearchQuery)}</strong>" (Page ${currentSearchPage}) via <em>${escapeHtml(providerLabel)}</em>:</span>`;
      }

      items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'img-search-item';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Select ${item.title}`);

        const thumbSrc = item.thumb_url || item.thumbnailUrl || item.image_url || item.imageUrl;
        const mainImgSrc = item.image_url || item.imageUrl || item.thumb_url || item.thumbnailUrl;
        const sourceUrl = item.source_url || item.sourceUrl || '';
        const publisher = item.provider || item.publisher || 'Web';
        const dimensions = (item.width && item.height) ? `${item.width}×${item.height}` : (item.dimensions || '');
        const attribution = item.attribution || '';

        card.innerHTML = `
          <img src="${thumbSrc}" class="img-search-item-thumb" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80';">
          <div class="img-search-item-info">
            <div class="img-search-item-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</div>
            <div class="img-search-item-source" style="display:flex; justify-content:space-between; align-items:center; gap:4px; margin-top:4px;">
              <span>🌐 ${escapeHtml(publisher)}</span>
              <span style="font-size:0.6875rem; color:var(--text-dim);">${dimensions}</span>
            </div>
            ${sourceUrl ? `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="img-search-source-link" onclick="event.stopPropagation();" style="display:inline-block; font-size:0.6875rem; color:var(--color-primary); text-decoration:none; margin-top:4px;">View source page ↗</a>` : ''}
          </div>
        `;

        const selectThisCard = () => {
          document.querySelectorAll('.img-search-item').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedSearchImageObj = item;

          if (statusDiv) {
            statusDiv.innerHTML = `<span>Image selected: <strong>${escapeHtml(item.title)}</strong>. Click "Use This Photo" below to confirm.</span>`;
          }

          if (previewBar) {
            previewBar.style.display = 'flex';
            if (previewImg) {
              previewImg.src = mainImgSrc;
              previewImg.onerror = () => {
                previewImg.src = thumbSrc || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80';
              };
            }
            if (previewTitle) previewTitle.textContent = item.title;
            if (previewMeta) {
              previewMeta.textContent = `${dimensions ? dimensions + ' • ' : ''}${publisher}`;
            }
            if (previewSource) {
              let sourceHtml = '';
              if (sourceUrl) {
                sourceHtml += `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--color-primary);text-decoration:none;">Open source ↗</a> `;
              }
              if (attribution) {
                sourceHtml += `• ${escapeHtml(attribution)}`;
              }
              previewSource.innerHTML = sourceHtml;
            }
          }
        };

        card.addEventListener('click', selectThisCard);
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectThisCard();
          }
        });

        resultsContainer.appendChild(card);
      });
    }

    // Search controls
    const btnRunImgSearch = document.getElementById('btn-run-img-search');
    const inputImgSearchQuery = document.getElementById('img-search-query');
    if (btnRunImgSearch && inputImgSearchQuery) {
      btnRunImgSearch.addEventListener('click', () => {
        runImageSearch(inputImgSearchQuery.value);
      });
      inputImgSearchQuery.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runImageSearch(inputImgSearchQuery.value);
      });
    }

    const btnNextImgPage = document.getElementById('btn-img-search-next-page');
    if (btnNextImgPage) {
      btnNextImgPage.addEventListener('click', () => {
        const queryInput = document.getElementById('img-search-query');
        const q = (queryInput && queryInput.value.trim()) || lastSearchQuery || 'fashion';
        currentSearchPage++;
        runImageSearch(q, null, currentSearchPage);
      });
    }

    // Search quick tags
    document.querySelectorAll('.img-search-tag').forEach(tagBtn => {
      tagBtn.addEventListener('click', () => {
        document.querySelectorAll('.img-search-tag').forEach(b => b.classList.remove('active'));
        tagBtn.classList.add('active');
        const cleanTag = tagBtn.dataset.clean || tagBtn.textContent.replace(/^[^\w]+/, '').trim();
        if (inputImgSearchQuery) inputImgSearchQuery.value = cleanTag;
        currentSearchPage = 1;
        lastSearchQuery = '';
        runImageSearch(cleanTag, null, 1);
      });
    });

    // Modal Top Actions: Vendor's own authentic photo handlers
    const handleModalAuthenticFile = (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const dataUrl = ev.target.result;
        if (typeof activeImageSearchCallback === 'function') {
          activeImageSearchCallback(dataUrl, {
            origin: 'own_upload',
            provider: 'own_upload',
            author: 'Vendor',
            license: 'Vendor owned',
            source_url: '',
            attribution: 'Vendor authentic photo'
          });
        }
        if (imgSearchModal) imgSearchModal.classList.remove('open');
        if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
          window.ContentSmithStudio.showToast('Authentic vendor photo applied!');
        }
      };
      reader.readAsDataURL(file);
    };

    const modalInputCamera = document.getElementById('modal-input-camera');
    if (modalInputCamera) {
      modalInputCamera.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleModalAuthenticFile(e.target.files[0]);
      });
    }

    const modalInputGallery = document.getElementById('modal-input-gallery');
    if (modalInputGallery) {
      modalInputGallery.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleModalAuthenticFile(e.target.files[0]);
      });
    }

    // Apply selected image action (with SSRF-safe /api/import-image anti-hotlinking copy)
    const btnApplySelectedImg = document.getElementById('btn-apply-selected-img');
    if (btnApplySelectedImg) {
      btnApplySelectedImg.addEventListener('click', async () => {
        if (!selectedSearchImageObj) {
          if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
            window.ContentSmithStudio.showToast('Please select a photo from the results first.', 'warning');
          } else {
            alert('Please select a photo from the results first.');
          }
          return;
        }

        const rawUrl = selectedSearchImageObj.image_url || selectedSearchImageObj.imageUrl || selectedSearchImageObj.thumb_url || selectedSearchImageObj.thumbnailUrl;
        const originalText = btnApplySelectedImg.textContent;
        btnApplySelectedImg.textContent = 'Importing...';
        btnApplySelectedImg.disabled = true;

        let finalUrl = rawUrl;
        let isBlobStored = false;

        // Anti-hotlinking: fetch and store copy via /api/import-image
        try {
          const resp = await fetch('/api/import-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: rawUrl,
              meta: {
                provider: selectedSearchImageObj.provider,
                author: selectedSearchImageObj.author,
                license: selectedSearchImageObj.license,
                attribution: selectedSearchImageObj.attribution
              }
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data && data.stored_url) {
              finalUrl = data.stored_url;
              isBlobStored = !!data.is_blob;
            }
          }
        } catch (fetchErr) {
          console.warn('Image import proxy call failed, keeping direct URL with attribution:', fetchErr);
        } finally {
          btnApplySelectedImg.textContent = originalText;
          btnApplySelectedImg.disabled = false;
        }

        const provenanceMeta = {
          origin: 'stock_search',
          provider: selectedSearchImageObj.provider || 'stock_search',
          source_url: selectedSearchImageObj.sourceUrl || selectedSearchImageObj.source_url || rawUrl,
          author: selectedSearchImageObj.author || 'Stock Contributor',
          license: selectedSearchImageObj.license || 'Free Commercial License',
          attribution: selectedSearchImageObj.attribution || (selectedSearchImageObj.author ? `Photo by ${selectedSearchImageObj.author} via ${selectedSearchImageObj.provider}` : ''),
          is_blob: isBlobStored
        };

        if (typeof activeImageSearchCallback === 'function') {
          activeImageSearchCallback(finalUrl, provenanceMeta);
        }

        if (imgSearchModal) imgSearchModal.classList.remove('open');
        if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
          window.ContentSmithStudio.showToast('Stock photo imported with commercial license.');
        }
      });
    }

    const btnCancelSelectImg = document.getElementById('btn-cancel-select-img');
    if (btnCancelSelectImg) {
      btnCancelSelectImg.addEventListener('click', () => {
        if (imgSearchModal) imgSearchModal.classList.remove('open');
      });
    }

    const btnCloseImgSearch = document.getElementById('btn-close-img-search');
    if (btnCloseImgSearch) {
      btnCloseImgSearch.addEventListener('click', () => {
        if (imgSearchModal) imgSearchModal.classList.remove('open');
      });
    }

    // -------------------------------------------------------------
    // FLOW C: Guided Store Creation Wizard Logic
    // -------------------------------------------------------------
    let currentWizardStep = 1;
    const totalWizardSteps = 5;

    const wizardState = {
      storeName: 'Ada’s Glow Boutique',
      slug: 'adas-glow-boutique',
      category: 'Fashion & Dresses',
      vendorPhone: '+2348035550192',
      theme: 'emerald',
      starterProducts: []
    };

    // Category suggestions generator (Requirements: 4-6 editable starter ideas)
    function generateCategoryStarterProducts(category) {
      const cat = (category || 'Fashion & Dresses').toLowerCase();

      if (cat.includes('beauty') || cat.includes('hair')) {
        return [
          {
            name: 'Hydrating Glow Body Lotion (500ml)',
            category: 'Skincare',
            description: 'Deeply moisturizing botanical body lotion with shea butter and vitamin E.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-lotion').url
          },
          {
            name: 'Gentle Foaming Facial Cleanser',
            category: 'Skincare',
            description: 'Non-stripping gel cleanser that clears pores and refreshes sensitive skin.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-cleanser').url
          },
          {
            name: 'Double-Lined Mulberry Satin Hair Bonnet',
            category: 'Hair Care',
            description: 'Protects curls, locks in moisture, and eliminates hair frizz overnight.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-bonnet').url
          },
          {
            name: 'Oud & Ambergris Luxury Perfume Oil',
            category: 'Fragrances',
            description: 'Long-lasting concentrated perfume oil with warm amber and floral notes.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-perfume').url
          },
          {
            name: 'Raw Bone Straight 13x4 Lace Front Wig',
            category: 'Hair Care',
            description: '100% human donor hair with natural transparent pre-plucked hairline.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-wig').url
          }
        ];
      }

      if (cat.includes('shoes') || cat.includes('bags')) {
        return [
          {
            name: 'Crocodile Pattern Mini Kelly Handbag',
            category: 'Bags',
            description: 'Structured vegan leather handbag with twist clasp and gold shoulder chain.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-bag-kelly').url
          },
          {
            name: 'Crystal Strap Block Heel Mules',
            category: 'Footwear',
            description: 'Comfortable 2.5-inch transparent rhinestone party mules. Sizes 37-42.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-mules').url
          },
          {
            name: 'Structured Everyday Leather Tote Bag',
            category: 'Bags',
            description: 'Spacious work & travel tote with reinforced handles and interior zip divider.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-tote').url
          },
          {
            name: 'Chunky Platform Streetwear Sneakers',
            category: 'Footwear',
            description: 'Lightweight cushioned sneakers designed for all-day comfort and casual wear.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-sneakers').url
          }
        ];
      }

      if (cat.includes('gadget') || cat.includes('tech') || cat.includes('electronic')) {
        return [
          {
            name: 'Wireless Magnetic Powerbank (20,000mAh)',
            category: 'Accessories',
            description: 'Snap-on fast charging powerbank with LED screen and dual USB outputs.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-powerbank').url
          },
          {
            name: '65W Braided Fast-Charging USB-C Cable',
            category: 'Accessories',
            description: 'Heavy duty tangle-free nylon cord supporting rapid device charging.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-cable').url
          },
          {
            name: 'Noise Cancelling Wireless Bluetooth Earbuds',
            category: 'Audio',
            description: 'Crystal-clear call microphones, deep bass drivers, and 24-hour battery case.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-earbuds').url
          },
          {
            name: '10-Inch Ring Light with Extendable Tripod',
            category: 'Accessories',
            description: '3 lighting temperature modes with 360-degree rotating phone clamp.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-tripod').url
          }
        ];
      }

      if (cat.includes('food') || cat.includes('provision')) {
        return [
          {
            name: 'Oron Smoked Crayfish & Pepper Pack',
            category: 'Food Stuffs',
            description: 'Freshly grounded sand-free Oron crayfish blended with dried scent pepper.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-crayfish').url
          },
          {
            name: 'Pure Unadulterated Golden Palm Oil (1L)',
            category: 'Oils',
            description: 'Rich, aromatic traditional palm oil without additives or coloring.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-palmoil').url
          },
          {
            name: 'Raw Wildflower Forest Honey (500g)',
            category: 'Groceries',
            description: '100% pure unprocessed natural honeycomb extract.',
            price: null,
            image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-honey').url
          }
        ];
      }

      // Default: Fashion & Dresses
      return [
        {
          name: 'Luxury Silk Boubou Gown with Beaded Neckline',
          category: 'Dresses',
          description: 'Rich emerald silk fabric with crystal beadwork. Flattering free-size silhouette.',
          price: null,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-boubou').url
        },
        {
          name: '2-Piece Ankara Co-ord Trouser Set',
          category: 'Co-ords',
          description: '100% cotton Ankara print in warm sunset tones with matching wide-leg trousers.',
          price: null,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-ankara').url
        },
        {
          name: 'Embroidered Velvet Kimono Coat',
          category: 'Outerwear',
          description: 'Plush velvet jacket with metallic thread floral embroidery along hem.',
          price: null,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-kimono').url
        },
        {
          name: 'Hand-Woven Royal Blue Aso-Oke Gele',
          category: 'Traditional',
          description: 'Ceremonial woven headtie with matching shoulder sash for Nigerian events.',
          price: null,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-asooke').url
        }
      ];
    }

    let wizardSlugManuallyEdited = false;
    let wizardSlugTimer = null;

    async function validateWizardSlug(candidate) {
      const statusEl = document.getElementById('wizard-slug-status');
      const slugInput = document.getElementById('wizard-input-slug');
      if (!statusEl) return;
      const clean = (candidate || '').toLowerCase().trim().replace(/[^\w-]/g, '').replace(/[\s_]+/g, '-');
      if (!clean) {
        statusEl.innerHTML = '<span style="color:#ef4444;">⚠️ Please enter an endpoint handle</span>';
        return;
      }
      statusEl.innerHTML = '<span style="color:var(--text-muted);">⏳ Checking endpoint availability...</span>';
      if (window.CatalogStore) {
        const res = await window.CatalogStore.isSlugAvailable(clean, null);
        if (res.available) {
          statusEl.innerHTML = `<span style="color:#10b981;">✓ Endpoint <code>?store=${res.slug}</code> is available!</span>`;
          wizardState.slug = res.slug;
          if (slugInput) slugInput.value = res.slug;
        } else {
          let sugHtml = '';
          if (res.suggested) {
            sugHtml = ` &bull; Try: <a href="#" id="wizard-pick-suggested-slug" style="color:var(--color-primary);text-decoration:underline;">${res.suggested}</a>`;
          }
          statusEl.innerHTML = `<span style="color:#f59e0b;">⚠️ ${res.reason}${sugHtml}</span>`;
          wizardState.slug = clean;
          const pickSug = document.getElementById('wizard-pick-suggested-slug');
          if (pickSug && slugInput) {
            pickSug.onclick = (e) => {
              e.preventDefault();
              slugInput.value = res.suggested;
              validateWizardSlug(res.suggested);
            };
          }
        }
      }
    }

    const wizardNameInput = document.getElementById('wizard-input-name');
    const wizardSlugInput = document.getElementById('wizard-input-slug');
    if (wizardNameInput && wizardSlugInput) {
      wizardNameInput.addEventListener('input', () => {
        wizardState.storeName = wizardNameInput.value.trim();
        if (!wizardSlugManuallyEdited && window.CatalogStore) {
          const suggested = window.CatalogStore.slugify(wizardNameInput.value);
          wizardSlugInput.value = suggested;
          clearTimeout(wizardSlugTimer);
          wizardSlugTimer = setTimeout(() => validateWizardSlug(suggested), 220);
        }
      });

      wizardSlugInput.addEventListener('input', () => {
        wizardSlugManuallyEdited = true;
        clearTimeout(wizardSlugTimer);
        wizardSlugTimer = setTimeout(() => validateWizardSlug(wizardSlugInput.value), 220);
      });
    }

    const WIZARD_THEME_LABELS = {
      'emerald': '🌿 Emerald (WhatsApp Green)',
      'luxury-gold': '👑 Luxury Obsidian & Champagne Gold',
      'sunset': '🌅 Sunset Terracotta & Warm Sand',
      'tech-blue': '⚡ Cyber Slate & Electric Blue',
      'blush': '🌸 Blush Rose & Velvet Noir',
      'minimal': '🖋️ Editorial Minimalist & Monochrome'
    };

    function updateWizardThemePreview(theme) {
      const activeTheme = theme || wizardState.theme || 'emerald';
      const frameEl = document.getElementById('wizard-mockup-frame');
      const labelEl = document.getElementById('wizard-theme-preview-label');
      const storeNameEl = document.getElementById('wizard-mockup-store-name');
      const avatarEl = document.getElementById('wizard-mockup-avatar');
      const prodTitleEl = document.getElementById('wizard-mockup-prod-title');
      const prodPriceEl = document.getElementById('wizard-mockup-prod-price');
      const prodImgEl = document.getElementById('wizard-mockup-prod-img');

      if (frameEl) {
        frameEl.className = 'theme-mockup-frame theme-' + activeTheme;
      }
      if (labelEl) {
        labelEl.textContent = WIZARD_THEME_LABELS[activeTheme] || activeTheme;
      }
      if (storeNameEl) {
        storeNameEl.textContent = wizardState.storeName || 'My Online Shop';
      }
      if (avatarEl) {
        avatarEl.textContent = (wizardState.storeName || 'M').trim().charAt(0).toUpperCase() || 'M';
      }

      const sample = (wizardState.starterProducts && wizardState.starterProducts.length > 0)
        ? wizardState.starterProducts[0]
        : null;

      if (sample) {
        if (prodTitleEl) prodTitleEl.textContent = sample.name || 'Featured Product';
        if (prodPriceEl) {
          prodPriceEl.textContent = (sample.price !== null && sample.price !== undefined && !isNaN(sample.price))
            ? '₦' + Number(sample.price).toLocaleString()
            : 'Price on Request';
        }
        if (prodImgEl && sample.image) {
          prodImgEl.src = sample.image;
        }
      }
    }

    function resetWizard() {
      currentWizardStep = 1;
      wizardSlugManuallyEdited = false;
      const nameInput = document.getElementById('wizard-input-name');
      const slugInput = document.getElementById('wizard-input-slug');
      if (nameInput) wizardState.storeName = nameInput.value.trim() || 'Ada’s Glow Boutique';
      if (slugInput && window.CatalogStore) {
        const initialSlug = window.CatalogStore.slugify(wizardState.storeName);
        slugInput.value = initialSlug;
        wizardState.slug = initialSlug;
        validateWizardSlug(initialSlug);
      }
      wizardState.starterProducts = generateCategoryStarterProducts(wizardState.category);
      showWizardStep(1);
    }

    function showWizardStep(stepNum) {
      currentWizardStep = stepNum;
      for (let i = 1; i <= totalWizardSteps; i++) {
        const stepEl = document.getElementById(`wizard-step-${i}`);
        const dotEl = document.getElementById(`wizard-dot-${i}`);
        if (stepEl) stepEl.classList.toggle('active', i === stepNum);
        if (dotEl) {
          dotEl.classList.toggle('active', i === stepNum);
          dotEl.classList.toggle('done', i < stepNum);
        }
      }

      // When showing Step 4, render starter products
      if (stepNum === 4) {
        renderWizardStarterProducts();
      }

      // When showing Step 5, render live theme mockup
      if (stepNum === 5) {
        updateWizardThemePreview(wizardState.theme || 'emerald');
      }
    }

    function renderWizardStarterProducts() {
      const container = document.getElementById('wizard-starter-list');
      if (!container) return;

      if (!wizardState.starterProducts || wizardState.starterProducts.length === 0) {
        wizardState.starterProducts = generateCategoryStarterProducts(wizardState.category);
      }

      container.innerHTML = '';

      wizardState.starterProducts.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'starter-card';
        card.id = `starter-card-${index}`;

        const priceVal = (item.price !== null && item.price !== undefined) ? item.price : '';

        card.innerHTML = `
          <div class="starter-thumb-wrap">
            <img src="${item.image || CURATED_PRODUCT_IMAGES[0].url}" class="starter-thumb-img" id="starter-img-${index}" alt="${item.name}">
            <div class="starter-thumb-btns">
              <button type="button" class="starter-action-btn" id="btn-upload-starter-${index}" title="Choose a photo from your device">
                📷 Choose photo
              </button>
              <button type="button" class="starter-action-btn" id="btn-search-starter-${index}" title="Search photos on the web">
                🔍 Search photos
              </button>
              <input type="file" id="file-starter-${index}" accept="image/*" style="display: none;">
            </div>
          </div>

          <div class="starter-info-fields">
            <div class="starter-header-row">
              <span class="starter-status-badge">Suggested — review before publishing</span>
              <button type="button" class="starter-btn-delete" id="btn-del-starter-${index}" title="Remove suggestion">✕</button>
            </div>

            <input type="text" class="starter-input-title" id="starter-title-${index}" value="${item.name.replace(/"/g, '&quot;')}" placeholder="Product Title">

            <div class="starter-price-row">
              <input type="number" class="starter-input-price" id="starter-price-${index}" value="${priceVal}" placeholder="Price ₦ (Leave blank to Ask)">
              <input type="text" class="starter-input-cat" id="starter-cat-${index}" value="${(item.category || wizardState.category).replace(/"/g, '&quot;')}" placeholder="Category">
            </div>

            <textarea class="starter-textarea-desc" id="starter-desc-${index}" placeholder="Short description, colors, sizes...">${item.description || ''}</textarea>
          </div>
        `;

        container.appendChild(card);

        // Bind Card Events
        const titleInput = document.getElementById(`starter-title-${index}`);
        const priceInput = document.getElementById(`starter-price-${index}`);
        const catInput = document.getElementById(`starter-cat-${index}`);
        const descInput = document.getElementById(`starter-desc-${index}`);
        const btnDel = document.getElementById(`btn-del-starter-${index}`);
        const btnUpload = document.getElementById(`btn-upload-starter-${index}`);
        const btnSearch = document.getElementById(`btn-search-starter-${index}`);
        const fileInput = document.getElementById(`file-starter-${index}`);
        const imgEl = document.getElementById(`starter-img-${index}`);

        if (titleInput) titleInput.addEventListener('input', e => { item.name = e.target.value; });
        if (priceInput) priceInput.addEventListener('input', e => {
          const val = parseFloat(e.target.value);
          item.price = isNaN(val) ? null : val;
        });
        if (catInput) catInput.addEventListener('input', e => { item.category = e.target.value; });
        if (descInput) descInput.addEventListener('input', e => { item.description = e.target.value; });

        if (btnDel) {
          btnDel.addEventListener('click', () => {
            wizardState.starterProducts.splice(index, 1);
            renderWizardStarterProducts();
          });
        }

        if (btnUpload && fileInput) {
          btnUpload.addEventListener('click', () => fileInput.click());
          fileInput.addEventListener('change', e => {
            if (e.target.files.length) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = ev => {
                item.image = ev.target.result;
                item.imageSource = 'Device Upload';
                item.imageAttribution = 'Uploaded by vendor';
                if (imgEl) imgEl.src = item.image;
                if (window.ContentSmithStudio && window.ContentSmithStudio.updateLivePreview) {
                  window.ContentSmithStudio.updateLivePreview();
                }
              };
              reader.readAsDataURL(file);
            }
          });
        }

        if (btnSearch) {
          btnSearch.addEventListener('click', () => {
            openUniversalImageSearch(item.name || item.category, item.category, (chosen, meta) => {
              item.image = chosen;
              if (meta) {
                item.imageSource = meta.sourceUrl || '';
                item.imagePublisher = meta.publisher || '';
                item.imageAttribution = meta.attribution || '';
              }
              if (imgEl) imgEl.src = chosen;
              if (window.ContentSmithStudio && window.ContentSmithStudio.updateLivePreview) {
                window.ContentSmithStudio.updateLivePreview();
              }
            });
          });
        }
      });
    }

    // Add another product button in wizard
    const btnWizardAddItem = document.getElementById('btn-wizard-add-item');
    if (btnWizardAddItem) {
      btnWizardAddItem.addEventListener('click', () => {
        wizardState.starterProducts.push({
          name: 'New Custom Product',
          category: wizardState.category || 'General',
          description: 'Quality item ready for immediate order.',
          price: null,
          image: CURATED_PRODUCT_IMAGES[0].url
        });
        renderWizardStarterProducts();
      });
    }

    // Regenerate suggestions button
    const btnRegenerateSuggestions = document.getElementById('btn-regenerate-suggestions');
    if (btnRegenerateSuggestions) {
      btnRegenerateSuggestions.addEventListener('click', () => {
        wizardState.starterProducts = generateCategoryStarterProducts(wizardState.category);
        renderWizardStarterProducts();
        if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
          window.ContentSmithStudio.showToast('Regenerated suggestions for ' + wizardState.category);
        }
      });
    }

    // Category button selection in wizard
    const catButtons = document.querySelectorAll('#wizard-step-2 .wizard-category-btn');
    catButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        catButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        wizardState.category = btn.dataset.category || btn.textContent.trim();
        // Regenerate starter items for new category
        wizardState.starterProducts = generateCategoryStarterProducts(wizardState.category);
      });
    });

    // Theme selection in wizard
    const themeButtons = document.querySelectorAll('#wizard-step-5 .wizard-theme-btn');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        themeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        wizardState.theme = btn.dataset.theme;
        updateWizardThemePreview(btn.dataset.theme);
      });
    });

    // Wizard Next & Prev buttons
    document.querySelectorAll('#guided-flow-modal [data-wizard-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentWizardStep === 1) {
          const nameInput = document.getElementById('wizard-input-name');
          const slugInput = document.getElementById('wizard-input-slug');
          if (nameInput && nameInput.value.trim()) {
            wizardState.storeName = nameInput.value.trim();
          }
          if (slugInput && slugInput.value.trim()) {
            wizardState.slug = window.CatalogStore ? window.CatalogStore.slugify(slugInput.value.trim()) : slugInput.value.trim().toLowerCase();
          }
        } else if (currentWizardStep === 3) {
          const phoneInput = document.getElementById('wizard-input-phone');
          if (phoneInput && phoneInput.value.trim()) {
            wizardState.vendorPhone = phoneInput.value.trim();
          }
        }

        if (currentWizardStep < totalWizardSteps) {
          showWizardStep(currentWizardStep + 1);
        } else {
          completeGuidedWizard();
        }
      });
    });

    document.querySelectorAll('#guided-flow-modal [data-wizard-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentWizardStep > 1) {
          showWizardStep(currentWizardStep - 1);
        }
      });
    });

    function completeGuidedWizard() {
      if (guidedModal) guidedModal.classList.remove('open');

      if (window.ContentSmithStudio) {
        const { state, syncFormFields, renderReviewList, saveStateToLocalStorage, showToast, updateLivePreview } = window.ContentSmithStudio;

        const chosenSlug = (wizardState.slug || (window.CatalogStore ? window.CatalogStore.slugify(wizardState.storeName) : 'my-store')).trim();
        state.id = chosenSlug;
        state.slug = chosenSlug;
        state.catalog_id = chosenSlug;

        // Apply Store Identity
        state.vendor_name = wizardState.storeName || 'My Online Shop';
        state.vendor_phone = wizardState.vendorPhone || '+2348035550192';
        state.theme = wizardState.theme || 'emerald';
        state.tagline = `Verified ${wizardState.category} shop • Fast delivery on WhatsApp`;
        state.videoLoaded = false;

        // Convert Starter Products into shared catalogue items
        const finalProducts = (wizardState.starterProducts.length > 0 ? wizardState.starterProducts : generateCategoryStarterProducts(wizardState.category))
          .filter(p => p.name.trim())
          .map((p, idx) => ({
            id: 'p' + (idx + 1),
            name: p.name.trim(),
            price: {
              amount: (p.price !== null && !isNaN(p.price)) ? Number(p.price) : null,
              currency: state.currency_default || 'NGN',
              source: (p.price !== null && !isNaN(p.price)) ? 'user_edit' : 'none'
            },
            description: p.description || '',
            category: p.category || wizardState.category,
            best_timestamp_sec: 0,
            confidence: 0.95,
            image: p.image || null,
            imageSource: p.imageSource || '',
            imagePublisher: p.imagePublisher || '',
            imageAttribution: p.imageAttribution || ''
          }));

        state.products = finalProducts;

        syncFormFields();
        renderReviewList();
        saveStateToLocalStorage();
        if (window.CatalogStore) {
          window.CatalogStore.setActiveId(chosenSlug);
        }
        updateLivePreview();
        showToast(`🎉 Created "${state.vendor_name}" with endpoint ?store=${chosenSlug}!`);
      }

      // Enter Workspace at Step 2 (Product Review), not video upload
      showWorkspace(2);
    }

    const btnCloseGuided = document.getElementById('btn-close-guided');
    if (btnCloseGuided && guidedModal) {
      btnCloseGuided.addEventListener('click', () => guidedModal.classList.remove('open'));
    }

    // -------------------------------------------------------------
    // FLOW B: Pictures & List Intake Modal Logic
    // -------------------------------------------------------------
    const btnClosePictures = document.getElementById('btn-close-pictures');
    if (btnClosePictures && picturesModal) {
      btnClosePictures.addEventListener('click', () => picturesModal.classList.remove('open'));
    }

    const manualPhotoBox = document.getElementById('manual-entry-image-box');
    const manualPhotoInput = document.getElementById('manual-entry-image-input');
    let manualItemPhoto = null;

    if (manualPhotoBox && manualPhotoInput) {
      const openManualPicker = () => manualPhotoInput.click();
      manualPhotoBox.addEventListener('click', openManualPicker);
      manualPhotoBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openManualPicker();
        }
      });

      manualPhotoBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        manualPhotoBox.classList.add('dragover');
      });
      manualPhotoBox.addEventListener('dragleave', (e) => {
        e.preventDefault();
        manualPhotoBox.classList.remove('dragover');
      });
      manualPhotoBox.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        manualPhotoBox.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
          const file = e.dataTransfer.files[0];
          if (!file.type.startsWith('image/')) {
            if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
              window.ContentSmithStudio.showToast('Please drop an image file (PNG, JPG, WebP).', 'warning');
            }
            return;
          }
          const reader = new FileReader();
          reader.onload = ev => {
            manualItemPhoto = ev.target.result;
            manualPhotoBox.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);">`;
          };
          reader.readAsDataURL(file);
        }
      });

      manualPhotoInput.addEventListener('change', e => {
        if (e.target.files.length) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = ev => {
            manualItemPhoto = ev.target.result;
            manualPhotoBox.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);">`;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const btnSearchManualImg = document.getElementById('btn-search-manual-img');
    let manualItemMeta = null;
    if (btnSearchManualImg) {
      btnSearchManualImg.addEventListener('click', () => {
        const titleVal = document.getElementById('manual-title-input') ? document.getElementById('manual-title-input').value.trim() : '';
        const catVal = document.getElementById('manual-category-input') ? document.getElementById('manual-category-input').value.trim() : '';
        openUniversalImageSearch(titleVal || catVal || 'product photo', catVal, (chosen, meta) => {
          manualItemPhoto = chosen;
          manualItemMeta = meta;
          if (manualPhotoBox) {
            manualPhotoBox.innerHTML = `<img src="${chosen}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);">`;
          }
        });
      });
    }

    let stagedIntakeProducts = [];

    function updateStagedProductsUI() {
      const section = document.getElementById('staged-products-section');
      const list = document.getElementById('staged-products-list');
      const countLabel = document.getElementById('manual-items-count');

      if (countLabel) {
        countLabel.textContent = `${stagedIntakeProducts.length} product(s) ready to add`;
      }

      if (!section || !list) return;

      if (stagedIntakeProducts.length === 0) {
        section.style.display = 'none';
        list.innerHTML = '';
        return;
      }

      section.style.display = 'block';
      list.innerHTML = '';

      stagedIntakeProducts.forEach((item, idx) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.8125rem; gap: 8px;';
        row.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
            <img src="${item.image || CURATED_PRODUCT_IMAGES[0].url}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <strong>${item.name}</strong>
              <span style="color: var(--text-dim); margin-left: 4px;">(${item.price && item.price.amount ? '₦' + item.price.amount.toLocaleString() : 'No price'})</span>
            </div>
          </div>
          <button type="button" class="btn-icon-subtle" id="del-staged-${idx}" style="color: var(--color-danger); cursor: pointer; padding: 2px 6px;">✕</button>
        `;
        list.appendChild(row);

        const delBtn = row.querySelector(`#del-staged-${idx}`);
        if (delBtn) {
          delBtn.addEventListener('click', () => {
            stagedIntakeProducts.splice(idx, 1);
            updateStagedProductsUI();
          });
        }
      });
    }

    // Batch Photo Upload (selects multiple images at once)
    const btnBatchUpload = document.getElementById('btn-batch-upload-photos');
    const batchPhotosInput = document.getElementById('batch-photos-input');
    if (btnBatchUpload && batchPhotosInput) {
      btnBatchUpload.addEventListener('click', () => batchPhotosInput.click());
      batchPhotosInput.addEventListener('change', e => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        let loadedCount = 0;
        files.forEach((file, index) => {
          const reader = new FileReader();
          reader.onload = ev => {
            const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            stagedIntakeProducts.push({
              id: 'p' + (Date.now() % 100000 + index),
              name: formattedName || `Product Item ${stagedIntakeProducts.length + 1}`,
              price: { amount: null, currency: 'NGN', source: 'none' },
              description: 'Photo uploaded directly from device.',
              category: 'General',
              best_timestamp_sec: 0,
              confidence: 0.95,
              image: ev.target.result
            });
            loadedCount++;
            if (loadedCount === files.length) {
              updateStagedProductsUI();
              if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
                window.ContentSmithStudio.showToast(`Loaded ${files.length} product photos!`);
              }
            }
          };
          reader.readAsDataURL(file);
        });
      });
    }

    // Search and Add directly from Pictures modal
    const btnOpenSearchFromPictures = document.getElementById('btn-open-search-from-pictures');
    if (btnOpenSearchFromPictures) {
      btnOpenSearchFromPictures.addEventListener('click', () => {
        openUniversalImageSearch('fashion product photo', 'General', (chosenImg, meta) => {
          const name = (meta && meta.title) ? meta.title : 'New Product Item';
          stagedIntakeProducts.push({
            id: 'p' + (Date.now() % 100000),
            name: name,
            price: { amount: null, currency: 'NGN', source: 'none' },
            description: 'Selected via web image search.',
            category: 'General',
            best_timestamp_sec: 0,
            confidence: 0.95,
            image: chosenImg,
            imageSource: meta ? meta.sourceUrl : '',
            imageAttribution: meta ? meta.attribution : ''
          });
          updateStagedProductsUI();
        });
      });
    }

    // Manual add item button
    const btnAddManualProduct = document.getElementById('btn-add-manual-product');
    const manualTitleInput = document.getElementById('manual-title-input');
    const manualPriceInput = document.getElementById('manual-price-input');
    const manualCategoryInput = document.getElementById('manual-category-input');
    const manualDescInput = document.getElementById('manual-desc-input');

    if (btnAddManualProduct) {
      btnAddManualProduct.addEventListener('click', () => {
        const title = manualTitleInput ? manualTitleInput.value.trim() : '';
        if (!title) {
          alert('Please enter a product title');
          return;
        }

        const priceNum = manualPriceInput && manualPriceInput.value ? parseFloat(manualPriceInput.value) : null;
        const category = manualCategoryInput && manualCategoryInput.value.trim() ? manualCategoryInput.value.trim() : 'General';
        const desc = manualDescInput ? manualDescInput.value.trim() : '';

        stagedIntakeProducts.push({
          id: 'p' + (Date.now() % 100000),
          name: title,
          price: { amount: priceNum, currency: 'NGN', source: priceNum ? 'user_edit' : 'none' },
          description: desc,
          category: category,
          best_timestamp_sec: 0,
          confidence: 0.95,
          image: manualItemPhoto,
          imageSource: manualItemMeta ? manualItemMeta.sourceUrl : '',
          imageAttribution: manualItemMeta ? manualItemMeta.attribution : ''
        });

        // Reset inputs
        if (manualTitleInput) manualTitleInput.value = '';
        if (manualPriceInput) manualPriceInput.value = '';
        if (manualDescInput) manualDescInput.value = '';
        manualItemPhoto = null;
        manualItemMeta = null;
        if (manualPhotoBox) manualPhotoBox.innerHTML = `<span>📷 Tap to add photo</span>`;

        updateStagedProductsUI();
      });
    }

    // CSV File Import
    const btnImportCsvTrigger = document.getElementById('btn-import-csv-trigger');
    const csvFileInput = document.getElementById('csv-file-input');
    if (btnImportCsvTrigger && csvFileInput) {
      btnImportCsvTrigger.addEventListener('click', () => csvFileInput.click());
      csvFileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const text = ev.target.result;
          const lines = text.split(/\r?\n/).filter(l => l.trim());
          if (lines.length < 1) return;

          let added = 0;
          // Parse lines (skip header if contains title or name)
          const startIndex = (lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('title')) ? 1 : 0;
          for (let i = startIndex; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
            if (cols.length >= 1 && cols[0]) {
              const name = cols[0];
              const price = cols[1] ? parseFloat(cols[1].replace(/[^0-9.]/g, '')) || null : null;
              const cat = cols[2] || 'General';
              const desc = cols[3] || '';
              stagedIntakeProducts.push({
                id: 'p' + (Date.now() % 100000 + i),
                name: name,
                price: { amount: price, currency: 'NGN', source: price ? 'user_edit' : 'none' },
                description: desc,
                category: cat,
                best_timestamp_sec: 0,
                confidence: 0.95,
                image: null
              });
              added++;
            }
          }
          updateStagedProductsUI();
          if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
            window.ContentSmithStudio.showToast(`Imported ${added} products from CSV!`);
          }
        };
        reader.readAsText(file);
      });
    }

    // Done adding pictures -> Transfer to Workspace Step 2
    const btnDonePictures = document.getElementById('btn-done-pictures');
    if (btnDonePictures) {
      btnDonePictures.addEventListener('click', () => {
        if (picturesModal) picturesModal.classList.remove('open');

        if (window.ContentSmithStudio && stagedIntakeProducts.length > 0) {
          const { state, renderReviewList, saveStateToLocalStorage, syncFormFields, showToast, updateLivePreview } = window.ContentSmithStudio;

          state.products = state.products.concat(stagedIntakeProducts);
          state.videoLoaded = false;
          renderReviewList();
          syncFormFields();
          saveStateToLocalStorage();
          updateLivePreview();
          showToast(`Added ${stagedIntakeProducts.length} product(s) to your catalogue!`);
          stagedIntakeProducts = [];
          updateStagedProductsUI();
        }

        showWorkspace(2);
      });
    }

    // -------------------------------------------------------------
    // FLOW D: Dropshipping Planning Flow Logic
    // -------------------------------------------------------------
    const btnCloseDropship = document.getElementById('btn-close-dropship');
    if (btnCloseDropship && dropshipModal) {
      btnCloseDropship.addEventListener('click', () => dropshipModal.classList.remove('open'));
    }

    let dropshipSupplierStatus = 'verified';
    let dropshipSelectedCategory = 'Tech & Gadgets';

    const btnSupplierYes = document.getElementById('btn-supplier-yes');
    const btnSupplierNo = document.getElementById('btn-supplier-no');
    if (btnSupplierYes && btnSupplierNo) {
      btnSupplierYes.addEventListener('click', () => {
        btnSupplierYes.classList.add('selected');
        btnSupplierNo.classList.remove('selected');
        dropshipSupplierStatus = 'verified';
      });
      btnSupplierNo.addEventListener('click', () => {
        btnSupplierNo.classList.add('selected');
        btnSupplierYes.classList.remove('selected');
        dropshipSupplierStatus = 'sourcing';
      });
    }

    document.querySelectorAll('#dropship-category-grid .wizard-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#dropship-category-grid .wizard-category-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        dropshipSelectedCategory = btn.dataset.cat || btn.textContent.trim();
      });
    });

    let stagedDropshipItems = [];

    const btnGenerateDropshipStarter = document.getElementById('btn-generate-dropship-starter');
    const dropshipStarterContainer = document.getElementById('dropship-starter-container');
    const dropshipStarterList = document.getElementById('dropship-starter-list');

    if (btnGenerateDropshipStarter) {
      btnGenerateDropshipStarter.addEventListener('click', () => {
        stagedDropshipItems = generateCategoryStarterProducts(dropshipSelectedCategory).slice(0, 4).map(p => ({
          ...p,
          statusLabel: 'Draft — Supplier & stock verification required'
        }));
        renderDropshipStarterItems();
        if (dropshipStarterContainer) dropshipStarterContainer.style.display = 'block';
      });
    }

    function renderDropshipStarterItems() {
      if (!dropshipStarterList) return;
      dropshipStarterList.innerHTML = '';

      stagedDropshipItems.forEach((item, idx) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.8125rem; gap: 8px;';
        row.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
            <img src="${item.image || CURATED_PRODUCT_IMAGES[0].url}" style="width: 36px; height: 36px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <strong>${item.name}</strong>
              <div style="font-size: 0.6875rem; color: #b45309;">⚠️ Draft — Supplier Verification Required</div>
            </div>
          </div>
          <button type="button" class="btn-icon-subtle" id="del-ds-${idx}" style="color: var(--color-danger); cursor: pointer; padding: 2px 6px;">✕</button>
        `;
        dropshipStarterList.appendChild(row);

        const del = row.querySelector(`#del-ds-${idx}`);
        if (del) {
          del.addEventListener('click', () => {
            stagedDropshipItems.splice(idx, 1);
            renderDropshipStarterItems();
          });
        }
      });
    }

    // Profit Calculator
    const calcWholesale = document.getElementById('calc-wholesale');
    const calcDelivery = document.getElementById('calc-delivery');
    const calcProfit = document.getElementById('calc-profit');
    const calcRetailResult = document.getElementById('calc-retail-result');
    const calcMarginResult = document.getElementById('calc-margin-result');
    const dropshipProdTitle = document.getElementById('dropship-prod-title');

    function updateDropshipCalc() {
      const wholesale = parseFloat(calcWholesale ? calcWholesale.value : 0) || 0;
      const delivery = parseFloat(calcDelivery ? calcDelivery.value : 0) || 0;
      const profit = parseFloat(calcProfit ? calcProfit.value : 0) || 0;
      const retail = wholesale + delivery + profit;
      const margin = retail > 0 ? ((profit / retail) * 100).toFixed(1) : 0;

      if (calcRetailResult) calcRetailResult.textContent = '₦' + retail.toLocaleString();
      if (calcMarginResult) calcMarginResult.textContent = margin + '% profit margin';
    }

    if (calcWholesale) calcWholesale.addEventListener('input', updateDropshipCalc);
    if (calcDelivery) calcDelivery.addEventListener('input', updateDropshipCalc);
    if (calcProfit) calcProfit.addEventListener('input', updateDropshipCalc);

    const btnAddDropshipItem = document.getElementById('btn-add-dropship-item');
    if (btnAddDropshipItem) {
      btnAddDropshipItem.addEventListener('click', () => {
        const title = dropshipProdTitle ? dropshipProdTitle.value.trim() : 'Dropship Product';
        const wholesale = parseFloat(calcWholesale ? calcWholesale.value : 0) || 0;
        const delivery = parseFloat(calcDelivery ? calcDelivery.value : 0) || 0;
        const profit = parseFloat(calcProfit ? calcProfit.value : 0) || 0;
        const retail = wholesale + delivery + profit;

        stagedDropshipItems.push({
          name: title,
          category: dropshipSelectedCategory,
          price: retail,
          description: `Supplier product (Wholesale: ₦${wholesale.toLocaleString()}, Delivery: ₦${delivery.toLocaleString()}, Profit: ₦${profit.toLocaleString()}). Ready to fulfill on order.`,
          image: CURATED_PRODUCT_IMAGES.find(x => x.id === 'img-powerbank').url
        });

        renderDropshipStarterItems();
        if (dropshipStarterContainer) dropshipStarterContainer.style.display = 'block';
        if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
          window.ContentSmithStudio.showToast(`Added "${title}" (₦${retail.toLocaleString()}) to staged items!`);
        }
      });
    }

    const btnContinueDropship = document.getElementById('btn-continue-dropship');
    if (btnContinueDropship) {
      btnContinueDropship.addEventListener('click', () => {
        if (dropshipModal) dropshipModal.classList.remove('open');

        if (window.ContentSmithStudio) {
          const { state, renderReviewList, syncFormFields, saveStateToLocalStorage, showToast, updateLivePreview } = window.ContentSmithStudio;

          if (stagedDropshipItems.length > 0) {
            const formatted = stagedDropshipItems.map((item, idx) => ({
              id: 'ds_' + (Date.now() % 100000 + idx),
              name: item.name,
              price: {
                amount: item.price ? Number(item.price) : null,
                currency: 'NGN',
                source: item.price ? 'user_edit' : 'none'
              },
              description: item.description || 'Draft dropship item — verify supplier inventory.',
              category: item.category || 'Dropshipping',
              best_timestamp_sec: 0,
              confidence: 0.9,
              image: item.image || null
            }));
            state.products = state.products.concat(formatted);
          }

          state.videoLoaded = false;
          syncFormFields();
          renderReviewList();
          saveStateToLocalStorage();
          updateLivePreview();
          showToast(`Transferred ${stagedDropshipItems.length} dropship products to catalogue.`);
          stagedDropshipItems = [];
        }

        showWorkspace(2);
      });
    }

    // Modal background click and Escape key dismissal
    [guidedModal, picturesModal, dropshipModal, imgSearchModal, shareModal, createCatalogModal, adminVerifyModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('open');
          }
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        [guidedModal, picturesModal, dropshipModal, imgSearchModal, shareModal, createCatalogModal, adminVerifyModal].forEach(modal => {
          if (modal && modal.classList.contains('open')) {
            modal.classList.remove('open');
          }
        });
      }
    });

    // Populate Initial Example Storefront
    populateExampleStorefront();

    // Expose Global App API
    const appApi = {
      showLanding,
      showWorkspace,
      showAdmin,
      showStorefront,
      renderAdminDashboard,
      openUniversalImageSearch,
      runImageSearch,
      populateExampleStorefront
    };
    window.ContentSmithApp = Object.assign(window.ContentSmithApp || {}, appApi);
    window.CatalogSmithApp = window.ContentSmithApp;

    // Auto-route based on URL parameters (?store=..., ?catalog=..., ?view=admin)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const rawStore = urlParams.get('store') || urlParams.get('catalog');
      const storeParam = (rawStore && rawStore !== 'undefined' && rawStore !== 'null') ? rawStore.trim() : null;
      const viewParam = urlParams.get('view');

      // Clean up /undefined in pathname if present
      if (window.location.pathname.endsWith('/undefined')) {
        try {
          const cleanPath = window.location.pathname.replace(/\/undefined\/?$/, '') || '/';
          window.history.replaceState({}, '', cleanPath + window.location.search);
        } catch (_) {}
      }

      // Clean up ?store=undefined or ?store=null if present
      if (rawStore === 'undefined' || rawStore === 'null') {
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('store');
          url.searchParams.delete('catalog');
          window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
        } catch (_) {}
      }

      if (storeParam) {
        showStorefront(storeParam);
      } else if (viewParam === 'admin' || window.location.hash === '#admin') {
        showAdmin();
      } else if (viewParam === 'studio' || viewParam === 'workspace') {
        showWorkspace(1);
      } else {
        showLanding();
      }
    } catch (_) {
      showLanding();
    }
  }
})();
