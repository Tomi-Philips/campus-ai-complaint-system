'use client';

import { useState, useEffect } from 'react';
import { complaintService } from '@/lib/services/complaint.service';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  User,
  Tags,
  AlertTriangle,
  Sparkles,
  Eye,
  Shield,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', urgency: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  async function fetchComplaints() {
    setIsLoading(true);
    try {
      const data = await complaintService.getAllComplaints(filter);
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await complaintService.updateStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredComplaints = complaints.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUrgencyConfig = (urgency: string) => {
    const configs = {
      critical: { color: 'from-red-500 to-red-600', bgGlow: 'red', icon: AlertTriangle, label: 'Critical' },
      high: { color: 'from-orange-500 to-orange-600', bgGlow: 'orange', icon: AlertCircle, label: 'High' },
      medium: { color: 'from-yellow-500 to-yellow-600', bgGlow: 'yellow', icon: Clock, label: 'Medium' },
      low: { color: 'from-green-500 to-green-600', bgGlow: 'green', icon: CheckCircle2, label: 'Low' }
    };
    return configs[urgency as keyof typeof configs] || configs.medium;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      resolved: { color: 'from-emerald-500 to-emerald-600', bgGlow: 'emerald', icon: CheckCircle2, label: 'Resolved' },
      in_progress: { color: 'from-blue-500 to-blue-600', bgGlow: 'blue', icon: Clock, label: 'In Progress' },
      pending: { color: 'from-amber-500 to-amber-600', bgGlow: 'amber', icon: AlertCircle, label: 'Pending' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-brand-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Admin Panel
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Complaint Management
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Review and resolve campus-wide issues with AI-assisted prioritization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-xs font-semibold text-slate-300">{complaints.length} Total Complaints</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by title, description, or student name..."
            className="pl-11 bg-slate-900/80 border-slate-700 rounded-xl h-11 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="appearance-none bg-slate-900/80 border border-slate-700 rounded-xl px-4 pr-10 h-11 text-sm font-semibold text-slate-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              value={filter.status}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-slate-900/80 border border-slate-700 rounded-xl px-4 pr-10 h-11 text-sm font-semibold text-slate-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
              onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
              value={filter.urgency}
            >
              <option value="">All Urgency</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pending</p>
          <p className="text-xl font-black text-amber-400">{complaints.filter(c => c.status === 'pending').length}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">In Progress</p>
          <p className="text-xl font-black text-blue-400">{complaints.filter(c => c.status === 'in_progress').length}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Resolved</p>
          <p className="text-xl font-black text-emerald-400">{complaints.filter(c => c.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-5 bg-slate-800 rounded-full" />
                        <div className="w-20 h-5 bg-slate-800 rounded-full" />
                      </div>
                      <div className="w-3/4 h-6 bg-slate-800 rounded-lg" />
                      <div className="w-full h-4 bg-slate-800 rounded-lg" />
                      <div className="w-1/2 h-4 bg-slate-800 rounded-lg" />
                    </div>
                    <div className="w-24 h-24 bg-slate-800 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredComplaints.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/50 backdrop-blur-sm p-12 md:p-20 rounded-2xl border border-slate-700/50 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-400">No complaints found</h3>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search term</p>
            </motion.div>
          ) : (
            filteredComplaints.map((complaint, index) => {
              const urgencyConfig = getUrgencyConfig(complaint.urgency);
              const statusConfig = getStatusConfig(complaint.status);
              const UrgencyIcon = urgencyConfig.icon;
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  key={complaint.id}
                  className="group relative bg-slate-900/80 backdrop-blur-sm p-5 md:p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/0 to-accent-500/0 group-hover:from-brand-500/5 group-hover:to-accent-500/5 transition-all duration-500" />

                  <div className="flex flex-col md:flex-row gap-5 md:gap-6 relative z-10">
                    {/* Left Section - Main Content */}
                    <div className="flex-1 space-y-3">
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r ${urgencyConfig.color} bg-opacity-10`}>
                          <UrgencyIcon className="w-3 h-3 text-white" />
                          <span className="text-[9px] font-black uppercase tracking-wider text-white">
                            {urgencyConfig.label}
                          </span>
                        </div>

                        <Badge variant="glass" className="gap-1.5 text-[9px] font-black uppercase tracking-wider border-slate-700 bg-slate-800 text-slate-300">
                          <Tags className="w-3 h-3" />
                          {complaint.categories?.name || 'Uncategorized'}
                        </Badge>

                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] font-medium text-slate-500">
                            {new Date(complaint.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                        {complaint.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                        {complaint.description}
                      </p>

                      {/* User Info */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-slate-300">
                          {complaint.profiles?.full_name || 'Anonymous Student'}
                        </span>
                        <span className="text-[10px] text-slate-500">•</span>
                        <span className="text-[10px] text-slate-500">ID: {complaint.id.slice(0, 8)}</span>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-3 min-w-[180px]">
                      {/* Status Badge */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Current Status</span>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${statusConfig.color} bg-opacity-10 border border-${statusConfig.bgGlow}-500/20`}>
                          <StatusIcon className={`w-3.5 h-3.5 text-${statusConfig.bgGlow}-400`} />
                          <span className={`text-[10px] font-bold uppercase text-${statusConfig.bgGlow}-400`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="glass"
                          size="sm"
                          className="flex-1 h-8 text-xs font-bold bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
                          onClick={() => handleStatusChange(complaint.id, 'in_progress')}
                          disabled={complaint.status === 'in_progress'}
                        >
                          <Eye className="w-3 h-3 mr-1.5" />
                          Investigate
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 h-8 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400"
                          onClick={() => handleStatusChange(complaint.id, 'resolved')}
                          disabled={complaint.status === 'resolved'}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1.5" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}