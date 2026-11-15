import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium tracking-wide text-[#111111] uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-3.5 py-2 text-sm bg-white border rounded-[8px] transition-colors duration-150',
            'border-[#E8E8E4] text-[#111111] placeholder:text-[#A0A09C]',
            'focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]',
            error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#EF4444]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6B6B6B]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
