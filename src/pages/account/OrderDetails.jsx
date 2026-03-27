import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, CreditCard, Building, Clock, X, AlertCircle, ChevronDown, Loader2, Star, Edit } from 'lucide-react';
import { toast } from 'sonner';
import ReviewModal from '../../components/ReviewModal';
import InvoicePrint from '../../components/InvoicePrint';
import { useAppContext } from '../../contexts/AppContext';

export default function OrderDetails({ setCurrentScreen, order }) {
  const { addToCart, setShowCart } = useAppContext();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fallback if order is not passed correctly
  const orderData = order || {
    id: '#FLX-8829',
    date: 'Oct 12, 2023',
    total: '$242.50',
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Premium Headphones', variant: 'Space Gray • Wireless', image: 'https://picsum.photos/seed/product1/200/300', price: '$199.00' },
      { name: 'Cotton T-Shirt', variant: 'Arctic White • Large', image: 'https://picsum.photos/seed/product2/200/300', price: '$25.00' }
    ]
  };

  const [orderStatus, setOrderStatus] = useState(orderData.status || 'Pending');
  const [reviewedItems, setReviewedItems] = useState({});
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [buyingItemIds, setBuyingItemIds] = useState({});
  const [isBuyingWholeOrder, setIsBuyingWholeOrder] = useState(false);

  useEffect(() => {
    if (order?.status) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderStatus(order.status);
    }
  }, [order?.status]);
  const [cancelReason, setCancelReason] = useState('');
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);

  const cancellationReasons = [
    { id: 'changed_mind', label: 'Changed my mind' },
    { id: 'found_cheaper', label: 'Found a cheaper alternative' },
    { id: 'ordered_mistake', label: 'Ordered by mistake' },
    { id: 'delivery_too_long', label: 'Delivery time is too long' },
    { id: 'other', label: 'Other' }
  ];

  const handleWriteReview = (product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      setIsCancelModalOpen(false);
      setOrderStatus('Cancelled');
      toast.success('Đơn hàng đã được huỷ thành công!');
    }, 1500);
  };

  const getVariantDetails = (variant) => {
    const parts = variant ? variant.split('•') : [];
    return {
      size: parts[0] ? parts[0].trim() : 'Standard',
      color: parts[1] ? parts[1].trim() : 'Default'
    };
  };

  const handleBuyItem = (item, idx) => {
    setBuyingItemIds(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      const { size, color } = getVariantDetails(item.variant);
      addToCart({ 
        ...item, 
        id: item.id || item.name || `product-${idx}`,
        name: item.name || 'Product',
        price: item.price || '$35.00',
        image: item.image || `https://picsum.photos/seed/product${idx}/200/300`
      }, 1, color, size, false);
      setShowCart(true);
      setBuyingItemIds(prev => ({ ...prev, [idx]: false }));
    }, 500);
  };

  const handleBuyWholeOrder = () => {
    setIsBuyingWholeOrder(true);
    setTimeout(() => {
      orderData.items.forEach((item, idx) => {
        const { size, color } = getVariantDetails(item.variant);
        addToCart({ 
          ...item, 
          id: item.id || item.name || `product-${idx}`,
          name: item.name || 'Product',
          price: item.price || '$35.00',
          image: item.image || `https://picsum.photos/seed/product${idx}/200/300`
        }, 1, color, size, false);
      });
      setShowCart(true);
      setIsBuyingWholeOrder(false);
      toast.success('Đã thêm lại toàn bộ đơn hàng vào giỏ!');
    }, 500);
  };

  const statusList = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = statusList.indexOf(orderStatus) !== -1 ? statusList.indexOf(orderStatus) : 0;
  const progressWidth = `${(currentIndex / (statusList.length - 1)) * 100}%`;

  return (
    <section className="flex-1 relative">
      <div className="mb-6">
        <button 
          onClick={() => setCurrentScreen('my-orders')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Order {orderData.id}</h1>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                orderStatus === 'Cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                orderStatus === 'Pending' || orderStatus === 'Processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {orderStatus}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Placed on {orderData.date} • {orderData.items.length} Items</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              Print Invoice
            </button>
            {orderStatus === 'Cancelled' ? (
              <button 
                onClick={handleBuyWholeOrder}
                disabled={isBuyingWholeOrder}
                className="px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isBuyingWholeOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Buy Again'
                )}
              </button>
            ) : orderStatus === 'Pending' || orderStatus === 'Processing' ? (
              <button 
                onClick={() => setIsCancelModalOpen(true)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
              >
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Order Items</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orderData.items.map((item, idx) => {
                const productName = item.name || 'Product';
                const productVariant = item.variant || 'Standard';
                const productImage = item.image || `https://picsum.photos/seed/product${idx}/200/300`;
                const productPrice = item.price || '$35.00';
                
                return (
                  <div key={idx} className="p-6 flex gap-4">
                    <div className="w-20 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                      <img src={productImage} alt="Product" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{productName}</h3>
                          <p className="text-xs text-slate-500 mt-1">{productVariant}</p>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{productPrice}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">Qty: 1</span>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleWriteReview({ name: productName, variant: productVariant, image: productImage })}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 hover:underline transition-colors flex items-center gap-1"
                          >
                            {reviewedItems[productName] ? (
                              <>
                                <Edit className="w-3 h-3 text-blue-600 dark:text-blue-500" />
                                Edit Review
                              </>
                            ) : (
                              <>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                Write a Review
                              </>
                            )}
                          </button>
                          <button 
                            onClick={() => handleBuyItem(item, idx)}
                            disabled={buyingItemIds[idx]}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 hover:underline transition-colors flex items-center justify-center gap-1"
                          >
                            {buyingItemIds[idx] ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              'Buy again'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Tracking Status</h2>
            
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
              
              {orderStatus === 'Cancelled' ? (
                <>
                  {/* Progress Bar Fill - Red for cancelled */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[15%] h-1 bg-red-500 rounded-full"></div>
                  
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center z-10 shadow-sm shadow-red-500/30">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Order Placed</span>
                      <span className="text-[10px] text-slate-500">Oct 12</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center z-10 shadow-sm shadow-red-500/30">
                        <X className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-red-500">Cancelled</span>
                      <span className="text-[10px] text-red-400">Oct 12</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center z-10">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-500">Shipped</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center z-10">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-500">Delivered</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Progress Bar Fill */}
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500" 
                    style={{ width: progressWidth }}
                  ></div>
                  
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${currentIndex >= 0 ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${currentIndex >= 0 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Order Placed</span>
                      <span className="text-[10px] text-slate-500">Oct 12</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${currentIndex >= 1 ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${currentIndex >= 1 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Processing</span>
                      <span className="text-[10px] text-slate-500">Oct 13</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${currentIndex >= 2 ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${currentIndex >= 2 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Shipped</span>
                      <span className="text-[10px] text-slate-500">Expected Oct 14</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${currentIndex >= 3 ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-medium ${currentIndex >= 3 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Delivered</span>
                      <span className="text-[10px] text-slate-400">Est. Oct 16</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {orderStatus === 'Cancelled' ? (
              <div className="mt-8 bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-100 dark:border-red-900/30">
                <p className="text-sm font-medium text-red-800 dark:text-red-400 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Order was cancelled
                </p>
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1 ml-6">Your order has been cancelled and a refund has been initiated if applicable.</p>
              </div>
            ) : (
              <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  {currentIndex >= 3 ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Truck className="w-4 h-4 text-primary" />}
                  {currentIndex === 0 && 'Order has been placed'}
                  {currentIndex === 1 && 'Your package is being processed'}
                  {currentIndex === 2 && 'Your package is on the way'}
                  {currentIndex === 3 && 'Your package has been delivered'}
                </p>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  {currentIndex === 0 && 'We have received your order and are preparing it.'}
                  {currentIndex === 1 && 'Last updated: Oct 13, 08:45 AM - Order is being prepared for shipping.'}
                  {currentIndex === 2 && 'Last updated: Oct 14, 10:30 AM - Package arrived at transit facility.'}
                  {currentIndex === 3 && 'Delivered on Oct 16, 02:15 PM.'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Shipping Details */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                Shipping Address
              </h3>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p className="font-bold text-slate-900 dark:text-white mb-1">Alex Thompson</p>
                <p>123 Maple St.</p>
                <p>Springfield, IL 62704</p>
                <p>United States</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tracking Info</h4>
                <p className="text-xs text-slate-500 italic">Tracking details will appear once shipped.</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-slate-400" />
              Payment Method
            </h3>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-slate-500">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{orderData.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">$224.00</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Tax</span>
                <span className="font-medium text-slate-900 dark:text-white">$18.50</span>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white text-base">Total</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{orderData.total}</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Need help with this order?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              Contact Support &rarr;
            </button>
          </div>
        </div>
      </div>

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        product={selectedProduct}
        initialReview={selectedProduct ? reviewedItems[selectedProduct.name] : null}
        onSubmitReview={(data) => {
          setReviewedItems(prev => ({ ...prev, [selectedProduct.name]: data }));
          toast.success("Review Submitted! Thank you for sharing your experience.");
        }}
      />
      
      <InvoicePrint order={orderData} />

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cancel Order {orderData.id}?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            
            <div className="mb-8">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Reason for cancellation (Optional)
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-sm text-left"
                >
                  <span className={cancelReason ? "text-slate-900 dark:text-white" : "text-slate-500"}>
                    {cancelReason ? cancellationReasons.find(r => r.id === cancelReason)?.label : "Select a reason..."}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isReasonDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isReasonDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                    {cancellationReasons.map((reason) => (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() => {
                          setCancelReason(reason.id);
                          setIsReasonDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                      >
                        {reason.label}
                        {cancelReason === reason.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
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
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                Keep Order
              </button>
              <button 
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="w-full py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Yes, Cancel Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
