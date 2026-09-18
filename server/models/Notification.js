const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must be linked to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide notification title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide notification message'],
    },
    type: {
      type: String,
      enum: ['price_drop', 'alert_triggered', 'stock_alert', 'system'],
      default: 'price_drop',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for unread notifications retrieval
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
