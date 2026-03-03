"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Send, ChevronDown, ArrowLeft } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';

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
    const { user } = useAuth();
    const [events, setEvents] = useState<SharedEvent[]>([]);
    const initialChats = useMemo(() => generateChats(events), [events]);
    const [chats, setChats] = useState(initialChats);
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

    useEffect(() => {
        async function loadEvents() {
            try {
                setEvents(await getEvents(user?.uid, user?.email || undefined));
            } catch (error) {
                console.error("Failed to load inbox events:", error);
            }
        }
        loadEvents();
    }, [user?.uid, user?.email]);

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
            <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">No Messages Yet</h3>
                <p className="text-sm text-muted-foreground">Your client conversations will appear here once you have contracts.</p>
            </div>
        );
    }

    return (
        <div className="h-[70vh] min-h-[550px] flex flex-col md:flex-row bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* Sidebar */}
            <div className={cn(
                "w-full md:w-80 border-r border-border flex flex-col min-h-0 bg-muted/5",
                mobileView === 'chat' ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground mb-3">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input type="text" placeholder="Search chats..." className="w-full pl-9 h-9 bg-background border-border rounded-xl text-sm" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => { setActiveChat(chat); setMobileView('chat'); }}
                            className={cn(
                                "w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-start gap-4",
                                activeChat?.id === chat.id ? 'bg-muted' : ''
                            )}
                        >
                            <div className="w-11 h-11 rounded-xl bg-secondary overflow-hidden shrink-0 border border-border/50 shadow-sm">
                                <img src={chat.image || '/placeholder.png'} alt={chat.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className="font-bold text-sm text-foreground truncate">{chat.name}</h4>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{chat.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-semibold truncate uppercase tracking-widest mb-1">{chat.eventName}</p>
                                <p className="text-sm text-muted-foreground truncate font-medium">{chat.lastMsg}</p>
                                {chat.unread && <div className="mt-2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-background min-h-0",
                mobileView === 'list' ? "hidden md:flex" : "flex"
            )}>
                {activeChat ? (
                    <>
                        <div className="p-4 bg-muted/5 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
                                    onClick={() => setMobileView('list')}
                                >
                                    <ArrowLeft size={18} />
                                </Button>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-secondary overflow-hidden border border-border shadow-sm">
                                        <img src={activeChat.image || '/placeholder.png'} alt={activeChat.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm text-foreground truncate">{activeChat.name}</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Active now</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-2 rounded-xl font-bold text-xs border-border bg-card shadow-sm">
                                        {activeChat.status.charAt(0).toUpperCase() + activeChat.status.slice(1)}
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[180px]">
                                    {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Paid'].map((status) => (
                                        <DropdownMenuItem
                                            key={status}
                                            onSelect={() => updateStatus(activeChat.id, status.toLowerCase())}
                                            className="rounded-lg font-bold text-xs hover:bg-secondary"
                                        >
                                            Mark as {status}
                                        </DropdownMenuItem>
                                    ))}
                                    <div className="h-px bg-border my-1" />
                                    <DropdownMenuItem
                                        onSelect={() => updateStatus(activeChat.id, 'cancelled')}
                                        className="text-red-600 rounded-lg font-bold text-xs focus:bg-red-50 focus:text-red-600"
                                    >
                                        Cancel Contract
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-muted/5">
                            <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[75%] mr-auto">
                                <div className="w-7 h-7 rounded-lg bg-secondary overflow-hidden shrink-0 border border-border shadow-sm">
                                    <img src={activeChat.image || '/placeholder.png'} alt={activeChat.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-card p-3 rounded-2xl rounded-tl-none border border-border shadow-sm text-sm text-foreground leading-relaxed font-medium">
                                    Hello! Thank you so much for accepting our event booking. We're really looking forward to working with you on {activeChat.eventName}.
                                    I've uploaded the initial requirements to the contract tab.
                                </div>
                            </div>
                            <div className="flex items-start gap-3 justify-end max-w-[90%] sm:max-w-[75%] ml-auto">
                                <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none shadow-lg shadow-primary/10 text-sm leading-relaxed font-bold">
                                    Thank you! I've received the documents. I'm excited to be part of {activeChat.eventName}. I'll review everything and get back to you shortly.
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-background border-t border-border">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Type your response..."
                                    className="flex-1 h-11 px-4 bg-muted/10 border-transparent rounded-xl font-medium focus:bg-background focus:ring-0 text-sm"
                                />
                                <Button size="icon" className="h-11 w-11 rounded-xl shrink-0 shadow-lg shadow-primary/20">
                                    <Send size={20} />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground/30">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Send size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Select a conversation</h3>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Choose a host to start chatting about your job.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
