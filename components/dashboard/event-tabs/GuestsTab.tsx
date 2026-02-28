"use client";

import React from 'react';
import { Users, Mail, Plus, ExternalLink } from 'lucide-react';

import { SharedEvent } from '@/lib/types';

interface GuestsTabProps {
    event: SharedEvent;
}

const GuestsTab: React.FC<GuestsTabProps> = ({ event }) => {
    const confirmedCount = event.guests.filter(g => g.status === 'Confirmed').length;
    const pendingCount = event.guests.filter(g => g.status === 'Pending').length;

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Guests</h2>
                <button className="h-8 px-3 rounded-md text-sm font-medium border border-border bg-background text-foreground flex items-center gap-1.5 hover:bg-card">
                    <Plus size={16} />
                    Add Guest
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-4">
                    <div className="border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-foreground">Registration List</h3>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{confirmedCount} Going</span>
                                <span>{pendingCount} Pending</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {event.guests.length > 0 ? event.guests.map((guest) => (
                                <div key={guest.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-secondary text-foreground text-xs font-bold flex items-center justify-center rounded-full uppercase">
                                            {guest.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{guest.name}</p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-tight">{guest.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${guest.status === 'Confirmed'
                                            ? 'bg-secondary text-foreground border-border'
                                            : (guest.status === 'Pending'
                                                ? 'bg-secondary text-muted-foreground border-border'
                                                : 'bg-secondary text-foreground border-border')
                                            }`}>
                                            {guest.status}
                                        </span>
                                        <button title={`Email ${guest.email}`} className="p-1.5 text-muted-foreground hover:text-foreground"><Mail size={15} /></button>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-8 text-center text-muted-foreground text-sm">
                                    No guests registered yet.
                                </div>
                            )}
                        </div>
                        {event.guests.length > 0 && (
                            <button className="w-full mt-4 h-9 border border-border text-foreground text-sm rounded-md hover:bg-card transition-colors">
                                Load more guests
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="border border-border rounded-xl p-4 space-y-3 bg-background">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-foreground">RSVP Page</h3>
                            <div className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded border border-border text-muted-foreground">Live</div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Your RSVP page is live at:
                            <br />
                            <span className="text-foreground font-medium">Waddi.events/{event.eventName.toLowerCase().replace(/\s+/g, '-')}</span>
                        </p>
                        <div className="flex gap-2">
                            <button className="flex-1 h-8 border border-border rounded-md text-sm font-medium hover:bg-card">Edit Page</button>
                            <button className="h-8 w-8 border border-border rounded-md inline-flex items-center justify-center hover:bg-card"><ExternalLink size={16} /></button>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-3 p-3 hover:bg-card rounded-md transition-colors border border-border">
                                <div className="w-8 h-8 bg-secondary text-muted-foreground rounded-md flex items-center justify-center"><Mail size={16} /></div>
                                <div className="text-left">
                                    <p className="font-semibold text-sm text-foreground">Send Email Invite</p>
                                    <p className="text-xs text-muted-foreground">Remind pending guests</p>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 hover:bg-card rounded-md transition-colors border border-border">
                                <div className="w-8 h-8 bg-secondary text-muted-foreground rounded-md flex items-center justify-center"><Users size={16} /></div>
                                <div className="text-left">
                                    <p className="font-semibold text-sm text-foreground">Export List</p>
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
