import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// CORS Configuration for standalone or cross-origin deployments
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(express.json());

// API Base Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', system: 'Savora AI MERN Core', time: new Date().toISOString() });
});

// Root API Welcome Check
app.get('/', (req, res) => {
  res.json({ message: 'Savora API Backend is active and running!', health: '/api/health' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Savora Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
