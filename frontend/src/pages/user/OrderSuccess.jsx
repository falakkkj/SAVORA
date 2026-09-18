import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, Utensils } from 'lucide-react';
import API from '../../api/axiosInstance';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      // Trigger Webhook payment confirmation simulation
      API.post('/orders/webhook', { orderId });
    }
  }, [orderId]);

  return (
    <div className="max-w-md mx-auto my-16 text-center space-y-6">
      <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 glow-purple space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Payment Confirmed!</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your gourmet order has been successfully placed and transmitted to the kitchen.
          </p>
        </div>

        {orderId && (
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
            Order Reference: <strong className="text-brand-400">#{orderId.slice(-8).toUpperCase()}</strong>
          </div>
        )}

        <div className="pt-2">
          <Link
            to="/my-orders"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>Track Order Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
