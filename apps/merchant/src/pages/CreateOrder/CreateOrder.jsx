import React, { useState } from 'react';
import { ArrowLeft, Search, X, Plus, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateOrder } from './useCreateOrder';

// --- Subcomponents ---

const PageHeader = ({ isSaving, onDiscard, onSave }) => (
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Link to="/orders" className="p-2 hover:bg-surface-container-lowest rounded-lg transition-colors border border-transparent hover:border-outline-variant/20">
                <ArrowLeft className="w-5 h-5 text-on-surface"/>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">Create order</h2>
        </div>
        <div className="flex items-center gap-3">
            <button type="button" onClick={onDiscard} className="px-4 py-2 text-sm font-semibold text-on-surface bg-surface-container-lowest border border-outline-variant/20 rounded-lg hover:bg-surface-container-low transition-all">
                Discard
            </button>
            <button type="button" onClick={onSave} disabled={isSaving} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-fixed transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isSaving ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                        Saving...
                    </>
                ) : ('Save')}
            </button>
        </div>
    </div>
);

const ErrorBanner = ({ message }) => {
    if (!message) return null;
    return (
        <div className="mb-6 p-4 bg-error-container text-error rounded-xl flex items-center gap-3 shadow-sm border border-error-container/50">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

const ProductsSection = ({ orderItems, updateQuantity, removeItem, formatCurrency }) => (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-on-surface">Products</h3>
            <button type="button" className="text-sm font-medium text-primary hover:underline">Browse</button>
        </div>
        
        <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"/>
            <input type="text" placeholder="Search products..." className="w-full bg-surface-container-low border-none rounded-lg py-2.5 pl-11 text-sm focus:ring-1 focus:ring-primary focus:bg-white transition-all"/>
        </div>

        {orderItems.map((item, index) => (
            <div key={`${item.productSkuId}-${index}`} className="flex items-center gap-4 py-4 border-t border-outline-variant/20">
                <div className="h-14 w-14 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 border border-outline-variant/10">
                    <img src={item.image} alt={item.productName} className="h-full w-full object-cover"/>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{item.productName}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{item.variantName}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center border border-outline-variant/30 rounded-lg bg-surface-container-low px-2">
                        <input 
                            type="number" 
                            min="1"
                            value={item.quantity} 
                            onChange={(e) => updateQuantity(index, e.target.value)}
                            className="w-12 border-none bg-transparent text-center text-sm py-1 focus:ring-0"
                        />
                    </div>
                    <div className="text-sm font-medium text-on-surface w-[80px] text-right">
                        {formatCurrency(item.unitPrice * (item.quantity || 1))}
                    </div>
                    <button type="button" onClick={() => removeItem(index)} className="p-1 hover:bg-error-container hover:text-error rounded transition-colors text-on-surface-variant">
                        <X className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        ))}
        
        {orderItems.length === 0 && (
            <div className="py-8 text-center text-sm text-on-surface-variant">
                No products selected. Please add items to create an order.
            </div>
        )}
    </section>
);

const PaymentSummarySection = ({ 
    method, onMethodChange, 
    status, onStatusChange, 
    itemCount, totalAmount, formatCurrency 
}) => (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-on-surface mb-6">Payment Summary</h3>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-outline-variant/20">
                <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Payment Method</label>
                    <select 
                        value={method}
                        onChange={(e) => onMethodChange(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary"
                    >
                        <option value="COD">Cash on Delivery (COD)</option>
                        <option value="BankTransfer">Bank Transfer</option>
                        <option value="MoMo">MoMo Wallet</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Payment Status</label>
                    <select 
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Subtotal ({itemCount} items)</span>
                <span className="text-on-surface">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <button type="button" className="text-primary font-medium flex items-center gap-1 hover:underline">
                    <Plus className="w-4 h-4"/> Add discount
                </button>
                <span className="text-on-surface-variant">—</span>
            </div>
            <div className="flex justify-between text-sm">
                <button type="button" className="text-primary font-medium flex items-center gap-1 hover:underline">
                    <Truck className="w-4 h-4"/> Add shipping
                </button>
                <span className="text-on-surface-variant">—</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <span className="text-base font-bold text-on-surface uppercase tracking-tight">Total</span>
                <span className="text-xl font-extrabold text-on-surface">{formatCurrency(totalAmount)}</span>
            </div>
        </div>
    </section>
);

const CustomerSection = ({ customerId, onCustomerChange, address, onAddressChange }) => (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-on-surface mb-4">Customer & Address</h3>
        
        <div className="flex flex-col">
            <div className="mb-4">
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Customer ID</label>
                <input 
                    type="text" 
                    value={customerId || ''}
                    onChange={(e) => onCustomerChange(e.target.value)}
                    placeholder="e.g. 50d5..."
                    className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary"
                />
            </div>
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0">
                    {customerId ? "JD" : "?"}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">
                        {customerId ? "Jane Doe (Mock)" : "Guest Checkout"}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                        {customerId ? "jane.doe@example.com" : "No email provided"}
                    </p>
                </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-2">Shipping Address</p>
                    <textarea 
                        value={address || ''}
                        onChange={(e) => onAddressChange(e.target.value)}
                        placeholder="Enter shipping address..."
                        rows={3}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary resize-none"
                    />
                </div>
            </div>
        </div>
    </section>
);

const DiscardModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white max-w-md w-full rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Discard order?</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to discard this order? Any unsaved changes will be lost.
                </p>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-[#e3e3e3] text-[#1a1a1a] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 bg-[#d82c0d] text-white text-sm font-medium rounded-lg hover:bg-[#b02108] transition-colors duration-200 shadow-sm">
                        Discard order
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export default function CreateOrder() {
    const navigate = useNavigate();
    const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
    
    // Logic Hook
    const { state, actions } = useCreateOrder();
    const { 
        orderItems, 
        address, 
        customerId, 
        paymentMethod, 
        paymentStatus, 
        totalAmount, 
        isSaving, 
        errorMessage 
    } = state;
    const { 
        setAddress, 
        setCustomerId, 
        setPaymentMethod, 
        setPaymentStatus, 
        updateQuantity, 
        removeItem, 
        handleSave 
    } = actions;

    const handleDiscardConfirm = () => {
        setIsDiscardModalOpen(false);
        navigate('/orders');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="p-8 max-w-[1200px] mx-auto pb-16">
            <PageHeader 
                isSaving={isSaving} 
                onDiscard={() => setIsDiscardModalOpen(true)} 
                onSave={handleSave} 
            />

            <ErrorBanner message={errorMessage} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <ProductsSection 
                        orderItems={orderItems} 
                        updateQuantity={updateQuantity} 
                        removeItem={removeItem} 
                        formatCurrency={formatCurrency} 
                    />

                    <PaymentSummarySection 
                        method={paymentMethod} 
                        onMethodChange={setPaymentMethod} 
                        status={paymentStatus} 
                        onStatusChange={setPaymentStatus} 
                        itemCount={orderItems.length} 
                        totalAmount={totalAmount} 
                        formatCurrency={formatCurrency} 
                    />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    <CustomerSection 
                        customerId={customerId} 
                        onCustomerChange={setCustomerId} 
                        address={address} 
                        onAddressChange={setAddress} 
                    />

                    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-on-surface mb-4">Notes</h3>
                        <textarea 
                            className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-on-surface-variant/60" 
                            placeholder="Add a note to this order..." 
                            rows={4} 
                        />
                    </section>

                    <div className="bg-surface-container-low rounded-xl p-6 border-2 border-dashed border-outline-variant/40 flex flex-col items-center text-center">
                        <CheckCircle2 className="w-8 h-8 text-outline-variant mb-2"/>
                        <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                            Orders created here directly impact inventory unless marked as draft. Ensure details are correct.
                        </p>
                    </div>
                </div>
            </div>

            <DiscardModal 
                isOpen={isDiscardModalOpen} 
                onClose={() => setIsDiscardModalOpen(false)} 
                onConfirm={handleDiscardConfirm} 
            />
        </div>
    );
}
