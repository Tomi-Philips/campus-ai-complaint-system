import { createClient } from '@/lib/supabase/server';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Megaphone,
  Sparkles,
  TrendingUp,
  Calendar,
  Shield,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch basic stats
  const { count: totalComplaints } = await supabase
    .from('complaints')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user?.id);

  const { count: resolvedComplaints } = await supabase
    .from('complaints')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user?.id)
    .eq('status', 'resolved');

  const { count: inProgressComplaints } = await supabase
    .from('complaints')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user?.id)
    .eq('status', 'in_progress');

  // Fetch recent announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch recent complaints
  const { data: recentComplaints } = await supabase
    .from('complaints')
    .select('*, categories(name)')
    .eq('student_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(3);

  const pendingCount = (totalComplaints || 0) - (resolvedComplaints || 0);
  const resolutionRate = totalComplaints ? Math.round((resolvedComplaints! / totalComplaints) * 100) : 0;

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section with Welcome Message */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-transparent p-6 md:p-8 border border-brand-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-brand-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Student Portal
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-2">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Welcome back,
            </span>
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent ml-2">
              {user?.user_metadata?.full_name?.split(' ')[0] || 'Student'}
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl">
            Track your complaints, stay updated with campus announcements, and report new issues instantly.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: 'Total Complaints',
            value: totalComplaints || 0,
            icon: MessageSquare,
            gradient: 'from-blue-500 to-blue-600',
            bgGlow: 'blue'
          },
          {
            label: 'Resolved',
            value: resolvedComplaints || 0,
            icon: CheckCircle2,
            gradient: 'from-emerald-500 to-emerald-600',
            bgGlow: 'emerald'
          },
          {
            label: 'In Progress',
            value: inProgressComplaints || 0,
            icon: Clock,
            gradient: 'from-amber-500 to-amber-600',
            bgGlow: 'amber'
          },
          {
            label: 'Resolution Rate',
            value: `${resolutionRate}%`,
            icon: TrendingUp,
            gradient: 'from-purple-500 to-purple-600',
            bgGlow: 'purple'
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="group relative bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            <div className="flex items-start justify-between relative z-10">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="text-white w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-black text-white mt-1">{stat.value}</p>
            </div>

            <div className={`absolute -right-6 -bottom-6 w-20 h-20 bg-${stat.bgGlow}-500/10 rounded-full blur-2xl group-hover:bg-${stat.bgGlow}-500/20 transition-colors`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Announcements Section */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-white">Latest Announcements</h3>
            </div>
            <Link
              href="/announcements"
              className="text-[10px] font-black uppercase tracking-wider text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 md:p-6 space-y-3">
            {announcements && announcements.length > 0 ? (
              announcements.map((ann, index) => (
                <div
                  key={ann.id}
                  className="group p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-slate-600 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="glass"
                      className={`text-[9px] font-black uppercase tracking-wider ${ann.type === 'emergency'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : ann.type === 'academic'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : ann.type === 'event'
                              ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                              : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                        }`}
                    >
                      {ann.type}
                    </Badge>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-brand-400 transition-colors">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {ann.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                  <Megaphone className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-sm text-slate-400">No announcements yet</p>
                <p className="text-xs text-slate-500 mt-1">Check back later for campus updates</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Complaints Section */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-purple-500 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-white">Your Recent Issues</h3>
            </div>
            <Link
              href="/complaints/history"
              className="text-[10px] font-black uppercase tracking-wider text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
            >
              View History
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 md:p-6 space-y-3">
            {recentComplaints && recentComplaints.length > 0 ? (
              recentComplaints.map((comp) => (
                <div
                  key={comp.id}
                  className="group p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-slate-600 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={comp.status === 'resolved' ? 'success' : comp.status === 'in_progress' ? 'warning' : 'outline'}
                        className="text-[9px] font-black uppercase tracking-wider"
                      >
                        {comp.status === 'in_progress' ? 'In Progress' : comp.status}
                      </Badge>
                      {comp.urgency === 'critical' && (
                        <Badge variant="error" className="text-[9px] font-black uppercase tracking-wider gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Critical
                        </Badge>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(comp.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-accent-400 transition-colors line-clamp-1">
                    {comp.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold uppercase tracking-wider">
                    {comp.categories?.name || 'Uncategorized'}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-sm text-slate-400">No complaints yet</p>
                <p className="text-xs text-slate-500 mt-1">Submit your first complaint below</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-700/50 p-5 md:p-6 bg-slate-800/20">
            <Button
              variant="glass"
              className="w-full group bg-gradient-to-r from-brand-500/10 to-brand-600/10 hover:from-brand-500/20 hover:to-brand-600/20 border border-brand-500/20 rounded-lg h-11"
              asChild
            >
              <Link href="/complaints/create">
                <Zap className="w-4 h-4 mr-2 text-brand-400" />
                Report New Issue
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Tip Card */}
      <div className="bg-gradient-to-r from-brand-500/5 to-accent-500/5 rounded-xl border border-brand-500/10 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">AI-Powered Support</h4>
            <p className="text-xs text-slate-400">
              Your complaints are automatically categorized and prioritized by our AI system for faster resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}