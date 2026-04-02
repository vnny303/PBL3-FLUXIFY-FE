import { useState } from 'react';
import { Package, Tag, Info, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_SCREENS, ROUTES } from '../../../shared/lib/constants';

const initialNotifications = [
  {
    id: 1,
    title: 'Order Delivered',
    desc: 'Your order #FLX-9823 has been delivered successfully.',
    time: '2 mins ago',
    icon: Package,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    isRead: false,
    path: ROUTES.ACCOUNT,
    state: { screen: ACCOUNT_SCREENS.MY_ORDERS },
  },
  {
    id: 2,
    title: 'Flash Sale Alert',
    desc: 'Get up to 50% off on premium Developer Tools. Limited time only!',
    time: '2 hours ago',
    icon: Tag,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    isRead: false,
    path: ROUTES.SHOP,
  },
  {
    id: 3,
    title: 'Payment Confirmed',
    desc: 'We received your payment for the Nexus Core subscription.',
    time: '1 day ago',
    icon: CheckCircle,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    isRead: true,
    path: ROUTES.ACCOUNT,
    state: { screen: ACCOUNT_SCREENS.MY_ORDERS },
  },
  {
    id: 4,
    title: 'Account Security',
    desc: 'New login detected from Chrome on Windows.',
    time: '2 days ago',
    icon: Info,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    isRead: true,
    path: ROUTES.ACCOUNT,
    state: { screen: ACCOUNT_SCREENS.PROFILE_SETTINGS },
  },
];

export function useNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif, closeDropdown) => {
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)));
    if (closeDropdown) closeDropdown();
    if (notif.path) {
      navigate(notif.path, { state: notif.state });
    }
  };

  return { notifications, unreadCount, markAllAsRead, handleNotificationClick };
}
