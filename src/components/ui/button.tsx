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
  primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20',
  secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20',
  glass: 'glass hover:bg-white/5',
  outline: 'border border-border hover:bg-white/5',
  ghost: 'hover:bg-white/5 text-foreground/60 hover:text-foreground',
  destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
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

    // Default: render a motion.button with micro-animations.
    // Cast is safe: ButtonHTMLAttributes is structurally compatible with HTMLMotionProps at runtime.
    const motionProps = props as HTMLMotionProps<'button'>;
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
