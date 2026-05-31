'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { categoryService, Category, CategoryExample } from '@/lib/services/category.service';
import { generateEmbedding } from '@/lib/ai/embeddings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  BrainCircuit, 
  Trash2, 
  ArrowLeft, 
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

export default function CategoryExamplesPage() {
  const { categoryId } = useParams() as { categoryId: string };
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [examples, setExamples] = useState<CategoryExample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newExample, setNewExample] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: cat } = await supabase.from('categories').select('*').eq('id', categoryId).single();
      setCategory(cat);

      const ex = await categoryService.getExamples(categoryId);
      setExamples(ex);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddExample(e: React.FormEvent) {
    e.preventDefault();
    if (!newExample) return;

    setIsGenerating(true);
    try {
      const supabase = createClient();
      
      // Generate embedding using AI model
      const embedding = await generateEmbedding(newExample);

      const { error } = await supabase
        .from('category_examples')
        .insert({
          category_id: categoryId,
          text: newExample,
          embedding: embedding
        });

      if (error) throw error;

      toast.success('Training example added with AI embedding');
      setNewExample('');
      fetchData();
    } catch (error) {
      toast.error('Failed to add example or generate embedding');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('category_examples').delete().eq('id', id);
      if (error) throw error;
      toast.success('Example deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => router.back()}
          className="p-3 rounded-2xl glass hover:bg-white/5 transition-all text-foreground/60 hover:text-foreground"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-black tracking-tight text-accent-500">
              {category?.name || 'Loading...'}
            </h1>
            <Badge variant="secondary">Semantic Training</Badge>
          </div>
          <p className="text-foreground/60 font-medium">Add semantic examples to improve the AI&apos;s classification accuracy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl sticky top-24 border-accent-500/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <h3 className="font-black tracking-tight">Add Training Data</h3>
            </div>
            
            <form onSubmit={handleAddExample} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/60 ml-1">Example Text</label>
                <textarea 
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="e.g. There is no water in the female hostel block B."
                  className="w-full bg-white/5 border border-border rounded-2xl px-4 py-3 outline-none transition-all focus:border-accent-500 min-h-[120px] font-medium text-sm"
                  required
                />
              </div>
              <Button 
                type="submit" 
                variant="secondary" 
                className="w-full gap-2" 
                isLoading={isGenerating}
              >
                <BrainCircuit className="w-5 h-5" />
                Train Model
              </Button>
              <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest text-center">
                This will generate a 384d vector embedding
              </p>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-3xl min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                Training Set
                <Badge variant="glass">{examples.length} Examples</Badge>
              </h3>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input 
                  type="text" 
                  placeholder="Filter examples..." 
                  className="bg-white/5 border border-border rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-accent-500 w-48 transition-all"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : examples.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {examples.map((ex) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      key={ex.id}
                      className="p-4 rounded-2xl bg-white/5 border border-border flex items-center justify-between group hover:bg-accent-500/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
                           <CheckCircle2 className="w-4 h-4 text-accent-500" />
                        </div>
                        <p className="text-sm font-medium">{ex.text}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(ex.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-foreground/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center opacity-30">
                   <AlertCircle className="w-8 h-8" />
                </div>
                <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">No training data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
