import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Sparkles, User as UserIcon, LogOut, LayoutDashboard, Clock, UtensilsCrossed } from 'lucide-react';
import { logout } from '../../store/authSlice';
import { toggleCartDrawer } from '../../store/cartSlice';
import AuthModal from './AuthModal';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 p-0.5 glow-brand transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-brand-500" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SAVORA
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] font-bold tracking-widest text-brand-500 uppercase bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20 shadow">
                AI Powered
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link 
              to="/" 
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Explore Restaurants
            </Link>

            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3.5 py-1.5 rounded-xl border border-purple-500/30 transition-all hover:bg-purple-500/20 glow-purple"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            {user && (
              <Link 
                to="/my-orders" 
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <Clock className="w-4 h-4 text-brand-500" />
                <span className="hidden sm:inline">My Orders</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={() => dispatch(toggleCartDrawer())}
              className={`relative p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border text-slate-200 hover:text-white transition-all group ${
                cartItemCount > 0 ? 'border-brand-500/50 glow-brand' : 'border-slate-700/60'
              }`}
            >
              <ShoppingBag className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-brand-600 to-rose-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse glow-brand shadow">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 p-0.5 shadow">
                  <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center text-xs font-extrabold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={() => dispatch(logout())}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-brand-600/30"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}
    </>
  );
}
