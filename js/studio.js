/**
 * ContentSmith Studio - Main Application Logic
 * Phone-first, git-free video-to-storefront builder.
 */

(function () {
  'use strict';

  // Default initial state
  const state = {
    id: 'lola-fabrics',
    slug: 'lola-fabrics',
    catalog_id: 'cat_lola_fabrics',
    vendor_name: 'Lola Fabrics & Chic Wear',
    vendor_phone: '+2348035550192',
    currency_default: 'NGN',
    tagline: 'Luxury custom dresses & fabrics delivered nationwide',
    theme: 'emerald',
    layout: 'standard',
    order_button_text: 'Order on WhatsApp',
    message_template: 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price}) from your catalog. Is it available for delivery?',
    products: [],
    selectedProductId: null,
    filter: 'all',
    currentStep: 1,
    videoDuration: 0,
    videoLoaded: false,
    videoFile: null
  };

  // DOM Elements
  const els = {
    // Nav tabs
    stepTabs: document.querySelectorAll('.step-tab'),
    stepPanes: document.querySelectorAll('.step-pane'),
    tabReviewLabel: document.getElementById('tab-review-label'),

    // Step 1: Input & Automation
    videoInput: document.getElementById('video-input'),
    btnSelectVideo: document.getElementById('btn-select-video'),
    videoDropzone: document.getElementById('video-dropzone'),
    videoFileInfo: document.getElementById('video-file-info'),
    btnGenerateDemoVideo: document.getElementById('btn-generate-demo-video'),
    jsonInput: document.getElementById('json-input'),
    btnClearJson: document.getElementById('btn-clear-json'),
    btnUploadJsonFile: document.getElementById('btn-upload-json-file'),
    jsonFileInput: document.getElementById('json-file-input'),
    btnParseJson: document.getElementById('btn-parse-json'),
    sampleChips: document.querySelectorAll('.sample-chip'),
    geminiApiKey: document.getElementById('gemini-api-key'),
    checkRememberKey: document.getElementById('check-remember-key'),
    btnToggleKeyVis: document.getElementById('btn-toggle-key-vis'),
    geminiModelSelect: document.getElementById('gemini-model-select'),
    btnAutoExtractGemini: document.getElementById('btn-auto-extract-gemini'),
    btnSmartLocalScan: document.getElementById('btn-smart-local-scan'),
    autoProgressContainer: document.getElementById('auto-progress-container'),
    autoProgressFill: document.getElementById('auto-progress-fill'),
    autoProgressStatus: document.getElementById('auto-progress-status'),
    autoProgressPercent: document.getElementById('auto-progress-percent'),

    // Step 2: Video & Review
    studioVideo: document.getElementById('studioVideo'),
    captureCanvas: document.getElementById('captureCanvas'),
    videoPlaceholderOverlay: document.getElementById('video-placeholder-overlay'),
    videoTimeDisplay: document.getElementById('video-time-display'),
    videoScrubber: document.getElementById('video-scrubber'),
    btnTogglePlay: document.getElementById('btn-toggle-play'),
    nudgeButtons: document.querySelectorAll('.btn-nudge[data-nudge]'),
    btnCaptureFrame: document.getElementById('btn-capture-frame'),
    btnCaptureLabel: document.getElementById('btn-capture-label'),
    btnAutoCaptureAll: document.getElementById('btn-auto-capture-all'),
    targetProductName: document.getElementById('target-product-name'),
    targetProductTimestamp: document.getElementById('target-product-timestamp'),

    // Product Review List
    reviewProductsContainer: document.getElementById('review-products-container'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    countAll: document.getElementById('count-all'),
    countFlagged: document.getElementById('count-flagged'),
    countNoPrice: document.getElementById('count-noprice'),
    btnAddProduct: document.getElementById('btn-add-product'),
    btnGotoStep3: document.getElementById('btn-goto-step-3'),

    // Step 3: Settings
    settingVendorName: document.getElementById('setting-vendor-name'),
    settingStoreSlug: document.getElementById('setting-store-slug'),
    slugAvailabilityBadge: document.getElementById('slug-availability-badge'),
    slugStatusIcon: document.getElementById('slug-status-icon'),
    slugStatusText: document.getElementById('slug-status-text'),
    settingVendorPhone: document.getElementById('setting-vendor-phone'),
    settingCurrency: document.getElementById('setting-currency'),
    settingTagline: document.getElementById('setting-tagline'),
    settingTheme: document.getElementById('setting-theme'),
    step3ThemeSwatches: document.querySelectorAll('#step3-theme-swatches .theme-swatch-btn'),
    step3MockupFrame: document.getElementById('step3-mockup-frame'),
    step3ThemeNameBadge: document.getElementById('step3-theme-preview-name-badge'),
    step3MockupStoreName: document.getElementById('step3-mockup-store-name'),
    step3MockupAvatar: document.getElementById('step3-mockup-avatar'),
    step3MockupProdTitle: document.getElementById('step3-mockup-prod-title'),
    step3MockupProdPrice: document.getElementById('step3-mockup-prod-price'),
    step3MockupProdImg: document.getElementById('step3-mockup-prod-img'),
    step3MockupBtnLabel: document.getElementById('step3-mockup-btn-label'),
    settingLayout: document.getElementById('setting-layout'),
    settingBtnText: document.getElementById('setting-btn-text'),
    settingMessageTemplate: document.getElementById('setting-message-template'),
    previewMessageText: document.getElementById('preview-message-text'),
    btnBackStep2: document.getElementById('btn-back-step-2'),
    btnGotoStep4: document.getElementById('btn-goto-step-4'),

    // Step 4: Preview & Export
    previewFrame: document.getElementById('preview-frame'),
    btnRefreshPreview: document.getElementById('btn-refresh-preview'),
    btnExportZip: document.getElementById('btn-export-zip'),
    btnExportSingleHtml: document.getElementById('btn-export-single-html'),
    btnDownloadPdf: document.getElementById('btn-download-pdf'),
    btnOpenLookbook: document.getElementById('btn-open-lookbook'),
    btnShareCatalog: document.getElementById('btn-share-catalog'),
    btnSaveProjectJson: document.getElementById('btn-save-project-json'),
    btnCopyStoreJson: document.getElementById('btn-copy-store-json'),

    // Modals
    promptsModal: document.getElementById('prompts-modal'),
    btnOpenPrompts: document.getElementById('btn-open-prompts'),
    btnClosePrompts: document.getElementById('btn-close-prompts'),
    btnQuickGuide: document.getElementById('btn-quick-guide'),
    btnCopyVideoPrompt: document.getElementById('btn-copy-video-prompt'),
    btnCopySchema: document.getElementById('btn-copy-schema'),

    fallbackModal: document.getElementById('fallback-modal'),
    btnOpenFallback: document.getElementById('btn-open-fallback'),
    btnCloseFallback: document.getElementById('btn-close-fallback'),
    fallbackIntervalSelect: document.getElementById('fallback-interval-select'),
    btnRunFrameSampling: document.getElementById('btn-run-frame-sampling'),
    fallbackFilmstrip: document.getElementById('fallback-filmstrip'),
    fallbackStatus: document.getElementById('fallback-status'),
    btnCopyPerFramePrompt: document.getElementById('btn-copy-per-frame-prompt'),

    // Photo Editor Modal
    photoEditorModal: document.getElementById('photo-editor-modal'),
    btnCloseEditor: document.getElementById('btn-close-editor'),
    editorCanvas: document.getElementById('editorCanvas'),
    sliderBright: document.getElementById('slider-bright'),
    sliderContrast: document.getElementById('slider-contrast'),
    sliderSat: document.getElementById('slider-sat'),
    sliderWarmth: document.getElementById('slider-warmth'),
    valBright: document.getElementById('val-bright'),
    valContrast: document.getElementById('val-contrast'),
    valSat: document.getElementById('val-sat'),
    valWarmth: document.getElementById('val-warmth'),
    checkStudioBackdrop: document.getElementById('check-studio-backdrop'),
    btnResetFilters: document.getElementById('btn-reset-filters'),
    btnSaveEditedPhoto: document.getElementById('btn-save-edited-photo'),
    cropPills: document.querySelectorAll('.crop-pill[data-ratio]'),

    // AI Generator Modal
    aiGeneratorModal: document.getElementById('ai-generator-modal'),
    btnCloseAiGenerator: document.getElementById('btn-close-ai-generator'),
    btnCancelAiPhoto: document.getElementById('btn-cancel-ai-photo'),
    aiTargetProductTitle: document.getElementById('ai-target-product-title'),
    aiTargetProductDesc: document.getElementById('ai-target-product-desc'),
    aiPromptInput: document.getElementById('ai-prompt-input'),
    btnGenerateAiPhoto: document.getElementById('btn-generate-ai-photo'),
    btnApplyAiPhoto: document.getElementById('btn-apply-ai-photo'),
    aiVariationsContainer: document.getElementById('ai-variations-container'),
    aiStylePills: document.querySelectorAll('.crop-pill[data-aistyle]'),

    toastContainer: document.getElementById('toast-container')
  };

  // Helper: Toast notification
  function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✓</span><span>${message}</span>`;
    els.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Currency Formatter Helper
  function getCurrencySymbol(code) {
    if (!code) return '₦';
    const map = {
      NGN: '₦',
      USD: '$',
      EUR: '€',
      GBP: '£',
      KES: 'KSh ',
      GHS: 'GH₵ ',
      ZAR: 'R ',
      CAD: '$',
      AUD: '$'
    };
    return map[code.toUpperCase()] || (code + ' ');
  }

  function formatPrice(amount, currency) {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return 'Ask for price';
    }
    const sym = getCurrencySymbol(currency);
    return sym + Number(amount).toLocaleString();
  }

  // Step Navigation Handler
  function setStep(step) {
    state.currentStep = parseInt(step, 10);
    els.stepTabs.forEach(tab => {
      const tabStep = parseInt(tab.dataset.step, 10);
      tab.classList.toggle('active', tabStep === state.currentStep);
    });

    const progressDots = document.querySelectorAll('.progress-dot');
    progressDots.forEach(dot => {
      const s = parseInt(dot.dataset.step, 10);
      dot.classList.toggle('active', s === state.currentStep);
      dot.classList.toggle('completed', s < state.currentStep);
    });

    const mobileStepText = document.getElementById('mobile-header-step-text');
    const stepNames = {
      1: 'Step 1 of 4: Add products',
      2: 'Step 2 of 4: Check products',
      3: 'Step 3 of 4: Make it yours',
      4: 'Step 4 of 4: Publish & share'
    };
    if (mobileStepText) {
      mobileStepText.textContent = stepNames[state.currentStep] || `Step ${state.currentStep} of 4`;
    }

    const mobileShopTitle = document.getElementById('mobile-shop-title');
    if (mobileShopTitle) {
      mobileShopTitle.textContent = state.vendor_name || 'New catalogue';
    }

    els.stepPanes.forEach(pane => {
      pane.classList.remove('active');
    });

    const activePane = document.getElementById(`pane-step-${state.currentStep}`);
    if (activePane) activePane.classList.add('active');

    syncStep1DraftState();

    if (state.currentStep === 2) {
      const reviewGrid = document.querySelector('.grid-studio-review');
      if (reviewGrid) {
        reviewGrid.classList.toggle('no-video-loaded', !state.videoLoaded);
      }
      const banner = document.getElementById('no-video-banner');
      if (banner) {
        banner.style.display = !state.videoLoaded ? 'flex' : 'none';
      }
    }

    if (state.currentStep === 4) {
      updateLivePreview();
      updateStep4ShareBanner();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function syncStep1DraftState() {
    const hasProducts = state.products && state.products.length > 0;
    const draftRow = document.getElementById('other-start-draft');
    const draftTitle = document.getElementById('saved-draft-title');
    const draftDesc = document.getElementById('saved-draft-desc');
    const footerBar = document.getElementById('step1-sticky-footer');
    const footerCount = document.getElementById('step1-footer-product-count');

    if (hasProducts) {
      if (draftRow) draftRow.style.display = 'block';
      if (draftTitle) draftTitle.textContent = `Continue with ${state.products.length} saved products`;
      if (draftDesc) draftDesc.textContent = `Review items, edit prices, or add photos`;
      if (footerBar) footerBar.style.display = 'block';
      if (footerCount) footerCount.textContent = `${state.products.length} products in catalogue`;
    } else {
      if (draftRow) draftRow.style.display = 'none';
      if (footerBar) footerBar.style.display = 'none';
    }

    if (els.tabReviewLabel) {
      els.tabReviewLabel.textContent = `Check products (${state.products ? state.products.length : 0})`;
    }
  }

  els.stepTabs.forEach(tab => {
    tab.addEventListener('click', () => setStep(tab.dataset.step));
  });

  const progressDots = document.querySelectorAll('.progress-dot');
  progressDots.forEach(dot => {
    dot.addEventListener('click', () => setStep(dot.dataset.step));
  });

  const btnMobileBack = document.getElementById('btn-mobile-header-back');
  if (btnMobileBack) {
    btnMobileBack.addEventListener('click', () => {
      if (state.currentStep > 1) {
        setStep(state.currentStep - 1);
      } else {
        const btnBackLanding = document.getElementById('btn-back-to-landing');
        if (btnBackLanding) btnBackLanding.click();
      }
    });
  }

  const btnContinueDraft = document.getElementById('btn-continue-saved-draft');
  const btnStep1Continue = document.getElementById('btn-step1-continue');
  if (btnContinueDraft) btnContinueDraft.addEventListener('click', () => setStep(2));
  if (btnStep1Continue) btnStep1Continue.addEventListener('click', () => setStep(2));

  if (els.btnGotoStep3) els.btnGotoStep3.addEventListener('click', () => setStep(3));
  if (els.btnBackStep2) els.btnBackStep2.addEventListener('click', () => setStep(2));
  if (els.btnGotoStep4) els.btnGotoStep4.addEventListener('click', () => setStep(4));

  function getNormalizedShareState() {
    const slug = state.slug || state.id || state.catalog_id || (state.vendor_name ? slugify(state.vendor_name) : 'my-store');
    return {
      ...state,
      id: slug,
      slug: slug,
      name: state.vendor_name || 'My Store',
      phone: state.vendor_phone || '+2348035550192',
      currency: state.currency_default || 'NGN',
      tagline: state.tagline || '',
      theme: state.theme || 'emerald',
      layout: state.layout || 'standard',
      products: state.products || []
    };
  }

  // Update Step 4 Live Sharable URL banner
  function updateStep4ShareBanner() {
    const input = document.getElementById('step4-share-url-input');
    if (input && window.CatalogStore) {
      input.value = window.CatalogStore.getSharableUrl(getNormalizedShareState());
    }
  }

  // Load a catalog directly into Studio Workspace
  function loadCatalog(catalog) {
    if (!catalog) return;
    const catSlug = catalog.slug || catalog.id || (catalog.name ? slugify(catalog.name) : 'my-store');
    state.id = catSlug;
    state.slug = catSlug;
    state.catalog_id = catalog.id || catSlug;
    state.vendor_name = catalog.name || catalog.vendor_name || 'My Store';
    state.vendor_phone = catalog.phone || catalog.vendor_phone || '+2348035550192';
    state.currency_default = catalog.currency || catalog.currency_default || 'NGN';
    state.tagline = catalog.tagline || '';
    state.theme = catalog.theme || 'emerald';
    state.layout = catalog.layout || 'standard';
    state.order_button_text = catalog.order_button_text || 'Order on WhatsApp';
    state.message_template = catalog.message_template || 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price})';
    state.products = JSON.parse(JSON.stringify(catalog.products || []));
    state.videoLoaded = false;

    syncFormFields();
    renderReviewList();
    updateLivePreview();
    updateStep4ShareBanner();

    const badge = document.getElementById('workspace-editing-badge');
    const badgeName = document.getElementById('workspace-editing-name');
    if (badge && badgeName) {
      badge.style.display = 'inline-flex';
      badgeName.textContent = state.vendor_name;
    }
  }

  // Load Saved State from localStorage & CatalogStore
  function loadPersistedState() {
    try {
      if (window.CatalogStore) {
        const activeCat = window.CatalogStore.getActiveCatalog();
        if (activeCat && activeCat.products && activeCat.products.length > 0) {
          loadCatalog(activeCat);
          return true;
        }
      }

      const saved = localStorage.getItem('ContentSmith_studio_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.products && Array.isArray(parsed.products)) {
          Object.assign(state, parsed);
          syncFormFields();
          renderReviewList();
          updateStep4ShareBanner();
          return true;
        }
      }
    } catch (e) {
      console.warn('Could not load saved state:', e);
    }
    return false;
  }

  let saveStateTimer = null;
  function debouncedSaveState(delay = 400) {
    if (saveStateTimer) clearTimeout(saveStateTimer);
    saveStateTimer = setTimeout(() => {
      saveStateToLocalStorage();
    }, delay);
  }

  function saveStateToLocalStorage() {
    try {
      // Don't serialize multi-megabyte base64 strings into localStorage on every keystroke
      const lightweightProducts = state.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        category: p.category,
        best_timestamp_sec: p.best_timestamp_sec,
        confidence: p.confidence,
        image: p.image || null
      }));

      const effectiveId = state.id || state.slug || state.catalog_id || 'my-store';
      const effectiveSlug = state.slug || state.id || state.catalog_id || 'my-store';

      const snapshot = {
        catalog_id: effectiveId,
        id: effectiveId,
        slug: effectiveSlug,
        vendor_name: state.vendor_name,
        vendor_phone: state.vendor_phone,
        currency_default: state.currency_default,
        tagline: state.tagline,
        theme: state.theme,
        layout: state.layout,
        order_button_text: state.order_button_text,
        message_template: state.message_template,
        products: lightweightProducts
      };

      try {
        localStorage.setItem('ContentSmith_studio_state', JSON.stringify(snapshot));
      } catch (quotaErr) {
        console.warn('LocalStorage quota reached, saving compact draft:', quotaErr);
        try {
          const compact = {
            ...snapshot,
            products: snapshot.products.map(p => ({
              ...p,
              image: (p.image && p.image.startsWith('http')) ? p.image : (p.image && p.image.length < 50000 ? p.image : null)
            }))
          };
          localStorage.setItem('ContentSmith_studio_state', JSON.stringify(compact));
        } catch (_) {}
      }

      // Also persist to CatalogStore
      if (window.CatalogStore) {
        window.CatalogStore.save({
          id: effectiveId,
          slug: effectiveSlug,
          name: state.vendor_name,
          phone: state.vendor_phone,
          currency: state.currency_default,
          tagline: state.tagline,
          theme: state.theme,
          layout: state.layout,
          order_button_text: state.order_button_text,
          message_template: state.message_template,
          products: state.products
        });
        updateStep4ShareBanner();
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  const THEME_NAMES = {
    'emerald': '🌿 Emerald (WhatsApp Green)',
    'luxury-gold': '👑 Luxury Obsidian & Champagne Gold',
    'sunset': '🌅 Sunset Terracotta & Warm Sand',
    'tech-blue': '⚡ Cyber Slate & Electric Blue',
    'blush': '🌸 Blush Rose & Velvet Noir',
    'minimal': '🖋️ Editorial Minimalist & Monochrome'
  };

  function updateStep3ThemePreview(theme) {
    const activeTheme = theme || state.theme || 'emerald';
    if (els.step3MockupFrame) {
      els.step3MockupFrame.className = 'theme-mockup-frame theme-' + activeTheme;
    }
    if (els.step3ThemeNameBadge) {
      els.step3ThemeNameBadge.textContent = THEME_NAMES[activeTheme] || activeTheme;
    }
    if (els.step3MockupStoreName) {
      els.step3MockupStoreName.textContent = state.vendor_name || 'My Store';
    }
    if (els.step3MockupAvatar) {
      els.step3MockupAvatar.textContent = (state.vendor_name || 'S').trim().charAt(0).toUpperCase() || 'S';
    }
    if (els.step3MockupBtnLabel) {
      els.step3MockupBtnLabel.textContent = state.order_button_text || 'Order on WhatsApp';
    }

    const firstProd = (state.products && state.products.length > 0) ? state.products[0] : null;
    if (firstProd) {
      if (els.step3MockupProdTitle) els.step3MockupProdTitle.textContent = firstProd.name;
      if (els.step3MockupProdPrice) {
        els.step3MockupProdPrice.textContent = formatPrice(firstProd.price ? firstProd.price.amount : null, state.currency_default);
      }
      if (els.step3MockupProdImg && firstProd.image) {
        els.step3MockupProdImg.src = firstProd.image;
      }
    }

    // Sync theme swatches active state
    if (els.step3ThemeSwatches) {
      els.step3ThemeSwatches.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === activeTheme);
      });
    }
  }

  let slugCheckTimeout = null;
  async function validateStoreSlugInput(candidate) {
    if (!els.slugStatusText || !els.slugStatusIcon) return;
    const clean = (candidate || '').toLowerCase().trim().replace(/[^\w-]/g, '').replace(/[\s_]+/g, '-');
    if (!clean) {
      els.slugStatusIcon.textContent = '⚠️';
      els.slugStatusIcon.style.color = '#ef4444';
      els.slugStatusText.textContent = 'Please enter an endpoint';
      els.slugStatusText.style.color = '#ef4444';
      return;
    }

    els.slugStatusIcon.textContent = '⏳';
    els.slugStatusText.textContent = `Checking availability for ?store=${clean}...`;
    els.slugStatusText.style.color = 'var(--text-muted)';

    if (!window.CatalogStore) return;
    const result = await window.CatalogStore.isSlugAvailable(clean, state.id);
    if (result.available) {
      els.slugStatusIcon.textContent = '✓';
      els.slugStatusIcon.style.color = '#10b981';
      els.slugStatusText.innerHTML = `Available: <code>?store=${result.slug}</code>`;
      els.slugStatusText.style.color = '#10b981';

      state.slug = result.slug;
      state.id = result.slug;
      state.catalog_id = result.slug;
      debouncedSaveState(300);
      updateStep4ShareBanner();
    } else {
      els.slugStatusIcon.textContent = '⚠️';
      els.slugStatusIcon.style.color = '#f59e0b';
      let suggestionHtml = '';
      if (result.suggested) {
        suggestionHtml = ` &bull; Try: <a href="#" id="link-apply-suggested-slug" style="color:var(--color-primary);font-weight:700;text-decoration:underline;">${result.suggested}</a>`;
      }
      els.slugStatusText.innerHTML = `${result.reason}${suggestionHtml}`;
      els.slugStatusText.style.color = '#f59e0b';

      const linkSuggested = document.getElementById('link-apply-suggested-slug');
      if (linkSuggested) {
        linkSuggested.onclick = (ev) => {
          ev.preventDefault();
          if (els.settingStoreSlug) {
            els.settingStoreSlug.value = result.suggested;
            validateStoreSlugInput(result.suggested);
          }
        };
      }
    }
  }

  function syncFormFields() {
    if (els.settingVendorName) els.settingVendorName.value = state.vendor_name || '';
    if (els.settingStoreSlug) {
      els.settingStoreSlug.value = state.slug || state.id || 'lola-fabrics';
      validateStoreSlugInput(els.settingStoreSlug.value);
    }
    if (els.settingVendorPhone) els.settingVendorPhone.value = state.vendor_phone || '';
    if (els.settingCurrency) els.settingCurrency.value = state.currency_default || 'NGN';
    if (els.settingTagline) els.settingTagline.value = state.tagline || '';
    if (els.settingTheme) els.settingTheme.value = state.theme || 'emerald';
    if (els.settingLayout) els.settingLayout.value = state.layout || 'standard';
    if (els.settingBtnText) els.settingBtnText.value = state.order_button_text || 'Order on WhatsApp';
    if (els.settingMessageTemplate) els.settingMessageTemplate.value = state.message_template || '';
    updateMessagePreview();
    updateStep3ThemePreview(state.theme);
  }

  // Update Settings Form to State
  function bindSettingsInputs() {
    if (els.settingVendorName) {
      els.settingVendorName.addEventListener('input', e => {
        state.vendor_name = e.target.value;
        updateMessagePreview();
        updateStep3ThemePreview(state.theme);
        debouncedSaveState();
      });
    }
    if (els.settingStoreSlug) {
      els.settingStoreSlug.addEventListener('input', e => {
        clearTimeout(slugCheckTimeout);
        slugCheckTimeout = setTimeout(() => {
          validateStoreSlugInput(e.target.value);
        }, 220);
      });
    }
    if (els.settingVendorPhone) {
      els.settingVendorPhone.addEventListener('input', e => {
        state.vendor_phone = e.target.value;
        updateMessagePreview();
        debouncedSaveState();
      });
    }
    if (els.settingCurrency) {
      els.settingCurrency.addEventListener('change', e => {
        state.currency_default = e.target.value;
        renderReviewList();
        updateStep3ThemePreview(state.theme);
        debouncedSaveState(0);
      });
    }
    if (els.settingTagline) {
      els.settingTagline.addEventListener('input', e => {
        state.tagline = e.target.value;
        debouncedSaveState();
      });
    }
    if (els.settingTheme) {
      els.settingTheme.addEventListener('change', e => {
        state.theme = e.target.value;
        updateStep3ThemePreview(e.target.value);
        debouncedSaveState(0);
        updateLivePreview();
        showToast(`Theme changed to: ${state.theme}`);
      });
    }
    if (els.step3ThemeSwatches) {
      els.step3ThemeSwatches.forEach(btn => {
        btn.addEventListener('click', () => {
          const picked = btn.dataset.theme;
          if (!picked) return;
          state.theme = picked;
          if (els.settingTheme) els.settingTheme.value = picked;
          updateStep3ThemePreview(picked);
          debouncedSaveState(0);
          updateLivePreview();
          showToast(`Theme changed to: ${picked}`);
        });
      });
    }
    if (els.settingLayout) {
      els.settingLayout.addEventListener('change', e => {
        state.layout = e.target.value;
        debouncedSaveState(0);
        updateLivePreview();
        showToast(`Layout changed to: ${state.layout}`);
      });
    }
    if (els.settingBtnText) {
      els.settingBtnText.addEventListener('input', e => {
        state.order_button_text = e.target.value;
        updateStep3ThemePreview(state.theme);
        debouncedSaveState();
        updateLivePreview();
      });
    }
    if (els.settingMessageTemplate) {
      els.settingMessageTemplate.addEventListener('input', e => {
        state.message_template = e.target.value;
        updateMessagePreview();
        debouncedSaveState();
      });
    }
  }

  function updateMessagePreview() {
    if (!els.previewMessageText) return;
    const sampleProduct = state.products[0] || {
      name: 'Sample Product',
      price: { amount: 25000, currency: state.currency_default }
    };
    const samplePrice = formatPrice(sampleProduct.price ? sampleProduct.price.amount : null, state.currency_default);
    let msg = state.message_template || 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price})';
    msg = msg
      .replace(/{vendor_name}/g, state.vendor_name || 'Vendor')
      .replace(/{product_name}/g, sampleProduct.name)
      .replace(/{product_price}/g, samplePrice);
    els.previewMessageText.textContent = `"${msg}"`;
  }

  // Load Fixture Data
  function loadFixture(key) {
    if (!window.ContentSmith_FIXTURES || !window.ContentSmith_FIXTURES[key]) {
      showToast('Fixture not found');
      return;
    }
    const fixture = window.ContentSmith_FIXTURES[key];
    const data = JSON.parse(JSON.stringify(fixture.data));

    state.vendor_name = data.vendor_name || state.vendor_name;
    state.vendor_phone = data.vendor_phone || state.vendor_phone;
    state.currency_default = data.currency_default || state.currency_default;
    state.theme = data.theme || state.theme || 'emerald';
    state.tagline = data.tagline || state.tagline;
    state.products = data.products || [];

    // Auto-generate placeholder canvas thumbnails for each product
    generateInitialThumbnailsForFixture();

    syncFormFields();
    renderReviewList();
    if (els.jsonInput) els.jsonInput.value = JSON.stringify(data, null, 2);
    showToast(`Loaded sample: ${fixture.name}`);
  }

  // Generates clean styled placeholder canvas thumbnails for sample datasets
  function generateInitialThumbnailsForFixture() {
    const palette = [
      ['#0f766e', '#14b8a6'],
      ['#1d4ed8', '#60a5fa'],
      ['#7c2d12', '#f97316'],
      ['#581c87', '#a855f7'],
      ['#831843', '#f43f5e'],
      ['#1e293b', '#64748b']
    ];

    state.products.forEach((p, idx) => {
      if (!p.image) {
        const c = document.createElement('canvas');
        c.width = 400;
        c.height = 300;
        const ctx = c.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 400, 300);
        const col = palette[idx % palette.length];
        grad.addColorStop(0, col[0]);
        grad.addColorStop(1, col[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 300);

        // Text banner
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, 200, 400, 100);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px -apple-system, sans-serif';
        ctx.fillText(p.name.slice(0, 28) + (p.name.length > 28 ? '...' : ''), 20, 240);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        const priceTxt = p.price && p.price.amount ? formatPrice(p.price.amount, p.price.currency || state.currency_default) : 'Ask for price';
        ctx.fillText(priceTxt + ' • @' + p.best_timestamp_sec + 's', 20, 270);

        p.image = c.toDataURL('image/jpeg', 0.85);
      }
    });
  }

  els.sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      loadFixture(chip.dataset.sample);
    });
  });

  // Handle JSON Input Parsing
  function handleParseJson() {
    const raw = els.jsonInput.value.trim();
    if (!raw) {
      showToast('Please paste valid JSON or choose a sample dataset');
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed.products || !Array.isArray(parsed.products)) {
        showToast('JSON must contain a "products" array');
        return;
      }

      state.vendor_name = parsed.vendor_name || state.vendor_name;
      state.vendor_phone = parsed.vendor_phone || state.vendor_phone;
      state.currency_default = parsed.currency_default || state.currency_default;
      state.products = parsed.products.map((item, i) => ({
        id: item.id || `p${i + 1}`,
        name: item.name || `Product ${i + 1}`,
        price: item.price ? {
          amount: (item.price.amount !== null && !isNaN(item.price.amount)) ? Number(item.price.amount) : null,
          currency: item.price.currency || state.currency_default,
          source: item.price.source || 'none'
        } : null,
        description: item.description || '',
        category: item.category || null,
        best_timestamp_sec: typeof item.best_timestamp_sec === 'number' ? item.best_timestamp_sec : 0,
        confidence: typeof item.confidence === 'number' ? item.confidence : 0.8,
        image: item.image || null
      }));

      generateInitialThumbnailsForFixture();
      syncFormFields();
      renderReviewList();
      saveStateToLocalStorage();
      showToast(`Loaded ${state.products.length} products successfully!`);
      setStep(2);
    } catch (err) {
      showToast(`Invalid JSON syntax: ${err.message}`);
    }
  }

  if (els.btnParseJson) els.btnParseJson.addEventListener('click', handleParseJson);
  if (els.btnClearJson) els.btnClearJson.addEventListener('click', () => { els.jsonInput.value = ''; });

  // Upload JSON File
  if (els.btnUploadJsonFile && els.jsonFileInput) {
    els.btnUploadJsonFile.addEventListener('click', () => els.jsonFileInput.click());
    els.jsonFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        els.jsonInput.value = ev.target.result;
        handleParseJson();
      };
      reader.readAsText(file);
    });
  }

  // Helper to validate video files by MIME or extension
  function isVideoFile(file) {
    if (!file) return false;
    if (file.type && file.type.startsWith('video/')) return true;
    const name = (file.name || '').toLowerCase();
    return /\.(mp4|mov|webm|m4v|mkv|avi|ogv|3gp)$/i.test(name);
  }

  // Video Handling & Player
  function setupVideoHandlers() {
    // Prevent default window-level drag/drop so dropping outside doesn't navigate away from ContentSmith
    window.addEventListener('dragover', e => {
      e.preventDefault();
    }, false);

    window.addEventListener('drop', e => {
      e.preventDefault();
    }, false);

    const videoInput = els.videoInput || document.getElementById('video-input');
    const btnSelectVideo = document.getElementById('btn-select-video');
    const dropzone = document.getElementById('video-dropzone') || els.videoDropzone;
    const heroBlock = document.getElementById('step1-hero-block');
    const btnChangeVideo = document.getElementById('btn-change-video');

    if (videoInput) {
      const openPicker = () => {
        videoInput.click();
      };

      if (btnSelectVideo) {
        btnSelectVideo.addEventListener('click', e => {
          e.stopPropagation();
          openPicker();
        });
      }

      if (btnChangeVideo) {
        btnChangeVideo.addEventListener('click', e => {
          e.stopPropagation();
          openPicker();
        });
      }

      // Tap-to-select and keyboard activation on dropzone
      if (dropzone) {
        dropzone.addEventListener('click', e => {
          if (e.target !== videoInput) {
            openPicker();
          }
        });

        dropzone.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        });
      }

      // Drag and drop support on dropzone and hero block (for desktop users)
      const dragTargets = Array.from(new Set([dropzone, heroBlock].filter(Boolean)));
      dragTargets.forEach(target => {
        let dragCounter = 0;
        target.addEventListener('dragenter', e => {
          e.preventDefault();
          dragCounter++;
          target.classList.add('dragover');
          if (dropzone) dropzone.classList.add('dragover');
        });

        target.addEventListener('dragover', e => {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
          target.classList.add('dragover');
          if (dropzone) dropzone.classList.add('dragover');
        });

        target.addEventListener('dragleave', e => {
          e.preventDefault();
          dragCounter--;
          if (dragCounter <= 0) {
            dragCounter = 0;
            target.classList.remove('dragover');
            if (dropzone) dropzone.classList.remove('dragover');
          }
        });

        target.addEventListener('drop', e => {
          e.preventDefault();
          e.stopPropagation();
          dragCounter = 0;
          target.classList.remove('dragover');
          if (dropzone) dropzone.classList.remove('dragover');

          const dt = e.dataTransfer;
          if (dt && dt.files && dt.files.length > 0) {
            const file = dt.files[0];
            if (!isVideoFile(file)) {
              showToast('Unsupported file type. Please select an MP4, MOV, or WebM video file.', 'warning');
              return;
            }
            loadVideoFile(file);
          }
        });
      });

      videoInput.addEventListener('change', e => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          if (!isVideoFile(file)) {
            showToast('Unsupported file type. Please select an MP4, MOV, or WebM video file.', 'warning');
            e.target.value = '';
            return;
          }
          loadVideoFile(file);
        }
        e.target.value = '';
      });
    }

    // Tools Sheet Sheet drawer setup
    const toolsSheetBackdrop = document.getElementById('tools-sheet-backdrop');
    const btnOpenTools = document.getElementById('btn-open-tools-sheet');
    const btnDesktopTools = document.getElementById('btn-desktop-tools-gear');
    const btnCloseTools = document.getElementById('btn-close-tools-sheet');

    const openToolsSheet = () => {
      if (toolsSheetBackdrop) toolsSheetBackdrop.style.display = 'flex';
    };
    const closeToolsSheet = () => {
      if (toolsSheetBackdrop) toolsSheetBackdrop.style.display = 'none';
    };

    if (btnOpenTools) btnOpenTools.addEventListener('click', openToolsSheet);
    if (btnDesktopTools) btnDesktopTools.addEventListener('click', openToolsSheet);
    if (btnCloseTools) btnCloseTools.addEventListener('click', closeToolsSheet);
    if (toolsSheetBackdrop) {
      toolsSheetBackdrop.addEventListener('click', e => {
        if (e.target === toolsSheetBackdrop) closeToolsSheet();
      });
    }

    // Video events
    els.studioVideo.addEventListener('loadedmetadata', () => {
      state.videoDuration = els.studioVideo.duration || 0;
      state.videoLoaded = true;
      const durBadge = document.getElementById('chosen-video-duration');
      if (durBadge) {
        durBadge.textContent = formatSeconds(state.videoDuration);
      }
      if (els.videoPlaceholderOverlay) els.videoPlaceholderOverlay.style.display = 'none';
      if (els.videoScrubber) {
        els.videoScrubber.max = state.videoDuration;
        els.videoScrubber.value = 0;
      }
      updateTimeDisplay(0, state.videoDuration);
      showToast(`Video ready (${state.videoDuration.toFixed(1)}s). Ready to find products!`);
    });

    els.studioVideo.addEventListener('timeupdate', () => {
      const cur = els.studioVideo.currentTime;
      if (els.videoScrubber) els.videoScrubber.value = cur;
      updateTimeDisplay(cur, state.videoDuration);
    });

    els.studioVideo.addEventListener('ended', () => {
      if (els.btnTogglePlay) els.btnTogglePlay.textContent = 'Play';
    });

    // Scrubber
    if (els.videoScrubber) {
      els.videoScrubber.addEventListener('input', e => {
        els.studioVideo.currentTime = parseFloat(e.target.value);
      });
    }

    // Play/Pause button
    if (els.btnTogglePlay) {
      els.btnTogglePlay.addEventListener('click', () => {
        if (!state.videoLoaded) {
          showToast('Please load a video first');
          return;
        }
        if (els.studioVideo.paused) {
          els.studioVideo.play();
          els.btnTogglePlay.textContent = 'Pause';
        } else {
          els.studioVideo.pause();
          els.btnTogglePlay.textContent = 'Play';
        }
      });
    }

    // Nudge buttons
    els.nudgeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!state.videoLoaded) {
          showToast('Please load a video first');
          return;
        }
        const delta = parseFloat(btn.dataset.nudge);
        const newTime = Math.max(0, Math.min(state.videoDuration, els.studioVideo.currentTime + delta));
        els.studioVideo.currentTime = newTime;

        // If a product is selected, update its timestamp
        if (state.selectedProductId) {
          const prod = state.products.find(p => p.id === state.selectedProductId);
          if (prod) {
            prod.best_timestamp_sec = parseFloat(newTime.toFixed(1));
            updateTargetDisplay(prod);
            const tsInput = document.getElementById(`prod-ts-${prod.id}`);
            if (tsInput) tsInput.value = prod.best_timestamp_sec;
          }
        }
      });
    });

    // Capture Frame Button
    if (els.btnCaptureFrame) {
      els.btnCaptureFrame.addEventListener('click', captureCurrentFrameForSelectedProduct);
    }

    // Auto-Capture All Frames Button
    if (els.btnAutoCaptureAll) {
      els.btnAutoCaptureAll.addEventListener('click', autoCaptureAllFrames);
    }

    // Generate Demo Video
    if (els.btnGenerateDemoVideo) {
      els.btnGenerateDemoVideo.addEventListener('click', generateDemoCanvasVideo);
    }

    // Toggle video scrubber when in Direct Catalogue mode
    const btnToggleVideoCol = document.getElementById('btn-toggle-video-column');
    if (btnToggleVideoCol) {
      btnToggleVideoCol.addEventListener('click', () => {
        const reviewGrid = document.querySelector('.grid-studio-review');
        if (reviewGrid) {
          reviewGrid.classList.toggle('no-video-loaded');
          const isHidden = reviewGrid.classList.contains('no-video-loaded');
          btnToggleVideoCol.textContent = isHidden ? '📹 Attach Video Scrubber' : '✕ Hide Video Scrubber';
        }
      });
    }
  }

  function loadVideoFile(file) {
    if (!isVideoFile(file)) {
      showToast('Please select a valid video file (.mp4, .mov, or .webm)', 'warning');
      return;
    }
    state.videoFile = file;
    const url = URL.createObjectURL(file);
    els.studioVideo.src = url;
    els.studioVideo.load();
    if (els.videoFileInfo) {
      els.videoFileInfo.textContent = `✅ ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
    }

    const heroBlock = document.getElementById('step1-hero-block');
    const chosenBlock = document.getElementById('step1-video-chosen');
    const thumbVideo = document.getElementById('step1-video-thumb');
    const nameEl = document.getElementById('chosen-video-name');
    const metaEl = document.getElementById('chosen-video-meta');

    if (heroBlock) heroBlock.style.display = 'none';
    if (chosenBlock) chosenBlock.style.display = 'flex';
    if (nameEl) nameEl.textContent = file.name;
    if (metaEl) metaEl.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    if (thumbVideo) {
      thumbVideo.src = url;
      thumbVideo.load();
    }

    showToast(`Loaded video: ${file.name}`);
  }

  function updateTimeDisplay(current, duration) {
    if (els.videoTimeDisplay) {
      els.videoTimeDisplay.textContent = `${current.toFixed(1)}s / ${duration.toFixed(1)}s`;
    }
  }

  function updateTargetDisplay(prod) {
    if (!prod) {
      if (els.targetProductName) els.targetProductName.textContent = 'No product selected';
      if (els.targetProductTimestamp) els.targetProductTimestamp.textContent = 'Timestamp: 0.0s';
      if (els.btnCaptureLabel) els.btnCaptureLabel.textContent = 'Capture Frame for Selected Product';
      return;
    }
    if (els.targetProductName) els.targetProductName.textContent = prod.name;
    if (els.targetProductTimestamp) els.targetProductTimestamp.textContent = `Timestamp: ${prod.best_timestamp_sec}s`;
    if (els.btnCaptureLabel) els.btnCaptureLabel.textContent = `Capture Frame for: ${prod.name.slice(0, 20)}...`;
  }

  function formatSeconds(sec) {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  }

  function getConstrainedCanvasDimensions(videoWidth, videoHeight, maxDim = 960) {
    let w = videoWidth || 640;
    let h = videoHeight || 480;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }
    return { width: Math.max(320, w), height: Math.max(240, h) };
  }

  function seekVideoSafely(video, targetTime, timeoutMs = 800) {
    return new Promise(resolve => {
      let resolved = false;
      const finish = () => {
        if (!resolved) {
          resolved = true;
          video.removeEventListener('seeked', onSeeked);
          resolve();
        }
      };

      const timer = setTimeout(finish, timeoutMs);

      const onSeeked = () => {
        clearTimeout(timer);
        finish();
      };

      video.addEventListener('seeked', onSeeked);

      if (Math.abs(video.currentTime - targetTime) < 0.05) {
        clearTimeout(timer);
        finish();
      } else {
        try {
          video.currentTime = targetTime;
        } catch (e) {
          clearTimeout(timer);
          finish();
        }
      }
    });
  }

  // Capture current video frame into canvas and save to targeted product
  function captureCurrentFrameForSelectedProduct() {
    if (!state.videoLoaded) {
      showToast('Please load a video first to capture frames');
      return;
    }
    if (!state.selectedProductId && state.products.length > 0) {
      state.selectedProductId = state.products[0].id;
    }
    const prod = state.products.find(p => p.id === state.selectedProductId);
    if (!prod) {
      showToast('Please select a product row to capture a frame for');
      return;
    }

    const video = els.studioVideo;
    const canvas = els.captureCanvas;
    const dims = getConstrainedCanvasDimensions(video.videoWidth, video.videoHeight, 960);
    canvas.width = dims.width;
    canvas.height = dims.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    prod.image = dataUrl;
    prod.best_timestamp_sec = parseFloat(video.currentTime.toFixed(1));

    // Update thumbnail in review UI
    const thumbImg = document.getElementById(`thumb-img-${prod.id}`);
    if (thumbImg) {
      thumbImg.src = dataUrl;
      thumbImg.style.display = 'block';
      const emptyDiv = document.getElementById(`thumb-empty-${prod.id}`);
      if (emptyDiv) emptyDiv.style.display = 'none';
    }

    debouncedSaveState();
    showToast(`Captured photo for "${prod.name}" at ${prod.best_timestamp_sec}s!`);
  }

  // Auto-capture all frames sequentially across all products
  async function autoCaptureAllFrames() {
    if (!state.videoLoaded) {
      showToast('Please load a video first');
      return;
    }
    if (!state.products.length) {
      showToast('No products loaded to capture');
      return;
    }

    showToast('Starting auto-capture for all products...');
    const video = els.studioVideo;
    const canvas = els.captureCanvas;
    const dims = getConstrainedCanvasDimensions(video.videoWidth, video.videoHeight, 960);
    canvas.width = dims.width;
    canvas.height = dims.height;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < state.products.length; i++) {
      const prod = state.products[i];
      const targetTime = Math.min(state.videoDuration, Math.max(0, prod.best_timestamp_sec || 0));

      await seekVideoSafely(video, targetTime);
      await new Promise(r => setTimeout(r, 60));

      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        prod.image = dataUrl;

        const thumbImg = document.getElementById(`thumb-img-${prod.id}`);
        if (thumbImg) {
          thumbImg.src = dataUrl;
          thumbImg.style.display = 'block';
          const emptyDiv = document.getElementById(`thumb-empty-${prod.id}`);
          if (emptyDiv) emptyDiv.style.display = 'none';
        }
      } catch (err) {
        console.warn('Frame capture error for product:', prod.id, err);
      }
    }

    debouncedSaveState();
    showToast(`Finished capturing all ${state.products.length} product frames!`);
  }

  // Generate Synthetic Test Video Stream via HTML5 Canvas
  function generateDemoCanvasVideo() {
    showToast('Generating test video stream...');
    const animCanvas = document.createElement('canvas');
    animCanvas.width = 640;
    animCanvas.height = 480;
    const ctx = animCanvas.getContext('2d');

    if (!animCanvas.captureStream) {
      showToast('Browser does not support canvas video stream generation');
      return;
    }

    const stream = animCanvas.captureStream(25);
    let recorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    } catch (e) {
      recorder = new MediaRecorder(stream);
    }

    const chunks = [];
    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      state.videoFile = blob;
      const url = URL.createObjectURL(blob);
      els.studioVideo.src = url;
      els.studioVideo.load();
      if (els.videoFileInfo) {
        els.videoFileInfo.textContent = 'Generated Test Video (60s simulation, WebM)';
      }
      showToast('Test video generated and loaded!');
    };

    recorder.start();

    // Render an animated 60-second simulated vendor walkthrough
    const startTime = Date.now();
    const durationMs = 60000;
    let animId;

    const demoCards = [
      { name: '1. Luxury Silk Boubou Gown', price: '₦28,500', color: '#047857', time: 4.2 },
      { name: '2. Ankara Co-ord Trouser Set', price: '₦16,000', color: '#ea580c', time: 12.8 },
      { name: '3. Mini Kelly Handbag', price: '₦18,500', color: '#b45309', time: 21.0 },
      { name: '4. Aso-Oke Headtie & Sash', price: '₦35,000', color: '#1d4ed8', time: 31.4 },
      { name: '5. Crystal Strap Mules', price: '₦22,000', color: '#7c3aed', time: 42.1 },
      { name: '6. Limited Velvet Kimono', price: 'Ask for Price', color: '#be123c', time: 53.7 }
    ];

    function renderAnimFrame() {
      const elapsed = Date.now() - startTime;
      const currentSec = elapsed / 1000;

      // Determine active slide
      let activeIndex = 0;
      for (let i = demoCards.length - 1; i >= 0; i--) {
        if (currentSec >= demoCards[i].time) {
          activeIndex = i;
          break;
        }
      }
      const item = demoCards[activeIndex];

      // Background
      ctx.fillStyle = item.color;
      ctx.fillRect(0, 0, 640, 480);

      // Subtle motion pattern
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      for (let x = 0; x < 640; x += 40) {
        ctx.fillRect(x, 0, 20, 480);
      }

      // Card Container
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(40, 60, 560, 360, 16);
      ctx.fill();

      // Card Header
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px -apple-system, sans-serif';
      ctx.fillText('VENDOR VIDEO SIMULATOR', 70, 110);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px -apple-system, sans-serif';
      ctx.fillText(`Current Time: ${currentSec.toFixed(1)}s / 60.0s`, 70, 140);

      // Product box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(70, 170, 500, 150);

      ctx.fillStyle = item.color;
      ctx.font = 'bold 26px -apple-system, sans-serif';
      ctx.fillText(item.name, 90, 220);

      ctx.fillStyle = '#047857';
      ctx.font = 'bold 32px -apple-system, sans-serif';
      ctx.fillText(item.price, 90, 270);

      ctx.fillStyle = '#475569';
      ctx.font = '16px -apple-system, sans-serif';
      ctx.fillText(`Best Frame Timestamp: ${item.time}s`, 90, 300);

      // Bottom bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 440, 640, 40);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`[REC] SIMULATED FOOTAGE • FPS: 25 • SEC: ${currentSec.toFixed(1)}s`, 20, 465);

      if (elapsed < durationMs) {
        animId = requestAnimationFrame(renderAnimFrame);
      } else {
        recorder.stop();
        cancelAnimationFrame(animId);
      }
    }

    renderAnimFrame();

    // Stop recorder after 3 seconds of quick capture if user doesn't want full 60s
    setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.stop();
        cancelAnimationFrame(animId);
      }
    }, 4000);
  }

  // Render Product Review List
  function renderReviewList() {
    const container = els.reviewProductsContainer;
    if (!container) return;

    // Counts
    const total = state.products.length;
    const flagged = state.products.filter(p => (p.confidence < 0.8) || (p.price && p.price.amount === null)).length;
    const noPrice = state.products.filter(p => !p.price || p.price.amount === null).length;

    if (els.countAll) els.countAll.textContent = total;
    if (els.countFlagged) els.countFlagged.textContent = flagged;
    if (els.tabReviewLabel) els.tabReviewLabel.textContent = `Check products (${total})`;
    syncStep1DraftState();

    // Filter
    let displayed = state.products;
    if (state.filter === 'flagged') {
      displayed = state.products.filter(p => (p.confidence < 0.8) || (!p.price || p.price.amount === null));
    } else if (state.filter === 'noprice') {
      displayed = state.products.filter(p => !p.price || p.price.amount === null);
    }

    container.innerHTML = '';

    if (!displayed.length) {
      container.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--text-dim); background-color: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          No products matching this filter.
        </div>
      `;
      return;
    }

    displayed.forEach(prod => {
      const card = document.createElement('div');
      const isSelected = prod.id === state.selectedProductId;
      const isFlagged = (prod.confidence < 0.8) || (!prod.price || prod.price.amount === null);
      card.className = `review-product-card ${isSelected ? 'selected' : ''} ${isFlagged ? 'flagged' : ''}`;
      card.id = `review-card-${prod.id}`;

      // Confidence badge styling
      let confClass = 'high';
      let confLabel = `${Math.round(prod.confidence * 100)}% High`;
      if (prod.confidence < 0.5) {
        confClass = 'low';
        confLabel = `${Math.round(prod.confidence * 100)}% Low`;
      } else if (prod.confidence < 0.8) {
        confClass = 'med';
        confLabel = `${Math.round(prod.confidence * 100)}% Check`;
      }

      const hasPrice = prod.price && prod.price.amount !== null && !isNaN(prod.price.amount);
      const priceVal = hasPrice ? prod.price.amount : '';
      const currencyVal = (prod.price && prod.price.currency) || state.currency_default;
      const priceSource = (prod.price && prod.price.source) || 'none';

      card.innerHTML = `
        <!-- Left Thumbnail Column -->
        <div class="review-thumb-box">
          <div class="review-thumb-wrap" id="thumb-wrap-${prod.id}" title="Click to seek video to ${prod.best_timestamp_sec}s">
            <img src="${prod.image || ''}" class="review-thumb-img" id="thumb-img-${prod.id}" style="${prod.image ? 'display:block;' : 'display:none;'}" alt="${escapeHtml(prod.name)}">
            <div class="thumb-empty" id="thumb-empty-${prod.id}" style="${prod.image ? 'display:none;' : 'display:flex;'}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>No Photo</span>
            </div>
          </div>
          <div class="thumb-action-grid">
            <button type="button" class="btn-thumb-action" id="btn-edit-${prod.id}" title="Edit brightness, contrast, crop & studio lighting">✂️ Edit</button>
            <button type="button" class="btn-thumb-action" id="btn-ai-${prod.id}" title="Generate clean studio photo with AI">🤖 AI</button>
            <button type="button" class="btn-thumb-action" id="btn-upload-${prod.id}" title="Upload photo from camera or disk">📁 Upload</button>
            <button type="button" class="btn-thumb-action" id="btn-search-${prod.id}" title="Search e-commerce image">🔍 Search</button>
            <button type="button" class="btn-thumb-action" id="btn-snap-${prod.id}" title="Capture current video frame">📸 Frame</button>
          </div>
          <input type="file" id="file-upload-${prod.id}" accept="image/*" style="display: none;">
          <div style="font-size: 0.6875rem; text-align: center; color: var(--text-dim); font-family: var(--font-mono); margin-top: 4px;">
            TS: ${prod.best_timestamp_sec}s
          </div>
        </div>

        <!-- Right Product Info Form -->
        <div class="review-form">
          <div class="form-row-header">
            <input type="text" class="input-title" id="prod-name-${prod.id}" value="${escapeHtml(prod.name)}" placeholder="Product Title">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge-confidence ${confClass}">${confLabel}</span>
            </div>
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label">Price Amount</label>
              <input type="number" class="form-input" id="prod-price-${prod.id}" value="${priceVal}" placeholder="e.g. 15000" ${!hasPrice ? 'disabled' : ''}>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; cursor: pointer;">
                <input type="checkbox" id="prod-noprice-${prod.id}" ${!hasPrice ? 'checked' : ''}>
                <span>Ask for price (null)</span>
              </label>
            </div>

            <div class="form-group">
              <label class="form-label">Currency & Source</label>
              <select class="form-select" id="prod-curr-${prod.id}">
                <option value="NGN" ${currencyVal === 'NGN' ? 'selected' : ''}>NGN (₦)</option>
                <option value="USD" ${currencyVal === 'USD' ? 'selected' : ''}>USD ($)</option>
                <option value="GBP" ${currencyVal === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                <option value="EUR" ${currencyVal === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                <option value="KES" ${currencyVal === 'KES' ? 'selected' : ''}>KES (KSh)</option>
                <option value="GHS" ${currencyVal === 'GHS' ? 'selected' : ''}>GHS (GH₵)</option>
                <option value="ZAR" ${currencyVal === 'ZAR' ? 'selected' : ''}>ZAR (R)</option>
              </select>
              <span style="font-size: 0.6875rem; color: var(--text-dim); margin-top: 4px;">Detected via: <strong>${escapeHtml(priceSource)}</strong></span>
            </div>

            <div class="form-group">
              <label class="form-label">Timestamp (Sec)</label>
              <div style="display: flex; gap: 6px;">
                <input type="number" step="0.1" class="form-input" id="prod-ts-${prod.id}" value="${prod.best_timestamp_sec}">
                <button class="btn-secondary" id="btn-seek-${prod.id}" style="padding: 6px 10px; font-size: 0.75rem;" title="Seek video to this timestamp">Seek</button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description (Variants, Material, Color)</label>
            <textarea class="form-textarea" id="prod-desc-${prod.id}" placeholder="Short description...">${escapeHtml(prod.description)}</textarea>
          </div>

          <div class="card-actions-row">
            <button class="btn-icon-subtle" id="btn-duplicate-${prod.id}">Duplicate</button>
            <button class="btn-icon-subtle delete" id="btn-delete-${prod.id}">Delete</button>
          </div>
        </div>
      `;

      container.appendChild(card);
      bindProductCardEvents(prod);
    });
  }

  function bindProductCardEvents(prod) {
    const card = document.getElementById(`review-card-${prod.id}`);
    const thumbWrap = document.getElementById(`thumb-wrap-${prod.id}`);
    const btnSnap = document.getElementById(`btn-snap-${prod.id}`);
    const btnEdit = document.getElementById(`btn-edit-${prod.id}`);
    const btnAi = document.getElementById(`btn-ai-${prod.id}`);
    const btnUpload = document.getElementById(`btn-upload-${prod.id}`);
    const fileUpload = document.getElementById(`file-upload-${prod.id}`);
    const btnSeek = document.getElementById(`btn-seek-${prod.id}`);
    const nameInput = document.getElementById(`prod-name-${prod.id}`);
    const priceInput = document.getElementById(`prod-price-${prod.id}`);
    const noPriceCheck = document.getElementById(`prod-noprice-${prod.id}`);
    const currSelect = document.getElementById(`prod-curr-${prod.id}`);
    const tsInput = document.getElementById(`prod-ts-${prod.id}`);
    const descInput = document.getElementById(`prod-desc-${prod.id}`);
    const btnDuplicate = document.getElementById(`btn-duplicate-${prod.id}`);
    const btnDelete = document.getElementById(`btn-delete-${prod.id}`);

    function selectThisProduct() {
      state.selectedProductId = prod.id;
      document.querySelectorAll('.review-product-card').forEach(c => c.classList.remove('selected'));
      if (card) card.classList.add('selected');
      updateTargetDisplay(prod);
    }

    function seekToThisProduct() {
      selectThisProduct();
      if (state.videoLoaded && els.studioVideo) {
        els.studioVideo.currentTime = Math.max(0, Math.min(state.videoDuration, prod.best_timestamp_sec || 0));
      }
    }

    if (card) card.addEventListener('click', e => {
      // Don't override input focus
      if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)) return;
      selectThisProduct();
    });

    if (thumbWrap) thumbWrap.addEventListener('click', seekToThisProduct);
    if (btnSeek) btnSeek.addEventListener('click', seekToThisProduct);

    if (btnEdit) btnEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      selectThisProduct();
      openPhotoEditor(prod.id);
    });

    if (btnAi) btnAi.addEventListener('click', (e) => {
      e.stopPropagation();
      selectThisProduct();
      openAiGenerator(prod.id);
    });

    if (btnUpload && fileUpload) {
      btnUpload.addEventListener('click', (e) => {
        e.stopPropagation();
        selectThisProduct();
        fileUpload.click();
      });
      fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          prod.image = ev.target.result;
          prod.image_origin = 'own_upload';
          prod.image_source_url = '';
          prod.image_attribution = 'Vendor authentic photo';
          prod.image_license = 'Vendor owned';
          prod.image_provider = 'own_upload';
          prod.image_author = 'Vendor';
          const thumbImg = document.getElementById(`thumb-img-${prod.id}`);
          if (thumbImg) {
            thumbImg.src = prod.image;
            thumbImg.style.display = 'block';
          }
          const emptyDiv = document.getElementById(`thumb-empty-${prod.id}`);
          if (emptyDiv) emptyDiv.style.display = 'none';
          saveStateToLocalStorage();
          updateLivePreview();
          showToast(`Uploaded authentic photo for "${prod.name}"`);
        };
        reader.readAsDataURL(file);
      });
    }

    const btnSearch = document.getElementById(`btn-search-${prod.id}`);
    if (btnSearch) {
      btnSearch.addEventListener('click', (e) => {
        e.stopPropagation();
        selectThisProduct();
        if (window.ContentSmithApp && typeof window.ContentSmithApp.openUniversalImageSearch === 'function') {
          window.ContentSmithApp.openUniversalImageSearch(prod.name || prod.category, prod.category, (chosenImg, meta) => {
            prod.image = chosenImg;
            if (meta) {
              prod.image_origin = meta.origin || (meta.provider === 'own_upload' ? 'own_upload' : 'stock_search');
              prod.image_source_url = meta.source_url || meta.sourceUrl || '';
              prod.image_attribution = meta.attribution || '';
              prod.image_license = meta.license || '';
              prod.image_provider = meta.provider || '';
              prod.image_author = meta.author || '';
              prod.imageSource = prod.image_source_url;
              prod.imagePublisher = prod.image_provider;
              prod.imageAttribution = prod.image_attribution;
            }
            const thumbImg = document.getElementById(`thumb-img-${prod.id}`);
            if (thumbImg) {
              thumbImg.src = prod.image;
              thumbImg.style.display = 'block';
            }
            const emptyDiv = document.getElementById(`thumb-empty-${prod.id}`);
            if (emptyDiv) emptyDiv.style.display = 'none';
            saveStateToLocalStorage();
            updateLivePreview();
            showToast(`Photo updated for "${prod.name}"`);
          });
        }
      });
    }

    if (btnSnap) btnSnap.addEventListener('click', (e) => {
      e.stopPropagation();
      selectThisProduct();
      captureCurrentFrameForSelectedProduct();
    });

    if (nameInput) nameInput.addEventListener('input', e => {
      prod.name = e.target.value;
      if (state.selectedProductId === prod.id) updateTargetDisplay(prod);
      debouncedSaveState();
    });

    if (priceInput) priceInput.addEventListener('input', e => {
      const val = parseFloat(e.target.value);
      if (!prod.price) prod.price = { amount: null, currency: state.currency_default, source: 'user_edit' };
      prod.price.amount = isNaN(val) ? null : val;
      debouncedSaveState();
    });

    if (noPriceCheck) noPriceCheck.addEventListener('change', e => {
      if (e.target.checked) {
        if (!prod.price) prod.price = { amount: null, currency: state.currency_default, source: 'none' };
        prod.price.amount = null;
        if (priceInput) {
          priceInput.value = '';
          priceInput.disabled = true;
        }
      } else {
        if (!prod.price) prod.price = { amount: 0, currency: state.currency_default, source: 'user_edit' };
        if (priceInput) priceInput.disabled = false;
      }
      renderReviewList();
      debouncedSaveState(0);
    });

    if (currSelect) currSelect.addEventListener('change', e => {
      if (!prod.price) prod.price = { amount: null, currency: e.target.value, source: 'none' };
      prod.price.currency = e.target.value;
      debouncedSaveState(0);
    });

    if (tsInput) tsInput.addEventListener('input', e => {
      const val = parseFloat(e.target.value);
      prod.best_timestamp_sec = isNaN(val) ? 0 : val;
      if (state.selectedProductId === prod.id) updateTargetDisplay(prod);
      debouncedSaveState();
    });

    if (descInput) descInput.addEventListener('input', e => {
      prod.description = e.target.value;
      debouncedSaveState();
    });

    if (btnDuplicate) btnDuplicate.addEventListener('click', () => {
      const copy = JSON.parse(JSON.stringify(prod));
      copy.id = 'p' + (Date.now() % 100000);
      copy.name = copy.name + ' (Copy)';
      state.products.push(copy);
      renderReviewList();
      saveStateToLocalStorage();
      showToast('Product duplicated');
    });

    if (btnDelete) btnDelete.addEventListener('click', () => {
      state.products = state.products.filter(p => p.id !== prod.id);
      if (state.selectedProductId === prod.id) state.selectedProductId = null;
      renderReviewList();
      saveStateToLocalStorage();
      showToast('Product deleted');
    });
  }

  // Filter Buttons
  els.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      els.filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      renderReviewList();
    });
  });

  // Add Product Button
  if (els.btnAddProduct) {
    els.btnAddProduct.addEventListener('click', () => {
      const newId = 'p' + (state.products.length + 1);
      const currentTime = els.studioVideo ? parseFloat(els.studioVideo.currentTime.toFixed(1)) : 0.0;
      const newProd = {
        id: newId,
        name: 'New Product ' + (state.products.length + 1),
        price: { amount: 10000, currency: state.currency_default, source: 'none' },
        description: 'New product description.',
        category: null,
        best_timestamp_sec: currentTime,
        confidence: 0.9,
        image: null
      };
      state.products.push(newProd);
      state.selectedProductId = newProd.id;
      renderReviewList();
      saveStateToLocalStorage();
      showToast('Added new product row');
    });
  }

  // HTML escaping helper
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Generate Storefront Bundle HTML & CSS
  function generateStorefrontHTML(inlinedImages = false, customData = null) {
    // Generate static HTML for the storefront using the template
    const source = customData || state;
    const vendorName = source.vendor_name || 'Vendor Catalog';
    const vendorPhone = source.vendor_phone || '';
    const defaultCurrency = source.currency_default || 'NGN';
    const prods = source.products || [];

    const cleanData = {
      vendor_name: vendorName,
      vendor_phone: vendorPhone,
      currency_default: defaultCurrency,
      tagline: source.tagline || '',
      theme: source.theme || 'emerald',
      layout: source.layout || 'standard',
      order_button_text: source.order_button_text || 'Order on WhatsApp',
      products: prods.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        category: p.category,
        best_timestamp_sec: p.best_timestamp_sec,
        image: inlinedImages
          ? (p.image || '')
          : (p.image && (p.image.startsWith('http://') || p.image.startsWith('https://') || p.image.startsWith('data:') || p.image.startsWith('/'))
              ? p.image
              : (p.image ? `images/${p.id}.jpg` : ''))
      }))
    };

    const cssContent = getStorefrontCSS();
    const themeClass = source.theme ? `theme-${source.theme}` : 'theme-emerald';
    const layoutClass = source.layout === 'compact' ? ' layout-compact' : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${escapeHtml(vendorName)} - Storefront</title>
  <meta name="description" content="Browse verified products from ${escapeHtml(vendorName)} and order directly on WhatsApp.">
  <style>
${cssContent}
  </style>
</head>
<body class="${themeClass}${layoutClass}">

  <!-- Sticky Top Header -->
  <header class="store-header" role="banner">
    <div class="header-container">
      <div class="vendor-brand">
        <div class="vendor-avatar" id="vendor-avatar" aria-hidden="true">${escapeHtml(vendorName.trim().charAt(0).toUpperCase() || 'S')}</div>
        <div class="vendor-info">
          <h1 class="store-name">
            <span>${escapeHtml(vendorName)}</span>
            <span class="verified-badge" title="Direct Vendor Verified">
              <svg class="icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </span>
          </h1>
          <p class="store-tagline">${escapeHtml(source.tagline || 'Fast orders directly on WhatsApp')}</p>
        </div>
      </div>

      <a id="header-contact-link" href="${buildWaUrl(vendorPhone, `Hello ${vendorName}! I am viewing your catalog and would like to make an inquiry.`)}" target="_blank" rel="noopener noreferrer" class="header-contact-btn" aria-label="Chat with vendor on WhatsApp">
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.947 2.796.947 3.179 0 5.766-2.587 5.767-5.766.001-3.181-2.585-5.767-5.767-5.767zm3.385 8.169c-.145.407-.732.748-1.02.793-.277.043-.637.075-1.834-.419-1.529-.632-2.508-2.186-2.584-2.288-.077-.102-.619-.824-.619-1.572 0-.748.391-1.116.53-1.268.14-.153.306-.192.408-.192.102 0 .204.001.293.006.094.004.22-.036.344.262.127.306.435 1.061.473 1.139.038.077.064.167.013.269-.051.102-.077.165-.153.255-.077.089-.161.199-.23.267-.077.076-.157.16-.067.314.089.153.397.655.852 1.06 0.585.521 1.077.683 1.231.76.154.077.243.064.333-.039.09-.102.384-.447.486-.6.103-.154.205-.128.346-.077.141.051.895.422 1.049.499.154.077.256.115.295.179.038.064.038.371-.107.778z"/>
        </svg>
        <span>Message Store</span>
      </a>
    </div>
  </header>

  <!-- Live Theme Customizer Bar -->
  <section class="live-theme-bar" aria-label="Storefront Styling">
    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
      <div class="live-theme-selector">
        <span>🎨 Style:</span>
        <select id="live-theme-select" class="live-theme-select" aria-label="Select storefront theme">
          <option value="emerald" ${cleanData.theme === 'emerald' ? 'selected' : ''}>🌿 Emerald (WhatsApp)</option>
          <option value="luxury-gold" ${cleanData.theme === 'luxury-gold' ? 'selected' : ''}>👑 Royal Obsidian Gold</option>
          <option value="sunset" ${cleanData.theme === 'sunset' ? 'selected' : ''}>🌅 Sunset Terracotta</option>
          <option value="tech-blue" ${cleanData.theme === 'tech-blue' ? 'selected' : ''}>⚡ Cyber Blue</option>
          <option value="blush" ${cleanData.theme === 'blush' ? 'selected' : ''}>🌸 Blush Rose</option>
          <option value="minimal" ${cleanData.theme === 'minimal' ? 'selected' : ''}>🖋️ Minimalist</option>
        </select>
      </div>
      <div class="live-theme-selector">
        <span>📐 Grid:</span>
        <select id="live-layout-select" class="live-theme-select" aria-label="Select layout grid">
          <option value="standard" ${cleanData.layout === 'standard' ? 'selected' : ''}>Standard (1 Col)</option>
          <option value="compact" ${cleanData.layout === 'compact' ? 'selected' : ''}>Compact (2 Col)</option>
        </select>
      </div>
    </div>
    <div style="display:flex;gap:6px;align-items:center;margin-left:auto">
      <button id="btn-live-pdf" class="live-action-btn" title="Print or Save Catalog as PDF">
        📄 PDF Catalog
      </button>
      <button id="btn-live-share" class="live-action-btn" title="Share catalog">
        📲 Share
      </button>
    </div>
  </section>

  <!-- Category Filter Pills Bar -->
  <nav class="category-filter-bar" id="category-filter-bar" aria-label="Product Categories"></nav>

  <!-- Store Stats -->
  <section class="store-intro" aria-label="Catalog Overview">
    <div class="catalog-stats-bar">
      <span>Catalog: <strong class="stats-count">${cleanData.products.length} item${cleanData.products.length === 1 ? '' : 's'}</strong></span>
      <span>Direct WhatsApp Checkout</span>
    </div>
  </section>

  <!-- Product Grid -->
  <main class="main-content">
    <div class="product-grid" id="product-grid" role="list">
${cleanData.products.length === 0 ? `
      <div style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-lg); margin: 20px 0;">
        <div style="font-size: 2.2rem; margin-bottom: 10px;">🛍️</div>
        <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 6px;">Your Catalog is Ready</h3>
        <p style="font-size: 0.875rem; color: var(--color-text-secondary); max-width: 320px; margin: 0 auto;">Add products in the workspace editor or generate starter suggestions to populate your live shop.</p>
      </div>
` : cleanData.products.map(p => {
  const hasPrice = p.price && p.price.amount !== null && !isNaN(p.price.amount);
  const formattedPrice = hasPrice ? formatPrice(p.price.amount, p.price.currency || defaultCurrency) : null;
  const orderMsg = hasPrice
    ? (source.message_template || 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price})')
        .replace(/{vendor_name}/g, vendorName)
        .replace(/{product_name}/g, p.name)
        .replace(/{product_price}/g, formattedPrice)
    : `Hello ${vendorName}! What is the price and availability for *${p.name}*? I saw it on your catalog.`;

  const orderUrl = buildWaUrl(vendorPhone, orderMsg);
  const btnClass = hasPrice ? 'btn-order-wa' : 'btn-order-wa btn-ask-wa';
  const btnLabel = hasPrice ? (source.order_button_text || 'Order on WhatsApp') : 'Ask for Price on WhatsApp';

  return `      <article class="product-card" role="listitem" data-cat="${escapeHtml(p.category || '')}">
        <div class="product-image-wrap">
          ${p.category ? `<span class="product-category-tag">${escapeHtml(p.category)}</span>` : ''}
          ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" class="product-image" loading="lazy" decoding="async">` : `<div class="image-fallback"><span>No Photo</span></div>`}
        </div>
        <div class="product-body">
          <h2 class="product-title">${escapeHtml(p.name)}</h2>
          <p class="product-desc">${escapeHtml(p.description || '')}</p>
          <div class="product-price-row">
            ${hasPrice ? `<span class="product-price">${formattedPrice}</span>` : `<span class="price-ask">Ask for price</span>`}
          </div>
          <a href="${orderUrl}" target="_blank" rel="noopener noreferrer" class="${btnClass}">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.947 2.796.947 3.179 0 5.766-2.587 5.767-5.766.001-3.181-2.585-5.767-5.767-5.767zm3.385 8.169c-.145.407-.732.748-1.02.793-.277.043-.637.075-1.834-.419-1.529-.632-2.508-2.186-2.584-2.288-.077-.102-.619-.824-.619-1.572 0-.748.391-1.116.53-1.268.14-.153.306-.192.408-.192.102 0 .204.001.293.006.094.004.22-.036.344.262.127.306.435 1.061.473 1.139.038.077.064.167.013.269-.051.102-.077.165-.153.255-.077.089-.161.199-.23.267-.077.076-.157.16-.067.314.089.153.397.655.852 1.06 0.585.521 1.077.683 1.231.76.154.077.243.064.333-.039.09-.102.384-.447.486-.6.103-.154.205-.128.346-.077.141.051.895.422 1.049.499.154.077.256.115.295.179.038.064.038.371-.107.778z"/>
            </svg>
            <span>${btnLabel}</span>
          </a>
        </div>
      </article>`;
}).join('\n')}
    </div>
  </main>

  <!-- Sticky Bottom Contact FAB -->
  <a href="${buildWaUrl(vendorPhone, `Hello ${vendorName}! I am viewing your catalog and would like to ask a question.`)}" target="_blank" rel="noopener noreferrer" class="sticky-wa-fab">
    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.947 2.796.947 3.179 0 5.766-2.587 5.767-5.766.001-3.181-2.585-5.767-5.767-5.767zm3.385 8.169c-.145.407-.732.748-1.02.793-.277.043-.637.075-1.834-.419-1.529-.632-2.508-2.186-2.584-2.288-.077-.102-.619-.824-.619-1.572 0-.748.391-1.116.53-1.268.14-.153.306-.192.408-.192.102 0 .204.001.293.006.094.004.22-.036.344.262.127.306.435 1.061.473 1.139.038.077.064.167.013.269-.051.102-.077.165-.153.255-.077.089-.161.199-.23.267-.077.076-.157.16-.067.314.089.153.397.655.852 1.06 0.585.521 1.077.683 1.231.76.154.077.243.064.333-.039.09-.102.384-.447.486-.6.103-.154.205-.128.346-.077.141.051.895.422 1.049.499.154.077.256.115.295.179.038.064.038.371-.107.778z"/>
    </svg>
    <span>Chat with Vendor</span>
  </a>

  <footer class="store-footer">
    <p>Powered by CatalogSmith &bull; Mobile-First Video Storefront</p>
  </footer>

  <script>
    window.CatalogSmith_DATA = window.ContentSmith_DATA = ${JSON.stringify(cleanData, null, 2)};
    (function() {
      const data = window.CatalogSmith_DATA || window.ContentSmith_DATA;
      const thSel = document.getElementById('live-theme-select');
      const laySel = document.getElementById('live-layout-select');
      function updateClasses() {
        const th = thSel ? thSel.value : (data.theme || 'emerald');
        const lay = laySel ? laySel.value : (data.layout || 'standard');
        document.body.className = 'theme-' + th + (lay === 'compact' ? ' layout-compact' : '');
      }
      if (thSel) thSel.onchange = updateClasses;
      if (laySel) laySel.onchange = updateClasses;

      // PDF Catalog & Share buttons
      const pdfBtn = document.getElementById('btn-live-pdf');
      if (pdfBtn) pdfBtn.onclick = function() { window.print(); };

      const shareBtn = document.getElementById('btn-live-share');
      if (shareBtn) {
        shareBtn.onclick = function() {
          try {
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'ContentSmith_SHARE_CURRENT' }, '*');
              return;
            }
          } catch(e) {}
          const t = '${escapeHtml(vendorName)} - Product Catalog';
          const msg = '🛍️ *' + t + '*\\n${escapeHtml(state.tagline || 'Direct orders via WhatsApp')}\\n\\nBrowse products and order directly on WhatsApp!';
          const url = window.location.href;
          window.open('https://wa.me/?text=' + encodeURIComponent(msg + '\\n' + url), '_blank');
        };
      }

      // Category filter pills
      const catBar = document.getElementById('category-filter-bar');
      const cards = document.querySelectorAll('.product-card');
      if (catBar && data.products && data.products.length) {
        const cats = ['all'];
        data.products.forEach(p => {
          if (p.category && !cats.includes(p.category)) cats.push(p.category);
        });
        if (cats.length > 2) {
          catBar.innerHTML = '';
          cats.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'cat-pill' + (c === 'all' ? ' active' : '');
            btn.textContent = c === 'all' ? 'All Products' : c;
            btn.onclick = () => {
              catBar.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              cards.forEach(card => {
                const cardCat = card.getAttribute('data-cat') || '';
                card.style.display = (c === 'all' || cardCat === c) ? '' : 'none';
              });
            };
            catBar.appendChild(btn);
          });
        } else {
          catBar.style.display = 'none';
        }
      }
    })();
  </script>
</body>
</html>`;
  }

  function buildWaUrl(phone, text) {
    const clean = String(phone || '').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text);
    return clean ? `https://wa.me/${clean}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  }

  function getStorefrontCSS() {
    return `:root{--color-bg:#f8fafc;--color-surface:#ffffff;--color-text-primary:#0f172a;--color-text-secondary:#475569;--color-text-muted:#64748b;--color-border:#e2e8f0;--color-wa:#25D366;--color-wa-hover:#1ebc59;--color-price:#047857;--color-ask-price:#4338ca;--color-ask-price-bg:#eef2ff;--font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;--radius-md:12px;--radius-lg:16px;--radius-full:9999px;--tap-target:48px}
body.theme-luxury-gold, .theme-luxury-gold{--color-bg:#0c0d12;--color-surface:#141721;--color-text-primary:#f8fafc;--color-text-secondary:#94a3b8;--color-text-muted:#64748b;--color-border:#23283b;--color-price:#fbbf24;--color-price-bg:rgba(251,191,36,0.1);--color-wa:#d97706;--color-wa-hover:#b45309}
body.theme-luxury-gold .vendor-avatar, .theme-luxury-gold .vendor-avatar{background:linear-gradient(135deg,#b45309,#fbbf24);color:#0c0d12}
body.theme-sunset, .theme-sunset{--color-bg:#fffbf5;--color-surface:#ffffff;--color-text-primary:#1c1917;--color-text-secondary:#57534e;--color-text-muted:#78716c;--color-border:#e7e5e4;--color-price:#c2410c;--color-price-bg:#ffedd5;--color-wa:#ea580c;--color-wa-hover:#c2410c}
body.theme-sunset .vendor-avatar, .theme-sunset .vendor-avatar{background:linear-gradient(135deg,#c2410c,#f97316)}
body.theme-tech-blue, .theme-tech-blue{--color-bg:#0b1120;--color-surface:#0f172a;--color-text-primary:#f8fafc;--color-text-secondary:#94a3b8;--color-text-muted:#64748b;--color-border:#1e293b;--color-price:#38bdf8;--color-price-bg:rgba(56,189,248,0.1);--color-wa:#0284c7;--color-wa-hover:#0369a1}
body.theme-tech-blue .vendor-avatar, .theme-tech-blue .vendor-avatar{background:linear-gradient(135deg,#0284c7,#38bdf8)}
body.theme-blush, .theme-blush{--color-bg:#fff1f2;--color-surface:#ffffff;--color-text-primary:#881337;--color-text-secondary:#9f1239;--color-text-muted:#be123c;--color-border:#fecdd3;--color-price:#e11d48;--color-price-bg:#ffe4e6;--color-wa:#e11d48;--color-wa-hover:#be123c}
body.theme-blush .vendor-avatar, .theme-blush .vendor-avatar{background:linear-gradient(135deg,#e11d48,#fb7185);color:#ffffff}
body.theme-minimal, .theme-minimal{--color-bg:#f5f5f4;--color-surface:#ffffff;--color-text-primary:#18181b;--color-text-secondary:#52525b;--color-text-muted:#71717a;--color-border:#d4d4d8;--color-price:#18181b;--color-price-bg:#e4e4e7;--color-wa:#27272a;--color-wa-hover:#18181b}
body.theme-minimal .vendor-avatar, .theme-minimal .vendor-avatar{background:#18181b;color:#ffffff}
.live-theme-bar{max-width:840px;margin:8px auto 0 auto;padding:0 16px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.live-theme-selector{display:flex;align-items:center;gap:6px;background-color:var(--color-surface);border:1px solid var(--color-border);padding:4px 10px;border-radius:var(--radius-full);font-size:0.75rem;font-weight:600;color:var(--color-text-secondary)}
.live-theme-select{background:none;border:none;color:var(--color-text-primary);font-size:0.75rem;font-weight:700;outline:none;cursor:pointer}
.live-action-btn{display:inline-flex;align-items:center;gap:5px;background-color:var(--color-surface);border:1px solid var(--color-border);padding:4px 10px;border-radius:var(--radius-full);font-size:0.75rem;font-weight:700;color:var(--color-text-primary);cursor:pointer;text-decoration:none;transition:all 0.15s ease;white-space:nowrap}
.live-action-btn:hover{background-color:var(--color-wa);color:#fff;border-color:var(--color-wa)}
.category-filter-bar{max-width:840px;margin:10px auto 0 auto;padding:0 16px;display:flex;gap:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.category-filter-bar::-webkit-scrollbar{display:none}
.cat-pill{display:inline-flex;align-items:center;padding:6px 14px;border-radius:var(--radius-full);background-color:var(--color-surface);border:1px solid var(--color-border);color:var(--color-text-secondary);font-size:0.8125rem;font-weight:600;white-space:nowrap;cursor:pointer;min-height:36px;transition:all 0.15s ease}
.cat-pill.active{background-color:var(--color-wa);color:#fff;border-color:var(--color-wa)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{font-family:var(--font-family);background-color:var(--color-bg);color:var(--color-text-primary);line-height:1.5}body{min-height:100vh;display:flex;flex-direction:column;padding-bottom:96px;background-color:var(--color-bg);color:var(--color-text-primary)}.store-header{position:sticky;top:0;z-index:40;background-color:var(--color-surface);border-bottom:1px solid var(--color-border);padding:12px 16px}.header-container{max-width:840px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}.vendor-brand{display:flex;align-items:center;gap:10px;min-width:0}.vendor-avatar{width:40px;height:40px;border-radius:var(--radius-full);background:linear-gradient(135deg,#128C7E,#25D366);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;flex-shrink:0}.vendor-info{min-width:0}.store-name{font-size:1.125rem;font-weight:700;display:flex;align-items:center;gap:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.verified-badge{color:#10b981;display:inline-flex}.store-tagline{font-size:0.8125rem;color:var(--color-text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.header-contact-btn{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:8px 14px;background-color:var(--color-wa);color:#ffffff;border:none;border-radius:var(--radius-full);font-size:0.875rem;font-weight:600;text-decoration:none;cursor:pointer;white-space:nowrap}.store-intro{max-width:840px;margin:12px auto 8px auto;padding:0 16px;width:100%}.catalog-stats-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background-color:var(--color-surface);border-radius:var(--radius-md);font-size:0.8125rem;color:var(--color-text-secondary);border:1px solid var(--color-border)}.stats-count{font-weight:600;color:var(--color-text-primary)}.main-content{max-width:840px;margin:0 auto;padding:12px 16px;width:100%;flex:1}.product-grid{display:grid;grid-template-columns:1fr;gap:16px}@media(min-width:560px){.product-grid{grid-template-columns:repeat(2,1fr);gap:18px}}body.layout-compact .product-grid{grid-template-columns:repeat(2,1fr);gap:12px}body.layout-compact .product-title{font-size:0.9375rem}body.layout-compact .product-desc{font-size:0.75rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}body.layout-compact .product-price{font-size:1.0625rem}body.layout-compact .btn-order-wa{font-size:0.8125rem;padding:8px 10px;min-height:40px}.product-card{background-color:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);display:flex;flex-direction:column}.product-image-wrap{position:relative;width:100%;aspect-ratio:4/3;background-color:rgba(0,0,0,0.05);overflow:hidden}.product-image{width:100%;height:100%;object-fit:cover;display:block}.product-category-tag{position:absolute;top:10px;left:10px;background-color:rgba(15,23,42,0.75);color:#ffffff;font-size:0.6875rem;font-weight:600;text-transform:uppercase;padding:3px 8px;border-radius:var(--radius-full)}.image-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--color-text-muted);font-size:0.8125rem;background:rgba(0,0,0,0.04)}.product-body{padding:14px;display:flex;flex-direction:column;flex:1}.product-title{font-size:1.0625rem;font-weight:600;line-height:1.35;margin-bottom:6px}.product-desc{font-size:0.875rem;color:var(--color-text-secondary);line-height:1.45;margin-bottom:12px;flex:1}.product-price-row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px}.product-price{font-size:1.25rem;font-weight:800;color:var(--color-price)}.price-ask{display:inline-flex;align-items:center;font-size:0.9375rem;font-weight:700;color:var(--color-ask-price);background-color:var(--color-ask-price-bg);padding:3px 10px;border-radius:6px}.btn-order-wa{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:var(--tap-target);padding:12px 18px;background-color:var(--color-wa);color:#ffffff;border:none;border-radius:var(--radius-md);font-size:1rem;font-weight:700;text-decoration:none;cursor:pointer}.btn-ask-wa{background-color:#3b82f6}.sticky-wa-fab{position:fixed;bottom:20px;right:20px;z-index:50;display:flex;align-items:center;gap:8px;padding:12px 18px;min-height:var(--tap-target);background-color:var(--color-wa);color:#ffffff;border-radius:var(--radius-full);box-shadow:0 6px 16px rgba(37,211,102,0.35);text-decoration:none;font-weight:700;font-size:0.9375rem}.store-footer{margin-top:auto;border-top:1px solid var(--color-border);padding:24px 16px;text-align:center;font-size:0.8125rem;color:var(--color-text-muted)}.icon{width:20px;height:20px;display:inline-block;vertical-align:middle;fill:currentColor}
@media print{@page{size:A4 portrait;margin:12mm 10mm}html,body{background-color:#fff!important;color:#0f172a!important;padding-bottom:0!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.store-header{position:static!important;border-bottom:2px solid #047857!important;padding:8px 0 12px 0!important;box-shadow:none!important}.live-theme-bar,.category-filter-bar,.sticky-wa-fab,.header-contact-btn{display:none!important}.product-grid{display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:14px!important}.product-card{page-break-inside:avoid!important;break-inside:avoid!important;border:1px solid #e2e8f0!important;box-shadow:none!important;border-radius:8px!important}.product-image-wrap{aspect-ratio:4/3!important;max-height:180px!important}.product-image{object-fit:cover!important}.btn-order-wa{background-color:#f8fafc!important;color:#047857!important;border:1px solid #cbd5e1!important;font-size:0.75rem!important;padding:6px 10px!important;min-height:32px!important;box-shadow:none!important}.store-footer{border-top:1px solid #e2e8f0!important;padding:12px 0!important;font-size:0.75rem!important}}`;
  }

  // Update Live Phone Simulator
  function updateLivePreview() {
    if (!els.previewFrame) return;
    const html = generateStorefrontHTML(true);
    els.previewFrame.srcdoc = html;
  }

  if (els.btnRefreshPreview) {
    els.btnRefreshPreview.addEventListener('click', () => {
      updateLivePreview();
      showToast('Preview refreshed');
    });
  }

  // Helper: Convert DataURL to Blob
  function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Export 1: ZIP Package
  async function exportZipBundle() {
    if (!window.JSZip) {
      showToast('JSZip library not loaded');
      return;
    }
    showToast('Building storefront ZIP package...');

    try {
      const zip = new JSZip();

      // 1. index.html
      const storefrontHtml = generateStorefrontHTML(false);
      zip.file('index.html', storefrontHtml);

      // 2. storefront.css
      zip.file('storefront.css', getStorefrontCSS());

      // 2b. catalog-lookbook.html (Standalone Printable A4 Lookbook)
      if (window.ContentSmithPDF && window.ContentSmithPDF.createLookbookHTML) {
        zip.file('catalog-lookbook.html', window.ContentSmithPDF.createLookbookHTML(state));
      }

      // 3. products.json
      const catalogData = {
        vendor_name: state.vendor_name,
        vendor_phone: state.vendor_phone,
        currency_default: state.currency_default,
        tagline: state.tagline,
        theme: state.theme,
        layout: state.layout,
        order_button_text: state.order_button_text,
        products: state.products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          category: p.category,
          best_timestamp_sec: p.best_timestamp_sec,
          confidence: p.confidence
        }))
      };
      zip.file('products.json', JSON.stringify(catalogData, null, 2));

      // 4. images folder
      const imgFolder = zip.folder('images');
      for (const p of state.products) {
        if (p.image && p.image.startsWith('data:image')) {
          const blob = dataUrlToBlob(p.image);
          imgFolder.file(`${p.id}.jpg`, blob);
        }
      }

      // 5. DEPLOY_GUIDE.md
      const deployGuide = `# Deployment Instructions for ${state.vendor_name || 'Vendor Store'}

Congratulations! Your ContentSmith mobile storefront package is ready to go live.
Zero git accounts, zero servers, and zero configuration needed.

---

## Option A: Cloudflare Pages (Free, Unlimited Bandwidth)
1. Visit https://dash.cloudflare.com in your mobile or desktop browser.
2. Go to **Workers & Pages** -> **Create application** -> **Pages**.
3. Choose **Upload assets**.
4. Enter a project name (e.g. \`${(state.vendor_name || 'mystore').toLowerCase().replace(/[^a-z0-9]/g, '-')}\`).
5. Drag and drop this unzipped folder into the upload box.
6. Click **Deploy site**.
Your store will immediately be live at \`https://your-project.pages.dev\`!

---

## Option B: Netlify Drop (Instant 10-Second Deploy, No Login Required)
1. Go to https://app.netlify.com/drop in your browser.
2. Drag and drop this ZIP file directly onto the web page.
3. In seconds, Netlify will generate a live HTTPS URL for your catalog.
4. Share the URL with your WhatsApp customers!
`;
      zip.file('DEPLOY_GUIDE.md', deployGuide);

      // Generate ZIP blob
      const content = await zip.generateAsync({ type: 'blob' });
      const filename = `ContentSmith-${(state.vendor_name || 'store').toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Downloaded ${filename}!`);
    } catch (err) {
      console.error(err);
      showToast(`ZIP export failed: ${err.message}`);
    }
  }

  // Export 2: Single-File HTML
  function exportSingleFileHtml() {
    const singleHtml = generateStorefrontHTML(true);
    const blob = new Blob([singleHtml], { type: 'text/html;charset=utf-8' });
    const filename = `${(state.vendor_name || 'store').toLowerCase().replace(/[^a-z0-9]/g, '-')}-storefront.html`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded ${filename} (Standalone Single File)`);
  }

  // Export 3: Save Project State JSON
  function saveProjectJson() {
    const data = {
      vendor_name: state.vendor_name,
      vendor_phone: state.vendor_phone,
      currency_default: state.currency_default,
      tagline: state.tagline,
      theme: state.theme,
      layout: state.layout,
      order_button_text: state.order_button_text,
      message_template: state.message_template,
      products: state.products
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const filename = `ContentSmith-project-${Date.now()}.json`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Saved project state file!');
  }

  if (els.btnExportZip) els.btnExportZip.addEventListener('click', exportZipBundle);
  if (els.btnExportSingleHtml) els.btnExportSingleHtml.addEventListener('click', exportSingleFileHtml);
  if (els.btnDownloadPdf) {
    els.btnDownloadPdf.addEventListener('click', () => {
      if (window.ContentSmithPDF && window.ContentSmithPDF.downloadCatalogPDF) {
        window.ContentSmithPDF.downloadCatalogPDF(state);
      } else {
        showToast('PDF engine not loaded');
      }
    });
  }
  if (els.btnOpenLookbook) {
    els.btnOpenLookbook.addEventListener('click', () => {
      if (window.ContentSmithPDF && window.ContentSmithPDF.openPrintableLookbook) {
        window.ContentSmithPDF.openPrintableLookbook(state);
      } else {
        showToast('PDF engine not loaded');
      }
    });
  }
  // Share Catalog button in Step 4
  if (els.btnShareCatalog) {
    els.btnShareCatalog.addEventListener('click', () => {
      if (window.CatalogStore && window.CatalogStore.openShareModal) {
        window.CatalogStore.openShareModal(state);
      } else if (window.ContentSmithPDF && window.ContentSmithPDF.shareCatalog) {
        window.ContentSmithPDF.shareCatalog(state);
      }
    });
  }

  // Header Share button
  const btnWorkspaceShareHeader = document.getElementById('btn-workspace-share-header');
  if (btnWorkspaceShareHeader) {
    btnWorkspaceShareHeader.addEventListener('click', () => {
      if (window.CatalogStore && window.CatalogStore.openShareModal) {
        window.CatalogStore.openShareModal(state);
      }
    });
  }

  // Header "All Catalogs" button in workspace
  const btnWorkspaceToAdmin = document.getElementById('btn-workspace-to-admin');
  if (btnWorkspaceToAdmin) {
    btnWorkspaceToAdmin.addEventListener('click', () => {
      if (window.ContentSmithApp && window.ContentSmithApp.showAdmin) {
        window.ContentSmithApp.showAdmin();
      }
    });
  }

  // Step 4 Live Sharable URL Banner Bindings
  const step4UrlInput = document.getElementById('step4-share-url-input');
  const btnStep4Copy = document.getElementById('btn-step4-copy-url');
  const btnStep4Wa = document.getElementById('btn-step4-share-wa');
  const btnStep4Modal = document.getElementById('btn-step4-open-share-modal');
  const btnStep4Preview = document.getElementById('btn-step4-preview-live');

  if (btnStep4Copy) {
    btnStep4Copy.addEventListener('click', () => {
      const url = step4UrlInput ? step4UrlInput.value : (window.CatalogStore ? window.CatalogStore.getSharableUrl(state) : window.location.href);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showToast(`📋 Copied sharable link for "${state.vendor_name}"!`);
        });
      } else {
        if (step4UrlInput) {
          step4UrlInput.select();
          document.execCommand('copy');
        }
        showToast(`📋 Copied sharable link for "${state.vendor_name}"!`);
      }
    });
  }

  if (btnStep4Wa) {
    btnStep4Wa.addEventListener('click', () => {
      const url = step4UrlInput ? step4UrlInput.value : (window.CatalogStore ? window.CatalogStore.getSharableUrl(state) : window.location.href);
      const msg = `🛍️ *${state.vendor_name} - Online Store*\n${state.tagline || 'Direct orders on WhatsApp'}\n\nBrowse verified products and order with 1 tap:\n👉 ${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  if (btnStep4Modal) {
    btnStep4Modal.addEventListener('click', () => {
      if (window.CatalogStore && window.CatalogStore.openShareModal) {
        window.CatalogStore.openShareModal(state);
      }
    });
  }

  if (btnStep4Preview) {
    btnStep4Preview.addEventListener('click', () => {
      const url = step4UrlInput ? step4UrlInput.value : (window.CatalogStore ? window.CatalogStore.getSharableUrl(state) : window.location.href);
      window.open(url, '_blank');
    });
  }

  // Cross-frame listener for simulator iframe share button
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'ContentSmith_SHARE_CURRENT') {
      if (window.CatalogStore && window.CatalogStore.openShareModal) {
        window.CatalogStore.openShareModal(state);
      }
    }
  });
  if (els.btnSaveProjectJson) els.btnSaveProjectJson.addEventListener('click', saveProjectJson);
  if (els.btnCopyStoreJson) {
    els.btnCopyStoreJson.addEventListener('click', () => {
      const data = {
        vendor_name: state.vendor_name,
        vendor_phone: state.vendor_phone,
        currency_default: state.currency_default,
        theme: state.theme,
        layout: state.layout,
        order_button_text: state.order_button_text,
        products: state.products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          category: p.category,
          best_timestamp_sec: p.best_timestamp_sec,
          confidence: p.confidence
        }))
      };
      navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
        showToast('products.json copied to clipboard!');
      });
    });
  }

  // Modals & Clipboard Helpers
  function setupModals() {
    function openModal(m) { m.classList.add('open'); }
    function closeModal(m) { m.classList.remove('open'); }

    if (els.btnOpenPrompts) els.btnOpenPrompts.addEventListener('click', () => openModal(els.promptsModal));
    if (els.btnQuickGuide) els.btnQuickGuide.addEventListener('click', () => openModal(els.promptsModal));
    if (els.btnClosePrompts) els.btnClosePrompts.addEventListener('click', () => closeModal(els.promptsModal));

    if (els.btnOpenFallback) els.btnOpenFallback.addEventListener('click', () => openModal(els.fallbackModal));
    if (els.btnCloseFallback) els.btnCloseFallback.addEventListener('click', () => closeModal(els.fallbackModal));

    // Close on backdrop click
    [els.promptsModal, els.fallbackModal].forEach(m => {
      m.addEventListener('click', e => {
        if (e.target === m) closeModal(m);
      });
    });

    // Copy Prompt Buttons
    if (els.btnCopyVideoPrompt) {
      els.btnCopyVideoPrompt.addEventListener('click', () => {
        const text = document.getElementById('code-video-prompt').innerText;
        navigator.clipboard.writeText(text).then(() => showToast('Video prompt copied!'));
      });
    }

    if (els.btnCopySchema) {
      els.btnCopySchema.addEventListener('click', () => {
        const text = document.getElementById('code-schema').innerText;
        navigator.clipboard.writeText(text).then(() => showToast('JSON schema copied!'));
      });
    }

    if (els.btnCopyPerFramePrompt) {
      els.btnCopyPerFramePrompt.addEventListener('click', () => {
        const promptText = `You are analyzing a single frame from a vendor product video, which may be a WhatsApp chat screenshot, a person holding up a physical item, or a shelf of displayed goods. Identify any distinct product visible in this frame. If visible, extract the product name or description, price if stated as text or visible on a tag, and a short description. If this frame shows a chat interface, extract only the product-related message content, not timestamps or sender names. If this frame shows multiple products at once, such as a shelf, return an array of separate product objects, one per distinct item. If no clear product is identifiable in this frame, such as a transition, blank screen, or person's face only, return null.`;
        navigator.clipboard.writeText(promptText).then(() => showToast('Per-frame prompt copied!'));
      });
    }

    // Fallback Filmstrip Extractor
    if (els.btnRunFrameSampling) {
      els.btnRunFrameSampling.addEventListener('click', runFallbackFrameSampling);
    }
  }

  // Fallback Frame Sampling Logic
  async function runFallbackFrameSampling() {
    if (!state.videoLoaded) {
      showToast('Please select a video file in Step 1 first');
      return;
    }
    const interval = parseFloat(els.fallbackIntervalSelect.value) || 1.5;
    const duration = state.videoDuration;
    const video = els.studioVideo;
    const canvas = els.captureCanvas;
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    els.fallbackFilmstrip.innerHTML = '';
    els.fallbackStatus.textContent = 'Sampling frames across video...';

    const timestamps = [];
    for (let t = 0.5; t < duration; t += interval) {
      timestamps.push(parseFloat(t.toFixed(1)));
    }

    for (let i = 0; i < Math.min(timestamps.length, 30); i++) {
      const ts = timestamps[i];
      await new Promise(res => {
        const onSeek = () => {
          video.removeEventListener('seeked', onSeek);
          res();
        };
        video.addEventListener('seeked', onSeek);
        video.currentTime = ts;
      });

      await new Promise(r => setTimeout(r, 40));
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

      const itemEl = document.createElement('div');
      itemEl.className = 'filmstrip-item';
      itemEl.innerHTML = `
        <img src="${dataUrl}" alt="Frame at ${ts}s">
        <div class="filmstrip-time">${ts}s</div>
      `;
      itemEl.addEventListener('click', () => {
        video.currentTime = ts;
        showToast(`Jumped video to ${ts}s`);
      });
      els.fallbackFilmstrip.appendChild(itemEl);
    }

    els.fallbackStatus.textContent = `Extracted ${Math.min(timestamps.length, 30)} candidate frames. Tap any frame to jump to it.`;
  }

  // =========================================================================
  // Photo Editor Modal & Studio Filters
  // =========================================================================
  const photoEditor = {
    productId: null,
    sourceImage: null,
    cropRatio: 'orig',
    brightness: 0,
    contrast: 0,
    saturation: 0,
    warmth: 0,
    studioBackdrop: false
  };

  function openPhotoEditor(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    photoEditor.productId = productId;
    photoEditor.cropRatio = 'orig';
    photoEditor.brightness = 0;
    photoEditor.contrast = 0;
    photoEditor.saturation = 0;
    photoEditor.warmth = 0;
    photoEditor.studioBackdrop = false;

    // Reset controls
    if (els.sliderBright) els.sliderBright.value = 0;
    if (els.sliderContrast) els.sliderContrast.value = 0;
    if (els.sliderSat) els.sliderSat.value = 0;
    if (els.sliderWarmth) els.sliderWarmth.value = 0;
    if (els.valBright) els.valBright.textContent = '0%';
    if (els.valContrast) els.valContrast.textContent = '0%';
    if (els.valSat) els.valSat.textContent = '0%';
    if (els.valWarmth) els.valWarmth.textContent = '0%';
    if (els.checkStudioBackdrop) els.checkStudioBackdrop.checked = false;

    if (els.cropPills) {
      els.cropPills.forEach(p => p.classList.toggle('active', p.dataset.ratio === 'orig'));
    }

    const openModalWithSource = (src) => {
      photoEditor.sourceImage = src;
      renderPhotoEditorCanvas();
      if (els.photoEditorModal) els.photoEditorModal.classList.add('open');
    };

    if (prod.image) {
      const img = new Image();
      let opened = false;
      const safeOpen = () => {
        if (!opened) {
          opened = true;
          openModalWithSource(img);
        }
      };
      // Do not set crossOrigin on data: URLs as it causes CORS/taint bugs in some browsers
      if (!prod.image.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = safeOpen;
      img.onerror = () => {
        if (!opened) {
          opened = true;
          const c = document.createElement('canvas');
          c.width = 600;
          c.height = 450;
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(0, 0, 600, 450);
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 22px sans-serif';
          ctx.fillText(prod.name || 'Product Image', 40, 230);
          openModalWithSource(c);
        }
      };
      img.src = prod.image;
      if (img.complete && img.naturalWidth > 0) {
        safeOpen();
      } else {
        setTimeout(safeOpen, 200);
      }
    } else if (state.videoLoaded && els.studioVideo) {
      const c = document.createElement('canvas');
      const dims = getConstrainedCanvasDimensions(els.studioVideo.videoWidth, els.studioVideo.videoHeight, 800);
      c.width = dims.width;
      c.height = dims.height;
      const ctx = c.getContext('2d');
      try {
        ctx.drawImage(els.studioVideo, 0, 0, c.width, c.height);
        const dataUrl = c.toDataURL('image/jpeg', 0.85);
        prod.image = dataUrl;
        const img = new Image();
        img.onload = () => openModalWithSource(img);
        img.src = dataUrl;
      } catch (e) {
        openModalWithSource(c);
      }
    } else {
      const c = document.createElement('canvas');
      c.width = 600;
      c.height = 450;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 600, 450);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(prod.name || 'Product Image', 40, 230);
      openModalWithSource(c);
    }
  }

  function renderPhotoEditorCanvas() {
    if (!photoEditor.sourceImage || !els.editorCanvas) return;
    const canvas = els.editorCanvas;
    const ctx = canvas.getContext('2d');
    const img = photoEditor.sourceImage;

    const naturalW = img.naturalWidth || img.width || 600;
    const naturalH = img.naturalHeight || img.height || 450;

    let targetW = 600;
    let targetH = 450;
    if (photoEditor.cropRatio === '1-1') {
      targetW = 500;
      targetH = 500;
    } else if (photoEditor.cropRatio === '4-3') {
      targetW = 600;
      targetH = 450;
    } else if (photoEditor.cropRatio === '3-4') {
      targetW = 450;
      targetH = 600;
    } else if (photoEditor.cropRatio === 'orig') {
      const aspect = naturalW / naturalH;
      targetW = 600;
      targetH = Math.max(300, Math.min(800, Math.round(600 / aspect)));
    }

    canvas.width = targetW;
    canvas.height = targetH;
    ctx.clearRect(0, 0, targetW, targetH);

    // Studio spotlight backdrop
    if (photoEditor.studioBackdrop) {
      const rad = ctx.createRadialGradient(targetW / 2, targetH / 2, 20, targetW / 2, targetH / 2, Math.max(targetW, targetH) / 1.1);
      rad.addColorStop(0, '#ffffff');
      rad.addColorStop(0.45, '#f8fafc');
      rad.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, targetW, targetH);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    const imgW = img.naturalWidth || targetW;
    const imgH = img.naturalHeight || targetH;
    const targetAspect = targetW / targetH;
    const imgAspect = imgW / imgH;

    let sx = 0, sy = 0, sW = imgW, sH = imgH;
    if (imgAspect > targetAspect) {
      sW = Math.round(imgH * targetAspect);
      sx = Math.round((imgW - sW) / 2);
    } else {
      sH = Math.round(imgW / targetAspect);
      sy = Math.round((imgH - sH) / 2);
    }

    ctx.save();
    const b = 100 + photoEditor.brightness;
    const c = 100 + photoEditor.contrast;
    const s = 100 + photoEditor.saturation;
    const sep = photoEditor.warmth > 0 ? photoEditor.warmth : 0;
    const hue = photoEditor.warmth < 0 ? photoEditor.warmth * 1.5 : 0;
    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) sepia(${sep}%) hue-rotate(${hue}deg)`;

    ctx.drawImage(img, sx, sy, sW, sH, 0, 0, targetW, targetH);
    ctx.restore();

    if (photoEditor.studioBackdrop) {
      const vig = ctx.createRadialGradient(targetW / 2, targetH / 2, targetW * 0.35, targetW / 2, targetH / 2, targetW * 0.7);
      vig.addColorStop(0, 'rgba(255,255,255,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.12)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, targetW, targetH);
    }
  }

  function bindPhotoEditorEvents() {
    if (els.btnCloseEditor) {
      els.btnCloseEditor.addEventListener('click', () => {
        if (els.photoEditorModal) els.photoEditorModal.classList.remove('open');
      });
    }
    if (els.photoEditorModal) {
      els.photoEditorModal.addEventListener('click', e => {
        if (e.target === els.photoEditorModal) {
          els.photoEditorModal.classList.remove('open');
        }
      });
    }

    if (els.sliderBright) {
      els.sliderBright.addEventListener('input', e => {
        photoEditor.brightness = parseInt(e.target.value, 10);
        if (els.valBright) els.valBright.textContent = `${photoEditor.brightness}%`;
        renderPhotoEditorCanvas();
      });
    }
    if (els.sliderContrast) {
      els.sliderContrast.addEventListener('input', e => {
        photoEditor.contrast = parseInt(e.target.value, 10);
        if (els.valContrast) els.valContrast.textContent = `${photoEditor.contrast}%`;
        renderPhotoEditorCanvas();
      });
    }
    if (els.sliderSat) {
      els.sliderSat.addEventListener('input', e => {
        photoEditor.saturation = parseInt(e.target.value, 10);
        if (els.valSat) els.valSat.textContent = `${photoEditor.saturation}%`;
        renderPhotoEditorCanvas();
      });
    }
    if (els.sliderWarmth) {
      els.sliderWarmth.addEventListener('input', e => {
        photoEditor.warmth = parseInt(e.target.value, 10);
        if (els.valWarmth) els.valWarmth.textContent = `${photoEditor.warmth}%`;
        renderPhotoEditorCanvas();
      });
    }

    if (els.checkStudioBackdrop) {
      els.checkStudioBackdrop.addEventListener('change', e => {
        photoEditor.studioBackdrop = e.target.checked;
        renderPhotoEditorCanvas();
      });
    }

    if (els.cropPills) {
      els.cropPills.forEach(pill => {
        pill.addEventListener('click', () => {
          els.cropPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          photoEditor.cropRatio = pill.dataset.ratio;
          renderPhotoEditorCanvas();
        });
      });
    }

    if (els.btnResetFilters) {
      els.btnResetFilters.addEventListener('click', () => {
        photoEditor.brightness = 0;
        photoEditor.contrast = 0;
        photoEditor.saturation = 0;
        photoEditor.warmth = 0;
        photoEditor.studioBackdrop = false;
        photoEditor.cropRatio = 'orig';
        if (els.sliderBright) els.sliderBright.value = 0;
        if (els.sliderContrast) els.sliderContrast.value = 0;
        if (els.sliderSat) els.sliderSat.value = 0;
        if (els.sliderWarmth) els.sliderWarmth.value = 0;
        if (els.valBright) els.valBright.textContent = '0%';
        if (els.valContrast) els.valContrast.textContent = '0%';
        if (els.valSat) els.valSat.textContent = '0%';
        if (els.valWarmth) els.valWarmth.textContent = '0%';
        if (els.checkStudioBackdrop) els.checkStudioBackdrop.checked = false;
        if (els.cropPills) {
          els.cropPills.forEach(p => p.classList.toggle('active', p.dataset.ratio === 'orig'));
        }
        renderPhotoEditorCanvas();
      });
    }

    if (els.btnSaveEditedPhoto) {
      els.btnSaveEditedPhoto.addEventListener('click', () => {
        if (!photoEditor.productId) return;
        const prod = state.products.find(p => p.id === photoEditor.productId);
        if (!prod) return;

        const dataUrl = els.editorCanvas.toDataURL('image/jpeg', 0.9);
        prod.image = dataUrl;

        const thumbImg = document.getElementById(`thumb-img-${prod.id}`);
        if (thumbImg) {
          thumbImg.src = dataUrl;
          thumbImg.style.display = 'block';
        }
        const emptyDiv = document.getElementById(`thumb-empty-${prod.id}`);
        if (emptyDiv) emptyDiv.style.display = 'none';

        saveStateToLocalStorage();
        updateLivePreview();
        if (els.photoEditorModal) els.photoEditorModal.classList.remove('open');
        showToast(`Saved enhanced photo for "${prod.name}"!`);
      });
    }
  }

  // =========================================================================
  // AI Studio Product Photo Generator
  // =========================================================================
  const aiGenerator = {
    productId: null,
    selectedVariationIndex: null,
    selectedStyle: 'minimal',
    variations: []
  };

  function openAiGenerator(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    aiGenerator.productId = productId;
    aiGenerator.selectedVariationIndex = null;
    aiGenerator.variations = [];

    if (els.aiTargetProductTitle) els.aiTargetProductTitle.textContent = prod.name;
    if (els.aiTargetProductDesc) {
      const priceText = prod.price && prod.price.amount !== null ? formatPrice(prod.price.amount, prod.price.currency) : 'Ask for price';
      els.aiTargetProductDesc.textContent = `${priceText} • ${prod.description || 'Verified product catalog item'}`;
    }

    if (els.aiPromptInput) {
      els.aiPromptInput.value = `Professional commercial studio photography of ${prod.name}, pristine seamless backdrop, cinematic softbox rim lighting, ultra-high resolution e-commerce product photograph`;
    }

    if (els.btnApplyAiPhoto) els.btnApplyAiPhoto.disabled = true;

    if (els.aiGeneratorModal) els.aiGeneratorModal.classList.add('open');

    // Generate variations immediately
    generateAiVariations();
  }

  function generateAiVariations() {
    if (!aiGenerator.productId) return;
    const prod = state.products.find(p => p.id === aiGenerator.productId);
    if (!prod) return;

    const container = els.aiVariationsContainer;
    if (!container) return;
    container.innerHTML = '<div style="color: var(--text-dim); padding: 20px; text-align: center;">Generating studio AI variations...</div>';

    aiGenerator.variations = [];
    aiGenerator.selectedVariationIndex = null;
    if (els.btnApplyAiPhoto) els.btnApplyAiPhoto.disabled = true;

    const themes = [
      {
        name: 'Clean White Studio',
        bg: ['#ffffff', '#f1f5f9'],
        badgeBg: '#0f172a',
        badgeText: '#ffffff',
        accent: '#10b981'
      },
      {
        name: 'Royal Obsidian Gold',
        bg: ['#0f172a', '#020617'],
        badgeBg: '#b45309',
        badgeText: '#fbbf24',
        accent: '#fbbf24'
      },
      {
        name: 'Warm Sunset Lifestyle',
        bg: ['#fff7ed', '#ffedd5'],
        badgeBg: '#c2410c',
        badgeText: '#ffffff',
        accent: '#ea580c'
      },
      {
        name: 'Editorial Minimalist',
        bg: ['#f8fafc', '#e2e8f0'],
        badgeBg: '#334155',
        badgeText: '#ffffff',
        accent: '#6366f1'
      }
    ];

    setTimeout(() => {
      container.innerHTML = '';
      themes.forEach((th, idx) => {
        const c = document.createElement('canvas');
        c.width = 400;
        c.height = 400;
        const ctx = c.getContext('2d');

        // Background gradient
        const grad = ctx.createRadialGradient(200, 200, 30, 200, 200, 260);
        grad.addColorStop(0, th.bg[0]);
        grad.addColorStop(1, th.bg[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 400);

        // Grid lines
        ctx.strokeStyle = 'rgba(0,0,0,0.03)';
        ctx.lineWidth = 1;
        for (let i = 40; i < 400; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0); ctx.lineTo(i, 400);
          ctx.stroke();
        }

        // Product presentation card
        ctx.fillStyle = th.badgeBg === '#0f172a' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.92)';
        ctx.beginPath();
        ctx.roundRect(30, 30, 340, 340, 16);
        ctx.fill();
        ctx.strokeStyle = th.accent;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Product title & category
        ctx.fillStyle = th.badgeBg === '#0f172a' ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 20px -apple-system, sans-serif';
        const nameShort = prod.name.length > 24 ? prod.name.slice(0, 22) + '...' : prod.name;
        ctx.fillText(nameShort, 50, 75);

        // Price pill
        const priceTxt = prod.price && prod.price.amount !== null ? formatPrice(prod.price.amount, prod.price.currency) : 'Ask for price';
        ctx.fillStyle = th.accent;
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.fillText(priceTxt, 50, 105);

        // Product Mockup / Graphic Silhouette
        ctx.fillStyle = th.badgeBg === '#0f172a' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
        ctx.beginPath();
        ctx.roundRect(50, 130, 300, 170, 12);
        ctx.fill();

        // Stylized icon artwork
        ctx.strokeStyle = th.accent;
        ctx.lineWidth = 3;
        ctx.strokeRect(150, 175, 100, 80);
        ctx.fillStyle = th.accent;
        ctx.font = 'bold 13px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('STUDIO CATALOG SHOT', 200, 222);
        ctx.textAlign = 'left';

        // Bottom style tag
        ctx.fillStyle = th.badgeBg;
        ctx.beginPath();
        ctx.roundRect(50, 320, 300, 36, 8);
        ctx.fill();
        ctx.fillStyle = th.badgeText;
        ctx.font = 'bold 12px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`✨ ${th.name.toUpperCase()} • 4K AI STUDIO`, 200, 343);
        ctx.textAlign = 'left';

        const dataUrl = c.toDataURL('image/jpeg', 0.88);
        aiGenerator.variations.push(dataUrl);

        // Create card element
        const card = document.createElement('div');
        card.className = 'ai-var-card';
        card.id = `ai-var-${idx}`;
        card.innerHTML = `
          <img src="${dataUrl}" class="ai-var-img" alt="${th.name}">
          <div class="ai-var-badge">✓ Selected</div>
          <div style="font-size: 0.6875rem; color: var(--text-muted); padding: 4px 6px; text-align: center;">
            ${th.name}
          </div>
        `;
        card.addEventListener('click', () => {
          aiGenerator.selectedVariationIndex = idx;
          document.querySelectorAll('.ai-var-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          if (els.btnApplyAiPhoto) els.btnApplyAiPhoto.disabled = false;
        });

        container.appendChild(card);
      });

      // Select first variation by default
      const first = document.getElementById('ai-var-0');
      if (first) {
        first.classList.add('selected');
        aiGenerator.selectedVariationIndex = 0;
        if (els.btnApplyAiPhoto) els.btnApplyAiPhoto.disabled = false;
      }
    }, 200);
  }

  function bindAiGeneratorEvents() {
    if (els.btnCloseAiGenerator) {
      els.btnCloseAiGenerator.addEventListener('click', () => {
        if (els.aiGeneratorModal) els.aiGeneratorModal.classList.remove('open');
      });
    }
    if (els.btnCancelAiPhoto) {
      els.btnCancelAiPhoto.addEventListener('click', () => {
        if (els.aiGeneratorModal) els.aiGeneratorModal.classList.remove('open');
      });
    }
    if (els.aiGeneratorModal) {
      els.aiGeneratorModal.addEventListener('click', e => {
        if (e.target === els.aiGeneratorModal) {
          els.aiGeneratorModal.classList.remove('open');
        }
      });
    }

    if (els.btnGenerateAiPhoto) {
      els.btnGenerateAiPhoto.addEventListener('click', () => {
        generateAiVariations();
      });
    }

    if (els.aiStylePills) {
      els.aiStylePills.forEach(pill => {
        pill.addEventListener('click', () => {
          els.aiStylePills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          aiGenerator.selectedStyle = pill.dataset.aistyle;
          generateAiVariations();
        });
      });
    }

    if (els.btnApplyAiPhoto) {
      els.btnApplyAiPhoto.addEventListener('click', () => {
        if (aiGenerator.selectedVariationIndex === null || !aiGenerator.productId) return;
        const prod = state.products.find(p => p.id === aiGenerator.productId);
        if (!prod) return;

        const chosenDataUrl = aiGenerator.variations[aiGenerator.selectedVariationIndex];
        if (!chosenDataUrl) return;

        prod.image = chosenDataUrl;

        const thumbImg = document.getElementById(`thumb-img-${prod.id}`);
        if (thumbImg) {
          thumbImg.src = chosenDataUrl;
          thumbImg.style.display = 'block';
        }
        const emptyDiv = document.getElementById(`thumb-empty-${prod.id}`);
        if (emptyDiv) emptyDiv.style.display = 'none';

        saveStateToLocalStorage();
        updateLivePreview();
        if (els.aiGeneratorModal) els.aiGeneratorModal.classList.remove('open');
        showToast(`Applied AI studio photo to "${prod.name}"!`);
      });
    }
  }

  // =========================================================================
  // Automated Video Extraction Pipeline
  // =========================================================================
  function updateAutoProgress(percent, statusText) {
    if (els.autoProgressContainer) els.autoProgressContainer.style.display = 'block';
    if (els.autoProgressFill) els.autoProgressFill.style.width = `${percent}%`;
    if (els.autoProgressPercent) els.autoProgressPercent.textContent = `${percent}%`;
    if (els.autoProgressStatus) els.autoProgressStatus.textContent = statusText;
  }

  // Smart Local Auto-Scan (Client-side keyframe detection, 0 API key required)
  async function runSmartLocalScan() {
    if (!state.videoLoaded) {
      showToast('Please select or upload a video file first');
      return;
    }

    const duration = Math.max(1, state.videoDuration || 30);
    const video = els.studioVideo;
    const canvas = els.captureCanvas;
    const dims = getConstrainedCanvasDimensions(video.videoWidth, video.videoHeight, 960);
    canvas.width = dims.width;
    canvas.height = dims.height;
    const ctx = canvas.getContext('2d');

    updateAutoProgress(10, 'Scanning video timeline for candidate product scenes...');

    // Detect 6-8 keyframes spaced across the duration
    const count = Math.min(8, Math.max(4, Math.round(duration / 5)));
    const timestamps = [];
    for (let i = 0; i < count; i++) {
      const frac = (i + 0.5) / count;
      timestamps.push(parseFloat((duration * frac).toFixed(1)));
    }

    const detectedProducts = [];

    for (let i = 0; i < timestamps.length; i++) {
      const ts = timestamps[i];
      const percent = Math.round(15 + ((i + 1) / count) * 75);
      updateAutoProgress(percent, `Capturing video frame ${i + 1}/${count} at ${ts}s...`);

      await seekVideoSafely(video, ts);
      await new Promise(r => setTimeout(r, 60));

      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        detectedProducts.push({
          id: `p${i + 1}`,
          name: `Product ${i + 1} (${formatSeconds(ts)})`,
          price: {
            amount: null,
            currency: state.currency_default || 'NGN',
            source: 'none'
          },
          description: `Captured from video at ${ts}s. Tap title to rename, add price, or adjust details.`,
          category: 'Catalog Item',
          best_timestamp_sec: ts,
          confidence: 0.8,
          image: dataUrl
        });
      } catch (err) {
        console.warn('Frame grab failed at', ts, err);
      }
    }

    updateAutoProgress(100, `Smart scan complete! Extracted ${detectedProducts.length} candidate frames.`);

    state.products = detectedProducts;
    syncFormFields();
    renderReviewList();
    debouncedSaveState();
    updateLivePreview();

    setTimeout(() => {
      setStep(2);
      showToast(`Captured ${detectedProducts.length} product frames from your video!`);
    }, 400);
  }

  // Interim Gemini Key resolution (in-memory by default, optional local device remember)
  let inMemoryGeminiKey = '';

  function loadSavedApiKey() {
    try {
      const saved = localStorage.getItem('ContentSmith_gemini_api_key');
      if (saved) {
        inMemoryGeminiKey = saved;
        if (els.geminiApiKey) els.geminiApiKey.value = saved;
        if (els.checkRememberKey) els.checkRememberKey.checked = true;
      }
    } catch (_) {}
  }

  function getEffectiveGeminiApiKey() {
    return inMemoryGeminiKey || (els.geminiApiKey ? els.geminiApiKey.value.trim() : '');
  }

  // 1-Click Gemini Automated Extraction using Chronological Keyframes
  async function runAutoExtractGemini() {
    const apiKey = getEffectiveGeminiApiKey();
    if (!apiKey) {
      showToast('Please enter your Gemini API key, or click Smart Local Auto-Scan');
      return;
    }

    if (!state.videoLoaded) {
      showToast('Please select or upload a video file first');
      return;
    }

    updateAutoProgress(10, 'Sampling video keyframes for visual AI analysis...');

    try {
      const model = (els.geminiModelSelect && els.geminiModelSelect.value) || 'gemini-1.5-flash';
      const duration = Math.max(1, state.videoDuration || 30);
      const video = els.studioVideo;
      const canvas = els.captureCanvas;

      // Scale sample frames to max 512px for lightweight, instant payload
      const dims = getConstrainedCanvasDimensions(video.videoWidth, video.videoHeight, 512);
      canvas.width = dims.width;
      canvas.height = dims.height;
      const ctx = canvas.getContext('2d');

      // Sample 6 to 12 frames depending on duration
      const sampleCount = Math.min(12, Math.max(6, Math.round(duration / 4)));
      const sampleTimestamps = [];
      for (let i = 0; i < sampleCount; i++) {
        const ts = parseFloat(((i + 0.5) * (duration / sampleCount)).toFixed(1));
        sampleTimestamps.push(ts);
      }

      const parts = [];

      // Extract each frame and push as multimodal inlineData
      for (let i = 0; i < sampleTimestamps.length; i++) {
        const ts = sampleTimestamps[i];
        const pct = Math.round(15 + ((i + 1) / sampleCount) * 45);
        updateAutoProgress(pct, `Sampling video scene ${i + 1}/${sampleCount} at ${ts}s...`);

        await seekVideoSafely(video, ts);
        await new Promise(r => setTimeout(r, 60));

        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          const b64 = dataUrl.split(',')[1];
          parts.push({
            text: `[Video Frame #${i + 1} at timestamp ${ts.toFixed(1)}s]:`
          });
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: b64
            }
          });
        } catch (err) {
          console.warn('Sample frame draw error at', ts, err);
        }
      }

      if (parts.length === 0) {
        throw new Error('Unable to capture frames from video for analysis');
      }

      updateAutoProgress(65, `Analyzing real frames with Gemini (${model})...`);

      const promptText = `You are a professional product catalog extraction AI analyzing sequential visual frames sampled from a vendor's product video.

CRITICAL GROUNDING AND ZERO-HALLUCINATION RULES:
1. Identify each distinct product offered for sale that physically appears in these frames.
2. Ground your output ONLY in what is clearly visible in the provided image frames or written on screen. DO NOT invent, extrapolate, or hallucinate products that are not shown. If you see electronics, shoes, food, beauty products, jewelry, or clothes, extract ONLY those items.
3. If multiple consecutive frames show the SAME product (e.g. from different angles or while being held), combine them into a SINGLE product entry. Do NOT duplicate identical items.
4. Product Name: Extract clean, specific names based on what is shown and any legible on-screen text or logos (e.g. "Matte Lipstick in Ruby Red", "Wireless Earbuds Case", "Pebbled Leather Crossbody Bag").
5. Price Rule: ONLY extract a price if it is clearly visible as text, on a price sticker, or written on screen in the frames. If no price is displayed in the frames, set "amount": null, "currency": null, "source": "none". NEVER invent a price!
6. For each product, set "best_timestamp_sec" to the EXACT timestamp (in seconds) of the frame where this product is most clearly visible, unobstructed, and in focus.
7. Categorize each item accurately (e.g. "Footwear", "Beauty", "Fashion", "Electronics", "Accessories", "Home").
8. Extract vendor name (from on-screen watermark, logo, or chat header) if visible, or leave null.

Output JSON format strictly matching:
{
  "vendor_name": "string or null",
  "vendor_phone": "string or null",
  "currency_default": "NGN",
  "products": [
    {
      "id": "p1",
      "name": "Specific Product Name",
      "price": { "amount": number or null, "currency": "NGN or null", "source": "on_screen" or "price_tag" or "none" },
      "description": "Accurate 1-2 sentence description based on visual details (color, material, design, variants)",
      "category": "Category Name",
      "best_timestamp_sec": number,
      "confidence": number between 0.0 and 1.0
    }
  ]
}
Return pure JSON only.`;

      parts.unshift({ text: promptText });

      async function callGemini(selectedModel) {
        return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          })
        });
      }

      // Try chosen model, with resilient fallback across verified active models
      const fallbackList = [model, 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.1-flash-lite', 'gemini-1.5-flash'];
      const uniqueModels = [...new Set(fallbackList)];

      let res = null;
      let lastErrorMsg = 'Failed to connect to Gemini API';

      for (const candidateModel of uniqueModels) {
        try {
          updateAutoProgress(50, `Contacting Gemini AI (${candidateModel})...`);
          const attempt = await callGemini(candidateModel);
          if (attempt.ok) {
            res = attempt;
            break;
          }
          const errData = await attempt.json().catch(() => ({}));
          lastErrorMsg = errData.error ? errData.error.message : `HTTP ${attempt.status}`;
          console.warn(`Model ${candidateModel} failed (${lastErrorMsg}), attempting fallback...`);
        } catch (netErr) {
          lastErrorMsg = netErr.message || 'Network error';
          console.warn(`Model ${candidateModel} network failure:`, netErr);
        }
      }

      if (!res || !res.ok) {
        throw new Error(`Gemini API: ${lastErrorMsg}`);
      }

      updateAutoProgress(80, 'Gemini analyzed frames! Parsing product catalog...');
      const data = await res.json();
      const rawText = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text;
      if (!rawText) throw new Error('Empty response from Gemini');

      const cleaned = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.products || !Array.isArray(parsed.products) || parsed.products.length === 0) {
        throw new Error('No products detected in the video frames');
      }

      state.vendor_name = parsed.vendor_name || state.vendor_name;
      if (parsed.vendor_phone) state.vendor_phone = parsed.vendor_phone;
      if (parsed.currency_default) state.currency_default = parsed.currency_default;

      state.products = parsed.products.map((item, idx) => ({
        id: item.id || `p${idx + 1}`,
        name: item.name || `Product ${idx + 1}`,
        price: item.price ? {
          amount: (item.price.amount !== null && !isNaN(item.price.amount)) ? Number(item.price.amount) : null,
          currency: item.price.currency || state.currency_default,
          source: item.price.source || 'none'
        } : null,
        description: item.description || '',
        category: item.category || 'General',
        best_timestamp_sec: typeof item.best_timestamp_sec === 'number' ? Math.max(0, Math.min(state.videoDuration, item.best_timestamp_sec)) : sampleTimestamps[idx % sampleTimestamps.length],
        confidence: typeof item.confidence === 'number' ? item.confidence : 0.9,
        image: null
      }));

      updateAutoProgress(90, 'Auto-capturing high-resolution photo frames for each product...');
      await autoCaptureAllFrames();

      updateAutoProgress(100, `Done! Gemini extracted ${state.products.length} products with real photos.`);

      syncFormFields();
      renderReviewList();
      debouncedSaveState();
      updateLivePreview();

      setTimeout(() => {
        setStep(2);
        showToast(`Gemini extracted ${state.products.length} grounded products from your video!`);
      }, 400);

    } catch (err) {
      console.warn('Gemini extraction error:', err);
      updateAutoProgress(0, '');
      if (els.autoProgressContainer) els.autoProgressContainer.style.display = 'none';
      showToast(`Gemini notice: ${err.message}. You can also use Smart Local Auto-Scan.`);
    }
  }

  function setupAutomationHandlers() {
    if (els.btnAutoExtractGemini) {
      els.btnAutoExtractGemini.addEventListener('click', runAutoExtractGemini);
    }
    if (els.btnSmartLocalScan) {
      els.btnSmartLocalScan.addEventListener('click', runSmartLocalScan);
    }
    if (els.geminiApiKey) {
      els.geminiApiKey.addEventListener('input', () => {
        inMemoryGeminiKey = els.geminiApiKey.value.trim();
        if (els.checkRememberKey && els.checkRememberKey.checked) {
          try {
            if (inMemoryGeminiKey) {
              localStorage.setItem('ContentSmith_gemini_api_key', inMemoryGeminiKey);
            } else {
              localStorage.removeItem('ContentSmith_gemini_api_key');
            }
          } catch (_) {}
        }
      });
    }
    if (els.checkRememberKey) {
      els.checkRememberKey.addEventListener('change', () => {
        try {
          if (els.checkRememberKey.checked) {
            const key = inMemoryGeminiKey || (els.geminiApiKey ? els.geminiApiKey.value.trim() : '');
            if (key) localStorage.setItem('ContentSmith_gemini_api_key', key);
          } else {
            localStorage.removeItem('ContentSmith_gemini_api_key');
          }
        } catch (_) {}
      });
    }
    if (els.btnToggleKeyVis && els.geminiApiKey) {
      els.btnToggleKeyVis.addEventListener('click', () => {
        els.geminiApiKey.type = els.geminiApiKey.type === 'password' ? 'text' : 'password';
      });
    }
  }

  // Initialize
  function init() {
    loadSavedApiKey();
    setupVideoHandlers();
    bindSettingsInputs();
    setupModals();
    setupAutomationHandlers();
    bindPhotoEditorEvents();
    bindAiGeneratorEvents();

    const loaded = loadPersistedState();
    if (!loaded) {
      loadFixture('whatsapp');
    }
    // Expose API for app.js and external flows
    window.ContentSmithStudio = window.CatalogSmithStudio = {
      state,
      setStep,
      renderReviewList,
      updateLivePreview,
      saveStateToLocalStorage,
      debouncedSaveState,
      showToast,
      generateStorefrontHTML,
      loadFixture,
      loadCatalog,
      updateStep4ShareBanner,
      syncFormFields,
      generateInitialThumbnailsForFixture,
      formatPrice
    };
  }

  init();
})();
