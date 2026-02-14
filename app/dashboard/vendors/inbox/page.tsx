"use client";

import React, { useState } from 'react';
import { Search, Send, User, MapPin, ChevronDown, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { SHARED_EVENTS } from '@/lib/shared-data';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';

// Generate chats from events where vendor is involved
const generateChats = () => {
  const contracts = SHARED_EVENTS.filter(event =>
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
      lastMsg: index === 0 ? 'Looking forward to working with you!' :
        index === 1 ? 'Can we discuss the final details?' :
          'Thank you for accepting our booking.',
      time: index === 0 ? '10:30 AM' : index === 1 ? 'Yesterday' : 'Mon',
      unread: index === 0,
      avatar: event.hostName.substring(0, 1).toUpperCase(),
      status: vendorBooking?.status.toLowerCase() || 'pending',
      location: event.location,
      price: vendorBooking?.amount || 'TBD',
      date: event.date,
    };
  });
};

const VendorInbox: React.FC = () => {
  const [chats, setChats] = useState(generateChats());
  const [activeChat, setActiveChat] = useState<any | null>(chats[0] || null);

  const updateStatus = (chatId: string, newStatus: string) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, status: newStatus } : chat
    ));
    if (activeChat?.id === chatId) {
      setActiveChat((prev: any) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  if (chats.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Messages Yet</h3>
          <p className="text-slate-500">Your client conversations will appear here once you have contracts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-serif font-black text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {chats.map((chat) => (
            <button key={chat.id} onClick={() => setActiveChat(chat)} className={`w-full p-6 text-left hover:bg-slate-50 transition-colors flex items-start gap-4 ${activeChat?.id === chat.id ? 'bg-primary/5' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">{chat.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 truncate">{chat.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-widest">{chat.eventName}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{chat.time}</span>
                </div>
                <p className="text-sm text-slate-500 truncate">{chat.lastMsg}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <Calendar size={10} className="text-primary" />
                    <span>{chat.date}</span>
                  </div>
                  <span className="text-[10px] font-black text-primary">{chat.price}</span>
                </div>
                {chat.unread && <div className="mt-2 w-2 h-2 bg-primary rounded-full" />}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-slate-50/20">
        {activeChat && (
          <>
            <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">{activeChat.avatar}</div>
                <div>
                  <h3 className="font-bold text-slate-900">{activeChat.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{activeChat.eventName}</p>
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
                    <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'pending')} className="rounded-xl font-bold">
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'confirmed')} className="rounded-xl font-bold">
                      Mark as Confirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'in-progress')} className="rounded-xl font-bold">
                      Mark as In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'completed')} className="rounded-xl font-bold">
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(activeChat.id, 'paid')} className="rounded-xl font-bold">
                      Mark as Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateStatus(activeChat.id, 'cancelled')}
                      className="text-red-600 rounded-xl font-bold focus:bg-red-50 focus:text-red-600"
                    >
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button className="text-primary text-sm font-black px-4 py-2 hover:bg-primary/5 rounded-2xl transition-colors">Profile</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="flex items-start gap-3 max-w-lg">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{activeChat.avatar}</div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed font-medium">
                  Hello! Thank you so much for accepting our event booking. We're really looking forward to working with you on {activeChat.eventName}. The event is scheduled for {activeChat.date} at {activeChat.location}. Let me know if you need any additional information!
                </div>
              </div>
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-primary p-4 rounded-[2rem] rounded-tr-none shadow-lg shadow-primary/10 text-sm text-white leading-relaxed max-w-lg font-bold">
                  Thank you! I'm excited to be part of your special event. I'll prepare everything according to our agreement. Feel free to reach out if you have any questions or special requests.
                </div>
              </div>
              <div className="flex items-start gap-3 max-w-lg">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{activeChat.avatar}</div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed font-medium">
                  Perfect! Can we schedule a call next week to go over the final details?
                </div>
              </div>
            </div>
            <div className="p-6 bg-white border-t border-border/50">
              <div className="flex gap-4">
                <input type="text" placeholder="Type your response..." className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-[2rem] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                <button className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VendorInbox;
