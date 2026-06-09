import React, { useState } from 'react';
import { Plus, Pencil, Trash, Loader2, MapPin, CheckCircle2 } from 'lucide-react';
import { useAddresses } from '../../../../../features/address-management/model/useAddresses';
import AddressModal from '../../../../../features/address-management/ui/AddressModal';
import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';

export default function SavedAddresses() {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;
  const textColor = theme?.colors?.text || '#111827';
  const cardBg = '#ffffff';
  const sectionBg = '#f8fafc';

  const { 
    addresses, 
    isLoading, 
    saveAddress, 
    isSaving, 
    deleteAddress, 
    isDeleting, 
    setDefault 
  } = useAddresses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const handleAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    saveAddress(data, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete, {
        onSuccess: () => setAddressToDelete(null)
      });
    }
  };

  return (
    <section className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: textColor }}>
            <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
            Saved Addresses
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your shipping locations for checkout.</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-colors"
          style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      <div
        className="rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6"
        style={{ backgroundColor: cardBg, color: textColor, borderRadius: `${borderRadius}px` }}
      >
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: primaryColor }} />
            <p className="text-sm font-medium">Fetching your addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800"
            style={{ backgroundColor: sectionBg, borderRadius: `${borderRadius}px` }}
          >
            <div className="w-14 h-14 bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-5" style={{ borderRadius: `${borderRadius}px` }}>
              <MapPin className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>No addresses found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[280px] text-center leading-relaxed">
              Start by adding your first shipping address. We'll use this for delivery and tax calculations.
            </p>
            <button 
              onClick={handleAdd}
              className="px-6 py-2.5 text-white text-sm font-semibold hover:opacity-90 transition-colors shadow-sm"
              style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="group relative flex flex-col p-5 border transition-colors"
                style={{
                  borderRadius: `${borderRadius}px`,
                  borderColor: addr.isDefault ? primaryColor : '#e2e8f0',
                  backgroundColor: addr.isDefault ? `${primaryColor}08` : cardBg,
                  color: textColor,
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-10 h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0"
                      style={{ borderRadius: `${borderRadius}px` }}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-slate-900 dark:text-white font-bold text-base truncate">{addr.receiverName}</h3>
                        {addr.isDefault && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 tabular-nums">{addr.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(addr)} 
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      style={{ borderRadius: `${borderRadius}px` }}
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setAddressToDelete(addr.id)} 
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      style={{ borderRadius: `${borderRadius}px` }}
                      title="Delete"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grow">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {addr.streetAddress}<br />
                    {addr.ward}, {addr.district}<br />
                    {addr.province}, {addr.country}
                  </p>
                </div>
                
                {!addr.isDefault && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => setDefault(addr.id)}
                      className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                      style={{ borderRadius: `${borderRadius}px` }}
                    >
                      Set as Default
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddressModal 
        key={editingAddress?.id || 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingAddress}
        isSaving={isSaving}
      />

      {addressToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-sm shadow-2xl p-6 animate-in zoom-in-95 duration-200"
            style={{ borderRadius: `${borderRadius}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-5 mx-auto" style={{ borderRadius: `${borderRadius}px` }}>
              <Trash className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 text-center">Delete This Address?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 text-center leading-relaxed px-2">This will permanently remove yours shipping location. You'll need to add it again for future orders.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-full py-3 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Yes, Delete Address
              </button>
              <button 
                onClick={() => setAddressToDelete(null)}
                className="w-full py-3 text-slate-500 dark:text-slate-400 text-sm font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                No, Keep It
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
