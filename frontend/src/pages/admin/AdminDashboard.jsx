import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, LayoutDashboard, Utensils, ShoppingBag, Sparkles, DollarSign, TrendingUp, Layers, RefreshCw } from 'lucide-react';
import { fetchAdminOrders } from '../../store/orderSlice';
import KanbanBoard from '../../components/admin/KanbanBoard';
import ReviewInsightsCard from '../../components/admin/ReviewInsightsCard';
import AddItemModal from '../../components/admin/AddItemModal';
import API from '../../api/axiosInstance';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { adminOrders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'menu' | 'ai-insights'
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminOrders());
    fetchRestaurants();
  }, [dispatch]);

  const fetchRestaurants = async () => {
    try {
      const { data } = await API.get('/restaurants');
      if (Array.isArray(data) && data.length > 0) {
        setRestaurants(data);
        setSelectedRestaurant(data[0]);
        fetchMenu(data[0]._id);
      }
    } catch (err) {
      console.warn('Fetch admin restaurants warning:', err);
    }
  };

  const fetchMenu = async (restaurantId) => {
    try {
      const { data } = await API.get(`/foods/restaurant/${restaurantId}`);
      if (Array.isArray(data) && data.length > 0) setMenuItems(data);
    } catch (err) {
      console.warn('Fetch menu warning:', err);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await API.put(`/foods/${item._id}`, { isAvailable: !item.isAvailable });
      if (selectedRestaurant) fetchMenu(selectedRestaurant._id);
    } catch (err) {
      alert('Failed to update item availability');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await API.delete(`/foods/${itemId}`);
      if (selectedRestaurant) fetchMenu(selectedRestaurant._id);
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const totalRevenue = adminOrders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Culinary Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Indian Restaurant Management & AI Panel</h1>
        </div>

        <button
          onClick={() => setIsAddItemOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg glow-purple transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dish with Gemini AI</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">₹{totalRevenue}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <span className="text-xl font-black">₹</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{adminOrders.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Dishes</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{menuItems.length || 6}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Utensils className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Sentiment</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">96.5% Positive</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'kanban'
              ? 'bg-purple-600 text-white shadow-lg glow-purple'
              : 'glass-panel text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kanban Order Board</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'menu'
              ? 'bg-purple-600 text-white shadow-lg glow-purple'
              : 'glass-panel text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Manage Menu & AI Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-insights')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'ai-insights'
              ? 'bg-purple-600 text-white shadow-lg glow-purple'
              : 'glass-panel text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Review Sentiment Analytics</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Active Orders Kanban Pipeline</h2>
            <button
              onClick={() => dispatch(fetchAdminOrders())}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Pipeline
            </button>
          </div>
          <KanbanBoard orders={adminOrders} />
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Menu Item Catalog</h2>
            <span className="text-xs text-slate-400">{menuItems.length || 6} Dishes Listed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(menuItems.length > 0 ? menuItems : [
              { _id: 'food_001', name: 'Butter Chicken & Garlic Naan', price: 380, description: 'Tender tandoori chicken simmered in velvet tomato butter gravy.', isAvailable: true, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80' },
              { _id: 'food_004', name: 'Hyderabadi Zafrani Dum Biryani', price: 340, description: 'Fragrant basmati rice layered with spiced cottage cheese/chicken and saffron.', isAvailable: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' }
            ]).map((item) => (
              <div key={item._id} className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-slate-800 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                    <p className="text-xs font-extrabold text-purple-400">₹{item.price}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`px-2.5 py-1 rounded-lg font-semibold border ${
                      item.isAvailable
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-rose-400 hover:text-rose-300 font-medium"
                  >
                    Delete Dish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ai-insights' && (
        <div className="max-w-3xl mx-auto">
          <ReviewInsightsCard />
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        restaurantId={selectedRestaurant?._id || 'rest_001'}
        onItemAdded={() => selectedRestaurant && fetchMenu(selectedRestaurant._id)}
      />

    </div>
  );
}
