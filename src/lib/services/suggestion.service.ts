import { createClient } from '@/lib/supabase/client';
import { classifierService } from './classifier.service';

export const suggestionService = {
  async create(title: string, content: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Automatically classify the suggestion
    const classification = await classifierService.classify(`${title} ${content}`);

    const { data, error } = await supabase
      .from('suggestions')
      .insert({
        title,
        content,
        student_id: user.id,
        category_id: classification.categoryId || undefined,
        ai_confidence: classification.confidence,
        status: 'submitted'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },


  async getMySuggestions() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
