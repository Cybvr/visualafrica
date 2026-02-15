"use client";

import * as React from 'react';
import { useState } from 'react';
import { Layout, Eye, Calendar, MapPin, Plus } from 'lucide-react';
import { Event } from '@/lib/events-data';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PlanTabProps {
    event: Event;
}

const PlanTab: React.FC<PlanTabProps> = ({ event }) => {
    const [isPublic, setIsPublic] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Editing Sections */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 text-foreground rounded-xl flex items-center justify-center">
                        <Layout size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Event Details </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card p-10 rounded-[3rem] border border-border shadow-sm">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Display Name</label>
                        <Input type="text" defaultValue={event.name} className=" border-none px-6 py-4 h-auto rounded-2xl font-bold focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Region / Locale</label>
                        <Input type="text" defaultValue={event.location} className=" border-none px-6 py-4 h-auto rounded-2xl font-bold focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date</label>
                        <Input type="text" defaultValue={event.date} className=" border-none px-6 py-4 h-auto rounded-2xl font-bold focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Guest Count</label>
                        <Input type="number" defaultValue={event.guestCount} className=" border-none px-6 py-4 h-auto rounded-2xl font-bold focus-visible:ring-primary" />
                    </div>
                    <div className="md:col-span-2 space-y-2 pt-4">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Planning Brief</label>
                        <Textarea rows={4} defaultValue={event.description} className="border-none px-6 py-4 rounded-2xl font-medium focus-visible:ring-primary resize-none" />
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-foreground rounded-xl flex items-center justify-center">
                            <Plus size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Public Gallery</h3>
                    </div>
                    <button className="text-accent text-sm font-bold">Add Photo</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {event.publicGallery?.map((img, i) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 relative group">
                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="text-white text-xs font-bold bg-red-600 px-3 py-1 rounded-lg">Remove</button>
                            </div>
                        </div>
                    ))}
                    <button className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-accent transition-all text-muted-foreground hover:text-accent">
                        <Plus size={24} />
                        <span className="text-[10px] font-black uppercase tracking-wider">Upload</span>
                    </button>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-foreground rounded-xl flex items-center justify-center">
                            <Plus size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Success Metrics</h3>
                    </div>
                    <button className="text-accent text-sm font-bold">Add Metric</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {event.metrics?.map((metric, i) => (
                        <div key={i} className="bg-card p-6 rounded-[2rem] border border-border shadow-sm group relative">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{metric.label}</p>
                            <p className="text-2xl font-black text-foreground">{metric.value}</p>
                            <button className="absolute top-4 right-4 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                                <Plus size={14} className="rotate-45" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Community Visibility */}
            <section className="bg-card p-10 rounded-[3rem] border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent text-accent rounded-2xl flex items-center justify-center"><Eye size={24} /></div>
                    <div>
                        <h4 className="font-black text-foreground">Show in Community Inspiration</h4>
                        <p className="text-sm text-muted-foreground font-medium">Other users can see your theme and vendor choices.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${isPublic ? 'bg-primary' : 'bg-slate-200'}`}
                >
                    <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${isPublic ? 'translate-x-6' : ''}`} />
                </button>
            </section>

            <div className="flex justify-end gap-4">
                <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                    Save All Changes
                </button>
            </div>
        </div>
    );
};

export default PlanTab;