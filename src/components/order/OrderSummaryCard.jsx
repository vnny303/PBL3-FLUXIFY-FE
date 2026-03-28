import React from 'react';
import { MapPin, CreditCard, Building } from 'lucide-react';

export default function OrderSummaryCard({ order }) {
  return (
    <div className="space-y-6">
      {/* Shipping Details */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-slate-400" />
            Shipping Address
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p className="font-bold text-slate-900 dark:text-white mb-1">Alex Thompson</p>
            <p>123 Maple St.</p>
            <p>Springfield, IL 62704</p>
            <p>United States</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tracking Info</h4>
            <p className="text-xs text-slate-500 italic">Tracking details will appear once shipped.</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-slate-400" />
          Payment Method
        </h3>
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-slate-500">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{order.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Order Summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="font-medium text-slate-900 dark:text-white">$224.00</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Shipping</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Estimated Tax</span>
            <span className="font-medium text-slate-900 dark:text-white">$18.50</span>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="font-bold text-slate-900 dark:text-white text-base">Total</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">{order.total}</span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Need help with this order?</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Our support team is available 24/7 to assist you with any questions.
        </p>
        <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
          Contact Support &rarr;
        </button>
      </div>
    </div>
  );
}
