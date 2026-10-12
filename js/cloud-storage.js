/**
 * ContentSmith - Cloud Storage Integration Module
 * Provides direct-to-cloud image uploads (Cloudinary, Supabase Storage, and Built-in Serverless/Blob)
 * Eliminates localStorage base64 quota overflow and enables instant CDN-hosted storefront images.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'ContentSmith_cloud_storage';

  const DEFAULT_CONFIG = {
    provider: 'cloudinary', // 'cloudinary' | 'supabase' | 'serverless'
    autoUpload: false,
    cloudinary: {
      cloudName: '',
      uploadPreset: '',
      folder: 'catalogsmith'
    },
    supabase: {
      url: '',
      anonKey: '',
      bucket: 'catalog-images'
    }
  };

  function getConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_CONFIG };
      const parsed = JSON.parse(raw);
      return {
        provider: parsed.provider || DEFAULT_CONFIG.provider,
        autoUpload: !!parsed.autoUpload,
        cloudinary: { ...DEFAULT_CONFIG.cloudinary, ...(parsed.cloudinary || {}) },
        supabase: { ...DEFAULT_CONFIG.supabase, ...(parsed.supabase || {}) }
      };
    } catch (e) {
      return { ...DEFAULT_CONFIG };
    }
  }

  function saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
      return true;
    } catch (e) {
      console.error('Failed to save cloud storage config:', e);
      return false;
    }
  }

  let serverEnvStatus = null;

  async function checkServerEnv() {
    try {
      const resp = await fetch('/api/upload-image', { method: 'GET' });
      if (resp.ok) {
        serverEnvStatus = await resp.json();
        return serverEnvStatus;
      }
    } catch (_) {}
    return null;
  }

  function getServerEnvStatus() {
    return serverEnvStatus;
  }

  function isConfigured(cfg = null) {
    if (serverEnvStatus && serverEnvStatus.configured) {
      return true;
    }
    const c = cfg || getConfig();
    if (c.provider === 'serverless') {
      return true;
    }
    if (c.provider === 'cloudinary') {
      return Boolean(c.cloudinary.cloudName && c.cloudinary.uploadPreset);
    }
    if (c.provider === 'supabase') {
      return Boolean((c.supabase.url && c.supabase.anonKey && c.supabase.bucket) || (serverEnvStatus && serverEnvStatus.provider === 'supabase'));
    }
    return false;
  }

  // Convert base64 DataURL to Blob
  function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Direct upload to Cloudinary (Unsigned Preset)
   */
  async function uploadToCloudinary(blob, filename, cfg) {
    const cloudName = (cfg.cloudinary.cloudName || '').trim();
    const preset = (cfg.cloudinary.uploadPreset || '').trim();
    const folder = (cfg.cloudinary.folder || 'catalogsmith').trim();

    if (!cloudName || !preset) {
      throw new Error('Cloudinary cloud name and unsigned upload preset are required.');
    }

    const formData = new FormData();
    formData.append('file', blob, filename || 'product.jpg');
    formData.append('upload_preset', preset);
    if (folder) {
      formData.append('folder', folder);
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`;
    const resp = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (!resp.ok) {
      let errMsg = `Upload failed with HTTP ${resp.status}`;
      try {
        const errJson = await resp.json();
        if (errJson.error && errJson.error.message) {
          errMsg = errJson.error.message;
        }
      } catch (e) {}
      throw new Error(`Cloudinary Error: ${errMsg}`);
    }

    const data = await resp.json();
    return {
      url: data.secure_url || data.url,
      provider: 'cloudinary',
      public_id: data.public_id,
      format: data.format,
      bytes: data.bytes
    };
  }

  /**
   * Direct upload to Supabase Storage
   */
  async function uploadToSupabase(blob, filename, cfg) {
    let baseUrl = (cfg.supabase.url || '').trim().replace(/\/+$/, '');
    const anonKey = (cfg.supabase.anonKey || '').trim();
    const bucket = (cfg.supabase.bucket || 'catalog-images').trim();

    if (!baseUrl || !anonKey || !bucket) {
      throw new Error('Supabase Project URL, anon public key, and bucket name are required.');
    }

    const cleanFilename = `${Date.now()}_${(filename || 'product.jpg').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const endpoint = `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeURIComponent(cleanFilename)}`;

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': blob.type || 'image/jpeg',
        'x-upsert': 'true'
      },
      body: blob
    });

    if (!resp.ok) {
      let errMsg = `Upload failed with HTTP ${resp.status}`;
      try {
        const errJson = await resp.json();
        if (errJson.message || errJson.error) {
          errMsg = errJson.message || errJson.error;
        }
      } catch (e) {}
      throw new Error(`Supabase Storage Error: ${errMsg}`);
    }

    const publicUrl = `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodeURIComponent(cleanFilename)}`;
    return {
      url: publicUrl,
      provider: 'supabase',
      public_id: cleanFilename,
      bytes: blob.size
    };
  }

  /**
   * Upload to Built-in Serverless Endpoint (/api/upload-image)
   */
  async function uploadToServerless(blob, filename) {
    const formData = new FormData();
    formData.append('file', blob, filename || 'product.jpg');

    const resp = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    if (!resp.ok) {
      let errMsg = `Server upload failed with HTTP ${resp.status}`;
      try {
        const errJson = await resp.json();
        if (errJson.error) errMsg = errJson.error;
      } catch (e) {}
      throw new Error(errMsg);
    }

    const data = await resp.json();
    return {
      url: data.url,
      provider: data.provider || 'serverless',
      public_id: data.id || filename,
      bytes: blob.size
    };
  }

  /**
   * Universal upload function
   */
  async function uploadImage(dataUrlOrBlob, filename = 'product.jpg', cfg = null) {
    const c = cfg || getConfig();
    let blob = dataUrlOrBlob;
    if (typeof dataUrlOrBlob === 'string') {
      if (dataUrlOrBlob.startsWith('http://') || dataUrlOrBlob.startsWith('https://')) {
        // Already a remote URL
        return { url: dataUrlOrBlob, provider: 'remote', bytes: 0 };
      }
      blob = dataUrlToBlob(dataUrlOrBlob);
    }

    // If server environment (Vercel env) has Supabase or Blob configured, route directly to server upload
    if (serverEnvStatus && serverEnvStatus.configured && (c.provider === 'serverless' || (c.provider === 'supabase' && !c.supabase.url))) {
      return await uploadToServerless(blob, filename);
    }

    if (c.provider === 'cloudinary') {
      return await uploadToCloudinary(blob, filename, c);
    } else if (c.provider === 'supabase' && c.supabase.url) {
      return await uploadToSupabase(blob, filename, c);
    } else {
      return await uploadToServerless(blob, filename);
    }
  }

  /**
   * Test Connection with a 1x1 transparent pixel
   */
  async function testConnection(cfg = null) {
    const c = cfg || getConfig();
    const testPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=';
    const blob = dataUrlToBlob(testPixel);
    const result = await uploadImage(blob, 'ping-test.png', c);
    return { ok: true, url: result.url, provider: result.provider };
  }

  /**
   * Batch Migration: Migrates all base64 images in products array to Cloud CDN
   * @param {Array} products Array of product objects
   * @param {Function} onProgress Callback receiving progress info
   */
  async function migrateProducts(products, onProgress = null) {
    const cfg = getConfig();
    if (!isConfigured(cfg)) {
      throw new Error('Please configure and test your Cloud Storage credentials first.');
    }

    // Collect all base64 tasks
    const tasks = [];
    products.forEach((prod, pIdx) => {
      // Primary image
      if (prod.image && prod.image.startsWith('data:image')) {
        tasks.push({
          productId: prod.id,
          productName: prod.name,
          type: 'primary',
          index: 0,
          dataUrl: prod.image,
          sizeBytes: Math.round(prod.image.length * 0.75)
        });
      }
      // Additional gallery images
      if (Array.isArray(prod.images)) {
        prod.images.forEach((img, gIdx) => {
          if (img && img.startsWith('data:image')) {
            // Avoid duplicate if it matches primary
            if (gIdx === 0 && prod.image === img) return;
            tasks.push({
              productId: prod.id,
              productName: prod.name,
              type: 'gallery',
              index: gIdx,
              dataUrl: img,
              sizeBytes: Math.round(img.length * 0.75)
            });
          }
        });
      }
    });

    const total = tasks.length;
    if (total === 0) {
      return { success: true, count: 0, savedBytes: 0, message: 'All images are already hosted on public CDNs.' };
    }

    let completed = 0;
    let savedBytes = 0;

    for (const task of tasks) {
      if (onProgress) {
        onProgress({
          current: completed + 1,
          total: total,
          item: task.productName,
          percent: Math.round((completed / total) * 100)
        });
      }

      try {
        const filename = `${task.productId}_${task.type}_${task.index}.jpg`;
        const uploadResult = await uploadImage(task.dataUrl, filename, cfg);
        
        // Find product
        const prod = products.find(p => p.id === task.productId);
        if (prod) {
          if (task.type === 'primary') {
            prod.image = uploadResult.url;
            prod.image_origin = prod.image_origin || 'cloud_cdn';
            // Also sync gallery[0] if exists
            if (Array.isArray(prod.images) && prod.images.length > 0) {
              prod.images[0] = uploadResult.url;
            }
          } else if (task.type === 'gallery' && Array.isArray(prod.images)) {
            prod.images[task.index] = uploadResult.url;
          }
        }

        savedBytes += task.sizeBytes;
        completed++;
      } catch (err) {
        console.error(`Failed to upload image for ${task.productName}:`, err);
        throw new Error(`Failed on item "${task.productName}": ${err.message}`);
      }
    }

    if (onProgress) {
      onProgress({
        current: total,
        total: total,
        item: 'Completed',
        percent: 100
      });
    }

    return {
      success: true,
      count: completed,
      savedBytes: savedBytes,
      savedKb: Math.round(savedBytes / 1024)
    };
  }

  // Export module to global scope
  window.CloudStorage = {
    getConfig,
    saveConfig,
    isConfigured,
    checkServerEnv,
    getServerEnvStatus,
    uploadImage,
    testConnection,
    migrateProducts,
    dataUrlToBlob
  };

})(typeof window !== 'undefined' ? window : this);
