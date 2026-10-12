/**
 * ContentSmith - Serverless Multi-Store Catalogs API
 * Endpoint: /api/catalogs
 * Supports GET (list or by id), POST (create/update), DELETE (by id)
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Support local in-memory fallback for serverless
  if (!global._ContentSmith_CATALOGS_CACHE) {
    global._ContentSmith_CATALOGS_CACHE = [];
  }

  const method = req.method;

  if (method === 'GET') {
    const id = req.query ? req.query.id : null;
    if (id) {
      const cleanId = String(id).toLowerCase();
      const found = global._ContentSmith_CATALOGS_CACHE.find(c => c.id && c.id.toLowerCase() === cleanId);
      if (found) {
        return res.status(200).json(found);
      }
      return res.status(404).json({ error: 'Catalog not found' });
    }
    return res.status(200).json(global._ContentSmith_CATALOGS_CACHE);
  }

  if (method === 'POST') {
    try {
      const catalog = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!catalog || !catalog.id) {
        return res.status(400).json({ error: 'Catalog payload missing id' });
      }

      const idx = global._ContentSmith_CATALOGS_CACHE.findIndex(c => c.id === catalog.id);
      if (idx >= 0) {
        global._ContentSmith_CATALOGS_CACHE[idx] = catalog;
      } else {
        global._ContentSmith_CATALOGS_CACHE.unshift(catalog);
      }

      return res.status(200).json({ success: true, id: catalog.id });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save catalog' });
    }
  }

  if (method === 'DELETE') {
    const id = req.query ? req.query.id : null;
    if (id) {
      global._ContentSmith_CATALOGS_CACHE = global._ContentSmith_CATALOGS_CACHE.filter(c => c.id !== id);
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
