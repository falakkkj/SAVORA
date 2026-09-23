import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, Zap } from 'lucide-react';
import { loginUserThunk, registerUserThunk, clearAuthError, setDirectUser } from '../../store/authSlice';

export default function AuthModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await dispatch(loginUserThunk({ email: formData.email, password: formData.password }));
      onClose();
    } else {
      await dispatch(registerUserThunk(formData));
      onClose();
    }
  };

  const executeInstantDemoLogin = (roleType) => {
    if (roleType === 'admin') {
      const adminUser = {
        _id: 'admin_001',
        name: 'Chef Alex Vance (Admin)',
        email: 'admin@savora.com',
        role: 'admin',
        token: 'demo_jwt_token_admin_2026',
      };
      dispatch(setDirectUser(adminUser));
      dispatch(loginUserThunk({ email: adminUser.email, password: 'adminpassword123' }));
      onClose();
    } else {
      const customerUser = {
        _id: 'user_001',
        name: 'Sophia Martinez',
        email: 'user@savora.com',
        role: 'customer',
        token: 'demo_jwt_token_user_2026',
      };
      dispatch(setDirectUser(customerUser));
      dispatch(loginUserThunk({ email: customerUser.email, password: 'userpassword123' }));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isLogin ? 'Welcome Back to Savora' : 'Join Savora Gourmet'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Sign in to access your cart and custom food orders' : 'Create an account to start ordering delicious dishes'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* 1-Click Quick Demo Sign In Bar */}
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-dark-800 to-brand-950/40 border border-purple-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Instant 1-Click Demo Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => executeInstantDemoLogin('customer')}
              className="py-2 px-3 rounded-xl bg-brand-600/20 hover:bg-brand-600/40 border border-brand-500/40 text-brand-300 text-xs font-bold transition-all shadow"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => executeInstantDemoLogin('admin')}
              className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all shadow"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    formData.role === 'customer'
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    formData.role === 'admin'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Restaurant Admin
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-brand-600/30 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              if (error) dispatch(clearAuthError());
            }}
            className="text-xs text-slate-400 hover:text-white font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
}
