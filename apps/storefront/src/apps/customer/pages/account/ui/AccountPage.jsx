import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../../widgets/Sidebar';
import MyOrders from './MyOrders';
import SavedAddresses from './SavedAddresses';
import ProfileSettings from './ProfileSettings';
import OrderDetails from './OrderDetails';
import Notifications from './Notifications';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import { orderService } from '../../../../../shared/api/orderService';

export default function AccountPage() {
  const location = useLocation();
  const { isLoggedIn } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState(location.state?.screen || 'my-orders');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    error: ordersErrorObj,
    refetch: fetchCustomerOrders,
  } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => orderService.getCustomerOrders({
      page: 1,
      pageSize: 50,
      sortBy: 'createdAt',
      sortDir: 'desc',
    }),
    enabled: isLoggedIn,
    select: (data) => Array.isArray(data) ? data : [],
  });

  const ordersError = ordersErrorObj?.response?.data?.message
    || ordersErrorObj?.message
    || null;

  useEffect(() => {
    if (location.state?.screen) {
      setCurrentScreen(location.state.screen);
    }
  }, [location.state]);

  const selectedOrder = useMemo(() => {
    if (orders.length === 0) return null;
    return orders.find((order) => order.id === selectedOrderId) || orders[0];
  }, [orders, selectedOrderId]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'my-orders':
        return (
          <MyOrders
            setCurrentScreen={setCurrentScreen}
            setSelectedOrderId={setSelectedOrderId}
            orders={orders}
            isLoading={isLoadingOrders}
            error={ordersError}
            onRetry={fetchCustomerOrders}
          />
        );
      case 'saved-addresses':
        return <SavedAddresses />;
      case 'profile-settings':
        return <ProfileSettings />;
      case 'order-details':
        return (
          <OrderDetails
            key={selectedOrder?.id || 'empty-order'}
            setCurrentScreen={setCurrentScreen}
            order={selectedOrder}
          />
        );
      case 'notifications':
        return <Notifications />;
      default:
        return (
          <MyOrders
            setCurrentScreen={setCurrentScreen}
            setSelectedOrderId={setSelectedOrderId}
            orders={orders}
            isLoading={isLoadingOrders}
            error={ordersError}
            onRetry={fetchCustomerOrders}
          />
        );
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
