"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User, ChevronLeft, Star, MapPin, CheckCircle2,
    MessageSquare, Heart, Share2, Calendar,
    Zap, Video, Image as ImageIcon, XCircle, Globe,
    Clock, Send, FileText, Download, ShieldCheck
} from 'lucide-react';
import { vendors } from '@/lib/vendors-data';
import { Button } from '@/components/ui/button';

export default function EventVendorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const vendorId = params.vendorId as string;

    const vendor = vendors.find(v => v.id === vendorId);

    const mockRequestData: Record<string, { status: string; price: string; date: string }> = {
        'v-venue-1': { status: 'Approved', price: '₦5,250,500', date: 'Oct 12, 2024' },
        'v-catering-1': { status: 'Deciding', price: '₦1,250,000', date: 'Oct 14, 2024' },
        'v-photo-1': { status: 'Deciding', price: 'Pending', date: 'Oct 15, 2024' },
        'v-makeup-1': { status: 'Rejected', price: '₦150,000', date: 'Oct 10, 2024' },
    };

    const request = mockRequestData[vendorId] || { status: 'Deciding', price: 'By Request', date: 'Today' };
    const [currentStatus, setCurrentStatus] = useState(request.status);

    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h1 className="text-2xl font-bold">Vendor not found</h1>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'Deciding': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 py-6 pb-24">
            {/* Header / Back Link only */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <div className="p-2 bg-card rounded-full border border-border group-hover:bg-secondary transition-colors">
                        <ChevronLeft size={16} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Vendors</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Vendor Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Vendor Profile Card */}
                    <div className="bg-card rounded-[2.5rem] border border-border p-8 space-y-6 shadow-sm">
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
                                {/* 1st line: Title and Status Badge */}
                                <div>
                                    <h2 className="text-3xl font-black text-foreground tracking-tight">{vendor.name}</h2>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-secondary border border-border mt-2">
                                        <div className={`w-2 h-2 rounded-full ${currentStatus === 'Approved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : currentStatus === 'Rejected' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{currentStatus}</span>
                                    </div>
                                </div>

                                {/* 2nd line: Category Icon, Rating, Location */}
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

                                {/* 3rd line: Description Icon and Description */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-secondary p-1.5 rounded-lg text-muted-foreground">
                                        <FileText size={16} />
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        {vendor.description}
                                    </p>
                                </div>

                                {/* 4th line: Services Icon and Services */}
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
                    </div>

                    {/* Chat */}
                    <div className="bg-card rounded-2xl border border-border overflow-hidden">
                        <div className="p-4 border-b border-border">
                            <h3 className="font-bold">Messages</h3>
                        </div>

                        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <User size={14} />
                                </div>
                                <div className="bg-secondary p-3 rounded-xl rounded-tl-none text-sm flex-1">
                                    Hi! I've attached our initial quote. We've included 8 hours of coverage and a second shooter as requested.
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <div className="bg-primary text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[80%]">
                                    Thanks! Can we add an engagement session to this package?
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <User size={14} />
                                </div>
                                <div className="bg-secondary p-3 rounded-xl rounded-tl-none text-sm flex-1">
                                    Absolutely! I've updated the price above. Let me know if you have questions!
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-border">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 bg-secondary rounded-lg text-sm outline-none"
                                />
                                <Button size="icon" className="rounded-lg">
                                    <Send size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sticky Pricing & Contract */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 bg-card rounded-2xl border border-border p-6 space-y-6">
                        {/* Pricing */}
                        <div>
                            <p className="text-sm text-muted-foreground">Quoted Price</p>
                            <p className="text-3xl font-black text-foreground">{request.price}</p>
                            <p className="text-xs text-muted-foreground mt-1">Updated {request.date}</p>
                        </div>

                        {/* Actions */}
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
                                    className="w-full h-12 rounded-xl font-bold gap-2  text-green-700"
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

                        {/* Contract (if approved) */}
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
                </div>
            </div>
        </div>
    );
}
