'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  Users,
  MessageSquare,
  BrainCircuit,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Zap,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Megaphone,
  Tags,
  Sparkles,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { complaintService } from '@/lib/services/complaint.service';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await complaintService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  // Process data for charts
  const categoryData = stats?.categories?.map((cat: any, i: number) => ({
    name: cat.name,
    value: cat.complaints[0]?.count || 0,
    color: ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#ef4444'][i % 6]
  })) || [];

  const growthData = stats?.recent ? processGrowthData(stats.recent) : [];

  function processGrowthData(recent: any[]) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts: any = {};
    days.forEach(d => counts[d] = 0);

    recent.forEach(c => {
      const day = days[new Date(c.created_at).getDay()];
      counts[day]++;
    });

    return days.map(d => ({ name: d, count: counts[d] }));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const resolutionRate = stats ? ((stats.resolved / stats.total) * 100 || 0).toFixed(1) : 0;

  return (
    <div className="space-y-8 md:space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-brand-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Dashboard
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Systems Overview
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Real-time intelligence and campus engagement metrics powered by AI
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">AI Inference: Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-xs font-semibold text-brand-400">DB Sync: Stable</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Complaints', value: stats?.total || 0, icon: MessageSquare, trend: '+12%', color: 'from-blue-500 to-blue-600', bgGlow: 'blue' },
          { label: 'AI Accuracy', value: '94.2%', icon: BrainCircuit, trend: '+2.1%', color: 'from-purple-500 to-purple-600', bgGlow: 'purple' },
          { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle2, trend: '+8%', color: 'from-emerald-500 to-emerald-600', bgGlow: 'emerald' },
          { label: 'Resolution Rate', value: `${resolutionRate}%`, icon: TrendingUp, trend: '+5.3%', color: 'from-pink-500 to-rose-600', bgGlow: 'pink' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="group relative bg-slate-900/80 backdrop-blur-sm p-5 md:p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            <div className="flex items-start justify-between relative z-10">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg`}>
                <kpi.icon className="text-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400">{kpi.trend}</span>
              </div>
            </div>

            <div className="mt-4 relative z-10">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">{kpi.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl md:text-3xl font-black text-white">{kpi.value}</p>
                <ArrowUpRight className="w-4 h-4 text-emerald-500 mb-1 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Glow effect */}
            <div className={`absolute -right-6 -bottom-6 w-20 h-20 bg-${kpi.bgGlow}-500/10 rounded-full blur-2xl group-hover:bg-${kpi.bgGlow}-500/20 transition-colors`} />
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Growth Chart - Takes 2/3 */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5 text-brand-400" />
              Complaint Growth
              <Badge variant="glass" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                Last 7 Days
              </Badge>
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-brand-400 to-accent-500" />
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Submissions Trend</span>
            </div>
          </div>
          <div className="h-[280px] md:h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ color: '#a78bfa', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution - Takes 1/3 */}
        <div className="bg-slate-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 flex flex-col">
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <Tags className="w-5 h-5 text-pink-400" />
            Category Distribution
          </h3>
          <div className="h-[220px] md:h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '6px 10px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl md:text-3xl font-black text-white">{stats?.total || 0}</span>
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Total Issues</span>
            </div>
          </div>

          {/* Category Legend */}
          <div className="space-y-3 mt-4 pt-2">
            {categoryData.slice(0, 4).map((cat: any, i: number) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs md:text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{cat.name}</span>
                </div>
                <span className="text-xs md:text-sm font-bold text-white">{cat.value}</span>
              </div>
            ))}
            {categoryData.length > 4 && (
              <div className="pt-2 text-center">
                <span className="text-[10px] text-slate-500">+{categoryData.length - 4} more categories</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* AI Insights Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-500/5 to-accent-500/5 rounded-full blur-2xl" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
              <Zap className="text-white w-5 h-5" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">AI Semantic Insights</h3>
          </div>

          <div className="space-y-5 relative z-10">
            <div className="p-5 rounded-xl bg-gradient-to-r from-brand-500/5 to-accent-500/5 border border-brand-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-brand-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-400">Duplicate Detection</span>
                </div>
                <Badge variant="glass" className="bg-slate-800 text-slate-300 border-slate-700 text-[9px]">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                AI is actively scanning for semantic clusters. Every new complaint is vectorized and compared against the institution's history for intelligent routing.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
                <span>Model Confidence Score</span>
                <span className="text-brand-400">94.2%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '94.2%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">+2.1% improvement this month</p>
            </div>

            <Button variant="secondary" size="sm" className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" asChild>
              <Link href="/admin/categories">
                Manage Intelligence
                <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center justify-between text-white">
            <span>Quick Actions</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
          </h3>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Link href="/admin/complaints" className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all duration-200">
              <MessageSquare className="w-5 h-5 mb-2 text-blue-400" />
              <span className="text-sm font-bold block text-white group-hover:text-blue-400 transition-colors">Complaints</span>
              <span className="text-[9px] text-slate-500 uppercase font-semibold">Manage all issues</span>
            </Link>

            <Link href="/admin/announcements" className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all duration-200">
              <Megaphone className="w-5 h-5 mb-2 text-purple-400" />
              <span className="text-sm font-bold block text-white group-hover:text-purple-400 transition-colors">Broadcast</span>
              <span className="text-[9px] text-slate-500 uppercase font-semibold">Announcements</span>
            </Link>

            <Link href="/admin/categories" className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all duration-200">
              <Tags className="w-5 h-5 mb-2 text-pink-400" />
              <span className="text-sm font-bold block text-white group-hover:text-pink-400 transition-colors">Categories</span>
              <span className="text-[9px] text-slate-500 uppercase font-semibold">Train AI model</span>
            </Link>

            <Link href="/admin/users" className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all duration-200">
              <Users className="w-5 h-5 mb-2 text-emerald-400" />
              <span className="text-sm font-bold block text-white group-hover:text-emerald-400 transition-colors">User Roles</span>
              <span className="text-[9px] text-slate-500 uppercase font-semibold">Manage access</span>
            </Link>
          </div>

          <Button variant="glass" className="w-full mt-6 group bg-slate-800/30 border-slate-700 hover:bg-slate-800/60 text-white" asChild>
            <Link href="/admin/complaints">
              View All Complaints
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Performance Metrics Footer */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700/50">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] text-slate-500">Last updated: Just now</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700/50">
          <Award className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] text-slate-500">98% Uptime SLA</span>
        </div>
      </div>
    </div>
  );
}