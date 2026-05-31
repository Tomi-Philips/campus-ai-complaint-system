'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Shield,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Brain,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { classifyComplaint } from '@/lib/ai/categorizer';
import { categoryService, Category } from '@/lib/services/category.service';
import { complaintService } from '@/lib/services/complaint.service';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CreateComplaintPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [urgency, setUrgency] = useState('low');

  const [categories, setCategories] = useState<Category[]>([]);
  const [predictedCategory, setPredictedCategory] = useState<{ name: string, confidence: number } | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    categoryService.getActiveCategories().then(setCategories);
  }, []);

  // Debounced AI Classification
  useEffect(() => {
    if (description.length < 15 || categories.length === 0) {
      setPredictedCategory(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsClassifying(true);
      try {
        const categoryNames = categories.map(c => c.name);
        const result = await classifyComplaint(description, categoryNames);
        setPredictedCategory({ name: result.category, confidence: result.confidence });
      } catch (error) {
        console.error('AI Classification failed', error);
      } finally {
        setIsClassifying(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [description, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategory = categories.find(c => c.name === predictedCategory?.name);

      await complaintService.create({
        title,
        description,
        category_id: selectedCategory?.id,
        urgency,
        is_anonymous: isAnonymous,
        ai_confidence: predictedCategory?.confidence
      });

      toast.success('Complaint submitted successfully!');
      router.push('/complaints/history');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyConfig = (value: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      low: { label: 'Low', color: 'from-green-500 to-green-600', icon: CheckCircle2 },
      medium: { label: 'Medium', color: 'from-yellow-500 to-yellow-600', icon: Clock },
      high: { label: 'High', color: 'from-orange-500 to-orange-600', icon: AlertCircle },
      critical: { label: 'Critical', color: 'from-red-500 to-red-600', icon: AlertTriangle }
    };
    return configs[value] || configs.low;
  };

  const urgencyConfig = getUrgencyConfig(urgency);

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Reporting
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Submit Complaint
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Report an issue and let our AI assist with intelligent categorization
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-semibold text-slate-300">Secured by Supabase RLS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Form - Left Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6 space-y-5">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                Complaint Title <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="Brief summary of the issue..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700 rounded-lg focus:border-brand-500 text-base"
              />
            </div>

            {/* Description Textarea with AI Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                  Description <span className="text-red-400">*</span>
                </label>
                <AnimatePresence mode="wait">
                  {isClassifying && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20"
                    >
                      <Loader2 className="w-2.5 h-2.5 animate-spin text-brand-400" />
                      <span className="text-[9px] font-bold uppercase text-brand-400">AI Analyzing...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Detailed description of what happened..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="bg-slate-800/50 border-slate-700 rounded-lg min-h-[140px] focus:border-brand-500 resize-none"
                />
              </div>
              <p className="text-[10px] text-slate-500 ml-1">
                Minimum 15 characters for AI analysis
              </p>
            </div>

            {/* Urgency and Anonymous Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-white text-sm cursor-pointer"
                >
                  <option value="low">🔵 Low - General inquiry</option>
                  <option value="medium">🟡 Medium - Needs attention</option>
                  <option value="high">🟠 High - Urgent matter</option>
                  <option value="critical">🔴 Critical - Emergency</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                  Privacy
                </label>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all duration-200 ${isAnonymous
                      ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300'
                    }`}
                >
                  <span className="text-sm font-medium">
                    {isAnonymous ? 'Anonymous' : 'Show Identity'}
                  </span>
                  {isAnonymous ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 h-12 text-base font-bold bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25 rounded-lg mt-4"
              isLoading={isSubmitting}
            >
              {!isSubmitting && <Zap className="w-4 h-4 mr-2" />}
              Submit Complaint
            </Button>

            {/* Anonymous Disclaimer */}
            {isAnonymous && (
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Your identity will be hidden from public view. Administrators may still see your information for follow-up.
              </p>
            )}
          </form>
        </div>

        {/* AI Categorization Panel - Right Column */}
        <div className="space-y-6">
          <div className="sticky top-24">
            {/* AI Card */}
            <div className="bg-gradient-to-br from-brand-500/5 to-accent-500/5 rounded-xl border border-brand-500/20 p-5 md:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">AI Categorization</h3>
                  <p className="text-[10px] text-slate-500">Semantic Analysis Engine</p>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Our AI model analyzes your complaint text to predict the most relevant category, ensuring faster routing and resolution.
              </p>

              {/* Prediction Result */}
              <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-5 min-h-[140px] flex flex-col items-center justify-center text-center">
                {predictedCategory ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 w-full"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                      <Badge variant="secondary" className="text-sm py-1 px-4 bg-brand-500/20 text-brand-400 border-brand-500/30 rounded-lg">
                        {predictedCategory.name}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Confidence Score</p>
                      <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
                        {(predictedCategory.confidence * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${predictedCategory.confidence * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-2 opacity-50">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-500" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Awaiting Input</p>
                    <p className="text-[10px] text-slate-500">Describe your issue above</p>
                  </div>
                )}
              </div>

              {/* Model Info */}
              <div className="mt-5 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider">
                  <span className="text-slate-500">Model</span>
                  <span className="text-brand-400">DistilBART Zero-Shot</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider mt-2">
                  <span className="text-slate-500">Architecture</span>
                  <span className="text-accent-400">Transformer-based</span>
                </div>
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="mt-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Pro Tip</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Be as specific as possible when describing your issue. Including details like location, time, and involved parties helps our AI categorize accurately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}