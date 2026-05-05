import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useStorefrontConfig } from '../../theme/useStorefrontConfig';

const AddressModal = ({ isOpen, onClose, onSave, isSaving, initialData }) => {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;
  const [formData, setFormData] = useState({
    receiverName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    streetAddress: '',
    isDefault: false,
    country: 'Vietnam'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        isDefault: !!initialData.isDefault
      });
    } else {
      setFormData({
        receiverName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        streetAddress: '',
        isDefault: false,
        country: 'Vietnam'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Shipping Address' : 'Add New Shipping Address'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Receiver Name</label>
              <input
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 transition-all"
                style={{ borderRadius: `${borderRadius}px`, '--tw-ring-color': primaryColor }}
                placeholder="e.g. Nguyen Van A"
                value={formData.receiverName}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
              <input
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 transition-all"
                style={{ borderRadius: `${borderRadius}px`, '--tw-ring-color': primaryColor }}
                placeholder="09xxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Province / City</label>
              <input
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 transition-all"
                style={{ borderRadius: `${borderRadius}px`, '--tw-ring-color': primaryColor }}
                placeholder="e.g. TP.HCM"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">District</label>
              <input
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 transition-all"
                style={{ borderRadius: `${borderRadius}px`, '--tw-ring-color': primaryColor }}
                placeholder="e.g. District 1"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ward</label>
              <input
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 transition-all"
                style={{ borderRadius: `${borderRadius}px`, '--tw-ring-color': primaryColor }}
                placeholder="e.g. Ward 5"
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Street Address</label>
              <input
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 transition-all"
                style={{ borderRadius: `${borderRadius}px`, '--tw-ring-color': primaryColor }}
                placeholder="e.g. 12 Nguyen Trai"
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                className="w-4 h-4 border-slate-300 rounded focus:ring-2 focus:ring-offset-1"
                style={{ color: primaryColor, '--tw-ring-color': primaryColor }}
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              />
              <label htmlFor="isDefault" className="text-sm text-slate-600 dark:text-slate-400">Set as default address</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              style={{ borderRadius: `${borderRadius}px` }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2 text-white font-bold disabled:opacity-70 transition-all flex items-center gap-2 hover:brightness-110"
              style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {initialData ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
