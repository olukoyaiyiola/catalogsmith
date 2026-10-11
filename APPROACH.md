# CatalogSmith: Master Architectural Approach & Iteration Guide

> **Target Audience**: AI Engineering Assistants (Claude / GPT), Senior Frontend Engineers, and System Architects.
> **Purpose**: Serves as the complete mental model, architectural reference, UI specification, and roadmap for understanding, modifying, and extending CatalogSmith without regressions.

---

## 1. Executive Summary & Core Philosophy

**CatalogSmith** is a **phone-first, zero-infrastructure, Git-free video-to-storefront generator**. It empowers non-technical, mobile-native merchants (e.g. WhatsApp, Instagram, TikTok vendors, and open-market stall owners) to convert raw product showcase videos into high-converting, mobile-optimized digital storefronts.

### Core Architectural Tenets:
1. **Zero Server Backend**: 100% client-side execution in standard web browsers. No Node.js runtime, no Python servers, no backend databases, and no FFmpeg binaries required.
2. **Git-Free Deployment**: Output is exported as a standalone static ZIP bundle, single-file HTML, or A4 PDF lookbook deployed in under 60 seconds to Netlify Drop, Cloudflare Pages, or Vercel.
3. **WhatsApp-First Commerce**: No shopping carts, payment gateways, or complicated checkouts. Every product card generates pre-filled WhatsApp order chats (`wa.me`) tailored to emerging-market vendor workflows.
4. **Resilient Data & Null-Price Handling**: Automatically accommodates real-world unpriced items ("Ask for price on WhatsApp"), ambiguous video segments, and varying video qualities.
5. **Low-Bandwidth & Mobile Optimization**: Strictly designed for 360px–414px mobile viewports, large 48px touch targets, compressed images, and zero Cumulative Layout Shift (CLS = 0).

---

## 2. Repository Structure & File Map

```
catalogsmith/
├── index.html                   # Dual-view application: Landing page + Store workspace
├── css/
│   ├── app.css                  # Light-theme emerald design system & landing page styles
│   └── studio.css               # Studio layout, modals, scrubber & photo editor
├── js/
│   ├── app.js                   # Application coordinator: Landing ↔ Workspace, creation flows & wizards
│   ├── studio.js                # Core Studio application logic (~2,700 lines)
│   ├── pdf-catalog.js           # Zero-backend PDF generator & printable lookbook (~850 lines)
│   ├── jszip.min.js             # Vendored JSZip v3.10.1 for client-side ZIP compilation
│   └── fixtures.js              # Pre-loaded sample datasets for 5 real-world scenarios
├── template/
│   ├── index.html               # Production customer storefront template
│   └── storefront.css           # Storefront stylesheet (6 theme presets, mobile grid layouts)
├── prompts/
│   ├── video-extraction-prompt.md # Gemini AI Studio multimodal whole-video prompt
│   ├── per-frame-prompt.md        # Fallback frame-by-frame prompt & merge rules
│   └── schema.json                # JSON schema defining catalog data & price confidence
├── fixtures/
│   ├── whatsapp-chat.json       # Scenario 1: WhatsApp chat screen recording
│   ├── handheld-walkthrough.json# Scenario 2: Handheld item narration
│   ├── shelf-display.json       # Scenario 3: Boutique display racks & price tags
│   ├── social-reel.json         # Scenario 4: Vertical tech reel & unboxing
│   └── market-stall.json        # Scenario 5: Open-air bazaar stall provisions
├── docs/
│   ├── AI_STUDIO_GUIDE.md       # Step-by-step phone-first Google AI Studio guide
│   ├── DEPLOYMENT_GUIDE.md      # Drag-and-drop Netlify Drop / Cloudflare Pages / Vercel guide
│   └── TESTING_REPORT.md        # Architectural test matrix across all 5 fixture scenarios
├── vercel.json                  # Pre-configured static routing for Vercel
├── APPROACH.md                  # This master reference document
└── README.md                    # Project overview & quickstart
```

---

## 3. UI/UX Architecture & Visual Design System

The application has two distinct UI surfaces:
1. **The Studio App** ([`index.html`](file:///c:/Users/Odg/Documents/catalogsmith/index.html), [`css/studio.css`](file:///c:/Users/Odg/Documents/catalogsmith/css/studio.css)): High-craft, dark-mode developer/merchant tool.
2. **The Customer Storefront** ([`template/index.html`](file:///c:/Users/Odg/Documents/catalogsmith/template/index.html), [`template/storefront.css`](file:///c:/Users/Odg/Documents/catalogsmith/template/storefront.css)): Lightweight, lightning-fast, themed mobile site.

---

### 3.1 Studio App Design Tokens ([`css/studio.css`](file:///c:/Users/Odg/Documents/catalogsmith/css/studio.css))

```css
:root {
  /* Surfaces */
  --bg-main: #090d16;
  --bg-card: #0f172a;
  --bg-card-subtle: #131c31;
  --bg-input: #1e293b;
  --bg-input-hover: #27354f;

  /* Borders */
  --border-color: #1e293b;
  --border-highlight: #334155;
  --border-focus: #10b981;

  /* Typography */
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Accents */
  --color-primary: #10b981;       /* Emerald */
  --color-primary-hover: #059669;
  --color-wa: #25d366;            /* WhatsApp Green */
  --color-accent: #38bdf8;         /* Sky Blue */
  --color-warning: #f59e0b;        /* Amber */
  --color-danger: #ef4444;         /* Red */
  --color-purple: #818cf8;

  /* Radii & Elevation */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-glow: 0 0 20px -5px rgba(16, 185, 129, 0.2);
  --shadow-elevation: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
```

### 3.2 Studio 4-Step Stepper Navigation
* **Step 1: Input & Automation (`#step-pane-1`)**:
  * Video drag-and-drop zone (`#video-dropzone`) + hidden file input (`#video-input`).
  * One-click demo video generator (`#btn-generate-demo-video`).
  * **Automation Card**:
    * Gemini API key input (`#gemini-api-key`) with show/hide toggle.
    * Model selector: `gemini-1.5-flash` or `gemini-2.0-flash`.
    * **Action Buttons**:
      * `✨ Auto-Extract Catalog with Gemini` (`#btn-auto-extract-gemini`)
      * `⚡ Smart Local Auto-Scan (No Key)` (`#btn-smart-local-scan`)
    * Progress bar indicator (`#auto-progress-container`) with live percent and status labels.
  * JSON Direct Input: Manual paste area (`#json-input`) with 5 preset fixture chips.
* **Step 2: Review & Photo Studio (`#step-pane-2`)**:
  * Left/Top: HTML5 `<video>` player (`#studioVideo`) + hidden capture `<canvas>` (`#captureCanvas`).
  * Micro-stepping scrubber bar (`#video-scrubber`) + nudge buttons: `±0.2s`, `±1s`, `±5s`.
  * Dedicated "Snap Frame for Selected" button (`#btn-capture-frame`).
  * Right/Bottom: Product review list (`#review-products-container`).
  * Filter tabs: `All`, `Needs Attention (Flagged)`, `Missing Price`.
  * Product card components:
    * Title input, price input, currency dropdown, category input, description textarea.
    * Confidence score badge (Green $\ge 80\%$, Amber $50\text{--}79\%$, Red $< 50\%$).
    * Price source badge: `on_screen`, `spoken`, `price_tag`, `none`.
    * "Ask for price on WhatsApp" checkbox toggle.
    * **4 Dedicated Photo Actions**:
      * `✂️ Edit`: Opens Photo Editor Modal (filters + crop).
      * `🤖 AI`: Opens AI Studio Photo Generator Modal.
      * `📁 Upload`: Camera/Gallery file picker.
      * `📸 Frame`: Snaps video frame at product timestamp.
* **Step 3: Brand Details & Themes (`#step-pane-3`)**:
  * Merchant Name, Phone Number (E.164 formatted), Tagline, Currency.
  * **6 Visual Theme Presets** (see Section 3.3).
  * **Layout Density**: Standard (1 card/row) vs Compact (2 cards/row).
  * CTA Button text customization (e.g. "Order on WhatsApp", "Buy on WhatsApp").
  * Interactive WhatsApp message template generator with `{vendor_name}`, `{product_name}`, `{product_price}` placeholders.
* **Step 4: Live Simulation & Export (`#step-pane-4`)**:
  * Live interactive Mobile Phone Simulator (`#preview-frame`).
  * **Export Actions**:
    * `📦 Download Storefront ZIP (.zip)`: Ready for Netlify Drop / Cloudflare Pages.
    * `📄 Standalone Single-File HTML`: All assets bundled inline with base64 images.
    * `📑 Download PDF Catalog (.pdf)`: Binary `%PDF-1.4` file.
    * `🖨️ Print / Save Lookbook (A4)`: High-resolution print lookbook view.
    * `📲 Share Catalog (WhatsApp / Web Share)`: Native mobile sharing.
    * `💾 Save Project (.json)`: Saves current state for later editing.

---

### 3.3 Customer Storefront Theme Presets ([`template/storefront.css`](file:///c:/Users/Odg/Documents/catalogsmith/template/storefront.css))

The generated customer storefront supports 6 pre-configured CSS themes via body classes:

| Theme Key | Body Class | Primary Hue | Accent / WhatsApp | Character & Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `emerald` | *(default)* | `#047857` | `#25D366` | Clean WhatsApp Native: Trusted merchant standard |
| `luxury-gold` | `.theme-luxury-gold` | `#fbbf24` | `#d97706` | Luxury Obsidian & Champagne Gold: Fine jewelry & luxury fashion |
| `sunset` | `.theme-sunset` | `#c2410c` | `#ea580c` | Sunset Terracotta & Warm Sand: Artisanal goods, leather, bakeries |
| `tech-blue` | `.theme-tech-blue` | `#38bdf8` | `#0284c7` | Cyber Slate & Electric Blue: Gadgets, electronics, unboxings |
| `blush` | `.theme-blush` | `#e11d48` | `#be123c` | Blush Rose & Velvet Noir: Cosmetics, beauty, skincare |
| `minimal` | `.theme-minimal` | `#18181b` | `#27272a` | Editorial Monochrome: High-fashion minimalism, organic pantries |

### 3.4 Storefront UX Optimizations
* **Fixed Aspect Ratio (`4:3`)**: Every image wrapper enforces `aspect-ratio: 4 / 3; width: 100%; object-fit: cover;` eliminating Cumulative Layout Shift (CLS).
* **48px Minimum Touch Targets**: Buttons, pills, and inputs strictly meet mobile ergonomics standards.
* **Category Filter Pills**: Fast horizontal scrolling pill list (`All`, `Bags`, `Shoes`, etc.) that filters the catalog client-side instantly.
* **Sticky Contact Action**: Floating Action Button (FAB) stays pinned at the bottom-right on scroll to initiate vendor chats.
* **Dynamic Pricing Badge**:
  * When price exists: Displays styled currency badge (e.g., `₦25,000`).
  * When price is `null`: Displays distinct "Ask for Price" badge and updates the WhatsApp CTA text to `"Ask for Price on WhatsApp"`.

---

## 4. State Management & Data Schema

### 4.1 Global Application State ([`js/studio.js`](file:///c:/Users/Odg/Documents/catalogsmith/js/studio.js#L10-L26))
The state in `studio.js` is encapsulated within a closure:

```javascript
const state = {
  vendor_name: 'Lola Fabrics & Chic Wear',
  vendor_phone: '+2348035550192',
  currency_default: 'NGN',
  tagline: 'Luxury custom dresses & fabrics delivered nationwide',
  theme: 'emerald',            // 'emerald' | 'luxury-gold' | 'sunset' | 'tech-blue' | 'blush' | 'minimal'
  layout: 'standard',          // 'standard' | 'compact'
  order_button_text: 'Order on WhatsApp',
  message_template: 'Hello {vendor_name}! I would like to order *{product_name}* ({product_price}) from your catalog. Is it available for delivery?',
  products: [],                // Array of Product Objects
  selectedProductId: null,     // Currently focused product ID
  filter: 'all',               // 'all' | 'flagged' | 'noprice'
  currentStep: 1,              // 1 | 2 | 3 | 4
  videoDuration: 0,
  videoLoaded: false,
  videoFile: null
};
```

### 4.2 Product Item Schema ([`prompts/schema.json`](file:///c:/Users/Odg/Documents/catalogsmith/prompts/schema.json))

```json
{
  "id": "p1",
  "name": "Emerald Green Silk Kimono",
  "price": {
    "amount": 28500,
    "currency": "NGN",
    "source": "on_screen"
  },
  "description": "Floor-length silk kimono with gold embroidery cuffs.",
  "category": "Dresses",
  "best_timestamp_sec": 4.2,
  "confidence": 0.95,
  "image": "data:image/jpeg;base64,..."
}
```

* **`price.amount`**: Numeric integer or float. **Can be `null`** if price is absent or variable.
* **`price.source`**: Enum `["on_screen", "spoken", "price_tag", "none"]`.
* **`confidence`**: Float from `0.0` to `1.0`. Used to determine QA flag badging.
* **`best_timestamp_sec`**: Precise float timestamp where item is most steady and centered.

### 4.3 Persistence Lifecycle
* **`localStorage` Key**: `'catalogsmith_studio_state'`
* **Debounced Auto-Save**: Function `debouncedSaveState()` triggers `localStorage.setItem` after user edits with a 500ms debounce.
* **Auto-Hydration**: On application mount, checks `localStorage`. If saved state exists, deserializes and populates fields, restoring active products and custom images.

---

## 5. Core Pipelines & Engineering Implementations

### 5.1 Pipeline 1: HTML5 Canvas Frame Extraction
To avoid server-side FFmpeg or transcoding bottlenecks:
1. Video file is mounted as a `Blob URL` on the hidden `<video id="studioVideo">`.
2. To extract a frame at timestamp $t$:
   ```javascript
   await seekVideoSafely(video, timestamp);
   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
   const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);
   ```
3. `seekVideoSafely`: Waits for the browser's native `seeked` event with a safety timeout, ensuring the video decoder has painted the new frame before `<canvas>` captures it.
4. `getConstrainedCanvasDimensions`: Scales high-resolution video frames (e.g. 4K/1080p) down to a max width of 960px to preserve mobile memory and prevent `localStorage` quota overflow.

---

### 5.2 Pipeline 2: Automated AI Extraction & Smart Scan

CatalogSmith provides two automated extraction methods:

#### A. 1-Click Grounded Gemini AI Extraction (`runAutoExtractGemini`)
1. Samples 6–8 chronological keyframe images evenly distributed across the video timeline.
2. Formats keyframes as inline base64 image parts to the Gemini multimodal API (`generateContent`).
3. Sends structured system instructions requiring strict JSON output adhering to [`prompts/schema.json`](file:///c:/Users/Odg/Documents/catalogsmith/prompts/schema.json).
4. Strictly forbids hallucinated prices; if a price is not clearly visible on-screen or spoken in audio, sets `price.amount: null`.
5. Resolves candidate timestamps, auto-seeks the video, and attaches crisp JPEG thumbnails to each detected item.

#### B. Smart Local Auto-Scan (`runSmartLocalScan`)
1. Requires **zero API key** and runs 100% offline.
2. Traverses the video timeline at spaced intervals (e.g. every $4\text{--}6$ seconds).
3. Captures candidates via HTML5 Canvas, generates placeholder products with exact timestamps, and auto-populates Step 2 for the merchant to refine.

---

### 5.3 Pipeline 3: Client-Side Photo Studio & AI Enhancer

#### A. In-Browser Filter Canvas Editor
Built directly into [`studio.js`](file:///c:/Users/Odg/Documents/catalogsmith/js/studio.js#L1855-L2152):
* Interactive sliders for **Brightness**, **Contrast**, **Saturation**, and **Warmth** (sepia/hue-rotate).
* Aspect ratio cropping: `Original`, `1:1 (Square)`, `4:3 (Standard)`, `3:4 (Portrait)`.
* **Soft Studio Spotlight**: Renders a custom radial gradient vignette on canvas to mimic commercial studio lighting.

#### B. In-Browser AI Studio Photo Synthesizer
* Generates 4 tailored commercial studio aesthetic variations:
  1. *Clean White Studio*
  2. *Royal Obsidian Gold*
  3. *Warm Sunset Lifestyle*
  4. *Editorial Minimalist*
* Renders real-time product silhouette cards with branded gradients, price badges, and category labels.

---

### 5.4 Pipeline 4: Client-Side Export Engines

#### A. Storefront ZIP Bundle (`exportZipBundle`)
Uses vendored `JSZip` to generate a production-ready package:
* `index.html`: Fully populated storefront markup based on [`template/index.html`](file:///c:/Users/Odg/Documents/catalogsmith/template/index.html).
* `storefront.css`: Copied from [`template/storefront.css`](file:///c:/Users/Odg/Documents/catalogsmith/template/storefront.css).
* `products.json`: Pure JSON manifest of the catalog.
* `images/`: Decodes all base64 product images into binary JPEG blobs (`p1.jpg`, `p2.jpg`, etc.).
* `DEPLOY_GUIDE.md`: Deployment instructions for Netlify Drop and Cloudflare Pages.

#### B. Standalone Single-File HTML (`exportSingleFileHtml`)
* Inlines the entire CSS stylesheet and embeds product images as base64 data URLs.
* Produces a single `.html` file that works when opened offline from a smartphone file manager or shared over WhatsApp.

#### C. Binary PDF Generator & Lookbook ([`js/pdf-catalog.js`](file:///c:/Users/Odg/Documents/catalogsmith/js/pdf-catalog.js))
* **Standalone Binary `%PDF-1.4` Compiler**: Handcrafted client-side PDF synthesizer containing page objects, cross-reference tables (`xref`), and clickable WhatsApp URL annotations (`/Type /Annot /Subtype /Link /A << /S /URI /URI (...) >>`).
* **Printable Lookbook**: Generates an A4 print-optimized HTML view with `@media print` rules, page breaks, and high-resolution vendor contact headers.

---

## 6. How Claude Should Iterate on This Codebase

When tasked with implementing new features, fixing bugs, or styling updates, follow these strict development rules:

### Rule 1: Maintain the Zero-Backend Architecture
* Do NOT introduce Node.js build dependencies, npm package bundlers (Webpack, Vite), or backend servers unless the user explicitly requests a complete architectural migration.
* Keep all scripts vanilla JavaScript (ES6+), standard CSS, and semantic HTML5.

### Rule 2: Respect State Synchronization
Whenever modifying products or settings in `studio.js`:
```javascript
// 1. Mutate the state object
state.products.push(newProduct);

// 2. Refresh UI bindings
syncFormFields();
renderReviewList();

// 3. Save to localStorage & update simulator
debouncedSaveState();
updateLivePreview();
```

### Rule 3: Mobile-First Responsive Disciplines
* Test and verify all layout changes down to `360px` viewport width.
* Ensure all interactive touch targets have a minimum height/width of `48px`.
* Do not introduce elements that cause horizontal page scrolling or CLS.

### Rule 4: Memory & Storage Guardrails
* Avoid storing uncompressed multi-megabyte raw PNG data in `localStorage`.
* Always use `image/jpeg` with quality `0.80 - 0.85` and constrain canvas dimensions (`max-width: 960px`).

---

## 7. Roadmap & High-Value Next Iterations

Here are the highest-leverage areas for Claude to expand:

1. **Direct Cloudinary / Supabase Storage Integration**:
   * Add optional 1-click cloud image upload to host images on a public CDN rather than keeping them solely in base64/ZIP.
2. **Audio Track Extraction & Speech-to-Text**:
   * Utilize the Web Audio API or Web Speech API to provide live audio transcription of vendor narration for instant title/price suggestions.
3. **Multi-Image Product Galleries**:
   * Allow capturing 2–3 frames per product (e.g. front, back, detail close-up) displayed as a swipeable carousel on the storefront.
4. **Multi-Language Support**:
   * Add internationalization (i18n) for key emerging market languages: French (West Africa), Swahili (East Africa), Arabic (North Africa/Middle East), Yoruba, and Hausa.
5. **Inventory / Stock Toggles**:
   * Add simple "In Stock" / "Sold Out" badges to product cards that disable WhatsApp ordering for unavailable items.
