import React from 'react';

export default function Input({ label, id, name, type = 'text', value, onChange, placeholder, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700" htmlFor={id || name}>
          {label}
        </label>
      )}
      <input
        className="block w-full rounded-xl border-slate-200 bg-[#f6f6f8] text-slate-900 focus:border-[#1754cf] focus:ring-1 focus:ring-[#1754cf] outline-none transition-all px-4 py-3 border"
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
