import React from 'react';

export const GlassCard = ({
  children,
  variant = 'white', // 'white' | 'gold' | 'sky' | 'slate'
  className = '',
  onClick
}) => {
  const variants = {
    white: 'card-squircle',
    gold: 'card-squircle-gold',
    sky: 'card-squircle-sky',
    slate: 'rounded-squircle-lg bg-[#1E3A5F] text-white border-2 border-[#2D4B73] shadow-floating'
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 transition-all duration-200 ${variants[variant] || variants.white} ${
        onClick ? 'cursor-pointer hover:shadow-floating-hover hover:-translate-y-0.5 active:translate-y-0' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
