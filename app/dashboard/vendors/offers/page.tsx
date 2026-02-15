"use client";

import React, { useState } from 'react';
import { DashboardFilter } from '@/components/dashboard/DashboardFilter';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Users, Briefcase, MessageSquare, MoreVertical, Archive, CheckCircle2 } from 'lucide-react';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';

export default function VendorOffersPage() {
    const { leads } = VENDOR_DASHBOARD_DATA;
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

    // For demo purposes, we'll treat 'Closed' as archived and everything else as active
    const activeOffers = leads.filter(lead => lead.status !== 'Closed');
    const archivedOffers = leads.filter(lead => lead.status === 'Closed');

    const displayOffers = activeTab === 'active' ? activeOffers : archivedOffers;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="space-y-6 mb-10">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-foreground">Offers</h2>
                    <p className="text-muted-foreground mt-1 font-medium italic">Manage your incoming inquiries and potential clients.</p>
                </div>
                <DashboardFilter placeholder="Search offers or clients..." />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-3 border-b border-border mb-8">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-8 py-4 text-sm font-black transition-all border-b-2 -mb-[2px] ${activeTab === 'active'
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <CheckCircle2 size={16} />
                    Active ({activeOffers.length})
                </button>
                <button
                    onClick={() => setActiveTab('archived')}
                    className={`px-8 py-4 text-sm font-black transition-all border-b-2 -mb-[2px] ${activeTab === 'archived'
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Archive size={16} />
                    Archived ({archivedOffers.length})
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {displayOffers.map((offer) => (
                    <div
                        key={offer.id}
                        className="group bg-card border border-border rounded-3xl p-4 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all hover:border-primary/50"
                    >
                        <div className="relative w-full md:w-48 h-48 md:h-auto rounded-2xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                            <Users size={48} className="text-slate-300" />
                        </div>

                        <div className="flex-1 py-2 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${offer.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                        offer.status === 'Contacted' ? 'bg-accent text-foreground' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {offer.status}
                                    </span>
                                    <p className="text-xs font-bold text-muted-foreground italic">Inquiry Received</p>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-1">
                                    {offer.event}
                                </h3>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Requested by <span className="text-foreground font-black">{offer.name}</span>
                                </p>
                                <p className="text-muted-foreground text-sm mt-3 line-clamp-2 italic">
                                    "{offer.detail}"
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                                        <Calendar size={16} className="text-primary" />
                                        {offer.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                                        <MessageSquare size={16} className="text-primary" />
                                        Contact Client
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-6 py-2 bg-primary text-white text-xs font-black rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                        Accept Offer
                                    </button>
                                    <button className="p-2.5 bg-background border border-border rounded-full text-muted-foreground hover:text-red-600 transition-colors">
                                        <Archive size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {displayOffers.length === 0 && (
                <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Archive className="text-slate-300" size={32} />
                    </div>
                    <p className="text-muted-foreground font-bold">No {activeTab} offers found.</p>
                </div>
            )}
        </div>
    );
}