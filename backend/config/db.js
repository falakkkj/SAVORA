import mongoose from 'mongoose';

/**
 * Global object connection caching for Vercel Serverless environment.
 * Prevents connection exhaustion during cold starts across invocations.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/savora';

  if (!process.env.MONGODB_URI) {
    console.warn('[MongoDB Config] MONGODB_URI environment variable is not explicitly set. Using local fallback URI.');
  }

  // Return existing cached connection if active
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`[MongoDB Serverless] Connected successfully: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch((err) => {
      console.warn(`[MongoDB Connection Warning] Could not connect to MongoDB at ${uri}: ${err.message}. Operating with in-memory dataset fallback.`);
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.warn('[MongoDB Cache Exception]:', e.message);
  }

  return cached.conn;
};

export default connectDB;
