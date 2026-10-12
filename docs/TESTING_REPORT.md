# ContentSmith: Validation & Testing Report

This report documents the architectural testing and validation of ContentSmith across all three target video input types and the end-to-end browser studio tool.

---

## 1. Test Matrix: Input Types & Extraction Verification

We tested the whole-video prompt and schema against real-world test fixtures representing the 3 supported vendor video scenarios:

| Scenario | Input Characteristic | Price Detection Source | Timestamp Accuracy | Handling of Missing Prices | Schema Validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Scenario 1: WhatsApp Chat Screen Recording** | Chat cards, message text bubbles, scrolling photos | `on_screen` (e.g. ₦28,500, ₦16,000, ₦18,500) | Timestamps capture moment chat message is centered (4.2s, 12.8s, 21.0s) | Missing price correctly set to `null` with confidence `0.74` for custom kimono | Passed (`fixtures/whatsapp-chat.json`) |
| **Scenario 2: Handheld Walkthrough** | Vendor holding up jewelry & hair pieces, narrating aloud | `spoken` (e.g. ₦14,500, ₦21,000, ₦135,000) | Timestamps capture steady hold of item facing lens (8.4s, 19.2s, 34.6s) | Custom engraved bracelet with variable price correctly set to `null` | Passed (`fixtures/handheld-walkthrough.json`) |
| **Scenario 3: Shelf / Display Footage** | Panning across boutique leather shelves, multiple bags | `price_tag` (e.g. ₦55,000, ₦9,500, ₦42,000) | Timestamps capture close-up focus on individual items (6.8s, 15.3s, 24.1s) | Display sample without tag set to `null` with confidence `0.76` | Passed (`fixtures/shelf-display.json`) |
| **Scenario 4: Social Video / Tech Reels** | Fast unboxing and spec overlays for wireless audio & gadgets | `on_screen` & `spoken` (e.g. ₦18,500, ₦14,000, ₦22,500) | Timestamps capture key product card freeze (5.1s, 13.4s, 22.7s) | Fitness band without set price correctly set to `null` with confidence `0.78` | Passed (`fixtures/social-reel.json`) |
| **Scenario 5: Market Stall Walkthrough** | Open bazaar footage of provisions, oils, raw honey, and spices | `price_tag` & `spoken` (e.g. ₦7,500, ₦12,000, ₦9,800) | Timestamps capture steady close-ups of jars and bags (7.3s, 16.5s, 26.2s) | Seasonal habanero peppers with variable market price set to `null` | Passed (`fixtures/market-stall.json`) |

---

## 1B. Storefront Customization & Theme Testing

ContentSmith now includes 5 vendor theme presets and 2 mobile grid densities verified in both the live phone simulator and exported bundles:
- **🌿 Emerald & Mint (Clean WhatsApp Native)**: Default trusted merchant look.
- **👑 Luxury Obsidian & Champagne Gold**: Deep dark background with warm gold borders for luxury fashion and jewelry.
- **🌅 Sunset Terracotta & Warm Sand**: Earthy boutique warmth tailored for handcrafted leather and artisanal goods.
- **⚡ Cyber Slate & Electric Blue**: High-contrast tech aesthetic for electronics and gadget vendors.
- **🖋️ Editorial Minimalist & Monochrome**: High-contrast stark monochrome for boutique brands and organic pantries.
- **Grid Layouts Tested**: Standard (1 card/row on ~360px phones with large prominent images) and Compact (2 cards/row on phone for high-density fast browsing).

## 2. Studio Tool Feature Verification

### A. Zero-Backend Client Execution
- **Run Environment**: Native browser (Chrome/Edge/Safari), completely free of Node.js, Python, or FFmpeg server dependencies.
- **Persistence**: Tested `localStorage` auto-saving. State automatically restores if the page is refreshed on mobile.
- **Sample Loaders**: Verified 1-click loading for all three scenarios directly in the Studio header.

### B. Frame Grabber & Canvas Pipeline
- **Video Seeking**: Tested seeking HTML5 `<video>` to `best_timestamp_sec`.
- **Canvas Capture**: Verified `<canvas>` `drawImage` grabs video frames at native video aspect ratio and encodes to JPEG (`image/jpeg`, 0.85 quality).
- **Auto-Capture Sequence**: Verified sequential async loop seeking each product's timestamp and extracting frames automatically into product thumbnails.
- **Nudge Controls**: Verified micro-stepping (`-5s`, `-1s`, `-0.2s`, `+0.2s`, `+1s`, `+5s`) for frame refinement.

### C. Human Review & Quality Assurance
- **Confidence Badging**:
  - Scores $\ge 0.80$ styled in green (`95% High`).
  - Scores between $0.50$ and $0.79$ styled in amber (`74% Check`).
  - Scores $< 0.50$ styled in red (`Low`).
- **Human Verification**: Editable title, price amount, currency dropdown (NGN, USD, GBP, EUR, KES, GHS), and description.
- **Null Price Handling**: Toggle checkbox for "Ask for price (null)" properly disables numerical price input and switches storefront CTA to "Ask for Price on WhatsApp".

### D. Storefront Presentation & Mobile Performance
- **Viewport**: Verified layout at 360px and 375px mobile widths.
- **Tap Targets**: All buttons meet or exceed the 48px tap target guideline.
- **Layout Shift**: Image wrappers have explicit `aspect-ratio: 4 / 3` preventing Cumulative Layout Shift (CLS = 0).
- **WhatsApp Links**: Verified `https://wa.me/<phone>?text=<encoded_string>` generation with correct product name and formatted currency amounts.
- **Sticky Contact**: Verified bottom-right floating action button stays accessible throughout the page scroll.

### E. Git-Free Packaging & Export
- **ZIP Bundler**: Tested vendored `JSZip v3.10.1` generating `ContentSmith-store.zip` containing `index.html`, `storefront.css`, `products.json`, binary JPEG images, and `DEPLOY_GUIDE.md`.
- **Single-File HTML**: Verified standalone `.html` exporter with base64 data URIs and inline CSS for zero-folder distribution.

---

## 3. Fallback Extraction Verification
- Verified Fallback Modal sampling tool extracting filmstrip frames at customizable intervals (1.0s, 1.5s, 2.0s, 3.0s).
- Verified copyable Per-Frame prompt for single-frame re-extractions in Google AI Studio.
