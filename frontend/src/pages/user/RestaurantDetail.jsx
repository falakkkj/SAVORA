import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, ArrowLeft, Utensils, MessageSquare, Sparkles } from 'lucide-react';
import FoodCard from '../../components/user/FoodCard';
import Toast from '../../components/common/Toast';
import API from '../../api/axiosInstance';
import { useSelector } from 'react-redux';

const MOCK_RESTAURANTS = {
  rest_001: {
    restaurant: {
      _id: 'rest_001',
      name: 'Maharaja Royal Indian Cuisine',
      tagline: 'Authentic North & South Indian Fine Dining',
      description: 'Experience regal Indian gastronomy featuring slow-cooked Mughlai curries, aromatic biryanis, and tandoori charcoal delicacies.',
      cuisine: ['North Indian', 'Mughlai', 'Biryani'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      address: '74 Park Street, Connaught Place',
      rating: 4.9,
      deliveryTime: '20-30 min',
      priceRange: '₹₹₹',
    },
    menu: [
      {
        _id: 'food_001',
        restaurant: 'rest_001',
        name: 'Butter Chicken & Garlic Naan',
        description: 'Tender tandoori chicken simmered in rich velvet tomato butter gravy, served with fluffy garlic butter naan.',
        price: 380,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
        tags: ['Bestseller', 'Mughlai', 'Chef Special'],
        calories: 680,
      },
      {
        _id: 'food_002',
        restaurant: 'rest_001',
        name: 'Paneer Tikka Angara',
        description: 'Cottage cheese cubes marinated in spicy Kashmiri chili yogurt and smoked over charcoal tandoor.',
        price: 290,
        category: 'Appetizers',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
        tags: ['Vegetarian', 'Tandoori'],
        calories: 420,
      },
      {
        _id: 'food_003',
        restaurant: 'rest_001',
        name: 'Gulab Jamun with Saffron Rabri',
        description: 'Warm golden khoya dumplings soaked in rose cardamom syrup topped with thick creamy rabri.',
        price: 140,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        tags: ['Sweet', 'Dessert'],
        calories: 390,
      }
    ]
  },
  rest_002: {
    restaurant: {
      _id: 'rest_002',
      name: 'Spice Symphony Tandoor Bistro',
      tagline: 'Clay-Oven Grills & Coastal Indian Delights',
      description: 'Fresh tandoori tikka, buttery naan breads, sizzling kebabs, and authentic South Indian dosa varieties.',
      cuisine: ['Tandoori', 'South Indian', 'Street Food'],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      address: '12 MG Road, Indiranagar',
      rating: 4.8,
      deliveryTime: '25-35 min',
      priceRange: '₹₹',
    },
    menu: [
      {
        _id: 'food_004',
        restaurant: 'rest_002',
        name: 'Hyderabadi Zafrani Dum Biryani',
        description: 'Fragrant long-grain basmati rice layered with spiced cottage cheese/chicken, saffron, caramelized onions, and mint.',
        price: 340,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        tags: ['Biryani', 'Spicy', 'Chef Special'],
        calories: 720,
      },
      {
        _id: 'food_005',
        restaurant: 'rest_002',
        name: 'Crispy Masala Dosa Platter',
        description: 'Golden thin rice crepe filled with tempered potato masala, served with piping hot sambar and coconut chutney.',
        price: 180,
        category: 'Appetizers',
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
        tags: ['South Indian', 'Vegan'],
        calories: 350,
      },
      {
        _id: 'food_006',
        restaurant: 'rest_002',
        name: 'Alphonso Mango Lassi',
        description: 'Chilled thick yogurt smoothie blended with sweet Alphonso mango pulp and cardamom powder.',
        price: 120,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        tags: ['Refreshing', 'Vegetarian'],
        calories: 210,
      }
    ]
  },
  rest_003: {
    restaurant: {
      _id: 'rest_003',
      name: 'Mumbai Street Spice Co.',
      tagline: 'Authentic Chaat, Vada Pav & BOMBAY Street Delights',
      description: 'Crispy Pani Puri, Mumbai Vada Pav, Pav Bhaji cooked on large tawa, and sizzling Bhel Puri.',
      cuisine: ['Street Food', 'North Indian', 'Snacks'],
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
      address: '45 Chowpatty Beach Road, Marine Drive',
      rating: 4.7,
      deliveryTime: '15-25 min',
      priceRange: '₹',
    },
    menu: [
      {
        _id: 'food_007',
        restaurant: 'rest_003',
        name: 'Mumbai Butter Pav Bhaji',
        description: 'Spicy mashed vegetable curry topped with generous Amul butter, served with soft toasted pavs and lemon.',
        price: 160,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        tags: ['Street Food', 'Bestseller', 'Vegetarian'],
        calories: 520,
      },
      {
        _id: 'food_008',
        restaurant: 'rest_003',
        name: 'Authentic Bombay Vada Pav (2 Pcs)',
        description: 'Spicy garlic potato fritter sandwiched in soft bakery bun with dry garlic chutney and fried green chili.',
        price: 90,
        category: 'Appetizers',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        tags: ['Bombay Classic', 'Spicy'],
        calories: 380,
      },
      {
        _id: 'food_009',
        restaurant: 'rest_003',
        name: 'Classic Pani Puri Platter (8 Pcs)',
        description: 'Crispy hollow puris filled with spiced potato chickpea mash, served with cold mint pani and sweet tamarind chutney.',
        price: 110,
        category: 'Appetizers',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        tags: ['Chaat', 'Street Food'],
        calories: 240,
      }
    ]
  },
  rest_004: {
    restaurant: {
      _id: 'rest_004',
      name: 'Chennai Express Tiffin & Dosa Hub',
      tagline: 'Traditional South Indian Chettinad & Filter Coffee',
      description: 'Steaming hot idlis, crispy ghee roast dosas, vada dipping sambar, and authentic Kumbakonam filter coffee.',
      cuisine: ['South Indian', 'Breakfast'],
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80',
      address: '88 Anna Salai, T. Nagar',
      rating: 4.9,
      deliveryTime: '15-25 min',
      priceRange: '₹',
    },
    menu: [
      {
        _id: 'food_010',
        restaurant: 'rest_004',
        name: 'Ghee Roast Masala Dosa',
        description: 'Crispy paper thin crepe roasted with fragrant desi ghee, stuffed with spiced potato masala, served with 3 chutneys.',
        price: 210,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
        tags: ['South Indian', 'Ghee Roast', 'Chef Special'],
        calories: 460,
      },
      {
        _id: 'food_011',
        restaurant: 'rest_004',
        name: 'Steaming Button Idli Sambar Dip (10 Pcs)',
        description: 'Soft fluffy mini rice cakes submerged in hot aromatic Chettinad lentil sambar drizzled with ghee.',
        price: 150,
        category: 'Appetizers',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        tags: ['Healthy', 'Breakfast'],
        calories: 290,
      },
      {
        _id: 'food_012',
        restaurant: 'rest_004',
        name: 'Traditional Kumbakonam Filter Coffee',
        description: 'Authentic decoction coffee brewed with chicory and frothed in a brass tumbler.',
        price: 80,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        tags: ['Traditional', 'Hot Coffee'],
        calories: 120,
      }
    ]
  },
  rest_005: {
    restaurant: {
      _id: 'rest_005',
      name: 'Peshawri Tandoor & Kebab Grill',
      tagline: 'Charcoal-Grilled Mughlai Kebabs & Rich Gravies',
      description: 'Succulent Galouti kebabs, fiery chicken tikka, Kashmiri rogan josh, and soft rumali roti.',
      cuisine: ['Tandoori', 'Mughlai', 'North Indian'],
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1200&q=80',
      address: '22 Khan Market, New Delhi',
      rating: 4.9,
      deliveryTime: '30-40 min',
      priceRange: '₹₹₹',
    },
    menu: [
      {
        _id: 'food_013',
        restaurant: 'rest_005',
        name: 'Royal Galouti Kebab with Paratha',
        description: 'Melt-in-mouth spiced minced mutton kebabs served with flaky saffron Mughlai paratha.',
        price: 360,
        category: 'Appetizers',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
        tags: ['Mughlai', 'Chef Special', 'Non-Veg'],
        calories: 580,
      },
      {
        _id: 'food_014',
        restaurant: 'rest_005',
        name: 'Kashmiri Mutton Rogan Josh',
        description: 'Slow-cooked tender mutton curry infused with rattan jot and rich aromatic Kashmiri whole spices.',
        price: 420,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80',
        tags: ['Authentic', 'Royal Gravy'],
        calories: 640,
      },
      {
        _id: 'food_015',
        restaurant: 'rest_005',
        name: 'Garlic Butter Rumali Roti (3 Pcs)',
        description: 'Paper-thin soft hand-tossed breads baked over an inverted copper wok with garlic butter glaze.',
        price: 90,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        tags: ['Fresh Bread', 'Tandoori'],
        calories: 220,
      }
    ]
  },
  rest_006: {
    restaurant: {
      _id: 'rest_006',
      name: 'Punjab Da Dhaba & Paratha House',
      tagline: 'Rustic Highway Dhaba Flavors & Lassi',
      description: 'Amritsari Kulcha, Dal Makhani slow-cooked overnight, Sarson Ka Saag with Makki Roti, and thick sweet lassi.',
      cuisine: ['North Indian', 'Dhaba Style'],
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
      address: 'GT Road, Highway Milestone 42',
      rating: 4.8,
      deliveryTime: '20-35 min',
      priceRange: '₹₹',
    },
    menu: [
      {
        _id: 'food_016',
        restaurant: 'rest_006',
        name: 'Amritsari Stuffed Kulcha & Chole',
        description: 'Crispy layered clay-oven bread stuffed with spiced potato & cottage cheese, served with spicy chole curry.',
        price: 240,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        tags: ['Dhaba Special', 'Punjabi'],
        calories: 610,
      },
      {
        _id: 'food_017',
        restaurant: 'rest_006',
        name: 'Signature Dal Makhani',
        description: 'Whole black lentils slow-cooked overnight on charcoal coals with fresh white butter and heavy cream.',
        price: 280,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        tags: ['Bestseller', 'Creamy', 'Vegetarian'],
        calories: 510,
      },
      {
        _id: 'food_018',
        restaurant: 'rest_006',
        name: 'Kulhad Malai Lassi',
        description: 'Thick creamy sweetened churned yogurt served in traditional earthy clay kulhad topped with rabri layer.',
        price: 130,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        tags: ['Chilled', 'Punjabi Special'],
        calories: 280,
      }
    ]
  }
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const fallback = MOCK_RESTAURANTS[id] || MOCK_RESTAURANTS.rest_001;

  const [restaurant, setRestaurant] = useState(fallback.restaurant);
  const [menu, setMenu] = useState(fallback.menu);
  const [reviews, setReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchRestaurantDetail();
    fetchReviews();
  }, [id]);

  const fetchRestaurantDetail = async () => {
    try {
      const { data } = await API.get(`/restaurants/${id}`);
      if (data?.restaurant) setRestaurant(data.restaurant);
      if (Array.isArray(data?.menu) && data.menu.length > 0) setMenu(data.menu);
    } catch (err) {
      console.warn('Fetch restaurant error, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/restaurant/${id}`);
      if (Array.isArray(data)) setReviews(data);
    } catch (err) {
      console.warn('Fetch reviews error:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to post a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await API.post('/reviews', {
        restaurant: id,
        rating: newRating,
        comment: newComment,
      });
      setNewComment('');
      setToastMessage('Review submitted & analyzed by AI!');
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const categories = ['All', ...new Set(menu.map((m) => m.category))];
  const filteredMenu = selectedCategory === 'All' ? menu : menu.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Back Link */}
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Restaurants
      </Link>

      {/* Restaurant Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10 shadow-2xl">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.3] -z-10"
        />

        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {restaurant.rating || 4.9}
            </span>
            {restaurant.cuisine?.map((c, i) => (
              <span key={i} className="bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                {c}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{restaurant.name}</h1>
          <p className="text-sm text-slate-300 leading-relaxed">{restaurant.description || restaurant.tagline}</p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300 font-semibold border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-500" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span>{restaurant.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-lg glow-brand'
                : 'glass-panel text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white tracking-tight">Artisanal Menu Items</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMenu.map((item) => (
            <FoodCard key={item._id} foodItem={item} restaurant={restaurant} onAddedToast={(msg) => setToastMessage(msg)} />
          ))}
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="pt-8 border-t border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-500" /> Customer Reviews & AI Feedback
          </h2>
          <span className="text-xs font-semibold text-slate-400">{reviews.length} Verified Reviews</span>
        </div>

        {/* Post Review Form */}
        {user && (
          <form onSubmit={handleReviewSubmit} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white">Leave Your Gourmet Review</h4>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              required
              rows={2}
              placeholder="Tell us about the flavors, spices, naan texture, and delivery speed..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div key={rev._id} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{rev.customerName || 'Anonymous Foodie'}</span>
                <div className="flex gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300">{rev.comment}</p>
              {rev.aiSentiment && (
                <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  rev.aiSentiment === 'Positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  ✨ AI Sentiment: {rev.aiSentiment}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
