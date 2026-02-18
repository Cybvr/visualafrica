"use client";

import React, { useState } from 'react';
import { Search, Send, MapPin, ChevronDown, Calendar, MoreHorizontal, User, Phone, Video } from 'lucide-react';
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
        <div className="flex h-[calc(100vh-140px)] bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
            {/* Sidebar */}
            <div className="w-full md:w-96 border-r border-border flex flex-col bg-background">
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif font-black text-foreground">{title}</h2>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal size={20} />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-6 bg-secondary border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-border/50 scrollbar-hide">
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChatId(chat.id)}
                                className={`w-full p-6 text-left transition-all flex items-start gap-4 hover:bg-secondary/50 ${activeChatId === chat.id ? 'bg-secondary' : ''}`}
                            >
                                <Avatar className="w-14 h-14 rounded-2xl shrink-0">
                                    <AvatarImage src={chat.avatar} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                        {chat.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-foreground truncate">{chat.name}</h4>
                                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{chat.time}</span>
                                    </div>
                                    <p className={`text-sm ${chat.unread ? 'text-foreground font-bold' : 'text-muted-foreground'} truncate font-medium mb-2`}>
                                        {chat.lastMsg}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {chat.eventName && (
                                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider truncate max-w-[120px]">
                                                    {chat.eventName}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${chat.status === 'booked' || chat.status === 'paid' || chat.status === 'confirmed'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-primary/5 text-primary border-primary/10'
                                            }`}>
                                            {chat.status}
                                        </span>
                                    </div>
                                    {chat.unread && <div className="mt-2 w-2 h-2 bg-primary rounded-full animate-pulse" />}
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-12 text-center text-muted-foreground font-medium">
                            No conversations found
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-secondary/5">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 bg-background border-b border-border flex items-center justify-between px-8">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 rounded-xl shrink-0 ring-2 ring-background">
                                    <AvatarImage src={activeChat.avatar} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                        {activeChat.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-foreground text-lg">{activeChat.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        <p className="text-xs text-muted-foreground font-medium italic">Online</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                                    <Phone size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                                    <Video size={18} />
                                </Button>
                                <div className="h-6 w-px bg-border mx-1" />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2 rounded-xl font-bold bg-background">
                                            {activeChat.status.toUpperCase()}
                                            <ChevronDown className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[200px] shadow-xl border-border/50">
                                        {(userType === 'host'
                                            ? ['Requested', 'Sent', 'Quoted', 'Negotiating', 'Booked']
                                            : ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Paid']
                                        ).map((status) => (
                                            <DropdownMenuItem
                                                key={status}
                                                onClick={() => updateStatus(activeChat.id, status.toLowerCase())}
                                                className="rounded-xl font-bold py-2.5"
                                            >
                                                Mark as {status}
                                            </DropdownMenuItem>
                                        ))}
                                        <div className="h-px bg-border my-1" />
                                        <DropdownMenuItem
                                            onClick={() => updateStatus(activeChat.id, 'declined')}
                                            className="text-red-600 rounded-xl font-bold py-2.5 focus:bg-red-50 focus:text-red-600"
                                        >
                                            Decline / Cancel
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide">
                            {activeChat.messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                                    {!msg.isMe && (
                                        <Avatar className="w-8 h-8 rounded-lg shrink-0">
                                            <AvatarImage src={activeChat.avatar} className="object-cover" />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                                {activeChat.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="flex flex-col gap-1.5 max-w-[60%]">
                                        <div className={`p-5 rounded-[1.5rem] shadow-sm text-sm leading-relaxed ${msg.isMe
                                                ? 'bg-primary text-primary-foreground font-bold rounded-br-none'
                                                : 'bg-background text-foreground font-medium border border-border rounded-bl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest text-muted-foreground ${msg.isMe ? 'text-right' : 'text-left'}`}>
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-8 bg-background border-t border-border">
                            <div className="flex gap-4 items-center bg-secondary rounded-[2rem] px-6 py-2">
                                <Textarea
                                    placeholder="Type your response..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    className="flex-1 bg-transparent border-none focus-visible:ring-0 px-0 py-4 resize-none min-h-[56px] font-medium"
                                />
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={handleSendMessage}
                                        className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all p-0"
                                    >
                                        <Send size={20} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                        <div className="w-24 h-24 bg-background border border-border rounded-[2.5rem] flex items-center justify-center mb-6">
                            <Send size={40} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground">Select a conversation</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs font-medium">
                            Choose a conversation from the sidebar to start messaging.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
