import React from 'react';
import { MapPin, CreditCard, Building, StickyNote, AlertCircle } from 'lucide-react';
import { getBankTransferQrUrl } from '../../../shared/lib/mocks/bankTransferMock';
import { formatVnd, parsePrice } from '../../../shared/lib/formatters';

export default function OrderSummaryCard({ order }) {
  const rawAddress = order.shippingAddress || order.address || '';
  
  const parseAddressAndNote = () => {
    if (!rawAddress) return { address: 'Address not provided', note: null };
    if (typeof rawAddress === 'string') {
      const parts = rawAddress.split(' | Note: ');
      return {
        address: parts[0],
        note: parts.length > 1 ? parts[1] : null
      };
    }
    return { address: rawAddress, note: null };
  };

  const { address, note } = parseAddressAndNote();
  const addressLines = typeof address === 'string' 
    ? address.split(',').map(s => s.trim()).filter(Boolean)
    : [address.name, address.street, [address.city, address.state, address.zip].filter(Boolean).join(', '), address.country].filter(Boolean);

  const calculateSubtotal = () => {
    const items = order.items || order.orderItems || [];
    return items.reduce((sum, item) => {
      const price = parsePrice(item.unitPrice ?? item.price);
      return sum + (price * (item.quantity || 1));
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const totalNum = parsePrice(order.total || order.totalAmount);
  const shippingFee = Math.max(0, totalNum - subtotal);

  const isBankTransfer = (order.paymentMethod === 'BankTransfer') || (order.payment?.methodName === 'Bank Transfer');
  const isPending = (order.status || order.paymentStatus) === 'Pending';
  const bankInfo = order.bankTransferInfo;
  const qrUrl = getBankTransferQrUrl(bankInfo);

  return (
    <div className="space-y-6">
      {/* Shipping Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          Shipping Address
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {addressLines.map((line, idx) => (
            <p key={idx} className={idx === 0 ? "font-bold text-slate-900 dark:text-white mb-1" : ""}>{line}</p>
          ))}
        </div>
        {note && (
          <div className="mt-4 p-4 bg-primary/[0.03] dark:bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Order Note</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic break-words whitespace-pre-wrap">"{note}"</p>
          </div>
        )}
      </div>

      {/* Payment & Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-primary" />
            Payment Method
          </h3>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-7 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-100 dark:border-slate-800">
                 <Building className="w-4 h-4 text-slate-400" />
               </div>
               <p className="text-sm font-bold text-slate-900 dark:text-white">{isBankTransfer ? 'Bank Transfer' : 'Cash on Delivery'}</p>
             </div>
             <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${isPending ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
               {isPending ? 'Pending verification' : 'Paid'}
             </span>
          </div>
        </div>

        {isBankTransfer && isPending && bankInfo && (
          <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Payment Instructions</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-[10px] text-slate-400 uppercase font-black">Bank</span>
                  <span className="text-xs font-bold uppercase">{bankInfo.bankName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-[10px] text-slate-400 uppercase font-black">Account</span>
                  <span className="text-xs font-bold text-primary">{bankInfo.bankAccountNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-[10px] text-slate-400 uppercase font-black">Content</span>
                  <span className="text-xs font-bold text-primary uppercase">{bankInfo.transferContent}</span>
                </div>
              </div>
              {qrUrl && (
                <div className="flex justify-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100">
                   <img src={qrUrl} alt="QR" className="w-24 h-24 object-contain" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Order Summary</h2>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between text-slate-500">
            <span className="uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">{formatVnd(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span className="uppercase tracking-widest text-[10px] font-bold">Shipping</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">{formatVnd(shippingFee)}</span>
          </div>
          <div className="pt-6 mt-2 border-t border-slate-50 dark:border-slate-800 flex justify-between items-end">
            <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Total</span>
            <span className="text-2xl font-black text-primary tabular-nums leading-none">
              {formatVnd(totalNum)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
