"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Send, ChevronDown, ArrowLeft, SquarePen, CalendarDays, Briefcase } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardFilter } from '../DashboardFilter';
import { cn, formatCurrency } from "@/lib/utils";
import { getVendors, listenToMessages, saveChatMessage } from '@/lib/firestore-service';
import { useAuth } from '@/components/providers/auth-provider';
import { useSavedVendors } from '@/hooks/use-saved-vendors';
import { SharedEvent, Vendor } from '@/lib/types';

interface EventMessage {
    id: string;
    senderId?: string;
    text: string;
    isMe: boolean;
    attachment?: {
        type: 'event';
        eventId: string;
        eventName: string;
        eventDate?: string;
        eventLocation?: string;
        service?: string;
    };
    timestamp?: any;
    type?: 'text' | 'proposal_card' | 'proposal_auto_msg';
    proposalData?: {
        quotedPrice: string;
        deliveryTimeline: string;
        messageText: string;
        vendorCategory?: string;
    };
}

interface EventChat {
    id: string;
    vendorId: string;
    vendorSlug: string;
    name: string;
    category: string;
    lastMsg: string;
    time: string;
    unread: boolean;
    avatarUrl?: string;
    avatarFallback: string;
    status: string;
    location: string;
    price: string;
    messages: EventMessage[];
}

interface ComposeContact {
    id: string;
    name: string;
    slug: string;
    category: string;
    location: string;
    price: number | null;
    logo?: string;
}

interface InboxTabProps {
    event: SharedEvent;
}

const formatPrice = (value: number | null | undefined): string => {
    if (typeof value !== "number") return "TBD";
    return formatCurrency(value);
};

export default function InboxTab({ event }: InboxTabProps) {
    const { user } = useAuth();
    const { savedVendorIds } = useSavedVendors(user?.uid);

    const [allVendors, setAllVendors] = useState<Vendor[]>([]);
    const [chats, setChats] = useState<EventChat[]>([]);
    const [activeChatId, setActiveChatId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState<'list' | 'chat'>('list');
    const [messageInput, setMessageInput] = useState('');
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState('');
    const [composerMessage, setComposerMessage] = useState('');

    useEffect(() => {
        let cancelled = false;
        async function loadVendors() {
            try {
                const vendors = await getVendors();
                if (!cancelled) {
                    setAllVendors(vendors);
                }
            } catch (error) {
                console.error("Failed to load vendors for event inbox:", error);
                if (!cancelled) {
                    setAllVendors([]);
                }
            }
        }
        void loadVendors();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const vendorsById = new Map(allVendors.map((vendor) => [vendor.id, vendor]));

        setChats((prev) => {
            const nextChats = event.bookedVendors
                .map((booking, index) => {
                    const vendor = vendorsById.get(booking.vendorId);
                    if (!vendor) return null;

                    const serviceFallback = booking.service || "Vendor service";
                    const initialText = `Hi ${vendor.name}, following up on ${serviceFallback} for ${event.eventName}.`;
                    const chatId = `${event.id}:${vendor.id}`;

                    const existing = prev.find((chat) => chat.id === chatId);
                    if (existing) {
                        return {
                            ...existing,
                            name: vendor.name,
                            vendorSlug: vendor.slug || vendor.id,
                            category: vendor.categories?.[0] || serviceFallback,
                            location: vendor.location,
                            price: booking.amount || formatPrice(vendor.price),
                        };
                    }

                    return {
                        id: chatId,
                        vendorId: vendor.id,
                        vendorSlug: vendor.slug || vendor.id,
                        name: vendor.name,
                        category: vendor.categories?.[0] || serviceFallback,
                        lastMsg: index === 0 ? 'The quote is ready for your review.' : `Update on ${serviceFallback}.`,
                        time: index === 0 ? '10:30 AM' : 'Recently',
                        unread: index === 0,
                        avatarUrl: vendor.vendor?.logo || vendor.vendor?.avatar || vendor.image || undefined,
                        avatarFallback: vendor.name.charAt(0).toUpperCase(),
                        status: booking.status.toLowerCase(),
                        location: vendor.location,
                        price: booking.amount || formatPrice(vendor.price),
                        messages: [
                            { id: `${chatId}-1`, text: `Hello! ${serviceFallback} is available for your date.`, isMe: false },
                            { id: `${chatId}-2`, text: initialText, isMe: true },
                        ],
                    } satisfies EventChat;
                })
                .filter(Boolean) as EventChat[];
            const bookedChatIds = new Set(nextChats.map((chat) => chat.id));
            const retainedDirectChats = prev.filter((chat) => !bookedChatIds.has(chat.id));
            return [...retainedDirectChats, ...nextChats];
        });
    }, [allVendors, event]);

    useEffect(() => {
        if (!chats.length) {
            setActiveChatId('');
            return;
        }
        if (!activeChatId || !chats.some((chat) => chat.id === activeChatId)) {
            setActiveChatId(chats[0].id);
        }
    }, [activeChatId, chats]);

    // ── Real-time Message Listener ───────────────────────────────
    useEffect(() => {
        if (!activeChatId) return;

        const unsubscribe = listenToMessages(activeChatId, (newMessages) => {
            if (newMessages.length === 0) return;

            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === activeChatId
                        ? {
                            ...chat,
                            messages: newMessages.map(m => ({
                                id: m.id,
                                senderId: m.senderId,
                                senderName: m.senderName,
                                senderAvatar: m.senderAvatar,
                                text: m.text,
                                type: m.type,
                                proposalData: m.proposalData,
                                isMe: m.isMe ?? (m.senderId === user?.uid),
                                timestamp: m.timestamp,
                                attachment: m.attachment
                            })),
                            lastMsg: newMessages[newMessages.length - 1].text,
                            time: "Just now" // We could format the timestamp here
                        }
                        : chat
                )
            );
        });

        return () => unsubscribe();
    }, [activeChatId, user]);

    const composeContacts: ComposeContact[] = useMemo(() => {
        return allVendors
            .filter((vendor) => savedVendorIds.has(vendor.id))
            .map((vendor) => ({
                id: vendor.id,
                name: vendor.name,
                slug: vendor.slug || vendor.id,
                category: vendor.categories?.[0] || "General",
                location: vendor.location,
                price: vendor.price ?? null,
                logo: vendor.vendor?.logo || vendor.vendor?.avatar || vendor.image || undefined,
            }));
    }, [allVendors, savedVendorIds]);

    const activeChat = chats.find((chat) => chat.id === activeChatId);

    const updateStatus = (chatId: string, newStatus: string) => {
        setChats((prev) => prev.map((chat) =>
            chat.id === chatId ? { ...chat, status: newStatus } : chat
        ));
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeChat) return;
        const nextMessageText = messageInput.trim();
        setMessageInput('');

        try {
            await saveChatMessage(activeChat.id, {
                senderId: user?.uid,
                senderName: user?.displayName || 'Host',
                text: nextMessageText,
                isMe: true
            });
        } catch (error) {
            console.error("Failed to send message:", error);
            // Revert message input on error
            setMessageInput(nextMessageText);
        }
    };

    const handleShareEvent = () => {
        if (!activeChat) return;
        const defaultMessage = `Hi ${activeChat.name}, I was wondering if you might be available for my event? Please check out the details below.`;
        const nextMessage: EventMessage = {
            id: `${activeChat.id}-${Date.now()}`,
            text: defaultMessage,
            isMe: true,
            attachment: {
                type: 'event',
                eventId: event.id,
                eventName: event.eventName,
                eventDate: event.date,
                eventLocation: event.location,
                service: activeChat.category,
            }
        };

        setChats((prev) =>
            prev.map((chat) =>
                chat.id === activeChat.id
                    ? {
                        ...chat,
                        lastMsg: "Shared an event",
                        time: "Just now",
                        messages: [...chat.messages, nextMessage],
                    }
                    : chat
            )
        );
    };

    const handleCompose = async () => {
        const contactId = selectedContactId.trim();
        if (!contactId || !composerMessage.trim()) return;

        const nextMessage = composerMessage.trim();
        const contact = composeContacts.find((item) => item.id === contactId);
        const chatId = `${event.id}:${contactId}`;

        const contextAttachment: EventMessage["attachment"] = {
            type: 'event',
            eventId: event.id,
            eventName: event.eventName,
            eventDate: event.date,
            eventLocation: event.location,
            service: contact?.category || "General Inquiry",
        };

        try {
            await saveChatMessage(chatId, {
                senderId: user?.uid,
                senderName: user?.displayName || 'Host',
                text: nextMessage,
                isMe: true,
                attachment: contextAttachment
            });

            setActiveChatId(chatId);
            setActiveView('chat');
            setIsComposerOpen(false);
            setSelectedContactId('');
            setComposerMessage('');
        } catch (error) {
            console.error("Failed to compose message:", error);
        }
    };

    const filteredChats = chats.filter((chat) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            chat.name.toLowerCase().includes(query) ||
            chat.category.toLowerCase().includes(query) ||
            chat.lastMsg.toLowerCase().includes(query) ||
            chat.location.toLowerCase().includes(query)
        );
    });

    const activeVendorPath = activeChat ? `/dashboard/hosts/vendor/${activeChat.vendorSlug}` : '';

    return (
        <div className="flex flex-col gap-3 h-[70vh] min-h-[500px] mb-6">
            <div className={cn("flex items-center gap-2", activeView === 'chat' && "hidden")}>
                <div className="min-w-0 flex-1">
                    <DashboardFilter
                        placeholder="Search chats..."
                        onSearchChange={setSearchQuery}
                    />
                </div>
                <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-xl shrink-0"
                            aria-label="Compose message"
                        >
                            <SquarePen size={18} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>New Message</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Select Saved Vendor</Label>
                                <Select value={selectedContactId} onValueChange={setSelectedContactId}>
                                    <SelectTrigger className="w-full rounded-xl h-11">
                                        <SelectValue placeholder="Choose a saved vendor" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {composeContacts.map((contact) => (
                                            <SelectItem key={contact.id} value={contact.id} className="rounded-lg">
                                                {contact.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {composeContacts.length === 0 && (
                                    <p className="text-xs text-muted-foreground">No saved vendors found.</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                    placeholder="Type your message..."
                                    value={composerMessage}
                                    onChange={(e) => setComposerMessage(e.target.value)}
                                    className="min-h-[120px] resize-none rounded-xl"
                                />
                            </div>
                            <Button
                                className="w-full h-11 rounded-xl font-bold"
                                onClick={handleCompose}
                                disabled={!selectedContactId || !composerMessage.trim()}
                            >
                                Send Message
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex-1 flex flex-col bg-background border border-border rounded-xl overflow-hidden shadow-sm">
                <div className={cn(
                    "w-full md:w-64 lg:w-72 border-r border-border flex flex-col min-h-0 bg-muted/5 shrink-0",
                    activeView === 'chat' ? "hidden md:flex" : "flex"
                )}>
                    <div className="flex-1 overflow-y-auto divide-y divide-border">
                        {filteredChats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => { setActiveChatId(chat.id); setActiveView('chat'); }}
                                className={cn(
                                    "w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center gap-3",
                                    activeChatId === chat.id ? 'bg-muted' : ''
                                )}
                            >
                                <Avatar className="w-10 h-10 rounded-lg border border-border shrink-0">
                                    <AvatarImage src={chat.avatarUrl} alt={chat.name} className="object-cover" />
                                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                                        {chat.avatarFallback}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-sm font-medium text-foreground truncate">{chat.name}</h4>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium shrink-0">
                                            {chat.time}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1.5 min-w-0">
                                        <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-foreground/80">
                                            {chat.category}
                                        </span>
                                        <span className="inline-flex items-center rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80 truncate">
                                            {chat.price}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {filteredChats.length === 0 && (
                            <div className="p-8 text-center text-sm text-muted-foreground">No chats found.</div>
                        )}
                    </div>
                </div>

                <div className={cn(
                    "flex-1 flex flex-col bg-background min-h-0",
                    activeView === 'list' ? "hidden md:flex" : "flex"
                )}>
                    {activeChat ? (
                        <>
                            <div className="p-4 bg-muted/5 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground md:hidden"
                                        onClick={() => setActiveView('list')}
                                    >
                                        <ArrowLeft size={18} />
                                    </Button>
                                    <Link
                                        href={activeVendorPath}
                                        className="flex items-center gap-2 rounded-md px-1 py-0.5 -mx-1"
                                    >
                                        <Avatar className="w-8 h-8 rounded-lg border border-border shrink-0">
                                            <AvatarImage src={activeChat.avatarUrl} alt={activeChat.name} className="object-cover" />
                                            <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                                                {activeChat.avatarFallback}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-medium text-foreground truncate">{activeChat.name}</h4>
                                            <span className="mt-0.5 inline-flex max-w-full items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-foreground/80 truncate">
                                                {activeChat.category}
                                            </span>
                                        </div>
                                    </Link>
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

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                                {activeChat.messages.map((message) => {
                                    const isSenderMe = user?.uid ? message.senderId === user.uid : message.isMe;

                                    return (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex items-start gap-3 max-w-[85%] sm:max-w-[75%]",
                                                isSenderMe ? "justify-end ml-auto flex-row-reverse" : "mr-auto"
                                            )}
                                        >
                                            {!isSenderMe && (
                                                <Avatar className="w-8 h-8 rounded-lg border border-border shrink-0">
                                                    <AvatarImage src={activeChat.avatarUrl} alt={activeChat.name} className="object-cover" />
                                                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                                                        {activeChat.avatarFallback}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn(
                                                "flex flex-col gap-1.5",
                                                isSenderMe ? "items-end" : "items-start"
                                            )}>
                                                {message.type === 'proposal_card' && message.proposalData ? (
                                                    <div className="w-full max-w-[360px] bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                                                        {/* Card Header with Greeting */}
                                                        <div className="bg-primary/5 p-5 border-b border-border">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <Avatar className="w-10 h-10 rounded-xl border-2 border-background shadow-sm">
                                                                    <AvatarImage src={activeChat.avatarUrl} alt={activeChat.name} className="object-cover" />
                                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                                        {activeChat.avatarFallback}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <h4 className="font-bold text-sm text-foreground">Hi there! 👋</h4>
                                                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                                        {message.proposalData.vendorCategory || activeChat.category} Proposal
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs font-medium text-foreground/80 leading-relaxed">
                                                                I'm excited to work on this event. Here's my quote:
                                                            </p>
                                                        </div>

                                                        {/* Key Details */}
                                                        <div className="p-5 grid grid-cols-2 gap-4 bg-background">
                                                            <div className="space-y-0.5">
                                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quoted Price</p>
                                                                <p className="text-xl font-black text-primary tracking-tight">{message.proposalData.quotedPrice}</p>
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Timeline</p>
                                                                <p className="text-lg font-bold text-foreground">{message.proposalData.deliveryTimeline}</p>
                                                            </div>
                                                        </div>

                                                        {/* Personal Message */}
                                                        {message.proposalData.messageText && (
                                                            <div className="mx-5 p-3 rounded-xl bg-muted/30 border border-border/50 mb-5">
                                                                <p className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/60 mb-1">Message</p>
                                                                <p className="text-xs font-medium leading-relaxed italic text-foreground/80">
                                                                    "{message.proposalData.messageText}"
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Footer Action */}
                                                        <div className="px-5 py-3 bg-muted/5 border-t border-border flex justify-between items-center">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                                                Pending Review
                                                            </span>
                                                            <div className="flex gap-1.5 items-center">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Active</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={cn(
                                                        "px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed font-medium whitespace-pre-wrap",
                                                        isSenderMe
                                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                                            : "bg-card border border-border rounded-tl-none text-foreground"
                                                    )}>
                                                        {message.text}
                                                        {message.attachment?.type === 'event' && (
                                                            <div className="mt-3 p-3 rounded-xl bg-background/10 shadow-sm flex items-center justify-between gap-4 border border-background/20">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <div className="w-10 h-10 rounded-lg bg-background/20 flex items-center justify-center shrink-0">
                                                                        <CalendarDays size={20} />
                                                                    </div>
                                                                    <div className="min-w-0 text-primary-foreground">
                                                                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Event Invitation</p>
                                                                        <p className="text-sm font-semibold truncate">{message.attachment.eventName}</p>
                                                                        <p className="text-xs mt-1 truncate opacity-90">
                                                                            Regarding: {message.attachment.eventName}
                                                                            {message.attachment.eventDate ? ` • ${message.attachment.eventDate}` : ""}
                                                                            {message.attachment.service ? ` • ${message.attachment.service}` : ""}
                                                                        </p>
                                                                        {message.attachment.eventLocation && (
                                                                            <p className="text-xs truncate opacity-90">{message.attachment.eventLocation}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <Link
                                                                    href={`/dashboard/hosts/events/${message.attachment.eventId}`}
                                                                    className="shrink-0 text-xs font-bold bg-background text-primary px-4 py-2 rounded-lg hover:bg-background/90 transition-colors"
                                                                >
                                                                    View Event
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-4 bg-background border-t border-border">
                                <div className="flex gap-2">
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
                                        className="flex-1 px-3 py-2 rounded-xl border-border bg-muted/10 focus:bg-background resize-none min-h-[44px] max-h-[120px] font-medium text-sm transition-colors"
                                    />
                                    <Button
                                        title="Share Current Event"
                                        onClick={handleShareEvent}
                                        variant="outline"
                                        size="icon"
                                        className="h-11 w-11 shrink-0 rounded-xl shadow-sm transition-all text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
                                    >
                                        <CalendarDays size={20} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="h-11 w-11 rounded-xl shrink-0 shadow-lg shadow-primary/20"
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim()}
                                    >
                                        <Send size={20} />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
                            No vendor conversations yet for this event. Use compose to start one.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
