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
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

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
        <div className="flex h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-9rem)] bg-background border border-border rounded-lg overflow-hidden shadow-sm">
            {/* Sidebar */}
            <div className={cn(
                "w-full md:w-72 lg:w-80 border-r border-border flex flex-col bg-muted/20",
                mobileView === 'chat' ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal size={20} />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 bg-background text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-border">
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => { setActiveChatId(chat.id); setMobileView('chat'); }}
                                className={cn(
                                    "w-full p-4 text-left transition-colors flex items-center gap-3 hover:bg-muted/50",
                                    activeChatId === chat.id ? 'bg-muted/80' : ''
                                )}
                            >
                                <Avatar className="w-10 h-10 rounded-full shrink-0">
                                    <AvatarImage src={chat.avatar} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                        {chat.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate text-xs text-foreground">{chat.name}</h4>
                                    <span className="block mt-0.5 text-[10px] text-muted-foreground whitespace-nowrap">{chat.time}</span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No conversations found
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex-col bg-background",
                mobileView === 'list' ? "hidden md:flex" : "flex"
            )}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                            <div className="flex items-center gap-3 min-w-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => setMobileView('list')}
                                >
                                    <ArrowLeft size={18} />
                                </Button>
                                <Avatar className="w-10 h-10 rounded-full shrink-0">
                                    <AvatarImage src={activeChat.avatar} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                        {activeChat.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <h3 className="font-medium text-foreground text-sm md:text-base truncate">{activeChat.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        <p className="text-xs text-muted-foreground">Online</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground">
                                    <Phone size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground">
                                    <Video size={18} />
                                </Button>
                                <div className="hidden sm:block h-6 w-px bg-border mx-2" />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2 text-xs">
                                            {activeChat.status.charAt(0).toUpperCase() + activeChat.status.slice(1)}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {(userType === 'host'
                                            ? ['Requested', 'Sent', 'Quoted', 'Negotiating', 'Booked']
                                            : ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Paid']
                                        ).map((status) => (
                                            <DropdownMenuItem
                                                key={status}
                                                onClick={() => updateStatus(activeChat.id, status.toLowerCase())}
                                            >
                                                Mark as {status}
                                            </DropdownMenuItem>
                                        ))}
                                        <div className="h-px bg-border my-1" />
                                        <DropdownMenuItem
                                            onClick={() => updateStatus(activeChat.id, 'declined')}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            Decline / Cancel
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeChat.messages.map((msg) => (
                                <div key={msg.id} className={cn(
                                    "flex gap-3 max-w-[85%] sm:max-w-[75%]",
                                    msg.isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}>
                                    {!msg.isMe && (
                                        <Avatar className="w-8 h-8 rounded-full shrink-0">
                                            <AvatarImage src={activeChat.avatar} className="object-cover" />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                {activeChat.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <div className={cn(
                                            "p-3 rounded-lg text-sm",
                                            msg.isMe
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted text-foreground rounded-tl-none"
                                        )}>
                                            {msg.text}
                                        </div>
                                        <span className={cn(
                                            "text-xs text-muted-foreground",
                                            msg.isMe ? "text-right" : "text-left"
                                        )}>
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-background border-t border-border">
                            <div className="flex items-end gap-2">
                                <Textarea
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    className="min-h-[40px] max-h-[160px] resize-none pb-2 text-sm"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim()}
                                    size="icon"
                                    className="h-10 w-10 shrink-0"
                                >
                                    <Send size={18} />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Send size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Your Messages</h3>
                        <p className="mt-1 text-sm">
                            Select a conversation from the sidebar to start messaging.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
