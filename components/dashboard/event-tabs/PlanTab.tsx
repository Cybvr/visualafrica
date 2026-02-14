"use client";

import * as React from 'react';
import { useState } from 'react';
import { Layout, Eye } from 'lucide-react';
import { eventData } from '@/lib/event-data';

const PlanTab: React.FC = () => {
    const [isPublic, setIsPublic] = useState(eventData.showCommunityInspiration);

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Editing Sections */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center">
                        <Layout size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Event Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card p-10 rounded-[3rem] border border-border shadow-sm">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Display Name</label>
                        <input type="text" defaultValue={eventData.name} className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-orange-600 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Region / Locale</label>
                        <input type="text" defaultValue={eventData.location} className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-orange-600 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Start</label>
                        <input type="date" defaultValue={eventData.startDate} className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-orange-600 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">End</label>
                        <input type="date" defaultValue={eventData.endDate} className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-orange-600 outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2 pt-4">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Planning Brief</label>
                        <textarea rows={4} defaultValue={eventData.description} className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-orange-600 outline-none resize-none" />
                    </div>
                </div>
            </section>

            {/* Community Visibility */}
            <section className="bg-card p-10 rounded-[3rem] border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><Eye size={24} /></div>
                    <div>
                        <h4 className="font-black text-foreground">Show in Community Inspiration</h4>
                        <p className="text-sm text-muted-foreground font-medium">Other users can see your theme and vendor choices.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${isPublic ? 'bg-orange-600' : 'bg-slate-200'}`}
                >
                    <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${isPublic ? 'translate-x-6' : ''}`} />
                </button>
            </section>

            <div className="flex justify-end gap-4">
                <button className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black shadow-xl shadow-orange-600/20 hover:scale-105 transition-transform active:scale-95">
                    Save All Changes
                </button>
            </div>
        </div>
    );
};

export default PlanTab;
