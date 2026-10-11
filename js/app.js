/**
 * CatalogSmith - Application Controller & Multi-Flow Navigation
 * Manages Landing View, Workspace View, Creation Routes, and Guided Wizards.
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

      // Sync with studio.js
      if (window.CatalogSmithStudio) {
        if (typeof window.CatalogSmithStudio.setStep === 'function') {
          window.CatalogSmithStudio.setStep(targetStep);
        }
        if (typeof window.CatalogSmithStudio.updateLivePreview === 'function') {
          window.CatalogSmithStudio.updateLivePreview();
        }
      }
    }

    // Back to Home button in Workspace header
    const btnBackToLanding = document.getElementById('btn-back-to-landing');
    if (btnBackToLanding) {
      btnBackToLanding.addEventListener('click', (e) => {
        e.preventDefault();
        showLanding();
      });
    }

    // -------------------------------------------------------------
    // Landing Page CTAs & Smooth Scroll
    // -------------------------------------------------------------
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
    // Creation Cards Routing
    // -------------------------------------------------------------
    // 1. Video Card
    const btnOptVideo = document.getElementById('btn-opt-video');
    const cardOptVideo = document.getElementById('card-opt-video');
    function routeToVideoFlow() {
      showWorkspace(1);
      // If studio has toast
      if (window.CatalogSmithStudio && window.CatalogSmithStudio.showToast) {
        window.CatalogSmithStudio.showToast('Upload your video or select a sample to begin.');
      }
    }
    if (btnOptVideo) btnOptVideo.addEventListener('click', routeToVideoFlow);
    if (cardOptVideo) {
      cardOptVideo.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') routeToVideoFlow();
      });
    }

    // 2. Pictures / List Card
    const btnOptPictures = document.getElementById('btn-opt-pictures');
    const cardOptPictures = document.getElementById('card-opt-pictures');
    function routeToPicturesFlow() {
      if (picturesModal) {
        picturesModal.classList.add('open');
      } else {
        showWorkspace(2);
      }
    }
    if (btnOptPictures) btnOptPictures.addEventListener('click', routeToPicturesFlow);
    if (cardOptPictures) {
      cardOptPictures.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') routeToPicturesFlow();
      });
    }

    // 3. Guided Store Creation Card
    const btnOptGuided = document.getElementById('btn-opt-guided');
    const cardOptGuided = document.getElementById('card-opt-guided');
    function routeToGuidedFlow() {
      if (guidedModal) {
        resetWizard();
        guidedModal.classList.add('open');
      } else {
        showWorkspace(3);
      }
    }
    if (btnOptGuided) btnOptGuided.addEventListener('click', routeToGuidedFlow);
    if (cardOptGuided) {
      cardOptGuided.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') routeToGuidedFlow();
      });
    }

    // 4. Dropshipping Card
    const btnOptDropship = document.getElementById('btn-opt-dropship');
    const cardOptDropship = document.getElementById('card-opt-dropship');
    function routeToDropshipFlow() {
      if (dropshipModal) {
        dropshipModal.classList.add('open');
      } else {
        showWorkspace(2);
      }
    }
    if (btnOptDropship) btnOptDropship.addEventListener('click', routeToDropshipFlow);
    if (cardOptDropship) {
      cardOptDropship.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') routeToDropshipFlow();
      });
    }

    // -------------------------------------------------------------
    // Section E: Interactive Example Storefront (Iframe)
    // -------------------------------------------------------------
    function populateExampleStorefront() {
      const exampleFrame = document.getElementById('example-phone-iframe');
      const heroFrame = document.getElementById('hero-phone-iframe');

      if (!window.CatalogSmithStudio || typeof window.CatalogSmithStudio.generateStorefrontHTML !== 'function') {
        setTimeout(populateExampleStorefront, 200);
        return;
      }

      // Generate HTML with inlined images
      try {
        const html = window.CatalogSmithStudio.generateStorefrontHTML(true);
        if (exampleFrame && !exampleFrame.srcdoc) exampleFrame.srcdoc = html;
        if (heroFrame && !heroFrame.srcdoc) heroFrame.srcdoc = html;
      } catch (err) {
        console.warn('Could not populate example storefront iframe:', err);
      }
    }

    // -------------------------------------------------------------
    // FLOW 1: Guided Store Creation Wizard
    // -------------------------------------------------------------
    let currentWizardStep = 1;
    const totalWizardSteps = 5;

    const wizardState = {
      storeName: '',
      category: 'Fashion & Dresses',
      vendorPhone: '+2348035550192',
      productName: '',
      productPrice: 15000,
      productImage: null,
      theme: 'emerald'
    };

    function resetWizard() {
      currentWizardStep = 1;
      showWizardStep(1);
    }

    function showWizardStep(stepNum) {
      currentWizardStep = stepNum;
      for (let i = 1; i <= totalWizardSteps; i++) {
        const stepEl = document.getElementById(`wizard-step-${i}`);
        const dotEl = document.getElementById(`wizard-dot-${i}`);
        if (stepEl) {
          stepEl.classList.toggle('active', i === stepNum);
        }
        if (dotEl) {
          dotEl.classList.toggle('active', i === stepNum);
          dotEl.classList.toggle('done', i < stepNum);
        }
      }
    }

    // Category button selection
    const catButtons = document.querySelectorAll('.wizard-category-btn');
    catButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        catButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        wizardState.category = btn.dataset.category || btn.textContent.trim();
      });
    });

    // Theme button selection in wizard
    const themeButtons = document.querySelectorAll('.wizard-theme-btn');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        themeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        wizardState.theme = btn.dataset.theme;
      });
    });

    // Wizard navigation buttons
    document.querySelectorAll('[data-wizard-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        // Collect current step info
        if (currentWizardStep === 1) {
          const nameInput = document.getElementById('wizard-input-name');
          if (nameInput && nameInput.value.trim()) {
            wizardState.storeName = nameInput.value.trim();
          } else {
            wizardState.storeName = 'My New Store';
          }
        } else if (currentWizardStep === 3) {
          const phoneInput = document.getElementById('wizard-input-phone');
          if (phoneInput && phoneInput.value.trim()) {
            wizardState.vendorPhone = phoneInput.value.trim();
          }
        } else if (currentWizardStep === 4) {
          const pNameInput = document.getElementById('wizard-input-prod-name');
          const pPriceInput = document.getElementById('wizard-input-prod-price');
          if (pNameInput && pNameInput.value.trim()) {
            wizardState.productName = pNameInput.value.trim();
          } else {
            wizardState.productName = 'Featured Starter Product';
          }
          if (pPriceInput && pPriceInput.value) {
            wizardState.productPrice = parseFloat(pPriceInput.value) || 12000;
          }
        }

        if (currentWizardStep < totalWizardSteps) {
          showWizardStep(currentWizardStep + 1);
        } else {
          // Finish wizard
          completeWizard();
        }
      });
    });

    document.querySelectorAll('[data-wizard-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentWizardStep > 1) {
          showWizardStep(currentWizardStep - 1);
        }
      });
    });

    // Optional wizard photo upload
    const wizardPhotoInput = document.getElementById('wizard-photo-input');
    const wizardPhotoBox = document.getElementById('wizard-photo-box');
    if (wizardPhotoBox && wizardPhotoInput) {
      wizardPhotoBox.addEventListener('click', () => wizardPhotoInput.click());
      wizardPhotoInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = ev => {
            wizardState.productImage = ev.target.result;
            wizardPhotoBox.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);">`;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    function completeWizard() {
      if (guidedModal) guidedModal.classList.remove('open');

      if (window.CatalogSmithStudio) {
        const { state, syncFormFields, renderReviewList, saveStateToLocalStorage, showToast, generateInitialThumbnailsForFixture } = window.CatalogSmithStudio;

        // Apply state
        state.vendor_name = wizardState.storeName || 'My Online Store';
        state.vendor_phone = wizardState.vendorPhone || '+2348035550192';
        state.theme = wizardState.theme || 'emerald';

        // Create initial product
        const newProd = {
          id: 'p1',
          name: wizardState.productName || 'First Product Item',
          price: {
            amount: wizardState.productPrice || 15000,
            currency: state.currency_default || 'NGN',
            source: 'spoken'
          },
          description: `Quality ${wizardState.category} delivered directly to your doorstep. Contact us on WhatsApp for orders.`,
          category: wizardState.category,
          best_timestamp_sec: 0,
          confidence: 0.95,
          image: wizardState.productImage || null
        };

        state.products = [newProd];
        if (!newProd.image && typeof generateInitialThumbnailsForFixture === 'function') {
          generateInitialThumbnailsForFixture();
        }

        syncFormFields();
        renderReviewList();
        saveStateToLocalStorage();
        showToast('🎉 Your store has been created! Check out your live preview.');
      }

      showWorkspace(4); // Take to Preview & Export
    }

    // Close wizard buttons
    const btnCloseGuided = document.getElementById('btn-close-guided');
    if (btnCloseGuided && guidedModal) {
      btnCloseGuided.addEventListener('click', () => guidedModal.classList.remove('open'));
    }

    // -------------------------------------------------------------
    // FLOW 2: Pictures / List Flow Modal
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

    const btnAddManualProduct = document.getElementById('btn-add-manual-product');
    const manualTitleInput = document.getElementById('manual-title-input');
    const manualPriceInput = document.getElementById('manual-price-input');
    const manualCategoryInput = document.getElementById('manual-category-input');
    const manualDescInput = document.getElementById('manual-desc-input');
    const manualItemsCount = document.getElementById('manual-items-count');

    let stagedManualProducts = [];

    if (btnAddManualProduct) {
      btnAddManualProduct.addEventListener('click', () => {
        const title = manualTitleInput ? manualTitleInput.value.trim() : '';
        if (!title) {
          alert('Please enter a product title');
          return;
        }

        const priceNum = manualPriceInput && manualPriceInput.value ? parseFloat(manualPriceInput.value) : null;
        const category = manualCategoryInput ? manualCategoryInput.value.trim() : 'General';
        const desc = manualDescInput ? manualDescInput.value.trim() : '';

        const newId = 'p' + (Date.now() % 100000);
        const item = {
          id: newId,
          name: title,
          price: {
            amount: priceNum,
            currency: 'NGN',
            source: 'none'
          },
          description: desc,
          category: category,
          best_timestamp_sec: 0,
          confidence: 0.95,
          image: manualItemPhoto
        };

        stagedManualProducts.push(item);

        // Reset inputs
        if (manualTitleInput) manualTitleInput.value = '';
        if (manualPriceInput) manualPriceInput.value = '';
        if (manualDescInput) manualDescInput.value = '';
        manualItemPhoto = null;
        if (manualPhotoBox) {
          manualPhotoBox.innerHTML = `<span>📷 Tap to add photo</span>`;
        }

        if (manualItemsCount) {
          manualItemsCount.textContent = `${stagedManualProducts.length} product(s) added so far`;
        }

        if (window.CatalogSmithStudio && window.CatalogSmithStudio.showToast) {
          window.CatalogSmithStudio.showToast(`Added "${title}"!`);
        }
      });
    }

    // Done with manual products
    const btnDonePictures = document.getElementById('btn-done-pictures');
    if (btnDonePictures) {
      btnDonePictures.addEventListener('click', () => {
        if (picturesModal) picturesModal.classList.remove('open');

        if (window.CatalogSmithStudio && stagedManualProducts.length > 0) {
          const { state, renderReviewList, saveStateToLocalStorage, showToast, generateInitialThumbnailsForFixture } = window.CatalogSmithStudio;

          state.products = state.products.concat(stagedManualProducts);
          if (typeof generateInitialThumbnailsForFixture === 'function') {
            generateInitialThumbnailsForFixture();
          }
          renderReviewList();
          saveStateToLocalStorage();
          showToast(`Added ${stagedManualProducts.length} product(s) to your catalog!`);
          stagedManualProducts = [];
        }

        showWorkspace(2); // Products tab
      });
    }

    // -------------------------------------------------------------
    // FLOW 3: Dropshipping Planning Flow Modal
    // -------------------------------------------------------------
    const btnCloseDropship = document.getElementById('btn-close-dropship');
    if (btnCloseDropship && dropshipModal) {
      btnCloseDropship.addEventListener('click', () => dropshipModal.classList.remove('open'));
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

        if (window.CatalogSmithStudio) {
          const { state, renderReviewList, saveStateToLocalStorage, showToast, generateInitialThumbnailsForFixture } = window.CatalogSmithStudio;
          const newId = 'ds_' + (Date.now() % 100000);
          const newItem = {
            id: newId,
            name: title,
            price: {
              amount: retail,
              currency: 'NGN',
              source: 'price_tag'
            },
            description: `Supplier product (Wholesale: ₦${wholesale.toLocaleString()}, Delivery: ₦${delivery.toLocaleString()}, Profit: ₦${profit.toLocaleString()}). Ready to fulfill on order.`,
            category: 'Dropshipping',
            best_timestamp_sec: 0,
            confidence: 0.9,
            image: null
          };

          state.products.push(newItem);
          if (typeof generateInitialThumbnailsForFixture === 'function') {
            generateInitialThumbnailsForFixture();
          }
          renderReviewList();
          saveStateToLocalStorage();
          showToast(`Added dropship item: "${title}" (₦${retail.toLocaleString()})`);
        }

        if (dropshipModal) dropshipModal.classList.remove('open');
        showWorkspace(2);
      });
    }

    const btnContinueDropship = document.getElementById('btn-continue-dropship');
    if (btnContinueDropship) {
      btnContinueDropship.addEventListener('click', () => {
        if (dropshipModal) dropshipModal.classList.remove('open');
        showWorkspace(2);
      });
    }

    // Modal background click dismiss
    [guidedModal, picturesModal, dropshipModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('open');
          }
        });
      }
    });

    // Populate initial iframe
    populateExampleStorefront();
  }
})();
