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
            <Badge variant="primary" className="flex gap-2">
              AI-Powered Reporting
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
            Submit Complaint
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium">
            Report an issue and let our AI assist with intelligent categorization
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-semibold">Secured by Supabase RLS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Form - Left Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 space-y-5 shadow-sm">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                Complaint Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Brief summary of the issue..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-white border-slate-200 focus:border-brand-500 rounded-lg text-slate-900 placeholder:text-slate-400 text-base"
              />
            </div>

            {/* Description Textarea with AI Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <AnimatePresence mode="wait">
                  {isClassifying && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-50 border border-brand-100"
                    >
                      <Loader2 className="w-2.5 h-2.5 animate-spin text-brand-500" />
                      <span className="text-[9px] font-bold uppercase text-brand-500">AI Analyzing...</span>
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
                  className="bg-white border-slate-200 focus:border-brand-500 rounded-lg min-h-[140px] text-slate-900 placeholder:text-slate-400 resize-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 ml-1">
                Minimum 15 characters for AI analysis
              </p>
            </div>

            {/* Urgency and Anonymous Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-800 text-sm cursor-pointer"
                >
                  <option value="low">🔵 Low - General inquiry</option>
                  <option value="medium">🟡 Medium - Needs attention</option>
                  <option value="high">🟠 High - Urgent matter</option>
                  <option value="critical">🔴 Critical - Emergency</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                  Privacy
                </label>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all duration-200 ${isAnonymous
                      ? 'bg-brand-50 border-brand-500 text-brand-600'
                      : 'bg-white border-slate-200 text-slate-700'
                    }`}
                >
                  <span className="text-sm font-medium">
                    {isAnonymous ? 'Anonymous' : 'Show Identity'}
                  </span>
                  {isAnonymous ? (
                    <ShieldCheck className="w-4 h-4 text-brand-500" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 h-12 text-base font-bold bg-brand-500 text-white hover:bg-brand-600 shadow-sm rounded-lg mt-4"
              isLoading={isSubmitting}
            >
              Submit Complaint
            </Button>

            {/* Anonymous Disclaimer */}
            {isAnonymous && (
              <p className="text-[10px] text-slate-400 text-center mt-2">
                Your identity will be hidden from public view. Administrators may still see your information for follow-up.
              </p>
            )}
          </form>
        </div>

        {/* AI Categorization Panel - Right Column */}
        <div className="space-y-6">
          <div className="sticky top-24">
            {/* AI Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">AI Routing</h3>
                  <p className="text-[10px] text-slate-400">Semantic Analysis Engine</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                Our AI model analyzes your complaint text to predict the most relevant category, ensuring faster routing and resolution.
              </p>

              {/* Prediction Result */}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-5 min-h-[140px] flex flex-col items-center justify-center text-center">
                {predictedCategory ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 w-full"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                      <Badge variant="secondary" className="text-sm py-1 px-4 bg-brand-50 text-brand-500 border-brand-100 rounded-lg">
                        {predictedCategory.name}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Confidence Score</p>
                      <p className="text-2xl md:text-3xl font-extrabold text-slate-800">
                        {(predictedCategory.confidence * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${predictedCategory.confidence * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-brand-500 h-full rounded-full"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-2 opacity-50">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Awaiting Input</p>
                    <p className="text-[10px] text-slate-400">Describe your issue in the description box</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}