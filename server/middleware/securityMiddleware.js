const rateLimit = require('express-rate-limit');

/**
 * Standard API Rate Limiter
 * 300 requests per 15-minute window per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
    retryAfterMinutes: 15,
  },
});

/**
 * Strict Auth Rate Limiter
 * 20 attempts per 15-minute window to stop credential brute-forcing
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login/registration attempts from this IP. Please try again after 15 minutes.',
    retryAfterMinutes: 15,
  },
});

/**
 * Dedicated AI & Scraper Query Limiter
 * 60 requests per minute to prevent compute exhaustion
 */
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI query rate limit exceeded. Please wait a moment before trying again.',
    retryAfterMinutes: 1,
  },
});

/**
 * Recursive sanitizer removing keys starting with '$' or containing '.'
 * Protects against NoSQL query selector injection in MongoDB
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Strip leading '$' or embedded '.'
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = typeof value === 'object' && value !== null ? sanitizeObject(value) : value;
  }
  return clean;
}

/**
 * Middleware protecting against MongoDB Operator Injection
 */
const mongoSanitize = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

/**
 * Strips dangerous HTML tags (<script>, <iframe onload=>, etc.)
 * Protects against Cross-Site Scripting (XSS) in user submitted text
 */
function stripHtml(val) {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function sanitizeXssObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeXssObject);
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = stripHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeXssObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Middleware stripping HTML/script tags from input
 */
const xssClean = (req, res, next) => {
  if (req.body) req.body = sanitizeXssObject(req.body);
  if (req.query) req.query = sanitizeXssObject(req.query);
  if (req.params) req.params = sanitizeXssObject(req.params);
  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter,
  mongoSanitize,
  xssClean,
};
