import { useState } from 'react';
import { Package, MapPin, Settings, LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '../../../app/providers/AppContext';

export default function Sidebar({ currentScreen, setCurrentScreen }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const navItems = [
    { id: 'my-orders', label: 'My Orders', icon: Package },
    { id: 'saved-addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'profile-settings', label: 'Profile Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sticky top-24">
        <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="text-sm font-bold">AT</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">Alex Thompson</p>
            <p className="text-xs text-slate-500 truncate">alex.t@example.com</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || (currentScreen === 'order-details' && item.id === 'my-orders');
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </nav>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Log Out
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  await logout();
                  navigate('/');
                  toast.success('Đã đăng xuất tài khoản!');
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-sm"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

