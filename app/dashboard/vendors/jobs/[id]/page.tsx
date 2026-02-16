"use client";

import React, { useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { Mail, Phone, FileText, Download, MapPin, Calendar, Users, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SHARED_EVENTS } from '@/lib/shared-data';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import VendorInboxTab from '@/components/dashboard/event-tabs/VendorInboxTab';
import JobWorkspace, { WorkspaceCard, StatusIndicator } from '@/components/dashboard/JobWorkspace';

export default function VendorJobDetailsPage() {
    const params = useParams();
    const router = useRouter();
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

    const contextCard = (
        <WorkspaceCard className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 rounded-3xl bg-secondary overflow-hidden shrink-0 border border-border shadow-inner">
                    <img src={event.image || '/placeholder.png'} alt={event.eventName} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-4 w-full">
                    <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight">{event.eventName}</h2>
                        <div className="mt-2">
                            <StatusIndicator status={booking.status} label={booking.status} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground pt-1">
                        <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-foreground uppercase tracking-widest text-[10px]">
                            <Target size={14} className="text-muted-foreground" />
                            {vendorBooking?.service || "Vendor"}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-muted-foreground" />
                            <span className="text-foreground">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-muted-foreground" />
                            <span className="text-foreground">{event.date}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 pt-4 border-t border-border/50">
                        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0 border border-border">
                            <img src={event.image || '/placeholder.png'} alt={event.hostName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Client</p>
                            <h4 className="font-bold text-foreground">{event.hostName}</h4>
                        </div>
                        <div className="ml-auto flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest">Profile</Button>
                        </div>
                    </div>
                </div>
            </div>
        </WorkspaceCard>
    );

    const actionColumn = (
        <div className="sticky top-6 bg-card rounded-2xl border border-border p-6 space-y-6">
            <div>
                <p className="text-sm text-muted-foreground">Contract Value</p>
                <p className="text-3xl font-black text-foreground">{booking.amount}</p>
                <p className="text-xs text-muted-foreground mt-1">Payment: Net 30</p>
            </div>

            <div className="space-y-2">
                <Button className="w-full h-12 rounded-xl font-bold gap-2">
                    <Mail size={18} />
                    Message Host
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold gap-2">
                    <Phone size={18} />
                    Call Host
                </Button>
            </div>

            <hr className="border-border" />

            <div className="space-y-4">
                <h3 className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-3 rounded-xl border border-border/50">
                        <Users size={14} className="text-muted-foreground mb-1" />
                        <p className="text-xs font-black">{event.guestCount}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Guests</p>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-xl border border-border/50">
                        <Clock size={14} className="text-muted-foreground mb-1" />
                        <p className="text-xs font-black">Scheduled</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Timeline</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const tabs = [
        {
            id: 'inbox',
            label: 'Inbox',
            content: (
                <div className="overflow-hidden bg-card rounded-[2rem] border border-border">
                    <VendorInboxTab focusedEventId={event.id} />
                </div>
            )
        },
        {
            id: 'brief',
            label: 'Project Brief',
            content: (
                <WorkspaceCard>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-base font-black uppercase tracking-widest text-foreground mb-4">Event Description</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                {event.description}
                            </p>
                        </div>
                        {event.itinerary && (
                            <div>
                                <h3 className="text-base font-black uppercase tracking-widest text-foreground mb-4">Itinerary</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                                    {event.itinerary}
                                </p>
                            </div>
                        )}
                    </div>
                </WorkspaceCard>
            )
        },
        {
            id: 'contract',
            label: 'Contract',
            content: (
                <WorkspaceCard>
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-black tracking-tight">Service Agreement #{id.substring(2)}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Value</div>
                                <div className="font-bold">{booking.amount}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service</div>
                                <div className="font-bold">{vendorBooking?.service || "Standard"}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment</div>
                                <div className="font-bold">Net 30</div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border/50">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Documents</h4>
                            <div className="space-y-2">
                                {[
                                    { name: 'Signed Contract.pdf', icon: FileText },
                                    { name: 'Service Invoice.pdf', icon: FileText },
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl border border-transparent hover:border-border transition-all group">
                                        <div className="flex items-center gap-3">
                                            <doc.icon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{doc.name}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </WorkspaceCard>
            )
        }
    ];

    return (
        <JobWorkspace
            role="vendor"
            onBack={() => router.push('/dashboard/vendors/jobs')}
            title={event.eventName}
            status={booking.status}
            statusBadge={<StatusIndicator status={booking.status} label={booking.status} />}
            contextCard={contextCard}
            actionColumn={actionColumn}
            tabs={tabs}
        />
    );
}
