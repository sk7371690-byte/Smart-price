const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'smartprice_fallback_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = {
  generateToken,
};
