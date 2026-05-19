import React from 'react';
import { useStorefrontConfig } from '../../features/theme/useStorefrontConfig';

export default function Checkbox({ id, name, checked, onChange, label, children, className = '' }) {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <div className="flex h-5 items-center">
        <input
          className="h-4 w-4 rounded border-slate-300 cursor-pointer focus:ring-transparent"
          id={id || name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ accentColor: primaryColor }}
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
