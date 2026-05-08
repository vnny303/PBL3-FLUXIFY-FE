import React from 'react';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function PersonalInfoForm({ 
  formData, 
  errors, 
  onChange, 
  onSave, 
  isSaving, 
  userEmail,
  primaryColor, 
  borderRadius,
  sectionBg
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold">Personal Information</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup 
            label="First Name" 
            name="firstName" 
            value={formData.firstName} 
            error={errors.firstName} 
            onChange={onChange} 
            primaryColor={primaryColor} 
          />
          <InputGroup 
            label="Last Name" 
            name="lastName" 
            value={formData.lastName} 
            error={errors.lastName} 
            onChange={onChange} 
            primaryColor={primaryColor} 
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                value={userEmail || ''}
                disabled
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed outline-none" 
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>
          </div>
          <InputGroup 
            label="Phone Number" 
            name="phone" 
            type="tel"
            value={formData.phone} 
            error={errors.phone} 
            onChange={onChange} 
            primaryColor={primaryColor} 
          />
        </div>
      </div>
      <div className="px-6 py-4 flex justify-end" style={{ backgroundColor: sectionBg }}>
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="text-white font-bold py-2.5 px-6 text-sm transition-all shadow-sm flex items-center justify-center gap-2 hover:brightness-110"
          style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}

function InputGroup({ label, name, value, error, onChange, type = "text", primaryColor }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${error ? 'border border-red-500 focus:ring-1 focus:ring-red-500' : 'border border-slate-200 dark:border-slate-700 focus:ring-2'}`} 
        style={!error ? { '--tw-ring-color': primaryColor } : {}}
      />
      {error && (
        <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
