import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, ArrowLeft, Utensils, MessageSquare, Sparkles } from 'lucide-react';
import FoodCard from '../../components/user/FoodCard';
import API from '../../api/axiosInstance';
import { useSelector } from 'react-redux';

export default function RestaurantDetail() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

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
      setRestaurant(data.restaurant);
      setMenu(data.menu || []);
    } catch (err) {
      console.warn('Fetch restaurant error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/restaurant/${id}`);
      setReviews(data);
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

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Restaurant Not Found</h2>
        <Link to="/" className="text-brand-400 hover:underline mt-2 inline-block">Return to Homepage</Link>
      </div>
    );
  }

  const categories = ['All', ...new Set(menu.map((m) => m.category))];
  const filteredMenu = selectedCategory === 'All' ? menu : menu.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Restaurants
      </Link>

      {/* Restaurant Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.3] -z-10"
        />

        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {restaurant.rating || 4.9}
            </span>
            {restaurant.cuisine?.map((c, i) => (
              <span key={i} className="bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-medium px-2.5 py-0.5 rounded-md">
                {c}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{restaurant.name}</h1>
          <p className="text-sm text-slate-300">{restaurant.description || restaurant.tagline}</p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300 font-medium border-t border-white/10">
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
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
        <h2 className="text-xl font-bold text-white tracking-tight">Artisanal Menu Items</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMenu.map((item) => (
            <FoodCard key={item._id} foodItem={item} restaurant={restaurant} />
          ))}
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="pt-8 border-t border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
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
              placeholder="Tell us about the flavors, presentation, and delivery speed..."
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
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${
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
