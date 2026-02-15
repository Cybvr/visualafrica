"use client";

import React from 'react';
import { Clock, CheckCircle, FileText, ChevronRight, Filter, MapPin } from 'lucide-react';

import { vendors } from '@/lib/vendors-data';

const STATUS_MAP = {
    'Sent': { color: 'text-blue-600 bg-blue-50', icon: <Clock size={16} /> },
    'Quoted': { color: 'text-amber-600 bg-amber-50', icon: <FileText size={16} /> },
    'Booked': { color: 'text-green-600 bg-green-50', icon: <CheckCircle size={16} /> },
};

// Map specific vendors to simulate requests state
const REQUESTS = [
    { ...vendors.find(v => v.id === 'v-venue-1')!, status: 'Booked', date: 'Oct 12, 2024', priceDisplay: vendors.find(v => v.id === 'v-venue-1')?.price },
    { ...vendors.find(v => v.id === 'v-catering-1')!, status: 'Quoted', date: 'Oct 14, 2024', priceDisplay: vendors.find(v => v.id === 'v-catering-1')?.price },
    { ...vendors.find(v => v.id === 'v-photo-1')!, status: 'Sent', date: 'Oct 15, 2024', priceDisplay: 'Pending' },
];

const VendorsTab: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-foreground">Vendors</h2>
            </div>

            <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50/50 border-b border-border">
                        <tr>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vendor</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Price</th>
                            <th className="px-8 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {REQUESTS.map((req) => {
                            const status = STATUS_MAP[req.status as keyof typeof STATUS_MAP];
                            return (
                                <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-foreground">{req.name}</div>
                                        <div className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Updated {req.date}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <MapPin size={14} className="text-orange-600" />
                                            {req.location}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-medium text-muted-foreground text-sm">{req.categories[0]}</td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black ${status.color}`}>
                                            {status.icon} {req.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-foreground">{req.priceDisplay}</td>
                                    <td className="px-8 py-6 text-right"><ChevronRight size={18} className="text-slate-200 group-hover:text-orange-600 transition-colors inline" /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorsTab;
