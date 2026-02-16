"use client";

import React from 'react';
import { FileText, Search, Filter, MoreHorizontal, Download, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { vendors } from '@/lib/vendors-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { vendors as allVendors } from '@/lib/vendors-data';

interface ContractsTabProps {
    eventId: string;
    bookedVendors?: {
        vendorId: string;
        service: string;
        amount: string;
        status: 'Pending' | 'Confirmed' | 'Paid' | 'Pending Payment' | 'Unresolved';
    }[];
}

export default function ContractsTab({ eventId, bookedVendors }: ContractsTabProps) {
    // Mock contract status mapping for demo
    const getStatusStyle = (status: string) => {
        const styles = {
            'Confirmed': 'bg-green-100 text-green-700',
            'Pending': 'bg-accent text-foreground',
            'Paid': 'bg-blue-100 text-blue-700',
            'Pending Payment': 'bg-amber-100 text-amber-700',
            'Unresolved': 'bg-red-100 text-red-700',
            'Draft': 'bg-card text-foreground',
        };
        return styles[status as keyof typeof styles] || styles['Draft'];
    };

    // Use passed bookedVendors or fallback to slice for demo
    const displayVendors = bookedVendors ? bookedVendors.map(bv => {
        const vendor = allVendors.find(v => v.id === bv.vendorId);
        return {
            id: bv.vendorId,
            name: vendor?.name || 'Unknown Vendor',
            image: vendor?.image || '',
            category: bv.service,
            amount: bv.amount,
            status: bv.status
        };
    }) : allVendors.slice(0, 3).map((v, i) => ({
        id: v.id,
        name: v.name,
        image: v.image,
        category: v.categories[0],
        amount: v.price || "Custom Quote",
        status: i === 0 ? 'Confirmed' : 'Pending'
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        type="text"
                        placeholder="Search contracts..."
                        className="w-full border-border py-3 pl-12 pr-4 h-auto rounded-xl font-medium focus-visible:ring-primary/10 placeholder:text-muted-foreground text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm h-auto">
                        <Filter size={16} />
                        Filter
                    </Button>
                    <Button variant="outline" className="px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm h-auto">
                        <FileText size={16} />
                        New Contract
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {displayVendors.map((item, index) => {
                    const style = getStatusStyle(item.status);
                    return (
                        <Link
                            key={`${item.id}-${index}`}
                            href={`/dashboard/hosts/events/${eventId}/vendors/${item.id}`}
                            className="bg-card p-5 rounded-[2rem] border border-border hover:shadow-md transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-card overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{item.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                        <span className="flex items-center gap-1"><FileText size={12} /> Contract #{1000 + index}</span>
                                        <span>•</span>
                                        <span>{item.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 md:gap-10 w-full md:w-auto">
                                <div>
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${style}`}>
                                        {item.status}
                                    </span>
                                </div>

                                <div>
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Amount</div>
                                    <div className="font-bold text-foreground text-sm">{item.amount}</div>
                                </div>

                                <div className="flex items-center gap-1 ml-auto md:ml-0">
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground">
                                        <Download size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal size={16} />
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {displayVendors.length === 0 && (
                <div className="py-12 bg-secondary rounded-[2rem] border border-dashed border-border text-center">
                    <p className="text-muted-foreground font-bold text-sm">No contracts found for this event.</p>
                </div>
            )}
        </div>
    );
}