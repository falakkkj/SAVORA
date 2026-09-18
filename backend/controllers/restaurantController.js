import Restaurant from '../models/Restaurant.js';
import FoodItem from '../models/FoodItem.js';
import mongoose from 'mongoose';
import { mockRestaurants, mockFoodItems } from '../config/mockData.js';

let memoryRestaurants = [...mockRestaurants];

export const getRestaurants = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const restaurants = await Restaurant.find({});
      if (restaurants.length > 0) return res.json(restaurants);
    }
    res.json(memoryRestaurants);
  } catch (error) {
    res.json(memoryRestaurants);
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const restaurant = await Restaurant.findById(req.params.id);
      if (restaurant) {
        const menu = await FoodItem.find({ restaurant: req.params.id });
        return res.json({ restaurant, menu });
      }
    }

    const restaurant = memoryRestaurants.find(r => r._id === req.params.id) || memoryRestaurants[0];
    const menu = mockFoodItems.filter(f => f.restaurant === restaurant._id);
    res.json({ restaurant, menu });
  } catch (error) {
    const restaurant = memoryRestaurants[0];
    const menu = mockFoodItems.filter(f => f.restaurant === restaurant._id);
    res.json({ restaurant, menu });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const restaurant = new Restaurant({ ...req.body, owner: req.user._id });
      const created = await restaurant.save();
      return res.status(201).json(created);
    }

    const newRest = { _id: 'rest_' + Date.now(), ...req.body, rating: 5.0 };
    memoryRestaurants.push(newRest);
    res.status(201).json(newRest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const restaurant = await Restaurant.findById(req.params.id);
      if (restaurant) {
        Object.assign(restaurant, req.body);
        const updated = await restaurant.save();
        return res.json(updated);
      }
    }

    const idx = memoryRestaurants.findIndex(r => r._id === req.params.id);
    if (idx !== -1) {
      memoryRestaurants[idx] = { ...memoryRestaurants[idx], ...req.body };
      return res.json(memoryRestaurants[idx]);
    }
    res.status(404).json({ message: 'Restaurant not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
