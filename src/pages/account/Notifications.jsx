import { useState } from 'react';
import { Package, Tag, CheckCircle, Info, Bell } from 'lucide-react';

const initialNotifications = [
  { id: 1, title: 'Order Delivered', desc: 'Your order #FLX-9823 has been delivered successfully.', time: '2 mins ago', icon: Package, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', isRead: false },
  { id: 2, title: 'Flash Sale Alert', desc: 'Get up to 50% off on premium Developer Tools. Limited time only!', time: '2 hours ago', icon: Tag, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', isRead: false },
  { id: 3, title: 'Payment Confirmed', desc: 'We received your payment for the Nexus Core subscription.', time: '1 day ago', icon: CheckCircle, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', isRead: true },
  { id: 4, title: 'Account Security', desc: 'New login detected from Chrome on Windows. If this was not you, secure your account immediately.', time: '2 days ago', icon: Info, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', isRead: true },
];

export default function Notifications() {
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
            You have <span className="font-semibold text-primary">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="text-sm font-semibold text-primary hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
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
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
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
                className={`p-5 flex gap-4 items-start transition-colors ${!notif.isRead ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}
              >
                <div className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${notif.iconBg}`}>
                  <Icon className={`w-5 h-5 ${notif.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold text-slate-900 ${!notif.isRead ? '' : 'font-semibold'}`}>
                      {notif.title}
                      {!notif.isRead && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500 align-middle"></span>
                      )}
                    </p>
                    <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                  <div className="flex gap-4 mt-2">
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-xs font-semibold text-primary hover:underline"
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
