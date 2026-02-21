"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Star, MapPin, CheckCircle2, MessageSquare, Heart, Share2, Calendar, Globe, Award, ShieldCheck, Zap, Video, Image as ImageIcon } from 'lucide-react';
import { type Vendor } from '@/lib/types';

interface VendorDetailProps {
  vendor: Vendor;
}

const VendorDetail: React.FC<VendorDetailProps> = ({ vendor }) => {
  const router = useRouter();
  const onBack = () => router.push('/dashboard/hosts/vendors');
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold"
        >
          <ChevronLeft size={16} />
          Back to Browse
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-card border border-border hover:bg-accent text-muted-foreground transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-2 rounded-full bg-card border border-border hover:bg-accent text-muted-foreground transition-all">
            <Heart size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery - More Compact */}
          {vendor.gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {vendor.gallery.slice(0, 3).map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-border hover:scale-105 transition-transform cursor-pointer">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Identity & Stats Combined */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-4">
            <div className="flex flex-wrap gap-2">
              {vendor.categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-secondary text-foreground rounded-full text-xs font-bold">{cat}</span>
              ))}
              <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-xs font-bold">Est. {vendor.yearEstablished}</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{vendor.name}</h1>
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-1 text-foreground font-medium text-sm">
                <Star size={16} className="fill-primary text-primary" />
                {vendor.rating} <span className="text-muted-foreground font-medium ml-1">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground font-medium text-sm">
                <MapPin size={16} className="text-accent" />
                {vendor.location}
              </div>
            </div>

            {/* Inline Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-foreground">{vendor.stats.eventsPlanned}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Events</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-foreground">{vendor.stats.satisfiedClients}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Clients</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-foreground">{vendor.stats.yearsExperience}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Experience</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-foreground">{vendor.stats.uniqueLocations}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Locations</p>
              </div>
            </div>
          </div>

          {/* About & Package Combined */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-4">
            <h3 className="text-lg font-bold text-foreground">About & Services</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{vendor.description}</p>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-600" />
                What's Included
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {vendor.whatsIncluded.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-foreground text-sm">
                    <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Section - 3 Columns */}
          {vendor.portfolio && vendor.portfolio.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Zap size={18} className="text-accent" />
                Recent Work
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {vendor.portfolio.slice(0, 6).map(item => (
                  <div key={item.id} className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                      />
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                        {item.type === 'Video' ? <Video size={10} /> : <ImageIcon size={10} />}
                        {item.type}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-foreground truncate">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Sticky - More Compact */}
        <div className="space-y-4">
          <div className="sticky top-20 bg-card p-5 rounded-lg border border-border space-y-4">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Starting Price</p>
              <p className="text-xl font-black text-foreground">{vendor.price || 'By Request'}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Response</span>
                <span className="font-bold flex items-center gap-1"><Zap size={12} className="text-primary" /> {vendor.responseTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Serves</span>
                <span className="font-bold text-right">{vendor.areaServed[0]}</span>
              </div>
            </div>

            <div className="space-y-2 pt-3">
              <button className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-all">
                Save Vendor
              </button>
              <Link
                href={`/dashboard/hosts/inbox?vendorId=${vendor.id}`}
                className="w-full bg-card hover:bg-accent text-foreground py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all border border-border"
              >
                <MessageSquare size={14} />
                Contact Vendor
              </Link>
            </div>

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={12} className="text-green-600" />
                Verified Partner
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;
