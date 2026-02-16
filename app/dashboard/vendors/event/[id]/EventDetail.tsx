"use client";
import React from 'react';
import { ChevronLeft, Calendar, MapPin, Users, DollarSign, MessageSquare, Heart, Share2 } from 'lucide-react';
import { SharedEvent } from '@/lib/shared-data';

interface EventDetailProps {
  event: SharedEvent;
  onBack: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack }) => {
  const [imgSrc, setImgSrc] = React.useState(
    event.image && event.image.trim() !== '' ? event.image : '/placeholder.png'
  );

  const handleImageError = () => {
    setImgSrc('/placeholder.png');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Completed':
        return 'bg-secondary text-foreground-700 border-slate-200';
      default:
        return 'bg-secondary text-foreground-700 border-slate-200';
    }
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Events
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary text-muted-foreground transition-all">
            <Share2 size={16} />
          </button>
          <button className="p-2 hover:bg-secondary text-muted-foreground transition-all">
            <Heart size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="aspect-[16/9] rounded overflow-hidden border border-border">
            <img
              src={imgSrc}
              alt={event.eventName}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Meta */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 border ${getStatusColor(event.status)} rounded text-xs font-medium`}>
                {event.status}
              </span>
            </div>

            <h1 className="text-3xl font-semibold text-foreground">{event.eventName}</h1>

            {(event.categories || event.themes) && (
              <div className="flex flex-wrap gap-2">
                {event.categories?.map((cat, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-card text-foreground-600 text-[10px] font-bold rounded-md uppercase">
                    {cat}
                  </span>
                ))}
                {event.themes?.map((theme, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-primary/5 text-primary/70 text-[10px] font-bold rounded-md border border-primary/10 italic">
                    {theme}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {event.date}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                {event.guestCount} guests
              </div>
            </div>
          </div>

          {/* Host Info */}
          <div className="bg-secondary p-4 rounded border border-border">
            <p className="text-xs text-muted-foreground mb-1">Event Host</p>
            <p className="font-medium text-foreground">{event.hostName}</p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Event Overview</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {/* Vendors */}
          {event.bookedVendors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Contracted Vendors</h3>
              <div className="border border-border rounded divide-y divide-border">
                {event.bookedVendors.map((vendor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-foreground">{vendor.service}</p>
                      <p className="text-xs text-muted-foreground">{vendor.status}</p>
                    </div>
                    <p className="font-semibold text-foreground">{vendor.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="sticky top-6 border border-border rounded p-6 space-y-6 bg-white">
            {/* Budget */}
            <div className="pb-6 border-b border-border">
              <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
              <p className="text-2xl font-semibold text-foreground">{formatBudget(event.budget)}</p>
            </div>

            {/* Key Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={`px-2 py-0.5 border ${getStatusColor(event.status)} rounded text-xs font-medium`}>
                  {event.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expected Guests</span>
                <span className="font-medium">{event.guestCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium text-right">{event.location}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded font-medium transition-colors">
                Submit Proposal
              </button>
              <button className="w-full border border-border hover:bg-secondary text-foreground py-3 rounded font-medium flex items-center justify-center gap-2 transition-colors">
                <MessageSquare size={16} />
                Contact Host
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
              Verified Event
            </p>
          </div>

          {/* Info Box */}
          <div className="border border-border rounded p-4 bg-secondary">
            <p className="text-sm font-medium text-foreground mb-2">Response Time Matters</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This host is actively reviewing proposals. Early submissions receive priority consideration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;