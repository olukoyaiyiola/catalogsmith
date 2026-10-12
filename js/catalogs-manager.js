/**
 * ContentSmith - Central Multi-Store Catalog Manager & Share Engine
 * Manages Catalog CRUD, Multi-Store Storage, Sharable URLs, Offline Sync, and QR Generation.
 */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'ContentSmith_catalogs_v1';
  const ACTIVE_ID_KEY = 'ContentSmith_active_catalog_id';

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '_')
      .replace(/^-+|-+$/g, '') || 'store';
  }

  function generateCatalogId(name) {
    const slug = slugify(name).slice(0, 24);
    const rand = Math.random().toString(36).substring(2, 7);
    return `cat_${slug}_${rand}`;
  }

  // Safe base64 encoding/decoding for portable URLs
  function toUrlSafeBase64(str) {
    try {
      const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
      });
      return btoa(utf8Bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
      return '';
    }
  }

  function fromUrlSafeBase64(b64) {
    try {
      let base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const decoded = atob(base64);
      return decodeURIComponent(Array.prototype.map.call(decoded, function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      return null;
    }
  }

  const CatalogStore = {
    // -----------------------------------------------------------------
    // Initialization & Seeding
    // -----------------------------------------------------------------
    init: function () {
      const existing = this.list();
      if (!existing || existing.length === 0) {
        this.seedDefaults();
      }
      this.syncWithServer();
    },

    seedDefaults: function () {
      const initial = [];

      // 1. Check if user already had a draft in legacy localStorage
      try {
        const legacy = localStorage.getItem('ContentSmith_studio_state');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (parsed && parsed.products && parsed.products.length > 0) {
            initial.push({
              id: 'cat_my_store',
              name: parsed.vendor_name || 'My Online Store',
              phone: parsed.vendor_phone || '+2348035550192',
              currency: parsed.currency_default || 'NGN',
              tagline: parsed.tagline || 'Direct orders via WhatsApp',
              category: 'Fashion & Dresses',
              theme: parsed.theme || 'emerald',
              layout: parsed.layout || 'standard',
              order_button_text: parsed.order_button_text || 'Order on WhatsApp',
              message_template: parsed.message_template || 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price})',
              products: parsed.products,
              created_at: Date.now() - 86400000,
              updated_at: Date.now()
            });
          }
        }
      } catch (_) {}

      function makeQuickSvg(title, cat, c1, c2, emoji) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="g_${emoji.codePointAt(0)}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#g_${emoji.codePointAt(0)})"/>
  <circle cx="300" cy="180" r="140" fill="rgba(255,255,255,0.12)"/>
  <g transform="translate(300, 185) scale(1.6)">
    <circle cx="0" cy="0" r="46" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
    <text x="0" y="16" font-family="-apple-system, system-ui, sans-serif" font-size="38" text-anchor="middle" fill="#ffffff">${emoji}</text>
  </g>
  <rect x="30" y="325" width="540" height="90" rx="14" fill="rgba(15, 23, 42, 0.78)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
  <text x="50" y="360" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="20" fill="#ffffff">${title.replace(/&/g, '&amp;').slice(0, 36)}</text>
  <text x="50" y="390" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="14" fill="#10b981">🏷️ ${cat.replace(/&/g, '&amp;')} • Verified Item</text>
</svg>`.trim();
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      }

      // 2. Pre-seed with Lola Fabrics fixture if empty
      if (initial.length === 0 && window.ContentSmith_FIXTURES && window.ContentSmith_FIXTURES.whatsapp) {
        const fix = window.ContentSmith_FIXTURES.whatsapp.data;
        const lolaProds = (fix.products || []).map((p, idx) => {
          const svgs = [
            makeQuickSvg('Luxury Silk Boubou Gown', 'Fashion & Dresses', '#064e3b', '#047857', '👗'),
            makeQuickSvg('2-Piece Ankara Co-ord Set', 'Fashion & Dresses', '#c2410c', '#ea580c', '✨'),
            makeQuickSvg('Mini Kelly Handbag', 'Bags & Accessories', '#1e293b', '#334155', '👜'),
            makeQuickSvg('Royal Blue Aso-Oke Gele', 'Traditional Wear', '#1e1b4b', '#312e81', '👑'),
            makeQuickSvg('Crystal Strap Block Mules', 'Shoes & Footwear', '#78350f', '#92400e', '👡'),
            makeQuickSvg('Velvet Kimono Coat', 'Fashion & Dresses', '#4c0519', '#881337', '👘')
          ];
          return {
            ...p,
            image: p.image || svgs[idx % svgs.length]
          };
        });

        initial.push({
          id: 'cat_lola_fabrics',
          name: fix.vendor_name || 'Lola Fabrics & Chic Wear',
          phone: fix.vendor_phone || '+2348035550192',
          currency: fix.currency_default || 'NGN',
          tagline: fix.tagline || 'Luxury custom dresses & fabrics delivered nationwide',
          category: 'Fashion & Dresses',
          theme: fix.theme || 'emerald',
          layout: 'standard',
          verified: true,
          order_button_text: 'Order on WhatsApp',
          message_template: 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price}) from your catalog.',
          products: lolaProds,
          created_at: Date.now() - 3600000 * 48,
          updated_at: Date.now() - 3600000 * 2
        });
      }

      // 3. Pre-seed a second demo store: Tech & Gadgets
      initial.push({
        id: 'cat_swift_tech',
        name: 'SwiftGadgets Express',
        phone: '+2348123456789',
        currency: 'NGN',
        tagline: 'Verified smart devices, power accessories & sound systems',
        category: 'Tech & Gadgets',
        theme: 'tech-blue',
        layout: 'standard',
        verified: true,
        order_button_text: 'Order on WhatsApp',
        message_template: 'Hello {vendor_name}! I saw *{product_name}* on your catalog. Is it available for delivery today?',
        products: [
          {
            id: 't1',
            name: '20,000mAh Ultra Fast-Charge Power Bank',
            price: { amount: 24500, currency: 'NGN', source: 'on_screen' },
            description: '22.5W Power Delivery & QuickCharge 3.0 with digital LED battery percentage display.',
            category: 'Accessories',
            best_timestamp_sec: 0,
            confidence: 0.98,
            image: makeQuickSvg('20,000mAh Power Bank', 'Tech Accessories', '#0f172a', '#1e293b', '🔋')
          },
          {
            id: 't2',
            name: 'Wireless ANC Bluetooth Headphones (Midnight)',
            price: { amount: 38000, currency: 'NGN', source: 'on_screen' },
            description: 'Active Noise Cancelling over-ear headphones with 40-hour playtime and deep bass.',
            category: 'Audio',
            best_timestamp_sec: 0,
            confidence: 0.95,
            image: makeQuickSvg('Wireless ANC Headphones', 'Audio Gadgets', '#1e1b4b', '#2563eb', '🎧')
          },
          {
            id: 't3',
            name: 'AMOLED Smartwatch with Fitness & Call Tracker',
            price: { amount: 32000, currency: 'NGN', source: 'on_screen' },
            description: 'Always-On display, IP68 water resistant, heart rate monitoring, Bluetooth phone calling.',
            category: 'Wearables',
            best_timestamp_sec: 0,
            confidence: 0.96,
            image: makeQuickSvg('AMOLED Smartwatch', 'Wearables', '#064e3b', '#059669', '⌚')
          },
          {
            id: 't4',
            name: '4-in-1 Magnetic Wireless Charging Stand',
            price: { amount: 19500, currency: 'NGN', source: 'on_screen' },
            description: 'Fast wireless charging for iPhone, Apple Watch, and AirPods simultaneously with night light.',
            category: 'Charging',
            best_timestamp_sec: 0,
            confidence: 0.92,
            image: makeQuickSvg('4-in-1 Wireless Charger', 'Charging Tech', '#312e81', '#4f46e5', '⚡')
          }
        ],
        created_at: Date.now() - 3600000 * 24,
        updated_at: Date.now() - 3600000 * 5
      });

      this.saveAll(initial);
      if (initial.length > 0) {
        this.setActiveId(initial[0].id);
      }
    },

    // -----------------------------------------------------------------
    // Storage Operations
    // -----------------------------------------------------------------
    list: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return [];
        return arr.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
      } catch (e) {
        console.warn('Failed to parse catalogs from localStorage:', e);
        return [];
      }
    },

    saveAll: function (catalogs) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogs));
        this.dispatchChange();
      } catch (e) {
        console.warn('Failed to save catalogs to localStorage:', e);
      }
    },

    get: function (id) {
      if (!id) return null;
      const cleanId = String(id).trim().toLowerCase();
      const all = this.list();
      return all.find(c => c.id.toLowerCase() === cleanId || slugify(c.name) === cleanId) || null;
    },

    getActiveId: function () {
      return localStorage.getItem(ACTIVE_ID_KEY) || (this.list()[0] ? this.list()[0].id : null);
    },

    setActiveId: function (id) {
      if (id) localStorage.setItem(ACTIVE_ID_KEY, id);
    },

    getActiveCatalog: function () {
      const activeId = this.getActiveId();
      return this.get(activeId) || this.list()[0] || null;
    },

    save: function (catalogData) {
      if (!catalogData) return null;
      const all = this.list();
      const id = catalogData.id ? String(catalogData.id).trim() : generateCatalogId(catalogData.name);

      const now = Date.now();
      const existingIdx = all.findIndex(c => c.id.toLowerCase() === id.toLowerCase());

      const cleanCatalog = {
        id: id,
        name: catalogData.name || catalogData.vendor_name || 'My Store',
        phone: catalogData.phone || catalogData.vendor_phone || '+2348035550192',
        currency: catalogData.currency || catalogData.currency_default || 'NGN',
        tagline: catalogData.tagline || 'Direct orders on WhatsApp',
        category: catalogData.category || 'General',
        theme: catalogData.theme || 'emerald',
        layout: catalogData.layout || 'standard',
        order_button_text: catalogData.order_button_text || 'Order on WhatsApp',
        message_template: catalogData.message_template || 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price})',
        verified: catalogData.verified !== undefined ? Boolean(catalogData.verified) : (existingIdx >= 0 && all[existingIdx].verified !== undefined ? all[existingIdx].verified : true),
        products: Array.isArray(catalogData.products) ? catalogData.products : [],
        created_at: existingIdx >= 0 && all[existingIdx].created_at ? all[existingIdx].created_at : now,
        updated_at: now
      };

      if (existingIdx >= 0) {
        all[existingIdx] = cleanCatalog;
      } else {
        all.unshift(cleanCatalog);
      }

      this.saveAll(all);
      this.setActiveId(id);

      // Async sync to server API if available
      this.syncCatalogToServer(cleanCatalog);

      return cleanCatalog;
    },

    delete: function (id) {
      if (!id) return false;
      const cleanId = String(id).trim().toLowerCase();
      const all = this.list();
      const filtered = all.filter(c => c.id.toLowerCase() !== cleanId);
      if (filtered.length === all.length) return false;

      this.saveAll(filtered);
      if (this.getActiveId() === id) {
        this.setActiveId(filtered[0] ? filtered[0].id : null);
      }

      // Inform server
      try {
        fetch(`api/catalogs?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
      } catch (_) {}

      return true;
    },

    duplicate: function (id) {
      const src = this.get(id);
      if (!src) return null;

      const copyData = JSON.parse(JSON.stringify(src));
      copyData.id = generateCatalogId(src.name + '_copy');
      copyData.name = `${src.name} (Copy)`;
      copyData.created_at = Date.now();
      copyData.updated_at = Date.now();

      return this.save(copyData);
    },

    create: function (options = {}) {
      const name = options.name || 'New Store';
      const id = generateCatalogId(name);
      const newCat = {
        id: id,
        name: name,
        phone: options.phone || '+2348035550192',
        currency: options.currency || 'NGN',
        tagline: options.tagline || 'Direct orders on WhatsApp',
        category: options.category || 'General',
        theme: options.theme || 'emerald',
        layout: options.layout || 'standard',
        order_button_text: options.order_button_text || 'Order on WhatsApp',
        message_template: options.message_template || 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price})',
        products: Array.isArray(options.products) ? options.products : [],
        created_at: Date.now(),
        updated_at: Date.now()
      };
      return this.save(newCat);
    },

    // -----------------------------------------------------------------
    // Sharable Catalog URL Generator & Decoder
    // -----------------------------------------------------------------
    getSharableUrl: function (catalog, includeHashFallback = false) {
      if (!catalog) return window.location.href;
      const baseOrigin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
      let pathname = window.location.pathname || '/';
      // Normalize pathname
      if (pathname.endsWith('/') === false && pathname.indexOf('.') === -1) {
        pathname += '/';
      }

      const cleanUrl = `${baseOrigin}${pathname}?store=${encodeURIComponent(catalog.id)}`;

      if (includeHashFallback) {
        try {
          const snapshot = {
            id: catalog.id,
            name: catalog.name,
            phone: catalog.phone,
            currency: catalog.currency,
            tagline: catalog.tagline,
            category: catalog.category,
            theme: catalog.theme,
            layout: catalog.layout,
            verified: catalog.verified !== false,
            products: (catalog.products || []).map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              description: p.description,
              category: p.category,
              image: p.image || null
            }))
          };
          const b64 = toUrlSafeBase64(JSON.stringify(snapshot));
          if (b64 && b64.length < 32000) {
            return `${cleanUrl}#d=${b64}`;
          }
        } catch (_) {}
      }

      return cleanUrl;
    },

    resolveCatalogFromUrl: function () {
      const urlParams = new URLSearchParams(window.location.search);
      const storeParam = urlParams.get('store') || urlParams.get('catalog');
      if (!storeParam) return null;

      const cleanId = storeParam.trim();
      let found = this.get(cleanId);

      // If not in local storage, check URL hash for portable data payload
      if (!found && window.location.hash) {
        const hashMatch = window.location.hash.match(/[#&]d=([A-Za-z0-9_-]+)/);
        if (hashMatch && hashMatch[1]) {
          const decodedJson = fromUrlSafeBase64(hashMatch[1]);
          if (decodedJson) {
            try {
              const unpacked = JSON.parse(decodedJson);
              if (unpacked && unpacked.name) {
                found = this.save(unpacked);
              }
            } catch (_) {}
          }
        }
      }

      // If still not found, check if it matches fixture key (e.g. "whatsapp", "handheld")
      if (!found && window.ContentSmith_FIXTURES && window.ContentSmith_FIXTURES[cleanId]) {
        const fix = window.ContentSmith_FIXTURES[cleanId].data;
        found = {
          id: cleanId,
          name: fix.vendor_name,
          phone: fix.vendor_phone,
          currency: fix.currency_default,
          tagline: fix.tagline,
          theme: fix.theme || 'emerald',
          layout: 'standard',
          verified: true,
          products: fix.products || []
        };
      }

      return { storeId: cleanId, catalog: found };
    },

    fetchCatalogById: async function (id) {
      if (!id) return null;
      const cleanId = String(id).trim().toLowerCase();
      let found = this.get(cleanId);
      if (found && Array.isArray(found.products) && found.products.length > 0 && found.products.some(p => p.image)) {
        return found;
      }

      try {
        const resp = await fetch(`/api/catalogs?id=${encodeURIComponent(cleanId)}`);
        if (resp.ok) {
          const remote = await resp.json();
          if (remote && remote.id) {
            this.save(remote);
            return remote;
          }
        }
      } catch (err) {
        console.warn('Backend catalog query failed:', err);
      }

      const hashResolved = this.resolveCatalogFromUrl();
      if (hashResolved && hashResolved.catalog) {
        return hashResolved.catalog;
      }

      return found;
    },

    toggleVerified: function (id) {
      const cat = this.get(id);
      if (!cat) return null;
      cat.verified = !(cat.verified !== false);
      cat.updated_at = Date.now();
      return this.save(cat);
    },

    // -----------------------------------------------------------------
    // Server Synchronization
    // -----------------------------------------------------------------
    syncWithServer: function () {
      try {
        fetch('/api/catalogs')
          .then(res => {
            if (!res.ok) return null;
            return res.json();
          })
          .then(serverList => {
            if (Array.isArray(serverList) && serverList.length > 0) {
              const local = this.list();
              const merged = [...local];
              serverList.forEach(s => {
                const idx = merged.findIndex(m => m.id === s.id);
                if (idx === -1) {
                  merged.push(s);
                } else if ((s.updated_at || 0) > (merged[idx].updated_at || 0)) {
                  merged[idx] = s;
                }
              });
              this.saveAll(merged);
            }
          })
          .catch(() => {
            // Serverless/offline environment - graceful silence
          });
      } catch (_) {}
    },

    syncCatalogToServer: function (cat) {
      try {
        fetch('api/catalogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cat)
        }).catch(() => {});
      } catch (_) {}
    },

    dispatchChange: function () {
      try {
        window.dispatchEvent(new CustomEvent('catalogstore:change', { detail: { catalogs: this.list() } }));
      } catch (_) {}
    },

    exportAllJson: function () {
      return JSON.stringify(this.list(), null, 2);
    },

    importJson: function (jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        const incoming = Array.isArray(parsed) ? parsed : [parsed];
        const current = this.list();
        let addedCount = 0;

        incoming.forEach(item => {
          if (item && item.name) {
            const id = item.id || generateCatalogId(item.name);
            const idx = current.findIndex(c => c.id === id);
            const clean = {
              id: id,
              name: item.name,
              phone: item.phone || '+2348035550192',
              currency: item.currency || 'NGN',
              tagline: item.tagline || '',
              category: item.category || 'General',
              theme: item.theme || 'emerald',
              layout: item.layout || 'standard',
              products: Array.isArray(item.products) ? item.products : [],
              created_at: item.created_at || Date.now(),
              updated_at: Date.now()
            };
            if (idx >= 0) {
              current[idx] = clean;
            } else {
              current.unshift(clean);
            }
            addedCount++;
          }
        });

        this.saveAll(current);
        return { success: true, count: addedCount };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    // -----------------------------------------------------------------
    // Interactive Share Modal Engine
    // -----------------------------------------------------------------
    openShareModal: function (catalog) {
      if (!catalog) return;
      let modal = document.getElementById('share-catalog-modal');
      if (!modal) return;

      const shareUrl = this.getSharableUrl(catalog, false);
      const portableUrl = this.getSharableUrl(catalog, true);

      // Populate text details
      const nameEl = document.getElementById('share-modal-store-name');
      const tagEl = document.getElementById('share-modal-store-tag');
      const countEl = document.getElementById('share-modal-count-badge');
      const avatarEl = document.getElementById('share-modal-avatar');
      const inputEl = document.getElementById('share-modal-url-input');

      if (nameEl) nameEl.textContent = catalog.name || 'Storefront';
      if (tagEl) tagEl.textContent = catalog.tagline || 'Direct WhatsApp storefront';
      if (countEl) countEl.textContent = `${(catalog.products || []).length} Products`;
      if (avatarEl) avatarEl.textContent = (catalog.name || 'S').trim().charAt(0).toUpperCase();
      if (inputEl) inputEl.value = shareUrl;

      // WhatsApp Message Formatting
      const waText = `🛍️ *${catalog.name} - Online Store*\n${catalog.tagline || 'Order directly on WhatsApp'}\n\nBrowse verified products and order with 1 tap:\n👉 ${shareUrl}`;
      const waShareUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;

      const btnWa = document.getElementById('btn-share-modal-wa');
      if (btnWa) {
        btnWa.onclick = function (e) {
          e.preventDefault();
          window.open(waShareUrl, '_blank');
        };
      }

      // Native Device Share
      const btnNative = document.getElementById('btn-share-modal-native');
      if (btnNative) {
        if (navigator.share) {
          btnNative.style.display = 'inline-flex';
          btnNative.onclick = async function () {
            try {
              await navigator.share({
                title: `${catalog.name} - Storefront`,
                text: waText,
                url: shareUrl
              });
            } catch (_) {}
          };
        } else {
          btnNative.style.display = 'none';
        }
      }

      // Copy Link Button
      const btnCopy = document.getElementById('btn-share-modal-copy');
      if (btnCopy) {
        btnCopy.onclick = function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl).then(onCopied).catch(fallbackCopy);
          } else {
            fallbackCopy();
          }

          function fallbackCopy() {
            if (inputEl) {
              inputEl.select();
              inputEl.setSelectionRange(0, 99999);
              document.execCommand('copy');
            }
            onCopied();
          }

          function onCopied() {
            const orig = btnCopy.innerHTML;
            btnCopy.innerHTML = `<span>✅ Copied!</span>`;
            btnCopy.style.background = '#059669';
            btnCopy.style.color = '#fff';
            setTimeout(() => {
              btnCopy.innerHTML = orig;
              btnCopy.style.background = '';
              btnCopy.style.color = '';
            }, 2500);

            if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
              window.ContentSmithStudio.showToast(`📋 Copied sharable link for "${catalog.name}"!`);
            }
          }
        };
      }

      // Open Storefront in New Tab button
      const btnOpenLive = document.getElementById('btn-share-modal-open-live');
      if (btnOpenLive) {
        btnOpenLive.onclick = function (e) {
          e.preventDefault();
          window.open(shareUrl, '_blank');
        };
      }

      // QR Code Generation
      const qrBox = document.getElementById('share-modal-qr-box');
      if (qrBox && window.ContentSmithQR) {
        qrBox.innerHTML = window.ContentSmithQR.generateSvg(shareUrl, { size: 180, margin: 2, fgColor: '#0f172a' });
      }

      // Download QR Code image
      const btnDownloadQr = document.getElementById('btn-share-modal-download-qr');
      if (btnDownloadQr) {
        btnDownloadQr.onclick = function () {
          const c = document.createElement('canvas');
          if (window.ContentSmithQR) {
            window.ContentSmithQR.renderToCanvas(c, shareUrl, { size: 500, margin: 3, fgColor: '#0f172a' });
            const link = document.createElement('a');
            link.download = `${slugify(catalog.name)}-qr-code.png`;
            link.href = c.toDataURL('image/png');
            link.click();
            if (window.ContentSmithStudio && window.ContentSmithStudio.showToast) {
              window.ContentSmithStudio.showToast(`Saved QR Code for "${catalog.name}"!`);
            }
          }
        };
      }

      // Open Modal
      modal.classList.add('open');
    }
  };

  // Expose global
  global.CatalogStore = CatalogStore;

  // Auto-init on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CatalogStore.init());
  } else {
    CatalogStore.init();
  }

})(typeof window !== 'undefined' ? window : this);
