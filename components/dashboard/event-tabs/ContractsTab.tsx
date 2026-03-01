"use client";

import React, { useEffect, useState } from 'react';
import { getVendors } from '@/lib/firestore-service';
import { Vendor } from '@/lib/types';
import { DashboardFilter } from '../DashboardFilter';
import { Users, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    const [allVendors, setAllVendors] = useState<Vendor[]>([]);
    const [activeStatus, setActiveStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function loadVendors() {
            try {
                setAllVendors(await getVendors());
            } catch (error) {
                console.error("Failed to load vendors for contracts:", error);
            }
        }
        loadVendors();
    }, []);

    const displayVendors = (bookedVendors ? bookedVendors.map(bv => {
        const vendor = allVendors.find(v => v.id === bv.vendorId);
        return {
            id: bv.vendorId,
            name: vendor?.name || 'Unknown Vendor',
            category: bv.service,
            amount: bv.amount,
            status: bv.status
        };
    }) : allVendors.slice(0, 3).map((v, i) => ({
        id: v.id,
        name: v.name,
        category: v.categories[0],
        amount: v.price || "Custom Quote",
        status: i === 0 ? 'Confirmed' : 'Pending'
    }))) as Array<{ id: string; name: string; category: string; amount: string; status: string }>;

    const statusesInData = Array.from(new Set(displayVendors.map(v => v.status)));
    const tabs = ['All', ...statusesInData];

    const filteredVendors = displayVendors.filter(item => {
        const matchesStatus = activeStatus === 'All' || item.status === activeStatus;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-2">
            <div className="flex flex-col gap-6">
                <DashboardFilter
                    placeholder="Search contracts..."
                    onSearchChange={setSearchQuery}
                />

                <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-[2px]">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveStatus(tab)}
                            className={`px-3 py-2 text-xs font-medium transition-all border-b-2 -mb-[2px] whitespace-nowrap ${activeStatus === tab
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-secondary/30">
                        <TableRow>
                            <TableHead className="h-10 px-4 text-xs font-medium">Vendor</TableHead>
                            <TableHead className="h-10 px-4 text-xs font-medium">Service</TableHead>
                            <TableHead className="h-10 px-4 text-xs font-medium">Status</TableHead>
                            <TableHead className="h-10 px-4 text-xs font-medium text-right">Amount</TableHead>
                            <TableHead className="h-10 px-4" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredVendors.length > 0 ? filteredVendors.map((item, index) => (
                            <TableRow
                                key={`${item.id}-${index}`}
                                onClick={() => window.location.href = `/dashboard/hosts/events/${eventId}/vendors/${item.id}`}
                                className="group cursor-pointer hover:bg-secondary/40"
                            >
                                <TableCell className="px-4 py-3 text-sm font-medium text-foreground">{item.name}</TableCell>
                                <TableCell className="px-4 py-3 text-sm text-muted-foreground">{item.category}</TableCell>
                                <TableCell className="px-4 py-3">
                                    <span className={`rounded-md border px-2 py-1 text-[10px] font-medium ${item.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        item.status === 'Unresolved' ? 'bg-red-50 text-red-700 border-red-100' :
                                            'bg-secondary text-muted-foreground border-transparent'
                                        }`}>
                                        {item.status}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-right text-sm font-medium">{item.amount}</TableCell>
                                <TableCell className="px-4 py-3 text-right">
                                    <ChevronRight size={16} className="inline text-muted-foreground group-hover:text-primary transition-colors" />
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users size={24} className="opacity-30" />
                                        No contracts match your search.
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
