'use client';

import { useState, useEffect } from 'react';
import { complaintService } from '@/lib/services/complaint.service';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  History,
  Clock,
  CheckCircle2,
  ChevronRight,
  Zap,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StudentComplaintsLandingPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await complaintService.getMyComplaints();
        setComplaints(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'under-review').length,
  };

  const resolutionRate = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" className="flex gap-2">
              <MessageSquare className="w-3 h-3" />
              Complaint Center
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
            My Complaints
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Track your reported issues and resolution progress
          </p>
        </div>
        <Button
          className="gap-2 h-11 px-5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 shadow-sm"
          asChild
        >
          <Link href="/complaints/create">
            <Plus className="w-4 h-4" />
            New Complaint
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Submitted', value: stats.total, icon: MessageSquare, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
          { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, iconColor: 'text-amber-500', iconBg: 'bg-amber-50' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, iconColor: 'text-purple-500', iconBg: 'bg-purple-50' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center mb-3`}>
              <item.icon className={`${item.iconColor} w-5 h-5`} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
            <p className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Resolution Rate Card */}
      {stats.total > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-brand-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Resolution Rate</p>
                <p className="text-2xl font-extrabold text-slate-900">{resolutionRate}%</p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>{stats.resolved} of {stats.total} resolved</span>
                <span>{resolutionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${resolutionRate}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="bg-brand-500 h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 md:p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <History className="w-4 h-4 text-brand-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
          </div>
          <Link
            href="/complaints/history"
            className="text-[10px] font-bold uppercase tracking-wider text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1"
          >
            View Full History
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 md:p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No complaints yet</p>
              <p className="text-xs text-slate-400 mt-1">Submit your first complaint to get started</p>
              <Link href="/complaints/create" className="mt-4">
                <Button variant="outline" size="sm" className="gap-1 rounded-lg bg-white">
                  <Plus className="w-3 h-3" />
                  New Complaint
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.slice(0, 5).map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/complaints/history?id=${comp.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all duration-200 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <Badge
                          variant={comp.status === 'resolved' ? 'success' : comp.status === 'under-review' ? 'warning' : 'outline'}
                          className="text-[8px] font-bold uppercase tracking-wider py-0.5 px-2"
                        >
                          {comp.status === 'under-review' ? 'In Progress' : comp.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-slate-400" />
                          <span className="text-[9px] text-slate-400 font-medium">
                            {new Date(comp.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-1">
                        {comp.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                        {comp.categories?.name || 'Uncategorized'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-4">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {complaints.length > 0 && (
          <div className="border-t border-slate-100 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 flex items-center gap-1">
                <MessageSquare className="w-2.5 h-2.5" />
                Total complaints
              </span>
              <span className="text-slate-700 font-bold">{complaints.length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}