"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Plus } from 'lucide-react';
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
                    const userEvents = await getEvents(user.uid, user.email || undefined);
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
            <div className="w-full max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-9 w-48 bg-muted animate-pulse rounded-lg" />
                        <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border border-border rounded-md p-3 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-lg bg-muted shrink-0" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="h-3 w-16 bg-muted rounded" />
                                    <div className="h-4 w-3/4 bg-muted rounded" />
                                    <div className="h-3 w-5/6 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground">My Events</h2>
                </div>
                <Link href="/dashboard/hosts/events/new">
                    <Button className="rounded-full gap-2 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all">
                        <Plus size={18} />
                        New
                    </Button>
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="relative overflow-hidden bg-card border border-border rounded-lg p-8 md:p-16 text-center space-y-6">
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
                        <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                            New
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {events.map((event) => (
                        <Link
                            key={event.id}
                            href={`/dashboard/hosts/events/${event.id}`}
                            className="group border border-border rounded-md p-3 cursor-pointer hover:bg-card/50 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={event.image || '/placeholder.png'}
                                        alt={event.eventName}
                                        fill
                                        className="object-cover transition-transform duration-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        <Calendar size={13} aria-hidden="true" />
                                        {event.date}
                                    </p>
                                    <h3 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate">
                                        {event.eventName}
                                    </h3>
                                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                                        <MapPin size={13} aria-hidden="true" />
                                        {event.location || 'Location TBD'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
