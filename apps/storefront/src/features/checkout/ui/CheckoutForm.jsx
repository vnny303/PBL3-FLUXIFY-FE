import React from 'react';
import { User, MapPin, Truck, CreditCard, Plus, Loader2, StickyNote, Info } from 'lucide-react';
import AddressModal from '../../address-management/ui/AddressModal';
import { SHIPPING_METHODS } from '../../../shared/lib/constants';
import { formatVnd } from '../../../shared/lib/formatters';

export default function CheckoutForm({
  userEmail,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onOpenAddressModal,
  isAddressModalOpen,
  onCloseAddressModal,
  onAddAddress,
  isAddingAddress,
  isLoadingAddresses,
  shippingMethodId,
  onSelectShippingMethod,
  orderNote,
  onChangeOrderNote,
  paymentMethod,
  setPaymentMethod,
  selectedAddress
}) {
  return (
    <div className="lg:w-[60%] space-y-6">
      {/* Contact Information */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800 transition-all">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
          <User className="text-primary w-5 h-5" />
          Contact Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
              {userEmail || 'guest@example.com'}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic">* Order confirmation will be sent to this email.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Receiver Name</label>
              <div className={`px-4 py-3 rounded-xl border text-sm transition-all ${selectedAddress ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                {selectedAddress ? selectedAddress.receiverName : 'Please select an address below'}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
              <div className={`px-4 py-3 rounded-xl border text-sm transition-all ${selectedAddress ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                {selectedAddress ? selectedAddress.phone : 'Please select an address below'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Address */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <MapPin className="text-primary w-5 h-5" />
            Shipping Address
          </h2>
          <button 
            onClick={onOpenAddressModal}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wider transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {isLoadingAddresses ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Loading saved addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm mb-4">
              <MapPin className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No saved addresses</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-[240px]">You haven't added any shipping addresses yet. Please add one to continue.</p>
            <button 
              onClick={onOpenAddressModal}
              className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <label key={addr.id} className="group relative cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="address" 
                  type="radio" 
                  checked={selectedAddressId === addr.id}
                  onChange={() => onSelectAddress(addr.id)}
                />
                <div className="h-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 peer-checked:border-primary peer-checked:bg-primary/5 hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-slate-900 dark:text-white">{addr.receiverName}</span>
                       {addr.isDefault && (
                         <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-tighter rounded">Default</span>
                       )}
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center peer-checked:border-primary transition-all">
                       <div className={`w-2.5 h-2.5 rounded-full bg-primary transition-all scale-0 ${selectedAddressId === addr.id ? 'scale-100' : ''}`} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{addr.phone}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {addr.streetAddress}<br />
                      {addr.ward}, {addr.district}<br />
                      {addr.province}, {addr.country}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* Order Note */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <StickyNote className="text-primary w-5 h-5" />
          Order Note / Delivery Note
        </h2>
        <textarea
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none min-h-[100px]"
          placeholder="Add any specific delivery instructions or notes for your order..."
          value={orderNote}
          onChange={(e) => onChangeOrderNote(e.target.value)}
        />
        <p className="text-[10px] text-slate-400 mt-2 italic">This note is optional and will be appended to your shipping address.</p>
      </section>

      {/* Shipping Method */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
          <Truck className="text-primary w-5 h-5" />
          Shipping Method
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.values(SHIPPING_METHODS).map((method) => (
            <label 
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethodId === method.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <input className="sr-only" name="shipping" type="radio" checked={shippingMethodId === method.id} onChange={() => onSelectShippingMethod(method.id)} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${shippingMethodId === method.id ? 'border-primary' : 'border-slate-200'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full bg-primary transition-all scale-0 ${shippingMethodId === method.id ? 'scale-100' : ''}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{method.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{method.eta}</p>
                </div>
              </div>
              <span className="text-sm font-black text-primary">
                {method.fee === 0 ? 'Free' : formatVnd(method.fee)}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Payment Method */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
          <CreditCard className="text-primary w-5 h-5" />
          Payment Method
        </h2>
        <div className="space-y-4">
          <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
            <input className="sr-only" name="payment" type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'border-primary' : 'border-slate-200'}`}>
               <div className={`w-2.5 h-2.5 rounded-full bg-primary transition-all scale-0 ${paymentMethod === 'cod' ? 'scale-100' : ''}`} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</span>
          </label>
          
          <div className={`rounded-2xl border-2 transition-all overflow-hidden ${paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
            <label className="flex items-center gap-3 p-4 cursor-pointer">
              <input className="sr-only" name="payment" type="radio" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'bank' ? 'border-primary' : 'border-slate-200'}`}>
                 <div className={`w-2.5 h-2.5 rounded-full bg-primary transition-all scale-0 ${paymentMethod === 'bank' ? 'scale-100' : ''}`} />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Bank Transfer</span>
            </label>
            
            {paymentMethod === 'bank' && (
              <div className="px-6 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Transfer after placing order. Final payment instructions and QR code will be shown on the order confirmation page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={onCloseAddressModal}
        onSave={onAddAddress}
        isSaving={isAddingAddress}
      />
    </div>
  );
}
