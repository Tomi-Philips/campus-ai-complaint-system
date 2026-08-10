import { createClient } from '@/lib/supabase/client';
import { generateEmbedding } from '../ai/embeddings';
import { classifierService } from './classifier.service';

export interface CreateComplaintInput {
  title: string;
  description: string;
  category_id?: string;
  urgency: string;
  is_anonymous: boolean;
  ai_confidence?: number;
}

export const complaintService = {
  async create(input: CreateComplaintInput) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // 2. Automatically classify if category wasn't manually selected
    let finalCategoryId = input.category_id;
    let confidence = 0;

    if (!finalCategoryId) {
      const classification = await classifierService.classify(`${input.title} ${input.description}`);
      finalCategoryId = classification.categoryId || undefined;
      confidence = classification.confidence;
    }

    // 3. Perform duplicate detection via server-side Grok API
    let status = 'pending';
    try {
      const dupResponse = await fetch('/api/ai/duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.title, description: input.description })
      });
      if (dupResponse.ok) {
        const dupData = await dupResponse.json();
        if (dupData.isDuplicate) {
          status = 'duplicate';
          console.log('[AI Duplicate Detector] Flagged as duplicate. Match ID:', dupData.matchId);
        }
      }
    } catch (err) {
      console.warn('[AI Duplicate Detector] Check failed, continuing with pending status:', err);
    }

    // 4. Insert the complaint WITHOUT embedding first so it always saves
    const { data, error } = await supabase
      .from('complaints')
      .insert({
        ...input,
        category_id: finalCategoryId,
        ai_confidence: confidence,
        student_id: user.id,
        status: status,
      })
      .select()
      .single();

    if (error) throw error;

    // 5. Generate embedding and update the record asynchronously (non-blocking)
    //    Wrapped in try/catch so embedding failure never breaks the submission
    try {
      const embedding = await generateEmbedding(`${input.title} ${input.description}`);
      // Only update if embedding is non-trivial (not the zero-vector fallback from an outage)
      const isNonZero = embedding.some(v => v !== 0);
      if (isNonZero) {
        await supabase
          .from('complaints')
          .update({ embedding: embedding as any })
          .eq('id', data.id);
      }
    } catch (embErr) {
      console.warn('[AI] Embedding update skipped (column may not exist yet or model unavailable):', embErr);
    }

    return data;
  },





  async getMyComplaints() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('complaints')
      .select('*, categories(name)')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAdminStats() {
    const supabase = createClient();
    
    // Total complaints
    const { count: totalComplaints } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true });

    // Resolution rate (resolved / total)
    const { count: resolvedComplaints } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolved');

    // Pending complaints
    const { count: pendingComplaints } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Recent growth (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data: recentComplaints } = await supabase
      .from('complaints')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());

    // Category distribution
    const { data: categories } = await supabase
      .from('categories')
      .select('name, complaints(count)');

    return {
      total: totalComplaints || 0,
      resolved: resolvedComplaints || 0,
      pending: pendingComplaints || 0,
      recent: recentComplaints || [],
      categories: categories || []
    };
  },

  async getAllComplaints(filters?: { status?: string; urgency?: string }) {
    const supabase = createClient();
    let query = supabase
      .from('complaints')
      .select('*, profiles:student_id(full_name), categories(name)')
      .order('created_at', { ascending: false });

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.urgency) query = query.eq('urgency', filters.urgency);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('complaints')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

