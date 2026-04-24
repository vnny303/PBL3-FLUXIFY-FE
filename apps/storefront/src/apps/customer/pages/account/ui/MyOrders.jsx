import { useState } from 'react';
import { CheckCircle, Clock, ArrowRight, ShoppingCart, CreditCard } from 'lucide-react';
import { formatVnd, parsePrice, getDisplayOrderCode } from '../../../../../shared/lib/formatters';

export default function MyOrders({ setCurrentScreen, setSelectedOrderId, orders = [], isLoading = false, error = null, onRetry }) {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <section className="flex-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Loading your orders...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h2>
          <p className="text-red-500 mt-1">{error}</p>
        </div>
        <button onClick={onRetry} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">
          Retry
        </button>
      </section>
    );
  }

  const displayedOrders = showAll ? orders : orders.slice(0, 2);

  if (orders.length === 0) {
    return (
      <section className="flex-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and track your recent purchases.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No orders yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">You haven't placed any orders yet. Start exploring our collections to find something you love.</p>
          <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-sm">
            Start Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">View and track your recent purchases.</p>
      </div>
      
      {displayedOrders.map((order) => (
        <div key={order.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{getDisplayOrderCode(order)}</span>
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'Delivered' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Delivered
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {order.status || 'Processing'}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {order.paymentMethod === 'BankTransfer' ? 'Bank Transfer' : 'COD'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-900/30 flex items-center gap-1">
                      {order.paymentStatus || 'Pending Payment'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  Ordered on {order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '')} • Total: {formatVnd(parsePrice(order.total || order.totalAmount))}
                </p>
              </div>
              <button 
                onClick={() => {
                  setSelectedOrderId(order.id);
                  setCurrentScreen('order-details');
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-lg transition-colors"
              >
                View Details / Track
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4">
              {(order.orderItems || order.items || []).map((item, idx) => (
                <div key={item.id || idx} className="h-20 w-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
                  <img src={item.image} alt={item.productName || item.name} className="w-full h-full object-cover rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {orders.length > 2 && (
        <div className="pt-4 text-center">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {showAll ? 'Show Less' : 'View All Past Orders'}
          </button>
        </div>
      )}
    </section>
  );
}
