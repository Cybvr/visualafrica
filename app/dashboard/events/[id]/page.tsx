"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    MapPin, Calendar, Users, Target, Clock, Rocket,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EVENTS } from '@/lib/events-data';
import { vendors } from '@/lib/vendors-data';
import VendorCard from '@/components/dashboard/VendorCard';
import ItineraryCard from '@/components/dashboard/ItineraryCard';
import GuestManagementCard from '@/components/dashboard/GuestManagementCard';
import PlanTab from '@/components/dashboard/event-tabs/PlanTab';
import ItineraryTab from '@/components/dashboard/event-tabs/ItineraryTab';
import GuestsTab from '@/components/dashboard/event-tabs/GuestsTab';
import VendorsTab from '@/components/dashboard/event-tabs/VendorsTab';

// Helper to format date range (mock implementation based on previous usage)
const formatEventDateRange = (startDate: string, endDate: string) => {
    return `${startDate} - ${endDate}`;
};

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const event = EVENTS.find(e => e.id === id);
    const [activeTab, setActiveTab] = useState("overview");

    if (!event) {
        return notFound();
    }

    // Mocking some data that was previously in eventData
    const eventData = {
        ...event,
        startDate: 'May 28, 2025',
        endDate: 'Jun 4, 2025',
        budgetTotal: event.budget,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Event Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/dashboard/events" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm font-medium">
                            <ChevronLeft size={16} />
                            Back to Events
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {event.status}
                        </span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">{event.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <Button className="gap-2">
                        <Rocket size={16} />
                        Publish
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b border-border rounded-none space-x-6 overflow-x-auto">
                    <TabsTrigger
                        value="overview"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="details"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground"
                    >
                        Details
                    </TabsTrigger>
                    <TabsTrigger
                        value="vendors"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground"
                    >
                        Vendors
                    </TabsTrigger>
                    <TabsTrigger
                        value="itinerary"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground"
                    >
                        Itinerary
                    </TabsTrigger>
                    <TabsTrigger
                        value="guests"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground"
                    >
                        Guests
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Visual Summary Banner */}
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-6 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={20} className="text-orange-600" />
                                            <span className="font-bold text-lg text-white">{eventData.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={20} className="text-orange-600" />
                                            <span className="font-bold text-lg text-white">{formatEventDateRange(eventData.startDate, eventData.endDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md text-center">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Guests</p>
                                        <p className="text-2xl font-black">{eventData.guestCount}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md text-center">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Budget</p>
                                        <p className="text-2xl font-black text-green-500">₦{(eventData.budgetTotal || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Background decorative element */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4"><Target size={20} /></div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</h4>
                                <p className="text-lg font-bold text-foreground">{eventData.status}</p>
                            </div>
                            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><MapPin size={20} /></div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Location</h4>
                                <p className="text-lg font-bold text-foreground truncate w-full">{eventData.location.split(',')[0]}</p>
                            </div>
                            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4"><Clock size={20} /></div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Timeline</h4>
                                <p className="text-sm font-bold text-foreground italic">May – June</p>
                            </div>
                            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4"><Users size={20} /></div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Audience</h4>
                                <p className="text-lg font-bold text-foreground">{eventData.guestCount} Guests</p>
                            </div>
                        </div>

                        {/* Booked Vendors Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-foreground">Your booked vendors</h3>
                                <div className="cursor-pointer text-primary" onClick={() => setActiveTab("vendors")}>
                                    <Button variant="ghost" size="sm">View All</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {vendors.slice(0, 4).map(vendor => (
                                    <div key={vendor.id} className="h-full">
                                        <VendorCard {...vendor} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Secondary Row: Itinerary and Guest Management */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-12 xl:col-span-7 cursor-pointer hover:scale-[1.01] transition-transform">
                                <Link href="/dashboard/itinerary">
                                    <ItineraryCard />
                                </Link>
                            </div>
                            <div className="lg:col-span-12 xl:col-span-5 cursor-pointer hover:scale-[1.01] transition-transform">
                                <Link href="/dashboard/guest-website">
                                    <GuestManagementCard />
                                </Link>
                            </div>
                        </div>

                    </TabsContent>

                    {/* DETAILS TAB */}
                    <TabsContent value="details">
                        <PlanTab event={event} />
                    </TabsContent>

                    {/* VENDORS TAB */}
                    <TabsContent value="vendors" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <VendorsTab />
                    </TabsContent>

                    {/* ITINERARY TAB */}
                    <TabsContent value="itinerary">
                        <ItineraryTab />
                    </TabsContent>

                    {/* GUESTS TAB */}
                    <TabsContent value="guests">
                        <GuestsTab />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
