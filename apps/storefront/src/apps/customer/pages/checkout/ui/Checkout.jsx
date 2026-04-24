import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CheckoutForm from '../../../../../features/checkout/ui/CheckoutForm';
import OrderSummary from '../../../../../features/checkout/ui/OrderSummary';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import { orderService } from '../../../../../shared/api/orderService';
import { addressService } from '../../../../../shared/api/addressService';
import { SHIPPING_METHODS } from '../../../../../shared/lib/constants';

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoggedIn, user, cartItems, cartTotal, refreshCart } = useAppContext();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [shippingMethodId, setShippingMethodId] = useState(SHIPPING_METHODS.STANDARD.id);
  const [orderNote, setOrderNote] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isLoggedIn, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isLoggedIn && cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/shop');
    }
  }, [cartItems.length, isLoggedIn, navigate]);

  // Derive shipping fee
  const shippingFee = useMemo(() => {
    const method = Object.values(SHIPPING_METHODS).find(m => m.id === shippingMethodId);
    return method ? method.fee : 0;
  }, [shippingMethodId]);

  // Fetch saved addresses
  const { data: addressResponse, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['customer-addresses', user?.userId],
    queryFn: () => addressService.getAddresses(user?.tenantId, user?.userId),
    enabled: !!user?.userId,
  });

  const addresses = addressResponse?.data || [];

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = useMemo(() => 
    addresses.find(a => a.id === selectedAddressId), 
    [addresses, selectedAddressId]
  );

  // Mutation for adding new address
  const { mutate: addAddress, isPending: isAddingAddress } = useMutation({
    mutationFn: (newAddr) => addressService.createAddress(user?.tenantId, user?.userId, newAddr),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', user?.userId] });
      setSelectedAddressId(response.data.id);
      setIsAddressModalOpen(false);
      toast.success('Address added successfully');
    },
    onError: () => toast.error('Failed to add address')
  });

  // Build the formatted address string
  const buildFormattedAddress = (addr, note) => {
    if (!addr) return '';
    const base = `${addr.receiverName} | ${addr.phone}, ${addr.streetAddress}, ${addr.ward}, ${addr.district}, ${addr.province}, ${addr.country}`;
    return note.trim() ? `${base} | Note: ${note.trim()}` : base;
  };

  // Checkout Mutation
  const { mutate: placeOrder, isPending: isProcessing } = useMutation({
    mutationFn: ({ address, paymentMethod: pm }) =>
      orderService.checkout({ address, paymentMethod: pm }),
    onSuccess: async (checkoutResponse, { finalAddress, apiPaymentMethod }) => {
      // 1. Success: Clear locally (via refresh)
      await refreshCart();
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] });

      // Build items for confirmation page display
      const fallbackOrderItems = cartItems.map((item) => ({
        id: item.cartId,
        productSkuId: item.productSkuId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.price,
        image: item.image,
        skuAttributes: item.skuAttributes,
      }));

      const orderData = {
        ...checkoutResponse,
        id: checkoutResponse?.id || `ORDER-${Date.now()}`,
        createdAt: checkoutResponse?.createdAt || new Date().toISOString(),
        status: checkoutResponse?.status || 'Pending',
        paymentMethod: apiPaymentMethod,
        totalAmount: checkoutResponse?.totalAmount ?? (cartTotal + shippingFee),
        orderItems: (checkoutResponse?.orderItems?.length > 0) 
            ? checkoutResponse.orderItems 
            : fallbackOrderItems,
        shippingAddress: finalAddress,
        payment: {
          methodName: apiPaymentMethod === 'BankTransfer' ? 'Bank Transfer' : 'Cash on Delivery (COD)',
          transactionId: checkoutResponse?.transactionId || 'N/A',
        },
      };

      toast.success('Order placed successfully!');
      
      // Save for reload safety
      sessionStorage.setItem('fluxify_last_created_order', JSON.stringify(orderData));
      
      // 2. Success: Redirect to Confirmation
      navigate('/order-confirmation', { state: { orderData } });
    },
    onError: (error) => {
      // 3. Error: Keep state, show toast
      toast.error(error?.response?.data?.message || 'Checkout failed, please try again');
    },
  });

  const handlePlaceOrder = () => {
    // Validation
    if (!isLoggedIn) { 
      toast.error('Please login to checkout'); 
      navigate('/login', { state: { from: '/checkout' } });
      return; 
    }
    if (cartItems.length === 0) { 
      toast.error('Your cart is empty'); 
      navigate('/shop');
      return; 
    }
    if (!selectedAddress) { 
      toast.error('Please select a shipping address'); 
      return; 
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    const addressString = buildFormattedAddress(selectedAddress, orderNote);
    const apiPaymentMethod = paymentMethod === 'bank' ? 'BankTransfer' : 'COD';

    placeOrder({
      address: addressString,
      paymentMethod: apiPaymentMethod,
      finalAddress: addressString,
      apiPaymentMethod,
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 w-full grow">
      <div className="flex flex-col lg:flex-row gap-8">
        <CheckoutForm
          userEmail={user?.email}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          isAddressModalOpen={isAddressModalOpen}
          onCloseAddressModal={() => setIsAddressModalOpen(false)}
          onAddAddress={addAddress}
          isAddingAddress={isAddingAddress}
          isLoadingAddresses={isLoadingAddresses}
          shippingMethodId={shippingMethodId}
          onSelectShippingMethod={setShippingMethodId}
          orderNote={orderNote}
          onChangeOrderNote={setOrderNote}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          selectedAddress={selectedAddress}
          cartTotal={cartTotal + shippingFee}
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
