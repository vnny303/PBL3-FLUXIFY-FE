import { useState } from 'react';
import { Package, Tag, CheckCircle, Info, Bell } from 'lucide-react';
import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';

const initialNotifications = [
  { 
    id: 1, 
    title: 'Welcome to Fluxify!', 
    desc: 'Welcome to our store. We hope you have an amazing shopping experience with us!', 
    time: 'Just now', 
    icon: Info, 
    iconBg: 'bg-blue-100', 
    iconColor: 'text-blue-600', 
    isRead: false 
  }
];

export default function Notifications() {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })));

  const markAsRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));

  const deleteNotification = (id) => setNotifications(notifications.filter(n => n.id !== id));

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <section className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="text-slate-500 mt-1">
            You have <span className="font-semibold" style={{ color: primaryColor }}>{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="text-sm font-semibold hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
          style={unreadCount > 0 ? { color: primaryColor } : {}}
        >
          Mark all as read
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {['all', 'unread'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-colors -mb-px ${
              filter === f
                ? ''
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
            style={filter === f ? { color: primaryColor, borderBottomColor: primaryColor } : {}}
          >
            {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">No notifications</p>
              <p className="text-sm text-slate-400 mt-1">You're all caught up! Check back later.</p>
            </div>
          </div>
        ) : (
          filtered.map(notif => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className={`p-5 flex gap-4 items-start transition-colors ${!notif.isRead ? '' : 'hover:bg-slate-50'}`}
                style={!notif.isRead ? { backgroundColor: `${primaryColor}0D` } : {}}
              >
                <div className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${notif.iconBg}`}>
                  <Icon className={`w-5 h-5 ${notif.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold text-slate-900 ${!notif.isRead ? '' : 'font-semibold'}`}>
                      {notif.title}
                      {!notif.isRead && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full align-middle" style={{ backgroundColor: primaryColor }}></span>
                      )}
                    </p>
                    <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                  <div className="flex gap-4 mt-2">
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: primaryColor }}
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
