"use client";

import React from 'react';
import { ShoppingBag, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { DEMO_CHAT_HISTORY } from '@/lib/chat-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function StorePage() {
    const kits = DEMO_CHAT_HISTORY.filter((kit: any) => kit.published);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                    Store
                </h2>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">Pre-built event kits to buy, customize, and host as your own. Each comes loaded with certified vendors and a realistic budget.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                {kits.map(kit => (
                    <Link href={`/dashboard/hosts/chat/${kit.id}`} key={kit.id} className="block group h-full outline-none">
                        <Card className="flex h-full flex-col overflow-hidden border-border bg-card transition-all hover:shadow-xl hover:border-primary/50 cursor-pointer">
                            <div className="relative aspect-[4/3] overflow-hidden bg-secondary w-full">
                                {kit.image ? (
                                    <img
                                        src={kit.image}
                                        alt={kit.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                                        <ShoppingBag className="h-12 w-12 text-primary/40" />
                                    </div>
                                )}
                                <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur-sm shadow-sm font-bold border-none px-2 py-1 uppercase tracking-wider text-[10px]">
                                    {kit.city || 'Kit'}
                                </Badge>
                                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-black text-foreground shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {kit.price}
                                </div>
                            </div>

                            <CardContent className="flex flex-col p-4">
                                <h3 className="font-serif text-[16px] font-bold leading-tight text-foreground group-hover:text-primary transition-colors mb-4">
                                    {kit.title || 'Untitled chat'}
                                </h3>
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                            <span>{kit.rating ?? "—"}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3.5 w-3.5" />
                                            <span>{kit.runs ?? "—"}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
            {kits.length === 0 && (
                <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                    No store chats yet.
                </div>
            )}
        </div>
    );
}
