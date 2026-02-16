"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Send, User, MapPin, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { vendors } from '@/lib/vendors-data';

const CHATS = [
  { id: 'v-venue-1', name: 'The Monarch Event Center', lastMsg: 'The quote is ready for your review.', time: '10:30 AM', unread: true, avatar: 'M', status: 'quoted', location: 'Lekki, Lagos', price: 'NGN 5,000,000' },
  { id: 'v-catering-1', name: 'Naija Gourmet Flavors', lastMsg: 'Tasting scheduled for next Tuesday.', time: 'Yesterday', unread: false, avatar: 'N', status: 'booked', location: 'Ikoyi, Lagos', price: 'NGN 15,000/Guest' },
  { id: 'v-photo-1', name: 'Eko Lens Studio', lastMsg: 'Portfolio updated with new wedding samples.', time: 'Mon', unread: false, avatar: 'E', status: 'requested', location: 'Ikeja, Lagos', price: 'NGN 450,000' },
];

const InboxContent: React.FC = () => {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendorId');

  const [chats, setChats] = useState(CHATS);
  const [activeChat, setActiveChat] = useState(CHATS[0]);

  useEffect(() => {
    if (vendorId) {
      const existingChat = chats.find(c => c.id === vendorId);
      if (existingChat) {
        setActiveChat(existingChat);
      } else {
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor) {
          const newChat = {
            id: vendor.id,
            name: vendor.name,
            lastMsg: 'Start a conversation...',
            time: 'Now',
            unread: false,
            avatar: vendor.name.charAt(0),
            status: 'requested',
            location: vendor.location,
            price: vendor.price || 'N/A'
          };
          setChats(prev => [newChat, ...prev]);
          setActiveChat(newChat);
        }
      }
    }
  }, [vendorId]);

  const updateStatus = (chatId: string, newStatus: string) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, status: newStatus } : chat
    ));
    if (activeChat.id === chatId) {
      setActiveChat(prev => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="h-[calc(100vh-104px)] -m-6 md:-m-10 flex flex-col md:flex-row bg-background overflow-hidden">
      <div className="w-full md:w-80 border-r border-border flex flex-col">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-serif font-black text-foreground mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-secondary border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {chats.map((chat) => (
            <button key={chat.id} onClick={() => setActiveChat(chat)} className={`w-full p-6 text-left hover:bg-secondary transition-colors flex items-start gap-4 ${activeChat.id === chat.id ? 'bg-primary/5' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-background text-foreground flex items-center justify-center font-bold shrink-0">{chat.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-serif font-bold text-foreground truncate">{chat.name}</h4>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{chat.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMsg}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <MapPin size={10} className="text-primary" />
                    <span>{chat.location}</span>
                  </div>
                  <span className="text-[10px] font-black text-primary">{chat.price}</span>
                </div>
                {chat.unread && <div className="mt-2 w-2 h-2 bg-primary rounded-full" />}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-secondary/20">
        <div className="p-6 bg-card border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-background text-foreground flex items-center justify-center font-bold">{activeChat.avatar}</div>
            <div>
              <h3 className="font-bold text-foreground">{activeChat.name}</h3>
              <p className="text-xs text-muted-foreground font-medium italic">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl font-bold">
                  Update Status
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px]">
                <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'requested')} className="rounded-xl font-bold">
                  Mark as Requested
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'sent')} className="rounded-xl font-bold">
                  Mark as Sent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'quoted')} className="rounded-xl font-bold">
                  Mark as Quoted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'negotiating')} className="rounded-xl font-bold">
                  Mark as Negotiating
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'booked')} className="rounded-xl font-bold">
                  Mark as Booked
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateStatus(activeChat.id, 'declined')}
                  className="text-red-600 rounded-xl font-bold focus:bg-red-50 focus:text-red-600"
                >
                  Decline
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="text-primary text-sm font-black px-4 py-2 hover:bg-primary/5 rounded-2xl transition-colors">Profile</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex items-start gap-3 max-w-lg">
            <div className="w-8 h-8 rounded-lg bg-background text-foreground flex items-center justify-center text-[10px] font-bold shrink-0">{activeChat.avatar}</div>
            <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-border shadow-sm text-sm text-foreground leading-relaxed font-medium">
              Hello! We have reviewed your initial event brief. The venue in Lagos is available on May 29th. Would you like to schedule a virtual tour?
            </div>
          </div>
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-primary p-4 rounded-[2rem] rounded-tr-none shadow-lg shadow-primary/10 text-sm text-foreground leading-relaxed max-w-lg font-bold">
              That sounds great! Does next Tuesday at 2 PM work for you?
            </div>
          </div>
        </div>
        <div className="p-6 bg-card border-t border-border/50">
          <div className="flex gap-4">
            <input type="text" placeholder="Type your response..." className="flex-1 px-6 py-4 bg-secondary border-none rounded-[2rem] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
            <button className="w-14 h-14 bg-primary text-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Inbox() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading inbox...</div>}>
      <InboxContent />
    </Suspense>
  );
};