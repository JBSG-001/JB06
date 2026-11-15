import React from 'react';
import clsx from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'new' | 'low-stock' | 'restock' | 'limited' | 'atelier' | 'in-stock' | 'out' | 'gold' | 'default';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium tracking-wider uppercase rounded-full';

  const variants = {
    default: 'bg-[#F0F0EC] text-[#6B6B6B]',
    new: 'bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8]',
    'low-stock': 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]',
    restock: 'bg-[#F4F4F2] text-[#4A4A48] border border-[#E8E8E4]',
    limited: 'bg-[#111111] text-[#D4AF37]',
    atelier: 'bg-[#111111] text-white',
    'in-stock': 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]',
    out: 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]',
    gold: 'bg-[#B8912F] text-white',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
