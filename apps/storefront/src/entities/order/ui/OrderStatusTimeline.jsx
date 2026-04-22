import React from 'react';
import { Package, Truck, CheckCircle, X } from 'lucide-react';

export default function OrderStatusTimeline({ orderStatus, currentIndex, progressWidth }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Tracking Status</h2>
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>

        {orderStatus === 'Cancelled' ? (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[15%] h-1 bg-red-500 rounded-full"></div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center z-10 shadow-sm shadow-red-500/30">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Order Placed</span>
                <span className="text-[10px] text-slate-500">Oct 12</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center z-10 shadow-sm shadow-red-500/30">
                  <X className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-red-500">Cancelled</span>
                <span className="text-[10px] text-red-400">Oct 12</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center z-10">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-500">Shipped</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center z-10">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-500">Delivered</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
              style={{ width: progressWidth }}
            ></div>
            <div className="relative flex justify-between">
              {[
                { label: 'Order Placed', Icon: Package, date: 'Oct 12' },
                { label: 'Processing', Icon: Package, date: 'Oct 13' },
                { label: 'Shipped', Icon: Truck, date: 'Expected Oct 14' },
                { label: 'Delivered', Icon: CheckCircle, date: 'Est. Oct 16' },
              ].map((step, i) => (
                <div key={step.label} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${currentIndex >= i ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                    {React.createElement(step.Icon, { className: 'w-4 h-4' })}
                  </div>
                  <span className={`text-xs font-bold ${currentIndex >= i ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{step.label}</span>
                  <span className="text-[10px] text-slate-500">{step.date}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {orderStatus === 'Cancelled' ? (
        <div className="mt-8 bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-100 dark:border-red-900/30">
          <p className="text-sm font-medium text-red-800 dark:text-red-400 flex items-center gap-2">
            <X className="w-4 h-4" />
            Order was cancelled
          </p>
          <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1 ml-6">Your order has been cancelled and a refund has been initiated if applicable.</p>
        </div>
      ) : (
        <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
            {currentIndex >= 3 ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Truck className="w-4 h-4 text-primary" />}
            {currentIndex === 0 && 'Order has been placed'}
            {currentIndex === 1 && 'Your package is being processed'}
            {currentIndex === 2 && 'Your package is on the way'}
            {currentIndex === 3 && 'Your package has been delivered'}
          </p>
          <p className="text-xs text-slate-500 mt-1 ml-6">
            {currentIndex === 0 && 'We have received your order and are preparing it.'}
            {currentIndex === 1 && 'Last updated: Oct 13, 08:45 AM - Order is being prepared for shipping.'}
            {currentIndex === 2 && 'Last updated: Oct 14, 10:30 AM - Package arrived at transit facility.'}
            {currentIndex === 3 && 'Delivered on Oct 16, 02:15 PM.'}
          </p>
        </div>
      )}
    </div>
  );
}
