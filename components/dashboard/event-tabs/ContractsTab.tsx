"use client";

import React from 'react';
import Link from 'next/link';
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
    const displayVendors = bookedVendors ? bookedVendors.map(bv => {
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
    }));

    return (
        <div className="max-w-2xl mx-auto font-mono text-sm">
            <div className="mb-8 border-b border-black pb-2 flex justify-between items-end">
                <span className="font-bold uppercase tracking-tighter">Contracts ({displayVendors.length})</span>
                <button className="hover:underline text-xs">New +</button>
            </div>

            <div className="space-y-1">
                {displayVendors.map((item, index) => (
                    <Link
                        key={`${item.id}-${index}`}
                        href={`/dashboard/hosts/events/${eventId}/vendors/${item.id}`}
                        className="flex items-baseline justify-between py-1 hover:bg-black hover:text-white group px-1"
                    >
                        <div className="flex gap-4 items-baseline">
                            <span className="w-4 text-gray-400 text-[10px]">{index + 1}</span>
                            <span className="font-bold">{item.name}</span>
                            <span className="text-gray-500 text-xs group-hover:text-gray-300">{item.category}</span>
                        </div>

                        <div className="flex gap-6 items-baseline">
                            <span className={`text-[10px] uppercase font-bold ${item.status === 'Confirmed' ? 'text-green-600 group-hover:text-green-400' :
                                    item.status === 'Unresolved' ? 'text-red-600 group-hover:text-red-400' :
                                        'text-gray-400 group-hover:text-gray-200'
                                }`}>
                                {item.status}
                            </span>
                            <span className="w-20 text-right tabular-nums">{item.amount}</span>
                        </div>
                    </Link>
                ))}

                {displayVendors.length === 0 && (
                    <div className="py-4 text-gray-400 italic">Empty.</div>
                )}
            </div>
        </div>
    );
}
