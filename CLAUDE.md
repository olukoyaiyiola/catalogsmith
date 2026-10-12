# CatalogSmith: Context & Instructions for Claude

This repository contains **CatalogSmith**, a phone-first tool that turns a vendor's product video into an instantly hosted WhatsApp storefront, PDF, and partner data feeds. Vendors are mobile-first WhatsApp/Instagram merchants in Nigeria and similar markets.

> 📖 **Full Architectural Reference**: For an exhaustive technical breakdown of every pipeline, design token, data schema, and modal, see [APPROACH.md](APPROACH.md).

---

## Quick Reference for Claude

### Architecture: Static Front End + Plain Node Serverless Functions (No Bundler)
* **Static Studio & Template**: 100% vanilla HTML, CSS, and JavaScript. No build step, no bundler (no Vite/Webpack), no frontend framework.
* **Serverless Backend (`/api/`)**: Minimal Node.js Vercel Functions for built-in hosting, database catalog storage (Neon Postgres), direct-to-Blob photo upload authorization, and server-held Gemini AI proxy (`/api/extract`).
* **Shared Logic (`/shared/`)**: Pure functions (e.g., `render-storefront.js`) imported both as ES modules in the browser studio simulator and in Vercel server functions, guaranteeing live preview matches the published site.

### Critical Development Rules for Claude
1. **New Architectural Mandate**: Static front end, plain Node serverless functions, no bundler. Do not introduce frontend build tools.
2. **Minimal Dependencies**: Always ask before installing or downloading any npm package or CLI. Expected packages are kept to the absolute minimum (`@vercel/blob`, `@neondatabase/serverless`).
3. **Security First**: Never hardcode API keys or secrets in the repository. All `.env*` files are strictly gitignored. Gemini keys on the client are in-memory by default (with optional user-controlled device storage) until Phase H server proxy.
4. **Hosting & Quotas Constraints**:
   - Vercel function body limit is ~4.5MB: photos must upload directly to Vercel Blob from the client, NEVER through a function body.
   - Filesystem writes in serverless are ephemeral: no local SQLite or file storage.
5. **State Mutation Discipline**:
   * Global studio state is maintained in `state` inside `studio.js`.
   * After any change to `state.products` or settings, always invoke:
     ```javascript
     syncFormFields();
     renderReviewList();
     debouncedSaveState();
     updateLivePreview();
     ```
6. **Mobile & Ergonomics (Phone First)**:
   * Target viewports: strictly verified at `360px` and `414px`.
   * All touch targets must be at least `48px`.
   * Maintain `aspect-ratio: 4 / 3` on product images to ensure CLS = 0.
   * No horizontal scroll (`document.documentElement.scrollWidth <= window.innerWidth`). Dev check: `window.checkNoHorizontalScroll()`.
7. **Handling Missing Prices**:
   * If an item lacks a stated price, set `price.amount = null`. Never invent prices.
   * The UI will automatically render "Ask for price on WhatsApp" and adjust pre-filled chat messages.
8. **Image Compression & Anti-Hotlinking**:
   * Always save captured frames as JPEG (`image/jpeg`, quality `0.80 - 0.85`) with dimension clamping (`max-width: 960px`).
   * Stock photo search via `/api/search-images` (Openverse commercial CC0/CC-BY, Pexels, Pixabay, Unsplash; Bing retired Aug 2025).
   * Never hotlink external stock photos: `/api/import-image` fetches and stores copies in Blob/local storage.
   * Track image provenance: `image_origin` (`own_video_frame`, `own_upload`, `stock_search`, `placeholder_art`). Stock search images excluded from marketplace exports by default.

### Local Testing
```bash
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8080
# or (when Vercel CLI is authorized)
vercel dev
```
