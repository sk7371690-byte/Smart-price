const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide product title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    normalizedTitle: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide brand name'],
      trim: true,
      index: true,
    },
    model: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    gtin: {
      type: String,
      trim: true,
      sparse: true,
      index: true, // Barcode/EAN/UPC identifier for precise matching
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Please provide product thumbnail image URL'],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    lowestOffer: {
      offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
      },
      retailerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Retailer',
      },
      retailerName: {
        type: String,
      },
      price: {
        type: Number,
      },
      effectivePrice: {
        type: Number,
        index: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual relationship to all retailer offers for this product
productSchema.virtual('offers', {
  ref: 'Offer',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

// Full-text search index for fast product discovery
productSchema.index({
  title: 'text',
  brand: 'text',
  category: 'text',
  description: 'text',
});

// Compound indexes for catalog filtering
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ brand: 1, model: 1 });

// Pre-save hook to populate normalizedTitle automatically
productSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.normalizedTitle) {
    this.normalizedTitle = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
