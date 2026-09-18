import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/savora';

  if (!process.env.MONGODB_URI) {
    console.warn('[MongoDB Config] Warning: MONGODB_URI environment variable is not explicitly set. Using local fallback URI.');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Connection Warning] Could not connect to MongoDB at ${uri}: ${error.message}. Running with in-memory dataset fallback.`);
  }
};
