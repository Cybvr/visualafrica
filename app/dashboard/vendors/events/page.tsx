"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { SHARED_EVENTS } from '@/lib/shared-data';
import EventCard from '@/components/dashboard/EventCard';

type EventStatus = 'All Events' | 'Planning' | 'Confirmed' | 'Completed';

const VendorEvents: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus>('All Events');
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions: EventStatus[] = ['All Events', 'Planning', 'Confirmed', 'Completed'];

  // Filter events by selected status
  const filteredByStatus = selectedStatus === 'All Events'
    ? SHARED_EVENTS
    : SHARED_EVENTS.filter(event => event.status === selectedStatus);

  // Further filter by search query
  const filteredEvents = searchQuery.trim() === ''
    ? filteredByStatus
    : filteredByStatus.filter(event =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // For demo purposes, we'll just show a subset if tab is 'saved'
  const displayEvents = activeTab === 'all' ? filteredEvents : filteredEvents.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Event Opportunities</h2>
          <p className="text-slate-500 font-medium mt-1">Discover and connect with hosts planning upcoming events.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-full text-sm outline-none w-64 focus:ring-2 focus:ring-orange-600/20 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-100 rounded-full text-slate-600 hover:text-orange-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-100">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'all'
            ? 'border-orange-600 text-orange-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
        >
          All Events
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'saved'
            ? 'border-orange-600 text-orange-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
        >
          Saved
        </button>
      </div>

      {activeTab === 'all' && (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedStatus === status
                ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20 scale-105'
                : 'bg-white border-slate-100 text-slate-600 hover:border-orange-600'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {displayEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => router.push(`/dashboard/vendors/event/${event.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-100">
          <div className="text-slate-400 space-y-2">
            <p className="text-lg font-bold">No events found</p>
            <p className="text-sm">
              {activeTab === 'saved' ? "You haven't saved any events yet." : 'Check back soon for new opportunities!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorEvents;
