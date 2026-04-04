import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../../widgets/Sidebar';
import MyOrders from './MyOrders';
import SavedAddresses from './SavedAddresses';
import ProfileSettings from './ProfileSettings';
import OrderDetails from './OrderDetails';
import Notifications from './Notifications';
import { useAppContext } from '../../../../../app/providers/AppContext';
import { orderService } from '../../../../../shared/api/orderService';

export default function AccountPage() {
  const { session } = useAppContext();
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState(location.state?.screen || 'my-orders');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderFeatureMessage, setOrderFeatureMessage] = useState('');

  useEffect(() => {
    if (location.state?.screen) {
      setCurrentScreen(location.state.screen);
    }
  }, [location.state]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!session?.tenantId || !session?.userId) return;

      try {
        const result = await orderService.getCustomerOrders(session.tenantId, session.userId);
        setOrders(result);
        setOrderFeatureMessage('');
      } catch (error) {
        if (error?.response?.status === 404) {
          setOrderFeatureMessage('Feature not available: endpoint customer orders chưa sẵn sàng.');
          setOrders([]);
          return;
        }
        setOrderFeatureMessage('Không thể tải lịch sử đơn hàng.');
      }
    };

    loadOrders();
  }, [session?.tenantId, session?.userId]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'my-orders':
        return <MyOrders setCurrentScreen={setCurrentScreen} setSelectedOrderId={setSelectedOrderId} orders={orders} featureMessage={orderFeatureMessage} />;
      case 'saved-addresses':
        return <SavedAddresses />;
      case 'profile-settings':
        return <ProfileSettings />;
      case 'order-details':
        return <OrderDetails setCurrentScreen={setCurrentScreen} order={orders.find(o => o.id === selectedOrderId) || orders[0]} />;
      case 'notifications':
        return <Notifications />;
      default:
        return <MyOrders setCurrentScreen={setCurrentScreen} setSelectedOrderId={setSelectedOrderId} orders={orders} featureMessage={orderFeatureMessage} />;
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
