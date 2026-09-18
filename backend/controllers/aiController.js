import { generateFoodDescriptionAI, analyzeReviewSentimentAI } from '../services/aiService.js';
import Review from '../models/Review.js';

export const generateDescription = async (req, res) => {
  try {
    const { name, category, ingredients } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Food item name is required' });
    }

    const description = await generateFoodDescriptionAI(name, category || 'Main Course', ingredients);
    res.json({ description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAIReviewInsights = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    let query = {};
    if (restaurantId) query.restaurant = restaurantId;

    const reviews = await Review.find(query);
    const insights = await analyzeReviewSentimentAI(reviews);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
