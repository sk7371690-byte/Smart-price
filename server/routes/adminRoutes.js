const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  triggerRetailerSync,
  getAllProductsAdmin,
  toggleProductStatus,
  getAllUsersAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// System analytics and health
router.get('/analytics', getDashboardAnalytics);

// Retailer manual sync trigger
router.post('/sync', triggerRetailerSync);

// Product catalog management
router.get('/products', getAllProductsAdmin);
router.patch('/products/:id/toggle', toggleProductStatus);

// User management
router.get('/users', getAllUsersAdmin);

module.exports = router;
