import React from 'react';
import { User, MapPin, Truck, CreditCard, Plus, Loader2, StickyNote, Info } from 'lucide-react';
import AddressModal from '../../address-management/ui/AddressModal';
import { SHIPPING_METHODS } from '../../../shared/lib/constants';
import { formatVnd } from '../../../shared/lib/formatters';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';

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
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;
  const bgColor = theme?.colors?.background || '#ffffff';
  const textColor = theme?.colors?.text || '#111827';
  const cardBg = bgColor === '#ffffff' ? '#ffffff' : `${bgColor}E6`;
  const sectionBg = bgColor === '#ffffff' ? '#f8fafc' : `${bgColor}80`;

  return (
    <div className="lg:w-[60%] space-y-6">
      {/* Contact Information */}
      <section 
        className="shadow-sm p-6 border border-slate-100 dark:border-slate-800 transition-all"
        style={{ borderRadius: `${borderRadius}px`, backgroundColor: cardBg, color: textColor }}
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6" style={{ color: textColor }}>
          <User className="w-5 h-5" style={{ color: primaryColor }} />
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
      <section 
        className="shadow-sm p-6 border border-slate-100 dark:border-slate-800"
        style={{ borderRadius: `${borderRadius}px`, backgroundColor: cardBg, color: textColor }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: textColor }}>
            <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
            Shipping Address
          </h2>
          <button 
            onClick={onOpenAddressModal}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-80"
            style={{ color: primaryColor }}
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
              className="px-6 py-2.5 text-white text-xs font-bold shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px`, boxShadow: `0 10px 15px -3px ${primaryColor}4D` }}
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
                <div 
                  className="h-full p-4 border-2 transition-all shadow-sm"
                  style={{ 
                    borderRadius: `${borderRadius}px`,
                    borderColor: selectedAddressId === addr.id ? primaryColor : undefined,
                    backgroundColor: selectedAddressId === addr.id ? `${primaryColor}0D` : undefined
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-slate-900 dark:text-white">{addr.receiverName}</span>
                       {addr.isDefault && (
                         <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-tighter rounded">Default</span>
                       )}
                    </div>
                    <div 
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{ borderColor: selectedAddressId === addr.id ? primaryColor : '#e2e8f0' }}
                    >
                       <div 
                         className={`w-2.5 h-2.5 rounded-full transition-all scale-0 ${selectedAddressId === addr.id ? 'scale-100' : ''}`} 
                         style={{ backgroundColor: primaryColor }}
                       />
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
      <section 
        className="shadow-sm p-6 border border-slate-100 dark:border-slate-800"
        style={{ borderRadius: `${borderRadius}px`, backgroundColor: cardBg, color: textColor }}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: textColor }}>
          <StickyNote className="w-5 h-5" style={{ color: primaryColor }} />
          Order Note / Delivery Note
        </h2>
        <textarea
          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm outline-none transition-all resize-none min-h-[100px] focus:ring-2"
          style={{ 
            borderRadius: `${borderRadius}px`,
            '--tw-ring-color': `${primaryColor}80` 
          }}
          placeholder="Add any specific delivery instructions or notes for your order..."
          value={orderNote}
          onChange={(e) => onChangeOrderNote(e.target.value)}
        />
        <p className="text-[10px] text-slate-400 mt-2 italic">This note is optional and will be appended to your shipping address.</p>
      </section>

      {/* Shipping Method */}
      <section 
        className="shadow-sm p-6 border border-slate-100 dark:border-slate-800"
        style={{ borderRadius: `${borderRadius}px`, backgroundColor: cardBg, color: textColor }}
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: textColor }}>
          <Truck className="w-5 h-5" style={{ color: primaryColor }} />
          Shipping Method
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.values(SHIPPING_METHODS).map((method) => (
            <label 
              key={method.id}
              className="flex items-center justify-between p-4 border-2 cursor-pointer transition-all"
              style={{
                borderRadius: `${borderRadius}px`,
                borderColor: shippingMethodId === method.id ? primaryColor : undefined,
                backgroundColor: shippingMethodId === method.id ? `${primaryColor}0D` : undefined
              }}
            >
              <div className="flex items-center gap-3">
                <input className="sr-only" name="shipping" type="radio" checked={shippingMethodId === method.id} onChange={() => onSelectShippingMethod(method.id)} />
                <div 
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{ borderColor: shippingMethodId === method.id ? primaryColor : '#e2e8f0' }}
                >
                  <div 
                    className={`w-2.5 h-2.5 rounded-full transition-all scale-0 ${shippingMethodId === method.id ? 'scale-100' : ''}`} 
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{method.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{method.eta}</p>
                </div>
              </div>
              <span className="text-sm font-black" style={{ color: primaryColor }}>
                {method.fee === 0 ? 'Free' : formatVnd(method.fee)}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Payment Method */}
      <section 
        className="shadow-sm p-6 border border-slate-100 dark:border-slate-800"
        style={{ borderRadius: `${borderRadius}px`, backgroundColor: cardBg, color: textColor }}
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: textColor }}>
          <CreditCard className="w-5 h-5" style={{ color: primaryColor }} />
          Payment Method
        </h2>
        <div className="space-y-4">
          <label 
            className="flex items-center gap-3 p-4 border-2 cursor-pointer transition-all"
            style={{
              borderRadius: `${borderRadius}px`,
              borderColor: paymentMethod === 'cod' ? primaryColor : undefined,
              backgroundColor: paymentMethod === 'cod' ? `${primaryColor}0D` : undefined
            }}
          >
            <input className="sr-only" name="payment" type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
            <div 
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
              style={{ borderColor: paymentMethod === 'cod' ? primaryColor : '#e2e8f0' }}
            >
               <div 
                 className={`w-2.5 h-2.5 rounded-full transition-all scale-0 ${paymentMethod === 'cod' ? 'scale-100' : ''}`} 
                 style={{ backgroundColor: primaryColor }}
               />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</span>
          </label>
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
