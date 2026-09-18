import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../store/orderSlice';
import { Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';

const STATUS_ICONS = {
  Pending: AlertCircle,
  Preparing: Clock,
  'Out for Delivery': Truck,
  Delivered: CheckCircle2,
};

export default function OrderHistory() {
  const dispatch = useDispatch();
  const { userOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Order History Timeline</h1>
        <p className="text-xs text-slate-400 mt-1">Track your active orders in real-time or view past culinary purchases</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : userOrders.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No active or past orders</h3>
          <p className="text-xs text-slate-400 mt-1">Place an order from one of our partner restaurants to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const StatusIcon = STATUS_ICONS[order.status] || Clock;

            return (
              <div key={order._id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-400">#{order._id?.slice(-8).toUpperCase()}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{order.restaurant?.name || 'Gourmet Restaurant'}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">${order.totalAmount?.toFixed(2)}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-brand-500/10 border-brand-500/20 text-brand-400'
                    }`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-300">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-semibold text-slate-200">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Status Step Bar */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                    {['Pending', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, i) => {
                      const active = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'].indexOf(order.status) >= i;
                      return (
                        <div key={step} className={`py-1 rounded border transition-all ${
                          active ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}>
                          {step}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
