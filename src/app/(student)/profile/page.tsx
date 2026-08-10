'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Mail,
  Shield,
  CheckCircle2,
  Award,
  Calendar,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
        setEditName(data?.full_name || '');
        setEmail(user.email || '');
      }
      setIsLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editName })
        .eq('id', profile.id);
      if (error) throw error;
      setProfile({ ...profile, full_name: editName });
      toast.success('Name updated successfully');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="h-full min-h-[500px] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const roleLabel =
    profile?.role === 'super_admin' ? 'Super Admin'
    : profile?.role === 'admin' ? 'Administrator'
    : 'Student';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <Badge variant="primary" className="mb-2">Profile</Badge>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          My Profile
        </h1>
        <p className="text-slate-500 text-sm mt-1">Your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-brand-400" />
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2 mb-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-white border-slate-200 rounded-lg text-base font-bold text-slate-900 w-60"
                  placeholder="Full name"
                />
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  {isSaving
                    ? <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                    : <Save className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditName(profile?.full_name || ''); }}
                  className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-extrabold text-slate-900 truncate">
                  {profile?.full_name || 'Campus Member'}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-100">
                <Shield className="w-3 h-3" />
                {roleLabel}
              </span>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Mail className="w-3 h-3" />
                <span className="text-xs">{email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Member Since</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Calendar className="w-3.5 h-3.5 text-brand-500" />
            <p className="text-xs font-semibold text-slate-800">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
                : '—'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Account Status</p>
          <div className="flex items-center gap-1.5 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-xs font-semibold text-emerald-600">Active</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Role</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-slate-800 capitalize">{profile?.role || 'student'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}