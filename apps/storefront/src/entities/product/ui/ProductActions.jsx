import React from 'react';
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { formatVnd } from '../../../shared/lib/formatters';

export default function ProductActions({ product, selectedSku, quantity, setQuantity, selectedOptions, addToCart, optionGroups = [] }) {
  const currentProduct = product || { id: 999, name: 'Product', price: 0 };

  const skuPrice = selectedSku?.price ?? currentProduct.price ?? 0;
  const displayPrice = formatVnd(skuPrice);
  
  const allAttributesSelected = optionGroups.length === Object.keys(selectedOptions).length;
  
  // A product is available if it has a selected SKU with stock, OR if it has no SKUs and the base product is in stock
  const isAvailable = (selectedSku ? selectedSku.stock > 0 : (product?.skus?.length === 0 && product?.isInStock !== false)) && allAttributesSelected;

  const handleAddToCart = () => {
    if (!allAttributesSelected) return;
    addToCart(currentProduct, selectedSku, quantity, selectedOptions);
  };

  const maxStock = selectedSku ? selectedSku.stock : 0;
  const isAtMax = quantity >= maxStock;

  return (
    <>
      <div className="flex gap-4 mb-8">
        <div className="flex items-center border border-slate-200 rounded-full bg-white">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="text-sm" />
          </button>
          <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={isAtMax || !allAttributesSelected}
            className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="text-sm" />
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`flex-1 font-bold rounded-full flex items-center justify-center gap-2 transition-colors shadow-lg ${
            isAvailable
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          <ShoppingBag className="text-sm" />
          {allAttributesSelected 
            ? (isAvailable ? 'Add to Cart' : 'Out of Stock') 
            : 'Select Options'}
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <Truck className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-900">FREE DELIVERY</p>
            <p className="text-xs text-slate-500">Orders over 500.000đ</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-900">2 YEAR WARRANTY</p>
            <p className="text-xs text-slate-500">Full replacement</p>
          </div>
        </div>
      </div>
    </>
  );
}
