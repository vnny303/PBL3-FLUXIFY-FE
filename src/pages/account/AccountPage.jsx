import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import MyOrders from './MyOrders';
import SavedAddresses from './SavedAddresses';
import ProfileSettings from './ProfileSettings';
import OrderDetails from './OrderDetails';
import Notifications from './Notifications';

// Mock data for orders
const mockOrders = [
  {
    id: '#ORD-2024-8921',
    date: 'Oct 24, 2024',
    total: '$82.07',
    status: 'Processing',
    paymentMethod: 'Cash on Delivery',
    items: [
      { name: 'T-Shirt', image: 'https://picsum.photos/seed/shirt1/100/100' },
      { name: 'Jeans', image: 'https://picsum.photos/seed/jeans1/100/100' }
    ]
  },
  {
    id: '#ORD-2024-7543',
    date: 'Sep 12, 2024',
    total: '$145.50',
    status: 'Delivered',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Sneakers', image: 'https://picsum.photos/seed/shoes1/100/100' }
    ]
  },
  {
    id: '#ORD-2024-6102',
    date: 'Aug 05, 2024',
    total: '$45.00',
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    items: [
      { name: 'Cap', image: 'https://picsum.photos/seed/cap1/100/100' },
      { name: 'Socks', image: 'https://picsum.photos/seed/socks1/100/100' }
    ]
  },
  {
    id: '#ORD-2024-5099',
    date: 'Jul 18, 2024',
    total: '$210.99',
    status: 'Delivered',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Jacket', image: 'https://picsum.photos/seed/jacket1/100/100' },
      { name: 'Boots', image: 'https://picsum.photos/seed/boots1/100/100' }
    ]
  },
  {
    id: '#ORD-2024-4112',
    date: 'Jun 30, 2024',
    total: '$35.50',
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    items: [
      { name: 'Sunglasses', image: 'https://picsum.photos/seed/sunglasses1/100/100' }
    ]
  }
];

export default function AccountPage() {
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState(location.state?.screen || 'my-orders');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    if (location.state?.screen) {
      setCurrentScreen(location.state.screen);
    }
  }, [location.state]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'my-orders':
        return <MyOrders setCurrentScreen={setCurrentScreen} setSelectedOrderId={setSelectedOrderId} orders={mockOrders} />;
      case 'saved-addresses':
        return <SavedAddresses />;
      case 'profile-settings':
        return <ProfileSettings />;
      case 'order-details':
        return <OrderDetails setCurrentScreen={setCurrentScreen} order={mockOrders.find(o => o.id === selectedOrderId) || mockOrders[0]} />;
      case 'notifications':
        return <Notifications />;
      default:
        return <MyOrders setCurrentScreen={setCurrentScreen} setSelectedOrderId={setSelectedOrderId} orders={mockOrders} />;
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        {renderScreen()}
      </div>
    </div>
  );
}
