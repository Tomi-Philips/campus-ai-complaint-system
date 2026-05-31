'use client';

import { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, labelClassName, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className={cn("text-sm font-semibold text-foreground/60 ml-1", labelClassName)}>
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={cn(
            'w-full bg-white/5 border border-border rounded-xl px-4 py-3 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-foreground/30',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
