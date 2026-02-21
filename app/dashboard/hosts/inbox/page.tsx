"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Inbox, { ChatConversation } from '@/components/dashboard/Inbox';
import { getEvents, getVendors } from '@/lib/firestore-service';
import { Vendor, SharedEvent } from '@/lib/types';

const generateConversations = (events: SharedEvent[], allVendors: Vendor[]): ChatConversation[] => {
  // Logic to build conversations from event bookedVendors
  const conversations: ChatConversation[] = [];

  events.forEach(event => {
    event.bookedVendors?.forEach((booking, index) => {
      const vendor = allVendors.find(v => v.id === booking.vendorId);
      if (vendor) {
        conversations.push({
          id: vendor.id,
          name: vendor.name,
          eventName: event.eventName,
          lastMsg: index === 0 ? 'The quote is ready for your review.' : 'Tasting scheduled for next Tuesday.',
          time: index === 0 ? '10:30 AM' : 'Yesterday',
          unread: index === 0,
          status: booking.status.toLowerCase(),
          messages: [
            { id: '1', senderId: vendor.id, text: `Hello! We have reviewed your initial event brief. The ${booking.service} in Lagos is available.`, timestamp: '10:00 AM', isMe: false },
            { id: '2', senderId: 'me', text: 'That sounds great!', timestamp: '10:15 AM', isMe: true },
          ]
        });
      }
    });
  });

  return conversations;
};

const InboxContent: React.FC = () => {
  const searchParams = useSearchParams();
  const vendorIdParam = searchParams.get('vendorId');
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [events, allVendors] = await Promise.all([getEvents(), getVendors()]);
        setConversations(generateConversations(events, allVendors));
      } catch (error) {
        console.error("Error fetching host inbox data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <div className="p-10 text-center">Loading inbox...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <Inbox
        conversations={conversations}
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
