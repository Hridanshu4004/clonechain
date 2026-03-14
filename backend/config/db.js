import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // 1. Establish the initial connection
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clonechain');

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // 2. Monitor connection events (Post-Connection)
    mongoose.connection.on('error', (err) => {
      console.error(`🔥 Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Mongoose disconnected. Attempting to reconnect...');
    });

  } catch (error) {
    console.error(`❌ Initial Connection Error: ${error.message}`);
    process.exit(1); // Stop the server if we can't connect at startup
  }
};

// Handle Graceful Shutdown (Important for production)
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;