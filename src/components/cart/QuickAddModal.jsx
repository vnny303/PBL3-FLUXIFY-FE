import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export default function QuickAddModal() {
  const { quickAddProduct, setQuickAddProduct, addToCart } = useAppContext();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(null);
  }, [quickAddProduct]);

  if (!quickAddProduct) return null;

  const isAddDisabled = 
    (quickAddProduct.variants?.sizes && !selectedSize) || 
    (quickAddProduct.variants?.colors && !selectedColor);

  const handleAdd = () => {
    if (!isAddDisabled) {
      addToCart(quickAddProduct, 1, selectedColor || 'Default', selectedSize || 'Standard');
      setQuickAddProduct(null);
    }
  };

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
              <img src={quickAddProduct.img} alt={quickAddProduct.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">{quickAddProduct.name}</h3>
              <p className="text-primary font-bold mt-1">{quickAddProduct.price}</p>
            </div>
          </div>

          {quickAddProduct.variants?.sizes && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {quickAddProduct.variants.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm font-semibold border rounded-full transition-all ${
                      selectedSize === size 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quickAddProduct.variants?.colors && (
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Color</h4>
              <div className="flex flex-wrap gap-2">
                {quickAddProduct.variants.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm font-semibold border rounded-full transition-all ${
                      selectedColor === color 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

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
