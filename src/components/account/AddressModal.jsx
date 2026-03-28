import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function AddressModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', isDefault: false });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', phone: '', address: '', isDefault: false });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.address.trim()) newErrors.address = "Full Address is required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{initialData ? 'Edit Address' : 'Add New Address'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto" noValidate>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm outline-none transition-all ${errors.name ? 'border border-red-500 focus:ring-1 focus:ring-red-500' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary'}`} placeholder="John Doe" />
            {errors.name && <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">Phone Number</label>
            <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm outline-none transition-all ${errors.phone ? 'border border-red-500 focus:ring-1 focus:ring-red-500' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary'}`} placeholder="+1 555-0000" />
            {errors.phone && <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">Full Address</label>
            <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`w-full h-24 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm outline-none resize-none transition-all ${errors.address ? 'border border-red-500 focus:ring-1 focus:ring-red-500' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary'}`} placeholder={"123 Street Name\nCity, State, Zip\nCountry"}></textarea>
            {errors.address && <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500"><AlertCircle className="w-3.5 h-3.5" />{errors.address}</p>}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 text-primary rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 focus:ring-primary" />
            <label htmlFor="isDefault" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Set as default address</label>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors shadow-sm">Save Address</button>
          </div>
        </form>
      </div>
    </div>
  );
}
