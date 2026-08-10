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
    primary:   'bg-brand-50  text-brand-600  border-brand-200',
    secondary: 'bg-violet-50 text-violet-600 border-violet-200',
    outline:   'bg-slate-50  text-slate-600  border-slate-300',
    success:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning:   'bg-amber-50  text-amber-700  border-amber-200',
    error:     'bg-red-50    text-red-600    border-red-200',
    glass:     'bg-slate-100 text-slate-700  border-slate-200',
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
