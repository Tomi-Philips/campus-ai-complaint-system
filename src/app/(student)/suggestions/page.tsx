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
            <Badge variant="glass" className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <Lightbulb className="w-3 h-3 mr-1" />
              Idea Hub
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Suggestions
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Shape the future of your campus with intelligent feedback and innovative ideas
          </p>
        </div>
        <Button
          className={`gap-2 h-11 px-5 rounded-xl transition-all duration-200 ${isAdding
              ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25'
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
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Ideas</p>
                <p className="text-2xl font-black text-white">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-brand-400" />
              </div>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Implemented</p>
                <p className="text-2xl font-black text-emerald-400">{stats.implemented}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Under Review</p>
                <p className="text-2xl font-black text-blue-400">{stats.underReview}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Suggestion Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-white">Share Your Idea</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Title"
                  labelClassName="text-xs font-semibold uppercase tracking-wider text-slate-400"
                  placeholder="A clear, concise title for your suggestion"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="bg-slate-800/50 border-slate-700 rounded-lg focus:border-brand-500"
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                    Detailed Description
                  </label>
                  <textarea
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-4 min-h-[120px] focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium text-white placeholder:text-slate-500 resize-none"
                    placeholder="Describe your idea in detail. What problem does it solve? How would it improve campus life?"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="glass"
                    onClick={() => setIsAdding(false)}
                    className="rounded-lg bg-slate-800 border-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700"
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
            <div key={i} className="bg-slate-900/50 rounded-xl animate-pulse" style={{ height: '280px' }} />
          ))
        ) : suggestions.length === 0 ? (
          <div className="md:col-span-2 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-12 md:p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No suggestions yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You haven't shared any ideas yet. Be the first to innovate and help shape campus life!
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              variant="glass"
              className="mt-6 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Your First Idea
            </Button>
          </div>
        ) : (
          suggestions.map((suggestion, index) => {
            const statusConfig = getStatusConfig(suggestion.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                layout
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="group bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="text-brand-400 w-5 h-5" />
                    </div>
                    <Badge
                      className={`capitalize px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-gradient-to-r ${statusConfig.color} bg-opacity-10 text-white`}
                    >
                      <StatusIcon className="w-2.5 h-2.5 inline mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <h3 className="text-lg md:text-xl font-black mb-2 text-white group-hover:text-brand-400 transition-colors line-clamp-2">
                    {suggestion.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {suggestion.content}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-500">0 upvotes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-[9px] font-medium text-slate-500">
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

      {/* Impact Note */}
      {suggestions.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Zap className="w-3 h-3 text-brand-400" />
          <span className="text-[9px] text-slate-500">Your voice matters. Every suggestion is reviewed by campus administration.</span>
        </div>
      )}
    </div>
  );
}