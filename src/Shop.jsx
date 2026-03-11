import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { products } from './data';

export default function Shop() {
  const { setShowModal, setCurrentView, addToCart, setSelectedProduct } = useAppContext();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('Newest Arrivals');
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortDropdownRef]);

  const sortOptions = [
    'Newest Arrivals',
    'Price: Low to High',
    'Price: High to Low',
    'Best Selling'
  ];

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button className="text-xs font-semibold text-primary hover:underline uppercase tracking-wider">Clear All</button>
            </div>
            
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Price Range</h3>
              <div className="px-2">
                <div className="relative h-1 bg-slate-200 rounded-full mb-6">
                  <div className="absolute left-[15%] right-[25%] top-0 h-full bg-primary rounded-full"></div>
                  <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-pointer shadow-sm"></div>
                  <div className="absolute right-[25%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-pointer shadow-sm"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input type="number" defaultValue="0" className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                  </div>
                  <span className="text-slate-400">—</span>
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input type="number" defaultValue="500" className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-primary/20 focus:border-primary outline-none" />
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
                    <input type="checkbox" defaultChecked={i === 0} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" />
                    <span className="text-sm text-slate-700 group-hover:text-primary transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Size/Specification</h3>
              <div className="grid grid-cols-3 gap-2">
                {['S', 'M', 'L', '8GB', '16GB', '32GB'].map((size, i) => (
                  <button key={i} className={`py-2 text-xs font-medium border rounded-lg transition-colors ${i === 1 ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-primary'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <p className="text-sm text-slate-500">
              Showing <span className="text-slate-900 font-bold">24</span> products
            </p>
            <div className="flex items-center gap-3 relative" ref={sortDropdownRef}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block">Sort By</label>
              <div className="relative">
                <button 
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center justify-between w-[200px] bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  {sortBy}
                  <span className="material-symbols-outlined text-slate-400 text-lg ml-2">expand_more</span>
                </button>
                
                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-1.5 z-20 overflow-hidden">
                    {sortOptions.map((option, idx) => (
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
            {products.map((item, i) => (
              <div key={i} className="group bg-white rounded-xl border border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer" onClick={() => {
                setSelectedProduct(item);
                setCurrentView('product');
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
                    <span className="text-xl font-bold text-primary">{item.price}</span>
                    <button onClick={(e) => { 
                      e.stopPropagation(); 
                      addToCart(item);
                    }} className="bg-slate-900 text-white p-2 rounded-lg hover:bg-primary transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1 group">
                <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">chevron_left</span>
                Previous
              </button>
              <div className="flex items-center gap-1">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/25">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-primary/5 hover:text-primary font-medium transition-all">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-primary/5 hover:text-primary font-medium transition-all">3</button>
                <span className="px-2 text-slate-400">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-primary/5 hover:text-primary font-medium transition-all">12</button>
              </div>
              <button className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1 group">
                Next
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">chevron_right</span>
              </button>
            </nav>
          </section>
        </div>
      </div>
    </main>
  );
}
