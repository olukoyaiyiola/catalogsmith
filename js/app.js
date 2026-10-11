/**
 * CatalogSmith - Application Controller & Multi-Flow Navigation
 * Manages Landing View, Workspace View, Creation Routes, Dedicated Example Storefront,
 * Category-based Starter Product Generation, and Universal Image Search.
 */

(function () {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });

  function initApp() {
    const landingView = document.getElementById('landing-view');
    const workspaceView = document.getElementById('workspace-view');

    // Modals
    const guidedModal = document.getElementById('guided-flow-modal');
    const picturesModal = document.getElementById('pictures-flow-modal');
    const dropshipModal = document.getElementById('dropship-flow-modal');
    const imgSearchModal = document.getElementById('image-search-modal');

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
  <text x="50" y="385" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="14" fill="#10b981">🏷️ ${category.replace(/&/g, '&amp;')} • VERIFIED CATALOG SHOT</text>
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

    function populateExampleStorefront() {
      const exampleFrame = document.getElementById('example-phone-iframe');
      const heroFrame = document.getElementById('hero-phone-iframe');

      if (!window.CatalogSmithStudio || typeof window.CatalogSmithStudio.generateStorefrontHTML !== 'function') {
        setTimeout(populateExampleStorefront, 150);
        return;
      }

      try {
        // ALWAYS generate from the dedicated fixture to keep landing page example isolated and populated
        const exampleHtml = window.CatalogSmithStudio.generateStorefrontHTML(true, DEDICATED_EXAMPLE_DATA);
        if (exampleFrame) {
          exampleFrame.srcdoc = exampleHtml;
          exampleFrame.setAttribute('srcdoc', exampleHtml);
        }
        if (heroFrame) {
          heroFrame.srcdoc = exampleHtml;
          heroFrame.setAttribute('srcdoc', exampleHtml);
        }
      } catch (err) {
        console.warn('Failed to populate example storefront:', err);
      }
    }

    // -------------------------------------------------------------
    // View Switching Logic
    // -------------------------------------------------------------
    function showLanding() {
      if (workspaceView) workspaceView.style.display = 'none';
      if (landingView) {
        landingView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      populateExampleStorefront();
    }

    function showWorkspace(targetStep = 2) {
      if (landingView) landingView.style.display = 'none';
      if (workspaceView) {
        workspaceView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (window.CatalogSmithStudio) {
        if (typeof window.CatalogSmithStudio.setStep === 'function') {
          window.CatalogSmithStudio.setStep(targetStep);
        }
        if (typeof window.CatalogSmithStudio.updateLivePreview === 'function') {
          window.CatalogSmithStudio.updateLivePreview();
        }
      }
    }

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
      if (window.CatalogSmithStudio && window.CatalogSmithStudio.showToast) {
        window.CatalogSmithStudio.showToast('Select your video or try a sample to start extracting.');
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
    // ROUTE D: Dropshipping Planning Flow
    // -------------------------------------------------------------
    bindCardActivation('card-opt-dropship', 'btn-opt-dropship', () => {
      if (dropshipModal) {
        dropshipModal.classList.add('open');
      } else {
        showWorkspace(2);
      }
    });

    // -------------------------------------------------------------
    // UNIVERSAL IMAGE SEARCH ENGINE MODAL
    // -------------------------------------------------------------
    let activeImageSearchCallback = null;
    let selectedSearchImage = null;

    function openUniversalImageSearch(queryText = '', categoryTag = '', onSelect = null) {
      activeImageSearchCallback = onSelect;
      selectedSearchImage = null;

      const queryInput = document.getElementById('img-search-query');
      const resultsContainer = document.getElementById('img-search-results');
      const statusDiv = document.getElementById('img-search-status');
      const previewBar = document.getElementById('img-search-preview-bar');

      if (queryInput) {
        queryInput.value = (queryText || '').replace(/\(.*\)/g, '').trim();
      }
      if (previewBar) previewBar.style.display = 'none';

      // Perform initial search
      runImageSearch(queryInput ? queryInput.value : '', categoryTag);

      if (imgSearchModal) imgSearchModal.classList.add('open');
    }

    // Expose for studio.js review cards
    window.CatalogSmithApp = window.CatalogSmithApp || {};
    window.CatalogSmithApp.openUniversalImageSearch = openUniversalImageSearch;

    async function runImageSearch(term = '', tag = '') {
      const resultsContainer = document.getElementById('img-search-results');
      const statusDiv = document.getElementById('img-search-status');
      if (!resultsContainer) return;

      resultsContainer.innerHTML = '<div style="grid-column: 1 / -1; padding: 24px; text-align: center; color: var(--text-dim);">Searching product photos...</div>';
      if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.textContent = 'Searching library & creative commons...';
      }

      const q = (term || '').toLowerCase().trim();

      // 1. Filter local curated assets
      let matches = CURATED_PRODUCT_IMAGES.filter(item => {
        if (!q && !tag) return true;
        const matchTag = tag ? item.tag === tag || item.category.toLowerCase().includes(tag.toLowerCase()) : false;
        const matchTitle = q ? item.title.toLowerCase().includes(q) : false;
        const matchCategory = q ? item.category.toLowerCase().includes(q) : false;
        return matchTitle || matchCategory || matchTag;
      });

      // If no exact match, return general fallback products
      if (matches.length === 0) {
        matches = CURATED_PRODUCT_IMAGES.slice(0, 8);
      }

      renderSearchResults(matches);
    }

    function renderSearchResults(items) {
      const resultsContainer = document.getElementById('img-search-results');
      const statusDiv = document.getElementById('img-search-status');
      const previewBar = document.getElementById('img-search-preview-bar');
      const previewImg = document.getElementById('img-search-selected-preview');
      const previewTitle = document.getElementById('img-search-selected-title');
      if (!resultsContainer) return;

      resultsContainer.innerHTML = '';
      if (statusDiv) {
        statusDiv.textContent = `Showing ${items.length} verified product photo suggestions:`;
      }

      items.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'img-search-item';
        card.innerHTML = `
          <img src="${item.url}" alt="${item.title}" loading="lazy">
          <div class="img-search-item-badge">✓ Selected</div>
          <div class="img-search-item-label">${item.title}</div>
        `;

        card.addEventListener('click', () => {
          document.querySelectorAll('.img-search-item').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedSearchImage = item.url;

          if (previewBar) {
            previewBar.style.display = 'flex';
            if (previewImg) previewImg.src = item.url;
            if (previewTitle) previewTitle.textContent = item.title;
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

    // Search tags
    document.querySelectorAll('.img-search-tag').forEach(tagBtn => {
      tagBtn.addEventListener('click', () => {
        document.querySelectorAll('.img-search-tag').forEach(b => b.classList.remove('active'));
        tagBtn.classList.add('active');
        runImageSearch(tagBtn.textContent.trim(), tagBtn.dataset.tag);
      });
    });

    // Apply search image button
    const btnApplySelectedImg = document.getElementById('btn-apply-selected-img');
    if (btnApplySelectedImg) {
      btnApplySelectedImg.addEventListener('click', () => {
        if (!selectedSearchImage) {
          alert('Please select an image first.');
          return;
        }
        if (typeof activeImageSearchCallback === 'function') {
          activeImageSearchCallback(selectedSearchImage);
        }
        if (imgSearchModal) imgSearchModal.classList.remove('open');
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

    function resetWizard() {
      currentWizardStep = 1;
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
              <button type="button" class="starter-action-btn" id="btn-upload-starter-${index}" title="Choose from device">
                📷 Photo
              </button>
              <button type="button" class="starter-action-btn" id="btn-search-starter-${index}" title="Search online photo">
                🔍 Search
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
                if (imgEl) imgEl.src = item.image;
              };
              reader.readAsDataURL(file);
            }
          });
        }

        if (btnSearch) {
          btnSearch.addEventListener('click', () => {
            openUniversalImageSearch(item.name, item.category, (chosen) => {
              item.image = chosen;
              if (imgEl) imgEl.src = chosen;
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
        if (window.CatalogSmithStudio && window.CatalogSmithStudio.showToast) {
          window.CatalogSmithStudio.showToast('Regenerated suggestions for ' + wizardState.category);
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
      });
    });

    // Wizard Next & Prev buttons
    document.querySelectorAll('#guided-flow-modal [data-wizard-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentWizardStep === 1) {
          const nameInput = document.getElementById('wizard-input-name');
          if (nameInput && nameInput.value.trim()) {
            wizardState.storeName = nameInput.value.trim();
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

      if (window.CatalogSmithStudio) {
        const { state, syncFormFields, renderReviewList, saveStateToLocalStorage, showToast, updateLivePreview } = window.CatalogSmithStudio;

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
            image: p.image || null
          }));

        state.products = finalProducts;

        syncFormFields();
        renderReviewList();
        saveStateToLocalStorage();
        updateLivePreview();
        showToast(`🎉 Created "${state.vendor_name}" with ${state.products.length} products!`);
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
      manualPhotoBox.addEventListener('click', () => manualPhotoInput.click());
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
    if (btnSearchManualImg) {
      btnSearchManualImg.addEventListener('click', () => {
        const titleVal = document.getElementById('manual-title-input') ? document.getElementById('manual-title-input').value : '';
        const catVal = document.getElementById('manual-category-input') ? document.getElementById('manual-category-input').value : '';
        openUniversalImageSearch(titleVal, catVal, (chosen) => {
          manualItemPhoto = chosen;
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
              if (window.CatalogSmithStudio && window.CatalogSmithStudio.showToast) {
                window.CatalogSmithStudio.showToast(`Loaded ${files.length} product photos!`);
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
        openUniversalImageSearch('', '', (chosenImg) => {
          const matched = CURATED_PRODUCT_IMAGES.find(x => x.url === chosenImg);
          const name = matched ? matched.title : 'New Product Item';
          const cat = matched ? matched.category : 'General';
          stagedIntakeProducts.push({
            id: 'p' + (Date.now() % 100000),
            name: name,
            price: { amount: null, currency: 'NGN', source: 'none' },
            description: 'Selected via image search.',
            category: cat,
            best_timestamp_sec: 0,
            confidence: 0.95,
            image: chosenImg
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
          image: manualItemPhoto
        });

        // Reset inputs
        if (manualTitleInput) manualTitleInput.value = '';
        if (manualPriceInput) manualPriceInput.value = '';
        if (manualDescInput) manualDescInput.value = '';
        manualItemPhoto = null;
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
          if (window.CatalogSmithStudio && window.CatalogSmithStudio.showToast) {
            window.CatalogSmithStudio.showToast(`Imported ${added} products from CSV!`);
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

        if (window.CatalogSmithStudio && stagedIntakeProducts.length > 0) {
          const { state, renderReviewList, saveStateToLocalStorage, syncFormFields, showToast, updateLivePreview } = window.CatalogSmithStudio;

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
        if (window.CatalogSmithStudio && window.CatalogSmithStudio.showToast) {
          window.CatalogSmithStudio.showToast(`Added "${title}" (₦${retail.toLocaleString()}) to staged items!`);
        }
      });
    }

    const btnContinueDropship = document.getElementById('btn-continue-dropship');
    if (btnContinueDropship) {
      btnContinueDropship.addEventListener('click', () => {
        if (dropshipModal) dropshipModal.classList.remove('open');

        if (window.CatalogSmithStudio) {
          const { state, renderReviewList, syncFormFields, saveStateToLocalStorage, showToast, updateLivePreview } = window.CatalogSmithStudio;

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
    [guidedModal, picturesModal, dropshipModal, imgSearchModal].forEach(modal => {
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
        [guidedModal, picturesModal, dropshipModal, imgSearchModal].forEach(modal => {
          if (modal && modal.classList.contains('open')) {
            modal.classList.remove('open');
          }
        });
      }
    });

    // Populate Initial Example Storefront
    populateExampleStorefront();
  }
})();
