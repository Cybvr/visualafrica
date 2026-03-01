"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, PlaneTakeoff } from "lucide-react";
import { SharedEvent } from "@/lib/types";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

interface FlightsTabProps {
    event: SharedEvent;
}

export default function FlightsTab({ event }: FlightsTabProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [payload, setPayload] = useState<any>(null);

    const storageKey = useMemo(() => {
        if (!user?.uid) return null;
        return `waddi-flight-deals:${user.uid}:${event.id}`;
    }, [user?.uid, event.id]);

    useEffect(() => {
        if (!storageKey || typeof window === "undefined") {
            setPayload(null);
            return;
        }
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
            setPayload(null);
            return;
        }
        try {
            setPayload(JSON.parse(raw));
        } catch (_e) {
            setPayload(null);
        }
    }, [storageKey]);

    const formatUpdatedAt = (value?: number) => {
        if (!value) return "";
        try {
            return new Date(value).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (_e) {
            return "";
        }
    };

    const startFlightSearch = () => {
        const params = new URLSearchParams();
        params.set("q", `Find flight deals for ${event.eventName}`);
        params.set("flightAction", "1");
        params.set("eventId", event.id);
        router.push(`/dashboard/hosts/chat/new?${params.toString()}`);
    };

    const shortUrl = (url?: string) => {
        if (!url) return "";
        try {
            const u = new URL(url);
            return u.hostname.replace(/^www\./, "");
        } catch (_e) {
            return url;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-2">
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
                <div>
                    <h3 className="text-base font-bold text-foreground">Flights</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Flight recommendations for this event sync here after chat search.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button type="button" className="h-10 gap-2 rounded-xl" onClick={startFlightSearch}>
                        <PlaneTakeoff size={16} />
                        Refresh in Chat
                        <ArrowRight size={16} />
                    </Button>
                </div>

                {payload?.updatedAt ? (
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 size={14} />
                        Updated {formatUpdatedAt(payload.updatedAt)}
                    </div>
                ) : null}

                <div className="space-y-2">
                    {Array.isArray(payload?.deals) && payload.deals.length > 0 ? (
                        payload.deals.map((d: any, i: number) => (
                            <div key={`${d.label}-${i}`} className="border border-border/60 rounded-xl p-3">
                                <div className="text-[13px] font-semibold text-foreground">{d.label || "Deal"}</div>
                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                    {[d.price, d.dates].filter(Boolean).join(" · ")}
                                </div>
                                <div className="text-[11px] text-muted-foreground mt-1">
                                    {d.source ? `Source: ${d.source}` : ""}
                                </div>
                                {d.url ? (
                                    <a
                                        href={d.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] text-primary mt-1 break-all underline hover:no-underline"
                                    >
                                        {shortUrl(d.url)}
                                    </a>
                                ) : null}
                            </div>
                        ))
                    ) : (
                        <div className="text-[12px] text-muted-foreground">
                            No flight recommendations yet. Use "Refresh in Chat" to generate them.
                        </div>
                    )}
                </div>

                {Array.isArray(payload?.sources) && payload.sources.length > 0 ? (
                    <div className="pt-2 border-t border-border/60">
                        <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Sources</div>
                        <div className="text-[11px] text-muted-foreground space-y-1">
                            {payload.sources.map((s: any, i: number) => (
                                <div key={`${s.title}-${i}`} className="break-all">
                                    {s.title || "Source"}
                                    {s.url ? (
                                        <>
                                            {" — "}
                                            <a
                                                href={s.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary underline hover:no-underline"
                                            >
                                                {shortUrl(s.url)}
                                            </a>
                                        </>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </section>
        </div>
    );
}
