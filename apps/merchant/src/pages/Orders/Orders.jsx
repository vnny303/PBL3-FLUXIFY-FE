import React, { useState, useEffect, useRef } from 'react';
import { Upload, Search, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from './useOrders';
import { formatCurrency, formatDate, getStatusColor } from '../../shared/lib/formatters/formatters';

// --- Subcomponents ---

const PageHeader = () => (
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-on-surface">Orders</h2>
        <div className="flex items-center gap-3">
            <button type="button" className="bg-white border border-[#e3e3e3] text-[#1a1a1a] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4"/> Export
            </button>
        </div>
    </div>
);

const Tabs = ({ tabs, statusFilter, onTabClick }) => (
    <div className="flex items-center px-6 border-b border-outline-variant/30 overflow-x-auto">
        {tabs.map(tab => (
            <button 
                key={tab} 
                type="button"
                onClick={() => onTabClick(tab)} 
                className={`px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    statusFilter === tab
                    ? 'font-bold text-primary border-b-2 border-primary -mb-px'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
            >
                {tab}
            </button>
        ))}
    </div>
);

const FilterBar = ({ 
    isFilterOpen, setIsFilterOpen, activeFiltersCount, 
    paymentFilter, togglePaymentFilter, clearFilters 
}) => (
    <div className="p-3.5 flex gap-3 border-b border-outline-variant/30">
        <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"/>
            <input type="text" placeholder="Search orders..." className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"/>
        </div>
        <div className="relative">
            <button 
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                className={`px-3 py-1.5 border rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                    activeFiltersCount > 0
                    ? 'bg-gray-100 border-gray-300 text-black'
                    : 'border-outline-variant/40 hover:bg-surface-container-low text-on-surface-variant'
                }`}
            >
                <Filter className="w-4 h-4"/>
                Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            
            {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#e3e3e3] rounded-xl shadow-xl z-20 p-4">
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[#1a1a1a] mb-2">Payment status</h4>
                        <div className="space-y-2">
                            {['Paid', 'Pending', 'Refunded'].map(status => (
                                <label key={status} className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={paymentFilter.includes(status)} 
                                        onChange={() => togglePaymentFilter(status)} 
                                        className="rounded border-[#e3e3e3] text-black focus:ring-black"
                                    />
                                    <span className="text-sm text-[#1a1a1a]">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="pt-3 border-t border-[#e3e3e3] flex justify-between items-center">
                        <button type="button" onClick={clearFilters} className="text-sm text-gray-500 hover:text-black transition-colors">
                            Clear all
                        </button>
                        <button type="button" onClick={() => setIsFilterOpen(false)} className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const OrderTable = ({ 
    orders, isLoading, navigate, 
    actionMenuOpenId, setActionMenuOpenId, actionMenuRef, updateStatus 
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-surface-container-low/50 text-on-surface-variant text-sm border-b border-outline-variant/30">
                        <th className="px-6 py-3 w-12"><input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary"/></th>
                        <th className="px-4 py-3 font-medium">Order</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-4 py-3 text-center font-medium">Payment status</th>
                        <th className="px-4 py-3 text-center font-medium">Order Status</th>
                        <th className="px-4 py-3 text-center font-medium">Method</th>
                        <th className="px-4 py-3 text-right font-medium">Items</th>
                        <th className="px-4 py-3 text-right font-medium">Total</th>
                        <th className="px-4 py-3 text-center font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                            <tr key={idx} className="hover:bg-surface-container-low/80 transition-colors">
                                <td className="px-6 py-2.5"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-4 py-2.5"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-4 py-2.5"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-4 py-2.5"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-4 py-2.5 text-center"><div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse mx-auto"></div></td>
                                <td className="px-4 py-2.5 text-center"><div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse mx-auto"></div></td>
                                <td className="px-4 py-2.5 text-center"><div className="h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div></td>
                                <td className="px-4 py-2.5 text-right"><div className="h-4 w-12 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                                <td className="px-4 py-2.5 text-right"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                                <td className="px-4 py-2.5 text-center"><div className="h-6 w-6 bg-gray-200 rounded animate-pulse mx-auto"></div></td>
                            </tr>
                        ))
                    ) : orders.length > 0 ? (
                        orders.map((order) => {
                            const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                            return (
                                <tr key={order.id} onClick={() => navigate(`/orders/${order.id}`)} className={`hover:bg-surface-container-low/80 transition-colors cursor-pointer`}>
                                    <td className="px-6 py-2.5" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary"/>
                                    </td>
                                    <td className="px-4 py-2.5 font-bold text-sm hover:text-primary transition-colors">#{order.id.slice(-6)}</td>
                                    <td className="px-4 py-2.5 text-sm text-on-surface-variant">{formatDate(order.createdAt)}</td>
                                    <td className="px-4 py-2.5 text-sm font-medium">Customer: {order.customerId.slice(-6)}</td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-sm text-on-surface-variant">{order.paymentMethod}</td>
                                    <td className="px-4 py-2.5 text-right text-sm text-on-surface-variant">{totalItems} {totalItems === 1 ? 'item' : 'items'}</td>
                                    <td className="px-4 py-2.5 text-right text-sm font-bold">{formatCurrency(order.totalAmount)}</td>
                                    <td className="px-4 py-2.5 text-center relative" onClick={(e) => e.stopPropagation()}>
                                        <button type="button" onClick={() => setActionMenuOpenId(actionMenuOpenId === order.id ? null : order.id)} className="p-1.5 hover:bg-surface-container-high rounded-md transition-colors text-on-surface-variant">
                                            <MoreVertical className="w-4 h-4"/>
                                        </button>
                                        {actionMenuOpenId === order.id && (
                                            <div ref={actionMenuRef} className="absolute right-8 top-full mt-1 w-40 bg-white border border-[#e3e3e3] rounded-lg shadow-lg z-30 py-1 text-left">
                                                <div className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Update Status</div>
                                                {['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'].map((status) => (
                                                    <button 
                                                        type="button"
                                                        key={status} 
                                                        disabled={order.status === 'Delivered'} 
                                                        onClick={() => updateStatus(order.id, status)} 
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${order.status === status ? 'font-bold text-primary' : 'text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={10} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                                No orders match the selected filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const Pagination = ({ currentPage, setCurrentPage, totalPages, totalOrders, pageSize }) => (
    <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-lowest">
        <div className="flex items-center gap-4">
            <p className="text-sm text-on-surface-variant">
                Showing <span className="font-semibold text-on-surface">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalOrders)}</span> of <span className="font-semibold text-on-surface">{totalOrders}</span> orders
            </p>
        </div>
        <div className="flex items-center gap-1.5">
            <button 
                type="button"
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                className="p-2 border border-outline-variant/40 rounded-md hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ChevronLeft className="w-5 h-5"/>
            </button>
            
            {Array.from({ length: Math.max(1, totalPages) }).map((_, idx) => {
                const page = idx + 1;
                return (
                    <button 
                        type="button"
                        key={page} 
                        onClick={() => setCurrentPage(page)} 
                        className={`min-w-[36px] h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                            currentPage === page
                            ? 'bg-primary text-on-primary font-bold'
                            : 'hover:bg-surface-container-low'
                        }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button 
                type="button"
                disabled={currentPage === totalPages || totalPages === 0} 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                className="flex items-center gap-1.5 px-3 h-9 border border-outline-variant/40 rounded-md hover:bg-surface-container-low transition-colors text-sm font-medium disabled:opacity-30 disabled:hover:bg-transparent"
            >
                Next <ChevronRight className="w-5 h-5"/>
            </button>
        </div>
    </div>
);

// --- Main Page Component ---

export default function Orders() {
    const navigate = useNavigate();
    const { state, actions } = useOrders();
    const { orders, totalOrders, isLoading, error, statusFilter, currentPage, pageSize } = state;
    const { setStatusFilter, setCurrentPage, handleStatusChange } = actions;

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [paymentFilter, setPaymentFilter] = useState([]);
    const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
    const actionMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setActionMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const togglePaymentFilter = (status) => {
        setPaymentFilter(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
    };

    const clearFilters = () => {
        setPaymentFilter([]);
    };

    const updateStatus = async (orderId, newStatus) => {
        const success = await handleStatusChange(orderId, newStatus);
        if (success) {
            setActionMenuOpenId(null);
        }
    };

    const filteredOrders = orders.filter(order => {
        const paymentMatch = paymentFilter.length === 0 || paymentFilter.includes(order.paymentStatus);
        return paymentMatch;
    });

    const activeFiltersCount = paymentFilter.length;
    const totalPages = Math.ceil(totalOrders / pageSize);
    const tabs = ['All', 'Pending', 'Confirmed', 'Shipping', 'Delivered'];

    return (
        <div className="p-8 max-w-[1400px] mx-auto pb-16">
            <PageHeader />

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <Tabs 
                    tabs={tabs} 
                    statusFilter={statusFilter} 
                    onTabClick={(tab) => { setStatusFilter(tab); setCurrentPage(1); }} 
                />

                <FilterBar 
                    isFilterOpen={isFilterOpen} 
                    setIsFilterOpen={setIsFilterOpen} 
                    activeFiltersCount={activeFiltersCount} 
                    paymentFilter={paymentFilter} 
                    togglePaymentFilter={togglePaymentFilter} 
                    clearFilters={clearFilters} 
                />

                <OrderTable 
                    orders={filteredOrders} 
                    isLoading={isLoading} 
                    navigate={navigate} 
                    actionMenuOpenId={actionMenuOpenId} 
                    setActionMenuOpenId={setActionMenuOpenId} 
                    actionMenuRef={actionMenuRef} 
                    updateStatus={updateStatus} 
                />

                <Pagination 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                    totalPages={totalPages} 
                    totalOrders={totalOrders} 
                    pageSize={pageSize} 
                />
            </div>
        </div>
    );
}
