import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { formatVnd } from '../../../shared/lib/formatters';

// Color name → CSS value for swatch rendering
const COLOR_MAP = {
  red: '#EF4444', blue: '#3B82F6', white: '#F8FAFC', black: '#1A1C29',
  gray: '#6B7280', grey: '#6B7280', navy: '#1E3A5F', green: '#22C55E',
  brown: '#92400E', tan: '#D2B48C', charcoal: '#374151', burgundy: '#800020',
  camel: '#C19A6B', silver: '#CBD5E1', gold: '#F59E0B',
};

function getColorSwatch(colorName) {
  return COLOR_MAP[colorName?.toLowerCase()] || null;
}

export default function ProductInfo({ product, selectedSku, selectedOptions, setSelectedOptions, optionGroups }) {
  if (!product) return null;

  const displayPrice = selectedSku
    ? formatVnd(selectedSku.price)
    : formatVnd(product.price);

  const isAvailable = selectedSku ? selectedSku.stock > 0 : product.isInStock;
  const stockText = isAvailable ? "IN STOCK" : "OUT OF STOCK";
  const stockStyle = isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";

  const handleSelect = (key, value) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${stockStyle}`}>
          {stockText}
        </span>
        {product.isSale && (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-red-100 text-red-600">
            {product.discountLabel || 'Sale'}
          </span>
        )}
        {product.isNew && (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-blue-100 text-blue-600">
            New Arrival
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-amber-100 text-amber-600">
            Best Seller
          </span>
        )}
        <div className="flex items-center text-amber-400 text-sm ml-auto sm:ml-0">
          {Array.from({ length: 5 }).map((_, i) => {
            const rating = product.rating || 0;
            if (i < Math.floor(rating)) return <Star key={i} className="w-4 h-4" fill="currentColor" />;
            if (i < rating) return <StarHalf key={i} className="w-4 h-4" fill="currentColor" />;
            return <Star key={i} className="w-4 h-4 text-slate-200" />;
          })}
          <span className="text-slate-500 text-xs font-bold ml-2">({product.reviewCount || 0} reviews)</span>
        </div>
      </div>

      <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2">{product.name}</h1>

      <div className="flex items-end gap-4 mb-6">
        <span className="text-4xl font-extrabold text-blue-600">{displayPrice}</span>
        {selectedSku && (
          <span className="text-sm text-slate-500 pb-1.5 font-medium">
            ({selectedSku.stock} units available)
          </span>
        )}
      </div>

      {product.description && (
        <div className="border-l-4 border-blue-200 pl-4 py-1 mb-8">
          <p className="text-slate-600 italic">"{product.description}"</p>
        </div>
      )}

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
                        isSelected ? 'border-blue-600 ring-2 ring-blue-100 scale-110' : 'border-transparent hover:border-slate-300'
                      } ${isOptionDisabled ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                      style={{ backgroundColor: swatch }}
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
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    } ${isOptionDisabled ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-100' : ''}`}
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
