/**
 * MongoDB connection helper.
 *
 * Establishes a connection to the MongoDB instance using the URI
 * specified in environment variables.
 */
const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 *
 * @returns {Promise<void>} Resolves when the database is connected.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;