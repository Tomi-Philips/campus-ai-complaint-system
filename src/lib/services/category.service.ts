import { createClient } from '@/lib/supabase/client';

export interface Category {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface CategoryExample {
  id: string;
  category_id: string;
  text: string;
  embedding?: number[];
}

export const categoryService = {
  async getActiveCategories(): Promise<Category[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getAllCategories(): Promise<Category[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getExamples(categoryId: string): Promise<CategoryExample[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('category_examples')
      .select('*')
      .eq('category_id', categoryId);

    if (error) throw error;
    return data || [];
  },

  async createCategory(name: string, description: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, description })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: Partial<Category>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async addExample(categoryId: string, text: string) {
    const supabase = createClient();
    
    // We import generateEmbedding dynamically to avoid client-side heavy bundle issues if called from client
    const { generateEmbedding } = await import('../ai/embeddings');
    const embedding = await generateEmbedding(text);

    const { data, error } = await supabase
      .from('category_examples')
      .insert({
        category_id: categoryId,
        text,
        embedding
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteExample(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('category_examples')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

