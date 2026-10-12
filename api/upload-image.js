/**
 * ContentSmith - Serverless Image Upload API
 * Endpoint: POST /api/upload-image
 * Handles direct product image uploads for Vercel Blob or local storage.
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb'
    }
  }
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    let buffer = null;
    let contentType = 'image/jpeg';
    let filename = `prod_${Date.now()}.jpg`;

    const rawContentType = req.headers['content-type'] || '';

    if (rawContentType.includes('application/json')) {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const dataUrl = body.image || body.dataUrl || body.file;
      if (!dataUrl) {
        return res.status(400).json({ error: 'Missing image data URL in payload.' });
      }
      const parts = dataUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) contentType = mimeMatch[1];
      buffer = Buffer.from(parts[1], 'base64');
      if (body.filename) filename = body.filename;
    } else if (rawContentType.includes('multipart/form-data')) {
      // In minimal serverless without formidable/multer, read binary chunks
      // For Vercel Blob direct uploads, clients upload with token or pass base64
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawBody = Buffer.concat(chunks);
      // Fallback extract
      buffer = rawBody;
      contentType = 'image/jpeg';
    } else {
      // Raw binary
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      buffer = Buffer.concat(chunks);
      if (rawContentType.startsWith('image/')) {
        contentType = rawContentType;
      }
    }

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'Empty file buffer received.' });
    }

    // Storage Strategy:
    // If Vercel Blob is configured (BLOB_READ_WRITE_TOKEN), save to Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
        const uniqueName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const blobResult = await put(uniqueName, buffer, {
          access: 'public',
          contentType: contentType
        });
        return res.status(200).json({
          url: blobResult.url,
          provider: 'vercel_blob',
          id: blobResult.pathname,
          bytes: buffer.length
        });
      } catch (blobErr) {
        console.warn('Vercel Blob upload failed:', blobErr.message);
      }
    }

    // Fallback: return optimized data URL or mock URL
    const b64 = buffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${b64}`;
    return res.status(200).json({
      url: dataUrl,
      provider: 'local_serverless',
      id: filename,
      bytes: buffer.length
    });

  } catch (err) {
    console.error('Upload handler error:', err);
    return res.status(500).json({ error: 'Internal upload failure: ' + err.message });
  }
}
