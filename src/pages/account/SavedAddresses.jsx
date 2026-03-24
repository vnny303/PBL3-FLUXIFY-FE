import { useState } from 'react';
import { Plus, Pencil, Trash } from 'lucide-react';
import AddressModal from '../../components/AddressModal';

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'John Doe',
      phone: '+1 555-1234',
      address: '123 Maple St,\nSpringfield, IL, 62704\nUnited States',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Alex Thompson',
      phone: '+1 555-5678',
      address: '456 Oak Lane, Suite 202,\nChicago, IL, 60601\nUnited States',
      isDefault: false,
    },
    {
      id: 3,
      name: 'Sarah Thompson',
      phone: '+1 555-9012',
      address: '789 Pine Avenue,\nEvanston, IL, 60201\nUnited States',
      isDefault: false,
    }
  ]);

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

  const handleDelete = (id) => {
    setAddressToDelete(id);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      setAddresses(addresses.filter(a => a.id !== addressToDelete));
      setAddressToDelete(null);
    }
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handleSave = (addressData) => {
    if (addressData.id) {
      // Edit existing
      setAddresses(addresses.map(a => {
        if (a.id === addressData.id) return addressData;
        // If the edited address is set to default, unset others
        if (addressData.isDefault && a.id !== addressData.id) return { ...a, isDefault: false };
        return a;
      }));
    } else {
      // Add new
      const newAddress = {
        ...addressData,
        id: Date.now()
      };
      
      if (newAddress.isDefault || addresses.length === 0) {
        newAddress.isDefault = true;
        setAddresses([newAddress, ...addresses.map(a => ({ ...a, isDefault: false }))]);
      } else {
        setAddresses([...addresses, newAddress]);
      }
    }
  };

  return (
    <section className="flex-1">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight">Saved Addresses</h2>
            <p className="text-slate-500 text-sm mt-1">Manage your saved addresses for faster checkout.</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        </div>
        
        {addresses.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't saved any addresses yet.</p>
            <button 
              onClick={handleAdd}
              className="text-primary font-bold hover:underline"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div 
                key={addr.id} 
                className={`flex flex-col p-5 rounded-xl border ${
                  addr.isDefault 
                    ? 'border-2 border-primary bg-primary/5' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow'
                }`}
              >
                <div className={`flex items-center ${addr.isDefault ? 'justify-between' : 'justify-end'} mb-4`}>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider">Default Address</span>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(addr)} className="text-slate-400 hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-slate-900 dark:text-white font-bold text-base mb-1">{addr.name}</p>
                  <p className="text-slate-500 text-sm mb-3">{addr.phone}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {addr.address}
                  </p>
                </div>
                
                {!addr.isDefault && (
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => handleSetDefault(addr.id)}
                      className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-primary/20 hover:text-primary transition-all"
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
        onSave={handleSave}
        initialData={editingAddress}
      />

      {addressToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Address</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setAddressToDelete(null)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
