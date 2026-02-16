"use client";

import React from 'react';
import { FileText, Calendar, MapPin, Target } from 'lucide-react';
import { WorkspaceCard } from './JobWorkspace';
import { Event } from '@/lib/events-data';

interface JobBriefProps {
    event: Event;
    service?: string;
}

export default function JobBrief({ event, service }: JobBriefProps) {
    return (
        <WorkspaceCard className="space-y-10">
            {/* Main Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Target size={12} className="text-primary" />
                        Job Type
                    </div>
                    <p className="font-bold text-foreground">{service || event.categories[0]}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Calendar size={12} className="text-primary" />
                        Event Date
                    </div>
                    <p className="font-bold text-foreground">{event.date}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <MapPin size={12} className="text-primary" />
                        Location
                    </div>
                    <p className="font-bold text-foreground">{event.location}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <FileText size={12} className="text-primary" />
                        Project ID
                    </div>
                    <p className="font-bold text-foreground">#PRJ-{event.id.toUpperCase()}</p>
                </div>
            </div>

            <div className="h-px bg-border/50" />

            <div className="space-y-8">
                <div>
                    <h3 className="text-base font-black uppercase tracking-widest text-foreground mb-4 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        Event Description
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {event.description}
                    </p>
                </div>

                {event.itinerary && (
                    <div>
                        <h3 className="text-base font-black uppercase tracking-widest text-foreground mb-4 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            Timeline & Itinerary
                        </h3>
                        <div className="bg-secondary/20 rounded-[1.5rem] p-6 border border-border/50">
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                                {event.itinerary}
                            </p>
                        </div>
                    </div>
                )}

                {event.themes && event.themes.length > 0 && (
                    <div>
                        <h3 className="text-base font-black uppercase tracking-widest text-foreground mb-4 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            Design Themes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {event.themes.map((theme, i) => (
                                <span key={i} className="px-4 py-2 bg-secondary rounded-full text-xs font-bold text-foreground border border-border/50">
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </WorkspaceCard>
    );
}
