import React from 'react';
import { CheckCircle2, Star, StarHalf } from 'lucide-react';
import { formatVnd } from '../../../shared/lib/formatters';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';

// Color name → CSS value for swatch rendering
const COLOR_MAP = {
  red: '#EF4444', blue: '#3B82F6', white: '#F8FAFC', black: '#1A1C29',
  gray: '#6B7280', grey: '#6B7280', navy: '#1E3A5F', green: '#22C55E',
  brown: '#92400E', tan: '#D2B48C', charcoal: '#374151', burgundy: '#800020',
  camel: '#C19A6B', silver: '#CBD5E1', gold: '#F59E0B',
  sage: '#9CAF88', mint: '#98FF98', cream: '#FFFDD0', pastel: '#F9A8D4',
  vivid: '#F97316', assorted: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 33%, #22c55e 66%, #3b82f6 100%)',
  graphite: '#374151', clear: '#E0F2FE', smoke: '#64748B', natural: '#D6B88D',
  walnut: '#7C4A2D', oak: '#C8A46B', primary: '#2563EB', college: '#0F766E',
};

function getColorSwatch(colorName) {
  return COLOR_MAP[colorName?.toLowerCase()] || null;
}

export default function ProductInfo({
  product,
  selectedSku,
  selectedOptions,
  setSelectedOptions,
  optionGroups,
  reviewSummary,
}) {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const productCardTheme = theme?.components?.productCard || {
    background: '#ffffff',
    text: '#1e293b',
    badge: '#ef4444',
    price: '#2563eb'
  };

  if (!product) return null;

  const displayPrice = selectedSku
    ? formatVnd(selectedSku.price)
    : formatVnd(product.price);

  const isAvailable = selectedSku ? selectedSku.stock > 0 : product.isInStock;
  const stockText = isAvailable ? "IN STOCK" : "OUT OF STOCK";
  const displayRating = reviewSummary?.averageRating ?? product.rating ?? 0;
  const displayReviewCount = reviewSummary?.totalReviews ?? product.reviewCount ?? 0;

  const handleSelect = (key, value) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span 
          className="px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider"
          style={{ 
            backgroundColor: isAvailable ? '#10b9811A' : '#ef44441A',
            color: isAvailable ? '#10b981' : '#ef4444'
          }}
        >
          {stockText}
        </span>
        {product.isSale && (
          <span 
            className="px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider"
            style={{ 
              backgroundColor: `${productCardTheme.badge || '#ef4444'}1A`,
              color: productCardTheme.badge || '#ef4444'
            }}
          >
            {product.discountLabel || 'Sale'}
          </span>
        )}
        {product.isNew && (
          <span 
            className="px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider"
            style={{ 
              backgroundColor: `${primaryColor}1A`,
              color: primaryColor
            }}
          >
            New Arrival
          </span>
        )}
        {product.isBestSeller && (
          <span 
            className="px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider"
            style={{ 
              backgroundColor: '#f59e0b1A',
              color: '#f59e0b'
            }}
          >
            Best Seller
          </span>
        )}
        <div className="flex items-center text-amber-400 text-sm ml-auto sm:ml-0">
          {Array.from({ length: 5 }).map((_, i) => {
            const rating = displayRating;
            if (i < Math.floor(rating)) return <Star key={i} className="w-4 h-4" fill="currentColor" />;
            if (i < rating) return <StarHalf key={i} className="w-4 h-4" fill="currentColor" />;
            return <Star key={i} className="w-4 h-4 text-slate-200" />;
          })}
          <span className="text-slate-500 text-xs font-bold ml-2">({displayReviewCount} reviews)</span>
        </div>
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-2">{product.name}</h1>

      <div className="flex items-end gap-4 mb-6">
        <span className="text-3xl font-extrabold" style={{ color: primaryColor }}>{displayPrice}</span>
        {selectedSku && (
          <span className="text-sm text-slate-500 pb-1.5 font-medium">
            ({selectedSku.stock} units available)
          </span>
        )}
      </div>

      <div className="mb-8">
        <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line">
          {product.description || "No description available."}
        </p>
        {Array.isArray(product.highlights) && product.highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
            {product.highlights.slice(0, 4).map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-xl border border-slate-100 bg-white/70 px-3 py-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: primaryColor }} />
                <span className="text-sm text-slate-600 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        )}
        {Array.isArray(product.bestFor) && product.bestFor.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {product.bestFor.slice(0, 5).map((item) => (
              <span key={item} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic option groups derived from SKUs */}
      {optionGroups.map((group) => {
        const { key, label, values } = group;
        const selected = selectedOptions[key];
        const isColorAttr = key.toLowerCase() === 'color';

        return (
          <div key={key} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{label}:</span>
              {selected && <span className="text-sm text-slate-500">{selected}</span>}
            </div>

            <div className="flex flex-wrap gap-3">
              {values.map(val => {
                const isSelected = selected === val;
                const swatch = isColorAttr ? getColorSwatch(val) : null;

                // Check if this specific option value exists in ANY in-stock SKU
                // that matches the CURRENTLY selected options of OTHER groups
                const isOptionDisabled = !product.skus.some(sku => {
                  if (sku.attributes[key] !== val) return false;
                  // Must match other selected options
                  const matchesOthers = Object.entries(selectedOptions).every(([k, v]) => {
                    if (k === key) return true; // ignore current group key
                    return sku.attributes[k] === v;
                  });
                  return matchesOthers && sku.stock > 0;
                });

                if (swatch) {
                  return (
                    <button
                      key={val}
                      title={val}
                      disabled={isOptionDisabled}
                      onClick={() => handleSelect(key, val)}
                      className={`w-9 h-9 rounded-full border-2 transition-all relative ${
                        isSelected ? 'scale-110' : 'border-transparent hover:border-slate-300'
                      } ${isOptionDisabled ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                      style={{ 
                        background: swatch,
                        borderColor: isSelected ? primaryColor : undefined,
                        boxShadow: isSelected ? `0 0 0 4px ${primaryColor}1A` : undefined
                      }}
                    >
                      {isOptionDisabled && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-slate-400 rotate-45 transform" />
                        </div>
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={val}
                    disabled={isOptionDisabled}
                    onClick={() => handleSelect(key, val)}
                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all relative overflow-hidden ${
                      isSelected
                        ? ''
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    } ${isOptionDisabled ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-100' : ''}`}
                    style={{
                      borderColor: isSelected ? primaryColor : undefined,
                      color: isSelected ? primaryColor : undefined,
                      backgroundColor: isSelected ? `${primaryColor}0D` : undefined
                    }}
                  >
                    {val}
                    {isOptionDisabled && (
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                         <div className="w-full h-full border-t border-slate-400 -rotate-12 transform scale-150" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

