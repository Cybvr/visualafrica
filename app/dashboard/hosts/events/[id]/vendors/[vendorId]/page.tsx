"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Star, MapPin, CheckCircle2,
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

    // Simulation logic for status and price (matching VendorsTab)
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
        <div className="max-w-7xl mx-auto space-y-8 py-6 pb-24">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Vendor Request Details</h1>
                        <p className="text-xs text-muted-foreground">Managing {vendor.name} for your event</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusStyles(currentStatus)}`}>
                        {currentStatus}
                    </span>
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Share2 size={18} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Vendor Profile & Info (7/12) */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Top Card: Quick Profile & Portfolio */}
                    <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
                        <div className="p-8 space-y-6">
                            <div className="flex items-start justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {vendor.categories.map(cat => (
                                            <span key={cat} className="px-3 py-1 bg-secondary text-foreground rounded-full text-[10px] font-bold uppercase tracking-widest leading-none flex items-center">{cat}</span>
                                        ))}
                                    </div>
                                    <h2 className="text-3xl font-bold text-foreground leading-tight">{vendor.name}</h2>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <Star size={20} className="fill-primary text-primary" />
                                            <span className="font-bold text-foreground">{vendor.rating}</span>
                                            <span className="text-muted-foreground text-sm">Rating</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={20} className="text-muted-foreground" />
                                            <span className="text-sm font-medium text-muted-foreground">{vendor.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-24 h-24 rounded-2xl bg-secondary overflow-hidden shrink-0 border border-border">
                                    <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <hr className="border-border/50" />

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Portfolio Highlights</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {vendor.portfolio.slice(0, 3).map(item => (
                                        <div key={item.id} className="aspect-square rounded-xl overflow-hidden bg-secondary relative group cursor-pointer">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                {item.type === 'Video' ? <Video size={20} className="text-white" /> : <ImageIcon size={20} className="text-white" />}
                                            </div>
                                        </div>
                                    ))}
                                    {vendor.gallery.slice(0, 3).map((img, idx) => (
                                        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-secondary relative group cursor-pointer border border-border/50">
                                            <img src={img.url} alt={vendor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">About the Artist</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{vendor.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Standard Package Info */}
                    <div className="bg-card rounded-3xl border border-border p-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={20} className="text-primary" />
                            <h3 className="text-lg font-bold">Standard Offering</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vendor.whatsIncluded.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={14} className="text-primary" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contract Section (If Approved) */}
                    {currentStatus === 'Approved' && (
                        <div className="bg-card rounded-3xl border border-primary/20 p-8 space-y-6 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full flex items-center justify-end p-6">
                                <FileText size={40} className="text-primary/20" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-primary">
                                    <FileText size={20} />
                                    <h3 className="text-lg font-bold">Service Contract</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">Your contract with {vendor.name} is signed and active.</p>
                            </div>

                            <div className="flex items-center justify-between bg-secondary p-4 rounded-2xl border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center">
                                        <FileText size={20} className="text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Event_Service_Agreement.pdf</p>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase">Last updated {request.date}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Download size={14} />
                                    View
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Actions & Inbox (5/12) */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Action Bar / Pricing Card */}
                    <div className="bg-card rounded-3xl border border-border p-8 space-y-8 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quoted Price</p>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(currentStatus)}`}>
                                    {currentStatus}
                                </span>
                            </div>
                            <p className="text-4xl font-black text-foreground">{request.price}</p>
                        </div>

                        <div className="space-y-3">
                            {currentStatus === 'Deciding' ? (
                                <>
                                    <Button
                                        onClick={() => setCurrentStatus('Approved')}
                                        className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20"
                                    >
                                        <CheckCircle2 size={24} />
                                        Approve Quote
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            className="h-12 rounded-xl font-bold flex items-center gap-2"
                                        >
                                            <FileText size={18} />
                                            Request Changes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentStatus('Rejected')}
                                            className="h-12 rounded-xl font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                                        >
                                            <XCircle size={18} />
                                            Reject
                                        </Button>
                                    </div>
                                </>
                            ) : currentStatus === 'Approved' ? (
                                <Button
                                    variant="outline"
                                    className="w-full h-14 rounded-2xl font-black text-lg gap-3 border-green-200 text-green-700 hover:bg-green-50"
                                >
                                    <CheckCircle2 size={24} />
                                    Hired & Active
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStatus('Deciding')}
                                    className="w-full h-14 rounded-2xl font-black text-lg gap-3 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle size={24} />
                                    Rejected Request (Reconsider)
                                </Button>
                            )}
                        </div>

                        <div className="pt-6 border-t border-border flex items-center justify-between text-xs font-bold text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-primary" />
                                <span>Wait Time: ~12 Hours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-green-500" />
                                <span>Verified Partner</span>
                            </div>
                        </div>
                    </div>

                    {/* Integrated Inbox */}
                    <div className="bg-card rounded-3xl border border-border shadow-sm flex flex-col h-[600px] overflow-hidden">
                        <div className="p-6 border-b border-border bg-secondary/30">
                            <h3 className="font-bold text-foreground">Chat with {vendor.name.split(' ')[0]}</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Typically responds within 4 hours
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
                            <div className="flex items-start gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-lg bg-secondary text-foreground flex items-center justify-center text-[10px] font-bold shrink-0">
                                    <User size={14} />
                                </div>
                                <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-border shadow-sm text-sm text-foreground leading-relaxed font-medium">
                                    Hi! I've attached our initial quote for the wedding photography. We've included 8 hours of coverage and a second shooter as requested.
                                </div>
                            </div>

                            <div className="text-center">
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-white border border-border px-3 py-1 rounded-full">Yesterday</span>
                            </div>

                            <div className="flex items-start gap-3 justify-end">
                                <div className="bg-primary p-4 rounded-2xl rounded-tr-none shadow-lg shadow-primary/10 text-sm text-foreground leading-relaxed max-w-[85%] font-bold">
                                    Thanks! Looking good. Can we add an engagement session to this package?
                                </div>
                            </div>

                            <div className="flex items-start gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-lg bg-secondary text-foreground flex items-center justify-center text-[10px] font-bold shrink-0">
                                    <User size={14} />
                                </div>
                                <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-border shadow-sm text-sm text-foreground leading-relaxed font-medium">
                                    Absolutely! I've updated the price above to reflect the additional session. Let me know if you have any other questions!
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-card border-t border-border">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 bg-secondary border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                                <Button size="icon" className="h-11 w-11 rounded-xl shadow-lg">
                                    <Send size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
