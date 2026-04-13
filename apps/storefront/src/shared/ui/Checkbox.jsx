import React from 'react';

export default function Checkbox({ id, name, checked, onChange, label, children, className = '' }) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <div className="flex h-5 items-center">
        <input
          className="h-4 w-4 rounded border-slate-300 text-[#1754cf] focus:ring-[#1754cf] cursor-pointer"
          id={id || name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
      </div>
      <div className="text-sm text-slate-500 flex-1">
        {label && (
          <label className="cursor-pointer select-none font-medium text-slate-700" htmlFor={id || name}>
            {label}
          </label>
        )}
        {children && (
          <label htmlFor={id || name} className="cursor-pointer select-none">
            {children}
          </label>
        )}
      </div>
    </div>
  );
}
