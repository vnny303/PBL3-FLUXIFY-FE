import React from 'react';
import { Loader2, Star, Edit } from 'lucide-react';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';

export default function OrderItemList({ items, reviewedItems, buyingItemIds, onWriteReview, onBuyItem, orderStatus }) {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Order Items</h2>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item, idx) => {
          const productName = item.name || 'Product';
          const productVariant = item.variant || 'Standard';
          const productImage = item.image || `https://picsum.photos/seed/product${idx}/200/300`;
          const productPrice = item.price || '0đ';
          return (
            <div key={idx} className="p-6 flex gap-4">
              <div className="w-20 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                <img src={productImage} alt="Product" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{productName}</h3>
                    <p className="text-xs text-slate-500 mt-1">{productVariant}</p>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{productPrice}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">Qty: {item.quantity || 1}</span>
                  <div className="flex items-center gap-4">
                    {orderStatus === 'Completed' || orderStatus === 'Delivered' ? (
                      item.productSkuId ? (
                        <button
                          onClick={() => onWriteReview(item)}
                          className="text-xs font-bold hover:underline transition-colors flex items-center gap-1"
                          style={{ color: primaryColor }}
                        >
                          {reviewedItems[item.productSkuId] ? (
                            <><Edit className="w-3 h-3" style={{ color: primaryColor }} />Edit Review</>
                          ) : (
                            <><Star className="w-3 h-3 fill-amber-400 text-amber-400" />Write a Review</>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Cannot review</span>
                      )
                    ) : null}
                    <button
                      onClick={() => onBuyItem(item, idx)}
                      disabled={buyingItemIds[idx]}
                      className="text-xs font-bold hover:underline transition-colors flex items-center justify-center gap-1"
                      style={{ color: primaryColor }}
                    >
                      {buyingItemIds[idx] ? (
                        <><Loader2 className="w-3 h-3 animate-spin" />Loading...</>
                      ) : 'Buy again'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
