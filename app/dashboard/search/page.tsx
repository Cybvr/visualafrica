"use client";

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { vendors, VENDOR_CATEGORIES, Vendor } from '../../../lib/vendors-data';
import VendorCard from '../../../components/dashboard/VendorCard';

const Explore: React.FC = () => {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('All Categories');

  const filteredVendors = selectedCat === 'All Categories'
    ? vendors
    : vendors.filter(v => v.categories.includes(selectedCat as any));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Search</h2>
          <p className="text-slate-500 text-sm mt-1">Discover top-rated vendors for your VisualAfrica event.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search packages..."
              className="pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-full text-sm outline-none w-64 focus:ring-2 focus:ring-orange-600/20 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-100 rounded-full text-slate-600 hover:text-orange-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {VENDOR_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedCat === cat
              ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20 scale-105'
              : 'bg-white border-slate-100 text-slate-600 hover:border-orange-600'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVendors.map(vendor => (
          <div key={vendor.id} onClick={() => router.push(`/dashboard/vendor/${vendor.slug}`)}>
            <VendorCard {...vendor} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
