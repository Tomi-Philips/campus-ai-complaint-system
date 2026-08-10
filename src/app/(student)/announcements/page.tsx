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
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="primary" className="flex gap-2">
            Announcements
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Campus Announcements
        </h1>
        <p className="text-slate-500 text-xs md:text-sm">
          Stay informed with real-time updates, academic schedules, and emergency alerts from the administration.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-wrap">
          {[
            { value: 'all', label: 'All' },
            { value: 'emergency', label: 'Emergency' },
            { value: 'academic', label: 'Academic' },
            { value: 'event', label: 'Event' },
            { value: 'general', label: 'General' },
            { value: 'maintenance', label: 'Maintenance' },
          ].map((type) => {
            const isActive = filter === type.value;
            const count = getFilterCount(type.value);
            return (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`relative px-3 py-1.5 rounded-md font-semibold text-xs transition-all duration-200 whitespace-nowrap ${isActive
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 bg-white border border-slate-200'
                  }`}
              >
                {type.label}
                {count > 0 && !isActive && (
                  <span className="ml-1 text-[10px] text-slate-400">({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
          </div>
          {(searchQuery || filter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 shadow-sm"
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
          <span className="text-[10px] text-slate-400">Active filters:</span>
          {filter !== 'all' && (
            <Badge variant="glass" className="bg-white text-slate-700 border-slate-200 text-[10px]">
              Category: {filter}
              <button onClick={() => setFilter('all')} className="ml-1.5 hover:text-slate-900">×</button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="glass" className="bg-white text-slate-700 border-slate-200 text-[10px]">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="ml-1.5 hover:text-slate-900">×</button>
            </Badge>
          )}
        </div>
      )}

      {/* Announcements Grid */}
      {isLoading ? (
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl animate-pulse" style={{ height: '220px' }} />
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
                      <Pin className="w-4 h-4 text-amber-500" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600">Pinned</h2>
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
                        <Bell className="w-4 h-4 text-slate-400" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">All Announcements</h2>
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
        <div className="bg-white rounded-xl border border-slate-200 p-12 md:p-20 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No announcements found</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
            {searchQuery || filter !== 'all'
              ? "No announcements match your current filters. Try adjusting your search criteria."
              : "There are currently no announcements. Check back later for campus updates."}
          </p>
        </div>
      )}

      {/* Footer Stats */}
      {announcements.length > 0 && !isLoading && (
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
            <Megaphone className="w-3 h-3 text-brand-500" />
            <span className="text-[9px] text-slate-500 font-medium">{announcements.length} total announcements</span>
          </div>
          {announcements.filter(a => a.is_pinned).length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <Pin className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] text-slate-500 font-medium">{announcements.filter(a => a.is_pinned).length} pinned</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
            <Calendar className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] text-slate-500 font-medium">Updated regularly</span>
          </div>
        </div>
      )}
    </div>
  );
}