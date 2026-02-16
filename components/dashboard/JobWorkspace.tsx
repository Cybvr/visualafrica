"use client";

import React, { ReactNode } from 'react';
import { ChevronLeft, Zap, Star, MapPin, FileText, ShieldCheck, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface JobWorkspaceProps {
    role: 'host' | 'vendor';
    onBack: () => void;
    title: string;
    status: string;
    statusBadge: ReactNode;
    contextCard: ReactNode;
    actionColumn: ReactNode;
    tabs: {
        id: string;
        label: string;
        content: ReactNode;
    }[];
}

export default function JobWorkspace({
    onBack,
    title,
    statusBadge,
    contextCard,
    actionColumn,
    tabs
}: JobWorkspaceProps) {
    const [activeTab, setActiveTab] = React.useState(tabs[0]?.id);

    return (
        <div className="max-w-6xl mx-auto space-y-6 py-6 pb-24 px-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <div className="p-2 bg-card rounded-full border border-border group-hover:bg-secondary transition-colors">
                            <ChevronLeft size={16} />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                    </button>
                    <div className="h-4 w-px bg-border hidden md:block" />
                    <h1 className="text-lg font-black uppercase tracking-widest text-foreground hidden md:block">
                        {activeTab === 'contract' ? 'Contract' : title}
                    </h1>
                </div>

                {activeTab === 'contract' && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl font-bold h-9">
                            Share
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl font-bold h-9">
                            Print
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Context */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Primary Context Card (Vendor Profile or Event Brief) */}
                    {contextCard}

                    {/* Tabs Section */}
                    <div className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border rounded-none mb-6">
                                {tabs.map(tab => (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-6 py-3 text-xs font-black uppercase tracking-widest"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {tabs.map(tab => (
                                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                                    {tab.content}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>

                {/* Right Column - Actions & Summary */}
                <div className="space-y-6">
                    {actionColumn}
                </div>
            </div>
        </div>
    );
}

// Sub-components for consistency
export function WorkspaceCard({ children, className = "" }: { children: ReactNode, className?: string }) {
    return (
        <div className={`bg-card rounded-[2.5rem] border border-border p-8 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function StatusIndicator({ status, label }: { status: string, label: string }) {
    const isApproved = status === 'Approved' || status === 'Confirmed';
    const isRejected = status === 'Rejected' || status === 'Declined';

    return (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-secondary border border-border">
            <div className={`w-2 h-2 rounded-full ${isApproved ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                isRejected ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                    'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                }`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{label}</span>
        </div>
    );
}
