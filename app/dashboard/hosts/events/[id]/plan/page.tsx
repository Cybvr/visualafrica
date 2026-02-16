"use client";

import * as React from 'react';
import { useState } from 'react';
import { MapPin, Calendar, DollarSign, Users, Layout, Image, Eye, Target, Map, Clock } from 'lucide-react';
import { eventData, formatEventDateRange, formatCurrency } from '@/lib/event-data';

const PlanPage: React.FC = () => {
  const [isPublic, setIsPublic] = useState(eventData.showCommunityInspiration);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Editing Sections */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-card text-foreground rounded-xl flex items-center justify-center">
            <Layout size={20} />
          </div>
          <h3 className="text-xl font-bold text-foreground">Event Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-10 rounded-[3rem] border border-border shadow-sm">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Display Name</label>
            <input type="text" defaultValue={eventData.name} className="w-full bg-secondary border-none px-6 py-4 rounded-2xl text-foreground font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Region / Locale</label>
            <input type="text" defaultValue={eventData.location} className="w-full bg-secondary border-none px-6 py-4 rounded-2xl text-foreground font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Start</label>
            <input type="date" defaultValue={eventData.startDate} className="w-full bg-secondary border-none px-6 py-4 rounded-2xl text-foreground font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">End</label>
            <input type="date" defaultValue={eventData.endDate} className="w-full bg-secondary border-none px-6 py-4 rounded-2xl text-foreground font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Categories</label>
            <input type="text" defaultValue={eventData.categories?.join(', ')} placeholder="Wedding, Outdoor..." className="w-full bg-secondary border-none px-6 py-4 rounded-2xl text-foreground font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Design Themes</label>
            <input type="text" defaultValue={eventData.themes?.join(', ')} placeholder="Modern, Luxury..." className="w-full bg-secondary border-none px-6 py-4 rounded-2xl text-foreground font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="md:col-span-2 space-y-2 pt-4">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Event Description</label>
            <textarea rows={4} defaultValue={eventData.description} className="w-full bg-secondary border-none px-6 py-4 rounded-2xl text-foreground font-medium focus:ring-2 focus:ring-primary outline-none resize-none" />
          </div>
          <div className="md:col-span-2 space-y-2 pt-4">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Itinerary</label>
            <textarea rows={4} defaultValue={eventData.itinerary} placeholder="Outline the main events..." className="w-full bg-secondary border-none px-6 py-4 rounded-2xl text-foreground font-medium focus:ring-2 focus:ring-primary outline-none resize-none" />
          </div>
        </div>
      </section>



      <div className="flex justify-end gap-4">
        <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default PlanPage;
