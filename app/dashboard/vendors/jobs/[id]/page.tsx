"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { ChevronLeft, Mail, Phone, FileText, Download, MapPin, Calendar, Users, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SHARED_EVENTS } from '@/lib/shared-data';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import VendorInboxTab from '@/components/dashboard/event-tabs/VendorInboxTab';

export default function VendorJobDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const booking = VENDOR_DASHBOARD_DATA.bookings.find(b => b.id === id);
    const parts = id.split('-');
    const eventId = id.includes('-') ? parts.slice(1, -1).join('-') : id;
    const event = SHARED_EVENTS.find(e => e.id === eventId);
    const [activeTab, setActiveTab] = useState("overview");

    if (!event || !booking) return notFound();

    const vendorBooking = event.bookedVendors.find(
        bv => bv.vendorId === VENDOR_DASHBOARD_DATA.currentVendorId
    );

    const statusVariant = booking.status === 'Confirmed'
        ? 'bg-success/10 text-success border-success/20'
        : 'bg-primary/10 text-primary border-primary/20';

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-6">
            {/* Header with navigation and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/vendors/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Jobs
                    </Link>
                    <span className="text-muted">•</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${statusVariant}`}>
                        {booking.status}
                    </span>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        <span className="sm:hidden">Call</span>
                        <span className="hidden sm:inline">Call Host</span>
                    </Button>
                    <Button size="sm" className="gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="sm:hidden">Message</span>
                        <span className="hidden sm:inline">Message</span>
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Event title and basic info first */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">{event.eventName}</h1>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{event.date}</span>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="overview" onValueChange={setActiveTab}>
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border rounded-none mb-4">
                        <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-4 py-2 text-sm">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="contract" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-4 py-2 text-sm">
                            Contract
                        </TabsTrigger>
                        <TabsTrigger value="inbox" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-4 py-2 text-sm">
                            Inbox
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab - Logical information flow */}
                    <TabsContent value="overview">
                        <div className="space-y-6">
                            {/* 1. Event description first - what is this event about */}
                            <div>
                                <h3 className="text-base font-medium text-foreground mb-2">Event Description</h3>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>

                            <div className="border-t border-border pt-6">
                                {/* 2. Client information - who is this for */}
                                <h3 className="text-base font-medium text-foreground mb-4">Client Information</h3>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={event.image || '/placeholder.png'}
                                        alt={event.hostName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{event.hostName}</h4>
                                        <p className="text-xs text-muted-foreground">Premium Event Host</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm">View Profile</Button>
                                        <Button variant="ghost" size="sm">Past Work</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border pt-6">
                                {/* 3. Booking details - what's my role */}
                                <h3 className="text-base font-medium text-foreground mb-4">Booking Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Your Role</div>
                                        <div className="flex items-center gap-1">
                                            <Target className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm">{vendorBooking?.service || "Vendor"}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Payment Status</div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm">{booking.status === 'Confirmed' ? 'Scheduled' : 'Paid'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Expected Guests</div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm">{event.guestCount}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Contract Value</div>
                                        <div className="text-sm font-medium text-success">{booking.amount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Contract Tab - Logical flow for contract information */}
                    <TabsContent value="contract">
                        <div className="space-y-6">
                            {/* 1. Contract summary first */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium">Service Agreement #{id.substring(2)}</h3>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${statusVariant}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>

                            {/* 2. Key contract terms */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Contract Value</div>
                                    <div className="font-medium">{booking.amount}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Service Category</div>
                                    <div className="font-medium">{vendorBooking?.service || "Standard"}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Payment Terms</div>
                                    <div className="font-medium">Net 30</div>
                                </div>
                            </div>

                            {/* 3. Documents last - supporting materials */}
                            <div className="border-t border-border pt-6">
                                <h4 className="text-base font-medium mb-3">Contract Documents</h4>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Signed Contract.pdf', icon: FileText },
                                        { name: 'Service Invoice.pdf', icon: FileText },
                                        { name: 'Compliance Records.pdf', icon: FileText }
                                    ].map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                                            <div className="flex items-center gap-3">
                                                <doc.icon className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{doc.name}</span>
                                            </div>
                                            <Download className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Inbox Tab */}
                    <TabsContent value="inbox">
                        <VendorInboxTab focusedEventId={event.id} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
