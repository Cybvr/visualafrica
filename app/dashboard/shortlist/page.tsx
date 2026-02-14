"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { vendors, Vendor } from '../../../lib/vendors-data';
import VendorCard from '../../../components/dashboard/VendorCard';
import { Heart } from 'lucide-react';

const Shortlist: React.FC = () => {
  const router = useRouter();
  // Using featured status as a proxy for "shortlisted" in this prototype
  const favorites = vendors.filter(v => v.featured);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Shortlist</h2>
          <p className="text-slate-500 mt-1">Found {favorites.length} vendors in your collection.</p>
        </div>
        <button className="bg-slate-100 text-slate-600 px-6 py-2 rounded-full text-sm font-bold hover:bg-slate-200">
          Compare Vendors
        </button>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map(vendor => (
            <div key={vendor.id} onClick={() => router.push(`/dashboard/vendor/${vendor.slug}`)}>
              <VendorCard {...vendor} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
          <Heart size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">Your shortlist is empty</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Browse the explore page to find and save vendors you love.</p>
        </div>
      )}
    </div>
  );
};

export default Shortlist;
