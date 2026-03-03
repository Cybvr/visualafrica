"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Inbox, { ChatConversation, ComposeEvent, InboxContact } from '@/components/dashboard/Inbox';
import { removeConversationFromEvent, getEvents, getVendors, listenToMessages, saveChatMessage } from '@/lib/firestore-service';
import { Vendor, SharedEvent } from '@/lib/types';
import { useAuth } from '@/components/providers/auth-provider';
import { useSavedVendors } from '@/hooks/use-saved-vendors';

const generateConversations = (events: SharedEvent[], allVendors: Vendor[]): ChatConversation[] => {
  const conversations: ChatConversation[] = [];

  events.forEach(event => {
    // Add conversations from booked vendors
    event.bookedVendors?.forEach((booking, index) => {
      const vendor = allVendors.find(v => v.id === booking.vendorId);
      if (vendor) {
        conversations.push({
          id: `${event.id}:${vendor.id}`,
          name: vendor.name,
          eventName: event.eventName,
          phone: vendor.phone,
          lastMsg: 'Handled Booking',
          time: 'Active',
          unread: false,
          status: booking.status.toLowerCase(),
          messages: []
        });
      }
    });

    // Add conversations from leads
    event.leads?.forEach((lead) => {
      if (conversations.some(c => c.id === `${event.id}:${lead.vendorId}`)) return;
      const vendor = allVendors.find(v => v.id === lead.vendorId);
      if (vendor) {
        conversations.push({
          id: `${event.id}:${vendor.id}`,
          name: vendor.name,
          eventName: event.eventName,
          phone: vendor.phone,
          lastMsg: 'Proposal Received',
          time: 'Active',
          unread: false,
          status: lead.status.toLowerCase(),
          messages: []
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
  const [composeEvents, setComposeEvents] = useState<ComposeEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [events, allVendors] = await Promise.all([getEvents(user.uid), getVendors()]);
        const generated = generateConversations(events, allVendors);

        setContacts(allVendors.map(v => ({
          id: v.id,
          name: v.name,
          service: v.categories?.[0] || "Vendor"
        })));

        setComposeEvents(events.map(e => ({
          id: e.id,
          name: e.eventName,
          date: e.date,
          location: e.location
        })));

        setConversations(generated);
      } catch (error) {
        console.error("Error fetching host inbox data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (!authLoading && user) fetchData();
    else if (!authLoading && !user) setIsLoading(false);
  }, [user, authLoading]);

  // Real-time listener for messages
  useEffect(() => {
    if (!user || conversations.length === 0) return;

    const unsubscribes = conversations.map(conv => {
      return listenToMessages(conv.id, (newMessages) => {
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
                timestamp: m.timestamp?.toDate ? m.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (m.timestamp || 'Just now'),
                isMe: m.isMe ?? (m.senderId === user.uid)
              })),
              lastMsg: newMessages[newMessages.length - 1].text,
              time: 'Now'
            }
            : c
        ));
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [user, conversations.length]);

  const handleSendMessage = async (chatId: string, message: { text: string; attachment?: any }) => {
    if (!user) return;
    try {
      await saveChatMessage(chatId, {
        senderId: user.uid,
        senderName: "Host",
        text: message.text,
        isMe: true,
        attachment: message.attachment
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteConversation = async (chatId: string) => {
    setConversations((prev) => prev.filter((conversation) => conversation.id !== chatId));
    try {
      await removeConversationFromEvent(chatId);
    } catch (error) {
      console.error("Error deleting host conversation:", error);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading messages...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <Inbox
        conversations={conversations}
        contacts={contacts.filter(c => savedVendorIds.has(c.id))}
        composeEvents={composeEvents}
        userType="host"
        title="Messages"
        preferredConversationId={vendorIdParam || undefined}
        currentUserId={user?.uid}
        onSendMessage={handleSendMessage}
        onDeleteConversation={handleDeleteConversation}
      />
    </div>
  );
};

export default function HostInboxPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading messages...</div>}>
      <InboxContent />
    </Suspense>
  );
}
