import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../../widgets/Sidebar';
import MyOrders from './MyOrders';
import SavedAddresses from './SavedAddresses';
import ProfileSettings from './ProfileSettings';
import OrderDetails from './OrderDetails';
import Notifications from './Notifications';

// Mock data for orders matching BE response format
const mockOrders = [
  {
    id: 'ord-001',
    tenantId: 'tenant-demo',
    customerId: 'cust-001',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    status: 'Pending',
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    totalAmount: 82.07,
    createdAt: '2024-10-24T00:00:00Z',
    orderItems: [
      { id: 'orderitem-001', productSkuId: 'sku-001', productName: 'T-Shirt', quantity: 2, unitPrice: 25.00, image: 'https://picsum.photos/seed/shirt1/100/100' },
      { id: 'orderitem-002', productSkuId: 'sku-002', productName: 'Jeans', quantity: 1, unitPrice: 32.07, image: 'https://picsum.photos/seed/jeans1/100/100' },
    ],
  },
  {
    id: 'ord-002',
    tenantId: 'tenant-demo',
    customerId: 'cust-001',
    address: '456 Đường XYZ, Quận 3, TP.HCM',
    status: 'Delivered',
    paymentMethod: 'BankTransfer',
    paymentStatus: 'Paid',
    totalAmount: 145.50,
    createdAt: '2024-09-12T00:00:00Z',
    orderItems: [
      { id: 'orderitem-003', productSkuId: 'sku-003', productName: 'Sneakers', quantity: 1, unitPrice: 145.50, image: 'https://picsum.photos/seed/shoes1/100/100' },
    ],
  },
  {
    id: 'ord-003',
    tenantId: 'tenant-demo',
    customerId: 'cust-001',
    address: '789 Đường DEF, Quận 7, TP.HCM',
    status: 'Delivered',
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    totalAmount: 45.00,
    createdAt: '2024-08-05T00:00:00Z',
    orderItems: [
      { id: 'orderitem-004', productSkuId: 'sku-004', productName: 'Cap', quantity: 1, unitPrice: 20.00, image: 'https://picsum.photos/seed/cap1/100/100' },
      { id: 'orderitem-005', productSkuId: 'sku-005', productName: 'Socks', quantity: 2, unitPrice: 12.50, image: 'https://picsum.photos/seed/socks1/100/100' },
    ],
  },
  {
    id: 'ord-004',
    tenantId: 'tenant-demo',
    customerId: 'cust-001',
    address: '321 Đường GHI, Quận 10, TP.HCM',
    status: 'Delivered',
    paymentMethod: 'BankTransfer',
    paymentStatus: 'Paid',
    totalAmount: 210.99,
    createdAt: '2024-07-18T00:00:00Z',
    orderItems: [
      { id: 'orderitem-006', productSkuId: 'sku-006', productName: 'Jacket', quantity: 1, unitPrice: 150.00, image: 'https://picsum.photos/seed/jacket1/100/100' },
      { id: 'orderitem-007', productSkuId: 'sku-007', productName: 'Boots', quantity: 1, unitPrice: 60.99, image: 'https://picsum.photos/seed/boots1/100/100' },
    ],
  },
  {
    id: 'ord-005',
    tenantId: 'tenant-demo',
    customerId: 'cust-001',
    address: '654 Đường JKL, Quận 1, TP.HCM',
    status: 'Delivered',
    paymentMethod: 'MoMo',
    paymentStatus: 'Paid',
    totalAmount: 35.50,
    createdAt: '2024-06-30T00:00:00Z',
    orderItems: [
      { id: 'orderitem-008', productSkuId: 'sku-008', productName: 'Sunglasses', quantity: 1, unitPrice: 35.50, image: 'https://picsum.photos/seed/sunglasses1/100/100' },
    ],
  },
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
