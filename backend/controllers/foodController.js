import FoodItem from '../models/FoodItem.js';
import mongoose from 'mongoose';
import { mockFoodItems } from '../config/mockData.js';

let memoryFoods = [...mockFoodItems];

export const getFoodItemsByRestaurant = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const foods = await FoodItem.find({ restaurant: req.params.restaurantId });
      if (foods.length > 0) return res.json(foods);
    }
    const filtered = memoryFoods.filter(f => f.restaurant === req.params.restaurantId);
    res.json(filtered.length > 0 ? filtered : memoryFoods);
  } catch (error) {
    res.json(memoryFoods);
  }
};

export const createFoodItem = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const foodItem = new FoodItem(req.body);
      const saved = await foodItem.save();
      return res.status(201).json(saved);
    }

    const newItem = { _id: 'food_' + Date.now(), ...req.body, isAvailable: true };
    memoryFoods.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFoodItem = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const foodItem = await FoodItem.findById(req.params.id);
      if (foodItem) {
        Object.assign(foodItem, req.body);
        const updated = await foodItem.save();
        return res.json(updated);
      }
    }

    const idx = memoryFoods.findIndex(f => f._id === req.params.id);
    if (idx !== -1) {
      memoryFoods[idx] = { ...memoryFoods[idx], ...req.body };
      return res.json(memoryFoods[idx]);
    }
    res.status(404).json({ message: 'Food item not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFoodItem = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const foodItem = await FoodItem.findById(req.params.id);
      if (foodItem) {
        await foodItem.deleteOne();
        return res.json({ message: 'Food item removed successfully' });
      }
    }

    memoryFoods = memoryFoods.filter(f => f._id !== req.params.id);
    res.json({ message: 'Food item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
