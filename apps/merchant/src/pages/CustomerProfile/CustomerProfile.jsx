import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Mail, Phone, MapPin } from 'lucide-react';
import { getCustomerById } from '../../entities/customer/api/customerApi';
import { getOrders } from '../../entities/order/api/orderApi';
import { QUERY_KEYS } from '../../shared/api/queryKeys';
import { formatCurrency, formatDate, getStatusColor } from '../../shared/lib/formatters/formatters';

const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '';
};

const PageHeader = ({ customer, isLoading }) => (
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Link to="/customers" className="p-2 hover:bg-surface-container-low rounded-md transition-colors">
                <ArrowLeft className="w-5 h-5 text-on-surface-variant"/>
            </Link>
            {isLoading ? (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
            ) : customer ? (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                        {getInitials(customer.name)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface">{customer.name}</h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            Active
                        </span>
                    </div>
                </div>
            ) : null}
        </div>
        <button type="button" className="px-4 py-2 text-sm font-semibold text-on-surface bg-white border border-outline-variant/40 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Edit className="w-4 h-4"/>
            Edit
        </button>
    </div>
);

const OrderHistoryTable = ({ orders, isLoading }) => (
    <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-on-surface">Order History</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-on-surface-variant text-sm border-b border-gray-200">
                            <th className="px-6 py-3 font-medium">Order</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Payment Status</th>
                            <th className="px-6 py-3 font-medium">Order Status</th>
                            <th className="px-6 py-3 text-right font-medium">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div></td>
                                    <td className="px-6 py-4 text-right"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                                </tr>
                            ))
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-sm">#{order.id.slice(-6)}</td>
                                    <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(order.createdAt)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">{formatCurrency(order.totalAmount)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                                    No orders found for this customer.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const CustomerOverviewCard = ({ customer, isLoading }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-4">Overview</h2>
        {isLoading ? (
            <div className="space-y-4">
                <div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        ) : customer ? (
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-on-surface-variant font-medium">Total Orders</p>
                    <p className="text-xl font-semibold">{customer.ordersCount || 0}</p>
                </div>
                <div>
                    <p className="text-sm text-on-surface-variant font-medium">Total Spent</p>
                    <p className="text-xl font-semibold">{formatCurrency(customer.totalSpent || 0)}</p>
                </div>
                <div>
                    <p className="text-sm text-on-surface-variant font-medium">Average Order Value</p>
                    <p className="text-xl font-semibold">
                        {(customer.ordersCount || 0) > 0 ? formatCurrency((customer.totalSpent || 0) / customer.ordersCount) : formatCurrency(0)}
                    </p>
                </div>
            </div>
        ) : null}
    </div>
);

const CustomerContactCard = ({ customer, isLoading }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-4">Contact & Address</h2>
        {isLoading ? (
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mt-0.5"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mt-0.5"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mt-0.5"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
            </div>
        ) : customer ? (
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-on-surface-variant mt-0.5"/>
                    <span className="text-sm text-on-surface">{customer.email}</span>
                </div>
                <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-on-surface-variant mt-0.5"/>
                    <span className="text-sm text-on-surface">{customer.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-on-surface-variant mt-0.5"/>
                    <span className="text-sm text-on-surface leading-relaxed">{customer.address}<br />{customer.location}</span>
                </div>
            </div>
        ) : null}
    </div>
);

export default function CustomerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: customer, isLoading: isLoadingCustomer, error: customerError } = useQuery({
        queryKey: [...QUERY_KEYS.customers.all, 'details', id],
        queryFn: () => getCustomerById({ customerId: id }),
        enabled: !!id
    });

    const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
        queryKey: [...QUERY_KEYS.orders.all, { customerId: id }],
        queryFn: () => getOrders({ customerId: id, limit: 100 }),
        enabled: !!id
    });

    const orders = ordersData?.data || [];
    const isLoading = isLoadingCustomer || isLoadingOrders;
    const error = customerError ? customerError.message : null;

    if (error) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
                <button type="button" onClick={() => navigate('/customers')} className="mt-4 text-primary hover:underline">Back to Customers</button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto pb-16">
            <PageHeader customer={customer} isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <OrderHistoryTable orders={orders} isLoading={isLoading} />

                <div className="lg:col-span-1 space-y-6">
                    <CustomerOverviewCard customer={customer} isLoading={isLoading} />
                    <CustomerContactCard customer={customer} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
