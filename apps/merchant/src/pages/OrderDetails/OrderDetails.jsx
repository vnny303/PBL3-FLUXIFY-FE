import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ChevronDown, User, MapPin, CreditCard } from 'lucide-react';
import { getOrderById, updateOrderStatus } from '../../entities/order/api/orderApi';
import { QUERY_KEYS } from '../../shared/api/queryKeys';
import { formatCurrency, getStatusColor } from '../../shared/lib/formatters/formatters';

// --- Helper Functions ---
const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(date);
};

// --- Subcomponents ---

const PageHeader = ({ order, isLoading, isStatusMenuOpen, setIsStatusMenuOpen, statusMenuRef, handleStatusChange }) => {
    return (
        <div className="mb-6">
            <Link to="/orders" className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1"/>
                Back to Orders
            </Link>
            
            {isLoading ? (
                <div className="flex justify-between items-start">
                    <div className="space-y-3">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
            ) : order ? (
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                                #{order.id.slice(-6)}
                            </h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-on-surface-variant">
                            {formatDateTime(order.createdAt)}
                        </p>
                    </div>
                    
                    <div className="relative" ref={statusMenuRef}>
                        <button 
                            type="button"
                            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)} 
                            className="bg-white border border-gray-200 text-on-surface px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            Update Status <ChevronDown className="w-4 h-4"/>
                        </button>
                        
                        {isStatusMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                                {['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'].map((status) => (
                                    <button 
                                        type="button"
                                        key={status} 
                                        disabled={order.status === status || order.status === 'Delivered'} 
                                        onClick={() => handleStatusChange(status)} 
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${order.status === status ? 'font-bold text-primary bg-primary/5' : 'text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Mark as {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

const OrderItemsList = ({ order, isLoading }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-on-surface-variant text-sm border-b border-gray-200">
                        <th className="px-6 py-3 font-medium">Product</th>
                        <th className="px-6 py-3 font-medium text-right">Price</th>
                        <th className="px-6 py-3 font-medium text-right">Quantity</th>
                        <th className="px-6 py-3 font-medium text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                        Array.from({ length: 2 }).map((_, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4"><div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                                <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                                <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                            </tr>
                        ))
                    ) : order?.orderItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center shrink-0">
                                        <span className="text-xs text-gray-400">Img</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-on-surface">{item.productName}</p>
                                        <p className="text-xs text-on-surface-variant mt-0.5">SKU: {item.productSkuId.slice(-8)}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right text-sm text-on-surface-variant">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-6 py-4 text-right text-sm text-on-surface-variant">{item.quantity}</td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-on-surface">{formatCurrency(item.unitPrice * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const PaymentSummary = ({ order, isLoading }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {isLoading ? (
            <div className="space-y-3 max-w-xs ml-auto">
                <div className="flex justify-between"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></div>
                <div className="flex justify-between"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></div>
                <div className="pt-3 border-t border-gray-200 flex justify-between"><div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div><div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div></div>
            </div>
        ) : order ? (
            <div className="space-y-3 text-sm max-w-sm ml-auto">
                <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-semibold text-on-surface">Total Amount</span>
                    <span className="text-lg font-bold text-on-surface">{formatCurrency(order.totalAmount)}</span>
                </div>
            </div>
        ) : null}
    </div>
);

const CustomerCard = ({ order, isLoading }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-on-surface-variant"/> Customer
        </h2>
        {isLoading ? (
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        ) : order ? (
            <Link to={`/customers/${order.customerId}`} className="text-sm text-primary hover:underline font-medium">
                {order.customerName}
            </Link>
        ) : null}
    </div>
);

const ShippingAddressCard = ({ order, isLoading }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-on-surface-variant"/> Shipping Address
        </h2>
        {isLoading ? (
            <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
        ) : order ? (
            <p className="text-sm text-on-surface-variant leading-relaxed">{order.address}</p>
        ) : null}
    </div>
);

const PaymentDetailsCard = ({ order, isLoading }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-on-surface-variant"/> Payment Details
        </h2>
        {isLoading ? (
            <div className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
        ) : order ? (
            <div className="space-y-3">
                <div>
                    <p className="text-xs text-on-surface-variant mb-1">Method</p>
                    <p className="text-sm font-medium text-on-surface">{order.paymentMethod}</p>
                </div>
                <div>
                    <p className="text-xs text-on-surface-variant mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                    </span>
                </div>
            </div>
        ) : null}
    </div>
);

// --- Main Page Component ---

export default function OrderDetails() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const statusMenuRef = useRef(null);

    const { data: order, isLoading, error } = useQuery({
        queryKey: [...QUERY_KEYS.orders.details(id)],
        queryFn: () => getOrderById({ id }),
        enabled: !!id,
        select: (data) => ({
            ...data,
            orderItems: (data.orderItems || []).map(item => ({
                ...item,
                productName: item.productName || 'Product Name (Waiting BE)'
            }))
        })
    });

    const mutation = useMutation({
        mutationFn: (newStatus) => updateOrderStatus({ id, status: newStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.details(id) });
            setIsStatusMenuOpen(false);
        },
        onError: (err) => {
            console.error('Failed to update status', err);
        }
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
                setIsStatusMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = (newStatus) => {
        if (!order) return;
        mutation.mutate(newStatus);
    };

    if (error) {
        return (
            <div className="p-8 max-w-[1400px] mx-auto">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
                <Link to="/orders" className="mt-4 inline-block text-primary hover:underline">Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto pb-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
            <PageHeader 
                order={order} 
                isLoading={isLoading} 
                isStatusMenuOpen={isStatusMenuOpen} 
                setIsStatusMenuOpen={setIsStatusMenuOpen} 
                statusMenuRef={statusMenuRef} 
                handleStatusChange={handleStatusChange} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <OrderItemsList order={order} isLoading={isLoading} />
                    <PaymentSummary order={order} isLoading={isLoading} />
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <CustomerCard order={order} isLoading={isLoading} />
                    <ShippingAddressCard order={order} isLoading={isLoading} />
                    <PaymentDetailsCard order={order} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
