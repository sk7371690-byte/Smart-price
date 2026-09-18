const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Offer must be linked to a product'],
      index: true,
    },
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Retailer',
      required: [true, 'Offer must be linked to a retailer'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide listed product price'],
      min: [0, 'Price cannot be negative'],
    },
    mrp: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: [0, 'Delivery charge cannot be negative'],
    },
    effectivePrice: {
      type: Number,
      required: true,
      index: true,
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Limited Stock'],
      default: 'In Stock',
    },
    deliveryTime: {
      type: String,
      default: 'Standard Delivery (2-4 business days)',
    },
    seller: {
      type: String,
      trim: true,
    },
    productUrl: {
      type: String,
      required: [true, 'Please provide retailer product link'],
    },
    retailerProductId: {
      type: String,
      trim: true,
      index: true, // e.g. Amazon ASIN, Flipkart FSN
    },
    lastCheckedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate offers from the same retailer for the same product
offerSchema.index({ product: 1, retailer: 1 }, { unique: true });

// Pre-save hook: Automatically compute effective price and discount percent
offerSchema.pre('validate', function (next) {
  const price = Number(this.price) || 0;
  const delivery = Number(this.deliveryCharge) || 0;
  const discount = Number(this.discount) || 0;

  // Formula: Effective Price = Product Price + Delivery Charges − Known Discounts
  this.effectivePrice = Math.max(0, price + delivery - discount);

  if (this.mrp && this.mrp > this.effectivePrice) {
    this.discountPercent = Math.round(((this.mrp - this.effectivePrice) / this.mrp) * 100);
  }

  next();
});

module.exports = mongoose.model('Offer', offerSchema);
