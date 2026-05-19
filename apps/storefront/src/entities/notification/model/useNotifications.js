import { useState } from 'react';
import { Package, Tag, Info, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_SCREENS, ROUTES } from '../../../shared/lib/constants';

const initialNotifications = [
  {
    id: 1,
    title: 'Welcome to Fluxify!',
    desc: 'Welcome to our store. We hope you have an amazing shopping experience with us!',
    time: 'Just now',
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    isRead: false,
    path: ROUTES.SHOP,
  }
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
