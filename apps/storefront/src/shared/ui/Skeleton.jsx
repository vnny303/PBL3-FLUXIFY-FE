import React from 'react';

/**
 * Skeleton Component
 * Provides a shimmering loading effect for better perceived performance.
 * 
 * @param {string} className - Additional CSS classes for custom sizing/shaping
 * @param {string} variant - 'rect' (default), 'circle', or 'text'
 */
const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800';
  
  const variantClasses = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4 w-full mb-2',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.rect} ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
