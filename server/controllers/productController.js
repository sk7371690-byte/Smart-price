const mongoose = require('mongoose');
const { Product, Offer, Retailer } = require('../models');

// Curated seed data for seamless fallback when database is fresh
const defaultFallbackProducts = [
  {
    _id: 'prod-1',
    id: 'prod-1',
    title: 'Nike Air Max 270 Men Running Shoes',
    normalizedTitle: 'nike air max 270 men running shoes',
    brand: 'Nike',
    category: 'Footwear',
    rating: 4.6,
    reviewsCount: 1420,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    description: 'The Nike Air Max 270 delivers unmatched all-day comfort with Nike\'s biggest heel Air unit yet. Lightweight, breathable mesh upper and dual-density foam sole.',
    attributes: {
      Size: 'UK 9',
      Color: 'Black / University Red',
      Material: 'Breathable Mesh',
      Closure: 'Lace-Up',
    },
    lowestOffer: {
      retailerName: 'Flipkart',
      price: 4899,
      effectivePrice: 4899,
    },
    offers: [
      {
        retailer: { name: 'Flipkart', slug: 'flipkart', logoUrl: 'https://img.icons8.com/color/48/flipkart.png' },
        price: 4899,
        mrp: 6999,
        deliveryCharge: 0,
        discount: 0,
        effectivePrice: 4899,
        availability: 'In Stock',
        deliveryTime: '2 Days Free Delivery',
        seller: 'RetailNet Authentic',
        productUrl: 'https://www.flipkart.com',
      },
      {
        retailer: { name: 'Myntra', slug: 'myntra', logoUrl: 'https://img.icons8.com/color/48/myntra.png' },
        price: 5099,
        mrp: 6999,
        deliveryCharge: 0,
        discount: 0,
        effectivePrice: 5099,
        availability: 'In Stock',
        deliveryTime: 'Tomorrow By 7 PM',
        seller: 'Nike Official Store',
        productUrl: 'https://www.myntra.com',
      },
      {
        retailer: { name: 'Amazon India', slug: 'amazon', logoUrl: 'https://img.icons8.com/color/48/amazon.png' },
        price: 5249,
        mrp: 6999,
        deliveryCharge: 50,
        discount: 0,
        effectivePrice: 5299,
        availability: 'In Stock',
        deliveryTime: 'Same Day with Prime',
        seller: 'Appario Retail',
        productUrl: 'https://www.amazon.in',
      },
      {
        retailer: { name: 'Tata Croma', slug: 'croma', logoUrl: 'https://img.icons8.com/color/48/shopping-cart.png' },
        price: 5399,
        mrp: 6999,
        deliveryCharge: 0,
        discount: 0,
        effectivePrice: 5399,
        availability: 'Limited Stock',
        deliveryTime: '3-4 Days',
        seller: 'Tata Croma Lifestyle',
        productUrl: 'https://www.croma.com',
      },
    ],
    priceHistory: [
      { date: '10 Sep', price: 5499 },
      { date: '11 Sep', price: 5299 },
      { date: '12 Sep', price: 5299 },
      { date: '13 Sep', price: 5199 },
      { date: '14 Sep', price: 5099 },
      { date: '15 Sep', price: 4999 },
      { date: 'Today', price: 4899 },
    ],
  },
  {
    _id: 'prod-2',
    id: 'prod-2',
    title: 'Samsung Galaxy S24 5G (Onyx Black, 256 GB, 8 GB RAM)',
    normalizedTitle: 'samsung galaxy s24 5g onyx black 256 gb 8 gb ram',
    brand: 'Samsung',
    category: 'Mobiles',
    rating: 4.7,
    reviewsCount: 3890,
    thumbnailUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    description: 'Meet Galaxy S24 with Galaxy AI. 6.2-inch Dynamic AMOLED 2X Display with 120Hz refresh rate, 50MP ProVisual Engine camera.',
    attributes: {
      RAM: '8 GB',
      Storage: '256 GB',
      Color: 'Onyx Black',
      Processor: 'Exynos 2400 Deca-Core',
    },
    lowestOffer: {
      retailerName: 'Amazon India',
      price: 74999,
      effectivePrice: 72999,
    },
    offers: [
      {
        retailer: { name: 'Amazon India', slug: 'amazon', logoUrl: 'https://img.icons8.com/color/48/amazon.png' },
        price: 74999,
        mrp: 84999,
        deliveryCharge: 0,
        discount: 2000,
        effectivePrice: 72999,
        availability: 'In Stock',
        deliveryTime: 'Tomorrow By 11 AM',
        seller: 'STPL Exclusive',
        productUrl: 'https://www.amazon.in',
      },
      {
        retailer: { name: 'Flipkart', slug: 'flipkart', logoUrl: 'https://img.icons8.com/color/48/flipkart.png' },
        price: 74999,
        mrp: 84999,
        deliveryCharge: 99,
        discount: 1500,
        effectivePrice: 73598,
        availability: 'In Stock',
        deliveryTime: '2 Days Delivery',
        seller: 'OmniTech Retail',
        productUrl: 'https://www.flipkart.com',
      },
      {
        retailer: { name: 'Tata Croma', slug: 'croma', logoUrl: 'https://img.icons8.com/color/48/shopping-cart.png' },
        price: 75990,
        mrp: 84999,
        deliveryCharge: 0,
        discount: 1000,
        effectivePrice: 74990,
        availability: 'In Stock',
        deliveryTime: 'Pick up in store in 2 hrs',
        seller: 'Croma Electronics',
        productUrl: 'https://www.croma.com',
      },
    ],
    priceHistory: [
      { date: '10 Sep', price: 79999 },
      { date: '11 Sep', price: 78999 },
      { date: '12 Sep', price: 76999 },
      { date: '13 Sep', price: 75999 },
      { date: '14 Sep', price: 74999 },
      { date: '15 Sep', price: 73999 },
      { date: 'Today', price: 72999 },
    ],
  },
  {
    _id: 'prod-3',
    id: 'prod-3',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    normalizedTitle: 'sony wh1000xm5 wireless noise cancelling headphones',
    brand: 'Sony',
    category: 'Audio',
    rating: 4.8,
    reviewsCount: 2150,
    thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life.',
    attributes: {
      Color: 'Silver White',
      Type: 'Over-Ear Wireless',
      Battery: '30 Hours Playback',
    },
    lowestOffer: {
      retailerName: 'Tata Croma',
      price: 26990,
      effectivePrice: 25990,
    },
    offers: [
      {
        retailer: { name: 'Tata Croma', slug: 'croma', logoUrl: 'https://img.icons8.com/color/48/shopping-cart.png' },
        price: 26990,
        mrp: 34990,
        deliveryCharge: 0,
        discount: 1000,
        effectivePrice: 25990,
        availability: 'In Stock',
        deliveryTime: 'Free Delivery by Friday',
        seller: 'Croma Audio Hub',
        productUrl: 'https://www.croma.com',
      },
      {
        retailer: { name: 'Amazon India', slug: 'amazon', logoUrl: 'https://img.icons8.com/color/48/amazon.png' },
        price: 26990,
        mrp: 34990,
        deliveryCharge: 0,
        discount: 0,
        effectivePrice: 26990,
        availability: 'In Stock',
        deliveryTime: 'Next Day Delivery',
        seller: 'Appario Electronics',
        productUrl: 'https://www.amazon.in',
      },
      {
        retailer: { name: 'Flipkart', slug: 'flipkart', logoUrl: 'https://img.icons8.com/color/48/flipkart.png' },
        price: 27490,
        mrp: 34990,
        deliveryCharge: 50,
        discount: 0,
        effectivePrice: 27540,
        availability: 'In Stock',
        deliveryTime: '3 Days Delivery',
        seller: 'SuperComNet',
        productUrl: 'https://www.flipkart.com',
      },
    ],
    priceHistory: [
      { date: '10 Sep', price: 29990 },
      { date: '11 Sep', price: 28990 },
      { date: '12 Sep', price: 28490 },
      { date: '13 Sep', price: 27990 },
      { date: '14 Sep', price: 26990 },
      { date: '15 Sep', price: 26490 },
      { date: 'Today', price: 25990 },
    ],
  },
  {
    _id: 'prod-4',
    id: 'prod-4',
    title: 'Apple MacBook Air 13-inch M2 (8-Core CPU, 8GB RAM, 256GB SSD, Midnight)',
    normalizedTitle: 'apple macbook air 13inch m2 8core cpu 8gb ram 256gb ssd midnight',
    brand: 'Apple',
    category: 'Laptops',
    rating: 4.9,
    reviewsCount: 5210,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    description: 'Strikingly thin design. Supercharged by M2 chip with incredible performance and up to 18 hours of battery life.',
    attributes: {
      Chipset: 'Apple M2 8-Core',
      RAM: '8 GB Unified Memory',
      Storage: '256 GB NVMe SSD',
      Display: '13.6-inch Liquid Retina',
    },
    lowestOffer: {
      retailerName: 'Flipkart',
      price: 84990,
      effectivePrice: 81990,
    },
    offers: [
      {
        retailer: { name: 'Flipkart', slug: 'flipkart', logoUrl: 'https://img.icons8.com/color/48/flipkart.png' },
        price: 84990,
        mrp: 99900,
        deliveryCharge: 0,
        discount: 3000,
        effectivePrice: 81990,
        availability: 'In Stock',
        deliveryTime: 'Tomorrow By 2 PM',
        seller: 'IndiFlashMart',
        productUrl: 'https://www.flipkart.com',
      },
      {
        retailer: { name: 'Amazon India', slug: 'amazon', logoUrl: 'https://img.icons8.com/color/48/amazon.png' },
        price: 84990,
        mrp: 99900,
        deliveryCharge: 0,
        discount: 1000,
        effectivePrice: 83990,
        availability: 'In Stock',
        deliveryTime: 'Same Day Delivery',
        seller: 'Amazon Prime Verified',
        productUrl: 'https://www.amazon.in',
      },
      {
        retailer: { name: 'Tata Croma', slug: 'croma', logoUrl: 'https://img.icons8.com/color/48/shopping-cart.png' },
        price: 86900,
        mrp: 99900,
        deliveryCharge: 0,
        discount: 2000,
        effectivePrice: 84900,
        availability: 'In Stock',
        deliveryTime: 'Free Express Delivery',
        seller: 'Apple Authorized Croma',
        productUrl: 'https://www.croma.com',
      },
    ],
    priceHistory: [
      { date: '10 Sep', price: 92900 },
      { date: '11 Sep', price: 89900 },
      { date: '12 Sep', price: 87900 },
      { date: '13 Sep', price: 85900 },
      { date: '14 Sep', price: 83900 },
      { date: '15 Sep', price: 82900 },
      { date: 'Today', price: 81990 },
    ],
  },
];

// @desc    Get all products with full-text search, filters, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { q, category, brand, minPrice, maxPrice, sortBy = 'price-asc', page = 1, limit = 12 } = req.query;

    let dbCount = 0;
    if (mongoose.connection.readyState === 1) {
      try {
        dbCount = await Product.countDocuments();
      } catch {
        dbCount = 0;
      }
    }

    // If MongoDB has records, run database queries
    if (dbCount > 0) {
      const filter = {};

      if (q && q.trim()) {
        const cleanQuery = q.trim();
        filter.$or = [
          { title: { $regex: cleanQuery, $options: 'i' } },
          { brand: { $regex: cleanQuery, $options: 'i' } },
          { category: { $regex: cleanQuery, $options: 'i' } },
          { normalizedTitle: { $regex: cleanQuery.toLowerCase(), $options: 'i' } },
        ];
      }

      if (category && category !== 'All') {
        filter.category = new RegExp(`^${category}$`, 'i');
      }

      if (brand && brand !== 'All') {
        filter.brand = new RegExp(`^${brand}$`, 'i');
      }

      if (minPrice || maxPrice) {
        filter['lowestOffer.effectivePrice'] = {};
        if (minPrice) filter['lowestOffer.effectivePrice'].$gte = Number(minPrice);
        if (maxPrice) filter['lowestOffer.effectivePrice'].$lte = Number(maxPrice);
      }

      let sortOptions = { 'lowestOffer.effectivePrice': 1 };
      if (sortBy === 'price-desc') sortOptions = { 'lowestOffer.effectivePrice': -1 };
      if (sortBy === 'rating') sortOptions = { rating: -1 };
      if (sortBy === 'newest') sortOptions = { createdAt: -1 };

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate({
          path: 'offers',
          populate: { path: 'retailer', select: 'name slug logoUrl websiteUrl' },
        });

      return res.status(200).json({
        success: true,
        count: products.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        data: products,
      });
    }

    // In-memory fallback
    let filtered = [...defaultFallbackProducts];

    if (q && q.trim()) {
      const queryLower = q.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(queryLower) ||
          p.brand.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower)
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (brand && brand !== 'All') {
      filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.lowestOffer.effectivePrice - b.lowestOffer.effectivePrice);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.lowestOffer.effectivePrice - a.lowestOffer.effectivePrice);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      total: filtered.length,
      page: 1,
      pages: 1,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = null;
    if (mongoose.connection.readyState === 1) {
      try {
        product = await Product.findById(id).populate({
          path: 'offers',
          populate: { path: 'retailer', select: 'name slug logoUrl websiteUrl' },
        });
      } catch {
        product = null;
      }
    }

    if (!product) {
      product = defaultFallbackProducts.find((p) => p.id === id || p._id === id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get retailer comparison offers for a product
// @route   GET /api/products/:id/offers
// @access  Public
const getProductOffers = async (req, res, next) => {
  try {
    const { id } = req.params;

    let offers = [];
    try {
      offers = await Offer.find({ product: id })
        .populate('retailer', 'name slug logoUrl websiteUrl')
        .sort({ effectivePrice: 1 });
    } catch {
      offers = [];
    }

    if (!offers.length) {
      const fallbackProd = defaultFallbackProducts.find((p) => p.id === id || p._id === id);
      if (fallbackProd) {
        offers = fallbackProd.offers;
      }
    }

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fast search suggestions & autocomplete
// @route   GET /api/search?q=
// @access  Public
const searchSuggestions = async (req, res, next) => {
  try {
    const { q = '' } = req.query;

    if (!q.trim()) {
      return res.status(200).json({
        success: true,
        data: ['Nike Air Max 270', 'Samsung Galaxy S24', 'MacBook Air M2', 'Sony WH-1000XM5'],
      });
    }

    const clean = q.trim();
    let suggestions = [];

    try {
      const matches = await Product.find({
        $or: [
          { title: { $regex: clean, $options: 'i' } },
          { brand: { $regex: clean, $options: 'i' } },
        ],
      })
        .limit(6)
        .select('title brand');

      suggestions = matches.map((m) => m.title);
    } catch {
      suggestions = [];
    }

    if (!suggestions.length) {
      suggestions = defaultFallbackProducts
        .filter((p) => p.title.toLowerCase().includes(clean.toLowerCase()) || p.brand.toLowerCase().includes(clean.toLowerCase()))
        .map((p) => p.title);
    }

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductOffers,
  searchSuggestions,
};
