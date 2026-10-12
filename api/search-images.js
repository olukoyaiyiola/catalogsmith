/**
 * ContentSmith - Multi-Provider Image Search Engine
 * Endpoint: /api/search-images?q=<query>&limit=12&commercial_only=1&debug=1
 * 
 * Complies with ContentSmith Phase I:
 * 1. Openverse API (Zero-config Creative Commons & Public Domain with commercial filter)
 * 2. Pexels API (Optional PEXELS_API_KEY, 200 req/hr free tier, commercial use OK)
 * 3. Pixabay API (Optional PIXABAY_API_KEY, 100 req/min free tier, commercial use OK)
 * 4. Unsplash API (Optional UNSPLASH_ACCESS_KEY, 50 req/hr demo, commercial use OK with attribution)
 * 5. Wikimedia Commons (Zero-config media repository, last-resort fallback)
 * 
 * Note: Microsoft retired Bing Search APIs on August 11, 2025; Bing branch has been removed.
 */

// Simple in-memory sliding rate limiter per IP (resets on serverless cold starts)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests / min / IP

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, record);
    return false;
  }
  record.count++;
  rateLimitMap.set(ip, record);
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

// Clean noisy search queries (strip prices, sizes, and e-commerce noise)
function cleanSearchQuery(rawQuery) {
  let q = String(rawQuery || '').trim();
  // Strip Nigerian naira prices, dollar prices, amounts like 12k, ₦15000, $45
  q = q.replace(/[₦$€£]\s*[\d,]+(\.\d+)?/gi, '');
  q = q.replace(/\b\d+(\.\d+)?\s*(k|thousand|naira|usd)\b/gi, '');
  q = q.replace(/\b\d{4,}\b/g, ''); // 4+ digit standalone prices
  // Strip sizing noise
  q = q.replace(/\b(size\s*\d+|xl|xxl|xxxl|small|medium|large)\b/gi, '');
  // Strip promotional chatter and query-diluting generic terms
  q = q.replace(/\b(original|authentic|cheap|promo|affordable|discount|best quality|dm for price|order now|product|photo|picture|images?|for\s+sale|buy|online)\b/gi, '');
  // Strip punctuation noise
  q = q.replace(/[&+,/\\()]+/g, ' ');
  // Normalize whitespace
  q = q.replace(/\s+/g, ' ').trim();
  return q || rawQuery.trim();
}

// Extract generic root noun fallback if a complex query returns 0 results
function getGenericNounFallback(query) {
  const words = query.toLowerCase().split(/\s+/);
  const commonNouns = ['bag', 'handbag', 'tote', 'shoe', 'shoes', 'sneakers', 'dress', 'gown', 'fabric', 'ankara', 'lace', 'wig', 'perfume', 'watch', 'phone', 'case', 'jewel', 'necklace', 'earring', 'shirt', 'jacket', 'trousers', 'suit'];
  for (let i = words.length - 1; i >= 0; i--) {
    const w = words[i].replace(/[^\w]/g, '');
    if (commonNouns.includes(w)) return w;
  }
  return words[words.length - 1] || query;
}

export default async function handler(req, res) {
  const startTime = Date.now();
  let query = '';
  let limit = 12;
  let page = 1;
  let isDebug = false;
  let commercialOnly = true;

  if (req.query) {
    query = req.query.q || req.query.query || '';
    if (req.query.limit) limit = Math.min(24, Math.max(1, parseInt(req.query.limit, 10)));
    if (req.query.page) page = Math.max(1, parseInt(req.query.page, 10));
    isDebug = req.query.debug === '1' || req.query.debug === 'true';
    if (req.query.commercial_only === '0') commercialOnly = false;
  } else if (req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      query = parsedUrl.searchParams.get('q') || parsedUrl.searchParams.get('query') || '';
      const l = parsedUrl.searchParams.get('limit');
      if (l) limit = Math.min(24, Math.max(1, parseInt(l, 10)));
      const p = parsedUrl.searchParams.get('page');
      if (p) page = Math.max(1, parseInt(p, 10));
      isDebug = parsedUrl.searchParams.get('debug') === '1';
      if (parsedUrl.searchParams.get('commercial_only') === '0') commercialOnly = false;
    } catch (_) {}
  }

  // CORS & Security Headers
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Rate Limiting
  const clientIp = (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local';
  if (isRateLimited(clientIp)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment before searching again.', results: [] }));
    return;
  }

  const cleanQuery = cleanSearchQuery(query).slice(0, 80);
  if (!cleanQuery) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "Missing required search query parameter 'q'", results: [] }));
    return;
  }

  const diagnostics = [];

  // Helper to safely execute a provider with timeout
  async function runProvider(name, isConfigured, fn) {
    if (!isConfigured) {
      diagnostics.push({ provider: name, configured: false, status: 'skipped', result_count: 0, duration_ms: 0 });
      return [];
    }
    const t0 = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const results = await fn(controller.signal);
      clearTimeout(timeoutId);
      const elapsed = Date.now() - t0;
      diagnostics.push({ provider: name, configured: true, status: 'ok', result_count: results.length, duration_ms: elapsed });
      return results;
    } catch (err) {
      const elapsed = Date.now() - t0;
      diagnostics.push({ provider: name, configured: true, status: 'error', error: err.message, result_count: 0, duration_ms: elapsed });
      return [];
    }
  }

  try {
    // 1. OPENVERSE (Zero-config, Commercial Creative Commons & Public Domain)
    const openversePromise = runProvider('openverse', true, async (signal) => {
      const filter = commercialOnly ? '&license_type=commercial' : '';
      const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(cleanQuery)}${filter}&page_size=${limit}&page=${page}`;
      const resp = await fetch(url, {
        signal,
        headers: { 'User-Agent': 'ContentSmith-ImageSearch/1.0 (ContentSmith; phone-first storefront tool)' }
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      const data = await resp.json();
      const items = data.results || [];
      return items.map(item => ({
        id: `ov_${item.id}`,
        thumb_url: item.thumbnail || item.url,
        image_url: item.url,
        source_url: item.foreign_landing_url || item.url,
        provider: 'openverse',
        title: item.title || cleanQuery,
        author: item.creator || 'Openverse Contributor',
        license: (item.license || 'CC').toUpperCase(),
        license_url: item.license_url || 'https://creativecommons.org/',
        commercial_ok: true,
        width: item.width || 0,
        height: item.height || 0,
        attribution: `${item.creator ? `By ${item.creator} • ` : ''}${item.license ? item.license.toUpperCase() : 'Creative Commons'} via Openverse`
      }));
    });

    // 2. PEXELS (Optional key, Commercial use OK)
    const pexelsKey = process.env.PEXELS_API_KEY;
    const pexelsPromise = runProvider('pexels', Boolean(pexelsKey), async (signal) => {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(cleanQuery)}&per_page=${limit}&orientation=landscape&page=${page}`;
      const resp = await fetch(url, {
        signal,
        headers: { 'Authorization': pexelsKey }
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      return (data.photos || []).map(p => ({
        id: `pex_${p.id}`,
        thumb_url: p.src.medium || p.src.small,
        image_url: p.src.large || p.src.original,
        source_url: p.url,
        provider: 'pexels',
        title: p.alt || cleanQuery,
        author: p.photographer || 'Pexels Creator',
        license: 'Pexels License (Commercial OK)',
        license_url: 'https://www.pexels.com/license/',
        commercial_ok: true,
        width: p.width || 0,
        height: p.height || 0,
        attribution: `Photo by ${p.photographer} on Pexels`
      }));
    });

    // 3. PIXABAY (Optional key, Commercial use OK)
    const pixabayKey = process.env.PIXABAY_API_KEY;
    const pixabayPromise = runProvider('pixabay', Boolean(pixabayKey), async (signal) => {
      const url = `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(cleanQuery)}&image_type=photo&per_page=${limit}&safesearch=true&page=${page}`;
      const resp = await fetch(url, { signal });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      return (data.hits || []).map(h => ({
        id: `pix_${h.id}`,
        thumb_url: h.webformatURL || h.previewURL,
        image_url: h.largeImageURL || h.webformatURL,
        source_url: h.pageURL,
        provider: 'pixabay',
        title: h.tags || cleanQuery,
        author: h.user || 'Pixabay Creator',
        license: 'Pixabay License (Commercial OK)',
        license_url: 'https://pixabay.com/service/license-summary/',
        commercial_ok: true,
        width: h.imageWidth || 0,
        height: h.imageHeight || 0,
        attribution: `Image by ${h.user} on Pixabay`
      }));
    });

    // 4. UNSPLASH (Optional key, Commercial use OK with attribution)
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    const unsplashPromise = runProvider('unsplash', Boolean(unsplashKey), async (signal) => {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=${limit}&page=${page}&orientation=squarish`;
      const resp = await fetch(url, {
        signal,
        headers: { 'Authorization': `Client-ID ${unsplashKey}` }
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      return (data.results || []).map(u => ({
        id: `uns_${u.id}`,
        thumb_url: u.urls.small || u.urls.thumb,
        image_url: u.urls.regular,
        source_url: u.links.html,
        provider: 'unsplash',
        title: u.description || u.alt_description || cleanQuery,
        author: u.user.name || 'Unsplash Photographer',
        license: 'Unsplash License (Commercial OK)',
        license_url: 'https://unsplash.com/license',
        commercial_ok: true,
        width: u.width || 0,
        height: u.height || 0,
        attribution: `Photo by ${u.user.name} on Unsplash`
      }));
    });

    // Run primary providers in parallel
    const [openverseResults, pexelsResults, pixabayResults, unsplashResults] = await Promise.all([
      openversePromise,
      pexelsPromise,
      pixabayPromise,
      unsplashPromise
    ]);

    let combined = [
      ...openverseResults,
      ...pexelsResults,
      ...pixabayResults,
      ...unsplashResults
    ];

    // 5. WIKIMEDIA COMMONS FALLBACK (Zero-config, executed only if primary providers returned < 3 results)
    if (combined.length < 3) {
      const wikiResults = await runProvider('wikimedia', true, async (signal) => {
        const gsroffset = (page - 1) * limit;
        const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrnamespace=6&gsrlimit=${limit}&gsroffset=${gsroffset}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=400&format=json&origin=*`;
        const resp = await fetch(wikiUrl, {
          signal,
          headers: { 'User-Agent': 'ContentSmith-ImageSearch/1.0 (ContentSmith; phone-first storefront tool)' }
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        const pages = data.query && data.query.pages ? Object.values(data.query.pages) : [];
        return pages
          .filter(p => p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url)
          .map(p => {
            const info = p.imageinfo[0];
            const meta = info.extmetadata || {};
            const title = (p.title || cleanQuery).replace(/^File:/i, '').replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            const lic = (meta.LicenseShortName && meta.LicenseShortName.value) || 'Creative Commons';
            const author = (meta.Artist && meta.Artist.value) ? meta.Artist.value.replace(/<[^>]*>?/gm, '') : 'Wikimedia Commons';
            return {
              id: `wm_${p.pageid}`,
              thumb_url: info.thumburl || info.url,
              image_url: info.url,
              source_url: info.descriptionurl || info.url,
              provider: 'wikimedia',
              title: title.slice(0, 70),
              author: author,
              license: lic,
              license_url: 'https://commons.wikimedia.org/',
              commercial_ok: !lic.toLowerCase().includes('noncommercial'),
              width: info.width || 0,
              height: info.height || 0,
              attribution: `${author} (${lic}) via Wikimedia Commons`
            };
          });
      });
      combined = combined.concat(wikiResults);
    }

    // Filter commercial-ok if requested
    if (commercialOnly) {
      combined = combined.filter(item => item.commercial_ok);
    }

    // De-duplicate by image_url or thumb_url
    const seen = new Set();
    const deduplicated = [];
    for (const item of combined) {
      const key = item.image_url || item.thumb_url;
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(item);
      }
    }

    // Suggestions when query is narrow or yields 0 results
    const fallbackNoun = getGenericNounFallback(cleanQuery);
    const suggestions = [];
    if (fallbackNoun && fallbackNoun !== cleanQuery.toLowerCase()) {
      suggestions.push(fallbackNoun);
    }
    const relatedTokens = ['bag', 'dress', 'shoes', 'phone case', 'perfume', 'ankara', 'watch'];
    for (const tok of relatedTokens) {
      if (suggestions.length >= 3) break;
      if (!cleanQuery.toLowerCase().includes(tok)) suggestions.push(tok);
    }

    // Determine primary responding provider
    const primaryProvider = deduplicated.length > 0 ? deduplicated[0].provider : 'none';

    const responsePayload = {
      query: cleanQuery,
      original_query: query,
      page: page,
      total: deduplicated.length,
      commercial_only: commercialOnly,
      primary_provider: primaryProvider,
      suggestions: deduplicated.length === 0 ? suggestions : [],
      results: deduplicated.slice(0, limit)
    };

    if (isDebug) {
      responsePayload.debug = {
        total_time_ms: Date.now() - startTime,
        diagnostics
      };
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(responsePayload));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Image search failed',
      message: err.message,
      results: [],
      debug: isDebug ? { diagnostics, error_detail: err.stack } : undefined
    }));
  }
}
