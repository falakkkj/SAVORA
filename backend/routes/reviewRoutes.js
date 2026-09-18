import express from 'express';
import { getReviewsByRestaurant, createReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getReviewsByRestaurant);
router.post('/', protect, createReview);

export default router;
