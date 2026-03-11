import React, { useEffect } from 'react';
import { useAppContext } from './AppContext';

export default function AddToCartPopup() {
  const { showAddToCartPopup, setShowAddToCartPopup, setShowCart, lastAddedItem, cartTotal } = useAppContext();

  useEffect(() => {
    if (showAddToCartPopup) {
      const timer = setTimeout(() => {
        setShowAddToCartPopup(false);
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showAddToCartPopup, setShowAddToCartPopup]);

  if (!showAddToCartPopup || !lastAddedItem) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => setShowAddToCartPopup(false)}
      ></div>

      {/* Popup Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden">
        <div className="p-6 relative">
          <button 
            onClick={() => setShowAddToCartPopup(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-emerald-600 font-bold">check</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Added to Cart</h2>
              <p className="text-sm text-slate-500">1 item successfully added</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 flex gap-4 mb-6 border border-slate-100">
            <div className="w-20 h-20 rounded-lg bg-white overflow-hidden shrink-0 border border-slate-200">
              <img src={lastAddedItem.img} alt={lastAddedItem.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-sm font-bold text-slate-900 mb-1">{lastAddedItem.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{lastAddedItem.color} / {lastAddedItem.size} / Qty: {lastAddedItem.quantity}</p>
              <span className="text-sm font-bold text-blue-600">{lastAddedItem.price}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-slate-500">Cart Subtotal</span>
            <span className="text-xl font-black text-slate-900">${cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowAddToCartPopup(false)}
              className="flex-1 py-3 rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => {
                setShowAddToCartPopup(false);
                setShowCart(true);
              }}
              className="flex-1 py-3 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              View Cart
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
