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
    low: 'text-slate-400',
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
      className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all group relative overflow-hidden"
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
          <h3 className="text-base font-bold tracking-tight pt-2 line-clamp-1 text-slate-900 group-hover:text-brand-500 transition-colors">
            {complaint.title}
          </h3>
        </div>
        <div className="text-right">
           <p className={`text-[9px] font-bold uppercase tracking-widest ${urgencyConfig[complaint.urgency]}`}>
             {complaint.urgency} Priority
           </p>
           <p className="text-[10px] text-slate-400 font-medium">
             {formatDistanceToNow(new Date(complaint.created_at))} ago
           </p>
        </div>
      </div>

      <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed">
        {complaint.description}
      </p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1">
          {complaint.ai_confidence && (
            <div className="flex items-center gap-2">
               <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div 
                   className="bg-brand-500 h-full" 
                   style={{ width: `${complaint.ai_confidence * 100}%` }} 
                 />
               </div>
               <span className="text-[9px] font-bold text-slate-400">AI {Math.round(complaint.ai_confidence * 100)}%</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50 transition-colors text-slate-400 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
