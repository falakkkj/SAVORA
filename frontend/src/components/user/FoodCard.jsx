import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Flame, Sparkles, Check } from 'lucide-react';
import { addToCart } from '../../store/cartSlice';

export default function FoodCard({ foodItem, restaurant, onAddedToast }) {
  const dispatch = useDispatch();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    dispatch(addToCart({ foodItem, restaurant }));
    setAddedAnimation(true);
    if (onAddedToast) onAddedToast(`Added "${foodItem.name}" to cart!`);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="glass-card rounded-2xl p-4.5 border border-slate-800/80 flex flex-col sm:flex-row gap-4 glass-card-hover group relative overflow-hidden">
      
      {/* Food Image */}
      <div className="relative w-full sm:w-40 h-36 rounded-xl overflow-hidden bg-slate-800 shrink-0">
        <img
          src={foodItem.image}
          alt={foodItem.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        {foodItem.tags?.includes('Chef Special') && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-brand-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Special
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base font-extrabold text-white group-hover:text-brand-400 transition-colors">
              {foodItem.name}
            </h4>
            <span className="text-base font-extrabold text-brand-400 shrink-0">
              ${foodItem.price.toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
            {foodItem.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {foodItem.tags?.map((t, i) => (
              <span key={i} className="text-[10px] font-semibold text-slate-300 bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-slate-700/60">
                {t}
              </span>
            ))}
            {foodItem.calories && (
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-0.5">
                <Flame className="w-3 h-3 text-amber-400" /> {foodItem.calories} kcal
              </span>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400">
            Category: <strong className="text-slate-200">{foodItem.category}</strong>
          </span>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow ${
              addedAnimation
                ? 'bg-emerald-600 text-white glow-emerald'
                : 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white shadow-brand-600/30'
            }`}
          >
            {addedAnimation ? <Check className="w-4 h-4 animate-scaleUp" /> : <Plus className="w-4 h-4" />}
            <span>{addedAnimation ? 'Added!' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
