import React from 'react';
import { UtensilsCrossed, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-dark-900/80 backdrop-blur-lg py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">SAVORA</span>
            <p className="text-xs text-slate-400">AI-Powered Culinary Experience</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Powered by Gemini AI & Stripe Payments</span>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Food Enthusiasts © {new Date().getFullYear()}
        </p>

      </div>
    </footer>
  );
}
