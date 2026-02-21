"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Send, MapPin, ChevronDown, Calendar } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getEvents } from '@/lib/firestore-service';
import { SharedEvent } from '@/lib/types';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';

// Generate chats from events where vendor is involved
const generateChats = (events: SharedEvent[]) => {
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
            image: event.image
        };
    });
};

interface VendorInboxTabProps {
    focusedEventId?: string;
}

export default function VendorInboxTab({ focusedEventId }: VendorInboxTabProps) {
    const [events, setEvents] = useState<SharedEvent[]>([]);
    const initialChats = useMemo(() => generateChats(events), [events]);
    const [chats, setChats] = useState(initialChats);

    useEffect(() => {
        async function loadEvents() {
            try {
                setEvents(await getEvents());
            } catch (error) {
                console.error("Failed to load inbox events:", error);
            }
        }
        loadEvents();
    }, []);

    useEffect(() => {
        setChats(initialChats);
    }, [initialChats]);

    // Default to focused event if provided, else first chat
    const initialActive = focusedEventId
        ? initialChats.find(c => c.id === focusedEventId) || initialChats[0]
        : initialChats[0];

    const [activeChat, setActiveChat] = useState<any | null>(initialActive || null);

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
            <div className="bg-card rounded-[2.5rem] border border-border p-16 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">No Messages Yet</h3>
                <p className="text-muted-foreground">Your client conversations will appear here once you have contracts.</p>
            </div>
        );
    }

    return (
        <div className="h-[600px] flex flex-col md:flex-row bg-card rounded-[3rem] border border-border overflow-hidden shadow-sm">
            <div className="w-full md:w-80 border-r border-border flex flex-col">
                <div className="p-6 border-b border-border/50">
                    <h2 className="text-xl font-serif font-black text-foreground mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-secondary border-none rounded-2xl text-sm" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setActiveChat(chat)}
                            className={`w-full p-6 text-left hover:bg-secondary transition-colors flex items-start gap-4 ${activeChat?.id === chat.id ? 'bg-primary/5' : ''}`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-secondary overflow-hidden shrink-0">
                                <img src={chat.image || '/placeholder.png'} alt={chat.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="font-bold text-foreground truncate">{chat.name}</h4>
                                        <p className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-widest">{chat.eventName}</p>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{chat.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate font-medium">{chat.lastMsg}</p>
                                {chat.unread && <div className="mt-2 w-2 h-2 bg-primary rounded-full" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-secondary/10">
                {activeChat ? (
                    <>
                        <div className="p-6 bg-card border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary overflow-hidden">
                                    <img src={activeChat.image || '/placeholder.png'} alt={activeChat.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">{activeChat.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-muted-foreground font-medium">Active now</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2 rounded-xl font-bold">
                                            Update Status
                                            <ChevronDown className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px]">
                                        {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Paid'].map((status) => (
                                            <DropdownMenuItem key={status} onClick={() => updateStatus(activeChat.id, status.toLowerCase())} className="rounded-xl font-bold hover:bg-secondary">
                                                Mark as {status}
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuItem
                                            onClick={() => updateStatus(activeChat.id, 'cancelled')}
                                            className="text-red-600 rounded-xl font-bold focus:bg-red-50 focus:text-red-600"
                                        >
                                            Cancel
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="flex items-start gap-3 max-w-lg">
                                <div className="w-8 h-8 rounded-lg bg-secondary overflow-hidden shrink-0">
                                    <img src={activeChat.image || '/placeholder.png'} alt={activeChat.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-border shadow-sm text-sm text-foreground leading-relaxed font-medium">
                                    Hello! Thank you so much for accepting our event booking. We're really looking forward to working with you on {activeChat.eventName}.
                                    I've uploaded the initial requirements to the contract tab.
                                </div>
                            </div>
                            <div className="flex items-start gap-3 justify-end">
                                <div className="bg-primary p-4 rounded-[2rem] rounded-tr-none shadow-lg shadow-primary/10 text-sm text-white leading-relaxed max-w-lg font-bold">
                                    Thank you! I've received the documents. I'm excited to be part of {activeChat.eventName}. I'll review everything and get back to you shortly.
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-card border-t border-border/50">
                            <div className="flex gap-4">
                                <Input type="text" placeholder="Type your response..." className="flex-1 px-6 py-4 bg-secondary border-none rounded-[2rem] font-medium focus:ring-2 focus:ring-primary/20" />
                                <button className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                            <Send size={32} className="text-foreground-200" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Select a conversation</h3>
                        <p className="text-sm text-muted-foreground mt-1">Choose a host to start chatting about your job.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
