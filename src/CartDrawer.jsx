import React from 'react';
import { useAppContext } from './AppContext';

export default function CartDrawer() {
  const { showCart, setShowCart, cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useAppContext();
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
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cart Item 1 */}
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200" alt="Premium Cotton Tee" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Premium Cotton Tee</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wider">SIZE: M | COLOR: BLACK</p>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                  <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all">
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-900">1</span>
                  <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <span className="text-sm font-bold text-blue-600">$45.00</span>
              </div>
            </div>
          </div>

          {/* Cart Item 2 */}
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200" alt="Raw Denim Jeans" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Raw Denim Jeans</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wider">SIZE: 32 | COLOR: INDIGO</p>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                  <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all">
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-900">1</span>
                  <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <span className="text-sm font-bold text-blue-600">$120.00</span>
              </div>
            </div>
          </div>

          {/* Cart Item 3 */}
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=200" alt="Ethereal Trench" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ethereal Trench</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wider">SIZE: L | COLOR: SAND</p>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                  <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all">
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-900">1</span>
                  <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <span className="text-sm font-bold text-blue-600">$210.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-500">Shipping</span>
            <span className="text-sm font-medium text-slate-900">Calculated at checkout</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-base font-bold text-slate-900">Subtotal</span>
            <span className="text-xl font-black text-blue-600">$375.00</span>
          </div>
          
          <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4 shadow-lg shadow-blue-600/20">
            Checkout Now
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
