import { createSlice } from '@reduxjs/toolkit';

const storedCart = localStorage.getItem('savora_cart');

const initialState = storedCart
  ? JSON.parse(storedCart)
  : { items: [], restaurant: null, totalAmount: 0, isDrawerOpen: false };

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { foodItem, restaurant } = action.payload;

      // Reset cart if adding from a different restaurant
      if (state.restaurant && state.restaurant._id !== restaurant._id) {
        state.items = [];
      }

      state.restaurant = restaurant;
      const existing = state.items.find((i) => i.foodItem === foodItem._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          foodItem: foodItem._id,
          name: foodItem.name,
          price: foodItem.price,
          image: foodItem.image,
          quantity: 1,
        });
      }

      state.totalAmount = calculateTotal(state.items);
      localStorage.setItem('savora_cart', JSON.stringify({
        items: state.items,
        restaurant: state.restaurant,
        totalAmount: state.totalAmount
      }));
    },
    removeFromCart: (state, action) => {
      const foodId = action.payload;
      const existing = state.items.find((i) => i.foodItem === foodId);

      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.foodItem !== foodId);
        }
      }

      if (state.items.length === 0) {
        state.restaurant = null;
      }

      state.totalAmount = calculateTotal(state.items);
      localStorage.setItem('savora_cart', JSON.stringify({
        items: state.items,
        restaurant: state.restaurant,
        totalAmount: state.totalAmount
      }));
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurant = null;
      state.totalAmount = 0;
      localStorage.removeItem('savora_cart');
    },
    toggleCartDrawer: (state, action) => {
      state.isDrawerOpen = action.payload !== undefined ? action.payload : !state.isDrawerOpen;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, toggleCartDrawer } = cartSlice.actions;
export default cartSlice.reducer;
