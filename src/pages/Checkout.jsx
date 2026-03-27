import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CustomSelect = ({ options, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className="relative" 
      tabIndex={0} 
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div 
        className={`w-full px-3 py-2.5 rounded-lg border ${isOpen ? 'border-primary ring-2 ring-primary/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 text-sm outline-none transition-all cursor-pointer flex justify-between items-center ${!value ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{value ? options.find(o => o.value === value)?.label : placeholder}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <li 
                key={option.value}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${value === option.value ? 'bg-primary/5 text-primary font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CITY_OPTIONS = [
  { value: 'springfield', label: 'Springfield' },
  { value: 'chicago', label: 'Chicago' },
  { value: 'new-york', label: 'New York' },
  { value: 'los-angeles', label: 'Los Angeles' },
];

const STATE_OPTIONS = [
  { value: 'il', label: 'Illinois' },
  { value: 'ny', label: 'New York' },
  { value: 'ca', label: 'California' },
  { value: 'tx', label: 'Texas' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('new');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [shippingFee, setShippingFee] = useState(5.00);
  const [addresses, setAddresses] = useState([]);

  const [contactInfo, setContactInfo] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 000-1234'
  });
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [editContactForm, setEditContactForm] = useState({ ...contactInfo });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(true);
  const [addressErrors, setAddressErrors] = useState({});

  const validateAddress = () => {
    const errors = {};
    if (!street.trim()) errors.street = 'Street address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditContact = (e) => {
    e.preventDefault();
    setEditContactForm({ ...contactInfo });
    setIsEditingContact(true);
  };

  const handleCancelContact = () => {
    setIsEditingContact(false);
  };

  const handleSaveContact = () => {
    setIsSavingContact(true);
    setTimeout(() => {
      setContactInfo({ ...editContactForm });
      setIsSavingContact(false);
      setIsEditingContact(false);
      toast.success('Thông tin liên hệ đã được cập nhật!');
    }, 1000);
  };

  const handleSaveNewAddress = () => {
    if (validateAddress()) {
      const newAddressId = `address_${Date.now()}`;
      const newAddress = {
        id: newAddressId,
        label: `Address ${addresses.length + 1}`,
        street: street,
        city: CITY_OPTIONS.find(o => o.value === city)?.label || city,
        state: STATE_OPTIONS.find(o => o.value === state)?.label || state,
        zip: '', // Optional or could be added to form
        country: 'United States'
      };
      
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddressId);
      setIsAddingNewAddress(false);
      setStreet('');
      setCity('');
      setState('');
      setAddressErrors({});
      toast.success('Thêm địa chỉ giao hàng thành công!');
    }
  };

  const handlePlaceOrder = () => {
    if (selectedAddress === 'new') {
      if (!validateAddress()) {
        setIsAddingNewAddress(true);
        return;
      }
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      let finalAddress = null;
      if (selectedAddress === 'new') {
        finalAddress = {
          name: contactInfo.name,
          street: street,
          city: CITY_OPTIONS.find(o => o.value === city)?.label || city,
          state: STATE_OPTIONS.find(o => o.value === state)?.label || state,
          zip: '62704',
          country: 'United States'
        };
      } else {
        const addr = addresses.find(a => a.id === selectedAddress);
        if (addr) {
          finalAddress = {
            name: contactInfo.name,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zip: addr.zip,
            country: addr.country
          };
        }
      }
      
      const orderData = {
        shippingAddress: finalAddress,
        payment: {
          methodName: paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery (COD)',
          transactionId: paymentMethod === 'bank' ? 'TXN-' + Math.floor(Math.random() * 10000000) : 'N/A'
        }
      };
      
      toast.success('Đặt hàng thành công!');
      navigate('/order-confirmation', { state: { orderData } });
    }, 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[60%] space-y-6">
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                Contact Information
              </h2>
              {!isEditingContact && (
                <a className="text-primary text-sm font-medium hover:underline" href="#" onClick={handleEditContact}>Edit</a>
              )}
            </div>
            
            {isEditingContact ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                    <input 
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none transition-all text-slate-700 dark:text-slate-300" 
                      type="text" 
                      value={editContactForm.name}
                      onChange={(e) => setEditContactForm({...editContactForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                    <input 
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none transition-all text-slate-700 dark:text-slate-300" 
                      type="email" 
                      value={editContactForm.email}
                      onChange={(e) => setEditContactForm({...editContactForm, email: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Phone Number</label>
                    <input 
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none transition-all text-slate-700 dark:text-slate-300" 
                      type="tel" 
                      value={editContactForm.phone}
                      onChange={(e) => setEditContactForm({...editContactForm, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={handleCancelContact}
                    disabled={isSavingContact}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveContact}
                    disabled={isSavingContact}
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSavingContact ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-slate-600 dark:text-slate-400 text-sm animate-in fade-in duration-200">
                <p className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{contactInfo.name}</span></p>
                <p>{contactInfo.email}</p>
                <p>{contactInfo.phone}</p>
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {addresses.map((addr) => (
                <label key={addr.id} className="relative cursor-pointer">
                  <input 
                    className="peer sr-only" 
                    name="address" 
                    type="radio" 
                    value={addr.id} 
                    checked={selectedAddress === addr.id}
                    onChange={() => {
                      setSelectedAddress(addr.id);
                      setStreet('');
                      setCity('');
                      setState('');
                      setAddressErrors({});
                      setIsAddingNewAddress(false);
                    }}
                  />
                  <div className="h-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold">{addr.label}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary opacity-0 peer-checked:opacity-100"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {addr.street}<br />{addr.city}, {addr.state} {addr.zip}<br />{addr.country}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            
            {!isAddingNewAddress && addresses.length > 0 ? (
              <button 
                onClick={() => setIsAddingNewAddress(true)}
                className="w-full py-3 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add New Address
              </button>
            ) : (
              <div className={`animate-in fade-in slide-in-from-top-2 duration-200 ${addresses.length > 0 ? 'pt-6 border-t border-slate-100 dark:border-slate-800' : ''}`}>
                <p className="text-sm font-medium mb-4">Add New Address</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Street Address</label>
                    <input 
                      className={`w-full px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none transition-all text-slate-700 dark:text-slate-300 placeholder:text-slate-400 ${
                        addressErrors.street ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 
                        selectedAddress !== 'new' && selectedAddress !== null ? 'opacity-60 border-slate-200 dark:border-slate-700' : 'border-slate-200 dark:border-slate-700'
                      }`}
                      placeholder="e.g. 789 Oak Lane" 
                      type="text" 
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        setSelectedAddress('new');
                        if (addressErrors.street) setAddressErrors({...addressErrors, street: null});
                      }}
                      onFocus={() => setSelectedAddress('new')}
                    />
                    {addressErrors.street && <p className="text-red-500 text-xs mt-1.5">{addressErrors.street}</p>}
                  </div>
                  <div className={`grid grid-cols-2 gap-4 transition-opacity ${selectedAddress !== 'new' && selectedAddress !== null ? 'opacity-60' : ''}`}>
                    <div onClick={() => setSelectedAddress('new')}>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">City</label>
                      <div className={addressErrors.city ? "rounded-lg ring-1 ring-red-500" : ""}>
                        <CustomSelect 
                          placeholder="Select City"
                          value={city}
                          onChange={(val) => {
                            setCity(val);
                            setSelectedAddress('new');
                            if (addressErrors.city) setAddressErrors({...addressErrors, city: null});
                          }}
                          options={CITY_OPTIONS}
                        />
                      </div>
                      {addressErrors.city && <p className="text-red-500 text-xs mt-1.5">{addressErrors.city}</p>}
                    </div>
                    <div onClick={() => setSelectedAddress('new')}>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">District/State</label>
                      <div className={addressErrors.state ? "rounded-lg ring-1 ring-red-500" : ""}>
                        <CustomSelect 
                          placeholder="Select State"
                          value={state}
                          onChange={(val) => {
                            setState(val);
                            setSelectedAddress('new');
                            if (addressErrors.state) setAddressErrors({...addressErrors, state: null});
                          }}
                          options={STATE_OPTIONS}
                        />
                      </div>
                      {addressErrors.state && <p className="text-red-500 text-xs mt-1.5">{addressErrors.state}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    {addresses.length > 0 && (
                      <button 
                        onClick={() => {
                          setIsAddingNewAddress(false);
                          setAddressErrors({});
                        }}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      onClick={handleSaveNewAddress}
                      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Shipping Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <input 
                    className="radio-custom h-5 w-5 text-primary border-slate-300 focus:ring-primary" 
                    name="shipping" 
                    type="radio" 
                    checked={shippingFee === 5.00}
                    onChange={() => setShippingFee(5.00)}
                  />
                  <div>
                    <p className="text-sm font-medium">Standard Delivery</p>
                    <p className="text-xs text-slate-500">3-5 business days</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">$5.00</span>
              </label>
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <input 
                    className="radio-custom h-5 w-5 text-primary border-slate-300 focus:ring-primary" 
                    name="shipping" 
                    type="radio" 
                    checked={shippingFee === 15.00}
                    onChange={() => setShippingFee(15.00)}
                  />
                  <div>
                    <p className="text-sm font-medium">Express Delivery</p>
                    <p className="text-xs text-slate-500">Next business day</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">$15.00</span>
              </label>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              Payment Method
            </h2>
            <div className="space-y-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <input 
                  className="radio-custom h-5 w-5 text-primary border-slate-300 focus:ring-primary" 
                  name="payment" 
                  type="radio" 
                  value="cod" 
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span className="text-sm font-medium">Cash on Delivery (COD)</span>
              </label>
              <div className={`rounded-xl border-2 transition-all ${paymentMethod === 'bank' ? 'border-primary bg-primary/5 p-4' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 p-4'}`}>
                <label className={`flex items-center gap-3 cursor-pointer ${paymentMethod === 'bank' ? 'mb-4' : ''}`}>
                  <input 
                    className="radio-custom h-5 w-5 text-primary border-slate-300 focus:ring-primary" 
                    name="payment" 
                    type="radio" 
                    value="bank" 
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                  />
                  <span className="text-sm font-medium">Bank Transfer</span>
                </label>
                
                {paymentMethod === 'bank' && (
                  <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-6 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">Scan the QR code below using your banking app to complete the payment.</p>
                    <div className="w-40 h-40 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-400 opacity-20"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                    </div>
                    <p className="mt-4 text-xs font-mono text-slate-600 dark:text-slate-400">REF: FLX-98234-JD</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:w-[40%]">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700">
                        <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC91t2pyJhSgPheIcTraxnx_IjtORdtH6oV0njyzm5RsucG_oA25OZHAhomnuFVGw1w0_oFQngyUYEsKRGo-uLWoAHyf6MKLw-Ii7Z2Gid4g1i5Lj94_cyXAb8B9pXi6ZBHJJVjSgeJjiywcZ1XZesq8brYS5i43e8LeXLhgBdNqrFIJ8g01k5GpUjr3zoOWy4dBs6P-llGq1LXbshi4LBwqxb-cM2EQqEK7M_CL9qsxZHLazlOblBWj7s-4-TFAYFevg3v-CAw5lU" />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">1</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium">Premium Cotton Tee</h3>
                      <p className="text-xs text-slate-500">Size: M | Color: Black</p>
                      <p className="text-sm font-semibold mt-1">$45.00</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700">
                        <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUNGxlIRTXReW9Q9Yd7wIDeQYzzIhyh5ScKTqXgrBfJLJh706M2rcsnjwaDTvntmOrsdsAER5sUc7PvLYGPQ0chtoSg9AGgncSe5DF17gqSDfB-cSvI45M8xQMcOjCohW1q3Y3yUxsijLJsgy8E_AvExiwbjwXHJo-HUVuW6CghKFTyr3txOm4dalp5AeFpJbjQJX-NMU_8V2MgUuMktB9CZIDuTVQMeEIbje1W6rRm5mbFUb768GrIQEChIGLRuxY-pEOkUeP0E8" />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">1</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium">Hydrating Face Cream</h3>
                      <p className="text-xs text-slate-500">50ml | All Skin Types</p>
                      <p className="text-sm font-semibold mt-1">$32.00</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">$77.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Estimated Tax</span>
                    <span className="font-medium">$6.16</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span>Total</span>
                    <span className="text-primary">${(77.00 + shippingFee + 6.16).toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  {!isProcessing ? (
                    <button onClick={handlePlaceOrder} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3">
                      Place Order
                    </button>
                  ) : (
                    <button className="w-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-3 cursor-not-allowed" disabled>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                      </svg>
                      Processing...
                    </button>
                  )}
                  <p className="text-[10px] text-center text-slate-400 px-4">
                    By placing your order, you agree to Fluxify's Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">SSL Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">PCI Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
