import React from 'react';
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { formatVnd } from '../../../shared/lib/formatters';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';

export default function ProductActions({ product, selectedSku, quantity, setQuantity, selectedOptions, addToCart, optionGroups = [] }) {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 8;

  const currentProduct = product || { id: 999, name: 'Product', price: 0 };

  const skuPrice = selectedSku?.price ?? currentProduct.price ?? 0;
  const displayPrice = formatVnd(skuPrice);
  
  const allAttributesSelected = optionGroups.length === Object.keys(selectedOptions).length;
  
  // A product is available if it has a selected SKU with stock, OR if it has no SKUs and the base product is in stock
  const isAvailable = selectedSku ? selectedSku.stock > 0 : (product?.skus?.length === 0 && product?.isInStock !== false);

  const productSkus = product?.skus || [];
  const totalStock = productSkus.reduce((acc, s) => acc + (s.stock ?? s.stockQuantity ?? 0), 0);
  const isTrulyOutOfStock = (productSkus.length > 0 && totalStock === 0) || (productSkus.length === 0 && product?.isInStock === false);

  const isCtaDisabled = isTrulyOutOfStock || (allAttributesSelected && !isAvailable);

  const handleAddToCart = () => {
    if (!allAttributesSelected) return;
    addToCart(currentProduct, selectedSku, quantity, selectedOptions);
  };

  const maxStock = selectedSku ? selectedSku.stock : 999;
  const isAtMax = selectedSku ? quantity >= maxStock : false;

  return (
    <>
      <div className="flex gap-4 mb-8">
        <div className="flex items-center border border-slate-200 bg-white h-12" style={{ borderRadius: `${borderRadius}px` }}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="text-sm" />
          </button>
          <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={isAtMax || !allAttributesSelected}
            className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="text-sm" />
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isCtaDisabled}
          className={`flex-1 font-bold h-12 flex items-center justify-center gap-2 transition-all duration-300 ${
            isCtaDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'text-white hover:brightness-110 shadow-lg'
          }`}
          style={{
            backgroundColor: isCtaDisabled ? undefined : primaryColor,
            borderRadius: `${borderRadius}px`,
            boxShadow: !isCtaDisabled ? `0 8px 20px -6px ${primaryColor}4D` : undefined
          }}
        >
          <ShoppingBag className="w-5 h-5" />
          {isTrulyOutOfStock 
            ? 'Out of Stock' 
            : allAttributesSelected 
              ? 'Add to Cart' 
              : 'Select Options'}
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
        <div className="flex items-start gap-2.5">
          <Truck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: primaryColor }} />
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none mb-1">FREE DELIVERY</p>
            <p className="text-xs text-slate-500">Orders over 500.000đ</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: primaryColor }} />
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none mb-1">2 YEAR WARRANTY</p>
            <p className="text-xs text-slate-500">Full replacement</p>
          </div>
        </div>
      </div>
    </>
  );
}

