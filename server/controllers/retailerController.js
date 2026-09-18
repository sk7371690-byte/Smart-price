const retailerFactory = require('../services/retailers/RetailerFactory');

// @desc    Get all active retailer providers and status
// @route   GET /api/retailers
// @access  Public
const getActiveRetailers = async (req, res, next) => {
  try {
    const providers = retailerFactory.getAllProviders();
    const data = providers.map((p) => ({
      name: p.name,
      slug: p.slug,
      logoUrl: p.logoUrl,
      websiteUrl: p.websiteUrl,
      status: 'active',
      adapterType: 'mock_provider',
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate real-time live federated search across all retailer feeds
// @route   GET /api/retailers/live-search?q=
// @access  Public
const searchLiveRetailers = async (req, res, next) => {
  try {
    const { q = '' } = req.query;

    if (!q.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a product search query ?q=...',
      });
    }

    const result = await retailerFactory.findBestOffer(q.trim());

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActiveRetailers,
  searchLiveRetailers,
};
