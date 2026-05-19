import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import { PRICE_RANGE_MAX, SORT_OPTIONS } from '../../../../../shared/lib/constants';
import { useShopFilters } from '../../../../../features/product-filter/model/useShopFilters';
import ProductCard from '../../../../../entities/product/ui/ProductCard';
import { useStorefrontTenant } from '../../../../../features/theme/useStorefrontTenant';
import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';
import { reviewService } from '../../../../../shared/api/reviewService';



export default function Shop() {
  const { setSelectedProduct, handleQuickAdd, searchQuery, setSearchQuery, categories } = useAppContext();
  const { tenantId } = useStorefrontTenant();
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;
  const navigate = useNavigate();

  const {
    sortBy, setSortBy,
    priceRange, setPriceRange,
    selectedCategories, toggleCategory,
    selectedSizes, toggleSize,
    clearFilters,
    currentPage, totalPages, handlePageChange,
    filteredProducts, currentProducts,
    isLoadingProducts, productsError,
    gridTopRef,
  } = useShopFilters();

  const allSizes = useMemo(() => {
    return [...new Set(filteredProducts.flatMap(p => {
      const sizes = p.attributes?.sizes || p.attributes?.size || [];
      return Array.isArray(sizes) ? sizes : [sizes];
    }))];
  }, [filteredProducts]);

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);

  const shopReviewSummaryKey = useMemo(() => {
    return currentProducts
      .map((item) => {
        const skus = item?.productSkus || item?.skus || [];
        const skuKey = skus
          .map((sku) => sku?.id || sku?.productSkuId || sku?.skuId)
          .filter(Boolean)
          .join(',');
        return `${item?.id}:${skuKey}`;
      })
      .join('|');
  }, [currentProducts]);

  const { data: shopReviewSummaryMap = {} } = useQuery({
    queryKey: ['shop-product-review-summary-map', tenantId, shopReviewSummaryKey],
    queryFn: () =>
      reviewService.getProductReviewSummariesByProducts({
        tenantId,
        products: currentProducts,
        concurrency: 3,
      }),
    enabled: !!tenantId && currentProducts.length > 0,
    staleTime: 120_000,
  });

  const renderPaginationButtons = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="1" onClick={() => handlePageChange(1)} className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-primary/5 hover:text-primary font-medium transition-all">1</button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="px-2 text-slate-400">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isCurrent = currentPage === i;
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 flex items-center justify-center font-bold transition-all ${
            isCurrent
              ? 'text-white shadow-lg'
              : 'text-slate-600 hover:opacity-80'
          }`}
          style={{
            backgroundColor: isCurrent ? primaryColor : undefined,
            borderRadius: `${borderRadius}px`,
            boxShadow: isCurrent ? `0 10px 15px -3px ${primaryColor}4D` : undefined,
            color: !isCurrent ? undefined : 'white'
          }}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="px-2 text-slate-400">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-primary/5 hover:text-primary font-medium transition-all">{totalPages}</button>
      );
    }

    return pages;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sortDropdownRef]);

  const textColor = theme?.colors?.text || '#111827';
  const textColorSecondary = theme?.colors?.text ? `${theme.colors.text}b3` : '#64748b'; // 70% opacity for secondary text
  const borderColor = theme?.colors?.text ? `${theme.colors.text}20` : '#e2e8f0';

  return (
    <main className="grow w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 py-10 min-h-[600px]">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[70vh]">
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: textColor }}>Filters</h2>
              <button
                onClick={clearFilters}
                className="text-xs font-semibold hover:underline uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                Clear All
              </button>
            </div>

            <div className="mb-8 pb-8" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: textColorSecondary }}>Price Range</h3>
              <div className="px-2">
                <div className="relative h-1 bg-slate-200 rounded-full mb-6 flex items-center">
                  <div 
                    className="absolute top-0 h-full rounded-full" 
                    style={{ 
                      backgroundColor: primaryColor,
                      left: `${Math.max(0, Math.min(100, (priceRange[0] / PRICE_RANGE_MAX) * 100))}%`, 
                      right: `${Math.max(0, Math.min(100, 100 - (priceRange[1] / PRICE_RANGE_MAX) * 100))}%` 
                    }}
                  ></div>
                  <input
                    type="range"
                    min="0" max={PRICE_RANGE_MAX}
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 1), priceRange[1]])}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--thumb-border)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm z-10 focus:outline-none"
                    style={{ '--thumb-border': primaryColor }}
                  />
                  <input
                    type="range"
                    min="0" max={PRICE_RANGE_MAX}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 1)])}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--thumb-border)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm z-20 focus:outline-none"
                    style={{ '--thumb-border': primaryColor }}
                  />

                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">đ</span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full pr-7 pl-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-transparent outline-none text-slate-900"
                        style={{ '--tw-ring-color': `${primaryColor}33`, borderRadius: `${borderRadius}px` }}
                      />
                    </div>
                  </div>
                  <span style={{ color: textColorSecondary }}>-</span>
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">đ</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full pr-7 pl-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-transparent outline-none text-slate-900"
                        style={{ '--tw-ring-color': `${primaryColor}33`, borderRadius: `${borderRadius}px` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 pb-8" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: textColorSecondary }}>Category</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-4 h-4 rounded border-slate-300 focus:ring-transparent cursor-pointer"
                      style={{ color: primaryColor }}
                    />
                    <span className="text-sm transition-colors" style={{ color: selectedCategories.includes(cat.id) ? primaryColor : textColorSecondary }}>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

             <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: textColorSecondary }}>Size / Specification</h3>
              <div className="grid grid-cols-3 gap-2">
                {allSizes.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 text-xs font-medium border transition-colors ${isSelected ? 'text-white' : 'border-slate-200 hover:border-slate-400'}`}
                      style={{ 
                        backgroundColor: isSelected ? primaryColor : undefined,
                        borderColor: isSelected ? primaryColor : undefined,
                        borderRadius: `${borderRadius}px`
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1" ref={gridTopRef}>
          <div className="flex items-center justify-between mb-8 pb-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div className="flex flex-col gap-1">
              <p className="text-sm" style={{ color: textColorSecondary }}>
                Showing <span className="font-bold" style={{ color: textColor }}>{filteredProducts.length}</span> products
              </p>
              {searchQuery && (
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: textColorSecondary }}>Search:</span>
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Search className="w-3 h-3" />
                    {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="ml-0.5 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 relative" ref={sortDropdownRef}>
              <label className="text-xs font-bold uppercase tracking-widest hidden sm:block" style={{ color: textColorSecondary }}>Sort By</label>
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center justify-between w-[200px] bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  {sortBy}
                  <ChevronDown className=" text-slate-400 text-lg ml-2" />
                </button>

                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-1.5 z-20 overflow-hidden">
                    {SORT_OPTIONS.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          sortBy === option
                            ? 'font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }`}
                        style={{ 
                          backgroundColor: sortBy === option ? `${primaryColor}1A` : undefined,
                          color: sortBy === option ? primaryColor : undefined
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoadingProducts ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" style={{ borderBottomColor: 'transparent' }}></div>
              </div>
            ) : productsError ? (
              <div className="col-span-full py-12 text-center border" style={{ color: textColorSecondary, borderColor: borderColor, borderRadius: `${borderRadius}px` }}>
                Failed to load products. Please try again later.
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center" style={{ color: textColorSecondary }}>
                <p>No products found matching your active filters.</p>
              </div>
            ) : (
              currentProducts.map((item, i) => (
                <ProductCard
                  key={item.id || i}
                  product={item}
                  reviewSummary={shopReviewSummaryMap[item.id]}
                  onQuickAdd={handleQuickAdd}
                  onCardClick={() => {
                    setSelectedProduct(item);
                    navigate(`/product/${item.id || i}`);
                  }}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <section className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className=" text-sm transition-transform group-hover:-translate-x-1" />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {renderPaginationButtons()}
                </div>
                <button
                  onClick={() => {
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className=" text-sm transition-transform group-hover:translate-x-1" />
                </button>
              </nav>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

