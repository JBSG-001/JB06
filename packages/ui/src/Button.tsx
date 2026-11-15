import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const variants = {
    primary:
      'bg-[#111111] text-white hover:bg-black focus:ring-[#111111] shadow-sm',
    gold:
      'bg-[#B8912F] text-white hover:bg-[#967422] focus:ring-[#B8912F] shadow-sm',
    secondary:
      'bg-[#F0F0EC] text-[#111111] hover:bg-[#E8E8E4] focus:ring-[#111111]',
    outline:
      'border border-[#E8E8E4] bg-white text-[#111111] hover:bg-[#FAFAF8] focus:ring-[#111111]',
    ghost:
      'bg-transparent text-[#111111] hover:bg-[#F0F0EC] focus:ring-[#111111]',
    danger:
      'bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-full',
    md: 'text-sm px-5 py-2.5 rounded-full',
    lg: 'text-base px-7 py-3.5 rounded-full',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
