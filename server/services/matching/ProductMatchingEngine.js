const { normalizeTitle } = require('./normalizer');
const { extractAttributes, attributesConflict } = require('./attributeExtractor');
const { computeSimilarityScore } = require('./fuzzyMatcher');

class ProductMatchingEngine {
  /**
   * Evaluate whether two product representations correspond to the same canonical product
   * Priority:
   * 1. SKU/GTIN/EAN/UPC
   * 2. Brand + Model
   * 3. Important Attributes Verification (Blocks 128GB vs 256GB)
   * 4. Normalized Title
   * 5. Fuzzy Matching
   *
   * @param {Object} itemA First product representation
   * @param {Object} itemB Second product representation
   * @returns {Object} { isMatch: boolean, confidence: number, matchTier: string, reasons: string[] }
   */
  matchProducts(itemA, itemB) {
    const reasons = [];

    // TIER 1: Barcode / GTIN / EAN / UPC / SKU Exact Match
    const gtinA = itemA.gtin || itemA.sku || itemA.barcode;
    const gtinB = itemB.gtin || itemB.sku || itemB.barcode;

    if (gtinA && gtinB && String(gtinA).trim() === String(gtinB).trim()) {
      return {
        isMatch: true,
        confidence: 1.0,
        matchTier: 'TIER_1_GTIN_BARCODE',
        reasons: [`Exact Barcode/GTIN match: ${gtinA}`],
        attributesA: extractAttributes(itemA.title, itemA.attributes),
        attributesB: extractAttributes(itemB.title, itemB.attributes),
      };
    }

    // Extract critical variant attributes
    const attrsA = extractAttributes(itemA.title || itemA.rawTitle, itemA.attributes || itemA.specs);
    const attrsB = extractAttributes(itemB.title || itemB.rawTitle, itemB.attributes || itemB.specs);

    // TIER 3 (CRITICAL GATEKEEPER): Reject if variant attributes conflict (e.g. 128GB vs 256GB, UK 8 vs UK 9)
    const conflictCheck = attributesConflict(attrsA, attrsB);
    if (conflictCheck.hasConflict) {
      return {
        isMatch: false,
        confidence: 0.0,
        matchTier: 'REJECTED_VARIANT_CONFLICT',
        reasons: [conflictCheck.reason],
        attributesA: attrsA,
        attributesB: attrsB,
      };
    }

    // TIER 2: Brand + Model Matching
    const brandA = (itemA.brand || '').toLowerCase().trim();
    const brandB = (itemB.brand || '').toLowerCase().trim();
    const modelA = (itemA.model || '').toLowerCase().trim();
    const modelB = (itemB.model || '').toLowerCase().trim();

    const bothBrandsPresent = brandA.length > 0 && brandB.length > 0;
    const brandMatch = bothBrandsPresent && brandA === brandB;

    if (bothBrandsPresent && !brandMatch) {
      return {
        isMatch: false,
        confidence: 0.1,
        matchTier: 'REJECTED_BRAND_MISMATCH',
        reasons: [`Brands differ: '${brandA}' vs '${brandB}'`],
        attributesA: attrsA,
        attributesB: attrsB,
      };
    }

    if (brandMatch && modelA && modelB && modelA === modelB) {
      reasons.push(`Brand '${brandA}' and model '${modelA}' match exactly`);

      return {
        isMatch: true,
        confidence: 0.95,
        matchTier: 'TIER_2_BRAND_MODEL',
        reasons,
        attributesA: attrsA,
        attributesB: attrsB,
      };
    }

    // TIER 4: Normalized Title Matching
    const normTitleA = normalizeTitle(itemA.title || itemA.rawTitle || '');
    const normTitleB = normalizeTitle(itemB.title || itemB.rawTitle || '');

    if (normTitleA === normTitleB && normTitleA.length > 0) {
      return {
        isMatch: true,
        confidence: 0.92,
        matchTier: 'TIER_4_NORMALIZED_TITLE',
        reasons: ['Normalized titles are identical'],
        attributesA: attrsA,
        attributesB: attrsB,
      };
    }

    // TIER 5: Fuzzy Matching
    const score = computeSimilarityScore(normTitleA, normTitleB);

    if (score >= 0.78) {
      return {
        isMatch: true,
        confidence: score,
        matchTier: 'TIER_5_FUZZY_MATCH',
        reasons: [`Fuzzy similarity score ${score} meets >= 0.78 threshold`],
        attributesA: attrsA,
        attributesB: attrsB,
      };
    }

    // If similarity is below threshold
    return {
      isMatch: false,
      confidence: score,
      matchTier: 'NO_MATCH',
      reasons: [`Similarity score ${score} is below threshold 0.78`],
      attributesA: attrsA,
      attributesB: attrsB,
    };
  }
}

module.exports = new ProductMatchingEngine();
