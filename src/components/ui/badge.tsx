'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'glass';
  className?: string;
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variants = {
    primary: 'bg-brand-500/10 text-brand-500 border-brand-500/20',
    secondary: 'bg-accent-500/10 text-accent-500 border-accent-500/20',
    outline: 'border-border text-foreground/60',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    glass: 'glass text-foreground/80',
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
