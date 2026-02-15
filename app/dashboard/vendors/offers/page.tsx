"use client";

import React, { useState } from 'react';
import { Search, Filter, MessageSquare, MoreVertical, Archive, CheckCircle2 } from 'lucide-react';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import { Input } from '@/components/ui/input';

export default function VendorOffersPage() {
    const { leads } = VENDOR_DASHBOARD_DATA;
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

    // For demo purposes, we'll treat 'Closed' as archived and everything else as active
    const activeOffers = leads.filter(lead => lead.status !== 'Closed');
    const archivedOffers = leads.filter(lead => lead.status === 'Closed');

    const displayOffers = activeTab === 'active' ? activeOffers : archivedOffers;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Offers</h2>
                    <p className="text-muted-foreground mt-1">Manage your incoming inquiries and potential clients.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            type="text"
                            placeholder="Search offers..."
                            className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm w-full md:w-64"
                        />
                    </div>
                    <button className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:bg-slate-50">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-border">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-8 py-4 text-sm font-black transition-all border-b-2 flex items-center gap-2 ${activeTab === 'active'
                        ? 'border-primary text-accent'
                        : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                        }`}
                >
                    <CheckCircle2 size={16} />
                    Active ({activeOffers.length})
                </button>
                <button
                    onClick={() => setActiveTab('archived')}
                    className={`px-8 py-4 text-sm font-black transition-all border-b-2 flex items-center gap-2 ${activeTab === 'archived'
                        ? 'border-primary text-accent'
                        : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                        }`}
                >
                    <Archive size={16} />
                    Archived ({archivedOffers.length})
                </button>
            </div>

            <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Client</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Inquiry Type</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Event Date</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {displayOffers.map((offer) => (
                                <tr key={offer.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-accent rounded-full flex-shrink-0 flex items-center justify-center text-accent font-black text-xs">
                                                {offer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground">{offer.name}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{offer.detail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-foreground">{offer.event}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm text-muted-foreground">{offer.date}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${offer.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                            offer.status === 'Contacted' ? 'bg-accent text-foreground' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            {offer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                                                <MessageSquare size={18} />
                                            </button>
                                            <button className="p-2 text-muted-foreground hover:text-muted-foreground transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </div>
    );
}