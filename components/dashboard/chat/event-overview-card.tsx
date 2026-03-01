"use client"

import { SharedEvent } from "@/lib/types";
import { Badge } from "./chat-elements";

interface EventOverviewCardProps {
    event?: SharedEvent;
    onAction?: (action: any) => void;
}

export const EventOverviewCard = ({ event, onAction }: EventOverviewCardProps) => {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null) return "-";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const calculateDaysOut = (dateStr?: string) => {
        if (!dateStr) return "-";
        try {
            const eventDate = new Date(dateStr);
            const today = new Date();
            const diffTime = eventDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? `${diffDays} days` : "Passed";
        } catch (e) {
            return "-";
        }
    };

    const allocatedBudget = event?.bookedVendors?.reduce((acc, vendor) => {
        const amount = parseFloat(vendor.amount.replace(/[^0-9.]/g, '')) || 0;
        return acc + amount;
    }, 0) || 0;

    const budgetPercent = event?.budget ? Math.min(Math.round((allocatedBudget / event.budget) * 100), 100) : 0;

    const budgetDisplay = () => {
        if (!event?.budget && allocatedBudget === 0) return "-";
        if (!event?.budget) return formatCurrency(allocatedBudget);
        return `${formatCurrency(allocatedBudget)} / ${formatCurrency(event.budget)}`;
    };

    return (
        <div className="bg-muted border border-border rounded-xl p-4 mt-3.5">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="font-display text-base text-foreground">{event?.eventName || "-"}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                        {event ? `Status: ${event.status}` : "No event selected"}
                    </div>
                </div>
                {event && (
                    <Badge className={
                        event.status === 'Confirmed' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                            event.status === 'Planning' ? "bg-blue-500/10 text-blue-600 border-blue-500/30" :
                                "bg-slate-500/10 text-slate-600 border-slate-500/30"
                    }>
                        {event.status}
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                {[
                    ["Date", formatDate(event?.date)],
                    ["Venue", event?.location || "-"],
                    ["Guest count", event?.guestCount ? `${event.guestCount} guests` : "-"],
                    ["Budget", budgetDisplay()],
                    ["Planner", event?.hostName || "-"],
                    ["Days out", calculateDaysOut(event?.date)],
                    ["Categories", event?.categories?.join(", ") || "-"],
                    ["Tags", event?.themes?.join(", ") || "-"],
                ].map(([label, val]) => (
                    <div key={label}>
                        <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-0.5">{label}</div>
                        <div className="text-[13px] text-foreground">{val}</div>
                    </div>
                ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-3.5">
                <div className="flex justify-between mb-2">
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground">Budget Allocated</span>
                    <span className="font-display text-sm text-foreground">{budgetPercent}%</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden mb-2.5">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${budgetPercent}%` }} />
                </div>
                <div className="flex flex-wrap gap-3.5">
                    {event?.bookedVendors && event.bookedVendors.length > 0 ? (
                        event.bookedVendors.map((v, i) => (
                            <span key={i} className="text-[11px] text-muted-foreground">
                                {v.service} <span className="text-foreground">{v.amount}</span>
                            </span>
                        ))
                    ) : (
                        <span className="text-[11px] text-muted-foreground italic">No vendors booked yet</span>
                    )}
                </div>
            </div>

            {event && onAction && (
                <div className="mt-3 flex items-center gap-2 border border-border rounded-full px-2 py-1">
                    <button
                        onClick={() => onAction({ label: "Search flight deals", action: "search_flights", eventId: event.id })}
                        className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none"
                    >
                        <span className="text-[14px]">✈️</span> <span className="hidden sm:inline">Search flight deals</span>
                        <span className="sm:hidden">Flights</span>
                    </button>
                    <button
                        onClick={() => onAction({ label: "Edit event", action: "edit_event", eventId: event.id })}
                        className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none"
                    >
                        <span className="text-[14px]">✏️</span> <span className="hidden sm:inline">Edit event</span>
                        <span className="sm:hidden">Edit</span>
                    </button>
                </div>
            )}
        </div>
    );
};
