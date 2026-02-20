"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Vendor } from '@/lib/vendors-data';
import VendorCard from '@/components/dashboard/VendorCard';
import { getVendors } from '@/lib/firestore-service';

const ExperiencesPage: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchVendors() {
            try {
                const data = await getVendors();
                setVendors(data);
            } catch (error) {
                console.error("Error fetching experiences data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchVendors();
    }, []);

    // Filter for experiences only
    const experiencesVendors = vendors.filter(v => v.categories.includes('Experiences'));

    // For demo purposes, we'll just show the same list for saved if tab is 'saved'
    const displayExperiences = activeTab === 'all' ? experiencesVendors : experiencesVendors.slice(0, 1);

    if (isLoading) return <div className="p-10 text-center">Loading experiences...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-primary" size={20} />
                        <span className="text-primary text-[10px] font-black uppercase tracking-widest">Premium Branded</span>
                    </div>
                    <h2 className="text-4xl font-serif font-black tracking-tight text-foreground">Experiences</h2>
                    <p className="text-muted-foreground font-medium mt-1">Ultra-exclusive curated events and activity packages.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search experiences..."
                            className="pl-12 pr-6 py-4 bg-white border border-border rounded-2xl w-full md:w-80 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <button className="p-4 bg-white border border-border rounded-2xl text-muted-foreground hover:text-primary transition-all shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-border">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'all'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                        }`}
                >
                    All Experiences
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'saved'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-muted-foreground'
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
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                            <Search className="text-muted-foreground" size={32} />
                        </div>
                        <p className="text-muted-foreground font-bold">No experiences found at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperiencesPage;
