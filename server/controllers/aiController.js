const mongoose = require('mongoose');
const { parseNaturalLanguageQuery } = require('../services/ai/aiQueryParser');
const { analyzeProductDeal } = require('../services/ai/recommendationEngine');
const { Product, Offer, PriceHistory } = require('../models');

// @desc    Parse natural language query into structured catalog filters
// @route   POST /api/ai/parse-query
// @access  Public
const parseSearchQuery = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query string is required in request body.',
      });
    }

    const parsed = parseNaturalLanguageQuery(query);

    res.status(200).json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI buying recommendation and deal score for a product
// @route   POST /api/ai/recommend
// @access  Public
const getRecommendation = async (req, res, next) => {
  try {
    const { productId, product: rawProduct, offers: rawOffers, priceHistory: rawHistory } = req.body;

    let product = rawProduct || null;
    let offers = rawOffers || [];
    let priceHistory = rawHistory || [];

    if (productId && (!product || !offers.length)) {
      try {
        product = await Product.findById(productId);
        offers = await Offer.find({ product: productId }).populate('retailer');
        priceHistory = await PriceHistory.find({ product: productId }).sort({ timestamp: 1 });
      } catch (err) {
        // Fallback or ignore DB error
      }
    }

    if (!product && productId) {
      // Mock fallback product if database is empty
      product = {
        _id: productId,
        title: 'Apple iPhone 15 (128GB) - Blue',
        brand: 'Apple',
        rating: 4.6,
        lowestOffer: {
          retailerName: 'Amazon India',
          effectivePrice: 65999,
          deliveryCharge: 0,
        },
        priceStats: {
          lowest: 64999,
          average: 72999,
          highest: 79900,
        }
      };
      offers = [
        { retailerName: 'Amazon India', effectivePrice: 65999, deliveryCharge: 0 },
        { retailerName: 'Flipkart', effectivePrice: 66999, deliveryCharge: 40 },
        { retailerName: 'Croma', effectivePrice: 69900, deliveryCharge: 0 },
      ];
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found for recommendation analysis.',
      });
    }

    const analysis = analyzeProductDeal({ product, offers, priceHistory });

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Smart Natural Language Search (Parses prompt, filters catalog, adds AI deal scores)
// @route   GET /api/ai/smart-search
// @access  Public
const smartSearch = async (req, res, next) => {
  try {
    const queryStr = req.query.q || '';
    if (!queryStr) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter q is required',
      });
    }

    // 1. Parse natural language query
    const parsed = parseNaturalLanguageQuery(queryStr);

    // 2. Build MongoDB query filter
    const dbQuery = { isActive: true };

    if (parsed.brand) {
      dbQuery.brand = { $regex: parsed.brand, $options: 'i' };
    }
    if (parsed.category) {
      dbQuery.category = { $regex: parsed.category, $options: 'i' };
    }
    if (parsed.minRating) {
      dbQuery.rating = { $gte: parsed.minRating };
    }

    // Price filtering on lowestOffer.effectivePrice
    if (parsed.minPrice !== null || parsed.maxPrice !== null) {
      dbQuery['lowestOffer.effectivePrice'] = {};
      if (parsed.minPrice !== null) {
        dbQuery['lowestOffer.effectivePrice'].$gte = parsed.minPrice;
      }
      if (parsed.maxPrice !== null) {
        dbQuery['lowestOffer.effectivePrice'].$lte = parsed.maxPrice;
      }
    }

    // Keyword search using cleanQuery
    if (parsed.cleanQuery) {
      dbQuery.$or = [
        { title: { $regex: parsed.cleanQuery.split(' ').join('|'), $options: 'i' } },
        { description: { $regex: parsed.cleanQuery.split(' ').join('|'), $options: 'i' } },
        { tags: { $in: parsed.cleanQuery.split(' ') } }
      ];
    }

    let products = [];
    if (mongoose.connection.readyState === 1) {
      try {
        products = await Product.find(dbQuery).limit(20).lean();
      } catch {
        products = [];
      }
    }

    // Fallback if no database match found or DB is not populated
    if (products.length === 0) {
      const mockCatalog = [
        {
          _id: 'prod_macbook_air_m2',
          title: 'Apple MacBook Air M2 (16GB Unified Memory, 256GB SSD) - Space Grey',
          brand: 'Apple',
          category: 'Laptops & Computers',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          rating: 4.8,
          lowestOffer: { effectivePrice: 94990, retailerName: 'Amazon India' },
          priceStats: { lowest: 92990, average: 104900, highest: 114900 }
        },
        {
          _id: 'prod_asus_tuf_f15',
          title: 'ASUS TUF Gaming F15 (16GB RAM, 512GB SSD, RTX 3050)',
          brand: 'Asus',
          category: 'Laptops & Computers',
          thumbnailUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
          rating: 4.4,
          lowestOffer: { effectivePrice: 58990, retailerName: 'Flipkart' },
          priceStats: { lowest: 57990, average: 65990, highest: 72990 }
        },
        {
          _id: 'prod_sony_wh1000xm5',
          title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
          brand: 'Sony',
          category: 'Audio & Headphones',
          thumbnailUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
          rating: 4.7,
          lowestOffer: { effectivePrice: 26990, retailerName: 'Amazon India' },
          priceStats: { lowest: 24990, average: 29990, highest: 34990 }
        },
        {
          _id: 'prod_nike_air_pegasus',
          title: 'Nike Air Zoom Pegasus 40 Running Shoes - UK 9 Black',
          brand: 'Nike',
          category: 'Footwear',
          thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          rating: 4.5,
          lowestOffer: { effectivePrice: 7495, retailerName: 'Myntra' },
          priceStats: { lowest: 6995, average: 9995, highest: 11995 }
        },
        {
          _id: 'prod_iphone_15_128',
          title: 'Apple iPhone 15 (128GB) - Blue',
          brand: 'Apple',
          category: 'Electronics',
          thumbnailUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500',
          rating: 4.6,
          lowestOffer: { effectivePrice: 65999, retailerName: 'Amazon India' },
          priceStats: { lowest: 64999, average: 72999, highest: 79900 }
        }
      ];

      // Filter mock catalog by parsed query bounds
      products = mockCatalog.filter((item) => {
        const price = item.lowestOffer?.effectivePrice || 0;
        if (parsed.maxPrice && price > parsed.maxPrice) return false;
        if (parsed.minPrice && price < parsed.minPrice) return false;
        if (parsed.brand && item.brand.toLowerCase() !== parsed.brand.toLowerCase()) return false;
        if (parsed.minRating && item.rating < parsed.minRating) return false;
        return true;
      });

      // If strict filter yielded nothing, return best-effort matches
      if (products.length === 0) {
        products = mockCatalog.slice(0, 3);
      }
    }

    // 3. Decorate each product with AI Deal Score & Recommendation
    const scoredProducts = products.map((prod) => {
      const dealAnalysis = analyzeProductDeal({ product: prod });
      return {
        ...prod,
        aiAnalysis: {
          dealScore: dealAnalysis?.dealScore || 75,
          verdict: dealAnalysis?.verdict || { status: 'GOOD_DEAL', label: 'Good Deal', color: 'blue' },
          shortAdvice: dealAnalysis?.verdict?.shortAdvice || '',
          discountVsAverage: dealAnalysis?.metrics?.discountVsAverage || 0,
        }
      };
    });

    res.status(200).json({
      success: true,
      count: scoredProducts.length,
      parsedQuery: parsed,
      data: scoredProducts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  parseSearchQuery,
  getRecommendation,
  smartSearch,
};
