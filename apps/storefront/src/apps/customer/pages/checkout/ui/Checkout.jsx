import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CheckoutForm, { CITY_OPTIONS, STATE_OPTIONS } from '../../../../../features/checkout/ui/CheckoutForm';
import OrderSummary from '../../../../../features/checkout/ui/OrderSummary';
import { useAppContext } from '../../../../../app/providers/AppContext';
import { useStorefrontTenant } from '../../../../../features/theme/useStorefrontTenant';
import { orderService } from '../../../../../shared/api/orderService';

const formatAddressText = (address) => {
  return [
    address?.street,
    address?.city,
    address?.state,
    address?.zip,
    address?.country,
  ]
    .filter(Boolean)
    .join(', ');
};

export default function Checkout() {
  const navigate = useNavigate();
  const { isLoggedIn, user, cartItems, cartTotal, refreshCart } = useAppContext();
  const { tenantId } = useStorefrontTenant();

  const [isProcessing, setIsProcessing] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('new');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [shippingFee, setShippingFee] = useState(5.00);
  const [addresses, setAddresses] = useState([]);

  const [contactInfo, setContactInfo] = useState({
    name: user?.email?.split('@')?.[0] || 'Guest Customer',
    email: user?.email || 'guest@example.com',
    phone: '',
  });
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [editContactForm, setEditContactForm] = useState({ ...contactInfo });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(true);
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isLoggedIn, navigate]);

  const validateAddress = () => {
    const errors = {};
    if (!street.trim()) errors.street = 'Street address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditContact = (e) => {
    e.preventDefault();
    setEditContactForm({ ...contactInfo });
    setIsEditingContact(true);
  };

  const handleCancelContact = () => setIsEditingContact(false);

  const handleSaveContact = () => {
    setIsSavingContact(true);
    setTimeout(() => {
      setContactInfo({ ...editContactForm });
      setIsSavingContact(false);
      setIsEditingContact(false);
      toast.success('Thông tin liên hệ đã được cập nhật!');
    }, 1000);
  };

  const handleSaveNewAddress = () => {
    if (validateAddress()) {
      const newAddressId = `address_${Date.now()}`;
      const newAddress = {
        id: newAddressId,
        label: `Address ${addresses.length + 1}`,
        street,
        city: CITY_OPTIONS.find(o => o.value === city)?.label || city,
        state: STATE_OPTIONS.find(o => o.value === state)?.label || state,
        zip: '',
        country: 'United States'
      };
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddressId);
      setIsAddingNewAddress(false);
      setStreet(''); setCity(''); setState('');
      setAddressErrors({});
      toast.success('Thêm địa chỉ giao hàng thành công!');
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để checkout');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng đang trống, không thể checkout');
      return;
    }

    let shippingAddress;
    if (selectedAddress === 'new') {
      if (!validateAddress()) {
        setIsAddingNewAddress(true);
        return;
      }

      shippingAddress = {
        name: contactInfo.name,
        street,
        city: CITY_OPTIONS.find(o => o.value === city)?.label || city,
        state: STATE_OPTIONS.find(o => o.value === state)?.label || state,
        zip: '00000',
        country: 'United States',
      };
    } else {
      const addr = addresses.find(a => a.id === selectedAddress);
      if (!addr) {
        toast.error('Địa chỉ giao hàng không hợp lệ');
        return;
      }

      shippingAddress = {
        name: contactInfo.name,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        country: addr.country,
      };
    }

    setIsProcessing(true);

    try {
      const apiPaymentMethod = paymentMethod === 'bank' ? 'BankTransfer' : 'COD';

      const checkoutResponse = await orderService.checkout({
        address: formatAddressText(shippingAddress),
        paymentMethod: apiPaymentMethod,
      });

      await refreshCart();

      const fallbackOrderItems = cartItems.map((item) => ({
        id: item.cartId,
        productSkuId: item.productSkuId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.price,
        image: item.image,
        skuAttributes: item.skuAttributes,
      }));

      setIsProcessing(false);

      const orderData = {
        ...checkoutResponse,
        id: checkoutResponse?.id || `ORDER-${Date.now()}`,
        createdAt: checkoutResponse?.createdAt || new Date().toISOString(),
        status: checkoutResponse?.status || 'Pending',
        paymentMethod: checkoutResponse?.paymentMethod || apiPaymentMethod,
        paymentStatus: checkoutResponse?.paymentStatus || 'Pending',
        totalAmount: checkoutResponse?.totalAmount ?? (cartTotal + shippingFee),
        orderItems: Array.isArray(checkoutResponse?.orderItems) && checkoutResponse.orderItems.length > 0
          ? checkoutResponse.orderItems
          : fallbackOrderItems,
        shippingAddress,
        payment: {
          methodName: apiPaymentMethod === 'BankTransfer' ? 'Bank Transfer' : 'Cash on Delivery (COD)',
          transactionId: checkoutResponse?.transactionId || 'N/A',
        },
      };

      toast.success('Đặt hàng thành công!');
      if (orderData.id) {
        navigate('/order-confirmation', { state: { orderData } });
        return;
      }

      navigate('/account', { state: { screen: 'my-orders' } });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Checkout thất bại, vui lòng thử lại');
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 w-full grow">
      <div className="flex flex-col lg:flex-row gap-8">
        <CheckoutForm
          contactInfo={contactInfo}
          isEditingContact={isEditingContact}
          isSavingContact={isSavingContact}
          editContactForm={editContactForm}
          setEditContactForm={setEditContactForm}
          handleEditContact={handleEditContact}
          handleCancelContact={handleCancelContact}
          handleSaveContact={handleSaveContact}
          addresses={addresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          isAddingNewAddress={isAddingNewAddress}
          setIsAddingNewAddress={setIsAddingNewAddress}
          street={street} setStreet={setStreet}
          city={city} setCity={setCity}
          state={state} setState={setState}
          addressErrors={addressErrors}
          setAddressErrors={setAddressErrors}
          handleSaveNewAddress={handleSaveNewAddress}
          shippingFee={shippingFee}
          setShippingFee={setShippingFee}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
        <OrderSummary
          cartItems={cartItems}
          cartSubtotal={cartTotal}
          shippingFee={shippingFee}
          isProcessing={isProcessing}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </main>
  );
}
