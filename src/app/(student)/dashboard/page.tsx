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
import { RecentComplaintsFeed } from '@/components/complaints/recent-complaints-feed';

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
    .eq('status', 'under-review');

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
    .limit(5);

  // Fetch recent campus-wide complaints
  const { data: recentCampusComplaints } = await supabase
    .from('complaints')
    .select('*, categories(name), profiles:student_id(full_name)')
    .order('created_at', { ascending: false })
    .limit(5);

  const pendingCount = (totalComplaints || 0) - (resolvedComplaints || 0);
  const resolutionRate = totalComplaints ? Math.round((resolvedComplaints! / totalComplaints) * 100) : 0;

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section with Welcome Message */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" className="flex gap-2">
              Student Portal
            </Badge>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
            Welcome back,{' '}
            <span className="text-brand-500">
              {user?.user_metadata?.full_name?.split(' ')[0] || 'Student'}
            </span>
          </h1>
          <p className="text-slate-500 text-xs md:text-sm max-w-2xl">
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
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-50'
          },
          {
            label: 'Resolved',
            value: resolvedComplaints || 0,
            icon: CheckCircle2,
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-50'
          },
          {
            label: 'In Progress',
            value: inProgressComplaints || 0,
            icon: Clock,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-50'
          },
          {
            label: 'Resolution Rate',
            value: `${resolutionRate}%`,
            icon: TrendingUp,
            iconColor: 'text-indigo-500',
            iconBg: 'bg-indigo-50'
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="group relative bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className={`${stat.iconColor} w-5 h-5`} />
              </div>
            </div>

            <div className="mt-3 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Announcements Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-brand-500" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-slate-900">Latest Announcements</h3>
            </div>
            <Link
              href="/announcements"
              className="text-[10px] font-bold uppercase tracking-wider text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1"
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
                  className="group p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="glass"
                      className={`text-[9px] font-bold uppercase tracking-wider ${ann.type === 'emergency'
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : ann.type === 'academic'
                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                            : ann.type === 'event'
                              ? 'bg-pink-50 text-pink-600 border-pink-100'
                              : 'bg-brand-50 text-brand-600 border-brand-100'
                        }`}
                    >
                      {ann.type}
                    </Badge>
                    <span className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-brand-500 transition-colors">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                  <Megaphone className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm text-slate-500 font-medium">No announcements yet</p>
                <p className="text-xs text-slate-400 mt-1">Check back later for campus updates</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Complaints Section */}
        <RecentComplaintsFeed
          initialMyComplaints={recentComplaints || []}
          initialCampusComplaints={recentCampusComplaints || []}
        />
      </div>
    </div>
  );
}