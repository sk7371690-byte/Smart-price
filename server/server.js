require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start Server Listener
const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` SmartPrice Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(` API Endpoint: http://localhost:${PORT}`);
  console.log(` Health Status: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] Error: ${err.message}`);
  // Keep server running in development; do not exit abruptly
});
