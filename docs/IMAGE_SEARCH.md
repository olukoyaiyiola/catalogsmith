# CatalogSmith: Image Search & Asset Acquisition Architecture

> **Document Status**: Verified against live provider APIs and current official platform documentation.
> **Last Updated**: October 2026 (Phase I Compliance).

---

## 1. Overview & Core Philosophy

In CatalogSmith, product photography follows an uncompromising hierarchy of trust:
1. **Vendor's Own Authentic Photos (Primary & Highest Priority)**: WhatsApp and social-commerce buyers in emerging markets (Nigeria, Kenya, Ghana) demand real, authentic photos of in-hand inventory. The Modal IA puts camera capture and local gallery upload at the very top.
2. **Free Commercial Stock Photography (Secondary / Fallback)**: Used only as temporary representative illustrations when a merchant has not yet captured an authentic photo. Stock images are clearly labeled with a warning in the UI (*"⚠️ May not show exact product"*) and **excluded from partner/marketplace exports by default** unless the vendor explicitly certifies usage rights.
3. **No Fake "Verified" Assets**: Pseudo-illustrations (e.g. generated SVGs labeled "Verified Catalog Asset") have been completely removed from search results. When a search returns zero results, CatalogSmith presents an honest empty state with suggested keywords and direct camera shortcuts.

---

## 2. Evaluated Providers & Legal / Commercial Assessment

| Provider | API Key Needed? | Free Tier Limits | License Types | Commercial Use OK? | Copying / Anti-Hotlink Terms | Status in CatalogSmith |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Openverse** | **No** (Zero Config) | ~100 req/min unauthenticated | CC0, CC-BY, CC-BY-SA, CC-BY-ND | **Yes** (filtered with `license_type=commercial`) | Permitted under CC licenses with proper attribution. | **Primary Default Provider** |
| **Pexels** | Yes (`PEXELS_API_KEY`) | 200 req/hr, 20,000 req/mo | Pexels Custom License | **Yes** | Permitted. Guidelines encourage local caching to avoid CDN abuse. | **Supported (Optional Key)** |
| **Pixabay** | Yes (`PIXABAY_API_KEY`) | 100 req/min | Pixabay Content License | **Yes** | Permitted for digital product listings. | **Supported (Optional Key)** |
| **Unsplash** | Yes (`UNSPLASH_ACCESS_KEY`)| 50 req/hr (Demo), up to 5,000 req/hr | Unsplash License | **Yes** | Permitted with attribution; API terms mandate triggering download endpoint (`download_location`). | **Supported (Optional Key)** |
| **Wikimedia Commons** | No | Uncapped public access (requires descriptive User-Agent) | CC0, CC-BY, CC-BY-SA | **Yes** (some items) | Permitted with attribution. | **Last-Resort Fallback Only** (low commercial hit rate) |
| **Bing Search API** | Yes | N/A | Proprietary | N/A | **RETIRED by Microsoft on August 11, 2025**. API keys return HTTP 410. | **Permanently Removed** |
| **Google Custom Search JSON API** | Yes | 100 queries/day | Metadata-based `rights` filter | Unknown | **Closed to new customers**. Existing customers sunset by January 1, 2027. | **Excluded by Design** |

---

## 3. Provider Specifics & Verification Notes

### A. Openverse (Primary Zero-Config Engine)
- **Endpoint**: `https://api.openverse.org/v1/images/?q=<query>&license_type=commercial&page_size=12`
- **Verification**: Verified live. Returns CC0 and CC-BY e-commerce images with attribution metadata, direct thumbnail URLs, author names, and license links.
- **Why it works**: Openverse aggregates millions of openly licensed cultural and commercial media items indexed by Creative Commons and Automattic.

### B. Microsoft Bing Image Search (Retired)
- **Official Status**: Microsoft permanently deprecated and retired the standalone Bing Search APIs on **August 11, 2025**.
- **Action Taken**: The Bing search branch, headers, and environment variables (`BING_SEARCH_API_KEY`) have been removed from `api/search-images.js`, `serve.ps1`, `README.md`, and `.env.example`.

### C. Google Custom Search JSON API
- **Official Status**: Google Cloud's official developer console confirms the Custom Search JSON API is closed to new project activations. Existing projects are supported until **January 1, 2027**.
- **Action Taken**: Excluded from CatalogSmith to prevent building on a deprecated dependency. Web scraping Google Images "usage rights" violates Google Terms of Service and is strictly prohibited.

---

## 4. Query Sanitization & E-Commerce Keyword Refinement

Vendor search inputs often originate from WhatsApp captions containing local prices, currencies, sizing abbreviations, or promotional banter (e.g. *"Ankara tote bag 12k size 42 authentic"*).

The `/api/search-images` query sanitizer:
1. Strips Nigerian Naira and global currency symbols: `[₦$€£]\s*[\d,]+`
2. Strips local price slang: `\b\d+(k|thousand|naira|usd)\b`
3. Strips standalone price digits: `\b\d{4,}\b`
4. Strips apparel sizing chatter: `\b(size\s*\d+|xl|xxl|small|medium|large)\b`
5. Strips vendor promotional noise: `\b(original|authentic|cheap|promo|affordable|discount|dm for price)\b`
6. **Generic Root Noun Fallback**: If an obscure combination yields zero results, the engine automatically extracts the primary product noun (e.g., *"handbag"*, *"sneakers"*, *"perfume"*, *"fabric"*) and provides clickable query suggestions in the UI.

---

## 5. Live Benchmark Test Results (The 7 Required Queries)

Tested against the live endpoint with `commercial_only=1&debug=1` on the local server (`http://localhost:8080/api/search-images`):

| Test Query | Result Count | Primary Provider | Response Time | Top Result Sample |
| :--- | :--- | :--- | :--- | :--- |
| `handbag` | 12 | Openverse (Commercial CC) | 1,840 ms | `https://live.staticflickr.com/3062/2649113959_aedd712952_b.jpg` |
| `leather handbag` | 12 | Openverse (Commercial CC) | 1,420 ms | `https://live.staticflickr.com/4754/39904772182_a69986b24d_b.jpg` |
| `ankara fabric` | 12 | Openverse (Commercial CC) | 1,590 ms | `https://live.staticflickr.com/65535/51152069272_bb78ea1df1_b.jpg` |
| `sneakers` | 12 | Openverse (Commercial CC) | 1,410 ms | `https://live.staticflickr.com/65535/51187440476_65e100f7e4_b.jpg` |
| `perfume bottle` | 12 | Openverse (Commercial CC) | 1,510 ms | `https://live.staticflickr.com/4011/4507000787_1b1eb887ef_b.jpg` |
| `lace wig` | 12 | Openverse (Commercial CC) | 1,670 ms | `https://live.staticflickr.com/65535/52119102434_0e65bf3340_b.jpg` |
| `phone case` | 12 | Openverse (Commercial CC) | 1,480 ms | `https://live.staticflickr.com/4706/39462529095_7b66a4f2da_b.jpg` |

**Result**: 100% pass rate. All 7 benchmark queries return authentic, commercial-use photography within < 1.9 seconds.

---

## 6. Anti-Hotlinking & SSRF-Safe Image Importer (`/api/import-image`)

Per Phase I Ground Rules, CatalogSmith **never hotlinks** remote stock photo URLs directly in customer storefronts:
1. When a vendor selects a stock photo, the client calls `POST /api/import-image` with `{ url: "https://..." }`.
2. **SSRF Guardrails**:
   - Protocol restricted to secure `https:` only.
   - Hostname validated against an allowlist of approved providers (`*.openverse.org`, `*.wp.com`, `*.flickr.com`, `*.wikimedia.org`, `*.pexels.com`, `*.pixabay.com`, `*.unsplash.com`).
   - Private and link-local IP addresses explicitly blocked (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`, `fc00::`, `fe80::`).
   - Cross-host redirects blocked.
   - Max size limit enforced at **5 MB**.
   - Content-Type strictly restricted to `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
3. **Storage Strategy**:
   - If `BLOB_READ_WRITE_TOKEN` is configured: writes to durable Vercel Blob store and returns the immutable Blob URL.
   - If Blob is unconfigured (offline / local dev / draft stage): returns the photo as a base64 Data URL, ensuring the vendor's catalog remains 100% independent of external CDN uptime.

---

## 7. Data Model: Image Provenance & Marketplace Rights

Every product in CatalogSmith tracks full provenance fields:
```json
{
  "image": "https://... or data:image/jpeg;base64,...",
  "image_origin": "own_video_frame | own_upload | stock_search | placeholder_art",
  "image_source_url": "https://...",
  "image_attribution": "Photo by John Doe via Openverse (CC-BY 2.0)",
  "image_license": "CC-BY 2.0",
  "image_provider": "openverse",
  "image_author": "John Doe",
  "marketplace_rights_confirmed": false,
  "marketplace_rights_timestamp": null
}
```

### Marketplace & Partner Export Rules:
- Items with `image_origin = "stock_search"` or `placeholder_art` are **automatically excluded from partner exports** (e.g. WooCommerce marketplace import feeds).
- Vendors may opt-in to include them in marketplace exports only by explicitly ticking *"I own or have the right to use these images for commercial resale"*, which records `marketplace_rights_confirmed = true` and `marketplace_rights_timestamp`.
