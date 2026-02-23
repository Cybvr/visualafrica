"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DEMO_CHAT_HISTORY } from '@/lib/chat-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getStoreKits } from '@/lib/firestore-service';

export default function StorePage() {
    const [dbKits, setDbKits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    useEffect(() => {
        setLoading(true);
        getStoreKits()
            .then((kits) => setDbKits(kits))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const demoKits = DEMO_CHAT_HISTORY.filter((kit: any) => kit.published);
    // Combine demo kits and any kits fetched from DB that might not be in demo list
    const dbKitsDeduped = dbKits.filter(dbKit => !demoKits.some((demoKit: any) => demoKit.id === dbKit.id));
    const allKits = [...dbKitsDeduped, ...demoKits];

    const categories = ["All", ...Array.from(new Set(allKits.map(k => k.category).filter(Boolean)))];

    const displayedKits = selectedCategory === "All"
        ? allKits
        : allKits.filter(k => k.category === selectedCategory);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                    Store
                </h2>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">Pre-built event kits to buy, customize, and host as your own. Each comes loaded with certified vendors and a realistic budget.</p>
            </div>

            {categories.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${selectedCategory === category
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                : "bg-card text-foreground border border-border hover:bg-secondary"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i} className="flex h-full flex-col overflow-hidden border-border bg-card animate-pulse">
                            <div className="aspect-[4/3] bg-muted" />
                            <CardContent className="flex flex-col p-4 space-y-3">
                                <div className="h-6 w-3/4 bg-muted rounded" />
                                <div className="h-4 w-1/2 bg-muted rounded" />
                                <div className="flex items-center justify-between pt-2">
                                    <div className="h-4 w-16 bg-muted rounded" />
                                    <div className="h-4 w-16 bg-muted rounded" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                        {displayedKits.map((kit: any) => {
                            const isOldDefault = kit.image?.includes('1511795409834');
                            const displayImage = (kit.image && !isOldDefault) ? kit.image : "/images/logo.png";

                            return (
                                <Link href={`/dashboard/hosts/store/${kit.id}`} key={kit.id} className="block group h-full outline-none">
                                    <Card className="flex h-full flex-col overflow-hidden border-border bg-card transition-all hover:shadow-xl hover:border-primary/50 cursor-pointer">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-secondary w-full flex items-center justify-center">
                                            <img
                                                src={displayImage}
                                                alt={kit.title}
                                                className={displayImage === "/images/logo.png" ? "w-[120px] h-[120px] opacity-30 object-contain transition-transform duration-700 group-hover:scale-105" : "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"}
                                            />
                                            <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur-sm shadow-sm font-bold border-none px-2 py-1 uppercase tracking-wider text-[10px]">
                                                {kit.city || 'Kit'}
                                            </Badge>
                                            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-black text-foreground shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                {kit.price?.startsWith('$') ? kit.price : (kit.price ? `$${kit.price}` : '')}
                                            </div>
                                        </div>

                                        <CardContent className="flex flex-col p-4">
                                            <h3 className="font-serif text-[16px] font-bold leading-tight text-foreground group-hover:text-primary transition-colors mb-1">
                                                {kit.title || 'Untitled chat'}
                                            </h3>
                                            {kit.publisherName && (
                                                <p className="text-xs text-muted-foreground mb-3">by {kit.publisherName}</p>
                                            )}
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
                            );
                        })}
                    </div>
                    {displayedKits.length === 0 && (
                        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-12 md:p-24 text-center">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                            <div className="relative space-y-4">
                                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                                    <ShoppingBag size={40} />
                                </div>
                                <h3 className="text-xl font-bold">No Kits Found</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    We couldn't find any store items matching {selectedCategory === "All" ? "available criteria" : selectedCategory}.
                                </p>
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className="text-primary font-bold hover:underline"
                                >
                                    View all items
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
