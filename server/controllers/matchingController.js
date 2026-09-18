const productMatchingEngine = require('../services/matching/ProductMatchingEngine');
const { normalizeTitle } = require('../services/matching/normalizer');
const { extractAttributes } = require('../services/matching/attributeExtractor');

// @desc    Verify if two products / titles match or conflict
// @route   POST /api/matching/verify
// @access  Public
const verifyMatch = (req, res, next) => {
  try {
    const { itemA, itemB } = req.body;

    if (!itemA || !itemB) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both itemA and itemB (as objects or titles) to compare.',
      });
    }

    // Convert plain strings to product objects if needed
    const objA = typeof itemA === 'string' ? { title: itemA } : itemA;
    const objB = typeof itemB === 'string' ? { title: itemB } : itemB;

    const result = productMatchingEngine.matchProducts(objA, objB);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Normalize a raw title and extract its variant specifications
// @route   POST /api/matching/normalize
// @access  Public
const normalize = (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a product title string to normalize.',
      });
    }

    const normalized = normalizeTitle(title);
    const attributes = extractAttributes(title);

    res.status(200).json({
      success: true,
      data: {
        original: title,
        normalized,
        attributes,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyMatch,
  normalize,
};
