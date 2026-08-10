'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Megaphone, 
  Calendar, 
  Pin, 
  AlertTriangle, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    type: string;
    is_pinned: boolean;
    created_at: string;
    banner_url?: string;
  };
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const typeConfig = {
    general: { label: 'General', icon: Megaphone, variant: 'primary' },
    academic: { label: 'Academic', icon: Calendar, variant: 'secondary' },
    emergency: { label: 'Emergency', icon: AlertTriangle, variant: 'error' },
    maintenance: { label: 'Maintenance', icon: Clock, variant: 'warning' },
    event: { label: 'Event', icon: Calendar, variant: 'success' },
  } as any;

  const config = typeConfig[announcement.type] || typeConfig.general;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:border-slate-300 transition-all shadow-sm"
    >
      {announcement.banner_url && (
        <div className="h-48 w-full overflow-hidden relative">
          <img 
            src={announcement.banner_url} 
            alt={announcement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-60" />
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant} className="gap-1.5 flex items-center py-1 px-3">
              <config.icon className="w-3.5 h-3.5" />
              {config.label}
            </Badge>
            {announcement.is_pinned && (
              <Badge variant="glass" className="gap-1.5 flex items-center py-1 px-3 text-brand-500 border-brand-500/20">
                <Pin className="w-3.5 h-3.5 fill-brand-500" />
                Pinned
              </Badge>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {formatDistanceToNow(new Date(announcement.created_at))} ago
          </p>
        </div>

        <h3 className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-500 transition-colors leading-tight">
          {announcement.title}
        </h3>

        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
          {announcement.content}
        </p>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
           <button className="text-xs font-bold text-brand-500 flex items-center gap-1.5 hover:text-brand-600 transition-all">
             Read Full Update
             <ExternalLink className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
