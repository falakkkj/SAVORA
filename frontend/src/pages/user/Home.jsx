import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Utensils, Star, Flame, ChevronRight, ShieldCheck, Heart } from 'lucide-react';
import RestaurantCard from '../../components/user/RestaurantCard';
import Toast from '../../components/common/Toast';
import API from '../../api/axiosInstance';

const DEFAULT_RESTAURANTS = [
  {
    _id: 'rest_001',
    name: 'Lumina Gourmet Bistro',
    tagline: 'Modern European & Artisanal Comfort Food',
    description: 'Experience sensory dining with locally sourced organic ingredients, wood-fired delights, and hand-crafted sauces.',
    cuisine: ['European', 'Artisanal', 'Italian'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    address: '450 Grand Avenue, Downtown',
    rating: 4.9,
    deliveryTime: '20-30 min',
    priceRange: '$$$',
    isAvailable: true,
  },
  {
    _id: 'rest_002',
    name: 'Sakura & Smoke Izakaya',
    tagline: 'Japanese Ramen, Yakitori & AI Fusion',
    description: 'Authentic 18-hour tonkotsu broth, charcoal-grilled skewers, and contemporary Japanese bowls.',
    cuisine: ['Japanese', 'Ramen', 'Asian Fusion'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    address: '88 Sakura Way, Midtown',
    rating: 4.8,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    isAvailable: true,
  }
];

export default function Home() {
  const [restaurants, setRestaurants] = useState(DEFAULT_RESTAURANTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await API.get('/restaurants');
      if (Array.isArray(data) && data.length > 0) {
        setRestaurants(data);
      }
    } catch (err) {
      console.warn('Restaurants fetch warning, using default restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const cuisines = ['All', 'European', 'Japanese', 'Italian', 'Asian Fusion', 'Artisanal'];

  const filteredRestaurants = (restaurants || DEFAULT_RESTAURANTS).filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || r.cuisine?.includes(selectedCuisine);
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 border border-white/10 glow-brand">
        {/* Animated Background Mesh Glows */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-500/15 rounded-full filter blur-3xl animate-pulseGlow -z-10" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/15 rounded-full filter blur-3xl animate-pulseGlow -z-10" />

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider shadow">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI-Crafted Culinary Experience</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Taste Gourmet Perfection, <br />
            <span className="bg-gradient-to-r from-brand-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              Powered by AI.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Discover top-tier artisanal restaurants, custom AI-enhanced menu selections, and effortless Stripe checkout. Freshly prepared and delivered straight to your door.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
            <input
              type="text"
              placeholder="Search dishes, restaurants, or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Cuisine Filter Pills */}
      <section className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCuisine(c)}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCuisine === c
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg glow-brand scale-105'
                : 'glass-panel text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            {c}
          </button>
        ))}
      </section>

      {/* Restaurants Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Featured Restaurants</h2>
            <p className="text-xs text-slate-400 mt-0.5">Hand-curated dining experiences near you</p>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
            {filteredRestaurants.length} Places
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 glass-card rounded-2xl animate-pulse bg-slate-800/50" />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No restaurants found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filter selections</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
