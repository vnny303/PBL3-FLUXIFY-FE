import React from 'react';
import { formatVnd } from '../../../shared/lib/formatters';

export default function OrderSummary({ cartItems = [], cartSubtotal = 0, shippingFee, isProcessing, onPlaceOrder }) {
  const totalAmount = cartSubtotal + shippingFee;

  return (
    <div className="lg:w-[40%]">
      <div className="sticky top-24 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              {cartItems.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Không có sản phẩm trong giỏ hàng.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700">
                        <img alt={item.productName} className="w-full h-full object-cover" src={item.image} />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="grow">
                      <h3 className="text-sm font-medium">{item.productName}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {Object.entries(item.skuAttributes || {})
                          .map(([key, value]) => `${value}`)
                          .join(' • ') || 'Standard'}
                      </p>
                      <p className="text-sm font-semibold mt-1 text-primary">{formatVnd(item.price)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatVnd(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium">{formatVnd(shippingFee)}</span>
              </div>
              
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Total</span>
                <span className="text-primary">{formatVnd(totalAmount)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {!isProcessing ? (
                <button 
                  onClick={onPlaceOrder} 
                  disabled={cartItems.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3"
                >
                  Place Order
                </button>
              ) : (
                <button className="w-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-3 cursor-not-allowed" disabled>
                  <div className="animate-spin h-5 w-5 border-2 border-slate-300 border-t-slate-500 rounded-full"></div>
                  Processing...
                </button>
              )}
              <p className="text-[10px] text-center text-slate-400 px-4">
                By placing your order, you agree to Fluxify's Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">SSL Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
