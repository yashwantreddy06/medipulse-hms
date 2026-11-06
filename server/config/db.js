const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Reads connection URI from MONGO_URI environment variable
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('CRITICAL: MONGO_URI environment variable is not defined.');
    console.error('Please configure MONGO_URI in your server/.env file or environment variables.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    console.error('Make sure your local MongoDB daemon is running or your MongoDB Atlas URI and IP whitelist are properly set.');
    return false;
  }
};

module.exports = connectDB;

