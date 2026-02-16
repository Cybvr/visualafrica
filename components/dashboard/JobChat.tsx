"use client";

import React from 'react';
import { Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkspaceCard } from './JobWorkspace';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    time: string;
    isOwn: boolean;
}

interface JobChatProps {
    participant: {
        name: string;
        image?: string;
    };
    messages: Message[];
}

export default function JobChat({ participant, messages }: JobChatProps) {
    return (
        <WorkspaceCard className="overflow-hidden p-0 dark:bg-card/50">
            <div className="p-6 border-b border-border bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary overflow-hidden shrink-0 border border-border">
                        {participant.image ? (
                            <img src={participant.image} alt={participant.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-accent text-accent">
                                <User size={20} />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-serif font-black text-xl leading-tight">{participant.name}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Now</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8 min-h-[450px] max-h-[600px] overflow-y-auto scrollbar-hide">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'justify-end' : ''}`}>
                        {!msg.isOwn && (
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border overflow-hidden">
                                {participant.image ? (
                                    <img src={participant.image} alt={participant.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={14} />
                                )}
                            </div>
                        )}
                        <div className={`space-y-1 max-w-[80%]`}>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.isOwn
                                    ? 'bg-primary text-foreground rounded-tr-none font-bold'
                                    : 'bg-secondary p-4 rounded-tl-none border border-border/50 font-medium'
                                }`}>
                                {msg.text}
                            </div>
                            <p className={`text-[10px] font-black uppercase tracking-widest text-muted-foreground ${msg.isOwn ? 'text-right' : ''}`}>
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 border-t border-border bg-secondary/5">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-6 py-4 bg-background border border-border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                    <Button className="w-14 h-14 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform shrink-0">
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </WorkspaceCard>
    );
}
