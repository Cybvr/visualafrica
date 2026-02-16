"use client";

import React, { useState } from 'react';
import { Clock, CheckCircle, FileText, ChevronRight, MapPin, XCircle } from 'lucide-react';
import { vendors } from '@/lib/vendors-data';
import { DashboardFilter } from '../DashboardFilter';

const STATUS_MAP = {
    'Deciding': { color: 'text-amber-600 bg-amber-50', icon: <Clock size={16} /> },
    'Approved': { color: 'text-green-600 bg-green-50', icon: <CheckCircle size={16} /> },
    'Rejected': { color: 'text-red-600 bg-red-50', icon: <XCircle size={16} /> },
};

// Map specific vendors to simulate requests state
const INITIAL_REQUESTS = [
    { ...vendors.find(v => v.id === 'v-venue-1')!, status: 'Approved', date: 'Oct 12, 2024', priceDisplay: vendors.find(v => v.id === 'v-venue-1')?.price },
    { ...vendors.find(v => v.id === 'v-catering-1')!, status: 'Deciding', date: 'Oct 14, 2024', priceDisplay: vendors.find(v => v.id === 'v-catering-1')?.price },
    { ...vendors.find(v => v.id === 'v-photo-1')!, status: 'Deciding', date: 'Oct 15, 2024', priceDisplay: 'Pending' },
    { ...vendors.find(v => v.id === 'v-makeup-1')!, status: 'Rejected', date: 'Oct 10, 2024', priceDisplay: vendors.find(v => v.id === 'v-makeup-1')?.price },
];

const VendorsTab: React.FC = () => {
    const [activeStatus, setActiveStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRequests = INITIAL_REQUESTS.filter(req => {
        const matchesStatus = activeStatus === 'All' || req.status === activeStatus;
        const name = req.name || '';
        const categories = req.categories || [];
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const tabs = ['All', 'Deciding', 'Rejected', 'Approved'];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-6">
                <DashboardFilter
                    placeholder="Search vendors or services..."
                    onSearchChange={setSearchQuery}
                />

                <div className="flex items-center gap-2 border-b border-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveStatus(tab)}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 -mb-[2px] ${activeStatus === tab
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
                    <thead className="bg-secondary border-b border-border">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vendor</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Price</th>
                            <th className="px-8 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((req) => {
                                const status = STATUS_MAP[req.status as keyof typeof STATUS_MAP];
                                return (
                                    <tr
                                        key={req.id}
                                        onClick={() => window.location.href = `${window.location.pathname}/vendors/${req.id}`}
                                        className="group hover:bg-secondary transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-foreground">{req.name}</div>
                                            <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-bold uppercase">
                                                <MapPin size={12} className="text-primary" />
                                                {req.location}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-foreground">{req.categories[0]}</div>
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Updated {req.date}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                                {status.icon} {req.status}
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
                                    No vendors found matching your criteria.
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
