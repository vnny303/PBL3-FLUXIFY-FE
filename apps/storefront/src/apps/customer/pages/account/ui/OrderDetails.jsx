import { useState } from 'react';
import { Loader2, AlertCircle, ChevronDown, CheckCircle, ReceiptText, CreditCard, Truck, CalendarDays, Hash, WalletCards } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ReviewModal from '../../../../../features/product-review/ui/ReviewModal';
import { orderService } from '../../../../../shared/api/orderService';
import { productService } from '../../../../../shared/api/productService';
import { reviewService } from '../../../../../shared/api/reviewService';
import { addressService } from '../../../../../shared/api/addressService';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import OrderItemList from '../../../../../entities/order/ui/OrderItemList';
import OrderStatusTimeline from '../../../../../entities/order/ui/OrderStatusTimeline';
import OrderSummaryCard from '../../../../../entities/order/ui/OrderSummaryCard';
import { formatVnd, parsePrice, getDisplayOrderCode } from '../../../../../shared/lib/formatters';
import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';
import { useStorefrontTenant } from '../../../../../features/theme/useStorefrontTenant';

export default function OrderDetails({ setCurrentScreen, order }) {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;
  const textColor = theme?.colors?.text || '#111827';
  const bgColor = theme?.colors?.background || '#ffffff';
  const cardBg = bgColor === '#ffffff' ? '#ffffff' : `${bgColor}E6`;
  const borderColor = `${primaryColor}1A`;
  const navigate = useNavigate();
  const { tenantId } = useStorefrontTenant();

  const { addToCart, setShowCart, user } = useAppContext();
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState(order?.status || 'Pending');
  const [reviewedItems, setReviewedItems] = useState({});
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [buyingItemIds, setBuyingItemIds] = useState({});
  const [isBuyingWholeOrder, setIsBuyingWholeOrder] = useState(false);

  const { data: addressResponse } = useQuery({
    queryKey: ['customer-addresses', user?.userId],
    queryFn: () => addressService.getAddresses(user?.tenantId, user?.userId),
    enabled: !!order?.addressId && !!user?.userId,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: () => orderService.cancelOrder(order?.id, cancelReason),
    onSuccess: () => {
      setOrderStatus('Cancelled');
      setIsCancelModalOpen(false);
      toast.success('Order cancelled successfully!');
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to cancel order');
    }
  });

  const submitReviewMutation = useMutation({
    mutationFn: (data) => {
      const existing = reviewedItems[selectedProduct?.productSkuId];
      if (existing?.id) {
        return reviewService.updateReview(existing.id, {
          rating: data.rating,
          comment: data.comment,
          photos: data.photos,
        });
      }
      return reviewService.createReview({
        productSkuId: selectedProduct?.productSkuId || selectedProduct?.id,
        rating: data.rating,
        comment: data.comment,
        photos: data.photos,
      });
    },
    onSuccess: (response, variables) => {
      const reviewData = response?.data || response;
      setReviewedItems(prev => ({ 
        ...prev, 
        [selectedProduct.productSkuId]: {
          id: reviewData?.id || prev[selectedProduct.productSkuId]?.id,
          rating: variables.rating,
          comment: variables.comment,
          imageUrls: variables.photos || reviewData?.imageUrls || [],
        }
      }));
      setIsReviewModalOpen(false);
      toast.success('Review Submitted! Thank you for sharing your experience.');
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
    },
    onError: (error) => {
      if (error?.response?.status === 409) {
        toast.error('You have already reviewed this item.');
      } else {
        toast.error(error?.response?.data?.message || 'Failed to submit review');
      }
    }
  });

  const isCancelling = cancelOrderMutation.isPending;
  const [cancelReason, setCancelReason] = useState('');
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-10 min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Order Selected</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center">Please select an order from the list to view its details.</p>
        <button 
          onClick={() => setCurrentScreen('my-orders')} 
          className="mt-6 px-6 py-2 text-white font-semibold transition-colors hover:opacity-90"
          style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
        >
          View My Orders
        </button>
      </div>
    );
  }

  const orderData = order;
  const addressList = addressResponse?.data || [];
  const matchedAddress = addressList.find((addr) => String(addr.id) === String(orderData.addressId));

  const formatAddressRecord = (addr) => {
    if (!addr) return '';
    return [
      [addr.receiverName, addr.phone].filter(Boolean).join(' | '),
      addr.streetAddress,
      addr.ward,
      addr.district,
      addr.province,
      addr.country,
    ].filter(Boolean).join(', ');
  };

  const formatDateTime = (value) => {
    if (!value) return 'Not available';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not available';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShippingMethod = (value) => {
    if (!value) return 'Standard';
    return String(value).replace(/[_-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPaymentValue = (value, fallback = 'Not available') => {
    if (!value) return fallback;
    return String(value).replace(/[_-]/g, ' ').toUpperCase();
  };

  const parseSkuAttributes = (value) => {
    if (!value) return {};
    if (typeof value === 'object') return value;
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  };

  const buildVariantText = (item) => {
    const attrs = parseSkuAttributes(item.skuAttributes || item.selectedOptions || item.SelectedOptions);
    const values = Object.values(attrs).filter(Boolean);
    return item.variant || (values.length > 0 ? values.join(' / ') : 'Standard');
  };

  // Normalize order items: support both BE format (orderItems) and legacy format (items)
  const normalizedItems = (orderData.orderItems || orderData.items || []).map(item => ({
    id: item.id || item.name,
    name: item.productName || item.name,
    variant: buildVariantText(item),
    image: item.imageUrl || item.image || item.imgUrl || item.productImage || `https://picsum.photos/seed/${item.productName || 'product'}/200/300`,
    unitPrice: parsePrice(item.unitPrice ?? item.price),
    price: item.unitPrice != null ? formatVnd(item.unitPrice) : formatVnd(parsePrice(item.price)),
    lineTotal: parsePrice(item.unitPrice ?? item.price) * (item.quantity || 1),
    quantity: item.quantity || 1,
    productId: item.productId || item.ProductId || item.product_id,
    productSkuId: item.productSkuId || item.ProductSkuId || item.product_sku_id,
    skuAttributes: parseSkuAttributes(item.skuAttributes || item.selectedOptions || item.SelectedOptions),
  }));

  const normalizedOrder = {
    ...orderData,
    items: normalizedItems,
    date: orderData.date || (orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''),
    total: parsePrice(orderData.totalAmount ?? orderData.total),
    totalAmount: parsePrice(orderData.totalAmount ?? orderData.total),
    subtotal: parsePrice(orderData.subtotal ?? orderData.subTotal ?? orderData.sub_total ?? 0),
    taxAmount: parsePrice(orderData.taxAmount ?? orderData.tax_amount ?? 0),
    shippingFee: parsePrice(orderData.shippingFee ?? orderData.shipping_fee ?? 0),
    shippingMethod: orderData.shippingMethod || orderData.shipping_method || 'standard',
    shippingAddress: orderData.shippingAddress || orderData.shipping_address || orderData.address || formatAddressRecord(matchedAddress),
    orderNote: orderData.orderNote || orderData.order_note || '',
  };

  const orderInfoItems = [
    { label: 'Order Code', value: getDisplayOrderCode(normalizedOrder), icon: Hash },
    { label: 'Placed At', value: formatDateTime(orderData.createdAt || orderData.created_at), icon: CalendarDays },
    { label: 'Payment Method', value: formatPaymentValue(normalizedOrder.paymentMethod, 'COD'), icon: CreditCard },
    { label: 'Payment Status', value: formatPaymentValue(normalizedOrder.paymentStatus || 'Pending'), icon: WalletCards },
    { label: 'Shipping Method', value: formatShippingMethod(normalizedOrder.shippingMethod), icon: Truck },
    { label: 'Payment Reference', value: normalizedOrder.paymentReference || normalizedOrder.payment_reference || 'Not available', icon: ReceiptText },
  ];

  const cancellationReasons = [
    { id: 'changed_mind', label: 'Changed my mind' },
    { id: 'found_cheaper', label: 'Found a cheaper alternative' },
    { id: 'ordered_mistake', label: 'Ordered by mistake' },
    { id: 'delivery_too_long', label: 'Delivery time is too long' },
    { id: 'other', label: 'Other' }
  ];

  const getVariantDetails = (variant) => {
    const parts = variant ? variant.split(/[•/]/) : [];
    return { size: parts[0]?.trim() || 'Standard', color: parts[1]?.trim() || 'Default' };
  };


  const handleWriteReview = (product) => { 
    if (!product?.productSkuId) {
      toast.error('Cannot review this product because the SKU ID is missing.');
      return;
    }
    setSelectedProduct(product); 
    setIsReviewModalOpen(true); 
  };

  const handleConfirmCancel = () => {
    cancelOrderMutation.mutate();
  };

  const handleViewProduct = async (item) => {
    if (item.productId) {
      navigate(`/product/${item.productId}`);
      return;
    }

    if (!item.productSkuId || !tenantId) {
      toast.error('Cannot open this product because product data is missing.');
      return;
    }

    try {
      const productId = await productService.getProductIdBySkuId(tenantId, item.productSkuId);
      if (!productId) {
        toast.error('Cannot find this product.');
        return;
      }
      navigate(`/product/${productId}`);
    } catch {
      toast.error('Failed to open product.');
    }
  };

  const handleBuyItem = (item, idx) => {
    setBuyingItemIds(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      const { size, color } = getVariantDetails(item.variant);
      const skuAttributes = item.skuAttributes || { size, color };
      const unitPrice = parsePrice(item.price);

      addToCart(
        {
          id: item.productSkuId || item.id || `product-${idx}`,
          productSkuId: item.productSkuId || item.id || `product-${idx}`,
          productName: item.name || 'Product',
          name: item.name || 'Product',
          price: unitPrice,
          image: item.imageUrl || item.image || item.imgUrl || item.productImage || `https://picsum.photos/seed/product${idx}/200/300`,
        },
        {
          id: item.productSkuId || item.id || `product-${idx}`,
          price: unitPrice,
          imgUrl: item.image,
          attributes: skuAttributes,
        },
        1,
        skuAttributes,
        false
      );

      setShowCart(true);
      setBuyingItemIds(prev => ({ ...prev, [idx]: false }));
    }, 500);
  };

  const handleBuyWholeOrder = () => {
    setIsBuyingWholeOrder(true);
    setTimeout(() => {
      normalizedOrder.items.forEach((item, idx) => {
        const { size, color } = getVariantDetails(item.variant);
        const skuAttributes = item.skuAttributes || { size, color };
        const unitPrice = parsePrice(item.price);

        addToCart(
          {
            id: item.productSkuId || item.id || `product-${idx}`,
            productSkuId: item.productSkuId || item.id || `product-${idx}`,
            productName: item.name || 'Product',
            name: item.name || 'Product',
            price: unitPrice,
            image: item.imageUrl || item.image || item.imgUrl || item.productImage || `https://picsum.photos/seed/product${idx}/200/300`,
          },
          {
            id: item.productSkuId || item.id || `product-${idx}`,
            price: unitPrice,
            imgUrl: item.image,
            attributes: skuAttributes,
          },
          item.quantity || 1,
          skuAttributes,
          false
        );
      });
      setShowCart(true);
      setIsBuyingWholeOrder(false);
      toast.success('Entire order has been added back to your cart!');
    }, 500);
  };

  const statusList = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = Math.max(0, statusList.indexOf(orderStatus));
  const progressWidth = `${(currentIndex / (statusList.length - 1)) * 100}%`;
  const statusBadgeStyle = orderStatus === 'Cancelled'
    ? undefined
    : orderStatus === 'Pending' || orderStatus === 'Processing'
      ? undefined
      : { backgroundColor: `${primaryColor}1A`, color: primaryColor };

  return (
    <section className="flex-1 relative">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => setCurrentScreen('my-orders')} 
          className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-colors mb-4"
          style={{ color: primaryColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Orders
        </button>
        <div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border shadow-xl shadow-slate-200/50"
          style={{ borderRadius: `${borderRadius}px`, backgroundColor: cardBg, color: textColor, borderColor }}
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: textColor }}>Order {getDisplayOrderCode(normalizedOrder)}</h1>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                orderStatus === 'Cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                orderStatus === 'Pending' || orderStatus === 'Processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                ''
              }`} style={statusBadgeStyle}>
                {orderStatus}
              </span>
            </div>
            <p className="text-slate-500 mt-1 text-sm">Placed on {normalizedOrder.date} · {normalizedOrder.items.length} Items</p>
          </div>
          <div className="flex gap-3">

            {orderStatus === 'Cancelled' ? (
              <button 
                onClick={handleBuyWholeOrder} 
                disabled={isBuyingWholeOrder} 
                className="px-4 py-2 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 hover:opacity-90"
                style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
              >
                {isBuyingWholeOrder ? <><Loader2 className="w-4 h-4 animate-spin" />Loading...</> : 'Buy Again'}
              </button>
            ) : orderStatus === 'Pending' || orderStatus === 'Processing' ? (
              <button 
                onClick={() => setIsCancelModalOpen(true)} 
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                Cancel Order
              </button>
            ) : (
              <button 
                className="px-4 py-2 text-white font-semibold text-sm transition-colors shadow-sm hover:opacity-90"
                style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
              >
                Track Order
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="mb-6 border shadow-xl shadow-slate-200/50 p-5"
        style={{ borderRadius: `${borderRadius}px`, backgroundColor: cardBg, color: textColor, borderColor }}
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-black tracking-tight" style={{ color: textColor }}>Order Information</h2>
            <p className="text-xs text-slate-500 mt-1">
              {normalizedOrder.items.length} item{normalizedOrder.items.length === 1 ? '' : 's'} in this order
            </p>
          </div>
          {normalizedOrder.id && (
            <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-widest text-slate-400">
              ID {normalizedOrder.id}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {orderInfoItems.map((item) => {
            const InfoIcon = item.icon;
            return (
              <div
                key={item.label}
                className="flex gap-3 rounded-xl border p-3 min-w-0"
                style={{ backgroundColor: `${primaryColor}08`, borderColor }}
              >
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}12` }}>
                  <InfoIcon className="w-4 h-4" style={{ color: primaryColor }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900 truncate" title={String(item.value)}>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
        {normalizedOrder.orderNote && (
          <div className="mt-4 rounded-xl border p-4" style={{ borderColor, backgroundColor: `${primaryColor}08` }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Order Note</p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{normalizedOrder.orderNote}</p>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderItemList
            items={normalizedOrder.items}
            reviewedItems={reviewedItems}
            buyingItemIds={buyingItemIds}
            onWriteReview={handleWriteReview}
            onViewProduct={handleViewProduct}
            onBuyItem={handleBuyItem}
            orderStatus={orderStatus}
          />
          <OrderStatusTimeline orderStatus={orderStatus} currentIndex={currentIndex} progressWidth={progressWidth} />
        </div>
        <OrderSummaryCard order={normalizedOrder} />
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        product={selectedProduct}
        initialReview={selectedProduct ? reviewedItems[selectedProduct.productSkuId] : null}
        onSubmitReview={async (data) => {
          await submitReviewMutation.mutateAsync(data);
        }}
      />


      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()} style={{ borderRadius: `${borderRadius}px` }}>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cancel Order {getDisplayOrderCode(normalizedOrder)}?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="mb-8">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Reason for cancellation (Optional)</label>
              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)} 
                  className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 focus:outline-none focus:ring-2 transition-all text-sm text-left"
                  style={{ borderRadius: `${borderRadius}px`, '--tw-ring-color': primaryColor }}
                >
                  <span className={cancelReason ? "text-slate-900 dark:text-white" : "text-slate-500"}>
                    {cancelReason ? cancellationReasons.find(r => r.id === cancelReason)?.label : "Select a reason..."}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isReasonDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isReasonDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden py-1 animate-in fade-in slide-in-from-top-2" style={{ borderRadius: `${borderRadius}px` }}>
                    {cancellationReasons.map((reason) => (
                      <button key={reason.id} type="button" onClick={() => { setCancelReason(reason.id); setIsReasonDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between">
                        {reason.label}
                        {cancelReason === reason.id && <CheckCircle className="w-4 h-4" style={{ color: primaryColor }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsCancelModalOpen(false)} 
                disabled={isCancelling} 
                className="w-full py-3.5 text-white font-bold transition-colors shadow-sm hover:opacity-90"
                style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
              >
                Keep Order
              </button>
              <button 
                onClick={handleConfirmCancel} 
                disabled={isCancelling} 
                className="w-full py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                {isCancelling ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
