/**
 * ContentSmith - Internationalization (i18n) Module
 * Supports 6 core emerging-market languages:
 * 1. English (en) - Default / International
 * 2. French (fr) - West & Central Africa (Senegal, Côte d'Ivoire, Cameroon, DRC)
 * 3. Swahili (sw) - East Africa (Kenya, Tanzania, Uganda, Rwanda)
 * 4. Arabic (ar) - North Africa & Middle East (Egypt, Morocco, Sudan, UAE) [RTL]
 * 5. Yoruba (yo) - Nigeria & Benin
 * 6. Hausa (ha) - Northern Nigeria, Niger, Ghana
 */

(function(global) {
  'use strict';

  const translations = {
    en: {
      code: 'en',
      dir: 'ltr',
      name: 'English',
      flag: '🇬🇧',
      verified_store: 'Verified Store',
      tagline_fallback: 'Fast orders directly on WhatsApp',
      message_store: 'Message Store',
      style_label: '🎨 Style:',
      grid_label: '📐 Grid:',
      lang_label: '🌐 Lang:',
      grid_standard: 'Standard (1 Col)',
      grid_compact: 'Compact (2 Col)',
      pdf_catalog: '📄 PDF Catalog',
      share: '📲 Share',
      all_products: 'All Products',
      in_stock_only: '🟢 In Stock Only',
      item_singular: 'item',
      item_plural: 'items',
      catalog_label: 'Catalog:',
      direct_checkout: 'Direct WhatsApp Checkout',
      sold_out: 'Sold Out',
      ask_for_price: 'Ask for price',
      order_button: 'Order on WhatsApp',
      ask_button: 'Ask for Price on WhatsApp',
      sold_out_button: '💬 Inquire Restock on WhatsApp',
      chat_general: 'Hello {vendor_name}! I am viewing your catalog and would like to make an inquiry.',
      chat_order: 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price}) from your catalog. Is it available for delivery?',
      chat_ask: 'Hello {vendor_name}! What is the price and availability for *{product_name}*? I saw it on your catalog.',
      chat_restock: 'Hello {vendor_name}! I saw that *{product_name}* is sold out in your catalog. Will you be restocking this item soon?',
      sticky_chat: 'Chat with Vendor',
      empty_title: 'No products found',
      empty_desc: 'This storefront is currently empty or updating.',
      no_photo: 'Photo coming soon',
      powered_by: 'Powered by ContentSmith • Mobile-First Video Storefront'
    },
    fr: {
      code: 'fr',
      dir: 'ltr',
      name: 'Français',
      flag: '🇫🇷',
      verified_store: 'Boutique Vérifiée',
      tagline_fallback: 'Commandes rapides directement sur WhatsApp',
      message_store: 'Écrire à la boutique',
      style_label: '🎨 Style :',
      grid_label: '📐 Grille :',
      lang_label: '🌐 Langue :',
      grid_standard: 'Standard (1 Col)',
      grid_compact: 'Compact (2 Col)',
      pdf_catalog: '📄 Catalogue PDF',
      share: '📲 Partager',
      all_products: 'Tous les articles',
      in_stock_only: '🟢 En stock uniquement',
      item_singular: 'article',
      item_plural: 'articles',
      catalog_label: 'Catalogue :',
      direct_checkout: 'Paiement direct par WhatsApp',
      sold_out: 'Épuisé',
      ask_for_price: 'Demander le prix',
      order_button: 'Commander sur WhatsApp',
      ask_button: 'Demander le prix sur WhatsApp',
      sold_out_button: '💬 Demander un réapprovisionnement',
      chat_general: 'Bonjour {vendor_name} ! Je consulte votre catalogue et souhaite faire une demande.',
      chat_order: 'Bonjour {vendor_name} ! Je souhaite commander *{product_name}* ({product_price}) depuis votre catalogue. Est-il disponible pour livraison ?',
      chat_ask: 'Bonjour {vendor_name} ! Quel est le prix et la disponibilité pour *{product_name}* ? Je l\'ai vu sur votre catalogue.',
      chat_restock: 'Bonjour {vendor_name} ! J\'ai vu que *{product_name}* est épuisé. Sera-t-il bientôt de retour en stock ?',
      sticky_chat: 'Contacter le vendeur',
      empty_title: 'Aucun produit trouvé',
      empty_desc: 'Cette boutique est actuellement vide ou en cours de mise à jour.',
      no_photo: 'Photo à venir',
      powered_by: 'Propulsé par ContentSmith • Boutique vidéo mobile d\'abord'
    },
    sw: {
      code: 'sw',
      dir: 'ltr',
      name: 'Kiswahili',
      flag: '🇰🇪',
      verified_store: 'Duka Lililothibitishwa',
      tagline_fallback: 'Agiza haraka moja kwa moja kwenye WhatsApp',
      message_store: 'Tuma Ujumbe Dukani',
      style_label: '🎨 Mtindo:',
      grid_label: '📐 Mpangilio:',
      lang_label: '🌐 Lugha:',
      grid_standard: 'Kawaida (Safu 1)',
      grid_compact: 'Bana (Safu 2)',
      pdf_catalog: '📄 Katalogi ya PDF',
      share: '📲 Shiriki',
      all_products: 'Bidhaa Zote',
      in_stock_only: '🟢 Zilizopo Dukani Pekee',
      item_singular: 'bidhaa',
      item_plural: 'bidhaa',
      catalog_label: 'Katalogi:',
      direct_checkout: 'Agiza Moja kwa Moja WhatsApp',
      sold_out: 'Zimekwisha',
      ask_for_price: 'Ulizia bei',
      order_button: 'Agiza kwenye WhatsApp',
      ask_button: 'Ulizia Bei kwenye WhatsApp',
      sold_out_button: '💬 Ulizia Upatikanaji WhatsApp',
      chat_general: 'Hujambo {vendor_name}! Ninaangalia katalogi yako na ningependa kuuliza swali.',
      chat_order: 'Hujambo {vendor_name}! Ningependa kuagiza *{product_name}* ({product_price}) kutoka katalogi yako. Je, inapatikana kwa utoaji?',
      chat_ask: 'Hujambo {vendor_name}! Ni bei gani na upatikanaji wa *{product_name}*? Nimeiona kwenye katalogi yako.',
      chat_restock: 'Hujambo {vendor_name}! Nimeona *{product_name}* imekwisha. Je, itapatikana tena hivi karibuni?',
      sticky_chat: 'Ongea na Muuzaji',
      empty_title: 'Hakuna bidhaa zilizopatikana',
      empty_desc: 'Katalogi hii haina bidhaa kwa sasa au inasasishwa.',
      no_photo: 'Picha inakuja hivi karibuni',
      powered_by: 'Imeendeshwa na ContentSmith • Duka la Video la Simu Kwanza'
    },
    ar: {
      code: 'ar',
      dir: 'rtl',
      name: 'العربية',
      flag: '🇸🇦',
      verified_store: 'متجر موثق',
      tagline_fallback: 'طلب سريع ومباشر عبر واتساب',
      message_store: 'مراسلة المتجر',
      style_label: '🎨 المظهر:',
      grid_label: '📐 الشبكة:',
      lang_label: '🌐 اللغة:',
      grid_standard: 'قياسي (عمود 1)',
      grid_compact: 'مدمج (عمودان)',
      pdf_catalog: '📄 كتالوج PDF',
      share: '📲 مشاركة',
      all_products: 'جميع المنتجات',
      in_stock_only: '🟢 المتوفر فقط',
      item_singular: 'منتج',
      item_plural: 'منتجات',
      catalog_label: 'الكتالوج:',
      direct_checkout: 'شراء فوري عبر واتساب',
      sold_out: 'نفد المخزون',
      ask_for_price: 'اسأل عن السعر',
      order_button: 'اطلب عبر واتساب',
      ask_button: 'اسأل عن السعر عبر واتساب',
      sold_out_button: '💬 استفسر عن توفر المنتج',
      chat_general: 'مرحبًا {vendor_name}! أتصفح كتالوج منتجاتك وأود الاستفسار.',
      chat_order: 'مرحبًا {vendor_name}! أود طلب *{product_name}* ({product_price}) من كتالوجك. هل هو متوفر للتوصيل؟',
      chat_ask: 'مرحبًا {vendor_name}! ما هو سعر وتوفر *{product_name}*؟ لقد رأيته في كتالوجك.',
      chat_restock: 'مرحبًا {vendor_name}! رأيت أن *{product_name}* غير متوفر حاليًا. هل سيتوفر قريبًا؟',
      sticky_chat: 'محادثة البائع',
      empty_title: 'لا توجد منتجات',
      empty_desc: 'هذا الكتالوج فارغ حاليًا أو قيد التحديث.',
      no_photo: 'الصورة قريبًا',
      powered_by: 'مدعوم بواسطة ContentSmith • متجر الفيديو المحمول أولاً'
    },
    yo: {
      code: 'yo',
      dir: 'ltr',
      name: 'Yorùbá',
      flag: '🇳🇬',
      verified_store: 'Ile-itaja ti a fọwọsi',
      tagline_fallback: 'Ibere kiakia lori WhatsApp',
      message_store: 'Fi ifiranṣẹ ranṣẹ',
      style_label: '🎨 Àwọ̀:',
      grid_label: '📐 Ètò:',
      lang_label: '🌐 Èdè:',
      grid_standard: 'Àtọwọdọ́wọ́ (Ìlà 1)',
      grid_compact: 'Kíkékèké (Ìlà 2)',
      pdf_catalog: '📄 Ìwé PDF',
      share: '📲 Pín',
      all_products: 'Gbogbo Ọjà',
      in_stock_only: '🟢 Ọjà Tí Ó Wà Nílẹ̀',
      item_singular: 'ọjà',
      item_plural: 'ọjà',
      catalog_label: 'Àkójọ Ọjà:',
      direct_checkout: 'Rira taara lori WhatsApp',
      sold_out: 'Ti tán',
      ask_for_price: 'Béèrè iye owó',
      order_button: 'Ra lori WhatsApp',
      ask_button: 'Béèrè iye owó lori WhatsApp',
      sold_out_button: '💬 Béèrè ìgbà tí yóò tún wà',
      chat_general: 'Ẹ n lẹ́ o {vendor_name}! Mo ń wo àwọn ọjà yín mo sì fẹ́ béèrè ọ̀rọ̀ díẹ̀.',
      chat_order: 'Ẹ n lẹ́ o {vendor_name}! Mo fẹ́ ra *{product_name}* ({product_price}) nínú àwọn ọjà yín. Ṣé ó wà fún títà?',
      chat_ask: 'Ẹ n lẹ́ o {vendor_name}! Èlò ni *{product_name}*? Mo rí i nínú àwọn ọjà yín.',
      chat_restock: 'Ẹ n lẹ́ o {vendor_name}! Mo rí i pé *{product_name}* ti tán. Ṣé yóò tún wà láìpẹ́?',
      sticky_chat: 'Bá Oníṣòwò Sọ̀rọ̀',
      empty_title: 'Kò sí ọjà kankan',
      empty_desc: 'Kò sí ọjà nínú àkójọ yìí báyìí.',
      no_photo: 'Àwòrán ń bọ̀ láìpẹ́',
      powered_by: 'Látọwọ́ ContentSmith • Ile-itaja Fídíò Foonu Ni Akọkọ'
    },
    ha: {
      code: 'ha',
      dir: 'ltr',
      name: 'Hausa',
      flag: '🇳🇬',
      verified_store: 'Shagon da aka Tabbatar',
      tagline_fallback: 'Oda mai sauri kai tsaye a WhatsApp',
      message_store: 'Aika Saƙo zuwa Shago',
      style_label: '🎨 Tsari:',
      grid_label: '📐 Jeri:',
      lang_label: '🌐 Harshe:',
      grid_standard: 'Na yau da kullun (Layi 1)',
      grid_compact: 'Karami (Layi 2)',
      pdf_catalog: '📄 Kasidar PDF',
      share: '📲 Raba',
      all_products: 'Duk Kayan',
      in_stock_only: '🟢 Masu nan kawai',
      item_singular: 'kaya',
      item_plural: 'kaya',
      catalog_label: 'Kasida:',
      direct_checkout: 'Siyayya kai tsaye a WhatsApp',
      sold_out: 'Ya ƙare',
      ask_for_price: 'Tambayi Farashi',
      order_button: 'Yi Oda a WhatsApp',
      ask_button: 'Tambayi Farashi a WhatsApp',
      sold_out_button: '💬 Tambayi Lokacin Isowa',
      chat_general: 'Sannu {vendor_name}! Ina duba kayanku kuma ina so in yi tambaya.',
      chat_order: 'Sannu {vendor_name}! Ina so in yi odar *{product_name}* ({product_price}) daga kasidarku. Shin akwai shi don aiko mini?',
      chat_ask: 'Sannu {vendor_name}! Nawa ne farashin da samuwar *{product_name}*? Na gani a kasidarku.',
      chat_restock: 'Sannu {vendor_name}! Na ga cewa *{product_name}* ya ƙare. Shin zai sake samuwa nan ba da jimawa ba?',
      sticky_chat: 'Yi Magana da Mai Shago',
      empty_title: 'Ba a sami kaya ba',
      empty_desc: 'Wannan shagon babu kaya a ciki a yanzu.',
      no_photo: 'Hoto yana zuwa',
      powered_by: 'Ƙarƙashin ContentSmith • Shagon Bidiyo na Wayar Hannu da Farko'
    }
  };

  function getLang(langCode) {
    const code = (langCode || 'en').toLowerCase().trim();
    return translations[code] || translations.en;
  }

  function t(langCode, key, params = {}) {
    const dict = getLang(langCode);
    let str = dict[key] !== undefined ? dict[key] : (translations.en[key] || key);
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(k => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
      });
    }
    return str;
  }

  function getLanguages() {
    return Object.keys(translations).map(code => ({
      code,
      name: translations[code].name,
      flag: translations[code].flag,
      dir: translations[code].dir
    }));
  }

  const ContentSmithI18N = {
    translations,
    getLang,
    t,
    getLanguages
  };

  global.ContentSmithI18N = ContentSmithI18N;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentSmithI18N;
  }
})(typeof window !== 'undefined' ? window : globalThis);
