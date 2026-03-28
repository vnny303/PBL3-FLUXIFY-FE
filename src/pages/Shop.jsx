import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ShoppingCart, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { SORT_OPTIONS } from '../utils/constants';
import { useShopFilters } from '../hooks/useShopFilters';

export default function Shop() {
  const { setShowModal, addToCart, setSelectedProduct, handleQuickAdd, searchQuery, setSearchQuery } = useAppContext();
  const navigate = useNavigate();

  const {
    sortBy, setSortBy,
    priceRange, setPriceRange,
    selectedBrands, toggleBrand,
    selectedSizes, toggleSize,
    clearFilters,
    currentPage, totalPages, handlePageChange,
    filteredProducts, currentProducts,
    gridTopRef,
  } = useShopFilters();

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);

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
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
            currentPage === i
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'text-slate-600 hover:bg-primary/5 hover:text-primary'
          }`}
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

  return (
    <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-primary hover:underline uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>
            
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Price Range</h3>
              <div className="px-2">
                <div className="relative h-1 bg-slate-200 rounded-full mb-6 flex items-center">
                  <div className="absolute top-0 h-full bg-primary rounded-full" style={{ left: `${Math.max(0, Math.min(100, (priceRange[0] / 500) * 100))}%`, right: `${Math.max(0, Math.min(100, 100 - (priceRange[1] / 500) * 100))}%` }}></div>
                  <input 
                    type="range" 
                    min="0" max="500" 
                    value={priceRange[0]} 
                    onChange={e => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 1), priceRange[1]])}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm z-10 focus:outline-none" 
                  />
                  <input 
                    type="range" 
                    min="0" max="500" 
                    value={priceRange[1]} 
                    onChange={e => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 1)])}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm z-20 focus:outline-none" 
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input 
                        type="number" 
                        value={priceRange[0]} 
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-primary/20 focus:border-primary outline-none" 
                      />
                    </div>
                  </div>
                  <span className="text-slate-400">—</span>
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input 
                        type="number" 
                        value={priceRange[1]} 
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-primary/20 focus:border-primary outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 pb-8 border-b border-slate-200">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Brand/Collection</h3>
              <div className="space-y-3">
                {['Elite Series', 'Modern Essentials', 'Tech Core', 'Studio Line'].map((brand, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-primary transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Size/Specification</h3>
              <div className="grid grid-cols-3 gap-2">
                {['S', 'M', 'L', '8GB', '16GB', '32GB'].map((size, i) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button 
                      key={i} 
                      onClick={() => toggleSize(size)}
                      className={`py-2 text-xs font-medium border rounded-lg transition-colors ${isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-primary'}`}
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
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-slate-500">
                Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> products
              </p>
              {searchQuery && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Search:</span>
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block">Sort By</label>
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
                            ? 'bg-blue-50/80 text-blue-600 font-bold' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }`}
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
            {currentProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">
                <p>No products found matching your active filters.</p>
              </div>
            ) : (
              currentProducts.map((item, i) => (
                <div key={item.id || i} className="group bg-white rounded-xl border border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer" onClick={() => {
                  setSelectedProduct(item);
                  navigate(`/product/${item.id || i}`); // Assumes items will get IDs, fallback to index
                }}>
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img alt={item.name} src={item.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-emerald-500 text-[10px] font-bold text-white rounded uppercase tracking-wider">In Stock</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-primary">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                      <button onClick={(e) => { 
                        e.stopPropagation(); 
                        if (handleQuickAdd) handleQuickAdd(item);
                      }} className="bg-slate-900 text-white p-2 rounded-lg hover:bg-primary transition-colors flex items-center justify-center">
                        <ShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
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