const express = require('express');
const router = express.Router();
const {
  getActiveRetailers,
  searchLiveRetailers,
} = require('../controllers/retailerController');

router.get('/', getActiveRetailers);
router.get('/live-search', searchLiveRetailers);

module.exports = router;
