import React from 'react';
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

export default function ProductActions({ product, quantity, setQuantity, selectedAttributes, addToCart }) {
  const currentProduct = product || { id: 999, name: 'Product', price: 0 };

  // Find matching SKU for price display
  const matchingSku = currentProduct.skus?.find(s =>
    Object.entries(s.attributes).every(([k, v]) => selectedAttributes[k] === v)
  );
  const skuPrice = matchingSku?.price ?? currentProduct.price ?? 0;
  const displayPrice = `$${skuPrice.toFixed(2)}`;

  const handleAddToCart = () => {
    const color = selectedAttributes.color || 'Default';
    const size = selectedAttributes.size || 'Standard';
    addToCart(currentProduct, quantity, color, size);
  };

  return (
    <>
      {matchingSku && (
        <p className="text-2xl font-bold text-blue-600 mb-4">{displayPrice}</p>
      )}

      <div className="flex gap-4 mb-8">
        <div className="flex items-center border border-slate-200 rounded-full bg-white">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Minus className="text-sm" />
          </button>
          <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Plus className="text-sm" />
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
        >
          <ShoppingBag className="text-sm" />
          Add to Cart
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <Truck className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-900">FREE DELIVERY</p>
            <p className="text-xs text-slate-500">Orders over $150</p>
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
