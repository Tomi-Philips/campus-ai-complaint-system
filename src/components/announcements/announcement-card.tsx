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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-[32px] overflow-hidden group hover:border-brand-500/30 transition-all shadow-2xl"
    >
      {announcement.banner_url && (
        <div className="h-48 w-full overflow-hidden relative">
          <img 
            src={announcement.banner_url} 
            alt={announcement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
        </div>
      )}

      <div className="p-8 space-y-4">
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
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
            {formatDistanceToNow(new Date(announcement.created_at))} ago
          </p>
        </div>

        <h3 className="text-2xl font-black tracking-tight group-hover:text-brand-500 transition-colors leading-tight">
          {announcement.title}
        </h3>

        <p className="text-foreground/60 font-medium leading-relaxed line-clamp-3">
          {announcement.content}
        </p>

        <div className="pt-4 flex items-center justify-between">
           <button className="text-sm font-black text-brand-500 flex items-center gap-2 hover:gap-3 transition-all">
             Read Full Update
             <ExternalLink className="w-4 h-4" />
           </button>
           <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-white/10" />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-background bg-brand-500 flex items-center justify-center text-[10px] font-black text-white">
                +12
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
