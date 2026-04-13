import React from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from './useCustomers';
import { formatCurrency } from '../../shared/lib/formatters/formatters';

// --- Subcomponents ---

const PageHeader = () => (
    <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">Customers</h2>
        </div>
        <div className="flex space-x-3">
            <button type="button" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-sm font-semibold text-on-surface shadow-sm hover:bg-surface-container-low transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2"/>
                Export
            </button>
            <button type="button" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2"/>
                Add customer
            </button>
        </div>
    </div>
);

const FilterBar = () => (
    <div className="p-4 border-b border-outline-variant/20 flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"/>
            <input type="text" placeholder="Search customers..." className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"/>
        </div>
        <button type="button" className="px-3 py-2 border border-outline-variant/40 rounded-lg text-sm font-medium text-on-surface flex items-center hover:bg-surface-container-low transition-colors">
            <Filter className="w-4 h-4 mr-2"/>
            Filter
        </button>
    </div>
);

const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const CustomerTable = ({ customers, isLoading, handleRowClick }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/30">
                        <th className="px-6 py-4 w-10">
                            <input type="checkbox" className="rounded border-outline-variant/50 text-primary focus:ring-primary"/>
                        </th>
                        <th className="px-6 py-4">Customer name</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Orders</th>
                        <th className="px-6 py-4 text-right">Amount spent</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                            <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                                <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                                        <div>
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                                            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-6 py-4 text-right"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                            </tr>
                        ))
                    ) : customers.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-on-surface-variant">No customers found.</td>
                        </tr>
                    ) : (
                        customers.map((customer) => (
                            <tr key={customer.id} onClick={() => handleRowClick(customer.id)} className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-outline-variant/50 text-primary focus:ring-primary"/>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant mr-3">
                                            {getInitials(customer.name)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{customer.name}</p>
                                            <p className="text-xs text-on-surface-variant">{customer.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-on-surface-variant">{customer.location}</td>
                                <td className="px-6 py-4 text-sm text-on-surface-variant">{customer.ordersCount}</td>
                                <td className="px-6 py-4 text-sm font-medium text-on-surface text-right">{formatCurrency(customer.totalSpent)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const Pagination = ({ customersCount }) => (
    <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-low/30">
        <p className="text-xs text-on-surface-variant">Showing {Math.min(5, customersCount)} of {customersCount} customers</p>
        <div className="flex space-x-2">
            <button type="button" disabled className="px-3 py-1 border border-outline-variant/40 rounded-md bg-surface-container-lowest opacity-50 cursor-not-allowed text-sm font-medium">
                Previous
            </button>
            <button type="button" className="px-3 py-1 border border-outline-variant/40 rounded-md bg-surface-container-lowest hover:bg-surface-container-low text-sm font-medium">
                Next
            </button>
        </div>
    </div>
);

// --- Main Page Component ---

export default function Customers() {
    const navigate = useNavigate();
    const { state } = useCustomers();
    const { customers, isLoading, error } = state;
    
    const handleRowClick = (customerId) => {
        navigate(`/customers/${customerId}`);
    };
    
    return (
        <div className="p-8 max-w-[1400px] mx-auto pb-16">
            <PageHeader />

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <FilterBar />
                <CustomerTable customers={customers} isLoading={isLoading} handleRowClick={handleRowClick} />
                <Pagination customersCount={customers.length} />
            </div>
        </div>
    );
}
