import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Copy, CheckCircle2, ShoppingBag, ListChecks, MapPin, CreditCard, Package, AlertCircle } from 'lucide-react';
import { getBankTransferQrUrl } from '../../../../../shared/lib/mocks/bankTransferMock';

import { formatVnd, parsePrice, getDisplayOrderCode } from '../../../../../shared/lib/formatters';

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

const parseOrderNote = (addressString) => {
  if (!addressString || typeof addressString !== 'string') return null;
  const parts = addressString.split(' | Note: ');
  return parts.length > 1 ? parts[1] : null;
};

const cleanAddress = (addressString) => {
  if (!addressString || typeof addressString !== 'string') return '';
  return addressString.split(' | Note: ')[0];
};

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = useMemo(() => {
    // 1. Try navigation state
    if (location.state?.orderData) {
      return location.state.orderData;
    }
    
    // 2. Try sessionStorage fallback
    try {
      const saved = sessionStorage.getItem('fluxify_last_created_order');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved order data', e);
    }
    
    return null;
  }, [location.state]);

  const orderItems = useMemo(() => Array.isArray(orderData?.orderItems) ? orderData.orderItems : [], [orderData]);
  
  const totalDisplayInfo = useMemo(() => {
    if (!orderData) return { subtotal: 0, shippingFee: 0, totalAmount: 0 };
    
    const subtotal = orderItems.reduce((sum, item) => {
      const unitPrice = parsePrice(item.unitPrice ?? item.price);
      const quantity = item.quantity || 1;
      return sum + unitPrice * quantity;
    }, 0);
    
    const totalAmountFromData = parsePrice(orderData.totalAmount || 0);
    const shippingFee = orderData.shippingFee != null 
      ? parsePrice(orderData.shippingFee) 
      : Math.max(0, totalAmountFromData - subtotal);
      
    const totalAmount = subtotal + shippingFee;
    return { subtotal, shippingFee, totalAmount };
  }, [orderData, orderItems]);

  const rawAddress = orderData?.shippingAddress || orderData?.address;
  const orderNote = parseOrderNote(rawAddress);
  const displayAddress = cleanAddress(rawAddress);

  const bankInfo = orderData?.bankTransferInfo;
  
  const syncedBankInfo = useMemo(() => {
    if (!bankInfo) return null;
    const finalAmount = bankInfo.totalAmount > 0 ? bankInfo.totalAmount : totalDisplayInfo.totalAmount;
    return {
      ...bankInfo,
      totalAmount: finalAmount,
      totalAmountVnd: finalAmount
    };
  }, [bankInfo, totalDisplayInfo.totalAmount]);

  const displayOrderCode = getDisplayOrderCode(orderData);
  const paymentName = syncedBankInfo ? 'Bank Transfer' : (orderData?.payment?.methodName || orderData?.paymentMethod || 'N/A');

  const handleContinueShopping = () => navigate('/shop');
  const handleViewOrders = () => navigate('/account', { state: { screen: 'my-orders' } });

  const qrUrl = getBankTransferQrUrl(syncedBankInfo);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(String(text));
    toast.success(`Copied ${label} to clipboard`);
  };

  // ─── Render Empty State ───────────────────────────────────────────────────
  if (!orderData) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Order not found</h1>
        <p className="text-slate-500 max-w-md mb-10 leading-relaxed">
          We couldn't find the details for your recent order. It might have expired or was lost during a page reload. Please check your order history for details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button 
            onClick={handleViewOrders}
            className="flex-1 py-3 bg-slate-900 dark:bg-slate-800 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <ListChecks className="w-4 h-4" />
            View My Orders
          </button>
          <button 
            onClick={handleContinueShopping}
            className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  // ─── Render Order Details ────────────────────────────────────────────────
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Thank you for your order!</h1>
        <p className="text-slate-500">Order <span className="font-semibold text-primary">{displayOrderCode}</span> • {formatDate(orderData.createdAt) || 'Just now'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          
          {/* Bank Transfer Instructions */}
          {syncedBankInfo && (
            <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="text-primary w-5 h-5" />
                  Bank Transfer Instructions
                </h2>
                <div className="flex flex-col sm:items-end">
                   <span className="text-xs font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded">Order Status: {orderData.status || 'Pending'}</span>
                   <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Payment Status: Pending verification</span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Bank Name</p>
                    <p className="text-sm font-semibold">{syncedBankInfo.bankName} ({syncedBankInfo.bankCode})</p>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Account Number</p>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-primary">{syncedBankInfo.bankAccountNumber}</p>
                      <button onClick={() => copyToClipboard(syncedBankInfo.bankAccountNumber, 'Account Number')} className="text-slate-400 hover:text-primary transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Account Holder</p>
                    <p className="text-sm font-semibold">{syncedBankInfo.bankAccountName}</p>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800 pb-3 bg-amber-50/30 dark:bg-amber-900/5 px-2 -mx-2 rounded">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1">Transfer content (must match exactly)</p>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-slate-900 dark:text-white uppercase">{syncedBankInfo.transferContent}</p>
                      <button onClick={() => copyToClipboard(syncedBankInfo.transferContent, 'Transfer Content')} className="text-amber-600 hover:text-amber-700 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Amount to transfer</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold">{formatVnd(syncedBankInfo.totalAmount)}</p>
                      <button onClick={() => copyToClipboard(syncedBankInfo.totalAmount, 'Amount')} className="text-slate-400 hover:text-primary transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20">
                    <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase mb-1">Important</p>
                    <p className="text-[11px] text-red-700 dark:text-red-500 leading-relaxed">
                      Please transfer the exact amount and include the exact transfer content. Your order will be processed only after the merchant verifies the payment.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  {qrUrl && (
                    <div className="p-4 bg-white dark:bg-white rounded-xl border border-slate-100 shadow-sm">
                      <img src={qrUrl} alt="Payment QR" className="w-40 h-40 object-contain" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Scan to pay</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">If you cannot scan the QR code, please transfer manually.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Shipping & Payment Summary */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            <div className="p-6">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <MapPin className="text-primary w-4 h-4" />
                Shipping Address
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {displayAddress}
              </p>
              {orderNote && (
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Note</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{orderNote}"</p>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <CreditCard className="text-primary w-4 h-4" />
                Payment Method
              </h3>
              <p className="text-sm font-medium">{paymentName}</p>
              <p className="text-[10px] text-slate-400 uppercase mt-1">Status: Pending verification</p>
            </div>
          </section>

          {/* Order Items */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Package className="text-primary w-4 h-4" />
                Order Items ({orderItems.length})
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orderItems.map((item, index) => (
                <div key={item.id || index} className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.productName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Qty: {item.quantity} {item.skuAttributes && `• ${Object.values(item.skuAttributes).join(' • ')}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatVnd(item.unitPrice ?? item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatVnd(totalDisplayInfo.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping Fee</span>
                <span className="font-medium">{formatVnd(totalDisplayInfo.shippingFee)}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatVnd(totalDisplayInfo.totalAmount)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleViewOrders}
                className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ListChecks className="w-4 h-4" />
                View My Orders
              </button>
              <button 
                onClick={handleContinueShopping}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
