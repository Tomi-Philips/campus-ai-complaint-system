'use client';

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Lightbulb, 
  Megaphone, 
  Settings, 
  User,
  LogOut,
  Zap,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle
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
];

const secondaryItems = [
  { icon: User, label: 'Profile', href: '/profile', description: 'Personal info' },
  { icon: Settings, label: 'Settings', href: '/settings', description: 'Preferences' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl blur-lg opacity-50" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
              <Zap className="text-white w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Campus AI
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-brand-400">
              Student Portal
            </span>
          </div>
        </div>
      </div>

      {/* User Status Indicator */}
      <div className="mb-6 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
            Active Session
          </span>
          <Shield className="w-3 h-3 text-emerald-400 ml-auto" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-6">
        <div>
          <div className="flex items-center gap-2 px-3 mb-3">
            <div className="w-1 h-3 rounded-full bg-brand-500" />
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
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
                  onMouseEnter={() => setIsHovered(item.href)}
                  onMouseLeave={() => setIsHovered(null)}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive 
                      ? 'bg-gradient-to-r from-brand-500/20 to-accent-500/20 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-6 bg-gradient-to-b from-brand-500 to-accent-500 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <item.icon className={cn('w-4 h-4', isActive ? 'text-brand-400' : 'group-hover:scale-110 transition-transform')} />
                  <span className="text-sm font-semibold flex-1">{item.label}</span>
                  
                  {!isActive && isHovered === item.href && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[9px] text-slate-500"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Section */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-3">
            <div className="w-1 h-3 rounded-full bg-accent-500" />
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
              System
            </p>
            <Sparkles className="w-3 h-3 text-accent-400 ml-auto" />
          </div>
          <div className="space-y-1">
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive 
                      ? 'bg-gradient-to-r from-accent-500/20 to-purple-500/20 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabSystem"
                      className="absolute left-0 w-1 h-6 bg-gradient-to-b from-accent-500 to-purple-500 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <item.icon className={cn('w-4 h-4', isActive ? 'text-accent-400' : 'group-hover:scale-110 transition-transform')} />
                  <span className="text-sm font-semibold flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="pt-4 px-3">
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-3 h-3 text-brand-400" />
              <span className="text-[9px] font-black uppercase text-slate-500">Notifications</span>
            </div>
            <p className="text-[10px] text-slate-400">
              You have <span className="text-brand-400 font-bold">2</span> unread announcements
            </p>
            <div className="mt-2 w-full bg-slate-700 h-1 rounded-full overflow-hidden">
              <div className="w-[40%] h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full" />
            </div>
          </div>
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 space-y-2">
        {/* Help Button */}
        <button 
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all duration-200"
          onClick={() => window.location.href = '/help'}
        >
          <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold">Help & Support</span>
        </button>
        
        {/* Sign Out Button */}
        <button 
          onClick={() => signOut()}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>

        {/* Version Info */}
        <div className="px-3 pt-4">
          <p className="text-[8px] text-slate-600 text-center">
            Campus AI v2.0.0
          </p>
          <p className="text-[8px] text-slate-700 text-center mt-0.5">
            © 2024 All rights reserved
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-700 shadow-lg text-slate-400 hover:text-brand-400 transition-all duration-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 flex-col bg-slate-950/95 backdrop-blur-xl border-r border-slate-800 shadow-2xl shadow-black/50 overflow-y-auto custom-scrollbar">
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
              className="lg:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 z-[70] w-80 h-screen bg-slate-950 border-r border-slate-800 shadow-2xl overflow-y-auto custom-scrollbar"
            >
              <div className="relative h-full p-5">
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 z-10 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200"
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