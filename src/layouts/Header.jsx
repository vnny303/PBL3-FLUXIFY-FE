import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ShoppingBag, Package, MapPin, Settings, LogOut, User, ShoppingCart, Menu, Tag, Info, CheckCircle, Heart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '../contexts/AppContext';

export default function Header() {
  const { setShowModal, isLoggedIn, setIsLoggedIn, setShowCart, cartCount, wishlistCount } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);

  const initialNotifications = [
    { id: 1, title: 'Order Delivered', desc: 'Your order #FLX-9823 has been delivered successfully.', time: '2 mins ago', icon: Package, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', isRead: false, path: '/account', state: { screen: 'my-orders' } },
    { id: 2, title: 'Flash Sale Alert', desc: 'Get up to 50% off on premium Developer Tools. Limited time only!', time: '2 hours ago', icon: Tag, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', isRead: false, path: '/shop' },
    { id: 3, title: 'Payment Confirmed', desc: 'We received your payment for the Nexus Core subscription.', time: '1 day ago', icon: CheckCircle, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', isRead: true, path: '/account', state: { screen: 'my-orders' } },
    { id: 4, title: 'Account Security', desc: 'New login detected from Chrome on Windows.', time: '2 days ago', icon: Info, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', isRead: true, path: '/account', state: { screen: 'profile-settings' } }
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setShowNotifDropdown(false);
    if (notif.path) {
      navigate(notif.path, { state: notif.state });
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          <div className="flex items-center gap-2 shrink-0 cursor-pointer">
            <Link to="/" className="flex items-center gap-2 text-primary">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Fluxify</span>
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-slate-600 hover:text-primary'}`}>Home</Link>
            <Link to="/shop" className={`text-sm font-semibold transition-colors ${location.pathname.includes('/shop') ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-slate-600 hover:text-primary'}`}>Shop / Products</Link>
            <Link to="/about" className={`text-sm font-semibold transition-colors ${location.pathname.includes('/about') ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-slate-600 hover:text-primary'}`}>About Us</Link>
            <Link to="/contact" className={`text-sm font-semibold transition-colors ${location.pathname.includes('/contact') ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-slate-600 hover:text-primary'}`}>Contact</Link>
          </nav>
          <div className="hidden md:flex flex-1 max-w-sm justify-end">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className=" text-xl" />
              </div>
              <input className="block w-full rounded-xl border-none bg-slate-100 py-2 pl-10 pr-3 text-sm placeholder-slate-500 focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="Search products..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 relative">
            {isLoggedIn ? (
              <>
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => {
                      setShowNotifDropdown(!showNotifDropdown);
                      setShowDropdown(false);
                    }}
                    className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Bell />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-50 transform origin-top-right transition-all overflow-hidden flex flex-col">
                      <div className="px-5 py-3 border-b flex items-center justify-between border-slate-100">
                        <span className="font-bold text-slate-900 text-sm">Notifications</span>
                        <button onClick={markAllAsRead} className="text-xs font-semibold text-primary hover:underline">Mark all as read</button>
                      </div>
                      <div className="max-h-[350px] overflow-y-auto">
                        {notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.iconBg}`}>
                              <notif.icon className={`w-5 h-5 ${notif.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{notif.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notif.desc}</p>
                              <p className="text-[10px] font-semibold text-slate-400 mt-1.5">{notif.time}</p>
                            </div>
                            {!notif.isRead && (
                              <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="px-5 py-3 border-t border-slate-100 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setShowNotifDropdown(false)}>
                        <Link to="/account" state={{ screen: 'notifications' }} className="text-xs font-bold text-primary hover:underline block w-full h-full">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/wishlist" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center">
                  <Heart />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{wishlistCount}</span>
                  )}
                </Link>
                <button onClick={() => setShowCart(true)} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <ShoppingBag />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{cartCount}</span>
                  )}
                </button>
                <div className="relative" ref={dropdownRef}>
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
                        <Link 
                          to="/account" 
                          state={{ screen: 'my-orders' }}
                          onClick={() => setShowDropdown(false)}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors"
                        >
                          <Package className=" text-slate-400 text-[20px]" />
                          My Orders
                        </Link>
                        <Link 
                          to="/account" 
                          state={{ screen: 'saved-addresses' }}
                          onClick={() => setShowDropdown(false)}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors"
                        >
                          <MapPin className=" text-slate-400 text-[20px]" />
                          Saved Addresses
                        </Link>
                        <Link 
                          to="/account" 
                          state={{ screen: 'profile-settings' }}
                          onClick={() => setShowDropdown(false)}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors"
                        >
                          <Settings className=" text-slate-400 text-[20px]" />
                          Profile Settings
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 py-2">
                        <button 
                          onClick={() => {
                            setIsLoggedIn(false);
                            setShowDropdown(false);
                            localStorage.removeItem('tenant_token');
                            toast.success('Đã đăng xuất tài khoản!');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <LogOut className=" text-[20px]" />
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
                  <User />
                </button>
                <button onClick={() => setShowModal(true)} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <ShoppingCart />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{cartCount}</span>
                  )}
                </button>
              </>
            )}
            <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}