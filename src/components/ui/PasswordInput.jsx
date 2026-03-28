import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ label, id, name, value, onChange, placeholder = '••••••••', className = '' }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700" htmlFor={id || name}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className="block w-full rounded-xl border-slate-200 bg-[#f6f6f8] text-slate-900 focus:border-[#1754cf] focus:ring-1 focus:ring-[#1754cf] outline-none transition-all px-4 py-3 pr-12 border"
          id={id || name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1754cf] transition-colors focus:outline-none"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
