"use client";

import React, { useState } from 'react';
import { Search, Send, ChevronDown, MoreHorizontal, Phone, Video, ArrowLeft } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isMe: boolean;
}

export interface ChatConversation {
    id: string;
    name: string;
    avatar?: string;
    lastMsg: string;
    time: string;
    unread: boolean;
    status: string;
    location?: string;
    price?: string;
    eventName?: string;
    messages: ChatMessage[];
}

interface InboxProps {
    conversations: ChatConversation[];
    userType: 'host' | 'vendor';
    title?: string;
}

export default function Inbox({ conversations: initialConversations, userType, title = "Messages" }: InboxProps) {
    const [conversations, setConversations] = useState(initialConversations);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChatId, setActiveChatId] = useState(initialConversations[0]?.id);
    const [messageInput, setMessageInput] = useState('');
    const [activeView, setActiveView] = useState<'list' | 'chat'>('list');

    const activeChat = conversations.find(c => c.id === activeChatId);

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.eventName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = () => {
        if (!messageInput.trim() || !activeChatId) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            senderId: 'me',
            text: messageInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setConversations(prev => prev.map(conv => {
            if (conv.id === activeChatId) {
                return {
                    ...conv,
                    lastMsg: messageInput,
                    time: 'Just now',
                    messages: [...conv.messages, newMessage]
                };
            }
            return conv;
        }));

        setMessageInput('');
    };

    const updateStatus = (chatId: string, newStatus: string) => {
        setConversations(prev => prev.map(chat =>
            chat.id === chatId ? { ...chat, status: newStatus } : chat
        ));
    };

    return (
        <div className="flex h-[calc(100dvh-6rem)] md:h-[calc(100dvh-9rem)] bg-background border border-border rounded-2xl overflow-hidden shadow-xl">
            {/* Sidebar */}
            <div className={cn(
                "w-full border-r border-border flex flex-col bg-muted/5",
                activeView === 'chat' ? "hidden" : "flex"
            )}>
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{title}</h2>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal size={20} />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            type="text"
                            placeholder="Find a conversation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 h-11 bg-background/50 border-border rounded-xl text-sm focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-border/50 scrollbar-hide">
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => { setActiveChatId(chat.id); setActiveView('chat'); }}
                                className={cn(
                                    "w-full p-4 md:p-5 text-left transition-all flex items-center gap-4 hover:bg-muted/50 border-l-4 border-transparent",
                                    activeChatId === chat.id ? 'bg-primary/5 border-primary shadow-[inset_0_0_20px_rgba(var(--primary),0.02)]' : ''
                                )}
                            >
                                <div className="relative shrink-0">
                                    <Avatar className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-border shadow-sm">
                                        <AvatarImage src={chat.avatar} className="object-cover" />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                            {chat.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {chat.unread && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-background rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm md:text-base truncate text-foreground">{chat.name}</h4>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{chat.time}</span>
                                    </div>
                                    {chat.eventName && (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1 truncate">
                                            {chat.eventName}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground line-clamp-1 font-medium">
                                        {chat.lastMsg}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search size={24} className="opacity-20" />
                            </div>
                            <p className="text-sm font-medium">No conversations found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-background",
                activeView === 'list' ? "hidden" : "flex"
            )}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between bg-card shrink-0">
                            <div className="flex items-center gap-4 min-w-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-10 w-10 shrink-0 text-muted-foreground"
                                    onClick={() => setActiveView('list')}
                                >
                                    <ArrowLeft size={20} />
                                </Button>
                                <div className="relative">
                                    <Avatar className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-border shadow-sm">
                                        <AvatarImage src={activeChat.avatar} className="object-cover" />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {activeChat.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-foreground text-sm md:text-lg truncate">{activeChat.name}</h3>
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        Online • {activeChat.eventName || 'Member'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 md:gap-3">
                                <Button variant="ghost" size="icon" className="hidden sm:inline-flex rounded-full text-muted-foreground hover:bg-muted">
                                    <Phone size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" className="hidden sm:inline-flex rounded-full text-muted-foreground hover:bg-muted">
                                    <Video size={18} />
                                </Button>
                                <div className="hidden sm:block h-8 w-px bg-border mx-1" />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-xl border-border bg-background shadow-sm h-9 px-4">
                                            {activeChat.status}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px] shadow-2xl border-border">
                                        {(userType === 'host'
                                            ? ['Requested', 'Sent', 'Quoted', 'Negotiating', 'Booked']
                                            : ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Paid']
                                        ).map((status) => (
                                            <DropdownMenuItem
                                                key={status}
                                                onClick={() => updateStatus(activeChat.id, status.toLowerCase())}
                                                className="rounded-xl font-bold text-xs py-2.5"
                                            >
                                                Mark as {status}
                                            </DropdownMenuItem>
                                        ))}
                                        <div className="h-px bg-border my-1" />
                                        <DropdownMenuItem
                                            onClick={() => updateStatus(activeChat.id, 'declined')}
                                            className="text-red-600 focus:text-red-600 font-bold text-xs rounded-xl py-2.5"
                                        >
                                            Decline / Cancel
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-muted/5 scroll-smooth">
                            {activeChat.messages.map((msg) => (
                                <div key={msg.id} className={cn(
                                    "flex gap-3 md:gap-4 max-w-[90%] sm:max-w-[80%] lg:max-w-[70%]",
                                    msg.isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}>
                                    {!msg.isMe && (
                                        <Avatar className="w-8 h-8 md:w-10 md:h-10 rounded-xl shrink-0 border border-border shadow-sm">
                                            <AvatarImage src={activeChat.avatar} className="object-cover" />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                {activeChat.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn(
                                        "flex flex-col gap-1.5",
                                        msg.isMe ? "items-end" : "items-start"
                                    )}>
                                        <div className={cn(
                                            "px-4 py-3 md:px-5 md:py-3.5 rounded-2xl text-sm md:text-base font-medium shadow-sm leading-relaxed",
                                            msg.isMe
                                                ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/10"
                                                : "bg-card text-foreground border border-border rounded-tl-none"
                                        )}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-1">
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 md:p-6 bg-background border-t border-border shrink-0">
                            <div className="flex items-end gap-3 max-w-5xl mx-auto">
                                <div className="flex-1 relative">
                                    <Textarea
                                        placeholder="Type your message here..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        className="min-h-[50px] max-h-[180px] w-full px-4 md:px-6 py-3.5 rounded-[2rem] border-transparent bg-muted/10 focus:bg-background focus:ring-primary/20 transition-all font-medium text-sm md:text-base resize-none pb-2"
                                    />
                                </div>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim()}
                                    size="icon"
                                    className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-[1.5rem] shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
                                >
                                    <Send size={24} />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-muted-foreground/30">
                        <div className="w-24 h-24 bg-muted rounded-[3rem] flex items-center justify-center mb-6 border border-border/50 shadow-inner">
                            <Send size={40} className="rotate-12 translate-x-1 -translate-y-1" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Pick up where you left off</h3>
                        <p className="mt-2 text-sm max-w-xs font-medium text-muted-foreground/60">
                            Select a contact from the list to view your conversation history and send new messages.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
