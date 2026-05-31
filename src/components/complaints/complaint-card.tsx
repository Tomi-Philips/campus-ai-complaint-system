'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    description: string;
    status: string;
    urgency: string;
    created_at: string;
    categories?: { name: string };
    ai_confidence?: number;
  };
  viewMode?: 'grid' | 'list';
}

export function ComplaintCard({ complaint, viewMode = 'grid' }: ComplaintCardProps) {
  const statusConfig = {
    pending: { label: 'Pending', icon: Clock, variant: 'warning' },
    'under-review': { label: 'In Review', icon: AlertCircle, variant: 'primary' },
    resolved: { label: 'Resolved', icon: CheckCircle2, variant: 'success' },
    duplicate: { label: 'Duplicate', icon: AlertCircle, variant: 'outline' },
  } as any;

  const urgencyConfig = {
    low: 'text-foreground/40',
    medium: 'text-amber-500',
    high: 'text-orange-500',
    critical: 'text-red-500',
  } as any;

  const config = statusConfig[complaint.status] || statusConfig.pending;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-3xl hover:border-brand-500/30 transition-all group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant} className="gap-1 flex items-center">
              <config.icon className="w-3 h-3" />
              {config.label}
            </Badge>
            {complaint.categories && (
              <Badge variant="glass">{complaint.categories.name}</Badge>
            )}
          </div>
          <h3 className="text-xl font-bold tracking-tight pt-2 line-clamp-1 group-hover:text-brand-500 transition-colors">
            {complaint.title}
          </h3>
        </div>
        <div className="text-right">
           <p className={`text-[10px] font-black uppercase tracking-widest ${urgencyConfig[complaint.urgency]}`}>
             {complaint.urgency} Priority
           </p>
           <p className="text-[10px] text-foreground/40 font-medium">
             {formatDistanceToNow(new Date(complaint.created_at))} ago
           </p>
        </div>
      </div>

      <p className="text-sm text-foreground/60 line-clamp-2 mb-6 font-medium leading-relaxed">
        {complaint.description}
      </p>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1">
          {complaint.ai_confidence && (
            <div className="flex items-center gap-2">
               <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className="bg-brand-500 h-full" 
                   style={{ width: `${complaint.ai_confidence * 100}%` }} 
                 />
               </div>
               <span className="text-[10px] font-black text-foreground/30">AI {Math.round(complaint.ai_confidence * 100)}%</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-white/5 transition-colors text-foreground/40 hover:text-foreground">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl hover:bg-red-500/10 transition-colors text-foreground/40 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
