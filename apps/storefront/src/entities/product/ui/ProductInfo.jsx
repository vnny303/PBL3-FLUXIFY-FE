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

export default function ProductInfo({ product, selectedSku, selectedAttributes, setSelectedAttributes }) {
  if (!product) return null;

  const attrs = product.attributes || {};
  const attrEntries = Object.entries(attrs); // e.g. [['colors', [...]], ['sizes', [...]], ['fabrics', [...]]]

  const displayPrice = selectedSku
    ? formatVnd(selectedSku.price)
    : formatVnd(product.price);

  const isAvailable = selectedSku ? selectedSku.stock > 0 : product.isInStock;
  const stockText = isAvailable ? "IN STOCK" : "OUT OF STOCK";
  const stockStyle = isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";

  const handleSelect = (attrKey, value) => {
    setSelectedAttributes(prev => ({ ...prev, [attrKey]: value }));
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${stockStyle}`}>
          {stockText}
        </span>
        <div className="flex items-center text-amber-400 text-sm">
          {Array.from({ length: 5 }).map((_, i) => {
            const rating = product.averageRating || 0;
            if (i < Math.floor(rating)) return <Star key={i} className="text-sm" fill="currentColor" />;
            if (i < rating) return <StarHalf key={i} className="text-sm" fill="currentColor" />;
            return <Star key={i} className="text-sm text-slate-300" />;
          })}
          <span className="text-slate-500 text-xs ml-2">({product.numReviews || 0} reviews)</span>
        </div>
      </div>

      <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2">{product.name}</h1>

      <div className="flex items-end gap-3 mb-6">
        <span className="text-3xl font-bold text-slate-900">{displayPrice}</span>
      </div>

      {product.description && (
        <div className="border-l-4 border-blue-200 pl-4 py-1 mb-8">
          <p className="text-slate-600 italic">"{product.description}"</p>
        </div>
      )}

      {/* Dynamic attribute selectors */}
      {attrEntries.map(([pluralKey, values]) => {
        // Derive singular key: colors → color, sizes → size, fabrics → fabric
        const singularKey = pluralKey.endsWith('s') ? pluralKey.slice(0, -1) : pluralKey;
        const label = pluralKey.charAt(0).toUpperCase() + pluralKey.slice(1);
        const selected = selectedAttributes[singularKey];

        const isColorAttr = singularKey === 'color';

        return (
          <div key={pluralKey} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{label}:</span>
              {selected && <span className="text-sm text-slate-500">{selected}</span>}
            </div>

            <div className="flex flex-wrap gap-3">
              {values.map(val => {
                const isSelected = selected === val;
                const swatch = isColorAttr ? getColorSwatch(val) : null;

                if (swatch) {
                  return (
                    <button
                      key={val}
                      title={val}
                      onClick={() => handleSelect(singularKey, val)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        isSelected ? 'border-blue-600 ring-2 ring-blue-100 scale-110' : 'border-transparent hover:border-slate-300'
                      }`}
                      style={{ backgroundColor: swatch }}
                    />
                  );
                }

                return (
                  <button
                    key={val}
                    onClick={() => handleSelect(singularKey, val)}
                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                      isSelected
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {val}
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
