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

  // Read Supabase environment variables configured in Vercel
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  const supabaseBucket = (process.env.SUPABASE_BUCKET || process.env.SUPABASE_BUCKET_NAME || 'catalog-images').trim();

  // GET: Return server environment configuration status to frontend
  if (req.method === 'GET') {
    const hasSupabase = Boolean(supabaseUrl && supabaseKey);
    const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

    return res.status(200).json({
      configured: hasSupabase || hasBlob,
      provider: hasSupabase ? 'supabase' : (hasBlob ? 'vercel_blob' : 'local'),
      bucket: hasSupabase ? supabaseBucket : null,
      source: hasSupabase ? 'vercel_env' : (hasBlob ? 'vercel_blob_env' : 'none'),
      details: hasSupabase
        ? `Supabase Storage (Bucket: ${supabaseBucket}) active via Vercel environment variables.`
        : (hasBlob ? 'Vercel Blob active via BLOB_READ_WRITE_TOKEN.' : 'No cloud storage environment variables detected.')
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
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
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      buffer = Buffer.concat(chunks);
      contentType = 'image/jpeg';
    } else {
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

    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';

    // 1. Supabase Storage via Vercel Environment Variables
    if (supabaseUrl && supabaseKey) {
      try {
        const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const endpoint = `${supabaseUrl}/storage/v1/object/${encodeURIComponent(supabaseBucket)}/${encodeURIComponent(cleanName)}`;

        const uploadRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': contentType,
            'x-upsert': 'true'
          },
          body: buffer
        });

        if (uploadRes.ok) {
          const publicUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(supabaseBucket)}/${encodeURIComponent(cleanName)}`;
          return res.status(200).json({
            ok: true,
            url: publicUrl,
            provider: 'supabase',
            bucket: supabaseBucket,
            id: cleanName,
            bytes: buffer.length
          });
        } else {
          const errText = await uploadRes.text();
          console.warn('Supabase storage upload failed:', errText);
        }
      } catch (supErr) {
        console.warn('Supabase upload exception:', supErr.message);
      }
    }

    // 2. Vercel Blob via BLOB_READ_WRITE_TOKEN
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const uniqueName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const blobResult = await put(uniqueName, buffer, {
          access: 'public',
          contentType: contentType
        });
        return res.status(200).json({
          ok: true,
          url: blobResult.url,
          provider: 'vercel_blob',
          id: blobResult.pathname,
          bytes: buffer.length
        });
      } catch (blobErr) {
        console.warn('Vercel Blob upload failed:', blobErr.message);
      }
    }

    // 3. Fallback: optimized data URL
    const b64 = buffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${b64}`;
    return res.status(200).json({
      ok: true,
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
