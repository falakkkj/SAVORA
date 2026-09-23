import React, { useState } from 'react';
import { X, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';
import API from '../../api/axiosInstance';

export default function AddItemModal({ isOpen, onClose, restaurantId, onItemAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    price: '',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    tags: 'Chef Special, Mughlai',
    calories: '550',
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Trigger Gemini AI Description Generation
  const handleGenerateAIDescription = async () => {
    if (!formData.name) {
      alert('Please enter a food item name first (e.g., "Butter Chicken & Garlic Naan").');
      return;
    }

    setAiLoading(true);
    try {
      const { data } = await API.post('/ai/generate-description', {
        name: formData.name,
        category: formData.category,
        ingredients: formData.ingredients,
      });

      if (data.description) {
        setFormData((prev) => ({ ...prev, description: data.description }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'AI description generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/foods', {
        restaurant: restaurantId || 'rest_001',
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 350,
        category: formData.category,
        image: formData.image,
        tags: formData.tags.split(',').map((t) => t.trim()),
        calories: parseInt(formData.calories) || 450,
      });

      if (onItemAdded) onItemAdded();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Add New Culinary Dish</h2>
            <p className="text-xs text-slate-400">Create an Indian dish for your menu with AI-assisted descriptions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Butter Chicken & Garlic Naan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="Appetizers">Appetizers</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
                <option value="Sides">Sides</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹) *</label>
              <input
                type="number"
                step="1"
                required
                placeholder="350"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ingredients / Notes (for AI)</label>
              <input
                type="text"
                placeholder="e.g. tandoori chicken, tomato butter gravy, saffron"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* AI Food Description Generator Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">Food Description *</label>
              <button
                type="button"
                onClick={handleGenerateAIDescription}
                disabled={aiLoading}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30 transition-all glow-purple"
              >
                {aiLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{aiLoading ? 'Gemini Generating...' : '✨ Generate with Gemini AI'}</span>
              </button>
            </div>
            <textarea
              required
              rows={3}
              placeholder="Detailed appetizing description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-3 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-purple-600/30 flex items-center justify-center gap-2"
          >
            {submitting ? 'Saving Dish...' : 'Save & Publish to Menu'}
          </button>
        </form>

      </div>
    </div>
  );
}
