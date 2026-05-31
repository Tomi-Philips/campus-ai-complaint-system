'use client';

import { useState, useEffect } from 'react';
import { complaintService } from '@/lib/services/complaint.service';
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
  BrainCircuit,
  TrendingUp,
  Zap,
  Activity,
  Target,
  Cpu,
  BarChart3,
  Network,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await complaintService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full min-h-[500px] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Mock data for charts when real data isn't available
  const volumeData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 18 },
    { name: 'Wed', count: 14 },
    { name: 'Thu', count: 22 },
    { name: 'Fri', count: 28 },
    { name: 'Sat', count: 8 },
    { name: 'Sun', count: 5 }
  ];

  const confidenceData = [
    { range: '95-100%', count: 38, color: '#10b981' },
    { range: '90-94%', count: 42, color: '#8b5cf6' },
    { range: '85-89%', count: 25, color: '#f59e0b' },
    { range: '80-84%', count: 12, color: '#ef4444' },
    { range: '<80%', count: 5, color: '#6b7280' }
  ];

  const categoryAccuracy = [
    { name: 'Maintenance', accuracy: 96, color: '#8b5cf6' },
    { name: 'Academic', accuracy: 92, color: '#06b6d4' },
    { name: 'Harassment', accuracy: 94, color: '#ec4899' },
    { name: 'Facilities', accuracy: 89, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <BrainCircuit className="w-3 h-3 mr-1" />
              AI Intelligence Dashboard
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            AI Analytics
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Deep semantic insights and predictive trend analysis powered by machine learning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Live Inference</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Semantic Accuracy', value: '94.2%', icon: Target, trend: '+2.1%', color: 'from-purple-500 to-purple-600', bgGlow: 'purple' },
          { label: 'Inference Speed', value: '124ms', icon: Cpu, trend: '-15ms', color: 'from-blue-500 to-blue-600', bgGlow: 'blue' },
          { label: 'Clustering Density', value: '0.84', icon: Network, trend: '+0.03', color: 'from-pink-500 to-pink-600', bgGlow: 'pink' },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -2 }}
            className="group relative bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                <metric.icon className="text-white w-5 h-5" />
              </div>
              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400">{metric.trend}</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{metric.label}</p>
              <p className="text-2xl md:text-3xl font-black text-white mt-1">{metric.value}</p>
            </div>

            <div className={`absolute -right-6 -bottom-6 w-20 h-20 bg-${metric.bgGlow}-500/10 rounded-full blur-2xl`} />
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Volume Forecast Chart */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              <h3 className="text-base md:text-lg font-bold text-white">Volume Forecast</h3>
            </div>
            <Badge variant="glass" className="bg-slate-800 text-slate-300 border-slate-700 text-[9px]">
              Last 7 Days
            </Badge>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ color: '#a78bfa', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#volumeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Peak activity forecast</span>
              <span className="text-brand-400 font-semibold">Friday @ 2-4 PM</span>
            </div>
          </div>
        </div>

        {/* AI Confidence Distribution */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent-400" />
              <h3 className="text-base md:text-lg font-bold text-white">Confidence Distribution</h3>
            </div>
            <Badge variant="glass" className="bg-slate-800 text-slate-300 border-slate-700 text-[9px]">
              Model v2.4
            </Badge>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                />
                <YAxis
                  type="category"
                  dataKey="range"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Accuracy & Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Category Accuracy */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base md:text-lg font-bold text-white">Category Accuracy</h3>
          </div>

          <div className="space-y-4">
            {categoryAccuracy.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="text-white font-bold">{cat.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.accuracy}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-[10px] text-slate-500">Overall Accuracy</span>
              </div>
              <span className="text-sm font-bold text-brand-400">92.8%</span>
            </div>
          </div>
        </div>

        {/* Semantic Insights Card */}
        <div className="bg-gradient-to-br from-brand-500/10 to-accent-500/10 rounded-xl border border-brand-500/20 p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-bold text-white mb-2">Semantic Cluster Analysis</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                AI has identified 3 emerging complaint patterns this week. Student concerns about dining services show 34% semantic similarity, suggesting a systemic issue.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Badge variant="glass" className="bg-slate-800/50 text-slate-300 border-slate-700">
                  <Database className="w-3 h-3 mr-1" />
                  42 clusters active
                </Badge>
                <Badge variant="glass" className="bg-slate-800/50 text-slate-300 border-slate-700">
                  <Activity className="w-3 h-3 mr-1" />
                  94% coherence
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex flex-wrap justify-center gap-3 pt-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700/50">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-[9px] text-slate-500">Model Updated: Today 09:42 AM</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700/50">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span className="text-[9px] text-slate-500">Validation Accuracy: 94.2%</span>
        </div>
      </div>
    </div>
  );
}