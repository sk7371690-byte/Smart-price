const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductOffers,
} = require('../controllers/productController');
const {
  getPriceHistory,
  recordSnapshot,
} = require('../controllers/historyController');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/offers', getProductOffers);
router.get('/:id/history', getPriceHistory);
router.post('/:id/history', recordSnapshot);

module.exports = router;
