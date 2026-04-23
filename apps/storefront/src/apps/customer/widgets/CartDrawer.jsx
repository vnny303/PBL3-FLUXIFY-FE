import React from 'react';
import { X, Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../app/providers/useAppContext';

export default function CartDrawer() {
  const { showCart, setShowCart, cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useAppContext();
  const navigate = useNavigate();

  const toNumberPrice = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value.replace('$', ''));
    return 0;
  };

  if (!showCart) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setShowCart(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 translate-x-0">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-slate-900">Your Cart</h2>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">{cartCount} items</span>
          </div>
          <button 
            onClick={() => setShowCart(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className=" text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <ShoppingBag className="w-16 h-16 text-slate-300" />
              <p>Your cart is empty.</p>
              <button 
                onClick={() => setShowCart(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Shop Now
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartId} className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.productName}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wider">
                        {Object.entries(item.skuAttributes || {})
                          .filter(([, v]) => v && v !== 'Default' && v !== 'Standard')
                          .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                          .join(' | ')}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className=" text-lg" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all"
                      >
                        <Minus className=" text-sm" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all"
                      >
                        <Plus className=" text-sm" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      ${(toNumberPrice(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-500">Shipping</span>
            <span className="text-sm font-medium text-slate-900">Calculated at checkout</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-base font-bold text-slate-900">Subtotal</span>
            <span className="text-xl font-black text-blue-600">${cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={() => {
              setShowCart(false);
              navigate('/checkout');
            }}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4 shadow-lg shadow-blue-600/20"
          >
            Checkout Now
            <ArrowRight className=" text-sm" />
          </button>
          
          <button 
            onClick={() => setShowCart(false)}
            className="w-full py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Continue Shopping
          </button>
          
          <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest mt-6">
            SECURE CHECKOUT POWERED BY FLUXIFY
          </p>
        </div>
      </div>
    </>
  );
}

