'use client';

import { useState, useEffect } from 'react';
import { categoryService, Category, CategoryExample } from '@/lib/services/category.service';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tags,
  Plus,
  Trash2,
  BrainCircuit,
  PlusCircle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info,
  X,
  CheckCircle2,
  AlertTriangle,
  Database,
  Zap,
  Layers,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [examples, setExamples] = useState<Record<string, CategoryExample[]>>({});

  // New Category State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Example State
  const [newExample, setNewExample] = useState('');
  const [isAddingExample, setIsAddingExample] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }

  const toggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);
    if (!examples[id]) {
      try {
        const data = await categoryService.getExamples(id);
        setExamples(prev => ({ ...prev, [id]: data }));
      } catch (error) {
        toast.error('Failed to load training examples');
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name) return;

    setIsSubmitting(true);
    try {
      await categoryService.createCategory(newCat.name, newCat.description);
      toast.success('Category created successfully');
      setShowAddModal(false);
      setNewCat({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      toast.error('Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This will remove all associated training data.')) return;

    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleAddExample = async (categoryId: string) => {
    if (!newExample) return;

    setIsAddingExample(true);
    setActiveCategoryId(categoryId);
    try {
      const added = await categoryService.addExample(categoryId, newExample);
      setExamples(prev => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), added]
      }));
      setNewExample('');
      toast.success('Training example added and vectorized');
    } catch (error) {
      toast.error('Failed to add example');
    } finally {
      setIsAddingExample(false);
      setActiveCategoryId(null);
    }
  };

  const handleDeleteExample = async (categoryId: string, exampleId: string) => {
    try {
      await categoryService.deleteExample(exampleId);
      setExamples(prev => ({
        ...prev,
        [categoryId]: prev[categoryId].filter(ex => ex.id !== exampleId)
      }));
      toast.success('Example removed');
    } catch (error) {
      toast.error('Failed to remove example');
    }
  };

  const totalTrainingExamples = Object.values(examples).reduce((acc, curr) => acc + (curr?.length || 0), 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <BrainCircuit className="w-3 h-3 mr-1" />
              AI Training Center
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            AI Categories
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Define categories and provide training phrases for the AI semantic engine
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl gap-2 shadow-lg shadow-brand-500/25 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 h-11"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Categories</p>
              <p className="text-2xl font-black text-white">{categories.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-brand-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Training Examples</p>
              <p className="text-2xl font-black text-white">{totalTrainingExamples}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-accent-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">AI Model Status</p>
              <p className="text-2xl font-black text-emerald-400">Active</p>
            </div>
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse absolute -top-1 -right-1" />
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-500/5 to-accent-500/5 border border-brand-500/10 p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-brand-400 mb-1 text-sm">How AI Categorization Works</h4>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              The AI uses <span className="text-brand-400 font-semibold">"Semantic Matching"</span>. By adding 5-10 example phrases for each category,
              the system learns the <span className="text-accent-400 font-semibold">context</span> rather than just keywords. This enables automatic
              categorization of student complaints with high accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-900/50 rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl" />
                  <div className="flex-1">
                    <div className="w-32 h-5 bg-slate-800 rounded-lg mb-2" />
                    <div className="w-48 h-3 bg-slate-800 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-slate-900/50 rounded-xl p-12 text-center border border-slate-700/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <Tags className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-400">No categories yet</h3>
            <p className="text-slate-500 text-sm mt-1">Create your first category to start training the AI</p>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="glass"
              className="mt-4 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </div>
        ) : (
          categories.map((cat, index) => {
            const isExpanded = expandedId === cat.id;
            const categoryExamples = examples[cat.id] || [];

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden"
              >
                {/* Category Header */}
                <div
                  className="p-5 md:p-6 flex items-center justify-between cursor-pointer group"
                  onClick={() => toggleExpand(cat.id)}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isExpanded
                        ? 'bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/20'
                        : 'bg-slate-800 group-hover:bg-slate-700'
                      }`}>
                      <Tags className={`w-5 h-5 md:w-6 md:h-6 ${isExpanded ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white">{cat.name}</h3>
                      <p className="text-xs md:text-sm text-slate-500">
                        {cat.description || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Training Examples</p>
                      <p className="text-lg md:text-xl font-black text-brand-400">{categoryExamples.length}</p>
                    </div>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-700/50 bg-slate-800/30"
                    >
                      <div className="p-5 md:p-6 space-y-6">
                        {/* Training Examples Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BrainCircuit className="w-4 h-4 text-brand-400" />
                              <h4 className="font-bold text-sm text-white">Semantic Training Phrases</h4>
                            </div>
                            <Badge variant="glass" className="text-[9px] bg-slate-800 border-slate-700">
                              Vectorized Storage
                            </Badge>
                          </div>

                          {/* Examples Grid */}
                          {categoryExamples.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {categoryExamples.map((ex) => (
                                <div key={ex.id} className="flex items-center justify-between p-3 px-4 rounded-lg bg-slate-800/50 border border-slate-700 group/example">
                                  <span className="text-sm text-slate-300">{ex.text}</span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteExample(cat.id, ex.id); }}
                                    className="opacity-0 group-hover/example:opacity-100 p-1.5 hover:bg-red-500/10 text-red-400 rounded-lg transition-all duration-200"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add Example Input */}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a new training phrase (e.g., 'The bathroom is flooded')..."
                              className="bg-slate-800/50 border-slate-700 rounded-lg text-sm focus:border-brand-500"
                              value={activeCategoryId === cat.id ? newExample : (newExample || '')}
                              onChange={(e) => setNewExample(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddExample(cat.id)}
                            />
                            <Button
                              variant="glass"
                              onClick={() => handleAddExample(cat.id)}
                              disabled={isAddingExample || !newExample}
                              className="rounded-lg px-4 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20"
                            >
                              {isAddingExample && activeCategoryId === cat.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                            </Button>
                          </div>

                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Add 5-10 examples for optimal AI accuracy
                          </p>
                        </div>

                        {/* Danger Zone */}
                        <div className="pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Management</p>
                            <p className="text-[10px] text-slate-600">Deleting this category will affect AI classification accuracy</p>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-red-400 hover:bg-red-500/10 rounded-lg gap-2 text-xs font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Category
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                    <Tags className="text-white w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Create New Category</h2>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAddCategory} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Category Name *
                  </label>
                  <Input
                    placeholder="e.g., Facility Maintenance"
                    className="bg-slate-800/50 border-slate-700 rounded-lg h-11 text-base font-medium focus:border-brand-500"
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Description (Optional)
                  </label>
                  <Textarea
                    placeholder="Describe what kind of issues fall into this category..."
                    className="bg-slate-800/50 border-slate-700 rounded-lg min-h-[100px] resize-none focus:border-brand-500"
                    value={newCat.description}
                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  />
                </div>

                {/* Tip */}
                <div className="p-3 rounded-lg bg-brand-500/5 border border-brand-500/10">
                  <p className="text-[11px] text-slate-400">
                    <span className="text-brand-400 font-semibold">💡 Tip:</span> After creating, you'll be able to add training examples to help the AI recognize this category.
                  </p>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="glass"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 rounded-lg h-11 bg-slate-800 border-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg h-11 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Create Category'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}