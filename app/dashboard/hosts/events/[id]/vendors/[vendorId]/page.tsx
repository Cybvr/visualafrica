"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User, ChevronLeft, Star, MapPin, CheckCircle2,
    MessageSquare, Heart, Share2, Calendar,
    Zap, Video, Image as ImageIcon, XCircle,
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{vendor.name}</h1>
                        <p className="text-xs text-muted-foreground">{vendor.categories.join(', ')}</p>
                    </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusStyles(currentStatus)}`}>
                    {currentStatus}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Vendor Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Vendor Profile */}
                    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden shrink-0 border border-border">
                                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="fill-primary text-primary" />
                                        <span className="font-bold text-foreground">{vendor.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin size={16} />
                                        <span className="text-sm">{vendor.location}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{vendor.description}</p>
                            </div>
                        </div>

                        {/* Portfolio */}
                        <div className="grid grid-cols-4 gap-2">
                            {vendor.portfolio.slice(0, 4).map(item => (
                                <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-secondary">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>

                        {/* What's Included */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-muted-foreground">What's Included</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {vendor.whatsIncluded.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 size={14} className="text-primary shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
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
                                        <FileText size={16} className="text-primary" />
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