"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Users, Plus, Loader2, Ticket } from 'lucide-react';
import { getEvents } from '@/lib/firestore-service';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { SharedEvent } from '@/lib/types';

export default function EventsPage() {
    const { user, loading: authLoading } = useAuth();
    const [events, setEvents] = useState<SharedEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            if (user) {
                try {
                    const userEvents = await getEvents(user.uid);
                    setEvents(userEvents);
                } catch (error) {
                    console.error("Error fetching events:", error);
                } finally {
                    setLoading(false);
                }
            } else if (!authLoading) {
                setLoading(false);
            }
        }
        fetchEvents();
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-9 w-48 bg-muted animate-pulse rounded-lg" />
                        <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-3xl p-4 flex flex-col md:flex-row gap-6 animate-pulse">
                            <div className="w-full md:w-72 h-48 md:h-40 rounded-2xl bg-muted shrink-0" />
                            <div className="flex-1 py-2 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-6 w-24 bg-muted rounded-full" />
                                        <div className="h-4 w-32 bg-muted rounded" />
                                    </div>
                                    <div className="h-8 w-3/4 bg-muted rounded mb-3" />
                                    <div className="h-4 w-full bg-muted rounded" />
                                </div>
                                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                                    <div className="h-4 w-24 bg-muted rounded" />
                                    <div className="h-4 w-24 bg-muted rounded" />
                                    <div className="h-4 w-24 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">My Events</h2>
                    <p className="text-muted-foreground mt-1">Manage all your upcoming and past events.</p>
                </div>
                <Link href="/dashboard/hosts/events/new">
                    <Button className="rounded-full gap-2 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all">
                        <Plus size={18} />
                        Create Event
                    </Button>
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] p-8 md:p-16 text-center space-y-6">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center mx-auto text-primary mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Calendar size={48} className="drop-shadow-sm" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-foreground">No events yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto text-lg mt-2">
                            Ready to create something amazing? Start planning your first event today!
                        </p>
                    </div>

                    <Link href="/dashboard/hosts/events/new" className="inline-block relative z-10">
                        <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                            Create First Event
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {events.map((event) => (
                        <Link
                            key={event.id}
                            href={`/dashboard/hosts/events/${event.id}`}
                            className="group bg-card border border-border rounded-3xl p-4 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all hover:border-primary/50 cursor-pointer"
                        >
                            {/* Event Image */}
                            <div className="relative w-full md:w-72 h-48 md:h-auto rounded-2xl overflow-hidden shrink-0">
                                <Image
                                    src={event.image || '/placeholder.png'}
                                    alt={event.eventName}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                <div className="absolute bottom-4 left-4 text-white md:hidden">
                                    <span className="px-2 py-1 bg-primary text-[10px] font-bold uppercase tracking-widest rounded-md">
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            {/* Event Info */}
                            <div className="flex-1 py-2 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="hidden md:inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                                            {event.status}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">ID: #{event.id}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {event.eventName}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 max-w-2xl leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-6 pt-6 border-t border-border">
                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                            <Calendar size={16} />
                                        </div>
                                        <span className="font-semibold">{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="font-semibold">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                            <Users size={16} />
                                        </div>
                                        <span className="font-semibold">{event.guestCount} Guests</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                            <Ticket size={16} />
                                        </div>
                                        <span className="font-semibold">
                                            {event.ticketPrice ? `₦${event.ticketPrice.toLocaleString('en-NG')}` : 'Free'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
