"use client";

import React from 'react';
import { Plus, Video, Image as ImageIcon, MoreHorizontal } from 'lucide-react';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';

export default function VendorPortfolioPage() {
    const { portfolioItems } = VENDOR_DASHBOARD_DATA;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">Portfolio</h2>
                    <p className="text-slate-500 mt-1">Showcase your best work to potential clients.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-colors">
                    <Plus size={18} />
                    Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioItems.map(item => (
                    <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                                {item.type === 'Video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                {item.type}
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white rounded-xl shadow-lg text-slate-900 hover:bg-slate-50 transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.date}</div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
