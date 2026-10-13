/**
 * ContentSmith - Serverless Gemini AI Video Catalog Extraction API
 * Endpoint: /api/gemini-extract
 * Supports:
 * - GET: Returns status of server-side Gemini configuration
 * - POST: Analyzes video frames/keyframe parts and returns structured catalog JSON
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb'
    }
  }
};

const DEFAULT_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash'
];

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-goog-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_KEY ||
    ''
  ).trim();

  // GET: Health & Configuration check
  if (req.method === 'GET') {
    return res.status(200).json({
      configured: Boolean(apiKey),
      provider: 'google-gemini',
      defaultModel: 'gemini-3.1-flash-lite',
      activeModels: DEFAULT_MODELS,
      message: apiKey
        ? 'Gemini AI serverless environment variable is active and ready.'
        : 'GEMINI_API_KEY environment variable is not configured in Vercel.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
  }

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in Vercel environment variables. Please add GEMINI_API_KEY in your Vercel project settings.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    let parts = body.parts || [];
    const requestedModel = body.model || 'gemini-3.1-flash-lite';

    // If client sent raw frames instead of parts, wrap them into Gemini parts
    if (!parts.length && Array.isArray(body.frames) && body.frames.length > 0) {
      if (body.prompt) {
        parts.push({ text: body.prompt });
      }
      body.frames.forEach((f, idx) => {
        parts.push({ text: `[Video Frame #${idx + 1} at timestamp ${f.timestamp || idx}s]:` });
        const b64 = f.data ? f.data.replace(/^data:image\/\w+;base64,/, '') : '';
        if (b64) {
          parts.push({
            inlineData: {
              mimeType: f.mimeType || 'image/jpeg',
              data: b64
            }
          });
        }
      });
    }

    if (!parts.length) {
      return res.status(400).json({ error: 'Missing parts or frames payload for analysis' });
    }

    // Prioritize requested model, followed by fallback list
    const candidateModels = [...new Set([requestedModel, ...DEFAULT_MODELS])];

    let lastError = null;
    let successfulData = null;
    let winningModel = null;

    for (const candidate of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          })
        });

        if (response.ok) {
          successfulData = await response.json();
          winningModel = candidate;
          break;
        }

        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson.error ? errJson.error.message : `HTTP ${response.status}`;
        lastError = `Model ${candidate}: ${errMsg}`;
        console.warn(`Gemini API candidate ${candidate} non-200:`, lastError);

        // If high demand (503) or not found (404), immediately try next candidate
        if (response.status === 503 || response.status === 404) {
          continue;
        }
      } catch (netErr) {
        lastError = `Model ${candidate} network error: ${netErr.message}`;
        console.warn(lastError);
      }
    }

    if (!successfulData) {
      return res.status(502).json({
        error: `All Gemini model attempts failed. Last error: ${lastError || 'Service unavailable'}`
      });
    }

    const rawText = successfulData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.status(502).json({ error: 'Empty candidate text returned by Gemini API' });
    }

    // Clean JSON response (strip markdown wrappers if any)
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    let catalog = null;
    try {
      catalog = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.status(502).json({
        error: `Failed to parse JSON response from Gemini: ${parseErr.message}`,
        rawText: cleaned.slice(0, 500)
      });
    }

    if (!catalog.products || !Array.isArray(catalog.products)) {
      catalog.products = [];
    }

    return res.status(200).json({
      success: true,
      model: winningModel,
      catalog
    });
  } catch (error) {
    console.error('Server error in /api/gemini-extract:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
