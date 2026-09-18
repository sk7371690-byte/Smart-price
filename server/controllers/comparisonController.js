const { Product, Offer } = require('../models');
const priceCalculator = require('../services/pricing/priceCalculator');
const retailerFactory = require('../services/retailers/RetailerFactory');

// @desc    Compare all retailer offers for a specific product ID
// @route   GET /api/compare/product/:id
// @access  Public
const compareByProductId = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = null;
    let offers = [];

    try {
      product = await Product.findById(id);
      if (product) {
        offers = await Offer.find({ product: id }).populate('retailer', 'name slug logoUrl websiteUrl');
      }
    } catch {
      product = null;
      offers = [];
    }

    // If not in DB or DB empty, search via RetailerFactory
    if (!offers || offers.length === 0) {
      const fallbackQuery = product ? product.title : id;
      const liveOffers = await retailerFactory.searchAllRetailers(fallbackQuery);
      if (liveOffers.length > 0) {
        offers = liveOffers;
      }
    }

    const comparisonResult = priceCalculator.compareOffers(offers);

    res.status(200).json({
      success: true,
      productId: id,
      productTitle: product ? product.title : (offers[0]?.title || id),
      productThumbnail: product ? product.thumbnailUrl : offers[0]?.imageUrl,
      ...comparisonResult,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Live compare prices across all stores for any product query
// @route   GET /api/compare?q=
// @access  Public
const compareByQuery = async (req, res, next) => {
  try {
    const { q = '' } = req.query;

    if (!q.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search term to compare, e.g. /api/compare?q=Nike Air Max 270',
      });
    }

    const cleanQuery = q.trim();

    // 1. Gather all live offers across Amazon, Flipkart, Myntra, Croma
    const rawOffers = await retailerFactory.searchAllRetailers(cleanQuery);

    // 2. Feed into mathematical price comparison engine
    const comparisonResult = priceCalculator.compareOffers(rawOffers);

    res.status(200).json({
      success: true,
      query: cleanQuery,
      ...comparisonResult,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  compareByProductId,
  compareByQuery,
};
