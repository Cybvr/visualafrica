"use client";

import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, ChevronRight, MapPin, XCircle, CreditCard, AlertCircle } from 'lucide-react';
import { getVendors } from '@/lib/firestore-service';
import { SharedEvent, Vendor } from '@/lib/types';
import { DashboardFilter } from '../DashboardFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    event: SharedEvent;
}

const VendorsTab: React.FC<VendorsTabProps> = ({ event }) => {
    const [activeStatus, setActiveStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [vendors, setVendors] = useState<Vendor[]>([]);

    useEffect(() => {
        async function loadVendors() {
            try {
                setVendors(await getVendors());
            } catch (error) {
                console.error("Failed to load vendors:", error);
            }
        }
        loadVendors();
    }, []);

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
        <div className="max-w-6xl mx-auto space-y-6 pt-2">
            <div className="flex flex-col gap-6">
                <div className="w-full">
                    <DashboardFilter
                        placeholder="Search vendors..."
                        onSearchChange={setSearchQuery}
                    />
                </div>

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
                            <TableHead className="h-10 px-4 text-xs font-medium">Contact</TableHead>
                            <TableHead className="h-10 px-4 text-xs font-medium">Status</TableHead>
                            <TableHead className="h-10 px-4 text-xs font-medium text-right">Price</TableHead>
                            <TableHead className="h-10 px-4" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((req) => {
                                const statusConfig = STATUS_MAP[req.status] || { color: 'text-muted-foreground bg-secondary', icon: <Clock size={16} /> };
                                return (
                                    <TableRow
                                        key={req.id}
                                        onClick={() => window.location.href = `${window.location.pathname}/vendors/${req.id}`}
                                        className="group cursor-pointer hover:bg-secondary/40"
                                    >
                                        <TableCell className="px-4 py-3">
                                            <div className="font-medium text-foreground">{req.name}</div>
                                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground truncate">
                                                <MapPin size={12} className="opacity-60" />
                                                {req.location}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="text-sm text-foreground">{req.categories[0]}</div>
                                            <div className="mt-1 text-xs text-muted-foreground">Updated {req.date}</div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-sm">{req.phone}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className={`inline-flex items-center gap-2 rounded-full border border-transparent px-2.5 py-1 text-[10px] font-medium ${statusConfig.color}`}>
                                                {statusConfig.icon} {req.status}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right text-sm font-medium">{req.priceDisplay}</TableCell>
                                        <TableCell className="px-4 py-3 text-right">
                                            <ChevronRight size={16} className="inline text-muted-foreground group-hover:text-primary transition-colors" />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                    No vendors found in this category.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default VendorsTab;
