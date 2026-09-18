import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
  stripeWebhook,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/admin/all', protect, adminOnly, getAllOrdersAdmin);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.post('/webhook', stripeWebhook);

export default router;
