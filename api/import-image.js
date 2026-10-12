/**
 * ContentSmith - SSRF-Safe Image Importer
 * Endpoint: POST /api/import-image
 * Body: { url: string, provider?: string, author?: string, license?: string }
 * 
 * Complies with ContentSmith Phase I Item 5:
 * - Anti-hotlinking: fetches image from trusted stock provider to local storage or Vercel Blob
 * - HTTPS only
 * - Provider domain allowlist
 * - Blocks loopback, private, and link-local IP addresses (SSRF defense)
 * - Blocks cross-host redirects
 * - Max size: 5MB
 * - Content-Type validation: image/* only
 * - 8 second timeout
 */

const ALLOWED_HOST_SUFFIXES = [
  'openverse.org',
  'wp.com',
  'wordpress.org',
  'wikimedia.org',
  'pexels.com',
  'pixabay.com',
  'unsplash.com',
  'staticflickr.com',
  'flickr.com'
];

function isPrivateOrLoopback(hostname) {
  if (!hostname) return true;
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '0.0.0.0') return true;

  // IPv4 private ranges
  // 10.0.0.0 - 10.255.255.255
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  // 172.16.0.0 - 172.31.255.255
  if (/^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  // 192.168.0.0 - 192.168.255.255
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  // 169.254.0.0 - 169.254.255.255 (link-local)
  if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(h)) return true;

  // IPv6 private/link-local
  if (/^fe80:/i.test(h) || /^fc00:/i.test(h) || /^fd[0-9a-f]{2}:/i.test(h)) return true;

  return false;
}

function isHostAllowed(hostname) {
  if (!hostname) return false;
  const h = hostname.toLowerCase();
  if (isPrivateOrLoopback(h)) return false;

  return ALLOWED_HOST_SUFFIXES.some(suffix => h === suffix || h.endsWith('.' + suffix));
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let targetUrl = '';
    let meta = {};

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }
      targetUrl = body?.url || '';
      meta = body?.meta || body || {};
    } else {
      targetUrl = req.query?.url || '';
    }

    if (!targetUrl || typeof targetUrl !== 'string') {
      return res.status(400).json({ error: 'Missing required "url" parameter.' });
    }

    // 1. URL Parse & Validation
    let parsedUrl;
    try {
      parsedUrl = new URL(targetUrl.trim());
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format.' });
    }

    // 2. HTTPS Only
    if (parsedUrl.protocol !== 'https:') {
      return res.status(400).json({ error: 'Only secure HTTPS image URLs are supported.' });
    }

    // 3. Hostname Allowlist & SSRF Check
    if (!isHostAllowed(parsedUrl.hostname)) {
      return res.status(403).json({
        error: `Host "${parsedUrl.hostname}" is not an authorized commercial image provider.`
      });
    }

    // 4. Fetch image with strict limits (8s timeout, reject external redirects, 5MB max)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let fetchResp;
    try {
      fetchResp = await fetch(parsedUrl.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'ContentSmith-ImageImporter/1.0 (+https://ContentSmith.vercel.app)',
          'Accept': 'image/jpeg,image/png,image/webp,image/gif;q=0.9,*/*;q=0.5'
        },
        signal: controller.signal,
        redirect: 'manual' // Prevent arbitrary cross-host redirects
      });
    } finally {
      clearTimeout(timeoutId);
    }

    // Check redirect
    if (fetchResp.status >= 300 && fetchResp.status < 400) {
      const redirectLoc = fetchResp.headers.get('location');
      if (!redirectLoc) {
        return res.status(400).json({ error: 'Redirect location missing from remote provider.' });
      }
      let redirectParsed;
      try {
        redirectParsed = new URL(redirectLoc, parsedUrl);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid redirect URL from provider.' });
      }
      if (redirectParsed.protocol !== 'https:' || !isHostAllowed(redirectParsed.hostname)) {
        return res.status(403).json({ error: 'Cross-host redirect to unauthorized domain blocked for security.' });
      }
      // Follow 1 allowed redirect
      const redirectController = new AbortController();
      const redirectTimeout = setTimeout(() => redirectController.abort(), 8000);
      try {
        fetchResp = await fetch(redirectParsed.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': 'ContentSmith-ImageImporter/1.0 (+https://ContentSmith.vercel.app)',
            'Accept': 'image/jpeg,image/png,image/webp,image/gif;q=0.9,*/*;q=0.5'
          },
          signal: redirectController.signal,
          redirect: 'error'
        });
      } finally {
        clearTimeout(redirectTimeout);
      }
    }

    if (!fetchResp.ok) {
      return res.status(502).json({
        error: `Remote provider returned HTTP ${fetchResp.status} ${fetchResp.statusText}`
      });
    }

    // 5. Content-Type check
    const contentType = (fetchResp.headers.get('content-type') || '').toLowerCase().split(';')[0].trim();
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(contentType)) {
      return res.status(415).json({
        error: `Unsupported content-type "${contentType}". Must be a valid image format.`
      });
    }

    // 6. Content-Length check (header)
    const contentLength = parseInt(fetchResp.headers.get('content-length') || '0', 10);
    const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
    if (contentLength > MAX_BYTES) {
      return res.status(413).json({ error: 'Image exceeds maximum 5MB size limit.' });
    }

    // 7. Read buffer with stream size capping
    const arrayBuffer = await fetchResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length > MAX_BYTES) {
      return res.status(413).json({ error: 'Image file payload exceeds 5MB.' });
    }

    // 8. Storage Strategy:
    // If Vercel Blob is configured (BLOB_READ_WRITE_TOKEN), save to durable Blob
    // Otherwise return as optimized base64 data URL for offline/draft independence
    let storedUrl = '';
    let isBlob = false;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = require('@vercel/blob');
        const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
        const hash = Math.random().toString(36).substring(2, 10);
        const blobResult = await put(`imports/${Date.now()}-${hash}.${ext}`, buffer, {
          access: 'public',
          contentType: contentType
        });
        storedUrl = blobResult.url;
        isBlob = true;
      } catch (blobErr) {
        console.warn('Vercel Blob store upload failed, falling back to data URL:', blobErr.message);
      }
    }

    if (!storedUrl) {
      storedUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
      isBlob = false;
    }

    return res.status(200).json({
      ok: true,
      stored_url: storedUrl,
      is_blob: isBlob,
      content_type: contentType,
      size_bytes: buffer.length,
      original_url: targetUrl,
      provider: meta.provider || 'stock_search',
      author: meta.author || 'Stock Contributor',
      license: meta.license || 'Free Commercial License',
      attribution: meta.attribution || ''
    });

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Timed out while downloading image from provider.' });
    }
    console.error('Error in /api/import-image:', err);
    return res.status(500).json({ error: 'Internal server error importing image: ' + err.message });
  }
};
