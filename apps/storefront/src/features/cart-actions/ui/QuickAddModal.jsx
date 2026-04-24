import React, { useState, useMemo } from 'react';
import { X, Star } from 'lucide-react';
import { useAppContext } from '../../../app/providers/useAppContext';
import { formatVnd } from '../../../shared/lib/formatters';

const COLOR_MAP = {
  red: '#EF4444', blue: '#3B82F6', white: '#F8FAFC', black: '#1A1C29',
  gray: '#6B7280', grey: '#6B7280', navy: '#1E3A5F', green: '#22C55E',
  brown: '#92400E', tan: '#D2B48C', charcoal: '#374151', burgundy: '#800020',
  camel: '#C19A6B', silver: '#CBD5E1', gold: '#F59E0B',
};

function getColorSwatch(colorName) {
  return COLOR_MAP[colorName?.toLowerCase()] || null;
}

export default function QuickAddModal() {
  const { quickAddProduct, setQuickAddProduct, addToCart } = useAppContext();
  const [selectedOptions, setSelectedOptions] = useState({});

  if (!quickAddProduct) return null;

  const skus = quickAddProduct.skus || quickAddProduct.productSkus || [];
  
  // 1. Derive dynamic option groups from SKUs
  const optionGroups = useMemo(() => {
    const groups = {};
    skus.forEach(sku => {
      Object.entries(sku.attributes || {}).forEach(([key, value]) => {
        if (!groups[key]) groups[key] = new Set();
        groups[key].add(value);
      });
    });
    return Object.entries(groups).map(([key, values]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      values: Array.from(values)
    }));
  }, [skus]);

  // 2. Resolve selectedSku
  const selectedSku = useMemo(() => {
    if (!skus.length) return null;
    if (optionGroups.length === 0) return skus[0];
    
    const isComplete = optionGroups.every(group => !!selectedOptions[group.key]);
    if (!isComplete) return null;

    return skus.find(sku => 
      optionGroups.every(group => (sku.attributes || {})[group.key] === selectedOptions[group.key])
    );
  }, [skus, selectedOptions, optionGroups]);

  const isOutOfStock = useMemo(() => {
    const totalStock = skus.reduce((sum, s) => sum + (s.stock || 0), 0);
    return totalStock === 0;
  }, [skus]);

  const isAddDisabled = !selectedSku || selectedSku.stock <= 0;

  const handleAdd = () => {
    if (selectedSku && selectedSku.stock > 0) {
      addToCart(quickAddProduct, selectedSku, 1, selectedOptions);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedOptions({});
    setQuickAddProduct(null);
  };

  const handleSelect = (key, value) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  };

  const imageSrc = selectedSku?.imgUrl 
    || quickAddProduct.image 
    || quickAddProduct.images?.[0]
    || quickAddProduct.imgUrls?.[0]
    || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop';

  const priceDisplay = selectedSku 
    ? formatVnd(selectedSku.price) 
    : (() => {
        const inStockSkus = skus.filter(s => (s.stock || 0) > 0);
        const targetSkus = inStockSkus.length > 0 ? inStockSkus : skus;
        const prices = targetSkus.map(s => Number(s.price) || 0).filter(p => p > 0);
        if (prices.length === 0) return 'Sold Out';
        const min = Math.min(...prices);
        return formatVnd(min);
      })();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-50">
          <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">Quick Add</h2>
          <button onClick={handleClose} className="p-2.5 hover:bg-slate-100 rounded-full transition-all group">
            <X className="text-slate-400 group-hover:text-slate-900 w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8">
            {/* Product Summary */}
            <div className="flex gap-8 mb-10 pb-8 border-b border-slate-50">
              <div className="w-32 h-32 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                <img src={imageSrc} alt={quickAddProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-black text-slate-900 text-2xl leading-tight mb-2">{quickAddProduct.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-blue-600">
                    {priceDisplay}
                  </span>
                  {selectedSku && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-widest">
                       {selectedSku.stock} In Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Options Selection - Identical to ProductInfo */}
            <div className="space-y-8">
              {optionGroups.map((group) => {
                const { key, label, values } = group;
                const selected = selectedOptions[key];
                const isColorAttr = key.toLowerCase() === 'color';

                return (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">{label}:</span>
                      {selected && <span className="text-sm font-bold text-blue-600">{selected}</span>}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {values.map(val => {
                        const isSelected = selected === val;
                        const swatch = isColorAttr ? getColorSwatch(val) : null;

                        // Availability check
                        const isOptionDisabled = !skus.some(sku => {
                          if ((sku.attributes || {})[key] !== val) return false;
                          const matchesOthers = Object.entries(selectedOptions).every(([k, v]) => {
                            if (k === key) return true;
                            return (sku.attributes || {})[k] === v;
                          });
                          return matchesOthers && (sku.stock || 0) > 0;
                        });

                        if (swatch) {
                          return (
                            <button
                              key={val}
                              title={val}
                              disabled={isOptionDisabled}
                              onClick={() => handleSelect(key, val)}
                              className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                                isSelected ? 'border-blue-600 ring-4 ring-blue-100 scale-110' : 'border-slate-100 hover:border-slate-300'
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
                            className={`px-6 py-2.5 text-xs font-black rounded-xl border-2 transition-all relative overflow-hidden ${
                              isSelected
                                ? 'border-blue-600 text-blue-600 bg-blue-50 shadow-sm'
                                : 'border-slate-100 text-slate-600 hover:border-slate-200 bg-slate-50/50'
                            } ${isOptionDisabled ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border-transparent' : ''}`}
                          >
                            {val}
                            {isOptionDisabled && (
                              <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                                 <div className="w-full h-0.5 bg-slate-500 -rotate-12 transform" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/30">
          <button
            onClick={handleAdd}
            disabled={isAddDisabled}
            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
              isAddDisabled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
            }`}
          >
            {isOutOfStock ? 'Product Sold Out' : !selectedSku ? 'Select All Options' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
