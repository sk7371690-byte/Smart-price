const express = require('express');
const router = express.Router();
const {
  compareByProductId,
  compareByQuery,
} = require('../controllers/comparisonController');

router.get('/', compareByQuery);
router.get('/product/:id', compareByProductId);

module.exports = router;
