"use client";

import React from 'react';
import { FileText, Search, Filter, MoreHorizontal, Download, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { vendors } from '@/lib/vendors-data';

import { vendors as allVendors } from '@/lib/vendors-data';

interface ContractsTabProps {
    bookedVendors?: {
        vendorId: string;
        service: string;
        amount: string;
        status: 'Pending' | 'Confirmed' | 'Paid';
    }[];
}

export default function ContractsTab({ bookedVendors }: ContractsTabProps) {
    // Mock contract status mapping for demo
    const getStatusStyle = (status: string) => {
        const styles = {
            'Confirmed': 'bg-green-100 text-green-700',
            'Pending': 'bg-orange-100 text-orange-700',
            'Paid': 'bg-blue-100 text-blue-700',
            'Draft': 'bg-slate-100 text-slate-700',
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search contracts..."
                        className="w-full bg-slate-50 border border-slate-100 py-3 pl-12 pr-4 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-orange-600/10 outline-none placeholder:text-slate-400 text-sm transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm transition-all">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 text-sm transition-all">
                        <FileText size={16} />
                        New Contract
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {displayVendors.map((item, index) => {
                    const style = getStatusStyle(item.status);
                    return (
                        <div
                            key={`${item.id}-${index}`}
                            className="bg-white p-5 rounded-[2rem] border border-slate-100 hover:shadow-md transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                        <span className="flex items-center gap-1"><FileText size={12} /> Contract #{1000 + index}</span>
                                        <span>•</span>
                                        <span>{item.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 md:gap-10 w-full md:w-auto">
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${style}`}>
                                        {item.status}
                                    </span>
                                </div>

                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</div>
                                    <div className="font-bold text-slate-900 text-sm">{item.amount}</div>
                                </div>

                                <div className="flex items-center gap-1 ml-auto md:ml-0">
                                    <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                        <Download size={16} />
                                    </button>
                                    <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {displayVendors.length === 0 && (
                <div className="py-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-center">
                    <p className="text-slate-400 font-bold text-sm">No contracts found for this event.</p>
                </div>
            )}
        </div>
    );
}
