"use client";

import React, { useState } from 'react';
import { Send, ChevronDown, ArrowLeft } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DashboardFilter } from '../DashboardFilter';
import { cn } from "@/lib/utils"

const CHATS = [
    { id: 1, name: 'The Monarch', lastMsg: 'The quote is ready for your review.', time: '10:30 AM', unread: true, avatar: 'M', status: 'quoted', location: 'Lekki, Lagos', price: 'NGN 5,000,000' },
    { id: 2, name: 'Naija Gourmet Flavors', lastMsg: 'Tasting scheduled for next Tuesday.', time: 'Yesterday', unread: false, avatar: 'N', status: 'booked', location: 'Ikoyi, Lagos', price: 'NGN 15,000/Guest' },
    { id: 3, name: 'Eko Lens Studio', lastMsg: 'Portfolio updated with new wedding samples.', time: 'Mon', unread: false, avatar: 'E', status: 'requested', location: 'Ikeja, Lagos', price: 'NGN 450,000' },
];

export default function InboxTab() {
    const [activeChat, setActiveChat] = useState(CHATS[0]);
    const [chats, setChats] = useState(CHATS);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState<'list' | 'chat'>('list');

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
        <div className="flex flex-col gap-3 h-[70vh] min-h-[500px] mb-6">
            <div className={cn(activeView === 'chat' && "hidden")}>
                <DashboardFilter
                    placeholder="Search chats..."
                    onSearchChange={setSearchQuery}
                />
            </div>

            <div className="flex-1 flex flex-col bg-background border border-border rounded-xl overflow-hidden shadow-sm">
                {/* Sidebar */}
                <div className={cn(
                    "w-full border-r border-border flex flex-col min-h-0 bg-muted/5",
                    activeView === 'chat' ? "hidden" : "flex"
                )}>
                    <div className="flex-1 overflow-y-auto divide-y divide-border">
                        {filteredChats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => { setActiveChat(chat); setActiveView('chat'); }}
                                className={cn(
                                    "w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center gap-3",
                                    activeChat.id === chat.id ? 'bg-muted' : ''
                                )}
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                    {chat.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-foreground truncate">{chat.name}</h4>
                                    <span className="block mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                                        {chat.time}
                                    </span>
                                </div>
                            </button>
                        ))}
                        {filteredChats.length === 0 && (
                            <div className="p-8 text-center text-sm text-muted-foreground">No chats found.</div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={cn(
                    "flex-1 flex flex-col bg-background min-h-0",
                    activeView === 'list' ? "hidden" : "flex"
                )}>
                    {/* Chat Header */}
                    <div className="p-4 bg-muted/5 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setActiveView('list')}
                            >
                                <ArrowLeft size={18} />
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                    {activeChat.avatar}
                                </div>
                                <h4 className="text-sm font-medium text-foreground truncate">{activeChat.name}</h4>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-2 rounded-md font-semibold text-xs border-border bg-card">
                                    {activeChat.status.charAt(0).toUpperCase() + activeChat.status.slice(1)}
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[180px]">
                                {['Requested', 'Sent', 'Quoted', 'Negotiating', 'Booked'].map((status) => (
                                    <DropdownMenuItem
                                        key={status}
                                        onSelect={() => updateStatus(activeChat.id, status.toLowerCase())}
                                        className="rounded-lg font-medium text-xs"
                                    >
                                        Mark as {status}
                                    </DropdownMenuItem>
                                ))}
                                <div className="h-px bg-border my-1" />
                                <DropdownMenuItem
                                    onSelect={() => updateStatus(activeChat.id, 'declined')}
                                    className="text-red-600 rounded-lg font-medium text-xs focus:bg-red-50 focus:text-red-600"
                                >
                                    Decline / Cancel
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                        <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%] mr-auto">
                            <div className="p-3 bg-card border border-border rounded-2xl rounded-tl-none shadow-sm text-sm text-foreground leading-relaxed font-medium">
                                Hello! We have reviewed your initial event brief. The venue in Lagos is available on May 29th. Would you like to schedule a virtual tour?
                            </div>
                        </div>
                        <div className="flex items-start gap-3 justify-end max-w-[85%] sm:max-w-[75%] ml-auto">
                            <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed font-medium">
                                That sounds great! Does next Tuesday at 2 PM work for you?
                            </div>
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-background border-t border-border">
                        <div className="flex gap-2">
                            <Textarea
                                placeholder="Type your response..."
                                className="flex-1 px-3 py-2 rounded-xl border-border bg-muted/10 focus:bg-background resize-none min-h-[44px] max-h-[120px] font-medium text-sm transition-colors"
                            />
                            <Button size="icon" className="h-11 w-11 rounded-xl shrink-0 shadow-lg shadow-primary/20">
                                <Send size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
