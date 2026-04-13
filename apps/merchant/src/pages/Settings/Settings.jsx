import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { fetchStoreSettings } from '../../shared/api/mockApi';

const SkeletonLoader = () => (
    <div className="p-8 max-w-4xl mx-auto pb-16">
        <div className="mb-10">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="md:col-span-2">
                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden h-96 animate-pulse"></div>
            </div>
        </section>
    </div>
);

const PlanBillingSection = ({ storeData }) => (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-on-surface mb-1">Plan & billing</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Manage your SaaS subscription plan and storage limits.</p>
        </div>
        <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group border border-outline-variant/30 shadow-sm">
                    <div className="relative z-10">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Current Subscription</h5>
                        <p className="text-2xl font-bold text-on-surface mb-2">{storeData.plan}</p>
                        <p className="text-sm text-on-surface-variant">Billed monthly. Next payment on Nov 12.</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-surface-container-low rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                </div>
                
                <div className="bg-primary text-white p-6 rounded-xl relative overflow-hidden flex flex-col justify-between shadow-md">
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">Storage Usage</h5>
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-3xl font-bold">{storeData.storageUsed}</span>
                            <span className="text-lg font-medium opacity-80 mb-1">GB</span>
                        </div>
                        <p className="text-sm opacity-70">of {storeData.storageLimit}GB total available storage</p>
                    </div>
                    <div className="mt-6 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${(storeData.storageUsed / storeData.storageLimit) * 100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const DangerZoneSection = ({ onOpenModal }) => (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-on-surface mb-1">Delete store</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Permanently delete your store and all of its data.</p>
        </div>
        <div className="md:col-span-2">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-error/20 ring-1 ring-error/10">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-error-container/50 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-error"/>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-base font-medium text-on-surface">Delete this store</h4>
                        <p className="text-sm text-on-surface-variant mt-1 mb-6">Once you delete a store, there is no going back. Please be certain.</p>
                        <div className="flex justify-end">
                            <button type="button" onClick={onOpenModal} className="px-4 py-2 bg-error text-white text-sm font-medium rounded-lg hover:bg-error/90 transition-colors duration-200 shadow-sm">
                                Delete store
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <div className="mt-12 text-center">
        <p className="text-xs text-on-surface-variant font-medium">
            Need help with management? <a href="#" className="text-primary hover:underline underline-offset-4 font-semibold">Contact Merchant Support</a>
        </p>
    </div>
);

const DeleteStoreModal = ({ storeData, deleteInput, setDeleteInput, handleDeleteCancel, handleDeleteConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white max-w-md w-full rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete store?</h2>
            <p className="text-sm text-gray-600 mb-6">
                This action cannot be undone. All your products, orders, and customer data will be permanently deleted.
            </p>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please type <strong className="text-black">{storeData.storeName}</strong> to confirm.
                </label>
                <input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} className="w-full bg-white border border-[#e3e3e3] rounded-lg px-3 py-2 focus:border-black outline-none transition-colors text-sm" placeholder={storeData.storeName}/>
            </div>
            <div className="flex justify-end gap-3">
                <button type="button" onClick={handleDeleteCancel} className="px-4 py-2 bg-white border border-[#e3e3e3] text-[#1a1a1a] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                    Cancel
                </button>
                <button type="button" disabled={deleteInput !== storeData.storeName} onClick={handleDeleteConfirm} className="px-4 py-2 bg-[#d82c0d] text-white text-sm font-medium rounded-lg hover:bg-[#b02108] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm">
                    Delete permanently
                </button>
            </div>
        </div>
    </div>
);

export default function Settings() {
    const [isEditing, setIsEditing] = useState(false);
    const [storeData, setStoreData] = useState(null);
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                setIsLoading(true);
                const data = await fetchStoreSettings();
                setStoreData(data);
                setFormData(data);
            }
            catch (err) {
                setFetchError('Failed to load store settings');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    const validateForm = () => {
        if (!formData) return false;
        const newErrors = {};
        if (!formData.storeName.trim()) newErrors.storeName = 'Store name is required';
        if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required';
        if (!formData.supportEmail.trim()) newErrors.supportEmail = 'Support email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportEmail)) newErrors.supportEmail = 'Invalid email format';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.operatingAddress.trim()) newErrors.operatingAddress = 'Operating address is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm() || !formData) return;
        setStoreData(formData);
        setIsEditing(false);
        setErrors({});
    };

    const handleCancel = () => {
        setFormData(storeData);
        setIsEditing(false);
        setErrors({});
    };

    const handleDeleteCancel = () => {
        setIsModalOpen(false);
        setDeleteInput('');
    };

    const handleDeleteConfirm = () => {
        console.log('Store deleted');
        setIsModalOpen(false);
        setDeleteInput('');
    };

    if (isLoading) return <SkeletonLoader />;
    
    if (fetchError || !storeData || !formData) {
        return <div className="p-8 text-center text-error">Failed to load settings.</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto pb-16">
            <div className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Store Management</h2>
            </div>

            {/* Section 1: Update Information */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-on-surface mb-1">Store details</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Manage your store's basic information, contact details, and regional settings.</p>
                </div>
                <div className="md:col-span-2">
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                        <div className="p-6">
                            {!isEditing ? (
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-on-surface mb-3">Basic Information</h4>
                                        <div className="flex items-center gap-4">
                                            <img src={storeData.logoUrl} alt="Store Logo" className="w-12 h-12 rounded-lg object-cover border border-outline-variant/30"/>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                                <div>
                                                    <p className="text-xs font-medium text-on-surface-variant mb-1">Store Name</p>
                                                    <p className="text-sm text-on-surface">{storeData.storeName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-on-surface-variant mb-1">Subdomain</p>
                                                    <p className="text-sm text-on-surface">{storeData.subdomain}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px w-full bg-outline-variant/30"></div>
                                    {/* Contact Info */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-on-surface mb-3">Contact Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-medium text-on-surface-variant mb-1">Support Email</p>
                                                <p className="text-sm text-on-surface">{storeData.supportEmail}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-on-surface-variant mb-1">Phone Number</p>
                                                <p className="text-sm text-on-surface">{storeData.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px w-full bg-outline-variant/30"></div>
                                    {/* Regional Settings */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-on-surface mb-3">Regional Settings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-medium text-on-surface-variant mb-1">Operating Address</p>
                                                <p className="text-sm text-on-surface">{storeData.operatingAddress}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-on-surface-variant mb-1">Store Currency</p>
                                                <p className="text-sm text-on-surface">{storeData.currency === 'VND' ? 'VND (₫)' : 'USD ($)'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Edit Basic Info */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-on-surface mb-3">Basic Information</h4>
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-on-surface mb-2">Store Logo</label>
                                                <div className="flex items-center gap-3">
                                                    <img src={formData.logoUrl} alt="Store Logo" className="w-12 h-12 rounded-lg object-cover border border-outline-variant/30"/>
                                                    <button type="button" className="px-3 py-1.5 bg-white border border-[#e3e3e3] text-[#1a1a1a] text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">Change</button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                                <div>
                                                    <label className="block text-sm font-medium text-on-surface mb-1">Store Name</label>
                                                    <input type="text" value={formData.storeName} onChange={e => { setFormData({ ...formData, storeName: e.target.value }); if (errors.storeName) setErrors({ ...errors, storeName: '' }); }} className={`w-full bg-white border ${errors.storeName ? 'border-red-500 focus:border-red-500' : 'border-[#e3e3e3] focus:border-black'} rounded-lg px-3 py-2 outline-none transition-colors text-sm`}/>
                                                    {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-on-surface mb-1">Subdomain</label>
                                                    <input type="text" value={formData.subdomain} onChange={e => { setFormData({ ...formData, subdomain: e.target.value }); if (errors.subdomain) setErrors({ ...errors, subdomain: '' }); }} className={`w-full bg-white border ${errors.subdomain ? 'border-red-500 focus:border-red-500' : 'border-[#e3e3e3] focus:border-black'} rounded-lg px-3 py-2 outline-none transition-colors text-sm`}/>
                                                    {errors.subdomain && <p className="text-red-500 text-xs mt-1">{errors.subdomain}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px w-full bg-outline-variant/30"></div>
                                    {/* Edit Contact Info */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-on-surface mb-3">Contact Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-on-surface mb-1">Support Email</label>
                                                <input type="email" value={formData.supportEmail} onChange={e => { setFormData({ ...formData, supportEmail: e.target.value }); if (errors.supportEmail) setErrors({ ...errors, supportEmail: '' }); }} className={`w-full bg-white border ${errors.supportEmail ? 'border-red-500 focus:border-red-500' : 'border-[#e3e3e3] focus:border-black'} rounded-lg px-3 py-2 outline-none transition-colors text-sm`}/>
                                                {errors.supportEmail && <p className="text-red-500 text-xs mt-1">{errors.supportEmail}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-on-surface mb-1">Phone Number</label>
                                                <input type="tel" value={formData.phoneNumber} onChange={e => { setFormData({ ...formData, phoneNumber: e.target.value }); if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' }); }} className={`w-full bg-white border ${errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-[#e3e3e3] focus:border-black'} rounded-lg px-3 py-2 outline-none transition-colors text-sm`}/>
                                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px w-full bg-outline-variant/30"></div>
                                    {/* Edit Regional Settings */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-on-surface mb-3">Regional Settings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-on-surface mb-1">Operating Address</label>
                                                <input type="text" value={formData.operatingAddress} onChange={e => { setFormData({ ...formData, operatingAddress: e.target.value }); if (errors.operatingAddress) setErrors({ ...errors, operatingAddress: '' }); }} className={`w-full bg-white border ${errors.operatingAddress ? 'border-red-500 focus:border-red-500' : 'border-[#e3e3e3] focus:border-black'} rounded-lg px-3 py-2 outline-none transition-colors text-sm`}/>
                                                {errors.operatingAddress && <p className="text-red-500 text-xs mt-1">{errors.operatingAddress}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-on-surface mb-1">Store Currency</label>
                                                <select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })} className="w-full bg-white border border-[#e3e3e3] rounded-lg px-3 py-2 focus:border-black outline-none transition-colors text-sm">
                                                    <option value="VND">VND (₫)</option>
                                                    <option value="USD">USD ($)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={`px-6 py-4 border-t border-outline-variant/30 flex ${isEditing ? 'justify-end gap-3' : 'justify-end'}`}>
                            {!isEditing ? (
                                <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white border border-[#e3e3e3] text-[#1a1a1a] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                                    Edit info
                                </button>
                            ) : (
                                <>
                                    <button type="button" onClick={handleCancel} className="px-4 py-2 bg-white border border-[#e3e3e3] text-[#1a1a1a] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                                        Cancel
                                    </button>
                                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm">
                                        Save
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-px w-full bg-outline-variant/30 mb-12"></div>
            <PlanBillingSection storeData={storeData} />
            <div className="h-px w-full bg-outline-variant/30 mb-12"></div>
            <DangerZoneSection onOpenModal={() => setIsModalOpen(true)} />
            <Footer />

            {isModalOpen && (
                <DeleteStoreModal 
                    storeData={storeData}
                    deleteInput={deleteInput}
                    setDeleteInput={setDeleteInput}
                    handleDeleteCancel={handleDeleteCancel}
                    handleDeleteConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
}
