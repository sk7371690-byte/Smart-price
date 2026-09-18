const mongoose = require('mongoose');
const { Wishlist, Product } = require('../models');

// In-memory fallback for guests or early testing
let fallbackWishlist = new Map();

// @desc    Get user's saved wishlist items
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    let items = [];
    if (mongoose.connection.readyState === 1) {
      try {
        items = await Wishlist.find({ user: userId })
          .populate({
            path: 'product',
            populate: { path: 'lowestOffer.offerId' },
          })
          .sort({ createdAt: -1 });
      } catch {
        items = [];
      }
    }

    // Fallback if DB empty or memory store used
    if (!items.length && fallbackWishlist.has(String(userId))) {
      items = fallbackWishlist.get(String(userId));
    }

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a product to user's wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;

    let product = null;
    let wishlistItem = null;

    if (mongoose.connection.readyState === 1) {
      try {
        product = await Product.findById(productId);
        wishlistItem = await Wishlist.findOne({ user: userId, product: productId });
        if (!wishlistItem) {
          wishlistItem = await Wishlist.create({
            user: userId,
            product: productId,
            addedPrice: product?.lowestOffer?.effectivePrice || 0,
          });
        }
      } catch {
        wishlistItem = null;
      }
    }

    if (!wishlistItem) {
      // Memory fallback
      const userKey = String(userId);
      const current = fallbackWishlist.get(userKey) || [];
      if (!current.some((i) => (i.productId === productId || i.product?._id === productId || i.product?.id === productId))) {
        current.push({
          _id: 'wish-' + Date.now(),
          user: userId,
          product: product || { _id: productId, id: productId, title: 'Product ' + productId },
          createdAt: new Date(),
        });
        fallbackWishlist.set(userKey, current);
      }
      wishlistItem = { product: productId };
    }

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist.',
      data: wishlistItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        await Wishlist.findOneAndDelete({ user: userId, product: productId });
      } catch {
        // ignore
      }
    }

    const userKey = String(userId);
    const current = fallbackWishlist.get(userKey) || [];
    fallbackWishlist.set(
      userKey,
      current.filter((i) => (i.product?._id || i.product?.id || i.product) !== productId)
    );

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
