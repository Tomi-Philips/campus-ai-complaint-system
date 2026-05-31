'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}


const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, asChild, children, ...props }, ref) => {
    const Component = asChild ? Slot : motion.button;
    
    const variants = {
      primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20',
      secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20',
      glass: 'glass hover:bg-white/5',
      outline: 'border border-border hover:bg-white/5',
      ghost: 'hover:bg-white/5 text-foreground/60 hover:text-foreground',
      destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    };


    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-5 py-2.5 rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
    };

    return (
      <Component
        ref={ref}
        {...(!asChild && {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 }
        })}
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >

        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          children
        )}
      </Component>
    );
  }
);


Button.displayName = 'Button';

export { Button };
