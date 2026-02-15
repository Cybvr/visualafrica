"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
    MapPin, Calendar, Users, Target, Clock, Rocket,
    ChevronLeft, Mail, Phone, FileText, Download, Send, CheckCircle2, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SHARED_EVENTS } from '@/lib/shared-data';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import VendorInboxTab from '@/components/dashboard/event-tabs/VendorInboxTab';

// Mock messages data
const MOCK_MESSAGES = [
    { id: 1, sender: 'host', text: 'Hello! Thanks for accepting our event booking.', time: '10:30 AM' },
    { id: 2, sender: 'vendor', text: 'Hi, thank you for choosing us! I\'m excited to work with you.', time: '10:35 AM' },
    { id: 3, sender: 'host', text: 'Great! Can we schedule a call to discuss the final details?', time: '10:45 AM' },
];

export default function VendorJobDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    // Find booking from dashboard data or derive from SHARED_EVENTS
    const booking = VENDOR_DASHBOARD_DATA.bookings.find(b => b.id === id);
    // Extract shared event ID from job ID (e.g. b-ev-001-0 -> ev-001)
    // We split by hyphen and take everything between the first 'b-' and the last index
    const parts = id.split('-');
    const eventId = id.includes('-') ? parts.slice(1, -1).join('-') : id;
    const event = SHARED_EVENTS.find(e => e.id === eventId);

    const [activeTab, setActiveTab] = useState("overview");

    if (!event || !booking) {
        return notFound();
    }

    const vendorBooking = event.bookedVendors.find(
        bv => bv.vendorId === VENDOR_DASHBOARD_DATA.currentVendorId
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Job Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/dashboard/vendors/jobs" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm font-medium">
                            <ChevronLeft size={16} />
                            Back to Jobs
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'
                            }`}>
                            {booking.status}
                        </span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">{event.eventName}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 rounded-full">
                        <Phone size={16} />
                        Call Host
                    </Button>
                    <Button className="gap-2 rounded-full">
                        <Mail size={16} />
                        Message
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
                        Event Details
                    </TabsTrigger>
                    <TabsTrigger
                        value="contract"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground"
                    >
                        Contract
                    </TabsTrigger>
                    <TabsTrigger
                        value="inbox"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground"
                    >
                        Inbox
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Visual Summary Banner */}
                        <div className="bg-background rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black">{event.eventName}</h3>
                                    <div className="flex flex-wrap gap-6 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={20} className="text-accent" />
                                            <span className="font-bold text-lg text-white">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={20} className="text-accent" />
                                            <span className="font-bold text-lg text-white">{event.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md text-center">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Contract Value</p>
                                        <p className="text-2xl font-black text-green-500">{booking.amount}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md text-center">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-2xl font-black">{booking.status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Background decorative element */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-accent text-accent rounded-2xl flex items-center justify-center mb-4"><Target size={20} /></div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Role</h4>
                                <p className="text-lg font-bold text-foreground">{vendorBooking?.service || "Vendor"}</p>
                            </div>
                            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><Users size={20} /></div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Client</h4>
                                <p className="text-lg font-bold text-foreground truncate w-full">{event.hostName}</p>
                            </div>
                            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4"><Clock size={20} /></div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Payment</h4>
                                <p className="text-sm font-bold text-foreground italic">{booking.status === 'Confirmed' ? 'Scheduled' : 'Paid'}</p>
                            </div>
                            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4"><Users size={20} /></div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Guests</h4>
                                <p className="text-lg font-bold text-foreground">{event.guestCount}</p>
                            </div>
                        </div>

                        {/* Host Information */}
                        <div className="bg-card p-8 rounded-[3rem] border border-border shadow-sm">
                            <h3 className="text-xl font-black text-foreground mb-6">About the client</h3>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-secondary overflow-hidden">
                                    <img src={event.image || '/placeholder.png'} alt={event.hostName} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-foreground">{event.hostName}</h4>
                                    <p className="text-muted-foreground">Premium Event Host</p>
                                    <div className="flex gap-3 mt-3">
                                        <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold px-4">View Profile</Button>
                                        <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold px-4">Past Work</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* DETAILS TAB */}
                    <TabsContent value="details" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm">
                            <h3 className="text-2xl font-black text-foreground mb-4">Event Description</h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">{event.description}</p>

                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <h4 className="text-lg font-black text-foreground uppercase tracking-widest text-sm border-b pb-2">Location & Schedule</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="text-primary" size={20} />
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Venue</p>
                                                <p className="font-bold">{event.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-primary" size={20} />
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date</p>
                                                <p className="font-bold">{event.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-lg font-black text-foreground uppercase tracking-widest text-sm border-b pb-2">Logistics</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Users className="text-primary" size={20} />
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Expected Attendance</p>
                                                <p className="font-bold">{event.guestCount} Guests</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Target className="text-primary" size={20} />
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Event Type</p>
                                                <p className="font-bold">Premium Experience</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* CONTRACT TAB */}
                    <TabsContent value="contract" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-card p-8 rounded-[3rem] border border-border shadow-sm">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-foreground">Service Agreement</h3>
                                    <p className="text-muted-foreground mt-1">Contract #{id.substring(2)}</p>
                                </div>
                                <span className={`px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-wider ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>{booking.status}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                <div className="p-6 bg-secondary/30 rounded-3xl border border-border">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Contract Value</div>
                                    <div className="text-2xl font-black text-foreground">{booking.amount}</div>
                                </div>
                                <div className="p-6 bg-secondary/30 rounded-3xl border border-border">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Service category</div>
                                    <div className="text-lg font-bold text-foreground">{vendorBooking?.service || "Standard"}</div>
                                </div>
                                <div className="p-6 bg-secondary/30 rounded-3xl border border-border">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Payment Terms</div>
                                    <div className="text-lg font-bold text-foreground italic">Net 30</div>
                                </div>
                            </div>

                            <h4 className="font-black text-foreground mb-4">Contract Documents</h4>
                            <div className="space-y-3">
                                {[
                                    { name: 'Signed Contract.pdf', icon: FileText },
                                    { name: 'Service Invoice.pdf', icon: FileText },
                                    { name: 'Compliance Records.pdf', icon: FileText }
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent text-accent flex items-center justify-center">
                                                <doc.icon size={20} />
                                            </div>
                                            <span className="font-bold text-foreground">{doc.name}</span>
                                        </div>
                                        <button className="text-muted-foreground group-hover:text-foreground transition-colors">
                                            <Download size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* INBOX TAB */}
                    <TabsContent value="inbox" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <VendorInboxTab focusedEventId={event.id} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
