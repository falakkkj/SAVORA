import Order from '../models/Order.js';
import mongoose from 'mongoose';
import { mockOrders, mockRestaurants } from '../config/mockData.js';
import { createCheckoutSession } from '../services/stripeService.js';

let memoryOrders = [...mockOrders];

export const createOrder = async (req, res) => {
  try {
    const { restaurant, items, totalAmount, deliveryAddress, specialNotes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (mongoose.connection.readyState === 1) {
      const order = new Order({
        customer: req.user._id,
        customerName: req.user.name,
        customerEmail: req.user.email,
        restaurant,
        items,
        totalAmount,
        deliveryAddress: deliveryAddress || req.user.address,
        specialNotes,
        status: 'Pending',
        paymentStatus: 'Pending',
      });

      const createdOrder = await order.save();
      const sessionData = await createCheckoutSession(items, createdOrder._id);
      createdOrder.stripeSessionId = sessionData.sessionId;
      await createdOrder.save();

      return res.status(201).json({
        order: createdOrder,
        checkoutUrl: sessionData.url,
        sessionId: sessionData.sessionId,
      });
    }

    // In-memory fallback order creation
    const newId = 'ord_' + Date.now();
    const restObj = mockRestaurants.find(r => r._id === restaurant) || mockRestaurants[0];
    const newOrder = {
      _id: newId,
      customer: req.user?._id || 'user_001',
      customerName: req.user?.name || 'Sophia Martinez',
      customerEmail: req.user?.email || 'user@savora.com',
      restaurant: { _id: restObj._id, name: restObj.name },
      items,
      totalAmount,
      status: 'Pending',
      paymentStatus: 'Paid',
      deliveryAddress,
      specialNotes,
      createdAt: new Date().toISOString(),
    };

    memoryOrders.unshift(newOrder);

    const sessionData = await createCheckoutSession(items, newId);
    res.status(201).json({
      order: newOrder,
      checkoutUrl: sessionData.url,
      sessionId: sessionData.sessionId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ customer: req.user._id })
        .populate('restaurant', 'name image address')
        .sort({ createdAt: -1 });
      if (orders.length > 0) return res.json(orders);
    }
    res.json(memoryOrders);
  } catch (error) {
    res.json(memoryOrders);
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({})
        .populate('restaurant', 'name')
        .populate('customer', 'name email')
        .sort({ createdAt: -1 });
      if (orders.length > 0) return res.json(orders);
    }
    res.json(memoryOrders);
  } catch (error) {
    res.json(memoryOrders);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id);
      if (order) {
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        const updatedOrder = await order.save();
        return res.json(updatedOrder);
      }
    }

    const idx = memoryOrders.findIndex(o => o._id === req.params.id);
    if (idx !== -1) {
      if (status) memoryOrders[idx].status = status;
      if (paymentStatus) memoryOrders[idx].paymentStatus = paymentStatus;
      return res.json(memoryOrders[idx]);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (orderId) {
      if (mongoose.connection.readyState === 1) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'Paid';
          order.status = 'Preparing';
          await order.save();
        }
      }
      const idx = memoryOrders.findIndex(o => o._id === orderId);
      if (idx !== -1) {
        memoryOrders[idx].paymentStatus = 'Paid';
        memoryOrders[idx].status = 'Preparing';
      }
    }
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
