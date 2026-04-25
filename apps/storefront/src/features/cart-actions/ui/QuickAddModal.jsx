import React, { useEffect, useState, useMemo } from 'react';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
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
  const [quantity, setQuantity] = useState(1);

  const skus = useMemo(() => {
    if (!quickAddProduct) return [];
    const raw = quickAddProduct.skus || quickAddProduct.productSkus || [];
    return Array.isArray(raw) ? raw.filter(Boolean) : [];
  }, [quickAddProduct]);

  useEffect(() => {
    // Reset selected options when product changes or modal closes.
    setSelectedOptions({});
    setQuantity(1);
  }, [quickAddProduct?.id]);
  
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
    if (!quickAddProduct || !skus.length) return null;
    if (optionGroups.length === 0) return skus[0];
    
    const isComplete = optionGroups.every(group => !!selectedOptions[group.key]);
    if (!isComplete) return null;

    return skus.find(sku => 
      optionGroups.every(group => (sku.attributes || {})[group.key] === selectedOptions[group.key])
    );
  }, [skus, selectedOptions, optionGroups]);

  useEffect(() => {
    if (!quickAddProduct || !skus.length || Object.keys(selectedOptions).length > 0) return;

    const firstAvailableSku = skus.find((sku) => (sku?.stockQuantity ?? sku?.stock ?? 0) > 0) || skus[0];
    if (!firstAvailableSku?.attributes) return;

    setSelectedOptions({ ...firstAvailableSku.attributes });
  }, [quickAddProduct, skus, selectedOptions]);

  const isOutOfStock = useMemo(() => {
    const totalStock = skus.reduce((sum, s) => sum + (s.stockQuantity ?? s.stock ?? 0), 0);
    return totalStock === 0;
  }, [skus]);

  const selectedSkuStock = selectedSku?.stockQuantity ?? selectedSku?.stock ?? 0;
  const isAddDisabled = !selectedSku || selectedSkuStock <= 0 || quantity < 1;

  useEffect(() => {
    if (!selectedSku) return;
    if (selectedSkuStock <= 0) {
      setQuantity(1);
      return;
    }
    if (quantity > selectedSkuStock) {
      setQuantity(selectedSkuStock);
    }
  }, [selectedSku, selectedSkuStock, quantity]);

  const handleAdd = () => {
    if (selectedSku && selectedSkuStock > 0 && quickAddProduct) {
      addToCart(quickAddProduct, selectedSku, quantity, selectedOptions);
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

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = () => {
    if (!selectedSku) return;
    setQuantity((prev) => Math.min(selectedSkuStock, prev + 1));
  };

  const imageSrc = selectedSku?.imgUrl 
    || quickAddProduct?.image 
    || quickAddProduct?.images?.[0]
    || quickAddProduct?.imgUrls?.[0]
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

  if (!quickAddProduct) return null;

  const reviewCount = Number(quickAddProduct.reviewCount) || 0;
  const rating = Number(quickAddProduct.rating) || 0;
  const skuCode = selectedSku?.skuCode || selectedSku?.code || quickAddProduct?.skuCode || null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose}></div>
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          aria-label="Close quick add"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-slate-50 p-6 md:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
            <div className="w-full max-w-[320px] aspect-square rounded-2xl bg-white border border-slate-100 overflow-hidden">
              <img src={imageSrc} alt={quickAddProduct.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="p-6 md:p-7 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {selectedSkuStock > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                  In stock
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                  Sold out
                </span>
              )}
              {skuCode && (
                <span className="text-[11px] text-slate-400 font-semibold">SKU: {skuCode}</span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-1">{quickAddProduct.name}</h2>
            <p className="text-2xl font-black text-primary mb-2">{priceDisplay}</p>

            {reviewCount > 0 && (
              <p className="text-xs text-slate-500 font-medium mb-5">
                {rating > 0 ? `${rating.toFixed(1).replace(/\.0$/, '')} / 5` : 'Rated'} ({reviewCount} reviews)
              </p>
            )}

            <div className="space-y-5">
              {optionGroups.map((group) => {
                const { key, label, values } = group;
                const selected = selectedOptions[key];
                const isColorAttr = key.toLowerCase() === 'color';

                return (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">{label}</span>
                      {selected && <span className="text-xs font-semibold text-slate-700">{selected}</span>}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {values.map((val) => {
                        const isSelected = selected === val;
                        const swatch = isColorAttr ? getColorSwatch(val) : null;

                        const isOptionDisabled = !skus.some((sku) => {
                          if ((sku.attributes || {})[key] !== val) return false;
                          const matchesOthers = Object.entries(selectedOptions).every(([k, v]) => {
                            if (k === key) return true;
                            return (sku.attributes || {})[k] === v;
                          });
                          return matchesOthers && (sku.stockQuantity ?? sku.stock ?? 0) > 0;
                        });

                        if (swatch) {
                          return (
                            <button
                              key={val}
                              title={val}
                              disabled={isOptionDisabled}
                              onClick={() => handleSelect(key, val)}
                              className={`w-9 h-9 rounded-full border-2 transition-all relative ${
                                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-slate-300'
                              } ${isOptionDisabled ? 'opacity-25 cursor-not-allowed grayscale' : ''}`}
                              style={{ backgroundColor: swatch }}
                            >
                              {isOptionDisabled && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-full h-0.5 bg-slate-500 rotate-45" />
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
                            className={`min-w-[64px] px-3.5 py-2 text-sm font-bold rounded-md border transition-all ${
                              isSelected
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                            } ${isOptionDisabled ? 'opacity-35 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-100' : ''}`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div>
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block mb-2">Quantity</span>
                <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={handleDecreaseQty}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 h-9 flex items-center justify-center text-sm font-bold text-slate-900 bg-white border-x border-slate-200">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={handleIncreaseQty}
                    disabled={!selectedSku || selectedSkuStock <= 0 || quantity >= selectedSkuStock}
                    className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {selectedSku && selectedSkuStock > 0 && (
                  <p className="text-xs text-slate-400 mt-2">{selectedSkuStock} items available</p>
                )}
              </div>

              <button
                onClick={handleAdd}
                disabled={isAddDisabled}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAddDisabled
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:brightness-110 active:scale-[0.99]'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? 'Product Sold Out' : !selectedSku ? 'Select All Options' : 'Add to Cart'}
              </button>

              <p className="text-[11px] text-slate-400 font-medium">
                Free shipping on orders over 500.000d • 2-year warranty
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
