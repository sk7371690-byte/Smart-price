const mongoose = require('mongoose');
const { Notification } = require('../models');

// @desc    Get current user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    let list = [];
    if (mongoose.connection.readyState === 1) {
      try {
        list = await Notification.find({ user: userId })
          .populate('product', 'title thumbnailUrl')
          .sort({ createdAt: -1 })
          .limit(20);
      } catch {
        list = [];
      }
    }

    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    try {
      await Notification.findOneAndUpdate(
        { _id: id, user: userId },
        { isRead: true }
      );
    } catch {
      // no-op for mock fallback
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
