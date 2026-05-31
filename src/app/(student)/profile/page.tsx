'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Settings, 
  CheckCircle2,
  Lock,
  Globe,
  Sparkles,
  Award,
  Calendar,
  MapPin,
  Phone,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
        setEditForm({ full_name: data?.full_name || '', email: user.email || '' });
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
        .update({ full_name: editForm.full_name })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      setProfile({ ...profile, full_name: editForm.full_name });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-20">
      {/* Cover Image */}
      <div className="relative h-40 md:h-48 rounded-xl overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'60\' height=\'60\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 60 0 L 0 0 0 60\' fill=\'none\' stroke=\'rgba(255,255,255,0.05)\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\' /%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="px-4 md:px-8 -mt-16 relative z-10">
        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-8 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-950 flex items-center justify-center overflow-hidden shadow-2xl">
              <User className="w-12 h-12 md:w-14 md:h-14 text-brand-400" />
            </div>
            <button className="absolute bottom-1 right-1 p-1.5 bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg shadow-lg hover:scale-110 transition-transform duration-200">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-3">
                <Input 
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="bg-slate-800 border-slate-700 rounded-lg text-lg font-bold w-64"
                  placeholder="Full Name"
                />
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  {profile?.full_name || 'Campus Member'}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="glass" className="gap-1.5 py-1 px-3 bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20 rounded-lg">
                <Shield className="w-3 h-3" />
                {profile?.role === 'admin' ? 'Administrator' : profile?.role === 'super_admin' ? 'Super Admin' : 'Student'}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Mail className="w-3.5 h-3.5" />
                <span>{editForm.email}</span>
              </div>
            </div>
          </div>
          
          <Button 
            className="rounded-lg h-10 px-4 gap-2 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Member Since</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              <p className="text-xs font-semibold text-white">
                {new Date(profile?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Account Status</p>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <p className="text-xs font-semibold text-emerald-400">Verified</p>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Role</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-xs font-semibold text-white capitalize">{profile?.role || 'Student'}</p>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Department</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-xs font-semibold text-slate-300">Not specified</p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Security Section */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-white">Account Security</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div>
                  <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                  <p className="text-[10px] text-slate-500">Add an extra layer of security</p>
                </div>
                <Button variant="glass" size="sm" className="rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20">
                  Enable
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div>
                  <p className="text-sm font-bold text-white">Change Password</p>
                  <p className="text-[10px] text-slate-500">Last changed 30 days ago</p>
                </div>
                <Button variant="glass" size="sm" className="rounded-lg">
                  Update
                </Button>
              </div>
            </div>
          </div>

          {/* Institutional Info */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-purple-500 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-white">Institutional Data</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Student ID</p>
                <p className="text-sm font-bold text-white font-mono">
                  {profile?.id ? profile.id.slice(0, 8).toUpperCase() : 'Not assigned'}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Complaints Filed</p>
                    <p className="text-2xl font-black text-white mt-1">0</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 md:mt-8 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-400" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Email Address</p>
              <p className="text-sm font-medium text-white mt-1">{editForm.email}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Phone Number</p>
              <p className="text-sm font-medium text-slate-400 mt-1">Not provided</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}