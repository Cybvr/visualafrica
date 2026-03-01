"use client";

import React, { useState } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DashboardFilter } from '../DashboardFilter';

const CHATS = [
    { id: 1, name: 'The Monarch', lastMsg: 'The quote is ready for your review.', time: '10:30 AM', unread: true, avatar: 'M', status: 'quoted', location: 'Lekki, Lagos', price: 'NGN 5,000,000' },
    { id: 2, name: 'Naija Gourmet Flavors', lastMsg: 'Tasting scheduled for next Tuesday.', time: 'Yesterday', unread: false, avatar: 'N', status: 'booked', location: 'Ikoyi, Lagos', price: 'NGN 15,000/Guest' },
    { id: 3, name: 'Eko Lens Studio', lastMsg: 'Portfolio updated with new wedding samples.', time: 'Mon', unread: false, avatar: 'E', status: 'requested', location: 'Ikeja, Lagos', price: 'NGN 450,000' },
];

export default function InboxTab() {
    const [activeChat, setActiveChat] = useState(CHATS[0]);
    const [chats, setChats] = useState(CHATS);
    const [searchQuery, setSearchQuery] = useState('');

    const updateStatus = (chatId: number, newStatus: string) => {
        setChats(prev => prev.map(chat =>
            chat.id === chatId ? { ...chat, status: newStatus } : chat
        ));
        if (activeChat.id === chatId) {
            setActiveChat(prev => ({ ...prev, status: newStatus }));
        }
    };

    const filteredChats = chats.filter((chat) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            chat.name.toLowerCase().includes(query) ||
            chat.lastMsg.toLowerCase().includes(query) ||
            chat.location.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-3">
            <DashboardFilter
                placeholder="Search chats..."
                onSearchChange={setSearchQuery}
            />
            <div className="h-[64vh] min-h-[440px] max-h-[760px] flex flex-col md:flex-row bg-background border border-border rounded-xl overflow-hidden">
                <div className="w-full md:w-64 border-r border-border flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {filteredChats.map((chat) => (
                        <button key={chat.id} onClick={() => setActiveChat(chat)} className={`w-full p-4 text-left hover:bg-secondary transition-colors flex items-center gap-3 ${activeChat.id === chat.id ? 'bg-primary/5' : ''}`}>
                            <div className="w-10 h-10 rounded-lg bg-background text-foreground flex items-center justify-center font-bold shrink-0">{chat.avatar}</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-medium text-foreground truncate">{chat.name}</h4>
                                <span className="block mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wide">{chat.time}</span>
                            </div>
                        </button>
                    ))}
                    {filteredChats.length === 0 && (
                        <div className="p-4 text-sm text-muted-foreground">No chats found.</div>
                    )}
                </div>
                </div>
                <div className="flex-1 flex flex-col bg-secondary/20 min-h-0">
                    <div className="p-4 bg-card border-b border-border flex items-center justify-between">
                        <div />
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-2 rounded-md font-semibold">
                                        Mark As
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px]">
                                    <DropdownMenuItem onSelect={() => updateStatus(activeChat.id, 'requested')} className="rounded-xl font-bold">
                                        Mark as Requested
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => updateStatus(activeChat.id, 'sent')} className="rounded-xl font-bold">
                                        Mark as Sent
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => updateStatus(activeChat.id, 'quoted')} className="rounded-xl font-bold">
                                        Mark as Quoted
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => updateStatus(activeChat.id, 'negotiating')} className="rounded-xl font-bold">
                                        Mark as Negotiating
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => updateStatus(activeChat.id, 'booked')} className="rounded-xl font-bold">
                                        Mark as Booked
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => updateStatus(activeChat.id, 'declined')}
                                        className="text-red-600 rounded-xl font-bold focus:bg-red-50 focus:text-red-600"
                                    >
                                        Decline
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <button className="text-primary text-sm font-semibold px-3 py-1.5 hover:bg-primary/5 rounded-md transition-colors">Profile</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex items-start gap-3 max-w-lg">
                            <div className="p-3 rounded-xl rounded-tl-none text-sm text-foreground leading-relaxed font-medium">
                                Hello! We have reviewed your initial event brief. The venue in Lagos is available on May 29th. Would you like to schedule a virtual tour?
                            </div>
                        </div>
                        <div className="flex items-start gap-3 justify-end">
                            <div className="bg-card/50 p-3 rounded-xl rounded-tr-none text-sm text-foreground leading-relaxed max-w-lg font-semibold">
                                That sounds great! Does next Tuesday at 2 PM work for you?
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-card border-t border-border/50">
                        <div className="flex gap-3">
                            <Textarea placeholder="Type your response..." className="flex-1 px-3 py-2 rounded-md resize-none min-h-[44px] max-h-[120px] font-medium" />
                            <button className="w-10 h-10 bg-primary text-foreground rounded-md flex items-center justify-center hover:opacity-90 transition-opacity">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
