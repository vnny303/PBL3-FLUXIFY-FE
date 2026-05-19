import React, { useState } from 'react';
import { Plus, Pencil, Trash, Loader2, MapPin, CheckCircle2 } from 'lucide-react';
import { useAddresses } from '../../../../../features/address-management/model/useAddresses';
import AddressModal from '../../../../../features/address-management/ui/AddressModal';
import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';

export default function SavedAddresses() {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;
  const bgColor = theme?.colors?.background || '#ffffff';
  const textColor = theme?.colors?.text || '#111827';
  const cardBg = bgColor === '#ffffff' ? '#ffffff' : `${bgColor}CC`;

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
    <section className="flex-1">
      <div 
        className="rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800 p-6 md:p-8"
        style={{ backgroundColor: cardBg, color: textColor }}
      >
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: textColor }}>
              <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
              Saved Addresses
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage your shipping locations for a seamless checkout experience.</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 text-white font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            style={{ 
              backgroundColor: primaryColor, 
              borderRadius: `${borderRadius}px`,
              boxShadow: `0 10px 15px -3px ${primaryColor}33`
            }}
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: primaryColor }} />
            <p className="text-sm font-medium">Fetching your addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-6" style={{ borderRadius: `${borderRadius}px` }}>
              <MapPin className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: textColor }}>No addresses found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[280px] text-center leading-relaxed">
              Start by adding your first shipping address. We'll use this for delivery and tax calculations.
            </p>
            <button 
              onClick={handleAdd}
              className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              style={{ borderRadius: `${borderRadius}px` }}
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div 
                key={addr.id} 
                className={`group relative flex flex-col p-6 border-2 transition-all overflow-hidden ${
                  addr.isDefault 
                    ? 'bg-primary/[0.02]' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
                style={{ 
                  borderRadius: `${borderRadius}px`,
                  borderColor: addr.isDefault ? primaryColor : undefined,
                  backgroundColor: addr.isDefault ? `${primaryColor}0D` : cardBg,
                  color: textColor
                }}
              >
                {addr.isDefault && (
                  <div className="absolute top-0 right-0">
                    <div 
                      className="text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 shadow-sm flex items-center gap-1.5"
                      style={{ 
                        backgroundColor: primaryColor,
                        borderBottomLeftRadius: `${borderRadius}px`
                      }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Default
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div 
                    className="w-10 h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                    style={{ borderRadius: `${borderRadius}px` }}
                  >
                     <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(addr)} 
                      className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
                      style={{ borderRadius: `${borderRadius}px` }}
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setAddressToDelete(addr.id)} 
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      style={{ borderRadius: `${borderRadius}px` }}
                      title="Delete"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grow">
                  <h3 className="text-slate-900 dark:text-white font-black text-lg mb-1">{addr.receiverName}</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 tabular-nums">{addr.phone}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {addr.streetAddress}<br />
                    {addr.ward}, {addr.district}<br />
                    {addr.province}, {addr.country}
                  </p>
                </div>
                
                {!addr.isDefault && (
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => setDefault(addr.id)}
                      className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6 mx-auto" style={{ borderRadius: `${borderRadius}px` }}>
              <Trash className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 text-center">Delete This Address?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 text-center leading-relaxed px-2">This will permanently remove yours shipping location. You'll need to add it again for future orders.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-full py-4 bg-red-600 text-white text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Yes, Delete Address
              </button>
              <button 
                onClick={() => setAddressToDelete(null)}
                className="w-full py-4 text-slate-500 dark:text-slate-400 text-xs font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
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
