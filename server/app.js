const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const {
  apiLimiter,
  authLimiter,
  aiLimiter,
  mongoSanitize,
  xssClean,
} = require('./middleware/securityMiddleware');

const app = express();

// Security Middlewares: Helmet with CSP
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:', 'http:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive during early development
    },
    credentials: true,
  })
);

// Body Parsers & Input Sanitizers
app.use(express.json({ limit: '10kb' })); // Max payload limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize); // Strip NoSQL injection operators ($gt, $ne, etc.)
app.use(xssClean); // Strip HTML & script tags

// General API Rate Limiter
app.use('/api/', apiLimiter);

// HTTP Request Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Base System Health Check Route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    success: true,
    platform: 'SmartPrice API Gateway',
    version: '1.0.0',
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to SmartPrice API. Navigate to /api/health for system diagnostic status.',
  });
});

// API Route Modules
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/retailers', require('./routes/retailerRoutes'));
app.use('/api/compare', require('./routes/comparisonRoutes'));
app.use('/api/matching', require('./routes/matchingRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ai', aiLimiter, require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
