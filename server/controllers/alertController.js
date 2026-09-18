const mongoose = require('mongoose');
const { PriceAlert, Product, Notification } = require('../models');

let fallbackAlerts = new Map();

// @desc    Get user's configured price drop alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    let alerts = [];
    if (mongoose.connection.readyState === 1) {
      try {
        alerts = await PriceAlert.find({ user: userId })
          .populate('product', 'title brand thumbnailUrl lowestOffer')
          .sort({ createdAt: -1 });
      } catch {
        alerts = [];
      }
    }

    if (!alerts.length && fallbackAlerts.has(String(userId))) {
      alerts = fallbackAlerts.get(String(userId));
    }

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new price drop alert
// @route   POST /api/alerts
// @access  Private
const createAlert = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { productId, targetPrice, email } = req.body;

    if (!productId || !targetPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId and targetPrice.',
      });
    }

    let product = null;
    let alertDoc = null;

    if (mongoose.connection.readyState === 1) {
      try {
        product = await Product.findById(productId);
        alertDoc = await PriceAlert.create({
          user: userId,
          product: productId,
          targetPrice: Number(targetPrice),
          initialPrice: product?.lowestOffer?.effectivePrice || Number(targetPrice) * 1.1,
          email: email || req.user?.email,
        });
      } catch {
        alertDoc = null;
      }
    }

    if (!alertDoc) {
      const initialPrice = product?.lowestOffer?.effectivePrice || Number(targetPrice) * 1.1;
      const userKey = String(userId);
      const current = fallbackAlerts.get(userKey) || [];
      alertDoc = {
        _id: 'alert-' + Date.now(),
        user: userId,
        product: product || { _id: productId, title: 'Product ' + productId },
        targetPrice: Number(targetPrice),
        initialPrice,
        email: email || req.user?.email,
        isTriggered: false,
        createdAt: new Date(),
      };
      current.push(alertDoc);
      fallbackAlerts.set(userKey, current);
    }

    res.status(201).json({
      success: true,
      message: `Alert set! We'll notify you when the price drops below ₹${targetPrice}.`,
      data: alertDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a price alert
// @route   DELETE /api/alerts/:id
// @access  Private
const deleteAlert = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    try {
      await PriceAlert.findOneAndDelete({ _id: id, user: userId });
    } catch {
      const userKey = String(userId);
      const current = fallbackAlerts.get(userKey) || [];
      fallbackAlerts.set(userKey, current.filter((a) => a._id !== id));
    }

    res.status(200).json({
      success: true,
      message: 'Price alert cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Trigger check helper (called by sync workers or price drop simulations)
const triggerAlertsIfEligible = async (productId, currentEffectivePrice) => {
  try {
    const alerts = await PriceAlert.find({
      product: productId,
      isTriggered: false,
      targetPrice: { $gte: Number(currentEffectivePrice) },
    }).populate('product', 'title');

    for (const alert of alerts) {
      alert.isTriggered = true;
      alert.triggeredAt = new Date();
      await alert.save();

      // Create in-app notification
      await Notification.create({
        user: alert.user,
        product: productId,
        type: 'price_drop',
        title: 'Price Drop Alert Triggered!',
        message: `Great news! ${alert.product?.title || 'Your watched product'} has dropped to ₹${currentEffectivePrice}, hitting your target price of ₹${alert.targetPrice}.`,
      });
    }

    return alerts.length;
  } catch (err) {
    console.error(`[triggerAlertsIfEligible Error] ${err.message}`);
    return 0;
  }
};

module.exports = {
  getAlerts,
  createAlert,
  deleteAlert,
  triggerAlertsIfEligible,
};
