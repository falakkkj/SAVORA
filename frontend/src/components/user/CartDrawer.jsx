import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { addToCart, removeFromCart, clearCart, toggleCartDrawer } from '../../store/cartSlice';
import API from '../../api/axiosInstance';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurant, totalAmount, isDrawerOpen } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  if (!isDrawerOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in to proceed with checkout.');
      return;
    }
    if (items.length === 0) return;

    try {
      const { data } = await API.post('/orders', {
        restaurant: restaurant._id,
        items,
        totalAmount,
        deliveryAddress: user.address,
      });

      dispatch(clearCart());
      dispatch(toggleCartDrawer(false));

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        navigate(`/order-success?orderId=${data.order._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={() => dispatch(toggleCartDrawer(false))} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel bg-dark-900 border-l border-slate-800 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">Your Order Cart</h2>
            </div>
            <button
              onClick={() => dispatch(toggleCartDrawer(false))}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Restaurant Header */}
          {restaurant && (
            <div className="px-6 py-3 bg-brand-500/10 border-b border-brand-500/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-300 truncate">Ordering from: {restaurant.name}</span>
              <button
                onClick={() => dispatch(clearCart())}
                className="text-[11px] font-medium text-slate-400 hover:text-rose-400 underline"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <ShoppingBag className="w-16 h-16 text-slate-700 mb-3 stroke-[1.5]" />
                <p className="text-base font-semibold text-slate-300">Your cart is currently empty</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">Explore our restaurants and add delicious gourmet dishes to your order!</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.foodItem} className="glass-card rounded-xl p-3.5 flex items-center gap-3 border border-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                    <p className="text-xs font-bold text-brand-400 mt-0.5">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1">
                    <button
                      onClick={() => dispatch(removeFromCart(item.foodItem))}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-white min-w-[16px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(addToCart({ foodItem: { _id: item.foodItem, name: item.name, price: item.price, image: item.image }, restaurant }))}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-200 font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Due</span>
                  <span className="text-brand-400 text-lg">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Stripe Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
