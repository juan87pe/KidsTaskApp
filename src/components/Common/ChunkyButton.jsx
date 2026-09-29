import React from 'react';

export const ChunkyButton = ({
  children,
  onClick,
  variant = 'sky', // 'sky' | 'gold' | 'green' | 'coral' | 'slate' | 'ghost' | 'gray'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm font-semibold rounded-squircle-sm',
    md: 'px-5 py-2.5 text-base font-bold rounded-squircle-md',
    lg: 'px-7 py-3.5 text-lg font-bold rounded-squircle-lg'
  };

  const variantStyles = {
    sky: 'bg-[#88D1F1] text-[#1E3A5F] shadow-chunky-sky border-2 border-[#60A5FA] active:border-b-2',
    gold: 'bg-[#F6C877] text-[#78350F] shadow-chunky-gold border-2 border-[#F59E0B] active:border-b-2',
    green: 'bg-[#48BB78] text-white shadow-chunky-green border-2 border-[#2F855A] active:border-b-2',
    coral: 'bg-[#EF4444] text-white shadow-chunky-coral border-2 border-[#DC2626] active:border-b-2',
    slate: 'bg-[#1E3A5F] text-white shadow-chunky-slate border-2 border-[#0F172A] active:border-b-2',
    gray: 'bg-[#F1F5F9] text-[#475569] shadow-chunky-gray border-2 border-[#CBD5E1] active:border-b-2',
    ghost: 'bg-transparent text-[#1E3A5F] hover:bg-black/5 active:translate-y-0 shadow-none'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-chunky inline-flex items-center justify-center gap-2 cursor-pointer select-none transition-all ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.sky} ${
        disabled ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};
