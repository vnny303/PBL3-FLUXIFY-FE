import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import ProductCard from '../../../../../entities/product/ui/ProductCard';

import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';
import { useStorefrontTenant } from '../../../../../features/theme/useStorefrontTenant';
import { reviewService } from '../../../../../shared/api/reviewService';

// Dynamic Category Cover Image Derivation Helper
const getCategoryCoverImage = (cat, globalProducts) => {
  if (!cat) return null;
  
  // 1. Future backend response support
  if (cat.imageUrl) return cat.imageUrl;

  const getProductImage = (prod) => {
    if (!prod) return null;
    if (prod.imgUrls && prod.imgUrls.length > 0) return prod.imgUrls[0];
    if (prod.images && prod.images.length > 0) return prod.images[0];
    if (prod.imageUrl) return prod.imageUrl;
    if (prod.thumbnail) return prod.thumbnail;
    if (prod.productImage) return prod.productImage;
    return null;
  };

  // 2. First product image from category.products
  if (cat.products && cat.products.length > 0) {
    for (const prod of cat.products) {
      const img = getProductImage(prod);
      if (img) return img;
    }
  }

  // 3. First product in global list with matching categoryId or categoryName
  if (globalProducts && globalProducts.length > 0) {
    const matchingProds = globalProducts.filter(
      p => p.categoryId === cat.id || 
      (p.categoryName && cat.name && p.categoryName.toLowerCase() === cat.name.toLowerCase())
    );
    for (const prod of matchingProds) {
      const img = getProductImage(prod);
      if (img) return img;
    }
  }

  return null;
};



export default function Home() {
  const { handleQuickAdd, setSelectedProduct, products, categories, isLoadingInventory, inventoryError } = useAppContext();
  const { content, theme, isLoadingTenant, tenantError } = useStorefrontConfig();
  const { tenantId } = useStorefrontTenant();
  const textColor = theme?.colors?.text || '#111827';
  const navigate = useNavigate();
  const featuredProducts = products.slice(0, 4);

  const featuredReviewSummaryKey = featuredProducts
    .map((item) => {
      const skus = item?.productSkus || item?.skus || [];
      const skuKey = skus
        .map((sku) => sku?.id || sku?.productSkuId || sku?.skuId)
        .filter(Boolean)
        .join(',');
      return `${item?.id}:${skuKey}`;
    })
    .join('|');

  const { data: featuredReviewSummaryMap = {} } = useQuery({
    queryKey: ['home-product-review-summary-map', tenantId, featuredReviewSummaryKey],
    queryFn: () =>
      reviewService.getProductReviewSummariesByProducts({
        tenantId,
        products: featuredProducts,
        concurrency: 2,
      }),
    enabled: !!tenantId && featuredProducts.length > 0,
    staleTime: 120_000,
  });

  if (isLoadingTenant) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" style={{ borderColor: theme.colors.primary, borderBottomColor: 'transparent' }}></div>
      </div>
    );
  }

  if (tenantError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{tenantError}</h1>
        <p className="text-slate-500">Please check the store URL and try again.</p>
      </div>
    );
  }

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
      <section 
        className="relative overflow-hidden rounded-xl mb-16"
        style={{
          borderRadius: `${theme.layout.borderRadius}px`,
          backgroundColor: '#0f172a'
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url("${content.home.heroImageUrl}")`,
            }}
          ></div>
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${content.home.heroOverlayOpacity ?? 0.5})`
          }}
        ></div>

        <div className="relative px-8 py-12 md:py-20 flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {content.home.title}
          </h1>
          <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed whitespace-pre-line">
            {content.home.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/shop')}
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: `${theme.layout.borderRadius}px`,
              }}
              className="hover:opacity-90 text-white px-8 py-3 font-bold text-lg shadow-lg transition-all transform hover:scale-105"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: textColor }}>
              {content.home.featuredTitle}
            </h2>
            <p className="text-slate-500 mt-2">{content.home.featuredSubtitle}</p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="font-semibold hover:underline flex items-center gap-1"
            style={{ color: theme.colors.primary }}
          >
            View all <ArrowRight className=" text-sm" />
          </button>

        </div>

        {isLoadingInventory ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" style={{ borderColor: theme.colors.primary, borderBottomColor: 'transparent' }}></div>
          </div>
        ) : inventoryError ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
            {inventoryError}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                reviewSummary={featuredReviewSummaryMap[item.id]}
                onQuickAdd={handleQuickAdd}
                onCardClick={() => {
                  setSelectedProduct(item);
                  navigate(`/product/${item.id}`);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
            No featured products yet.
          </div>
        )}
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8" style={{ color: textColor }}>Shop by Category</h2>
        {isLoadingInventory ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" style={{ borderColor: theme.colors.primary, borderBottomColor: 'transparent' }}></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.filter(c => c.isActive !== false).map((cat) => {
              const catProducts = products.filter(p => p.categoryId === cat.id);
              const coverImage = getCategoryCoverImage(cat, products);
              
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate('/shop', { state: { categoryId: cat.id } })}
                  className="group relative block aspect-[4/5] overflow-hidden w-full text-left"
                  style={{ borderRadius: `${theme.layout.borderRadius}px` }}
                >
                  {coverImage ? (
                    <>
                      <img
                        alt={cat.name}
                        src={coverImage}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    </>
                  ) : (
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-colors duration-500"
                      style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      }}
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundColor: `${theme.colors.primary}1A`,
                          color: theme.colors.primary,
                        }}
                      >
                        {cat.name ? cat.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                    </div>
                  )}
                  <div className="absolute bottom-6 left-6 z-10">
                    <h3 className={`text-xl font-bold ${coverImage ? 'text-white' : 'text-slate-800'}`}>{cat.name}</h3>
                    <p className={`text-sm ${coverImage ? 'text-slate-300' : 'text-slate-500'}`}>{catProducts.length}+ Items</p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
            No categories yet.
          </div>
        )}
      </section>
    </main>
  );
}