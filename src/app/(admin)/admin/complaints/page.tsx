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
      console.log('[DEBUG fetchComplaints] First complaint:', data && data.length > 0 ? JSON.stringify(data[0]) : 'None found');
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
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast.error(`Failed to update status: ${error?.message || error}`);
    }
  };

  const filteredComplaints = complaints.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (!c.is_anonymous && c.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getUrgencyConfig = (urgency: string) => {
    const configs = {
      critical: { badgeClass: 'bg-red-50 text-red-700 border-red-100', icon: AlertTriangle, label: 'Critical' },
      high: { badgeClass: 'bg-orange-50 text-orange-700 border-orange-100', icon: AlertCircle, label: 'High' },
      medium: { badgeClass: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock, label: 'Medium' },
      low: { badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2, label: 'Low' }
    };
    return configs[urgency as keyof typeof configs] || configs.medium;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      resolved: { badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2, label: 'Resolved' },
      'under-review': { badgeClass: 'bg-blue-50 text-blue-700 border-blue-100', icon: Clock, label: 'In Progress' },
      pending: { badgeClass: 'bg-amber-50 text-amber-700 border-amber-100', icon: AlertCircle, label: 'Pending' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" className="flex gap-2">
              Admin Panel
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
            Complaint Management
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Review and resolve campus-wide issues with AI-assisted prioritization
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
            <Shield className="w-3.5 h-3.5 text-brand-500" />
            <span>{complaints.length} Total Complaints</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by title, description, or student name..."
            className="pl-11 bg-white border-slate-200 rounded-lg h-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-10 h-11 text-sm font-semibold text-slate-600 focus:outline-none focus:border-brand-500 transition-all cursor-pointer shadow-sm"
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              value={filter.status}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under-review">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-10 h-11 text-sm font-semibold text-slate-600 focus:outline-none focus:border-brand-500 transition-all cursor-pointer shadow-sm"
              onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
              value={filter.urgency}
            >
              <option value="">All Urgency</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending</p>
          <p className="text-xl font-extrabold text-amber-600 mt-1">{complaints.filter(c => c.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Progress</p>
          <p className="text-xl font-extrabold text-blue-600 mt-1">{complaints.filter(c => c.status === 'under-review').length}</p>
        </div>
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolved</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">{complaints.filter(c => c.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse" style={{ height: '140px' }} />
              ))}
            </div>
          ) : filteredComplaints.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 md:p-20 rounded-xl border border-slate-200 text-center shadow-sm"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No complaints found</h3>
              <p className="text-slate-500 text-xs mt-1">Try adjusting your filters or search term</p>
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
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                  key={complaint.id}
                  className="group bg-white p-5 md:p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row gap-5 md:gap-6">
                    {/* Left Section - Main Content */}
                    <div className="flex-1 space-y-3">
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${urgencyConfig.badgeClass}`}>
                          <UrgencyIcon className="w-2.5 h-2.5" />
                          {urgencyConfig.label}
                        </span>

                        <Badge variant="secondary" className="gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-600">
                          <Tags className="w-2.5 h-2.5" />
                          {complaint.categories?.name || 'Uncategorized'}
                        </Badge>

                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span className="text-[10px] font-medium">
                            {new Date(complaint.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-500 transition-colors line-clamp-1">
                        {complaint.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {complaint.description}
                      </p>

                      {/* User Info */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-3 h-3 text-slate-500" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {complaint.is_anonymous ? 'Anonymous Student' : complaint.profiles?.full_name || 'Anonymous Student'}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400">ID: {complaint.id.slice(0, 8)}</span>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-3 min-w-[180px] border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      {/* Status Badge */}
                      <div className="flex flex-col items-start md:items-end gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Current Status</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${statusConfig.badgeClass}`}>
                          <StatusIcon className="w-2.5 h-2.5" />
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 w-full mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs font-semibold bg-white border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm"
                          onClick={() => handleStatusChange(complaint.id, 'under-review')}
                          disabled={complaint.status === 'under-review'}
                        >
                          Investigate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
                          onClick={() => handleStatusChange(complaint.id, 'resolved')}
                          disabled={complaint.status === 'resolved'}
                        >
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