"use client";

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { vendors, VENDOR_CATEGORIES, Vendor } from '@/lib/vendors-data';
import VendorCard from '@/components/dashboard/VendorCard';

const Vendors: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [selectedCat, setSelectedCat] = useState('All Categories');

  // Strictly exclude 'Experiences' from the general vendors list
  const baseVendors = vendors.filter(v => !v.categories.includes('Experiences'));

  const filteredVendors = selectedCat === 'All Categories'
    ? baseVendors
    : baseVendors.filter(v => v.categories.includes(selectedCat as any));

  // For demo purposes, we'll just show the same list for saved if tab is 'saved'
  // In a real app, this would be filtered by user's shortlist
  const displayVendors = activeTab === 'all' ? filteredVendors : filteredVendors.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif font-black tracking-tight text-slate-900">Vendors</h2>
          <p className="text-slate-500 font-medium mt-1">Discover top-rated professionals for your Waddi event.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search packages..."
              className="pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-full text-sm outline-none w-64 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-100 rounded-full text-slate-600 hover:text-primary transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-100">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'all'
            ? 'border-primary text-primary'
            : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
        >
          All Vendors
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'saved'
            ? 'border-primary text-primary'
            : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
        >
          Saved Vendors
        </button>
      </div>

      {activeTab === 'all' && (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {VENDOR_CATEGORIES.filter(cat => cat !== 'Experiences').map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedCat === cat
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                : 'bg-white border-slate-100 text-slate-600 hover:border-primary'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayVendors.map(vendor => (
          <div key={vendor.id} onClick={() => router.push(`/dashboard/hosts/vendor/${vendor.slug}`)} className="cursor-pointer">
            <VendorCard {...vendor} />
          </div>
        ))}
      </div>

      {activeTab === 'saved' && displayVendors.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
          <p className="text-slate-400 font-bold">You haven't saved any vendors yet.</p>
        </div>
      )}
    </div>
  );
};

export default Vendors;
