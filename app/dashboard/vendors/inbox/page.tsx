"use client";

import React, { Suspense, useState, useEffect } from 'react';
import Inbox, { ChatConversation } from '@/components/dashboard/Inbox';
import { SharedEvent } from '@/lib/shared-data';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import { getEvents } from '@/lib/firestore-service';

const generateConversations = (events: SharedEvent[]): ChatConversation[] => {
  const contracts = events.filter(event =>
    event.bookedVendors.some(bv => bv.vendorId === VENDOR_DASHBOARD_DATA.currentVendorId)
  );

  return contracts.map((event, index) => {
    const vendorBooking = event.bookedVendors.find(
      bv => bv.vendorId === VENDOR_DASHBOARD_DATA.currentVendorId
    );

    return {
      id: event.id,
      name: event.hostName,
      eventName: event.eventName,
      lastMsg: index === 0 ? 'Thank you! I\'ve received the documents.' :
        index === 1 ? 'I\'ll review everything and get back to you.' :
          'Thank you for accepting our booking.',
      time: index === 0 ? '10:30 AM' : index === 1 ? 'Yesterday' : 'Mon',
      unread: index === 0,
      status: vendorBooking?.status.toLowerCase() || 'pending',
      messages: [
        {
          id: '1',
          senderId: 'host',
          text: `Hello! Thank you so much for accepting our event booking. We're really looking forward to working with you on ${event.eventName}. I've uploaded the initial requirements to the contract tab.`,
          timestamp: '10:00 AM',
          isMe: false
        },
        {
          id: '2',
          senderId: 'me',
          text: 'Thank you! I\'ve received the documents. I\'m excited to be part of the event. I\'ll review everything and get back to you shortly.',
          timestamp: '10:30 AM',
          isMe: true
        }
      ]
    };
  });
};

const InboxContent: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const events = await getEvents();
        setConversations(generateConversations(events));
      } catch (error) {
        console.error("Error fetching inbox data:", error);
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
        userType="vendor"
        title="Inbox"
      />
    </div>
  );
};

export default function VendorInboxPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading inbox...</div>}>
      <InboxContent />
    </Suspense>
  );
};