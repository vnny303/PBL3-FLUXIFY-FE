import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../../app/providers/AppContext';

export default function QuickAddModal() {
  const { quickAddProduct, setQuickAddProduct, addToCart } = useAppContext();
  const [selectedAttrs, setSelectedAttrs] = useState({});

  useEffect(() => {
    setSelectedAttrs({});
  }, [quickAddProduct]);

  if (!quickAddProduct) return null;

  const attrs = quickAddProduct.attributes || {};
  // Each key in product.attributes is plural (e.g. 'colors', 'sizes', 'fabrics')
  // Derive singular key for tracking selection
  const attrEntries = Object.entries(attrs);

  const isAddDisabled = attrEntries.some(([pluralKey, values]) => {
    if (!values || values.length === 0) return false;
    const singularKey = pluralKey.endsWith('s') ? pluralKey.slice(0, -1) : pluralKey;
    return !selectedAttrs[singularKey];
  });

  const handleAdd = () => {
    if (!isAddDisabled) {
      const color = selectedAttrs.color || 'Default';
      const size = selectedAttrs.size || 'Standard';
      addToCart(quickAddProduct, 1, color, size);
      setQuickAddProduct(null);
    }
  };

  const mainImage = quickAddProduct.imgUrls?.[0] || quickAddProduct.img;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl relative">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Select Options</h2>
          <button onClick={() => setQuickAddProduct(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X className="text-slate-500 w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
              <img src={mainImage} alt={quickAddProduct.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">{quickAddProduct.name}</h3>
              <p className="text-primary font-bold mt-1">
                ${typeof quickAddProduct.price === 'number' ? quickAddProduct.price.toFixed(2) : quickAddProduct.price}
              </p>
            </div>
          </div>

          {attrEntries.map(([pluralKey, values]) => {
            const singularKey = pluralKey.endsWith('s') ? pluralKey.slice(0, -1) : pluralKey;
            const label = pluralKey.charAt(0).toUpperCase() + pluralKey.slice(1);
            const selected = selectedAttrs[singularKey];

            return (
              <div key={pluralKey} className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</h4>
                <div className="flex flex-wrap gap-2">
                  {values.map(val => (
                    <button
                      key={val}
                      onClick={() => setSelectedAttrs(prev => ({ ...prev, [singularKey]: val }))}
                      className={`px-4 py-2 text-sm font-semibold border rounded-full transition-all ${
                        selected === val
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <button
            onClick={handleAdd}
            disabled={isAddDisabled}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              isAddDisabled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

