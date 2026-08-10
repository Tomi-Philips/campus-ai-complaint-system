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

interface SettingItem {
  label: string;
  desc: string;
  value: string;
  icon: any;
  type: string;
  active?: boolean;
  onChange?: (value: boolean) => void;
  options?: string[];
  buttonText?: string;
}

interface SettingSection {
  title: string;
  icon: any;
  items: SettingItem[];
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  const sections: SettingSection[] = [
    {
      title: 'Preferences',
      icon: Palette,
      items: [
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
          <Badge variant="primary" className="flex gap-2">
            Settings
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
          Settings
        </h1>
        <p className="text-slate-500 text-xs md:text-sm">
          Configure your campus experience and notification preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 px-1">
              <section.icon className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </h3>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-brand-500 w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm md:text-base">{item.label}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 min-w-[140px]">
                    {item.type === 'toggle' ? (
                      <>
                        <span className={`text-xs font-semibold ${item.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {item.value}
                        </span>
                        <button
                          onClick={() => item.onChange?.(!item.active)}
                          className={`relative w-10 h-5 rounded-full transition-all duration-200 ${item.active ? 'bg-brand-500' : 'bg-slate-200'
                            }`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${item.active ? 'right-0.5' : 'left-0.5'
                            }`} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold px-2.5 py-1">
                          {item.value}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(item.buttonText || item.label)}
                          className="h-7 px-3 text-[10px] font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg"
                        >
                          {item.buttonText || 'Change'}
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
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-red-200 overflow-hidden shadow-sm"
      >
        <div className="bg-red-50/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h4 className="font-bold text-red-800 text-sm">Danger Zone</h4>
          </div>
          <p className="text-xs text-slate-500 mb-4 pl-11">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="destructive"
            className="rounded-lg h-9 px-4 text-xs font-bold ml-11 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              toast((t) => (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-slate-800">Are you absolutely sure?</p>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        toast.error('Account deletion feature coming soon');
                      }}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs"
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
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all text-sm shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          Help Center
        </button>
        <button
          onClick={() => handleAction('Logout')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm shadow-sm"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}