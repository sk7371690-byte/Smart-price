const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Price alert must be linked to a user'],
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Price alert must be linked to a product'],
      index: true,
    },
    targetPrice: {
      type: Number,
      required: [true, 'Please specify target alert price'],
      min: [1, 'Target price must be greater than zero'],
    },
    initialPrice: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an alert notification email'],
      lowercase: true,
      trim: true,
    },
    isTriggered: {
      type: Boolean,
      default: false,
      index: true,
    },
    triggeredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Worker query index: Quickly find active alerts below target prices
priceAlertSchema.index({ isTriggered: 1, product: 1, targetPrice: 1 });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
