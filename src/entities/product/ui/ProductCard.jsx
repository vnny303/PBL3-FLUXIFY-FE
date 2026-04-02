import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onQuickAdd, onCardClick }) {
  const imageSrc = product.image || product.img;
  const displayPrice =
    typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price;

  const handleQuickAddClick = (event) => {
    event.stopPropagation();
    if (onQuickAdd) onQuickAdd(product);
  };

  return (
    <div
      className="group bg-white rounded-xl border border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      onClick={onCardClick}
      role={onCardClick ? 'button' : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onKeyDown={
        onCardClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') onCardClick();
            }
          : undefined
      }
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          alt={product.name}
          src={imageSrc}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-emerald-500 text-[10px] font-bold text-white rounded uppercase tracking-wider">
            In Stock
          </span>
        </div>
      </div>

      <div className="p-5">
        {product.cat && (
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">
            {product.cat}
          </p>
        )}
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.desc && <p className="text-sm text-slate-500 mb-4">{product.desc}</p>}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-primary">{displayPrice}</span>
          <button
            onClick={handleQuickAddClick}
            className="bg-slate-900 text-white p-2 rounded-lg hover:bg-primary transition-colors flex items-center justify-center"
            type="button"
          >
            <ShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}