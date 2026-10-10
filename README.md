# CatalogSmith 🛍️🎥
### Video-to-Storefront Tool (Git-Free, Phone-First)

**CatalogSmith** turns a vendor product video into a live mobile-first storefront with **zero infrastructure, zero GitHub account, and 100% free tiers**. 

Built for mobile-native merchants and operators who do everything from a smartphone, have no developer setup, and want to publish a live shareable catalog in minutes.

---

## 🌟 Key Architecture & Design Decisions

1. **One Multimodal Pass Replaces Complex Pipelines**:
   Gemini accepts video directly via its Files API (up to 2GB per file on the free tier). One multimodal call over the entire video replaces manual frame extraction, scene detection, deduplication, and audio transcription.
2. **Client-Side Frame Capture (No Server-Side FFmpeg)**:
   The user selects their local video in the browser. Using an HTML5 `<video>` element and `<canvas>`, CatalogSmith jumps directly to `best_timestamp_sec`, lets the user nudge the frame if blurry, and captures a crisp JPEG thumbnail in milliseconds.
3. **Git-Free, Serverless Hosting**:
   Storefronts are exported as a self-contained ZIP or standalone HTML file and deployed directly to **Cloudflare Pages** or **Netlify Drop** (`app.netlify.com/drop`) in under 60 seconds with zero terminal or git commands.
4. **WhatsApp-First Ordering (No Cart, No Checkout Gateways)**:
   Designed for emerging market vendors. Every product card features a prominent **"Order on WhatsApp"** button that opens a pre-filled chat with the product name and price. If the price is missing, it dynamically changes to **"Ask for Price on WhatsApp"**.

---

## 📱 The 3 Supported Video Scenarios

CatalogSmith is calibrated and tested on five real-world vendor video formats:

| Scenario | Typical Input | Price Detection Source | Included Fixture |
| :--- | :--- | :--- | :--- |
| **1. WhatsApp Chat Scroll** | Screen recording of a WhatsApp chat or group sharing product cards, photos, and messages | `on_screen` (chat message text or captions) | [`fixtures/whatsapp-chat.json`](fixtures/whatsapp-chat.json) |
| **2. Handheld Walkthrough** | Vendor holding up items to the phone camera while narrating details and prices | `spoken` (vendor audio voiceover) | [`fixtures/handheld-walkthrough.json`](fixtures/handheld-walkthrough.json) |
| **3. Shelf / Display Footage** | Static or panning footage of boutique display racks, shelves, or tables | `price_tag` (visible tag/label or `null`) | [`fixtures/shelf-display.json`](fixtures/shelf-display.json) |
| **4. Social Video / Tech Reels** | Short-form vertical video (TikTok/Reel) of mobile gadgets, audio, and unboxings | `on_screen` & `spoken` (spec captions or vocal callouts) | [`fixtures/social-reel.json`](fixtures/social-reel.json) |
| **5. Market Stall Walkthrough** | Panning through open bazaar provisions, dry spices, raw honey jars, and grains | `price_tag` & `spoken` (stall signs, oral pricing per kg) | [`fixtures/market-stall.json`](fixtures/market-stall.json) |

---

## 🎨 Storefront Themes & Customization

Vendors can instantly personalize their storefront without writing CSS:
- **🌿 Emerald & Mint (Clean WhatsApp Native)**: Default trusted merchant look.
- **👑 Luxury Obsidian & Champagne Gold**: Deep dark background with warm gold borders for luxury fashion and jewelry.
- **🌅 Sunset Terracotta & Warm Sand**: Earthy boutique warmth tailored for handcrafted leather and artisanal goods.
- **⚡ Cyber Slate & Electric Blue**: High-contrast tech aesthetic for electronics and gadget vendors.
- **🖋️ Editorial Minimalist & Monochrome**: High-contrast stark monochrome for boutique brands and organic pantries.
- **Mobile Grid Densities**: Standard (1 card/row on ~360px phones with large prominent images) or Compact (2 cards/row on phone for high-density fast browsing).
- **Customizable CTA Buttons**: "Order on WhatsApp", "Buy on WhatsApp", or custom actions.

---

## 📂 Project Structure

```
catalogsmith/
├── index.html                 # CatalogSmith Studio (Browser tool, responsive phone-first)
├── css/
│   └── studio.css             # Sleek dark-mode Studio stylesheet
├── js/
│   ├── studio.js              # In-browser frame capture, video scrubber, review, and ZIP export
│   ├── jszip.min.js           # Vendored JSZip for client-side zero-backend ZIP creation
│   └── fixtures.js            # Pre-packaged test datasets for all 5 scenarios
├── template/
│   ├── index.html             # Production Storefront template
│   └── storefront.css         # Ultra-fast mobile CSS (themes, 360px optimized, zero CLS)
├── prompts/
│   ├── video-extraction-prompt.md # Gemini AI Studio whole-video prompt & guide
│   ├── per-frame-prompt.md        # Fallback per-frame prompt & merge logic
│   └── schema.json                # Formal JSON schema for product catalog
├── fixtures/
│   ├── whatsapp-chat.json         # Real-world fixture: WhatsApp chat screen recording
│   ├── handheld-walkthrough.json  # Real-world fixture: Handheld narration
│   ├── shelf-display.json         # Real-world fixture: Boutique shelf display
│   ├── social-reel.json           # Real-world fixture: Social video tech reels
│   └── market-stall.json          # Real-world fixture: Open market bazaar stall
├── docs/
│   ├── AI_STUDIO_GUIDE.md         # Phone-first AI Studio video upload walkthrough
│   ├── DEPLOYMENT_GUIDE.md        # 60-second Netlify Drop & Cloudflare Pages deployment
│   └── TESTING_REPORT.md          # Architectural validation across all 5 scenarios
└── README.md                  # This file
```

---

## 🚀 Quickstart Walkthrough

### Step 1: Automated Video Extraction (Zero Copy-Paste Needed)
In **Step 1: Input & Automation**:
- **Option A (1-Click Grounded Gemini AI Extraction)**: Enter your free Gemini API key, select your model (`gemini-1.5-flash` or `gemini-2.0-flash`), and click **"Auto-Extract Catalog with Gemini"**. CatalogSmith samples visual keyframes from the video, sends them to Gemini with strict zero-hallucination grounding, extracts authentic product names, visible prices, and exact timestamps, and captures sharp photo frames for every item!
- **Option B (Smart Local Auto-Scan - No Key Needed)**: Click **"Smart Local Auto-Scan"**. The in-browser engine scans the video timeline directly via HTML5 Canvas, captures real candidate product frames across scenes, and creates clean items ready for you to title and price.
- **Option C (Manual / Google AI Studio)**: You can also use [aistudio.google.com](https://aistudio.google.com) to paste whole-video prompts and load JSON manually.

### Step 2: Review Products & Edit Photos
In **Step 2: Review & Photo Studio**, each product card gives you four dedicated photo actions:
- **✂️ Edit (Photo Studio & Filter Editor)**:
  - Adjust Brightness, Contrast, Saturation, and Warmth with real-time hardware-accelerated canvas filters.
  - Crop aspect ratios (Original, 1:1 Square, 4:3 Standard, 3:4 Portrait).
  - Toggle **"Soft Studio Spotlight Backdrop"** for clean commercial lighting and subtle vignettes.
- **🤖 AI (AI Product Photo Generator)**:
  - Generate 4 distinct studio aesthetic variations (Clean White Commercial, Royal Obsidian Gold, Warm Sunset Lifestyle, Editorial Minimalist).
  - Preview variations with custom lighting and styling, select your favorite, and apply it in one tap.
- **📁 Upload (Camera / Disk Upload)**:
  - Tap **Upload** to pick any high-resolution photo from your phone gallery or take a picture with your mobile camera.
- **📸 Frame (Video Snap)**:
  - Seek the video to any timestamp or nudge by seconds/tenths and snap the exact video frame.

### Step 3: Configure Store Branding & Themes
In **Step 3: Storefront Details**, choose from **6 Brand Themes**:
1. **🌿 Emerald & Mint**: Crisp WhatsApp commerce aesthetic.
2. **👑 Luxury Obsidian & Champagne Gold**: Black-tie and fine jewelry palette.
3. **🌅 Sunset Terracotta & Warm Sand**: Warm lifestyle, artisanal, and bakery palette.
4. **⚡ Cyber Slate & Electric Blue**: High-tech gadgets and electronics.
5. **🌸 Blush Rose & Velvet Noir**: Beauty, cosmetics, skincare, and fragrance.
6. **🖋️ Editorial Minimalist & Monochrome**: High-fashion boutique and clean minimalism.

Also toggle **Mobile Grid Density**:
- **Standard**: 1 card per row with rich product cards.
- **Compact**: 2 cards per row dense grid for large product catalogs.

### Step 4: Preview Live & Export (Git-Free)
In **Step 4**:
- Test the interactive **Live Mobile Phone Simulator** directly inside the studio.
- Live page features an interactive **🎨 Style & Grid** switcher floating toolbar and **Dynamic Category Filter Pills**.
- Click **"Download Storefront ZIP (.zip)"** or **"Standalone Single-File HTML"**.
- Deploy in seconds:
  - **Vercel**: Import this project into [vercel.com](https://vercel.com) via GitHub, or run `npx vercel` in the project directory. Pre-configured with `vercel.json`!
  - **Netlify Drop**: Drag the ZIP to **[app.netlify.com/drop](https://app.netlify.com/drop)** (instant HTTPS URL, no account needed!)
  - **Cloudflare Pages**: Direct upload via Cloudflare Dashboard workers & pages.

---

## 🎨 Storefront Template Design Specs

The storefront template (`template/index.html`) is built specifically for users and customers on low-bandwidth mobile connections:
- **Interactive Live Styling**: Includes floating `🎨 Style` and `📐 Grid` switcher directly on the live site.
- **Dynamic Category Filter Pills**: Customers can filter by product categories (`All`, `Dresses`, `Bags`, etc.) instantly without page reloads.
- **Scan Order**: Image first &rarr; Product title &rarr; Prominent price &rarr; Order action.
- **Data-Conscious & Zero CLS**: Images are compressed, lazy-loaded (`loading="lazy"`), with fixed aspect ratios (`4:3`) to eliminate layout shifts.
- **Large Tap Targets**: All interactive elements are at least `48px` tall.
- **Graceful Null Pricing**: Missing or unstated prices render an "Ask for price" badge and tailor the WhatsApp message accordingly.
- **Sticky Contact Bar**: WhatsApp chat button remains pinned at the bottom-right throughout scrolling.
- **📄 PDF Catalog & 📲 1-Tap Share**: Customers or vendors can trigger an A4 PDF lookbook print/save or share catalog links natively via WhatsApp directly from the storefront bar.

---

## 📄 PDF Catalog & Mobile Lookbook Sharing

CatalogSmith provides a zero-backend, client-side PDF catalog generator:
1. **Download PDF Catalog (`.pdf`)**:
   - Generates a standalone multi-page `%PDF-1.4` binary document containing high-resolution product photos, prices, descriptions, and category tags.
   - Built-in WhatsApp links: Tapping any product or order button directly inside the PDF launches WhatsApp with a pre-filled order inquiry to the vendor.
2. **Print / Save Lookbook (A4)**:
   - Launches a print-optimized A4 Lookbook (`@media print`) and triggers `window.print()` for native "Save as PDF" / "Save to Files" on iOS, Android, and Desktop browsers.
   - Also packaged as `catalog-lookbook.html` inside every exported ZIP bundle.
3. **1-Tap Mobile Sharing (`📲 Share`)**:
   - Uses the native Web Share API (`navigator.share`) to share the catalog PDF or storefront link across WhatsApp chats, WhatsApp Status, Instagram DMs, or AirDrop.
   - Automatically falls back to a pre-filled `https://wa.me/?text=...` chat link if Web Share is unavailable.

## 🔄 Fallback: Frame-by-Frame Extraction

If a fast-scrolling screen recording causes whole-video extraction to miss products:
1. Open the **Fallback Frames** tool in the Studio header.
2. Select your video to sample candidate frames at customizable intervals (e.g. every 1.5s).
3. Tap any frame to jump the video directly to that moment.
4. Copy the **Per-Frame Prompt** ([`prompts/per-frame-prompt.md`](prompts/per-frame-prompt.md)) to re-extract missed items individually.

---

## 📄 License & Credits
- Built with zero runtime dependencies.
- Bundles [JSZip](https://stuk.github.io/jszip/) (MIT License) for client-side packaging.
- Free-tier friendly with Google Gemini API & Cloudflare/Netlify hosting.
