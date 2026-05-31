'use client';

import { useState, useEffect } from 'react';
import { ComplaintCard } from '@/components/complaints/complaint-card';
import { complaintService } from '@/lib/services/complaint.service';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowRight, 
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function ComplaintHistoryPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    complaintService.getMyComplaints()
      .then(setComplaints)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    pending: complaints.filter(c => c.status === 'pending').length,
  };

  const statusOptions = [
    { value: 'all', label: 'All', icon: null },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-400' },
    { value: 'in_progress', label: 'In Progress', icon: AlertCircle, color: 'text-blue-400' },
    { value: 'resolved', label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20">
              <MessageSquare className="w-3 h-3 mr-1" />
              Complaint History
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            My Complaints
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Track the status and resolution of your reported issues
          </p>
        </div>
        <Link href="/complaints/create">
          <Button className="gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25">
            <Plus className="w-4 h-4" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-slate-700/50">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">Total</p>
          <p className="text-xl md:text-2xl font-black text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-slate-700/50">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">Pending</p>
          <p className="text-xl md:text-2xl font-black text-amber-400">{stats.pending}</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-slate-700/50">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">In Progress</p>
          <p className="text-xl md:text-2xl font-black text-blue-400">{stats.inProgress}</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-slate-700/50">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">Resolved</p>
          <p className="text-xl md:text-2xl font-black text-emerald-400">{stats.resolved}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-white placeholder:text-slate-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex gap-1.5 bg-slate-900/80 border border-slate-700 rounded-xl p-1">
          {statusOptions.map((option) => {
            const isActive = statusFilter === option.value;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : option.color}`} />}
                {option.label}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-700 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-brand-500 text-white' 
                : 'text-slate-500 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-brand-500 text-white' 
                : 'text-slate-500 hover:text-white hover:bg-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || statusFilter !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-slate-500">Active filters:</span>
          {statusFilter !== 'all' && (
            <Badge variant="glass" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
              Status: {statusFilter.replace('_', ' ')}
              <button onClick={() => setStatusFilter('all')} className="ml-1.5 hover:text-white">
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="glass" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="ml-1.5 hover:text-white">
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Complaints Grid/List */}
      {isLoading ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
          : "space-y-4"
        }>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-900/50 rounded-xl animate-pulse" style={{ height: viewMode === 'grid' ? '200px' : '120px' }} />
          ))}
        </div>
      ) : filteredComplaints.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
          : "space-y-4"
        }>
          <AnimatePresence mode="popLayout">
            {filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <ComplaintCard complaint={complaint} viewMode={viewMode} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-12 md:p-20 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            {searchQuery || statusFilter !== 'all' ? (
              <Search className="text-brand-400 w-8 h-8 md:w-10 md:h-10" />
            ) : (
              <MessageSquare className="text-brand-400 w-8 h-8 md:w-10 md:h-10" />
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No matches found' : 'No complaints yet'}
          </h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' 
              ? "We couldn't find any complaints matching your filters. Try adjusting your search criteria."
              : "You haven't submitted any complaints yet. Your reports will appear here once submitted."}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link href="/complaints/create" className="inline-block mt-6">
              <Button variant="glass" className="gap-2 rounded-lg">
                Submit your first complaint
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="inline-block mt-6 text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Resolution Rate Summary */}
      {complaints.length > 0 && (
        <div className="bg-gradient-to-r from-brand-500/5 to-accent-500/5 rounded-xl border border-brand-500/10 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-semibold text-slate-300">Resolution Rate</span>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span>{stats.resolved} resolved</span>
                <span>{Math.round((stats.resolved / stats.total) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}