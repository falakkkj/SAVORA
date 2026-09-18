import React from 'react';
import { useDispatch } from 'react-redux';
import { Clock, CheckCircle2, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { updateOrderStatusThunk } from '../../store/orderSlice';

const COLUMNS = [
  { id: 'Pending', label: 'Pending', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'Preparing', label: 'Preparing', icon: Clock, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { id: 'Delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
];

export default function KanbanBoard({ orders }) {
  const dispatch = useDispatch();

  const handleStatusAdvance = (orderId, currentStatus) => {
    let nextStatus = 'Preparing';
    if (currentStatus === 'Pending') nextStatus = 'Preparing';
    else if (currentStatus === 'Preparing') nextStatus = 'Out for Delivery';
    else if (currentStatus === 'Out for Delivery') nextStatus = 'Delivered';

    dispatch(updateOrderStatusThunk({ id: orderId, status: nextStatus }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const Icon = col.icon;
        const columnOrders = orders.filter((o) => o.status === col.id);

        return (
          <div key={col.id} className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col min-h-[500px]">
            
            {/* Column Header */}
            <div className={`p-3 rounded-xl border flex items-center justify-between mb-4 ${col.color}`}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">{col.label}</h3>
              </div>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                {columnOrders.length}
              </span>
            </div>

            {/* Column Orders */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {columnOrders.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No orders in {col.label.toLowerCase()}
                </div>
              ) : (
                columnOrders.map((order) => (
                  <div key={order._id} className="glass-panel p-4 rounded-xl border border-slate-700/60 hover:border-purple-500/40 transition-all space-y-3 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-semibold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                          #{order._id?.slice(-6).toUpperCase()}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{order.customerName || 'Customer'}</h4>
                      </div>
                      <span className="text-xs font-extrabold text-brand-400">${order.totalAmount?.toFixed(2)}</span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="truncate">{item.quantity}x {item.name}</span>
                          <span className="text-slate-400 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {order.specialNotes && (
                      <p className="text-[11px] text-amber-300 italic bg-amber-500/10 p-1.5 rounded border border-amber-500/20">
                        "{order.specialNotes}"
                      </p>
                    )}

                    {col.id !== 'Delivered' && (
                      <button
                        onClick={() => handleStatusAdvance(order._id, order.status)}
                        className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>Advance Status</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
