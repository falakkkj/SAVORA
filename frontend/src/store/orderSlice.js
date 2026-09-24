import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosInstance';

const MOCK_USER_ORDERS = [
  {
    _id: 'ord_1001',
    customerName: 'Sophia Martinez',
    restaurant: { _id: 'rest_001', name: 'Maharaja Royal Indian Cuisine' },
    items: [
      { foodItem: 'food_001', name: 'Butter Chicken & Garlic Naan', price: 380, quantity: 2 }
    ],
    totalAmount: 760,
    status: 'Preparing',
    paymentStatus: 'Paid',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

const MOCK_ADMIN_ORDERS = [
  {
    _id: 'ord_1001',
    customerName: 'Sophia Martinez',
    customerEmail: 'user@savora.com',
    restaurant: { _id: 'rest_001', name: 'Maharaja Royal Indian Cuisine' },
    items: [
      { foodItem: 'food_001', name: 'Butter Chicken & Garlic Naan', price: 380, quantity: 2 }
    ],
    totalAmount: 760,
    status: 'Preparing',
    paymentStatus: 'Paid',
    specialNotes: 'Make it medium spicy please!',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'ord_1002',
    customerName: 'Marcus Wright',
    customerEmail: 'marcus@example.com',
    restaurant: { _id: 'rest_002', name: 'Spice Symphony Tandoor Bistro' },
    items: [
      { foodItem: 'food_004', name: 'Hyderabadi Zafrani Dum Biryani', price: 340, quantity: 1 },
      { foodItem: 'food_006', name: 'Alphonso Mango Lassi', price: 120, quantity: 1 }
    ],
    totalAmount: 460,
    status: 'Out for Delivery',
    paymentStatus: 'Paid',
    specialNotes: 'Include extra green chutney.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'ord_1003',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@example.com',
    restaurant: { _id: 'rest_001', name: 'Maharaja Royal Indian Cuisine' },
    items: [
      { foodItem: 'food_002', name: 'Paneer Tikka Angara', price: 290, quantity: 1 },
      { foodItem: 'food_003', name: 'Gulab Jamun with Saffron Rabri', price: 140, quantity: 2 }
    ],
    totalAmount: 570,
    status: 'Pending',
    paymentStatus: 'Paid',
    createdAt: new Date().toISOString(),
  }
];

const loadStoredUserOrders = () => {
  try {
    const raw = localStorage.getItem('savora_user_orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load savora_user_orders from localStorage:', e);
  }
  return MOCK_USER_ORDERS;
};

const saveUserOrdersToStorage = (orders) => {
  try {
    localStorage.setItem('savora_user_orders', JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save savora_user_orders to localStorage:', e);
  }
};

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/orders/my-orders');
    if (Array.isArray(data) && data.length > 0) {
      const stored = loadStoredUserOrders();
      const merged = [...stored];
      data.forEach((apiOrd) => {
        if (!merged.some((m) => m._id === apiOrd._id)) {
          merged.push(apiOrd);
        }
      });
      saveUserOrdersToStorage(merged);
      return merged;
    }
    return loadStoredUserOrders();
  } catch (error) {
    return loadStoredUserOrders();
  }
});

export const fetchAdminOrders = createAsyncThunk('orders/fetchAdmin', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/orders/admin/all');
    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_ADMIN_ORDERS;
  } catch (error) {
    return MOCK_ADMIN_ORDERS;
  }
});

export const updateOrderStatusThunk = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/orders/${id}/status`, { status });
    return data;
  } catch (error) {
    return { _id: id, status };
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    userOrders: loadStoredUserOrders(),
    adminOrders: MOCK_ADMIN_ORDERS,
    loading: false,
    error: null,
  },
  reducers: {
    addCreatedOrder: (state, action) => {
      const newOrder = action.payload;
      const filteredUser = state.userOrders.filter((o) => o._id !== newOrder._id);
      state.userOrders = [newOrder, ...filteredUser];
      saveUserOrdersToStorage(state.userOrders);

      const filteredAdmin = state.adminOrders.filter((o) => o._id !== newOrder._id);
      state.adminOrders = [newOrder, ...filteredAdmin];
    },
    updateOrderStatusLocal: (state, action) => {
      const { id, status } = action.payload;
      state.userOrders = state.userOrders.map((o) => (o._id === id ? { ...o, status } : o));
      state.adminOrders = state.adminOrders.map((o) => (o._id === id ? { ...o, status } : o));
      saveUserOrdersToStorage(state.userOrders);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state) => {
        state.loading = false;
        state.userOrders = loadStoredUserOrders();
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state) => {
        state.loading = false;
        state.adminOrders = MOCK_ADMIN_ORDERS;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.adminOrders.findIndex((o) => o._id === updated._id);
        if (index !== -1) {
          state.adminOrders[index] = { ...state.adminOrders[index], ...updated };
        }
        const userIdx = state.userOrders.findIndex((o) => o._id === updated._id);
        if (userIdx !== -1) {
          state.userOrders[userIdx] = { ...state.userOrders[userIdx], ...updated };
          saveUserOrdersToStorage(state.userOrders);
        }
      });
  },
});

export const { addCreatedOrder, updateOrderStatusLocal } = orderSlice.actions;
export default orderSlice.reducer;
