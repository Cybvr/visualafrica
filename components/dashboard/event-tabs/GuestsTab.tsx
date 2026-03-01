"use client";

import React from 'react';
import { Users } from 'lucide-react';

import { SharedEvent } from '@/lib/types';
import { DashboardFilter } from '../DashboardFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GuestsTabProps {
    event: SharedEvent;
}

const GuestsTab: React.FC<GuestsTabProps> = ({ event }) => {
    const [activeStatus, setActiveStatus] = React.useState('All');
    const [searchQuery, setSearchQuery] = React.useState('');

    const statusesInData = Array.from(new Set(event.guests.map(g => g.status)));
    const tabs = ['All', ...statusesInData];
    const statusCounts = event.guests.reduce<Record<string, number>>((acc, guest) => {
        acc[guest.status] = (acc[guest.status] || 0) + 1;
        return acc;
    }, {});

    const filteredGuests = event.guests.filter(guest => {
        const matchesStatus = activeStatus === 'All' || guest.status === activeStatus;
        const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6 pt-2">
            <div className="flex flex-col gap-6">
                <DashboardFilter
                    placeholder="Search guests..."
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
                            <span className="inline-flex items-center gap-1.5">
                                <span>{tab}</span>
                                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] leading-none text-muted-foreground">
                                    {tab === 'All' ? event.guests.length : (statusCounts[tab] || 0)}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-secondary/30">
                        <TableRow>
                            <TableHead className="h-10 px-4 text-xs font-medium">Guest</TableHead>
                            <TableHead className="h-10 px-4 text-xs font-medium">Type</TableHead>
                            <TableHead className="h-10 px-4 text-xs font-medium">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredGuests.length > 0 ? filteredGuests.map((guest) => (
                            <TableRow key={guest.id}>
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium uppercase text-foreground">
                                            {guest.name[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-foreground">{guest.name}</p>
                                            <p className="truncate text-xs text-muted-foreground">{guest.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-sm text-muted-foreground">{guest.type}</TableCell>
                                <TableCell className="px-4 py-3">
                                    <span className={`rounded-md border px-2 py-1 text-[10px] font-medium ${guest.status === 'Confirmed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : (guest.status === 'Pending'
                                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                                            : 'bg-secondary text-muted-foreground border-transparent')
                                        }`}>
                                        {guest.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users size={24} className="opacity-30" />
                                        No guests match your search.
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default GuestsTab;
