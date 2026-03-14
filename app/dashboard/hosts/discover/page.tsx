"use client";

import React, { useEffect, useState } from "react";
import { getRecentInsights } from "@/lib/firestore-service";
import { MapPin, Globe, Clock, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { CITY_COLORS } from "@/lib/chat-data";

type Insight = {
    id: string;
    title: string;
    content: string;
    url: string;
    city?: string;
    createdAt: any;
    tags?: string[];
};

export default function DiscoverPage() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCity, setActiveCity] = useState<string>("All");

    const cities = ["All", "Lagos", "Accra", "Nairobi", "Cape Town"];

    useEffect(() => {
        async function fetchInsights() {
            setLoading(true);
            try {
                const data = await getRecentInsights({ 
                    city: activeCity === "All" ? undefined : activeCity 
                }, 20);
                setInsights(data as Insight[]);
            } catch (error) {
                console.error("Failed to fetch insights:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchInsights();
    }, [activeCity]);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Live Web Stream</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                        Discover <span className="text-primary italic">Now</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                        Real-time web monitoring for new events, festivals, and trending hotspots across Africa.
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5 bg-secondary/50 p-1 rounded-2xl border border-border/50">
                    {cities.map((city) => (
                        <button
                            key={city}
                            onClick={() => setActiveCity(city)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all",
                                activeCity === city
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "hover:bg-background text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Feed */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 4, 5].map((i) => (
                        <div key={i} className="h-48 bg-card border border-border rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : insights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {insights.map((insight) => (
                        <InsightCard key={insight.id} insight={insight} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-3xl">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                        <Globe className="text-muted-foreground" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Waiting for the next hit...</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-1">
                        We're scanning the web for live events and trends in {activeCity === "All" ? "your cities" : activeCity}.
                    </p>
                </div>
            )}
        </div>
    );
}

function InsightCard({ insight }: { insight: Insight }) {
    const cityColor = insight.city ? CITY_COLORS[insight.city] || "hsl(var(--primary))" : "hsl(var(--primary))";
    
    // Format timestamp
    let timeLabel = "Just now";
    if (insight.createdAt) {
        const date = insight.createdAt.toDate ? insight.createdAt.toDate() : new Date(insight.createdAt);
        timeLabel = formatDistanceToNow(date, { addSuffix: true });
    }

    return (
        <div className="group bg-card border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden relative">
            {/* Background Accent */}
            <div 
                className="absolute top-0 right-0 w-32 h-32 blur-[64px] opacity-10 transition-opacity group-hover:opacity-20"
                style={{ background: cityColor }}
            />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {insight.city && (
                            <span 
                                className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border flex items-center gap-1"
                                style={{ 
                                    background: cityColor.replace(')', ', 0.1)'), 
                                    borderColor: cityColor.replace(')', ', 0.2)'),
                                    color: cityColor 
                                }}
                            >
                                <MapPin size={8} /> {insight.city}
                            </span>
                        )}
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <Clock size={8} /> {timeLabel}
                        </span>
                    </div>
                    <Sparkles size={14} className="text-primary/40 group-hover:text-primary transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors underline-offset-4 decoration-primary/20 hover:underline">
                    {insight.title}
                </h3>
                
                <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                    {insight.content}
                </p>
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-wrap gap-1">
                    {(insight.tags || []).slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[9px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full capitalize">
                            #{tag.replace('/', '')}
                        </span>
                    ))}
                </div>
                
                <Link 
                    href={insight.url} 
                    target="_blank"
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-primary hover:gap-2 transition-all p-2 bg-primary/5 rounded-xl border border-primary/10"
                >
                    View Source <ExternalLink size={12} />
                </Link>
            </div>
        </div>
    );
}
