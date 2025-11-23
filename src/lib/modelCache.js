/**
 * Model Cache Management System
 * Untuk menyimpan dan reuse model 3D yang sudah pernah di-generate
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CACHE_FILE = path.join(process.cwd(), 'model-cache.json');

/**
 * Initialize cache file if not exists
 */
function initCache() {
  if (!fs.existsSync(CACHE_FILE)) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      models: {},
      metadata: {
        created: new Date().toISOString(),
        totalModels: 0,
        totalCreditsSaved: 0
      }
    }, null, 2));
  }
}

/**
 * Read cache from file
 */
function readCache() {
  initCache();
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cache:', error);
    return { models: {}, metadata: { totalModels: 0, totalCreditsSaved: 0 } };
  }
}

/**
 * Write cache to file
 */
function writeCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

/**
 * Generate hash from text (untuk cache key)
 */
export function generateCacheKey(text) {
  // Normalize text: lowercase, remove extra spaces, trim
  const normalized = text.toLowerCase().trim().replace(/\s+/g, ' ');

  // Create hash
  const hash = crypto.createHash('md5').update(normalized).digest('hex');

  return hash;
}

/**
 * Calculate similarity between two texts (0-100%)
 * Simple word-based similarity
 */
export function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 3);

  if (words1.length === 0 || words2.length === 0) return 0;

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  // Count common words
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  // Jaccard similarity
  const similarity = (intersection.size / union.size) * 100;

  return Math.round(similarity);
}

/**
 * Find similar model in cache
 * Returns cached model if similarity > threshold
 * Use prompt for better matching if available
 */
export function findSimilarModel(title, content, threshold = 70, prompt = null) {
  const cache = readCache();

  // Use prompt for similarity matching if available (more accurate)
  const searchText = (prompt || `${title} ${content}`).toLowerCase();

  let bestMatch = null;
  let highestSimilarity = 0;

  for (const [key, model] of Object.entries(cache.models)) {
    // Compare with cached prompt if available, otherwise use title+content
    const cachedText = (model.prompt || `${model.title} ${model.content}`).toLowerCase();
    const similarity = calculateSimilarity(searchText, cachedText);

    if (similarity >= threshold && similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = {
        ...model,
        similarity: similarity,
        cacheKey: key
      };
    }
  }

  return bestMatch;
}

/**
 * Get model from cache by exact key
 * For consistent caching, use prompt instead of content (narasi)
 */
export function getCachedModel(title, content, prompt = null) {
  const cache = readCache();

  // Use prompt for cache key if available (more consistent for same objects)
  const cacheText = prompt || `${title} ${content}`;
  const key = generateCacheKey(cacheText);

  return cache.models[key] || null;
}

/**
 * Save model to cache
 * Use prompt for cache key (more consistent than narasi)
 */
export function saveModelToCache(title, content, modelData, prompt = null) {
  const cache = readCache();

  // Use prompt for cache key if available (more consistent for same objects)
  const cacheText = prompt || `${title} ${content}`;
  const key = generateCacheKey(cacheText);

  cache.models[key] = {
    title: title,
    content: content,
    prompt: prompt, // Store prompt for better cache matching
    modelUrl: modelData.modelUrl,
    thumbnailUrl: modelData.thumbnailUrl,
    taskId: modelData.taskId,
    createdAt: new Date().toISOString(),
    usageCount: 1
  };

  cache.metadata.totalModels = Object.keys(cache.models).length;
  cache.metadata.lastUpdated = new Date().toISOString();

  writeCache(cache);

  return key;
}

/**
 * Increment usage count for cached model
 */
export function incrementUsageCount(cacheKey) {
  const cache = readCache();

  if (cache.models[cacheKey]) {
    cache.models[cacheKey].usageCount = (cache.models[cacheKey].usageCount || 1) + 1;
    cache.models[cacheKey].lastUsed = new Date().toISOString();

    // Track credits saved (assuming 20 credits per model)
    cache.metadata.totalCreditsSaved = (cache.metadata.totalCreditsSaved || 0) + 20;

    writeCache(cache);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const cache = readCache();

  return {
    totalModels: Object.keys(cache.models).length,
    totalCreditsSaved: cache.metadata.totalCreditsSaved || 0,
    models: Object.entries(cache.models).map(([key, model]) => ({
      key,
      title: model.title,
      usageCount: model.usageCount || 1,
      createdAt: model.createdAt
    }))
  };
}

/**
 * Clear old cache entries (older than 30 days)
 */
export function clearOldCache(daysOld = 30) {
  const cache = readCache();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const newModels = {};
  let removedCount = 0;

  for (const [key, model] of Object.entries(cache.models)) {
    const modelDate = new Date(model.createdAt);

    if (modelDate > cutoffDate || (model.usageCount && model.usageCount > 1)) {
      newModels[key] = model;
    } else {
      removedCount++;
    }
  }

  cache.models = newModels;
  cache.metadata.totalModels = Object.keys(newModels).length;
  cache.metadata.lastCleaned = new Date().toISOString();

  writeCache(cache);

  return { removedCount, remainingCount: Object.keys(newModels).length };
}
