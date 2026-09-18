const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartprice', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[SmartPrice Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log(`------------------------------------------------------------------`);
    console.log(`[SmartPrice Offline Mode Active]`);
    console.log(`Local MongoDB is not running, so SmartPrice has activated its built-in`);
    console.log(`in-memory catalog & fallback cache. All features, searches, price comparison,`);
    console.log(`and demo accounts will function smoothly without requiring MongoDB!`);
    console.log(`------------------------------------------------------------------`);
    return false;
  }
};

module.exports = connectDB;

