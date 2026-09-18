const express = require('express');
const router = express.Router();
const { searchSuggestions } = require('../controllers/productController');

router.get('/', searchSuggestions);

module.exports = router;
