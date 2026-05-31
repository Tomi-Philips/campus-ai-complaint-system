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
  AlertCircle,
  ChevronRight,
  Zap,
  Sparkles,
  Shield,
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
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
  };

  const resolutionRate = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <MessageSquare className="w-3 h-3 mr-1" />
              Complaint Center
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            My Complaints
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Track your reported issues and resolution progress
          </p>
        </div>
        <Button
          className="gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25"
          asChild
        >
          <Link href="/complaints/create">
            <Plus className="w-4 h-4" />
            New Complaint
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Submitted', value: stats.total, icon: MessageSquare, gradient: 'from-blue-500 to-blue-600', bgGlow: 'blue' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-600', bgGlow: 'emerald' },
          { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, gradient: 'from-amber-500 to-amber-600', bgGlow: 'amber' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, gradient: 'from-purple-500 to-purple-600', bgGlow: 'purple' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            <div className="flex items-start justify-between relative z-10">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                <item.icon className="text-white w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{item.label}</p>
              <p className="text-2xl md:text-3xl font-black text-white mt-1">{item.value}</p>
            </div>

            <div className={`absolute -right-6 -bottom-6 w-20 h-20 bg-${item.bgGlow}-500/10 rounded-full blur-2xl`} />
          </motion.div>
        ))}
      </div>

      {/* Resolution Rate Card */}
      {stats.total > 0 && (
        <div className="bg-gradient-to-r from-brand-500/5 to-accent-500/5 rounded-xl border border-brand-500/10 p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Resolution Rate</p>
                <p className="text-2xl font-black text-white">{resolutionRate}%</p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span>{stats.resolved} of {stats.total} resolved</span>
                <span>{resolutionRate}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${resolutionRate}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent History Section */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 md:p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <History className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-white">Recent Activity</h3>
          </div>
          <Link
            href="/complaints/history"
            className="text-[10px] font-black uppercase tracking-wider text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
          >
            View Full History
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 md:p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-slate-800/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-sm font-semibold text-slate-400">No complaints yet</p>
              <p className="text-xs text-slate-500 mt-1">Submit your first complaint to get started</p>
              <Link href="/complaints/create" className="mt-4">
                <Button variant="glass" size="sm" className="gap-1 rounded-lg">
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-200 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <Badge
                          variant={comp.status === 'resolved' ? 'success' : comp.status === 'in_progress' ? 'warning' : 'outline'}
                          className="text-[8px] font-black uppercase tracking-wider py-0.5 px-2"
                        >
                          {comp.status === 'in_progress' ? 'In Progress' : comp.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-slate-500" />
                          <span className="text-[9px] text-slate-500 font-medium">
                            {new Date(comp.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm md:text-base text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                        {comp.title}
                      </h4>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-400 mt-1">
                        {comp.categories?.name || 'Uncategorized'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-4">
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        {complaints.length > 0 && (
          <div className="border-t border-slate-700/50 p-4 bg-slate-800/20">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 flex items-center gap-1">
                <MessageSquare className="w-2.5 h-2.5" />
                Total complaints
              </span>
              <span className="text-white font-bold">{complaints.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Tip */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Shield className="w-3 h-3 text-emerald-500" />
        <span className="text-[9px] text-slate-500">Your complaints are handled with confidentiality and care</span>
      </div>
    </div>
  );
}