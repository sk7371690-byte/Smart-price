const express = require('express');
const router = express.Router();
const {
  getAlerts,
  createAlert,
  deleteAlert,
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All alert routes require authentication

router.get('/', getAlerts);
router.post('/', createAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
