/**
 * Generates a fallback order object if the backend response is incomplete.
 * Used to ensure the Order Confirmation page has enough data to render.
 */
export const createOrderConfirmationFallback = (checkoutResponse, cartItems, cartTotal, shippingFee, finalAddress, apiPaymentMethod) => {
  const fallbackOrderItems = cartItems.map((item) => ({
    id: item.cartId,
    productSkuId: item.productSkuId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.price,
    image: item.image,
    skuAttributes: item.skuAttributes,
  }));

  return {
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
};
