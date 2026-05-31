import { createClient } from '@/lib/supabase/client';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'academic' | 'emergency' | 'event' | 'maintenance' | 'administrative';
  banner_url?: string;
  is_pinned: boolean;
  scheduled_for?: string;
  created_at: string;
  admin_id: string;
}

export const announcementService = {
  async getActiveAnnouncements(): Promise<Announcement[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_archived', false)
      .or(`scheduled_for.is.null,scheduled_for.lte.${new Date().toISOString()}`)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllAnnouncements(): Promise<Announcement[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(input: Partial<Announcement>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        ...input,
        admin_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

