'use client';

import { useState, useEffect } from 'react';
import { AnnouncementCard } from '@/components/announcements/announcement-card';
import { announcementService, Announcement } from '@/lib/services/announcement.service';
import { Megaphone, Search, SlidersHorizontal, Sparkles, Calendar, Bell, Pin, FilterX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    announcementService.getActiveAnnouncements()
      .then(setAnnouncements)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredAnnouncements = announcements.filter(a => {
    const matchesType = filter === 'all' || a.type === filter;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getFilterCount = (type: string) => {
    if (type === 'all') return announcements.length;
    return announcements.filter(a => a.type === type).length;
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Hero Banner */}
      <div className="relative h-[280px] md:h-[320px] rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050853064-dbad350e022c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="glass" className="bg-white/10 text-white border-white/20 backdrop-blur-sm gap-1.5 py-1 flex gap-2">
              <Sparkles className="w-3 h-3" />
              Campus Intelligence
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Institutional <span className="text-white/80">Broadcasting</span>
          </h1>
          <p className="text-white/80 font-medium text-base md:text-lg leading-relaxed mt-3 max-w-2xl">
            Stay informed with real-time updates, academic schedules, and emergency alerts from the administration.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
          {[
            { value: 'all', label: 'All', icon: null },
            { value: 'emergency', label: 'Emergency', icon: null, color: 'red' },
            { value: 'academic', label: 'Academic', icon: null, color: 'purple' },
            { value: 'event', label: 'Event', icon: null, color: 'pink' },
            { value: 'general', label: 'General', icon: null, color: 'blue' },
            { value: 'maintenance', label: 'Maintenance', icon: null, color: 'orange' },
          ].map((type) => {
            const isActive = filter === type.value;
            const count = getFilterCount(type.value);
            return (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-nowrap ${isActive
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {type.label}
                {count > 0 && !isActive && (
                  <span className="ml-1.5 text-[10px] text-slate-500">({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-white placeholder:text-slate-500"
            />
          </div>
          {(searchQuery || filter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Clear filters"
            >
              <FilterX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || filter !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-slate-500">Active filters:</span>
          {filter !== 'all' && (
            <Badge variant="glass" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
              Category: {filter}
              <button onClick={() => setFilter('all')} className="ml-1.5 hover:text-white">×</button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="glass" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="ml-1.5 hover:text-white">×</button>
            </Badge>
          )}
        </div>
      )}

      {/* Announcements Grid */}
      {isLoading ? (
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-900/50 rounded-xl animate-pulse" style={{ height: '280px' }} />
          ))}
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        <>
          {/* Pinned Announcements Section */}
          {filter === 'all' && (() => {
            const pinned = filteredAnnouncements.filter(a => a.is_pinned);
            const regular = filteredAnnouncements.filter(a => !a.is_pinned);
            return (
              <>
                {pinned.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Pin className="w-4 h-4 text-amber-400" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">Pinned</h2>
                    </div>
                    <div className="columns-1 md:columns-2 gap-6 space-y-6">
                      {pinned.map((announcement) => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} />
                      ))}
                    </div>
                  </div>
                )}
                {regular.length > 0 && (
                  <div>
                    {pinned.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 mt-8">
                        <Bell className="w-4 h-4 text-slate-500" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">All Announcements</h2>
                      </div>
                    )}
                    <div className="columns-1 md:columns-2 gap-6 space-y-6">
                      {regular.map((announcement) => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {filter !== 'all' && (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-12 md:p-20 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No announcements found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {searchQuery || filter !== 'all'
              ? "No announcements match your current filters. Try adjusting your search criteria."
              : "There are currently no announcements. Check back later for campus updates."}
          </p>
        </div>
      )}

      {/* Footer Stats */}
      {announcements.length > 0 && !isLoading && (
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700">
            <Megaphone className="w-3 h-3 text-brand-400" />
            <span className="text-[9px] text-slate-400">{announcements.length} total announcements</span>
          </div>
          {announcements.filter(a => a.is_pinned).length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700">
              <Pin className="w-3 h-3 text-amber-400" />
              <span className="text-[9px] text-slate-400">{announcements.filter(a => a.is_pinned).length} pinned</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700">
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] text-slate-400">Updated regularly</span>
          </div>
        </div>
      )}
    </div>
  );
}