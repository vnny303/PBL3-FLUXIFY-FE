import { useState } from 'react';
import { Loader2, AlertCircle, ChevronDown, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import ReviewModal from '../../../../../features/product-review/ui/ReviewModal';
import InvoicePrint from '../../../../../entities/order/ui/InvoicePrint';
import { useAppContext } from '../../../../../app/providers/AppContext';
import OrderItemList from '../../../../../entities/order/ui/OrderItemList';
import OrderStatusTimeline from '../../../../../entities/order/ui/OrderStatusTimeline';
import OrderSummaryCard from '../../../../../entities/order/ui/OrderSummaryCard';

export default function OrderDetails({ setCurrentScreen, order }) {
  const { addToCart, setShowCart } = useAppContext();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState(order?.status || 'Pending');
  const [reviewedItems, setReviewedItems] = useState({});
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [buyingItemIds, setBuyingItemIds] = useState({});
  const [isBuyingWholeOrder, setIsBuyingWholeOrder] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-10 min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Order Selected</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center">Please select an order from the list to view its details.</p>
        <button onClick={() => setCurrentScreen('my-orders')} className="mt-6 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">
          View My Orders
        </button>
      </div>
    );
  }

  const orderData = order;

  // Normalize order items: support both BE format (orderItems) and legacy format (items)
  const normalizedItems = (orderData.orderItems || orderData.items || []).map(item => ({
    id: item.id || item.name,
    name: item.productName || item.name,
    variant: item.variant || (item.skuAttributes ? `${item.skuAttributes.color || ''} • ${item.skuAttributes.size || ''}` : ''),
    image: item.image || `https://picsum.photos/seed/${item.productName || 'product'}/200/300`,
    price: item.unitPrice != null ? `$${Number(item.unitPrice).toFixed(2)}` : (item.price || '$0.00'),
    quantity: item.quantity || 1,
    productSkuId: item.productSkuId,
    skuAttributes: item.skuAttributes,
  }));

  const normalizedOrder = {
    ...orderData,
    items: normalizedItems,
    date: orderData.date || (orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''),
    total: orderData.total || (orderData.totalAmount != null ? `$${Number(orderData.totalAmount).toFixed(2)}` : '$0.00'),
  };

  const cancellationReasons = [
    { id: 'changed_mind', label: 'Changed my mind' },
    { id: 'found_cheaper', label: 'Found a cheaper alternative' },
    { id: 'ordered_mistake', label: 'Ordered by mistake' },
    { id: 'delivery_too_long', label: 'Delivery time is too long' },
    { id: 'other', label: 'Other' }
  ];

  const getVariantDetails = (variant) => {
    const parts = variant ? variant.split('•') : [];
    return { size: parts[0]?.trim() || 'Standard', color: parts[1]?.trim() || 'Default' };
  };

  const toNumericPrice = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value.replace('$', '')) || 0;
    return 0;
  };

  const handleWriteReview = (product) => { setSelectedProduct(product); setIsReviewModalOpen(true); };

  const handleConfirmCancel = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      setIsCancelModalOpen(false);
      setOrderStatus('Cancelled');
      toast.success('Đơn hàng đã được huỷ thành công!');
    }, 1500);
  };

  const handleBuyItem = (item, idx) => {
    setBuyingItemIds(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      const { size, color } = getVariantDetails(item.variant);
      const skuAttributes = item.skuAttributes || { size, color };
      const unitPrice = toNumericPrice(item.price);

      addToCart(
        {
          id: item.productSkuId || item.id || `product-${idx}`,
          productSkuId: item.productSkuId || item.id || `product-${idx}`,
          productName: item.name || 'Product',
          name: item.name || 'Product',
          price: unitPrice,
          image: item.image || `https://picsum.photos/seed/product${idx}/200/300`,
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
        const unitPrice = toNumericPrice(item.price);

        addToCart(
          {
            id: item.productSkuId || item.id || `product-${idx}`,
            productSkuId: item.productSkuId || item.id || `product-${idx}`,
            productName: item.name || 'Product',
            name: item.name || 'Product',
            price: unitPrice,
            image: item.image || `https://picsum.photos/seed/product${idx}/200/300`,
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
      toast.success('Đã thêm lại toàn bộ đơn hàng vào giỏ!');
    }, 500);
  };

  const statusList = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = Math.max(0, statusList.indexOf(orderStatus));
  const progressWidth = `${(currentIndex / (statusList.length - 1)) * 100}%`;

  return (
    <section className="flex-1 relative">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => setCurrentScreen('my-orders')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Orders
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Order {normalizedOrder.id}</h1>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                orderStatus === 'Cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                orderStatus === 'Pending' || orderStatus === 'Processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {orderStatus}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Placed on {normalizedOrder.date} • {normalizedOrder.items.length} Items</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
              Print Invoice
            </button>
            {orderStatus === 'Cancelled' ? (
              <button onClick={handleBuyWholeOrder} disabled={isBuyingWholeOrder} className="px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                {isBuyingWholeOrder ? <><Loader2 className="w-4 h-4 animate-spin" />Loading...</> : 'Buy Again'}
              </button>
            ) : orderStatus === 'Pending' || orderStatus === 'Processing' ? (
              <button onClick={() => setIsCancelModalOpen(true)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm">
                Cancel Order
              </button>
            ) : (
              <button className="px-4 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
                Track Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderItemList
            items={normalizedOrder.items}
            reviewedItems={reviewedItems}
            buyingItemIds={buyingItemIds}
            onWriteReview={handleWriteReview}
            onBuyItem={handleBuyItem}
          />
          <OrderStatusTimeline orderStatus={orderStatus} currentIndex={currentIndex} progressWidth={progressWidth} />
        </div>
        <OrderSummaryCard order={normalizedOrder} />
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        product={selectedProduct}
        initialReview={selectedProduct ? reviewedItems[selectedProduct.name] : null}
        onSubmitReview={(data) => {
          setReviewedItems(prev => ({ ...prev, [selectedProduct.name]: data }));
          toast.success('Review Submitted! Thank you for sharing your experience.');
        }}
      />
      <InvoicePrint order={normalizedOrder} />

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cancel Order {normalizedOrder.id}?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="mb-8">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Reason for cancellation (Optional)</label>
              <div className="relative">
                <button type="button" onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)} className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-sm text-left">
                  <span className={cancelReason ? "text-slate-900 dark:text-white" : "text-slate-500"}>
                    {cancelReason ? cancellationReasons.find(r => r.id === cancelReason)?.label : "Select a reason..."}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isReasonDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isReasonDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                    {cancellationReasons.map((reason) => (
                      <button key={reason.id} type="button" onClick={() => { setCancelReason(reason.id); setIsReasonDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between">
                        {reason.label}
                        {cancelReason === reason.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => setIsCancelModalOpen(false)} disabled={isCancelling} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm">Keep Order</button>
              <button onClick={handleConfirmCancel} disabled={isCancelling} className="w-full py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2">
                {isCancelling ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

