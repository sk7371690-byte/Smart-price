const historyService = require('../services/pricing/historyService');

// @desc    Get historical price timeline and drop metrics for a product
// @route   GET /api/products/:id/history
// @access  Public
const getPriceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const data = await historyService.getProductPriceHistory(id, Number(days));

    res.status(200).json({
      success: true,
      productId: id,
      daysRequested: Number(days),
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually record a price point (e.g. from background scraper or mock sync)
// @route   POST /api/products/:id/history
// @access  Private (or Protected)
const recordSnapshot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { retailerId, offerId, price, effectivePrice } = req.body;

    if (!price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide price for snapshot.',
      });
    }

    const record = await historyService.recordPriceSnapshot(
      id,
      retailerId,
      offerId,
      price,
      effectivePrice || price
    );

    res.status(201).json({
      success: true,
      message: 'Price snapshot recorded successfully.',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPriceHistory,
  recordSnapshot,
};
