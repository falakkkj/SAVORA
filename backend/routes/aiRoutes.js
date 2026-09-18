import express from 'express';
import { generateDescription, getAIReviewInsights } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/generate-description', protect, adminOnly, generateDescription);
router.get('/analyze-reviews', protect, adminOnly, getAIReviewInsights);

export default router;
