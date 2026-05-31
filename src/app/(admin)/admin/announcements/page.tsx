'use client';

import { useState, useEffect } from 'react';
import { announcementService, Announcement } from '@/lib/services/announcement.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Megaphone,
  Trash2,
  Edit3,
  Pin,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Sparkles,
  AlertTriangle,
  Clock,
  Send,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: 'general' | 'academic' | 'emergency' | 'event' | 'maintenance' | 'administrative';
    is_pinned: boolean;
    banner_url: string;
  }>({
    title: '',
    content: '',
    type: 'general',
    is_pinned: false,
    banner_url: ''
  });


  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    setIsLoading(true);
    try {
      const data = await announcementService.getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {

      toast.error('Failed to fetch announcements');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await announcementService.create(formData);
      toast.success('Announcement published successfully');
      setFormData({
        title: '',
        content: '',
        type: 'general',
        is_pinned: false,
        banner_url: ''
      });
      setIsAdding(false);
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to publish announcement');
    }
  }

  const getTypeBadgeConfig = (type: string) => {
    const configs: Record<string, { color: string; bgGlow: string; icon: any }> = {
      general: { color: 'from-blue-500 to-blue-600', bgGlow: 'blue', icon: Megaphone },
      academic: { color: 'from-purple-500 to-purple-600', bgGlow: 'purple', icon: Calendar },
      emergency: { color: 'from-red-500 to-red-600', bgGlow: 'red', icon: AlertTriangle },
      event: { color: 'from-pink-500 to-pink-600', bgGlow: 'pink', icon: Sparkles },
      maintenance: { color: 'from-orange-500 to-orange-600', bgGlow: 'orange', icon: Clock }
    };
    return configs[type] || configs.general;
  };

  const pinnedAnnouncements = announcements.filter(a => a.is_pinned);
  const regularAnnouncements = announcements.filter(a => !a.is_pinned);

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <Megaphone className="w-3 h-3 mr-1" />
              Campus Communications
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Broadcasting
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Create and manage institutional announcements across campus
          </p>
        </div>
        <Button
          variant="secondary"
          className={`gap-2 rounded-xl transition-all duration-200 ${isAdding
            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg shadow-brand-500/25'
            }`}
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              New Broadcast
            </>
          )}
        </Button>
      </div>

      {/* Add Announcement Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-white">Create New Announcement</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Broadcast Title"
                    labelClassName="text-xs font-semibold uppercase tracking-wider text-slate-400"
                    placeholder="e.g., End of Semester Break"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-slate-800/50 border-slate-700 rounded-lg focus:border-brand-500"
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-white text-sm"
                    >
                      <option value="general">📢 General</option>
                      <option value="academic">📚 Academic</option>
                      <option value="emergency">🚨 Emergency</option>
                      <option value="event">🎉 Event</option>
                      <option value="maintenance">🔧 Maintenance</option>
                    </select>
                  </div>
                </div>

                <Textarea
                  label="Content"
                  labelClassName="text-xs font-semibold uppercase tracking-wider text-slate-400"
                  placeholder="Write your broadcast content here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  className="bg-slate-800/50 border-slate-700 rounded-lg min-h-[120px] focus:border-brand-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Banner Image URL (Optional)"
                    labelClassName="text-xs font-semibold uppercase tracking-wider text-slate-400"
                    placeholder="https://example.com/banner.jpg"
                    value={formData.banner_url}
                    onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 rounded-lg focus:border-brand-500"
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_pinned: !formData.is_pinned })}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all font-semibold text-sm ${formData.is_pinned
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-300'
                        }`}
                    >
                      <Pin className={`w-4 h-4 ${formData.is_pinned ? 'fill-amber-400' : ''}`} />
                      {formData.is_pinned ? 'Pinned' : 'Pin to Top'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="glass"
                    onClick={() => setIsAdding(false)}
                    className="rounded-lg bg-slate-800 border-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publish Now
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcements Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        {/* Pinned Section */}
        {pinnedAnnouncements.length > 0 && (
          <>
            <div className="px-6 py-3 bg-amber-500/5 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Pin className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Pinned Announcements</span>
              </div>
            </div>
            {pinnedAnnouncements.map((ann, index) => (
              <AnnouncementRow key={ann.id} announcement={ann} index={index} fetchAnnouncements={fetchAnnouncements} />
            ))}
          </>
        )}

        {/* Regular Section */}
        {regularAnnouncements.length > 0 && (
          <>
            {pinnedAnnouncements.length > 0 && (
              <div className="px-6 py-3 bg-slate-800/30 border-b border-slate-700/50">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">All Announcements</span>
              </div>
            )}
            {regularAnnouncements.map((ann, index) => (
              <AnnouncementRow key={ann.id} announcement={ann} index={index} fetchAnnouncements={fetchAnnouncements} />
            ))}
          </>
        )}

        {/* Empty State */}
        {announcements.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Megaphone className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-400">No announcements yet</h3>
            <p className="text-slate-500 text-sm mt-1">Create your first broadcast to reach students</p>
            <Button
              onClick={() => setIsAdding(true)}
              variant="glass"
              className="mt-4 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Separate component for announcement row to keep code organized
function AnnouncementRow({
  announcement,
  index,
  fetchAnnouncements
}: {
  announcement: Announcement;
  index: number;
  fetchAnnouncements: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getTypeConfig = (type: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      general: { label: 'General', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      academic: { label: 'Academic', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      emergency: { label: 'Emergency', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
      event: { label: 'Event', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      maintenance: { label: 'Maintenance', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' }
    };
    return configs[type] || configs.general;
  };

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    setIsDeleting(true);
    try {
      await announcementService.delete(announcement.id);
      toast.success('Announcement deleted');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  }

  const typeConfig = getTypeConfig(announcement.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex items-center justify-between p-5 border-b border-slate-700/50 last:border-b-0 hover:bg-slate-800/30 transition-all duration-200"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          {announcement.is_pinned && (
            <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          )}
          <h3 className="font-bold text-white text-base truncate">
            {announcement.title}
          </h3>
          <Badge className={`text-[9px] font-black uppercase tracking-wider border ${typeConfig.color}`}>
            {typeConfig.label}
          </Badge>
          <Badge variant="success" className="gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] flex gap-2">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Live
          </Badge>
        </div>
        <p className="text-sm text-slate-400 truncate max-w-lg">
          {announcement.content}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] text-slate-500 font-medium">
              {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
            </span>
          </div>
          {announcement.banner_url && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] text-slate-500">With banner</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4">
        <button
          className="p-2 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-all duration-200"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-all duration-200"
          title="Edit"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all duration-200 disabled:opacity-50"
          title="Delete"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
}