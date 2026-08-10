'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RecentComplaintsFeedProps {
  initialMyComplaints: any[];
  initialCampusComplaints: any[];
}

export function RecentComplaintsFeed({
  initialMyComplaints,
  initialCampusComplaints,
}: RecentComplaintsFeedProps) {
  const [activeTab, setActiveTab] = useState<'my' | 'campus'>('my');

  const complaints = activeTab === 'my' ? initialMyComplaints : initialCampusComplaints;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 md:p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-brand-500" />
          </div>
          <div className="flex bg-slate-100 rounded-lg p-0.5 relative z-10">
            <button
              onClick={() => setActiveTab('my')}
              className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'my'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My complaints
            </button>
            <button
              onClick={() => setActiveTab('campus')}
              className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'campus'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Campus feed
            </button>
          </div>
        </div>
        <Link
          href="/complaints/history"
          className="text-[10px] font-bold uppercase tracking-wider text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1 self-start sm:self-auto"
        >
          View history
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Complaints List */}
      <div className="p-5 md:p-6 space-y-3 flex-1 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {complaints && complaints.length > 0 ? (
            <div className="space-y-3">
              {complaints.map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="group p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          comp.status === 'resolved'
                            ? 'success'
                            : comp.status === 'under-review'
                            ? 'warning'
                            : 'outline'
                        }
                        className="text-[9px] font-bold uppercase tracking-wider"
                      >
                        {comp.status === 'under-review' ? 'In Progress' : comp.status}
                      </Badge>
                      {comp.urgency === 'critical' && (
                        <Badge variant="error" className="text-[9px] font-bold uppercase tracking-wider gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Critical
                        </Badge>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(comp.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-brand-500 transition-colors line-clamp-1">
                    {comp.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      {comp.categories?.name || 'Uncategorized'}
                    </p>
                    {activeTab === 'campus' && (
                      <span className="text-[10px] font-semibold text-slate-400">
                        {comp.is_anonymous ? 'Anonymous' : comp.profiles?.full_name || 'Anonymous Student'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center h-full min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                {activeTab === 'my' ? 'No complaints yet' : 'No campus complaints yet'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'my'
                  ? 'Submit your first complaint to get started'
                  : 'Recent campus complaints will appear here'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-5 md:p-6 bg-slate-50/50 mt-auto">
        <Button
          variant="outline"
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg h-11"
          asChild
        >
          <Link href="/complaints/create">
            Report New Issue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
