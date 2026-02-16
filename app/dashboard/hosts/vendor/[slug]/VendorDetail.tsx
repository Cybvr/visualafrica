"use client";
import React from 'react';
import { ChevronLeft, Star, MapPin, CheckCircle2, MessageSquare, Heart, Share2, Calendar, Globe, Award, ShieldCheck, Zap, Video, Image as ImageIcon } from 'lucide-react';
import { Vendor } from '@/lib/vendors-data';

interface VendorDetailProps {
  vendor: Vendor;
  onBack: () => void;
}

const VendorDetail: React.FC<VendorDetailProps> = ({ vendor, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ChevronLeft size={16} />
          Back to Browse
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-card border-border hover:bg-accent text-muted-foreground transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-2 rounded-full bg-card border-border hover:bg-accent text-muted-foreground transition-all">
            <Heart size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Hero & Gallery */}
          <div className="space-y-4">
            {vendor.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {vendor.gallery.map((img, idx) => (
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
          </div>

          {/* Identity */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {vendor.categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-card text-foreground rounded-full text-xs font-medium">{cat}</span>
              ))}
              <span className="px-3 py-1 bg-card text-foreground rounded-full text-xs font-medium">Est. {vendor.yearEstablished}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{vendor.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-foreground font-medium">
                <Star size={20} className="fill-primary text-primary" />
                {vendor.rating} <span className="text-muted-foreground font-medium ml-1">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground font-medium">
                <MapPin size={20} className="text-accent" />
                {vendor.location}
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-card p-6 rounded-lg border border-border">
            <div className="text-center space-y-1">
              <p className="text-xl font-bold text-foreground">{vendor.stats.eventsPlanned}</p>
              <p className="text-xs text-muted-foreground">Events</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xl font-bold text-foreground">{vendor.stats.satisfiedClients}</p>
              <p className="text-xs text-muted-foreground">Clients</p>
            </div>
            <div className="text-center space-y-1 border-x border-border">
              <p className="text-xl font-bold text-foreground">{vendor.stats.yearsExperience}</p>
              <p className="text-xs text-muted-foreground">Experience</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xl font-bold text-foreground">{vendor.stats.uniqueLocations}</p>
              <p className="text-xs text-muted-foreground">Locations</p>
            </div>
          </div>

          {/* Portfolio Section */}
          {vendor.portfolio && vendor.portfolio.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Zap size={20} className="text-accent" />
                  Work Portfolio
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendor.portfolio.map(item => (
                  <div key={item.id} className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                      />
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {item.type === 'Video' ? <Video size={12} /> : <ImageIcon size={12} />}
                        {item.type}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">{item.date}</div>
                      <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Descriptions */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Award size={20} className="text-accent" />
              About the Vendor
            </h3>
            <p className="text-muted-foreground leading-relaxed text-base">{vendor.description}</p>
            <div className="bg-card p-6 rounded-lg italic text-muted-foreground text-sm">
              "{vendor.about}"
            </div>
          </section>

          {/* Whats Included */}
          <section className="bg-card p-8 rounded-lg border border-border space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck size={20} className="text-green-600" />
              Standard Package
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendor.whatsIncluded.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-foreground font-medium">
                  <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} className="text-green-500" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Expert Planning Support - Moved under Standard Package */}
          <div className="bg-card border border-border p-6 rounded-lg space-y-3 text-center">
            <Globe className="mx-auto text-accent" size={24} />
            <h4 className="font-medium text-foreground text-lg">Expert Planning Support</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Waddi agents can negotiate this contract and manage logistics on your behalf.</p>
            <button className="text-primary font-medium text-xs hover:underline pt-1">Unlock Pro Perks →</button>
          </div>
        </div>

        {/* Sidebar Sticky */}
        <div className="space-y-6">
          <div className="sticky top-20 bg-card p-6 rounded-lg space-y-6">
            <div>
              <p className="text-muted-foreground text-xs font-medium mb-1">Starting Investment</p>
              <p className="text-2xl font-bold text-foreground">{vendor.price || 'By Request'}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-muted-foreground font-medium">Response Time</span>
                <span className="font-medium flex items-center gap-1"><Zap size={14} className="text-primary" /> {vendor.responseTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-muted-foreground font-medium">Areas Served</span>
                <span className="font-medium">{vendor.areaServed.join(', ')}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all">
                Save to List
              </button>
              <button className="w-full bg-card hover:bg-accent text-foreground py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all border border-border">
                <MessageSquare size={16} />
                Contact
              </button>

            </div>

            <p className="text-center text-xs text-muted-foreground pt-4">
              Verified Waddi Partner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;
