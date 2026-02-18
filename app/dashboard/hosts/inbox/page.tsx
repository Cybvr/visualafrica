"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Inbox, { ChatConversation } from '@/components/dashboard/Inbox';
import { vendors } from '@/lib/vendors-data';
import { SHARED_EVENTS } from '@/lib/shared-data';

const getVendorStatus = (vendorId: string): string => {
  for (const event of SHARED_EVENTS) {
    const booking = event.bookedVendors?.find(b => b.vendorId === vendorId);
    if (booking) {
      return booking.status.toLowerCase();
    }
  }
  return 'requested';
};

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'v-venue-1',
    name: 'The Monarch',
    lastMsg: 'The quote is ready for your review.',
    time: '10:30 AM',
    unread: true,
    status: 'quoted',
    eventName: 'Chidi & Amaka Wedding',
    messages: [
      { id: '1', senderId: 'v-venue-1', text: 'Hello! We have reviewed your initial event brief. The venue in Lagos is available on May 29th. Would you like to schedule a virtual tour?', timestamp: '10:00 AM', isMe: false },
      { id: '2', senderId: 'me', text: 'That sounds great! Does next Tuesday at 2 PM work for you?', timestamp: '10:15 AM', isMe: true },
      { id: '3', senderId: 'v-venue-1', text: 'The quote is ready for your review.', timestamp: '10:30 AM', isMe: false },
    ]
  },
  {
    id: 'v-catering-1',
    name: 'Naija Gourmet Flavors',
    lastMsg: 'Tasting scheduled for next Tuesday.',
    time: 'Yesterday',
    unread: false,
    status: 'booked',
    eventName: 'Tech Conference 2025',
    messages: [
      { id: '1', senderId: 'v-catering-1', text: 'We have variety of menus for your tech conference. When would you like to have a tasting?', timestamp: 'Mon 2:00 PM', isMe: false },
      { id: '2', senderId: 'me', text: 'Next Tuesday works for us.', timestamp: 'Mon 3:15 PM', isMe: true },
      { id: '3', senderId: 'v-catering-1', text: 'Perfect, tasting scheduled for next Tuesday.', timestamp: 'Yesterday', isMe: false },
    ]
  },
  {
    id: 'v-photo-1',
    name: 'Eko Lens Studio',
    lastMsg: 'Portfolio updated with new wedding samples.',
    time: 'Mon',
    unread: false,
    status: 'requested',
    eventName: 'Chidi & Amaka Wedding',
    messages: [
      { id: '1', senderId: 'v-photo-1', text: 'I have updated my portfolio with new wedding samples from last weekend.', timestamp: 'Mon 9:00 AM', isMe: false },
    ]
  }
];

const InboxContent: React.FC = () => {
  const searchParams = useSearchParams();
  const vendorIdParam = searchParams.get('vendorId');

  // Logic to handle specific vendor conversation from URL if needed
  // For now, we use the initial mock data

  return (
    <div className="max-w-7xl mx-auto">
      <Inbox
        conversations={INITIAL_CONVERSATIONS}
        userType="host"
        title="Messages"
      />
    </div>
  );
};

export default function HostInboxPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading inbox...</div>}>
      <InboxContent />
    </Suspense>
  );
};