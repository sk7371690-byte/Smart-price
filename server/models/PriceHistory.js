const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Price history must reference a product'],
      index: true,
    },
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Retailer',
      required: [true, 'Price history must reference a retailer'],
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
    price: {
      type: Number,
      required: true,
    },
    effectivePrice: {
      type: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Fast historical queries sorted by time
priceHistorySchema.index({ product: 1, recordedAt: -1 });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
