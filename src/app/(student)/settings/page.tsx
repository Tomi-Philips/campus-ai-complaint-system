'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Moon,
  Smartphone,
  Shield,
  Palette,
  Volume2,
  ChevronRight,
  Sparkles,
  Globe,
  CreditCard,
  HelpCircle,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  const sections = [
    {
      title: 'Preferences',
      icon: Palette,
      items: [
        {
          label: 'Dark Mode',
          desc: 'Toggle between light and dark themes',
          value: darkMode ? 'Enabled' : 'Disabled',
          icon: Moon,
          type: 'toggle',
          active: darkMode,
          onChange: setDarkMode
        },
        {
          label: 'Interface Scale',
          desc: 'Adjust UI element sizing for comfort',
          value: 'Default',
          icon: Smartphone,
          type: 'select',
          options: ['Compact', 'Default', 'Comfortable']
        },
        {
          label: 'Animations',
          desc: 'Enable smooth UI transitions',
          value: 'Enabled',
          icon: Sparkles,
          type: 'toggle',
          active: true,
        },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          desc: 'Real-time alerts for complaints and updates',
          value: notifications ? 'Active' : 'Muted',
          icon: Bell,
          type: 'toggle',
          active: notifications,
          onChange: setNotifications
        },
        {
          label: 'Email Reports',
          desc: 'Weekly summaries of campus activity',
          value: 'Disabled',
          icon: Volume2,
          type: 'toggle',
          active: false,
        },
        {
          label: 'Complaint Updates',
          desc: 'Get notified when your complaint status changes',
          value: 'Enabled',
          icon: Bell,
          type: 'toggle',
          active: true,
        },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          label: 'Privacy Mode',
          desc: 'Hide sensitive activity from history',
          value: privacyMode ? 'Enabled' : 'Standard',
          icon: Eye,
          type: 'toggle',
          active: privacyMode,
          onChange: setPrivacyMode
        },
        {
          label: 'Two-Factor Authentication',
          desc: 'Add an extra layer of security',
          value: 'Disabled',
          icon: Lock,
          type: 'button',
          buttonText: 'Setup'
        },
        {
          label: 'Session Management',
          desc: 'View and manage active sessions',
          value: '1 active',
          icon: Smartphone,
          type: 'button',
          buttonText: 'Manage'
        },
      ]
    },
    {
      title: 'Data & Storage',
      icon: Globe,
      items: [
        {
          label: 'Data Export',
          desc: 'Download all your personal data',
          value: 'GDPR Compliant',
          icon: Globe,
          type: 'button',
          buttonText: 'Export'
        },
        {
          label: 'Clear Cache',
          desc: 'Remove locally stored data',
          value: 'Last cleared never',
          icon: Settings,
          type: 'button',
          buttonText: 'Clear'
        },
      ]
    },
  ];

  const handleAction = (action: string) => {
    toast.success(`${action} feature coming soon`);
  };

  return (
    <div className="max-w-5xl space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="glass" className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20 flex gap-2">
            <Settings className="w-3 h-3 mr-1" />
            Configuration
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-400 font-medium text-sm md:text-base">
          Configure your intelligent campus experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 px-1">
              <section.icon className="w-3.5 h-3.5 text-brand-400" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                {section.title}
              </h3>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden divide-y divide-slate-700/50">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                      <item.icon className="text-brand-400 w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm md:text-base">{item.label}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 min-w-[140px]">
                    {item.type === 'toggle' ? (
                      <>
                        <span className={`text-xs font-semibold ${item.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {item.value}
                        </span>
                        <button
                          onClick={() => item.onChange?.(!item.active)}
                          className={`relative w-10 h-5 rounded-full transition-all duration-200 ${item.active ? 'bg-gradient-to-r from-brand-500 to-brand-600' : 'bg-slate-700'
                            }`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${item.active ? 'right-0.5' : 'left-0.5'
                            }`} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Badge variant="glass" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] font-bold px-2.5 py-1">
                          {item.value}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction((item as any).buttonText || item.label)}
                          className="h-7 px-3 text-[10px] font-black uppercase tracking-wider text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 rounded-lg"
                        >
                          {(item as any).buttonText || 'Change'}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-red-500/20 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h4 className="font-bold text-red-400 text-sm">Danger Zone</h4>
          </div>
          <p className="text-xs text-slate-400 mb-4 pl-11">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="destructive"
            className="rounded-lg h-10 px-4 text-xs font-bold ml-11 bg-red-500 hover:bg-red-600"
            onClick={() => {
              toast((t) => (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">Are you absolutely sure?</p>
                  <p className="text-xs text-slate-400">This action cannot be undone.</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="px-3 py-1 rounded-lg bg-slate-700 text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        toast.error('Account deletion feature coming soon');
                      }}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ), { duration: 5000 });
            }}
          >
            Delete Account
          </Button>
        </div>
      </motion.div>

      {/* Support Section */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
        <button
          onClick={() => handleAction('Help Center')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
        >
          <HelpCircle className="w-4 h-4" />
          Help Center
        </button>
        <button
          onClick={() => handleAction('Logout')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}