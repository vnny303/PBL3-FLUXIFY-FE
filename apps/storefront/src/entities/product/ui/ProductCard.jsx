import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';

export default function ProductCard({ product, onQuickAdd, onCardClick }) {
  const { theme } = useStorefrontConfig();

  // imgUrls is an array; fall back to legacy img/image fields for compatibility
  const imageSrc = product.imgUrls?.[0] || product.image || product.img;
  const displayPrice =
    typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price;

  const handleQuickAddClick = (event) => {
    event.stopPropagation();
    if (onQuickAdd) onQuickAdd(product);
  };

  const cardRadius = `${theme.layout.borderRadius}px`;
  const productCardTheme = theme.components.productCard;

  return (
    <div
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        backgroundColor: productCardTheme.background,
        color: productCardTheme.text,
        borderRadius: cardRadius,
        border: `1px solid ${theme.colors.primary}1A`,
      }}
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
          <span
            className="px-2 py-1 text-[10px] font-bold text-white rounded uppercase tracking-wider"
            style={{
              backgroundColor: productCardTheme.badge,
              borderRadius: `${Math.max(theme.layout.borderRadius - 4, 6)}px`,
            }}
          >
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

        <h3
          className="text-lg font-bold mb-1 transition-colors"
          style={{ color: productCardTheme.text }}
        >
          {product.name}
        </h3>

        {(product.description || product.desc) && (
          <p className="text-sm text-slate-500 mb-4">{product.description || product.desc}</p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span
            className="text-xl font-bold"
            style={{ color: productCardTheme.price }}
          >
            {displayPrice}
          </span>

          <button
            onClick={handleQuickAddClick}
            className="text-white p-2 transition-colors flex items-center justify-center hover:opacity-90"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: `${Math.max(theme.layout.borderRadius - 4, 8)}px`,
            }}
            type="button"
          >
            <ShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}