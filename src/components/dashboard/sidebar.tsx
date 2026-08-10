'use client';

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Lightbulb, 
  Megaphone, 
  User,
  LogOut,
  Zap,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { signOut } from '@/app/(auth)/actions';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', description: 'Overview & stats' },
  { icon: MessageSquare, label: 'Complaints', href: '/complaints', description: 'Submit & track' },
  { icon: Lightbulb, label: 'Suggestions', href: '/suggestions', description: 'Share ideas' },
  { icon: Megaphone, label: 'Announcements', href: '/announcements', description: 'Campus updates' },
  { icon: User, label: 'Profile', href: '/profile', description: 'Personal info' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-slate-700">
      {/* Logo Section */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shadow-sm">
            <Zap className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900">
              Campus AI
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              Student Portal
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-6">
        <div>
          <div className="flex items-center gap-2 px-3 mb-2">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>
          </div>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150',
                    isActive 
                      ? 'bg-slate-100 text-slate-900 font-semibold' 
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  )}
                >
                  <item.icon className={cn('w-4 h-4', isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600')} />
                  <span className="text-sm flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 space-y-1">
        {/* Sign Out Button */}
        <button 
          onClick={() => signOut()}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
          <span className="text-sm">Sign Out</span>
        </button>

        {/* Version Info */}
        <div className="px-3 pt-4">
          <p className="text-[8px] text-slate-400 text-center">
            Campus AI v2.0.0
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
      <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 flex-col bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar">
        <div className="flex-1 p-5">
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
              className="lg:hidden fixed left-0 top-0 z-[70] w-80 h-screen bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar"
            >
              <div className="relative h-full p-5">
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 z-10 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all duration-200"
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