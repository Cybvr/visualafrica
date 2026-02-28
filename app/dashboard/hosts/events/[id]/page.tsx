"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    MapPin, Calendar, Users, Rocket,
    ChevronLeft, Share2, Printer, Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listenToEventById } from '@/lib/firestore-service';
import { SharedEvent } from '@/lib/types';
import PlanTab from '@/components/dashboard/event-tabs/PlanTab';
import GuestsTab from '@/components/dashboard/event-tabs/GuestsTab';
import VendorsTab from '@/components/dashboard/event-tabs/VendorsTab';
import ContractsTab from '@/components/dashboard/event-tabs/ContractsTab';
import InboxTab from '@/components/dashboard/event-tabs/InboxTab';
import { TaskChecklist, DayOfTimeline } from '@/components/dashboard/chat';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get active tab from URL or default to 'overview'
    const currentTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(currentTab);
    const [activeFilter, setActiveFilter] = useState<'all' | 'local' | 'docs'>('all');
    const [event, setEvent] = useState<SharedEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sync state with URL
    useEffect(() => {
        setActiveTab(currentTab);
    }, [currentTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        const unsubscribe = listenToEventById(id, (eventData) => {
            setEvent(eventData);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    if (isLoading) {
        return <div className="max-w-4xl mx-auto py-12 text-center text-muted-foreground">Loading event...</div>;
    }

    if (!event) {
        return <div className="max-w-4xl mx-auto py-12 text-center text-muted-foreground">Event not found.</div>;
    }

    const navItems: Array<{ value: string; label: string; meta: string; scope: 'local' | 'docs' }> = [
        { value: "overview", label: "Overview", meta: "Event plan", scope: "local" },
        { value: "vendors", label: "Vendors", meta: `${event.bookedVendors.length} booked`, scope: "local" },
        { value: "guests", label: "Guests", meta: `${event.guests.length} invited`, scope: "local" },
        { value: "contracts", label: "Contracts", meta: "Uploaded docs", scope: "docs" },
        { value: "inbox", label: "Inbox", meta: "Messages", scope: "local" },
        { value: "itinerary", label: "Itinerary", meta: "Agent generated", scope: "docs" },
        { value: "todo", label: "To-Do List", meta: "Agent checklist", scope: "docs" },
    ];

    const filteredNavItems = navItems.filter((item) =>
        activeFilter === 'all' ? true : item.scope === activeFilter
    );

    const renderActivePanel = () => {
        if (activeTab === "overview") {
            return <PlanTab event={event} />;
        }
        if (activeTab === "vendors") {
            return <VendorsTab event={event} />;
        }
        if (activeTab === "guests") {
            return <GuestsTab event={event} />;
        }
        if (activeTab === "contracts") {
            return <ContractsTab eventId={id} bookedVendors={event.bookedVendors} />;
        }
        if (activeTab === "inbox") {
            return <InboxTab />;
        }
        if (activeTab === "itinerary") {
            return (
                <DayOfTimeline
                    events={event ? [event] : []}
                    selectedEventId={id}
                    onEventChange={() => { }}
                />
            );
        }
        if (activeTab === "todo") {
            return (
                <TaskChecklist
                    events={event ? [event] : []}
                    selectedEventId={id}
                    onEventChange={() => { }}
                />
            );
        }
        return <PlanTab event={event} />;
    };

    const activeItem = navItems.find((item) => item.value === activeTab) ?? navItems[0];

    return (
        <div className="max-w-7xl mx-auto space-y-6 py-6">
            {/* Header with navigation and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/hosts/events" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ChevronLeft size={16} />
                        Back to Events
                    </Link>
                    <span className="text-muted">•</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded border bg-primary/10 text-primary border-primary/20">
                        {event.status}
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Event title and basic info */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">{event.eventName}</h1>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1 text-sm">
                            <MapPin size={16} className="text-muted-foreground" />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <Calendar size={16} className="text-muted-foreground" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <Users size={16} className="text-muted-foreground" />
                            <span>{event.guestCount} guests</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <Ticket size={16} className="text-muted-foreground" />
                            <span>{event.ticketPrice ? `₦${event.ticketPrice.toLocaleString('en-NG')}` : 'Free'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <span className="font-medium text-success">₦{(event.budget || 0).toLocaleString('en-NG')}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
                    <aside className="space-y-2">
                        <div className="flex items-center gap-1.5">
                                {[
                                    { key: 'all' as const, label: 'All' },
                                    { key: 'local' as const, label: 'Local' },
                                    { key: 'docs' as const, label: 'Documents' },
                                ].map((filter) => {
                                const selected = activeFilter === filter.key;
                                return (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() => setActiveFilter(filter.key)}
                                        className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${selected
                                            ? "bg-foreground text-background"
                                            : "bg-secondary text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>

                        {filteredNavItems.map((item) => {
                            const isActive = activeTab === item.value;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => handleTabChange(item.value)}
                                    className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${isActive
                                        ? "bg-card border-border"
                                        : "bg-secondary/30 border-transparent hover:bg-card hover:border-border"
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate">{item.label}</p>
                                            <p className="text-xs text-muted-foreground truncate">{item.meta}</p>
                                        </div>
                                        <span className="text-base leading-none text-muted-foreground">...</span>
                                    </div>
                                </button>
                            );
                        })}
                    </aside>

                    <section className="min-w-0 bg-card border border-border rounded-2xl p-3 md:p-4">
                        <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-3">
                            <p className="text-sm font-bold text-foreground">{activeItem.label}</p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-md px-2.5">
                                    <Share2 size={14} />
                                    Share
                                </Button>
                                {activeTab === 'contracts' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1.5 rounded-md px-2.5 border-accent text-accent hover:bg-accent/5"
                                        onClick={() => typeof window !== 'undefined' && window.print()}
                                    >
                                        <Printer size={14} />
                                        Print
                                    </Button>
                                )}
                                <Button size="sm" className="h-8 gap-1.5 rounded-md px-2.5">
                                    <Rocket size={14} />
                                    Publish
                                </Button>
                            </div>
                        </div>
                        {renderActivePanel()}
                    </section>
                </div>
            </div>
        </div>
    );
}
