"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Inbox, { ChatConversation, InboxContact } from '@/components/dashboard/Inbox';
import { getEvents, getVendors } from '@/lib/firestore-service';
import { Vendor, SharedEvent } from '@/lib/types';
import { useAuth } from '@/components/providers/auth-provider';
import { useSavedVendors } from '@/hooks/use-saved-vendors';

const generateConversations = (events: SharedEvent[], allVendors: Vendor[]): ChatConversation[] => {
  // Logic to build conversations from event bookedVendors
  const conversations: ChatConversation[] = [];

  events.forEach(event => {
    event.bookedVendors?.forEach((booking, index) => {
      const vendor = allVendors.find(v => v.id === booking.vendorId);
      if (vendor) {
        const conversationId = `${vendor.id}:${event.id || index}`;
        conversations.push({
          id: conversationId,
          name: vendor.name,
          eventName: event.eventName,
          phone: vendor.phone,
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
  const vendorNameParam = searchParams.get('vendorName');
  const { user, loading: authLoading } = useAuth();
  const { savedVendorIds } = useSavedVendors(user?.uid);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [contacts, setContacts] = useState<InboxContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [events, allVendors] = await Promise.all([getEvents(user.uid), getVendors()]);
        const generated = generateConversations(events, allVendors);
        setContacts(
          allVendors.map((vendor) => ({
            id: vendor.id,
            name: vendor.name,
          }))
        );
        if (vendorIdParam) {
          const existing = generated.some((conv) => conv.id.startsWith(`${vendorIdParam}:`) || conv.id === vendorIdParam);
          if (!existing) {
            const vendor = allVendors.find((v) => v.id === vendorIdParam);
            const displayName = vendor?.name || vendorNameParam || "Vendor";
            const conversationId = `${vendorIdParam}:direct`;
            generated.unshift({
              id: conversationId,
              name: displayName,
              eventName: events[0]?.eventName || "General Inquiry",
              phone: vendor?.phone,
              lastMsg: "Start a new conversation",
              time: "Now",
              unread: false,
              status: "requested",
              messages: [
                {
                  id: "seed-1",
                  senderId: "me",
                  text: `Hi ${displayName}, I’m interested in your services for my event.`,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  isMe: true,
                },
              ],
            });
          }
        }
        setConversations(generated);
      } catch (error) {
        console.error("Error fetching host inbox data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (!authLoading) {
      if (user) {
        fetchData();
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, vendorIdParam, vendorNameParam]);

  const savedContacts = React.useMemo(() => {
    return contacts.filter(contact => savedVendorIds.has(contact.id));
  }, [contacts, savedVendorIds]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-9rem)] bg-background border border-border rounded-lg overflow-hidden animate-pulse">
          <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col p-4 space-y-4">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded-xl" />
            <div className="space-y-4 pt-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-full bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full" />
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Inbox
        conversations={conversations}
        contacts={savedContacts}
        userType="host"
        title="Messages"
        preferredConversationId={vendorIdParam || undefined}
      />
    </div>
  );
};

export default function HostInboxPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-9rem)] bg-background border border-border rounded-lg overflow-hidden animate-pulse">
          <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col p-4 space-y-4">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded-xl" />
            <div className="space-y-4 pt-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-full bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <InboxContent />
    </Suspense>
  );
}
