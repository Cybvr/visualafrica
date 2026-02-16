"use client";

import React from 'react';
import { Globe, Users, Mail, Plus, ExternalLink } from 'lucide-react';

import { Event } from '@/lib/events-data';

interface GuestsTabProps {
    event: Event;
}

const GuestsTab: React.FC<GuestsTabProps> = ({ event }) => {
    const confirmedCount = event.guests.filter(g => g.status === 'Confirmed').length;
    const pendingCount = event.guests.filter(g => g.status === 'Pending').length;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Guest Portal</h2>
                <button className="bg-primary text-foreground px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Plus size={16} />
                    Add Guest
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-foreground">Registration List</h3>
                            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full" /> {confirmedCount} Going</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-amber-500 rounded-full" /> {pendingCount} Pending</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {event.guests.length > 0 ? event.guests.map((guest, i) => (
                                <div key={guest.id} className="flex items-center justify-between p-4 bg-card rounded-2xl group hover:bg-white border border-transparent hover:border-border transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-accent text-accent font-bold flex items-center justify-center rounded-full uppercase">
                                            {guest.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{guest.name}</p>
                                            <p className="text-xs text-foreground uppercase font-bold tracking-tight">{guest.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${guest.status === 'Confirmed' ? 'bg-green-100 text-green-700' : (guest.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}`}>
                                            {guest.status}
                                        </span>
                                        <button title={`Email ${guest.email}`} className="p-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><Mail size={16} /></button>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-12 text-center text-muted-foreground font-medium">
                                    No guests registered yet.
                                </div>
                            )}
                        </div>
                        {event.guests.length > 0 && (
                            <button className="w-full mt-6 py-3 border border-border text-foreground font-bold text-sm rounded-2xl hover:bg-card transition-colors">
                                Load more guests
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-background text-foreground rounded-3xl p-8 space-y-6 shadow-xl shadow-slate-900/20">
                        <div className="flex items-center justify-between">
                            <Globe className="text-primary" size={32} />
                            <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded border border-green-500/30">Live</div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">RSVP Website</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Your custom guest portal is live at:<br /><span className="text-foreground font-medium">Waddi.events/{event.name.toLowerCase().replace(/\s+/g, '-')}</span></p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-white text-foreground py-3 rounded-xl font-bold text-sm hover:bg-card">Edit Site</button>
                            <button className="p-3 bg-background rounded-xl hover:bg-slate-700"><ExternalLink size={20} /></button>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
                        <h3 className="font-bold text-foreground text-lg">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-4 p-4 hover:bg-card rounded-2xl transition-all border border-border group">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-foreground transition-all"><Mail size={20} /></div>
                                <div className="text-left">
                                    <p className="font-bold text-sm text-foreground">Send Email Invite</p>
                                    <p className="text-xs text-muted-foreground">Remind pending guests</p>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-4 p-4 hover:bg-card rounded-2xl transition-all border border-border group">
                                <div className="w-10 h-10 bg-accent text-accent rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-foreground transition-all"><Users size={20} /></div>
                                <div className="text-left">
                                    <p className="font-bold text-sm text-foreground">Export List</p>
                                    <p className="text-xs text-muted-foreground">Download CSV/PDF</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestsTab;
