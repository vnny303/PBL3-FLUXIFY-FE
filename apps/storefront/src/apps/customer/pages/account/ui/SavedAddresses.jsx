import React, { useState } from 'react';
import { Plus, Pencil, Trash, Loader2, MapPin, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../../../../../shared/api/addressService';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import AddressModal from '../../../../../features/address-management/ui/AddressModal';

export default function SavedAddresses() {
  const queryClient = useQueryClient();
  const { user } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Fetch addresses
  const { data: response, isLoading } = useQuery({
    queryKey: ['customer-addresses', user?.userId],
    queryFn: () => addressService.getAddresses(user?.tenantId, user?.userId),
    enabled: !!user?.userId
  });

  const addresses = response?.data || [];

  // Mutations
  const { mutate: saveAddress, isPending: isSaving } = useMutation({
    mutationFn: (data) => {
      if (data.id && typeof data.id === 'string' && !data.id.startsWith('mock')) {
         return addressService.updateAddress(user?.tenantId, user?.userId, data.id, data);
      } else if (data.id && data.id.startsWith('mock')) {
         // Even for mock IDs, we treat as update in our local mock logic
         return addressService.updateAddress(user?.tenantId, user?.userId, data.id, data);
      }
      return addressService.createAddress(user?.tenantId, user?.userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', user?.userId] });
      setIsModalOpen(false);
      setEditingAddress(null);
      toast.success('Address saved successfully!');
    },
    onError: () => toast.error('Failed to save address')
  });

  const { mutate: deleteAddress, isPending: isDeleting } = useMutation({
    mutationFn: (id) => addressService.deleteAddress(user?.tenantId, user?.userId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', user?.userId] });
      setAddressToDelete(null);
      toast.success('Address deleted successfully!');
    },
    onError: () => toast.error('Failed to delete address')
  });

  const { mutate: setDefault } = useMutation({
    mutationFn: (id) => addressService.updateAddress(user?.tenantId, user?.userId, id, { isDefault: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', user?.userId] });
      toast.success('Default address updated!');
    }
  });

  const handleAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setAddressToDelete(id);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete);
    }
  };

  return (
    <section className="flex-1">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-8">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight flex items-center gap-2">
              <MapPin className="text-primary w-6 h-6" />
              Saved Addresses
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage your shipping locations for a seamless checkout experience.</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary-hover hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p className="text-sm font-medium">Fetching your addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-6">
              <MapPin className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No addresses found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[280px] text-center leading-relaxed">
              Start by adding your first shipping address. We'll use this for delivery and tax calculations.
            </p>
            <button 
              onClick={handleAdd}
              className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div 
                key={addr.id} 
                className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all overflow-hidden ${
                  addr.isDefault 
                    ? 'border-primary bg-primary/[0.02]' 
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                {addr.isDefault && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl shadow-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Default
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                     <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(addr)} 
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(addr.id)} 
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
                      className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveAddress}
        initialData={editingAddress}
        isSaving={isSaving}
      />

      {addressToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Trash className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 text-center">Delete This Address?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 text-center leading-relaxed px-2">This will permanently remove yours shipping location. You'll need to add it again for future orders.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-full py-4 bg-red-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Yes, Delete Address
              </button>
              <button 
                onClick={() => setAddressToDelete(null)}
                className="w-full py-4 text-slate-500 dark:text-slate-400 text-xs font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
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
