const express = require('express');
const router = express.Router();
const {
  verifyMatch,
  normalize,
} = require('../controllers/matchingController');

router.post('/verify', verifyMatch);
router.post('/normalize', normalize);

module.exports = router;
