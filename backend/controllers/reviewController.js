import Review from '../models/Review.js';
import mongoose from 'mongoose';
import { mockReviews } from '../config/mockData.js';

let memoryReviews = [...mockReviews];

export const getReviewsByRestaurant = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find({ restaurant: req.params.restaurantId }).sort({ createdAt: -1 });
      if (reviews.length > 0) return res.json(reviews);
    }
    const filtered = memoryReviews.filter(r => r.restaurant === req.params.restaurantId);
    res.json(filtered.length > 0 ? filtered : memoryReviews);
  } catch (error) {
    res.json(memoryReviews);
  }
};

export const createReview = async (req, res) => {
  try {
    const { restaurant, rating, comment } = req.body;

    let sentiment = 'Positive';
    if (rating <= 2) sentiment = 'Negative';
    else if (rating === 3) sentiment = 'Neutral';

    if (mongoose.connection.readyState === 1) {
      const review = new Review({
        restaurant,
        customer: req.user._id,
        customerName: req.user.name || 'Anonymous Gourmet',
        rating,
        comment,
        aiSentiment: sentiment,
        aiKeywords: rating >= 4 ? ['Great Food', 'Flavorful'] : ['Service', 'Portion'],
      });

      const savedReview = await review.save();
      return res.status(201).json(savedReview);
    }

    const newRev = {
      _id: 'rev_' + Date.now(),
      restaurant,
      customerName: req.user?.name || 'Anonymous Gourmet',
      rating,
      comment,
      aiSentiment: sentiment,
      aiKeywords: rating >= 4 ? ['Great Food', 'Flavorful'] : ['Service', 'Portion'],
      createdAt: new Date().toISOString(),
    };

    memoryReviews.unshift(newRev);
    res.status(201).json(newRev);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
