"use client";
import React, { useState } from 'react';
import { ChevronLeft, Calendar, MapPin, Users, MessageSquare, Heart, Share2 } from 'lucide-react';
import { SharedEvent } from '@/lib/types';
import { SubmitProposalModal, ProposalData } from '@/components/dashboard/SubmitProposalModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface EventDetailProps {
  event: SharedEvent;
}

function formatEventDate(value: string): string {
  if (!value) return 'Date TBA';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
  const router = useRouter();
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = React.useState(
    event.image && event.image.trim() !== '' ? event.image : '/placeholder.png'
  );

  const handleImageError = () => {
    setImgSrc('/placeholder.png');
  };

  const handleProposalSubmit = async (proposalData: ProposalData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('You must be logged in to submit a proposal.');
        return;
      }

      const idToken = await user.getIdToken();
      const response = await fetch('/api/vendor/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          eventId: event.id,
          quotedPrice: proposalData.quotedPrice,
          deliveryTimeline: proposalData.deliveryTimeline,
          message: proposalData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit proposal');
      }

      toast.success('Proposal submitted successfully!');
      // Navigate to jobs page after submission
      router.push('/dashboard/vendors/jobs');
    } catch (error: any) {
      console.error('Error submitting proposal:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/dashboard/vendors"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Events
        </Link>
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
            <h1 className="text-3xl font-semibold text-foreground">{event.eventName}</h1>

            {Boolean(event.categories?.length) && (
              <div className="flex flex-wrap gap-2">
                {event.categories?.map((cat, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-card text-foreground-600 text-[10px] font-bold rounded-md uppercase">
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {formatEventDate(event.date)}
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

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Event Overview</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {/* Budget Items */}
          {event.budgetBreakdown && event.budgetBreakdown.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Budget Items</h3>
              <div className="border border-border rounded divide-y divide-border">
                {event.budgetBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4">
                    <p className="font-medium text-foreground">{item.category}</p>
                    <p className="font-semibold text-foreground">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Itinerary</h3>
            {event.itineraryItems && event.itineraryItems.length > 0 ? (
              <div className="border border-border rounded divide-y divide-border">
                {event.itineraryItems.map((item, idx) => (
                  <div key={`${item.time}-${item.label}-${idx}`} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-xs font-semibold text-muted-foreground">{item.time}</p>
                    </div>
                    {item.note ? (
                      <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No itinerary added yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="sticky top-6 border border-border rounded p-6 space-y-6 bg-white">
            {/* Key Details */}
            <div className="space-y-4 pb-6 border-b border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expected Guests</span>
                <span className="font-medium">{event.guestCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{formatEventDate(event.date)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium text-right">{event.location}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              <button
                onClick={() => setIsProposalModalOpen(true)}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded font-bold transition-colors"
              >
                Submit Proposal
              </button>
              <Link
                href={`/dashboard/vendors/inbox?eventId=${encodeURIComponent(event.id)}`}
                className="w-full border border-border hover:bg-secondary text-foreground py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare size={16} />
                Contact Host
              </Link>
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

      {/* Submit Proposal Modal */}
      <SubmitProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        eventName={event.eventName}
        eventId={event.id}
        onSubmit={handleProposalSubmit}
      />
    </div>
  );
};

export default EventDetail;
