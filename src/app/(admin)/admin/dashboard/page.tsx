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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" className="flex gap-2">
              Admin Dashboard
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
            Systems Overview
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Campus complaint metrics and AI categorization performance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/complaints">
            <Button variant="outline" className="gap-2 h-10 rounded-lg bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm">
              <MessageSquare className="w-4 h-4" />
              View Complaints
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Complaints', value: stats?.total || 0, icon: MessageSquare, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
          { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle2, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
          { label: 'Pending', value: stats?.pending || 0, icon: Clock, iconColor: 'text-amber-500', iconBg: 'bg-amber-50' },
          { label: 'Resolution Rate', value: `${resolutionRate}%`, icon: TrendingUp, iconColor: 'text-indigo-500', iconBg: 'bg-indigo-50' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="group bg-white p-5 md:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                <kpi.icon className={`${kpi.iconColor} w-5 h-5`} />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kpi.label}</p>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Growth Chart - Takes 2/3 */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
              <BarChart3 className="w-5 h-5 text-brand-500" />
              Complaint Growth
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Last 7 Days</span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Submissions Trend</span>
            </div>
          </div>
          <div className="h-[260px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                  labelStyle={{ color: '#64748b', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution - Takes 1/3 */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-900">
            <Tags className="w-5 h-5 text-indigo-500" />
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
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '6px 10px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{stats?.total || 0}</span>
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Total Issues</span>
            </div>
          </div>

          {/* Category Legend */}
          <div className="space-y-3 mt-4 pt-2 border-t border-slate-100">
            {categoryData.slice(0, 4).map((cat: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-medium text-slate-600">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{cat.value}</span>
              </div>
            ))}
            {categoryData.length > 4 && (
              <div className="pt-1 text-center">
                <span className="text-[10px] text-slate-400">+{categoryData.length - 4} more categories</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* AI Insights Card */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
              <BrainCircuit className="text-brand-500 w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Categorization</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Duplicate Detection</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every new complaint is vectorized and compared against history for intelligent routing.
              </p>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50" asChild>
              <Link href="/admin/categories">
                Manage Categories
                <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold mb-5 text-slate-900">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/complaints" className="group p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200">
              <MessageSquare className="w-5 h-5 mb-2 text-blue-500" />
              <span className="text-sm font-bold block text-slate-800 group-hover:text-brand-600 transition-colors">Complaints</span>
              <span className="text-[9px] text-slate-400 uppercase font-semibold">Manage all issues</span>
            </Link>

            <Link href="/admin/announcements" className="group p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200">
              <Megaphone className="w-5 h-5 mb-2 text-indigo-500" />
              <span className="text-sm font-bold block text-slate-800 group-hover:text-brand-600 transition-colors">Broadcast</span>
              <span className="text-[9px] text-slate-400 uppercase font-semibold">Announcements</span>
            </Link>

            <Link href="/admin/categories" className="group p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200">
              <Tags className="w-5 h-5 mb-2 text-violet-500" />
              <span className="text-sm font-bold block text-slate-800 group-hover:text-brand-600 transition-colors">Categories</span>
              <span className="text-[9px] text-slate-400 uppercase font-semibold">AI routing rules</span>
            </Link>

            <Link href="/admin/users" className="group p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200">
              <Users className="w-5 h-5 mb-2 text-emerald-500" />
              <span className="text-sm font-bold block text-slate-800 group-hover:text-brand-600 transition-colors">User Roles</span>
              <span className="text-[9px] text-slate-400 uppercase font-semibold">Manage access</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}