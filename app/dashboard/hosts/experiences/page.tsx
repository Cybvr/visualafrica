"use client";

import React, { useState } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { vendors, VENDOR_CATEGORIES, Vendor } from '@/lib/vendors-data';
import VendorCard from '@/components/dashboard/VendorCard';

const ExperiencesPage: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

    // Filter for experiences only
    const experiencesVendors = vendors.filter(v => v.categories.includes('Experiences'));

    // For demo purposes, we'll just show the same list for saved if tab is 'saved'
    const displayExperiences = activeTab === 'all' ? experiencesVendors : experiencesVendors.slice(0, 1);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-orange-600" size={20} />
                        <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest">Premium Branded</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Experiences</h2>
                    <p className="text-slate-500 font-medium mt-1">Ultra-exclusive curated events and activity packages.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search experiences..."
                            className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl w-full md:w-80 font-bold focus:ring-2 focus:ring-orange-600 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-orange-600 transition-all shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-slate-100">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'all'
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                >
                    All Experiences
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'saved'
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Saved
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                {displayExperiences.map(vendor => (
                    <div key={vendor.id} onClick={() => router.push(`/dashboard/hosts/vendor/${vendor.slug}`)} className="cursor-pointer">
                        <VendorCard {...vendor} />
                    </div>
                ))}

                {displayExperiences.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <Search className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-400 font-bold">No experiences found at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperiencesPage;
