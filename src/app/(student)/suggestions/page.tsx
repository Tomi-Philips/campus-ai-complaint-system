'use client';

import { useState, useEffect } from 'react';
import { suggestionService } from '@/lib/services/suggestion.service';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  MessageCircle,
  ThumbsUp,
  TrendingUp,
  Zap,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function StudentSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  async function fetchSuggestions() {
    setIsLoading(true);
    try {
      const data = await suggestionService.getMySuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setIsSubmitting(true);
    try {
      await suggestionService.create(newTitle, newContent);
      toast.success('Suggestion submitted successfully!');
      setNewTitle('');
      setNewContent('');
      setIsAdding(false);
      fetchSuggestions();
    } catch (error) {
      toast.error('Failed to submit suggestion');
    } finally {
      setIsSubmitting(false);
    }
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'Pending Review', color: 'from-amber-500 to-amber-600', icon: Clock },
      'under-review': { label: 'Under Review', color: 'from-blue-500 to-blue-600', icon: MessageCircle },
      implemented: { label: 'Implemented', color: 'from-emerald-500 to-emerald-600', icon: CheckCircle2 },
      declined: { label: 'Declined', color: 'from-red-500 to-red-600', icon: X }
    };
    return configs[status] || configs.pending;
  };

  const stats = {
    total: suggestions.length,
    implemented: suggestions.filter(s => s.status === 'implemented').length,
    underReview: suggestions.filter(s => s.status === 'under-review').length,
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" className="flex gap-2">
              Idea Hub
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
            Suggestions
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Share ideas and feedback to help shape your campus
          </p>
        </div>
        <Button
          className={`gap-2 h-11 px-5 rounded-lg transition-all duration-200 ${isAdding
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              : 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm'
            }`}
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              New Suggestion
            </>
          )}
        </Button>
      </div>

      {/* Stats Overview */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Ideas</p>
                <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-brand-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Implemented</p>
                <p className="text-2xl font-extrabold text-emerald-600">{stats.implemented}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Under Review</p>
                <p className="text-2xl font-extrabold text-blue-600">{stats.underReview}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Suggestion Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                </div>
                <h3 className="font-bold text-slate-900">Share Your Idea</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Title"
                  labelClassName="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  placeholder="A clear, concise title for your suggestion"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="bg-white border-slate-200 rounded-lg focus:border-brand-500 text-slate-900 placeholder:text-slate-400"
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                    Detailed Description
                  </label>
                  <textarea
                    className="w-full bg-white border border-slate-200 rounded-lg p-4 min-h-[120px] focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-900 placeholder:text-slate-400 resize-none text-sm"
                    placeholder="Describe your idea in detail. What problem does it solve? How would it improve campus life?"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAdding(false)}
                    className="rounded-lg bg-white border-slate-200 text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="gap-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    Submit Suggestion
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl animate-pulse" style={{ height: '220px' }} />
          ))
        ) : suggestions.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-12 md:p-20 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No suggestions yet</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
              You haven't shared any ideas yet. Help shape campus life by submitting your first suggestion!
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="mt-6 rounded-lg bg-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Share Your First Idea
            </Button>
          </div>
        ) : (
          suggestions.map((suggestion, index) => {
            const statusConfig = getStatusConfig(suggestion.status);
            const StatusIcon = statusConfig.icon;

            const statusVariantMap: Record<string, string> = {
              pending: 'bg-amber-50 text-amber-700 border-amber-100',
              'under-review': 'bg-blue-50 text-blue-700 border-blue-100',
              implemented: 'bg-emerald-50 text-emerald-700 border-emerald-100',
              declined: 'bg-red-50 text-red-700 border-red-100',
            };

            return (
              <motion.div
                layout
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                      <Sparkles className="text-brand-500 w-5 h-5" />
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${statusVariantMap[suggestion.status] || statusVariantMap.pending}`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {statusConfig.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mb-2 text-slate-900 group-hover:text-brand-500 transition-colors line-clamp-2">
                    {suggestion.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {suggestion.content}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-400">0 upvotes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[9px] font-medium text-slate-400">
                        {new Date(suggestion.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer note */}
      {suggestions.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-4 text-slate-400">
          <Zap className="w-3 h-3 text-brand-500" />
          <span className="text-[10px]">Your voice matters. Every suggestion is reviewed by campus administration.</span>
        </div>
      )}
    </div>
  );
}