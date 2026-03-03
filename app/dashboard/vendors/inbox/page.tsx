"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Inbox, { ChatConversation } from '@/components/dashboard/Inbox';
import { SharedEvent } from '@/lib/types';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import { deleteChat, getEvents, listenToMessages, saveChatMessage } from '@/lib/firestore-service';
import { useVendorProfile } from '@/hooks/use-vendor-profile';
import { useAuth } from '@/components/providers/auth-provider';

const generateConversations = (events: SharedEvent[], currentVendorId: string): ChatConversation[] => {
  const relevantEvents = events.filter(event =>
    (event.bookedVendors || []).some(bv => bv.vendorId === currentVendorId) ||
    (event.leads || []).some(l => l.vendorId === currentVendorId)
  );

  return relevantEvents.map((event) => {
    const vendorBooking = event.bookedVendors?.find(bv => bv.vendorId === currentVendorId);
    const vendorLead = event.leads?.find(l => l.vendorId === currentVendorId);

    return {
      id: event.id, // Using eventId as chat ID for now
      name: event.hostName || "Host",
      eventName: event.eventName,
      lastMsg: vendorBooking ? 'Handled Booking' : 'Proposal Sent',
      time: 'Active',
      unread: false,
      status: (vendorBooking?.status || vendorLead?.status || 'pending').toLowerCase(),
      messages: [] // Will be populated by listener
    };
  });
};

const InboxContent: React.FC = () => {
  const searchParams = useSearchParams();
  const eventIdParam = searchParams.get('eventId') || undefined;
  const { vendorId, isLoading: profileLoading } = useVendorProfile();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | undefined>(eventIdParam);

  useEffect(() => {
    async function fetchData() {
      if (!vendorId) {
        if (!profileLoading) setIsLoading(false);
        return;
      }
      try {
        const events = await getEvents();
        const generated = generateConversations(events, vendorId);

        if (eventIdParam && !generated.some(c => c.id === eventIdParam)) {
          const targetEvent = events.find((event) => event.id === eventIdParam);
          if (targetEvent) {
            generated.unshift({
              id: targetEvent.id,
              name: targetEvent.hostName || "Host",
              eventName: targetEvent.eventName,
              lastMsg: "New Proposal",
              time: "Now",
              unread: false,
              status: "pending",
              messages: [],
            });
          }
        }

        setConversations(generated);
      } catch (error) {
        console.error("Error fetching inbox data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [eventIdParam, vendorId, profileLoading]);

  // Handle message updates for all conversations
  useEffect(() => {
    if (!vendorId || conversations.length === 0) return;

    const unsubscribes = conversations.map(conv => {
      const fullChatId = `${conv.id}:${vendorId}`;
      return listenToMessages(fullChatId, (newMessages) => {
        if (newMessages.length === 0) return;
        setConversations(prev => prev.map(c =>
          c.id === conv.id
            ? {
              ...c,
              messages: newMessages.map(m => ({
                id: m.id,
                senderId: m.senderId,
                senderName: m.senderName,
                senderAvatar: m.senderAvatar,
                text: m.text,
                type: m.type,
                proposalData: m.proposalData,
                isMe: m.isMe ?? (m.senderId === user?.uid),
                timestamp: m.timestamp?.toDate ? m.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (m.timestamp || 'Just now'),
                attachment: m.attachment
              })),
              lastMsg: newMessages[newMessages.length - 1].text,
              time: 'Now'
            }
            : c
        ));
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [vendorId, conversations.length]);

  const handleSendMessage = async (chatId: string, message: { text: string; attachment?: any }) => {
    if (!vendorId) return;
    const fullChatId = chatId.includes(':') ? chatId : `${chatId}:${vendorId}`;
    try {
      await saveChatMessage(fullChatId, {
        senderId: vendorId,
        senderName: "Vendor", // We could use display name here
        text: message.text,
        isMe: true,
        attachment: message.attachment
      });
    } catch (error) {
      console.error("Error sending message from vendor inbox:", error);
    }
  };

  const handleDeleteConversation = async (chatId: string) => {
    setConversations((prev) => prev.filter((conversation) => conversation.id !== chatId));
    if (!vendorId) return;

    const fullChatId = chatId.includes(':') ? chatId : `${chatId}:${vendorId}`;
    try {
      await deleteChat(fullChatId);
    } catch (error) {
      console.error("Error deleting vendor conversation:", error);
    }
  };

  const { user } = useAuth();

  if (isLoading || profileLoading) return <div className="p-10 text-center">Loading inbox...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <Inbox
        conversations={conversations}
        userType="vendor"
        title="Inbox"
        preferredConversationId={activeChatId}
        currentUserId={vendorId || undefined}
        onSendMessage={handleSendMessage}
        onDeleteConversation={handleDeleteConversation}
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
