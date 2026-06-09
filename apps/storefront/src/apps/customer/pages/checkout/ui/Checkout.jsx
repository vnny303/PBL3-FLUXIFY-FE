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
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingMethodId, setShippingMethodId] = useState(SHIPPING_METHODS.STANDARD.id);
  const [orderNote, setOrderNote] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
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

  const addresses = useMemo(
    () => addressResponse?.data || [],
    [addressResponse]
  );

  const effectiveSelectedAddressId = useMemo(() => {
    if (selectedAddressId) return selectedAddressId;
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    return defaultAddr?.id || null;
  }, [addresses, selectedAddressId]);

  const selectedAddress = useMemo(() =>
    addresses.find(a => a.id === effectiveSelectedAddressId),
    [addresses, effectiveSelectedAddressId]
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
    mutationFn: ({ addressId, paymentMethod: pm, orderNote, shippingMethod, finalAddress }) =>
      orderService.checkout({
        addressId,
        paymentMethod: pm,
        orderNote,
        shippingMethod,
        shippingFee,
        user,
        finalAddress,
        selectedAddress,
      }),
    onSuccess: async (checkoutResponse, variables) => {
      const { finalAddress, apiPaymentMethod, cartItemsSnapshot, cartTotalSnapshot, shippingFeeSnapshot } = variables;
      // Build full order object because backend might only return id/orderCode
      const orderData = {
        ...checkoutResponse,
        shippingAddress: checkoutResponse?.shippingAddress || finalAddress,
        paymentMethod: checkoutResponse?.paymentMethod || apiPaymentMethod,
        orderItems: checkoutResponse?.orderItems?.length ? checkoutResponse.orderItems : cartItemsSnapshot.map(item => ({
            id: item.id || item.cartItemId,
            productName: item.productName || item.name,
            quantity: item.quantity,
            unitPrice: item.price ?? item.unitPrice,
            image: item.image || item.imgUrl,
            skuAttributes: item.skuAttributes,
        })),
        totalAmount: checkoutResponse?.totalAmount ?? (cartTotalSnapshot + shippingFeeSnapshot),
        shippingFee: checkoutResponse?.shippingFee ?? shippingFeeSnapshot,
      };

      toast.success('Order placed successfully!');
      await refreshCart();
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
      
      // Save for reload safety using the unified key
      sessionStorage.setItem('fluxify_last_checkout_order', JSON.stringify(orderData));
      
      // 2. Success: Redirect to Confirmation
      navigate('/order-confirmation', {
        state: {
          order: orderData,
          orderData,
          orderId: orderData?.id || checkoutResponse?.id || null,
        },
      });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error?.message || 'Checkout failed, please try again';
      toast.error(message);
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
    const apiPaymentMethod = 'COD';
    const apiShippingMethod = shippingMethodId === SHIPPING_METHODS.STANDARD.id ? 'standard' : 'express';

    placeOrder({
      addressId: selectedAddress.id,
      paymentMethod: apiPaymentMethod,
      orderNote: orderNote,
      shippingMethod: apiShippingMethod,
      finalAddress: addressString,
      // Pass cart snapshot explicitly to ensure it is available in onSuccess
      cartItemsSnapshot: cartItems,
      cartTotalSnapshot: cartTotal,
      shippingFeeSnapshot: shippingFee,
    });
  };

  return (
    <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 py-10 grow">
      <div className="flex flex-col lg:flex-row gap-8">
        <CheckoutForm
          userEmail={user?.email}
          addresses={addresses}
          selectedAddressId={effectiveSelectedAddressId}
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
