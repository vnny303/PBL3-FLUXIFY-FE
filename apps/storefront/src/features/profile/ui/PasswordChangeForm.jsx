import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function PasswordChangeForm({ 
  formData, 
  errors, 
  onChange, 
  onSave, 
  isSaving, 
  primaryColor, 
  borderRadius,
  sectionBg
}) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold">Change Password</h2>
      </div>
      <div className="p-6 max-w-lg">
        <div className="flex flex-col gap-5">
          <PasswordInput 
            label="Current Password"
            name="currentPassword"
            value={formData.currentPassword}
            error={errors.currentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
            onChange={onChange}
            primaryColor={primaryColor}
          />
          <PasswordInput 
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            error={errors.newPassword}
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
            onChange={onChange}
            primaryColor={primaryColor}
          />
          <PasswordInput 
            label="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
            onChange={onChange}
            primaryColor={primaryColor}
          />
        </div>
      </div>
      <div className="px-6 py-4 flex justify-end" style={{ backgroundColor: sectionBg }}>
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="text-white font-bold py-2.5 px-6 text-sm transition-all shadow-sm hover:brightness-110 flex items-center gap-2"
          style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          Update Password
        </button>
      </div>
    </div>
  );
}

function PasswordInput({ label, name, value, error, show, onToggle, onChange, primaryColor }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <div className="relative">
        <input 
          type={show ? "text" : "password"} 
          name={name}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-all ${error ? 'border border-red-500 focus:ring-1 focus:ring-red-500' : 'border border-slate-200 dark:border-slate-700 focus:ring-2'}`} 
          style={!error ? { '--tw-ring-color': primaryColor } : {}}
        />
        <button 
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
