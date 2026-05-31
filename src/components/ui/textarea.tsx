'use client';

import { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, labelClassName, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className={cn("text-sm font-semibold text-foreground/60 ml-1", labelClassName)}>
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            'w-full bg-white/5 border border-border rounded-2xl px-4 py-3 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-foreground/30 min-h-[120px] resize-none',
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

Textarea.displayName = 'Textarea';

export { Textarea };
