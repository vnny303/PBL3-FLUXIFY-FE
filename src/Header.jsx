import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from './AppContext';

export default function Header() {
  const { currentView, setCurrentView, setShowModal, isLoggedIn, setIsLoggedIn, setShowCart, cartCount } = useAppContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="text-primary">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Fluxify</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => setCurrentView('home')} className={`text-sm font-semibold transition-colors ${currentView === 'home' ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-slate-600 hover:text-primary'}`}>Home</button>
            <button onClick={() => setCurrentView('shop')} className={`text-sm font-semibold transition-colors ${currentView === 'shop' ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-slate-600 hover:text-primary'}`}>Shop / Products</button>
            <button onClick={() => setCurrentView('about')} className={`text-sm font-semibold transition-colors ${currentView === 'about' ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-slate-600 hover:text-primary'}`}>About Us</button>
            <button onClick={() => setCurrentView('contact')} className={`text-sm font-semibold transition-colors ${currentView === 'contact' ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-slate-600 hover:text-primary'}`}>Contact</button>
          </nav>
          <div className="hidden md:flex flex-1 max-w-sm justify-end">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input className="block w-full rounded-xl border-none bg-slate-100 py-2 pl-10 pr-3 text-sm placeholder-slate-500 focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="Search products..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 relative" ref={dropdownRef}>
            {isLoggedIn ? (
              <>
                <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-blue-500 border-2 border-white"></span>
                </button>
                <button onClick={() => setShowCart(true)} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">local_mall</span>
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-100 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                  >
                    <img src="https://i.pravatar.cc/150?img=11" alt="Alex Thompson" className="w-full h-full object-cover" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Alex Thompson" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">Alex Thompson</p>
                          <p className="text-xs text-slate-500">alex.t@example.com</p>
                        </div>
                      </div>
                      <div className="py-2">
                        <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">inventory_2</span>
                          My Orders
                        </button>
                        <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">location_on</span>
                          Saved Addresses
                        </button>
                        <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">settings</span>
                          Profile Settings
                        </button>
                      </div>
                      <div className="border-t border-slate-100 py-2">
                        <button 
                          onClick={() => {
                            setIsLoggedIn(false);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">logout</span>
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setShowModal(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">person</span>
                </button>
                <button onClick={() => setShowCart(true)} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{cartCount}</span>
                  )}
                </button>
              </>
            )}
            <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

