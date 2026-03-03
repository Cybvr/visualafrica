"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User, Star, MapPin,
    CheckCircle2, Zap, Globe,
    Download, ShieldCheck, FileText, Send,
    XCircle, CreditCard, RefreshCcw, Loader2, Briefcase
} from 'lucide-react';
import { Vendor, SharedEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import JobWorkspace, { WorkspaceCard, StatusIndicator } from '@/components/dashboard/JobWorkspace';
import JobBrief from '@/components/dashboard/JobBrief';
import { formatCurrency, cn } from '@/lib/utils';
import { listenToMessages, saveChatMessage, updateChatMetadata } from '@/lib/firestore-service';
import { useAuth } from '@/components/providers/auth-provider';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';

interface HostEventVendorDetailClientProps {
    vendor: Vendor;
    event: SharedEvent;
}

const db = getFirestore();

export default function HostEventVendorDetailClient({ vendor, event }: HostEventVendorDetailClientProps) {
    const { user } = useAuth();
    const vendorId = vendor.id;
    const eventId = event.id;
    const chatId = `${eventId}:${vendorId}`;

    const vendorBooking = event.bookedVendors?.find(bv => bv.vendorId === vendorId);
    const vendorLead = event.leads?.find(l => l.vendorId === vendorId);

    const initialStatus = vendorBooking?.status || vendorLead?.status || 'Pending';
    const initialPrice = vendorBooking?.amount || vendorLead?.message?.match(/Quoted price:?\s*([^\n]+)/i)?.[1] || 'By Request';

    const [currentStatus, setCurrentStatus] = useState(initialStatus);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Real-time messages
    useEffect(() => {
        const unsub = listenToMessages(chatId, (newMessages) => {
            setMessages(newMessages.map(m => ({
                id: m.id,
                senderId: m.senderId,
                senderName: m.senderName,
                senderAvatar: m.senderAvatar,
                text: m.text,
                type: m.type,
                proposalData: m.proposalData,
                timestamp: m.timestamp?.toDate
                    ? m.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : (m.timestamp || 'Just now'),
                isMe: m.senderId === user?.uid
            })));
        });
        return () => unsub();
    }, [chatId, user?.uid]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !user) return;
        setIsSending(true);
        try {
            await saveChatMessage(chatId, {
                senderId: user.uid,
                senderName: 'Host',
                text: messageInput.trim(),
                isMe: true,
            });
            setMessageInput('');
        } catch (e) {
            console.error('Send error:', e);
        } finally {
            setIsSending(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setIsUpdatingStatus(true);
        try {
            // Update event's bookedVendors array
            const eventRef = doc(db, 'events', eventId);
            const updatedLeads = (event.leads || []).map((l: any) =>
                l.vendorId === vendorId ? { ...l, status: newStatus } : l
            );
            const updatedBookings = (event.bookedVendors || []).map((b: any) =>
                b.vendorId === vendorId ? { ...b, status: newStatus } : b
            );
            await updateDoc(eventRef, { leads: updatedLeads, bookedVendors: updatedBookings });

            // Update chat metadata
            await updateChatMetadata(chatId, { status: newStatus });

            setCurrentStatus(newStatus);
        } catch (e) {
            console.error('Status update error:', e);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Attempt to extract proposal data from messages
    const proposalMessage = messages.find(m => m.type === 'proposal_card' && m.proposalData);
    const displayPrice = proposalMessage?.proposalData?.quotedPrice || initialPrice || 'By Request';

    const contextCard = (
        <WorkspaceCard className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="space-y-4 shrink-0">
                    <div className="w-32 h-32 rounded-3xl bg-secondary overflow-hidden border border-border shadow-inner">
                        <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2 px-1">
                        <Link
                            href={`/vendors/${vendor.id}`}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <User size={12} />
                            Visit Page
                        </Link>
                        <a
                            href="#"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Globe size={12} />
                            Visit Website
                        </a>
                    </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                    <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight">{vendor.name}</h2>
                        <div className="mt-2">
                            <StatusIndicator status={currentStatus} label={currentStatus} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground pt-1">
                        <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-foreground uppercase tracking-widest text-[10px]">
                            <Zap size={14} className="text-muted-foreground" />
                            {vendor.categories?.[0]}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Star size={16} className="fill-muted-foreground text-muted-foreground" />
                            <span className="text-foreground">{vendor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-muted-foreground" />
                            <span className="text-foreground">{vendor.location}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="mt-1 bg-secondary p-1.5 rounded-lg text-muted-foreground">
                            <FileText size={16} />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{vendor.description}</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="mt-1 bg-secondary p-1.5 rounded-lg text-muted-foreground">
                            <ShieldCheck size={16} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black text-foreground uppercase tracking-widest mb-2">Services Included</p>
                            <p className="text-sm text-muted-foreground font-medium">{vendor.whatsIncluded?.join(' • ')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </WorkspaceCard>
    );

    const actionColumn = (
        <div className="sticky top-6 space-y-4">
            {/* Price Card */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-1">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Quoted Price</p>
                <p className="text-3xl font-black text-foreground">{displayPrice}</p>
                <p className="text-xs text-muted-foreground">
                    {event.eventName} • {event.date || 'TBD'}
                </p>
            </div>

            {/* Status Actions */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Proposal Status</p>
                {currentStatus === 'Deciding' || currentStatus === 'Pending' || currentStatus === 'Contacted' ? (
                    <>
                        <Button
                            onClick={() => updateStatus('Approved')}
                            className="w-full h-11 rounded-xl font-bold gap-2"
                            disabled={isUpdatingStatus}
                        >
                            {isUpdatingStatus ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            Approve & Hire
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="h-10 rounded-xl text-sm font-bold" disabled={isUpdatingStatus}>
                                Request Changes
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => updateStatus('Rejected')}
                                className="h-10 rounded-xl text-sm font-bold text-red-600 border-red-200 hover:bg-red-50"
                                disabled={isUpdatingStatus}
                            >
                                Reject
                            </Button>
                        </div>
                    </>
                ) : currentStatus === 'Approved' || currentStatus === 'Paid' ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                            <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                            <span className="text-sm font-bold text-green-700">Vendor Hired</span>
                        </div>
                        {currentStatus !== 'Paid' && (
                            <Button className="w-full h-11 rounded-xl font-bold gap-2 bg-primary" disabled={isUpdatingStatus}>
                                <CreditCard size={18} />
                                Pay Vendor
                            </Button>
                        )}
                        {currentStatus === 'Paid' && (
                            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                <CreditCard size={16} className="text-blue-600 shrink-0" />
                                <span className="text-sm font-bold text-blue-700">Payment Sent</span>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateStatus('Deciding')}
                            className="w-full text-muted-foreground text-xs"
                            disabled={isUpdatingStatus}
                        >
                            <RefreshCcw size={12} className="mr-1" />
                            Reopen for Review
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <XCircle size={18} className="text-red-600 shrink-0" />
                            <span className="text-sm font-bold text-red-700">Proposal Rejected</span>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => updateStatus('Deciding')}
                            className="w-full h-10 rounded-xl text-sm font-bold"
                            disabled={isUpdatingStatus}
                        >
                            <RefreshCcw size={14} className="mr-2" />
                            Reconsider
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    const inboxTab = (
        <WorkspaceCard className="overflow-hidden p-0">
            {/* Header */}
            <div className="p-5 border-b border-border bg-muted/5 flex items-center gap-3">
                <Avatar className="w-10 h-10 rounded-xl border border-border">
                    <AvatarImage src={vendor.image} alt={vendor.name} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-xl">
                        {vendor.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-black text-foreground">{vendor.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{event.eventName}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-6 p-6 min-h-[400px] max-h-[520px] overflow-y-auto">
                {messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                            <Send size={28} className="text-muted-foreground/40 rotate-12" />
                        </div>
                        <p className="text-sm font-bold text-muted-foreground">No messages yet</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Start the conversation with {vendor.name}</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMine = msg.isMe;
                    if (msg.type === 'proposal_card' && msg.proposalData) {
                        return (
                            <div key={msg.id} className="flex flex-col gap-2 items-start">
                                <div className="w-full max-w-sm bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                                    <div className="bg-primary/5 p-4 border-b border-border flex items-center gap-3">
                                        <Avatar className="w-9 h-9 rounded-xl border border-background shadow-sm">
                                            <AvatarImage src={msg.senderAvatar || vendor.image} className="object-cover" />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {(msg.senderName || vendor.name).charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-sm text-foreground">Hi there! 👋</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                {msg.proposalData.vendorCategory || vendor.categories?.[0]} Proposal
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-4 bg-background">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quoted Price</p>
                                            <p className="text-xl font-black text-primary">{msg.proposalData.quotedPrice}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Timeline</p>
                                            <p className="text-lg font-bold text-foreground">{msg.proposalData.deliveryTimeline}</p>
                                        </div>
                                    </div>
                                    {msg.proposalData.messageText && (
                                        <div className="mx-4 mb-4 p-3 rounded-xl bg-muted/20 border border-border/50">
                                            <p className="text-xs text-muted-foreground/60 font-black uppercase tracking-widest mb-1">Message</p>
                                            <p className="text-xs font-medium italic text-foreground/80">"{msg.proposalData.messageText}"</p>
                                        </div>
                                    )}
                                    <div className="px-4 py-3 border-t border-border flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Active Proposal</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest px-1">{msg.timestamp}</span>
                            </div>
                        );
                    }
                    return (
                        <div key={msg.id} className={cn("flex gap-3", isMine ? "justify-end" : "justify-start")}>
                            {!isMine && (
                                <Avatar className="w-8 h-8 rounded-lg shrink-0 border border-border">
                                    <AvatarImage src={vendor.image} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                        {vendor.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn("space-y-1 max-w-[75%]", isMine ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed",
                                    isMine
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-card border border-border text-foreground rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-1",
                                    isMine && "text-right block"
                                )}>
                                    {msg.timestamp}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
                <div className="flex items-end gap-3">
                    <Textarea
                        placeholder={`Reply to ${vendor.name}...`}
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        className="flex-1 px-4 py-3 rounded-xl border-border bg-muted/10 focus:bg-background resize-none min-h-[44px] max-h-[120px] text-sm font-medium"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || isSending}
                        size="icon"
                        className="h-11 w-11 rounded-xl shrink-0"
                    >
                        {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </Button>
                </div>
            </div>
        </WorkspaceCard>
    );

    const contractTab = (
        <WorkspaceCard>
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-black tracking-tight">
                            Service Agreement #{(vendor.id + eventId).substring(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{event.eventName}</p>
                    </div>
                    <StatusIndicator status={currentStatus} label={currentStatus} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quoted Value</p>
                        <p className="text-xl font-black text-foreground">{displayPrice}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service</p>
                        <p className="font-bold">{vendor.categories?.[0]}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                        <div><StatusIndicator status={currentStatus} label={currentStatus} /></div>
                    </div>
                </div>

                {/* Status change section */}
                <div className="pt-4 border-t border-border/50 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                        {['Pending', 'Deciding', 'Approved', 'Rejected', 'Paid'].map(s => (
                            <Button
                                key={s}
                                variant={currentStatus === s ? 'default' : 'outline'}
                                size="sm"
                                className={cn(
                                    "h-9 rounded-xl text-xs font-bold transition-all",
                                    currentStatus === s && "shadow-sm",
                                    s === 'Rejected' && currentStatus !== s && "border-red-200 text-red-600 hover:bg-red-50",
                                    s === 'Approved' && currentStatus !== s && "border-green-200 text-green-700 hover:bg-green-50",
                                    s === 'Paid' && currentStatus !== s && "border-blue-200 text-blue-600 hover:bg-blue-50",
                                )}
                                onClick={() => updateStatus(s)}
                                disabled={isUpdatingStatus || currentStatus === s}
                            >
                                {isUpdatingStatus && currentStatus !== s ? <Loader2 size={12} className="mr-1 animate-spin" /> : null}
                                {s}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Payment section */}
                {(currentStatus === 'Approved') && (
                    <div className="pt-4 border-t border-border/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Payment</p>
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-bold text-foreground">Pay {vendor.name}</p>
                                <p className="text-sm text-muted-foreground">{displayPrice} for {vendor.categories?.[0]}</p>
                            </div>
                            <Button className="gap-2 font-bold rounded-xl shrink-0" onClick={() => updateStatus('Paid')}>
                                <CreditCard size={16} />
                                Pay Now
                            </Button>
                        </div>
                    </div>
                )}

                {/* Documents */}
                <div className="pt-4 border-t border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Documents</p>
                    <div className="space-y-2">
                        {['Quote_Summary.pdf', 'Terms_of_Service.pdf'].map((name, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl border border-transparent hover:border-border transition-all group">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{name}</span>
                                </div>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </WorkspaceCard>
    );

    const tabs = [
        { id: 'inbox', label: 'Inbox', content: inboxTab },
        { id: 'brief', label: 'Project Brief', content: <JobBrief event={event} service={vendorBooking?.service} /> },
        { id: 'contract', label: 'Contract', content: contractTab }
    ];

    return (
        <JobWorkspace
            role="host"
            backUrl={`/dashboard/hosts/events/${eventId}`}
            title={vendor.name}
            status={currentStatus}
            statusBadge={<StatusIndicator status={currentStatus} label={currentStatus} />}
            contextCard={contextCard}
            actionColumn={actionColumn}
            tabs={tabs}
        />
    );
}
