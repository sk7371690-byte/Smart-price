const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide retailer name'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide retailer slug'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logoUrl: {
      type: String,
      required: [true, 'Please provide retailer logo URL'],
    },
    websiteUrl: {
      type: String,
      required: [true, 'Please provide retailer official website URL'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Retailer', retailerSchema);
