import React, { useMemo } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';
import { formatVnd } from '../../../shared/lib/formatters';
import { useAppContext } from '../../../app/providers/useAppContext';

export default function ProductCard({ product, onQuickAdd, onCardClick }) {
  const { theme } = useStorefrontConfig();
  const { addToCart } = useAppContext();

  // 1. Data Normalization & SKU Mapping
  const productSkus = product.productSkus || product.skus || [];
  const totalStock = productSkus.reduce((acc, s) => acc + (s.stockQuantity ?? s.stock ?? 0), 0);
  const inStockSkus = productSkus.filter(s => (s.stockQuantity ?? s.stock ?? 0) > 0);
  
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  // 2. Rating & Reviews
  // TODO: Backend should include averageRating and reviewCount in ProductDto/list response
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;

  // 3. Image Priority: User request: Ưu tiên imgUrls[0] -> SKU imgUrl -> others
  const imageSrc = (product.imgUrls && product.imgUrls.length > 0) ? product.imgUrls[0]
    : productSkus.find(s => s.imgUrl)?.imgUrl
    || product.image 
    || product.images?.[0]
    || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop';

  // 4. Price Logic (Min price of in-stock SKUs)
  const priceInfo = useMemo(() => {
    if (isOutOfStock) return { label: 'Sold Out', isMin: false };
    
    // Use in-stock SKUs for pricing if available, else all SKUs if we want to show price even when OOS
    const targetSkus = inStockSkus.length > 0 ? inStockSkus : productSkus;
    const prices = targetSkus.map(s => Number(s.price) || 0).filter(p => p > 0);
    
    if (prices.length === 0) return { label: 'Contact Us', isMin: false };
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const hasVariation = maxPrice > minPrice;
    
    return { 
      label: formatVnd(minPrice), 
      isMin: hasVariation 
    };
  }, [inStockSkus, productSkus, isOutOfStock]);

  const handleAddToCart = (event) => {
    event.stopPropagation();
    if (isOutOfStock) return;
    if (inStockSkus.length === 1) {
      const sku = inStockSkus[0];
      const attributes = sku.attributes || {};
      addToCart(product, sku, 1, attributes);
    } else if (onQuickAdd) {
      onQuickAdd(product);
    }
  };

  const cardRadius = theme?.layout?.borderRadius ? `${theme.layout.borderRadius}px` : '8px';
  const productCardTheme = theme?.components?.productCard || {
    background: '#ffffff',
    text: '#1e293b',
    badge: '#f1f5f9',
    price: '#2563eb'
  };

  return (
    <div
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        backgroundColor: productCardTheme.background,
        color: productCardTheme.text,
        borderRadius: cardRadius,
        border: theme?.colors?.primary ? `1px solid ${theme.colors.primary}1A` : '1px solid #e2e8f0',
      }}
      onClick={onCardClick}
      role={onCardClick ? 'button' : undefined}
      tabIndex={onCardClick ? 0 : undefined}
    >
      {/* Media Section */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          alt={product.name}
          src={imageSrc}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {isOutOfStock && (
            <span className="px-2.5 py-1 text-[10px] font-bold text-white rounded uppercase tracking-wider bg-slate-500/90 shadow-sm" style={{ borderRadius: `${Math.max(theme.layout.borderRadius - 4, 6)}px` }}>
              Sold Out
            </span>
          )}
          {product.isSale && (
             <span className="px-2.5 py-1 text-[10px] font-bold text-white rounded uppercase tracking-wider bg-red-500 shadow-sm" style={{ borderRadius: `${Math.max(theme.layout.borderRadius - 4, 6)}px` }}>
               {product.discountLabel || 'Sale'}
             </span>
          )}
          {product.isNew && (
             <span className="px-2.5 py-1 text-[10px] font-bold text-white rounded uppercase tracking-wider bg-blue-500 shadow-sm" style={{ borderRadius: `${Math.max(theme.layout.borderRadius - 4, 6)}px` }}>
               New
             </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 text-[10px] font-bold text-white rounded uppercase tracking-wider bg-amber-500 shadow-sm" style={{ borderRadius: `${Math.max(theme.layout.borderRadius - 4, 6)}px` }}>
              Best Seller
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col h-[180px]">
        {product.cat && (
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">
            {product.cat}
          </p>
        )}

        <h3 
          className="text-lg font-bold mb-1 transition-colors" 
          style={{ 
            color: productCardTheme.text,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </h3>

        {product.description && (
          <p 
            className="text-sm text-slate-500 mb-2"
            style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.description}
          </p>
        )}

        {/* Metadata line */}
        <div className="flex items-center justify-between mb-3">
          {reviewCount > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <div className="flex items-center gap-0.5">
                <span className="text-xs font-extrabold text-slate-700">{rating}</span>
                <span className="text-[10px] text-slate-400 font-medium">({reviewCount})</span>
              </div>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium italic">No reviews yet</span>
          )}
          <div className="flex-1 flex justify-end">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-400 rounded-full border border-slate-200">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-500 rounded-full border border-red-100 animate-pulse">
                Only {totalStock} Left
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            {priceInfo.isMin && <span className="text-[10px] text-slate-400 font-bold uppercase -mb-1">From</span>}
            <span className={`text-xl font-bold ${isOutOfStock ? 'text-slate-300 italic text-sm' : ''}`} style={{ color: !isOutOfStock ? productCardTheme.price : undefined }}>
              {priceInfo.label}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 transition-all flex items-center justify-center shadow-md hover:scale-110 active:scale-95 ${
              isOutOfStock ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' : 'text-white'
            }`}
            style={{
              backgroundColor: isOutOfStock ? undefined : theme.colors.primary,
              borderRadius: `${Math.max(theme.layout.borderRadius - 4, 10)}px`,
            }}
            aria-label="Add to cart"
            type="button"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}