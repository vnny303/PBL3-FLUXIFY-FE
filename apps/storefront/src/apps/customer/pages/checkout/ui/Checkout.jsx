import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CheckoutForm, { CITY_OPTIONS, STATE_OPTIONS } from '../../../../../features/checkout/ui/CheckoutForm';
import OrderSummary from '../../../../../features/checkout/ui/OrderSummary';

export default function Checkout() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('new');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [shippingFee, setShippingFee] = useState(5.00);
  const [addresses, setAddresses] = useState([]);

  const [contactInfo, setContactInfo] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 000-1234'
  });
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [editContactForm, setEditContactForm] = useState({ ...contactInfo });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(true);
  const [addressErrors, setAddressErrors] = useState({});

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

  const handlePlaceOrder = () => {
    if (selectedAddress === 'new') {
      if (!validateAddress()) { setIsAddingNewAddress(true); return; }
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      let finalAddress = null;
      if (selectedAddress === 'new') {
        finalAddress = {
          name: contactInfo.name, street,
          city: CITY_OPTIONS.find(o => o.value === city)?.label || city,
          state: STATE_OPTIONS.find(o => o.value === state)?.label || state,
          zip: '62704', country: 'United States'
        };
      } else {
        const addr = addresses.find(a => a.id === selectedAddress);
        if (addr) finalAddress = { name: contactInfo.name, street: addr.street, city: addr.city, state: addr.state, zip: addr.zip, country: addr.country };
      }
      const orderData = {
        shippingAddress: finalAddress,
        payment: {
          methodName: paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery (COD)',
          transactionId: paymentMethod === 'bank' ? 'TXN-' + Math.floor(Math.random() * 10000000) : 'N/A'
        }
      };
      toast.success('Đặt hàng thành công!');
      navigate('/order-confirmation', { state: { orderData } });
    }, 2000);
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
          shippingFee={shippingFee}
          isProcessing={isProcessing}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </main>
  );
}
