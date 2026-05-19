import React, { useState } from 'react';
import { useStorefrontConfig } from '../../features/theme/useStorefrontConfig';

export default function Input({ label, id, name, type = 'text', value, onChange, placeholder, className = '' }) {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700" htmlFor={id || name}>
          {label}
        </label>
      )}
      <input
        className="block w-full rounded-xl border-slate-200 bg-[#f6f6f8] text-slate-900 outline-none transition-all px-4 py-3 border"
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          borderColor: isFocused ? primaryColor : undefined,
          boxShadow: isFocused ? `0 0 0 1px ${primaryColor}` : undefined
        }}
      />
    </div>
  );
}
