/**
 * Attribute Extractor & Conflict Detector
 * Extracts critical variant specifications and prevents false positive matches
 * (e.g., 128GB vs 256GB or UK 8 vs UK 9).
 */

const STORAGE_REGEX = /\b(64|128|256|512)\s*(gb)\b|\b(1|2)\s*(tb)\b/i;
const RAM_REGEX = /\b(4|6|8|12|16|24|32)\s*(gb)\s*(ram|unified)?\b/i;
const SHOE_SIZE_REGEX = /\b(uk|us|eu)?\s*([6-9]|1[0-3])(\.5)?\s*(uk|us|eu)?\b/i;
const COLOR_KEYWORDS = [
  'black', 'white', 'silver', 'grey', 'gray', 'blue', 'red', 'green',
  'gold', 'midnight', 'starlight', 'onyx', 'titanium', 'purple'
];

function extractAttributes(text = '', existingAttributes = {}) {
  const normalized = text.toLowerCase();
  const extracted = {};

  // Extract from existing key-value object first
  if (existingAttributes && typeof existingAttributes === 'object') {
    for (const [k, v] of Object.entries(existingAttributes)) {
      const keyLower = k.toLowerCase();
      const valLower = String(v).toLowerCase().replace(/\s+/g, '');
      if (keyLower.includes('storage') || keyLower.includes('rom')) extracted.storage = valLower;
      if (keyLower.includes('ram') || keyLower.includes('memory')) extracted.ram = valLower;
      if (keyLower.includes('size')) extracted.size = valLower;
      if (keyLower.includes('color')) extracted.color = valLower;
    }
  }

  // Extract Storage from text if missing
  if (!extracted.storage) {
    const sMatch = normalized.match(STORAGE_REGEX);
    if (sMatch) {
      extracted.storage = sMatch[0].replace(/\s+/g, '');
    }
  }

  // Extract RAM from text if missing
  if (!extracted.ram) {
    const rMatch = normalized.match(RAM_REGEX);
    if (rMatch) {
      extracted.ram = rMatch[0].replace(/\s+/g, '').replace(/unified|ram/g, '');
    }
  }

  // Extract Shoe / Apparel Size from text if missing
  if (!extracted.size) {
    const sizeMatch = normalized.match(/\b(uk\s*[6-9]|uk\s*1[0-3]|size\s*[6-9]|size\s*1[0-3])\b/i);
    if (sizeMatch) {
      extracted.size = sizeMatch[0].replace(/\s+/g, '').replace('size', 'uk');
    }
  }

  // Extract Color from text if missing
  if (!extracted.color) {
    for (const color of COLOR_KEYWORDS) {
      if (new RegExp(`\\b${color}\\b`, 'i').test(normalized)) {
        extracted.color = color;
        break;
      }
    }
  }

  return extracted;
}

/**
 * Check whether two attribute sets have an irreconcilable variant conflict
 * E.g., 128GB vs 256GB, or UK 8 vs UK 9
 */
function attributesConflict(attrsA = {}, attrsB = {}) {
  const criticalKeys = ['storage', 'ram', 'size'];

  for (const key of criticalKeys) {
    if (attrsA[key] && attrsB[key]) {
      const valA = attrsA[key].toLowerCase().replace(/\s+/g, '');
      const valB = attrsB[key].toLowerCase().replace(/\s+/g, '');

      if (valA !== valB) {
        return {
          hasConflict: true,
          conflictKey: key,
          valA,
          valB,
          reason: `Critical variant mismatch on '${key}': '${valA}' vs '${valB}'`,
        };
      }
    }
  }

  return { hasConflict: false };
}

module.exports = {
  extractAttributes,
  attributesConflict,
};
