"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User, ChevronLeft, Star, MapPin, CheckCircle2,
    MessageSquare, Heart, Share2, Calendar,
    Zap, Video, Image as ImageIcon, XCircle, Globe,
    Clock, Send, FileText, Download, ShieldCheck, Printer
} from 'lucide-react';
import { vendors } from '@/lib/vendors-data';
import { SHARED_EVENTS } from '@/lib/shared-data';
import { Button } from '@/components/ui/button';
import JobWorkspace, { WorkspaceCard, StatusIndicator } from '@/components/dashboard/JobWorkspace';
import JobChat from '@/components/dashboard/JobChat';
import JobBrief from '@/components/dashboard/JobBrief';
import { Event } from '@/lib/events-data';

export default function EventVendorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const vendorId = params.vendorId as string;

    const vendor = vendors.find(v => v.id === vendorId);
    const event = SHARED_EVENTS.find(e => e.id === eventId);

    // Cast SharedEvent to Event for JobBrief
    const eventBriefData = event as unknown as Event;

    const vendorBooking = event?.bookedVendors.find(bv => bv.vendorId === vendorId);

    // ... items from mockRequestData ...
    const mockRequestData: Record<string, { status: string; price: string; date: string }> = {
        'v-venue-1': { status: 'Paid', price: '₦5,250,500', date: 'Oct 12, 2024' },
        'v-catering-1': { status: 'Deciding', price: '₦1,250,000', date: 'Oct 14, 2024' },
        'v-photo-1': { status: 'Deciding', price: 'Pending', date: 'Oct 15, 2024' },
        'v-makeup-1': { status: 'Rejected', price: '₦150,000', date: 'Oct 10, 2024' },
    };

    const request = vendorBooking
        ? { status: vendorBooking.status, price: vendorBooking.amount, date: event?.date || 'Today' }
        : mockRequestData[vendorId] || { status: 'Deciding', price: 'By Request', date: 'Today' };

    const [currentStatus, setCurrentStatus] = useState(request.status);

    if (!vendor || !event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h1 className="text-2xl font-bold">Data not found</h1>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const mockMessages = [
        {
            id: '1',
            senderId: 'vendor',
            senderName: vendor.name,
            text: "Hi! I've attached our initial quote. We've included 8 hours of coverage and a second shooter as requested.",
            time: '10:30 AM',
            isOwn: false
        },
        {
            id: '2',
            senderId: 'host',
            senderName: 'You',
            text: "Thanks! Can we add an engagement session to this package?",
            time: '11:05 AM',
            isOwn: true
        },
        {
            id: '3',
            senderId: 'vendor',
            senderName: vendor.name,
            text: "Absolutely! I've updated the price above. Let me know if you have questions!",
            time: '11:45 AM',
            isOwn: false
        },
    ];

    const contextCard = (
        // ... previous contextCard implementation ...
        <WorkspaceCard className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="space-y-4 shrink-0">
                    <div className="w-32 h-32 rounded-3xl bg-secondary overflow-hidden border border-border shadow-inner">
                        <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2 px-1">
                        <Link
                            href={`/vendors/${vendor.id}`}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-muted-foreground transition-colors"
                        >
                            <User size={12} />
                            Visit Page
                        </Link>
                        <a
                            href="#"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-muted-foreground transition-colors"
                        >
                            <Globe size={12} />
                            Visit Website
                        </a>
                    </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                    <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight">{vendor.name}</h2>
                        <div className="mt-2">
                            <StatusIndicator status={currentStatus} label={currentStatus} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground pt-1">
                        <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-foreground uppercase tracking-widest text-[10px]">
                            <Zap size={14} className="text-muted-foreground" />
                            {vendor.categories[0]}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Star size={16} className="fill-muted-foreground text-muted-foreground" />
                            <span className="text-foreground">{vendor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-muted-foreground" />
                            <span className="text-foreground">{vendor.location}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="mt-1 bg-secondary p-1.5 rounded-lg text-muted-foreground">
                            <FileText size={16} />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            {vendor.description}
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="mt-1 bg-secondary p-1.5 rounded-lg text-muted-foreground">
                            <ShieldCheck size={16} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black text-foreground uppercase tracking-widest mb-2">Services Included</p>
                            <p className="text-sm text-muted-foreground font-medium">
                                {vendor.whatsIncluded.join(' • ')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </WorkspaceCard>
    );

    const actionColumn = (
        <div className="sticky top-6 bg-card rounded-2xl border border-border p-6 space-y-6">
            <div>
                <p className="text-sm text-muted-foreground">Quoted Price</p>
                <p className="text-3xl font-black text-foreground">{request.price}</p>
                <p className="text-xs text-muted-foreground mt-1">Updated {request.date}</p>
            </div>

            <div className="space-y-2">
                {currentStatus === 'Deciding' ? (
                    <>
                        <Button
                            onClick={() => setCurrentStatus('Approved')}
                            className="w-full h-12 rounded-xl font-bold gap-2"
                        >
                            <CheckCircle2 size={20} />
                            Approve & Hire
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="h-10 rounded-lg text-sm">
                                Request Changes
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStatus('Rejected')}
                                className="h-10 rounded-lg text-sm text-red-600 border-red-200 hover:bg-red-50"
                            >
                                Reject
                            </Button>
                        </div>
                    </>
                ) : currentStatus === 'Approved' ? (
                    <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl font-bold gap-2 text-green-700"
                    >
                        <CheckCircle2 size={20} />
                        Hired
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStatus('Deciding')}
                        className="w-full h-12 rounded-xl font-bold gap-2 border-red-200 text-white"
                    >
                        <XCircle size={20} />
                        Rejected
                    </Button>
                )}
            </div>

            {currentStatus === 'Approved' && (
                <>
                    <hr className="border-border" />
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-muted-foreground" />
                            <h3 className="font-bold text-sm">Contract</h3>
                        </div>
                        <div className="flex items-center justify-between bg-secondary p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-muted-foreground" />
                                <div>
                                    <p className="text-xs font-medium">Agreement.pdf</p>
                                    <p className="text-[10px] text-muted-foreground">{request.date}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8">
                                <Download size={14} />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const tabs = [
        {
            id: 'inbox',
            label: 'Inbox',
            content: (
                <JobChat
                    participant={{ name: vendor.name, image: vendor.image }}
                    messages={mockMessages}
                />
            )
        },
        {
            id: 'brief',
            label: 'Project Brief',
            content: (
                <JobBrief event={eventBriefData} service={vendorBooking?.service} />
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
                                <h3 className="text-lg font-black tracking-tight">Service Agreement #{(vendor.id + eventId).substring(0, 8).toUpperCase()}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Value</div>
                                <div className="font-bold">{request.price}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service</div>
                                <div className="font-bold">{vendor.categories[0]}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</div>
                                <div className="font-bold">{currentStatus}</div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border/50">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Documents</h4>
                            <div className="space-y-2">
                                {[
                                    { name: 'Quote_Summary.pdf', icon: FileText },
                                    { name: 'Terms_of_Service.pdf', icon: FileText },
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
            role="host"
            onBack={() => router.back()}
            title={vendor.name}
            status={currentStatus}
            statusBadge={<StatusIndicator status={currentStatus} label={currentStatus} />}
            contextCard={contextCard}
            actionColumn={actionColumn}
            tabs={tabs}
        />
    );
}
