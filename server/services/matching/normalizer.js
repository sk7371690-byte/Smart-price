/**
 * Title Normalizer Utility
 * Standardizes noisy e-commerce product titles into clean canonical strings
 */

// Common marketing buzzwords and filler terms to remove
const STOP_WORDS = new Set([
  'buy', 'online', 'india', 'best', 'price', 'deals', 'sale', 'free',
  'delivery', 'authentic', 'original', 'discount', 'brand', 'new', 'official',
  'flagship', 'exclusive', 'store', 'offer', 'hot', 'warranty'
]);

function normalizeTitle(rawTitle) {
  if (!rawTitle || typeof rawTitle !== 'string') return '';

  let cleaned = rawTitle.toLowerCase();

  // Standardize common unit spacing (e.g., '256 gb' -> '256gb', '8 gb' -> '8gb', 'uk 9' -> 'uk9')
  cleaned = cleaned.replace(/(\d+)\s*(gb|tb|mb|ram|rom)\b/gi, '$1$2');
  cleaned = cleaned.replace(/\b(uk|us|eu)\s*(\d+(\.\d+)?)\b/gi, '$1$2');
  cleaned = cleaned.replace(/\b(5\s*g|4\s*g)\b/gi, (m) => m.replace(/\s+/g, ''));

  // Strip special symbols, brackets, and punctuation
  cleaned = cleaned.replace(/[^a-z0-9\s]/g, ' ');

  // Tokenize and filter stop words
  const tokens = cleaned
    .split(/\s+/)
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word));

  return tokens.join(' ').trim();
}

module.exports = {
  normalizeTitle,
};
