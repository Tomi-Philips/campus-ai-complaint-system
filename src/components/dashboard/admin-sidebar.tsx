'use client';

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Tags, 
  Megaphone, 
  BarChart3,
  Users,
  Settings, 
  LogOut,
  Zap,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Activity,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { signOut } from '@/app/(auth)/actions';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard', description: 'Key metrics & insights' },
  { icon: MessageSquare, label: 'Complaints', href: '/admin/complaints', description: 'Manage & resolve' },
  { icon: Tags, label: 'AI Categories', href: '/admin/categories', description: 'Train & configure' },
  { icon: Megaphone, label: 'Announcements', href: '/admin/announcements', description: 'Broadcast to campus' },
];

const analyticItems = [
  { icon: BarChart3, label: 'AI Insights', href: '/admin/analytics', description: 'Performance analytics' },
  { icon: Users, label: 'Users', href: '/admin/users', description: 'Manage accounts' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-slate-300">
      {/* Logo Section */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/30">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight leading-none text-white">
              Admin Portal
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 mt-1">
              Campus AI v2.0
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6">
        {/* Management Section */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Core Management
            </p>
          </div>
          <div className="space-y-1">
            {adminMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150',
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon className={cn('w-4 h-4', isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300')} />
                  <span className="text-sm flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Intelligence Section */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Intelligence Hub
            </p>
          </div>
          <div className="space-y-1">
            {analyticItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150',
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon className={cn('w-4 h-4', isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300')} />
                  <span className="text-sm flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 space-y-1 border-t border-white/10">
        {/* Sign Out Button */}
        <button
          onClick={() => signOut()}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
          <span className="text-sm">Sign Out</span>
        </button>

        {/* Version Info */}
        <div className="px-3 pt-4">
          <p className="text-[8px] text-slate-600 text-center">
            © 2024 Campus AI | v2.0.0
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 transition-all duration-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 flex-col bg-[#13151f] border-r border-white/[0.07] shadow-2xl">
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 z-[70] w-80 h-screen bg-[#13151f] border-r border-white/[0.07] shadow-2xl"
            >
              <div className="relative h-full overflow-y-auto p-5 custom-scrollbar">
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-400 hover:text-white transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="mt-2">
                  <SidebarContent />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}