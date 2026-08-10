'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
  children?: ReactNode;
}

const buttonBaseClass =
  'inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:pointer-events-none';

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm transition-all',
  secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm transition-all',
  glass: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all',
  outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all',
  ghost: 'hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all',
  destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm transition-all',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, asChild, children, ...props }, ref) => {
    const composedClassName = cn(
      buttonBaseClass,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    const content: ReactNode = isLoading ? (
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      children
    );

    // When asChild, render via Radix Slot (passes props down to direct child)
    if (asChild) {
      return (
        <Slot ref={ref} className={composedClassName} {...props}>
          {content}
        </Slot>
      );
    }

    // Default: render a motion.button with clean transitions (removed bouncy scale animations)
    const motionProps = props as HTMLMotionProps<'button'>;
    return (
      <motion.button
        ref={ref}
        className={composedClassName}
        {...motionProps}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
