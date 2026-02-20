"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    MapPin, Calendar, Users, Target, Clock, Rocket,
    ChevronLeft, Share2, Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EVENTS } from '@/lib/events-data';
import PlanTab from '@/components/dashboard/event-tabs/PlanTab';
import GuestsTab from '@/components/dashboard/event-tabs/GuestsTab';
import VendorsTab from '@/components/dashboard/event-tabs/VendorsTab';
import ContractsTab from '@/components/dashboard/event-tabs/ContractsTab';
import InboxTab from '@/components/dashboard/event-tabs/InboxTab';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get active tab from URL or default to 'overview'
    const currentTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(currentTab);

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

    const event = EVENTS.find(e => e.id === id);

    if (!event) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-6">
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

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 bg-none border-border">
                        <Share2 size={16} />
                        Share
                    </Button>
                    {activeTab === 'contracts' && (
                        <Button
                            variant="outline"
                            className="gap-2 border-accent text-accent hover:bg-accent/5"
                            onClick={() => typeof window !== 'undefined' && window.print()}
                        >
                            <Printer size={16} />
                            Print
                        </Button>
                    )}
                    <Button className="gap-2">
                        <Rocket size={16} />
                        Publish
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Event title and basic info */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>

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
                            <span className="font-medium text-success">₦{(event.budget || 0).toLocaleString('en-NG')}</span>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border rounded-none">
                        <TabsTrigger
                            value="overview"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-4 py-2 text-sm font-medium"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="vendors"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-4 py-2 text-sm font-medium flex items-center gap-2"
                        >
                            Vendors
                            <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] font-black bg-secondary text-muted-foreground rounded-full border border-border group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground group-data-[state=active]:border-primary transition-colors">
                                {event.bookedVendors.length}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="guests"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-4 py-2 text-sm font-medium flex items-center gap-2"
                        >
                            Guests
                            <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] font-black bg-secondary text-muted-foreground rounded-full border border-border group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground group-data-[state=active]:border-primary transition-colors">
                                {event.guests.length}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="contracts"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-4 py-2 text-sm font-medium flex items-center gap-2"
                        >
                            Contracts
                            <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] font-black bg-secondary text-muted-foreground rounded-full border border-border group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground group-data-[state=active]:border-primary transition-colors">
                                {event.bookedVendors.length}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="inbox"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-4 py-2 text-sm font-medium"
                        >
                            Inbox
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="border-t border-border pt-6">
                            <PlanTab event={event} />
                        </div>
                    </TabsContent>

                    {/* Vendors Tab */}
                    <TabsContent value="vendors">
                        <VendorsTab event={event} />
                    </TabsContent>


                    {/* Guests Tab */}
                    <TabsContent value="guests">
                        <GuestsTab event={event} />
                    </TabsContent>

                    {/* Contracts Tab */}
                    <TabsContent value="contracts">
                        <ContractsTab eventId={id} bookedVendors={event.bookedVendors} />
                    </TabsContent>

                    {/* Inbox Tab */}
                    <TabsContent value="inbox">
                        <InboxTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
