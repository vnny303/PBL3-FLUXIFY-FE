import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  const handleContinueShopping = () => navigate('/shop');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Thank you for your order!</h1>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="text-slate-500 dark:text-slate-400 font-medium">Order #FLX-98234-3D</p>
          <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
          <p className="text-slate-500 dark:text-slate-400">Oct 24, 2023</p>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider rounded-full ml-2">Confirmed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">Order Items</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="p-6 flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                  <img alt="Premium Cotton Tee" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6I9G5_P1T_Ntxos4Rkn1Bw3iCA2BIFuQVuq9HyyhqRwco0Gdnv-MSeWh7gFLPQOw5WBkqBBScS-gG_ahXviMUyc0Ddx0uSP15MCNmf0VfH7GJEmkpVcglIZthlds1HWqJLi7fkxi4f9YE-4uEnODfUS-NA9r1GfJLx8U57-fkL2rZwTecFFgYV5HtOPS7IjYjwrAwp93cFLgIsmrhqmunrKpXzJAaImZnLTpYVJujO8pmYaHLgvsASCOt23lv6jQgCUlOqthQtX8" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">Premium Cotton Tee</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Size: M | Color: Black</p>
                  <p className="text-sm font-medium mt-1">Qty: 1</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">$45.00</p>
                </div>
              </div>
              <div className="p-6 flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                  <img alt="Hydrating Face Cream" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkN9mNpUCEpNVXGXz582_fR_fBqsus361eO4tWFH3MEoR35d4tcqR75Eua44rtzUt4BWqajvfoQI5DUSy8bk4Z5fgAYOhkRFIgEG1ITRhHdsF592cH68xUq3r_RDSqHX2CnxgX6s2shCdBcswNsTzWfnNR8z9ZOfa4z64hPDD_8jjk7VRR1R3dmq96zsRsHS5WlxHl_RAQrAEn28cTQs7K5nMnk0RItGDew1JvyexEztex2ks-R0GDJuL3CYqkNvyCqPCObupSxfU" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">Hydrating Face Cream</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">50ml</p>
                  <p className="text-sm font-medium mt-1">Qty: 1</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">$32.00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
                <h3 className="font-bold">Shipping Address</h3>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {orderData?.shippingAddress?.name || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-24 rounded inline-block"></span>}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {orderData?.shippingAddress?.street || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-3 w-32 rounded inline-block mt-1"></span>}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {orderData?.shippingAddress ? (
                  `${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}`
                ) : (
                  <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-3 w-40 rounded inline-block mt-1"></span>
                )}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {orderData?.shippingAddress?.country || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-3 w-20 rounded inline-block mt-1"></span>}
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                <h3 className="font-bold">Payment Method</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {orderData?.payment?.methodName || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-24 rounded inline-block"></span>}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Transaction ID: {orderData?.payment?.transactionId || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-3 w-20 rounded inline-block"></span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold mb-6">Order Summary</h3>
            <div className="space-y-4">
               <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">$77.00</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-medium text-slate-900 dark:text-white">$5.00</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span>Tax (8%)</span>
                <span className="font-medium text-slate-900 dark:text-white">$6.16</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">Order Total</span>
                <span className="text-2xl font-black text-primary">$88.16</span>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <button onClick={handleContinueShopping} className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                Continue Shopping
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
              <button className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download Invoice
              </button>
            </div>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Need help?</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">If you have any questions about your order, our support team is available 24/7.</p>
                <a className="text-sm font-bold text-primary hover:underline flex items-center gap-1" href="#" onClick={(e) => e.preventDefault()}>
                  Contact Support
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
