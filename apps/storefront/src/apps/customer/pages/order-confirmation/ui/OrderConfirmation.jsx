import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const parsePrice = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value.replace('$', '')) || 0;
  return 0;
};

const formatMoney = (value) => `$${parsePrice(value).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return '';

  try {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData || {};

  const orderItems = Array.isArray(orderData.orderItems) ? orderData.orderItems : [];
  const subtotal = orderItems.reduce((sum, item) => {
    const unitPrice = parsePrice(item.unitPrice ?? item.price);
    const quantity = item.quantity || 1;
    return sum + unitPrice * quantity;
  }, 0);
  const shippingFee = parsePrice(orderData.shippingFee ?? 5);
  const taxAmount = parsePrice(orderData.taxAmount ?? subtotal * 0.08);
  const totalAmount = parsePrice(orderData.totalAmount ?? (subtotal + shippingFee + taxAmount));

  const shippingAddress = orderData.shippingAddress;
  const paymentName = orderData.payment?.methodName || orderData.paymentMethod || 'N/A';
  const paymentTransaction = orderData.payment?.transactionId || 'N/A';

  const handleContinueShopping = () => navigate('/shop');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Thank you for your order!</h1>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="text-slate-500 dark:text-slate-400 font-medium">Order {orderData.id || 'N/A'}</p>
          <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
          <p className="text-slate-500 dark:text-slate-400">{formatDate(orderData.createdAt) || 'Just now'}</p>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider rounded-full ml-2">{orderData.status || 'Pending'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">Order Items</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orderItems.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">Không có thông tin chi tiết sản phẩm trong đơn.</div>
              ) : (
                orderItems.map((item, index) => (
                  <div key={item.id || index} className="p-6 flex items-center gap-6">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                      <img alt={item.productName || item.name || 'Product'} className="w-full h-full object-cover" src={item.image || 'https://picsum.photos/seed/order-item/120/120'} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.productName || item.name || `SKU ${item.productSkuId || ''}`}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">SKU: {item.productSkuId || 'N/A'}</p>
                      <p className="text-sm font-medium mt-1">Qty: {item.quantity || 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">{formatMoney(item.unitPrice ?? item.price)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
                <h3 className="font-bold">Shipping Address</h3>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {shippingAddress?.name || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-24 rounded inline-block"></span>}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {shippingAddress?.street || orderData.address || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-3 w-32 rounded inline-block mt-1"></span>}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {shippingAddress ? (
                  `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}`
                ) : (
                  <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-3 w-40 rounded inline-block mt-1"></span>
                )}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {shippingAddress?.country || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-3 w-20 rounded inline-block mt-1"></span>}
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
                    {paymentName || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-24 rounded inline-block"></span>}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Transaction ID: {paymentTransaction || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-3 w-20 rounded inline-block"></span>}
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
                <span className="font-medium text-slate-900 dark:text-white">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatMoney(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span>Tax (8%)</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatMoney(taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">Order Total</span>
                <span className="text-2xl font-black text-primary">{formatMoney(totalAmount)}</span>
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
