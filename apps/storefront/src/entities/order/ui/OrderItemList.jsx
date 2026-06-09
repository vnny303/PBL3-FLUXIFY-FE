import React from 'react';
import { Loader2, Star, Edit } from 'lucide-react';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';
import { formatVnd, parsePrice } from '../../../shared/lib/formatters';

export default function OrderItemList({ items, reviewedItems, buyingItemIds, onWriteReview, onViewProduct, onBuyItem, orderStatus }) {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;
  const textColor = theme?.colors?.text || '#111827';
  const bgColor = theme?.colors?.background || '#ffffff';
  const cardBg = bgColor === '#ffffff' ? '#ffffff' : `${bgColor}E6`;
  const borderColor = `${primaryColor}1A`;

  return (
    <div className="border shadow-xl shadow-slate-200/50 overflow-hidden" style={{ backgroundColor: cardBg, color: textColor, borderColor, borderRadius: `${borderRadius}px` }}>
      <div className="p-6 border-b" style={{ borderColor }}>
        <h2 className="text-lg font-bold" style={{ color: textColor }}>Order Items</h2>
      </div>
      <div className="divide-y" style={{ '--tw-divide-opacity': 1, borderColor }}>
        {items.map((item, idx) => {
          const productName = item.name || 'Product';
          const productVariant = item.variant || 'Standard';
          const productImage = item.image || `https://picsum.photos/seed/product${idx}/200/300`;
          const quantity = item.quantity || 1;
          const unitPrice = parsePrice(item.unitPrice ?? item.price);
          const lineTotal = item.lineTotal ?? unitPrice * quantity;
          const attributeEntries = item.skuAttributes && typeof item.skuAttributes === 'object'
            ? Object.entries(item.skuAttributes).filter(([, value]) => value)
            : [];

          return (
            <div key={item.id || idx} className="p-6 flex gap-4">
              <button
                type="button"
                onClick={() => onViewProduct?.(item)}
                className="w-20 h-24 bg-slate-100 rounded-lg border shrink-0 overflow-hidden hover:opacity-90 transition-colors"
                style={{ borderColor }}
                aria-label={`Open ${productName}`}
              >
                <img src={productImage} alt="Product" className="w-full h-full object-cover rounded-lg" />
              </button>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onViewProduct?.(item)}
                      className="font-bold text-sm text-left hover:underline"
                      style={{ color: textColor }}
                    >
                      {productName}
                    </button>
                    <p className="text-xs text-slate-500 mt-1">{productVariant}</p>
                    {attributeEntries.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {attributeEntries.map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.productSkuId && (
                      <p className="text-[10px] text-slate-400 mt-2 truncate" title={String(item.productSkuId)}>
                        SKU {item.productSkuId}
                      </p>
                    )}
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="font-bold text-sm" style={{ color: textColor }}>
                      {formatVnd(lineTotal)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {formatVnd(unitPrice)} x {quantity}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">Qty: {quantity}</span>
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
