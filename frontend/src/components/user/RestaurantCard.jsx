import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group glass-card rounded-2xl overflow-hidden glass-card-hover border border-slate-800 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden bg-slate-800">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 glass-panel px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 shadow-lg">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white">{restaurant.rating || 4.8}</span>
        </div>

        {/* Cuisine Pills */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {restaurant.cuisine?.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold text-slate-200 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-normal">
            {restaurant.tagline || restaurant.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span>{restaurant.deliveryTime || '20-30 min'}</span>
          </div>

          <div className="flex items-center gap-1 truncate max-w-[140px]">
            <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>

          <span className="text-slate-200 font-bold">{restaurant.priceRange || '$$'}</span>
        </div>
      </div>
    </Link>
  );
}
