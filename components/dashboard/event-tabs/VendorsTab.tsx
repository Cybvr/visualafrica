"use client";

import React, { useState } from 'react';
import { Clock, CheckCircle, FileText, ChevronRight, MapPin, XCircle, CreditCard, AlertCircle } from 'lucide-react';
import { vendors } from '@/lib/vendors-data';
import { Event } from '@/lib/events-data';
import { DashboardFilter } from '../DashboardFilter';

const STATUS_MAP: Record<string, { color: string; icon: React.ReactNode }> = {
    'Deciding': { color: 'text-amber-600 bg-amber-50', icon: <Clock size={16} /> },
    'Approved': { color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle size={16} /> },
    'Confirmed': { color: 'text-blue-600 bg-blue-50', icon: <CheckCircle size={16} /> },
    'Paid': { color: 'text-emerald-700 bg-emerald-100 border-emerald-200', icon: <CreditCard size={16} /> },
    'Rejected': { color: 'text-red-600 bg-red-50', icon: <XCircle size={16} /> },
    'Pending': { color: 'text-amber-600 bg-amber-50', icon: <Clock size={16} /> },
    'Pending Payment': { color: 'text-amber-700 bg-amber-100', icon: <CreditCard size={16} /> },
    'Unresolved': { color: 'text-red-700 bg-red-100', icon: <AlertCircle size={16} /> },
};

interface VendorsTabProps {
    event: Event;
}

const VendorsTab: React.FC<VendorsTabProps> = ({ event }) => {
    const [activeStatus, setActiveStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const vendorRequests = event.bookedVendors.map(bv => {
        const vendor = vendors.find(v => v.id === bv.vendorId);
        return {
            ...vendor,
            id: bv.vendorId,
            name: vendor?.name || 'Unknown Vendor',
            status: bv.status,
            priceDisplay: bv.amount,
            location: vendor?.location,
            categories: vendor?.categories || ['Vendor'],
            date: event.date
        };
    });

    // Dynamically derive tabs from statuses present in the data
    const statusesInData = Array.from(new Set(vendorRequests.map(v => v.status)));
    const tabs = ['All', ...statusesInData];

    const filteredRequests = vendorRequests.filter(req => {
        const matchesStatus = activeStatus === 'All' || req.status === activeStatus;
        const matchesSearch = req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-6">
                <DashboardFilter
                    placeholder="Search vendors or services..."
                    onSearchChange={setSearchQuery}
                />

                <div className="flex items-center gap-2 border-b border-border text-[10px]">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveStatus(tab)}
                            className={`px-6 py-4 font-black transition-all border-b-2 -mb-[2px] uppercase tracking-[0.2em] ${activeStatus === tab
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-secondary/30 border-b border-border">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vendor</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Contact</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Price</th>
                            <th className="px-8 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((req) => {
                                const statusConfig = STATUS_MAP[req.status] || { color: 'text-muted-foreground bg-secondary', icon: <Clock size={16} /> };
                                return (
                                    <tr
                                        key={req.id}
                                        onClick={() => window.location.href = `${window.location.pathname}/vendors/${req.id}`}
                                        className="group hover:bg-secondary/50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-foreground">{req.name}</div>
                                            <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-bold uppercase truncate">
                                                <MapPin size={12} className="text-muted-foreground opacity-50" />
                                                {req.location}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-foreground">{req.categories[0]}</div>
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Updated {req.date}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-foreground text-sm">{req.phone}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-transparent ${statusConfig.color}`}>
                                                {statusConfig.icon} {req.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right font-black text-foreground">{req.priceDisplay}</td>
                                        <td className="px-8 py-6 text-right">
                                            <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors inline" />
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-8 py-16 text-center text-muted-foreground">
                                    No vendors found in this category.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorsTab;
