import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Heart, Sparkles } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group glass-card rounded-2xl overflow-hidden glass-card-hover border border-slate-800/80 flex flex-col h-full relative"
    >
      <div className="relative h-52 overflow-hidden bg-slate-800">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 glass-panel px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-extrabold text-white">{restaurant.rating || 4.8}</span>
        </div>

        {/* Favorite Heart Toggle */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full glass-panel border border-white/10 text-white hover:scale-110 transition-transform shadow-lg"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-300'}`} />
        </button>

        {/* Cuisine Pills */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {restaurant.cuisine?.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className="text-[10px] font-bold tracking-wide text-slate-100 bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 shadow"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white group-hover:text-brand-400 transition-colors line-clamp-1 tracking-tight">
              {restaurant.name}
            </h3>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
            {restaurant.tagline || restaurant.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span className="font-semibold">{restaurant.deliveryTime || '20-30 min'}</span>
          </div>

          <div className="flex items-center gap-1 truncate max-w-[140px] text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>

          <span className="text-brand-400 font-extrabold">{restaurant.priceRange || '$$'}</span>
        </div>
      </div>
    </Link>
  );
}
