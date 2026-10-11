/**
 * CatalogSmith - Serverless Image Search API
 * Endpoint: /api/search-images?q=<query>&limit=12
 * 
 * Supports:
 * 1. Microsoft Bing Image Search API (if BING_IMAGE_SEARCH_KEY or AZURE_BING_KEY is configured)
 * 2. Unsplash API (if UNSPLASH_ACCESS_KEY is configured)
 * 3. Wikimedia Commons Open Media API (zero-config public domain & CC fallback)
 */

export default async function handler(req, res) {
  // Support both Web Request and Node IncomingMessage
  let query = '';
  let limit = 12;

  if (req.query) {
    query = req.query.q || req.query.query || '';
    if (req.query.limit) limit = Math.min(24, Math.max(1, parseInt(req.query.limit, 10)));
  } else if (req.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      query = url.searchParams.get('q') || url.searchParams.get('query') || '';
      const l = url.searchParams.get('limit');
      if (l) limit = Math.min(24, Math.max(1, parseInt(l, 10)));
    } catch (_) {}
  }

  // CORS and Headers
  const setHeaders = (r) => {
    if (r.setHeader) {
      r.setHeader('Access-Control-Allow-Origin', '*');
      r.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      r.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      r.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    }
  };
  setHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Validate input
  const cleanQuery = String(query || '').trim().slice(0, 100);
  if (!cleanQuery) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "Missing required search query parameter 'q'" }));
    return;
  }

  try {
    const bingKey = process.env.BING_IMAGE_SEARCH_KEY || process.env.BING_SEARCH_API_KEY || process.env.AZURE_BING_KEY;
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

    // 1. Bing Image Search Integration
    if (bingKey) {
      const bingUrl = `https://api.bing.microsoft.com/v7.0/images/search?q=${encodeURIComponent(cleanQuery)}&count=${limit}&safeSearch=Moderate`;
      const resp = await fetch(bingUrl, {
        headers: { 'Ocp-Apim-Subscription-Key': bingKey }
      });
      if (resp.ok) {
        const data = await resp.json();
        const results = (data.value || []).map((item, idx) => ({
          id: item.imageId || `bing_${idx}`,
          title: item.name || cleanQuery,
          imageUrl: item.contentUrl,
          thumbnailUrl: item.thumbnailUrl || item.contentUrl,
          sourceUrl: item.hostPageUrl || item.contentUrl,
          publisher: item.hostPageDomain || 'Bing Search',
          dimensions: `${item.width || 0} × ${item.height || 0}`,
          attribution: `Source: ${item.hostPageDomain || 'Bing Image Search'}`
        }));

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          provider: 'bing',
          query: cleanQuery,
          total: results.length,
          results
        }));
        return;
      }
    }

    // 2. Unsplash API Integration
    if (unsplashKey) {
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=${limit}&orientation=squarish`;
      const resp = await fetch(unsplashUrl, {
        headers: { 'Authorization': `Client-ID ${unsplashKey}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        const results = (data.results || []).map(item => ({
          id: item.id,
          title: item.description || item.alt_description || cleanQuery,
          imageUrl: item.urls.regular,
          thumbnailUrl: item.urls.small,
          sourceUrl: item.links.html,
          publisher: 'Unsplash',
          dimensions: `${item.width} × ${item.height}`,
          attribution: `Photo by ${item.user.name} on Unsplash`
        }));

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          provider: 'unsplash',
          query: cleanQuery,
          total: results.length,
          results
        }));
        return;
      }
    }

    // 3. Wikimedia Commons Open Media API (Live zero-credentials web provider)
    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=400&format=json&origin=*`;
    const wikiResp = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'CatalogSmith-ImageSearch/1.0 (catalogsmith; small business storefront builder)' }
    });

    if (wikiResp.ok) {
      const data = await wikiResp.json();
      const pages = data.query && data.query.pages ? Object.values(data.query.pages) : [];
      const results = pages
        .filter(p => p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url)
        .map(p => {
          const info = p.imageinfo[0];
          const meta = info.extmetadata || {};
          const title = (p.title || cleanQuery).replace(/^File:/i, '').replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const license = (meta.LicenseShortName && meta.LicenseShortName.value) || 'Creative Commons';
          const author = (meta.Artist && meta.Artist.value) ? meta.Artist.value.replace(/<[^>]*>?/gm, '') : 'Wikimedia Commons';

          return {
            id: String(p.pageid),
            title: title.slice(0, 70),
            imageUrl: info.url,
            thumbnailUrl: info.thumburl || info.url,
            sourceUrl: info.descriptionurl || info.url,
            publisher: 'Wikimedia Commons',
            dimensions: `${info.width || 0} × ${info.height || 0}`,
            attribution: `${author} (${license})`
          };
        });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        provider: 'wikimedia',
        query: cleanQuery,
        total: results.length,
        results
      }));
      return;
    }

    // Fallback if Wikimedia fails
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Image search provider returned error', results: [] }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to query image search provider', message: err.message, results: [] }));
  }
}
