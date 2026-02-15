
import React from 'react';
import { X, ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import VendorCard from './VendorCard';
import ItineraryCard from './ItineraryCard';
import GuestManagementCard from './GuestManagementCard';
// Import the central vendors data to fix type mismatches
import { vendors } from '../../lib/vendors-data';

const DashboardContent: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Overview Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
        <div className="flex items-center gap-2">
          <button className="border border-primary text-accent px-6 py-2 rounded-full text-sm font-semibold hover:bg-accent transition-colors">
            Learn more
          </button>
          <button className="p-2 text-muted-foreground hover:text-muted-foreground transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Upgrade Banner */}
      <div className="bg-accent/50 border border-border p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0 relative z-10">
          <Rocket size={24} className="text-white" />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-foreground">Upgrade to Full Service Planning</h3>
          <p className="text-muted-foreground text-sm">Want someone else to handle the details? We can help take care of everything for you.</p>
        </div>
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full opacity-10 translate-x-10 -translate-y-10" />
      </div>

      {/* Booked Vendors Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Your booked vendors</h3>
          <div className="flex items-center gap-2">
            <button className="p-1 text-muted-foreground hover:text-muted-foreground border border-border rounded-full">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 text-muted-foreground hover:text-muted-foreground border border-border rounded-full">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fix: Use data from lib/vendors-data.ts to satisfy Vendor type requirements */}
          {vendors.slice(0, 4).map(vendor => (
            <VendorCard key={vendor.id} {...vendor} />
          ))}
        </div>
      </section>

      {/* Secondary Row: Itinerary and Guest Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ItineraryCard />
        </div>
        <div className="lg:col-span-5">
          <GuestManagementCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
