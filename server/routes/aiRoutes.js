const express = require('express');
const router = express.Router();
const {
  parseSearchQuery,
  getRecommendation,
  smartSearch,
} = require('../controllers/aiController');

// Parse natural language query to extract structured filters
router.post('/parse-query', parseSearchQuery);

// Get AI Deal Score, buying verdict, and rationale for product
router.post('/recommend', getRecommendation);

// Smart AI Search (Parse prompt + filter catalog + attach deal scores)
router.get('/smart-search', smartSearch);

module.exports = router;
