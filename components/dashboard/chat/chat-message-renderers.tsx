"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, MapPin, Star, Users, ThumbsUp, ThumbsDown, Copy, ArrowRight } from "lucide-react";
import { cn, formatCurrency, getCurrencySymbol } from "@/lib/utils";
import { CITY_COLORS, CITIES } from "@/lib/chat-data";
import { SharedEvent } from "@/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    EventOverviewCard,
    VendorGrid,
    TaskChecklist,
    DayOfTimeline,
    BudgetPlanner,
} from "@/components/dashboard/chat";
import TicketsTab from "@/components/dashboard/event-tabs/TicketsTab";

export function Dots() {
    return (
        <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8A020", display: "inline-block", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
            ))}
        </div>
    );
}

function CityBadge({ city }: { city: string }) {
    const color = CITY_COLORS[city] || "hsl(var(--muted-foreground))";
    return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded px-1.5 py-0.5 mb-2 tracking-wider uppercase font-mono"
            style={{ background: color.includes('hsl') ? color.replace(')', ', 0.1)') : color + "18", border: `1px solid ${color.includes('hsl') ? color.replace(')', ', 0.2)') : color + "44"}`, color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {city}
        </span>
    );
}

function SuggestionBubble({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="bg-card border border-border hover:border-primary/50 text-foreground text-[12px] px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 whitespace-nowrap"
        >
            {label}
        </button>
    );
}

function VCard({ v, savedVendors, onSave, onVendorAction }: { v: any; savedVendors: Set<string>; onSave: (v: any) => void; onVendorAction: (a: any, v: any) => void }) {
    const vendorKey = v?.id || v?.slug || v?.name;
    const isSaved = vendorKey ? savedVendors.has(vendorKey) : false;
    const [showActions, setShowActions] = useState(false);

    return (
        <div className="block relative group">
            <div
                onClick={() => setShowActions(!showActions)}
                className={cn(
                    "bg-card border transition-all duration-150 rounded-xl p-3 mb-2 cursor-pointer select-none group-hover:border-primary/50 group-hover:shadow-md",
                    "border-border"
                )}
            >
                <div className="flex justify-between items-start gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                        <img
                            src={v.image || "/placeholder.png"}
                            alt={v.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-foreground font-bold text-sm group-hover:text-primary transition-colors">{v.name}</div>
                        <div className="text-muted-foreground text-[11px]">{v.type}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {isSaved && <span className="text-primary text-sm">🔖</span>}
                        <span className="bg-primary/10 text-primary text-[11px] font-semibold rounded-full px-2 py-0.5">{v.status}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                    {v.tags.map((t: string, idx: number) => (
                        <span key={`${vendorKey || v.name}-tag-${idx}-${t}`} className="bg-secondary text-muted-foreground text-[11px] rounded px-1.5 py-0.5">{t}</span>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-primary font-bold text-sm">
                        {v.price === null || v.price === undefined || Number.isNaN(Number(v.price))
                            ? "Contact for pricing"
                            : `${formatCurrency(Number(v.price))}+`}
                    </span>
                    {!showActions && (
                        <span className="text-muted-foreground hover:text-foreground transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                            Actions <ChevronDown size={12} />
                        </span>
                    )}
                </div>

                {showActions && (
                    <div className="mt-3 bg-secondary/40 rounded-full p-1 border border-border flex items-center justify-between gap-1 w-full animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onVendorAction && onVendorAction({ id: 'message' }, v); }}
                            className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none">
                            <span className="text-[16px]">💬</span> <span className="hidden sm:inline">Message</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onVendorAction && onVendorAction({ id: 'contract' }, v); }}
                            className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none">
                            <span className="text-[16px]">📄</span> <span className="hidden sm:inline">Brief</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onSave(v); }}
                            className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none">
                            <span className="text-[16px]">🔖</span> <span className="hidden sm:inline">Save</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <Link
                            href={`/dashboard/hosts/vendor/${v.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-[11px] font-semibold py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all flex justify-center items-center gap-1.5 leading-none">
                            <span className="text-[16px]">👤</span> <span className="hidden sm:inline">View</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function VendorCardMsg({
    msg,
    savedVendors,
    onSave,
    onVendorAction,
    activeCity,
    allVendorsByCity,
    activeEvent,
    onAction
}: {
    msg: any;
    savedVendors: Set<string>;
    onSave: (v: any) => void;
    onVendorAction: (a: any, v: any) => void;
    activeCity: string | null;
    allVendorsByCity: Record<string, any[]>;
    activeEvent?: SharedEvent;
    onAction?: (action: any) => void;
}) {
    const currencySymbol = getCurrencySymbol();
    const targetCity = msg.city || activeCity;
    const allForCity = targetCity ? allVendorsByCity[targetCity] || [] : [];
    const sourceVendors = (msg.vendors && msg.vendors.length > 0) ? msg.vendors : allForCity;
    const dedupedVendors = sourceVendors.filter((vendor: any, idx: number, arr: any[]) => {
        const vendorKey = String(vendor?.id || vendor?.slug || vendor?.name || `${idx}`);
        const firstIndex = arr.findIndex((candidate: any) => String(candidate?.id || candidate?.slug || candidate?.name || "") === vendorKey);
        return firstIndex === idx;
    });
    const shown = dedupedVendors.slice(0, 5);
    const hasMore = dedupedVendors.length > shown.length;
    const viewAllHref = msg.viewAllHref || "/dashboard/hosts/search";
    const viewAllLabel = msg.viewAllLabel || "View all vendors";

    return (
        <div className="w-full">
            <div className="mb-3">
                {msg.city && <CityBadge city={msg.city} />}
                <div className="text-foreground text-[16px] leading-relaxed">{msg.content}</div>
            </div>
            <div className="w-full max-w-[480px] space-y-3">
                {shown.map((v: any, idx: number) => (
                    <VCard key={`vendor-${v?.id || v?.slug || v?.name || idx}-${idx}`} v={v} savedVendors={savedVendors} onSave={onSave} onVendorAction={onVendorAction} />
                ))}
            </div>
            {hasMore && (
                <Link
                    href={viewAllHref}
                    className="block w-full max-w-[480px] py-2.5 mt-2 border border-dashed border-border rounded-xl text-muted-foreground text-xs hover:text-primary hover:border-primary transition-all font-mono text-center"
                >
                    {viewAllLabel} ({dedupedVendors.length})
                </Link>
            )}
            {activeEvent && onAction && (
                <div className="w-full max-w-[480px] mt-2 flex items-center gap-2 border border-border rounded-full px-2 py-1">
                    <button
                        onClick={() => onAction({ label: "Search flight deals", action: "search_flights", eventId: activeEvent.id })}
                        className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none"
                    >
                        <span className="text-[16px]">✈️</span> <span className="hidden sm:inline">Search flight deals</span>
                        <span className="sm:hidden">Flights</span>
                    </button>
                </div>
            )}
        </div>
    );
}

function KnowledgeCard({ item }: { item: any }) {
    const isBlog = !!item.author;
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden w-full shadow-sm">
            {item.image && (
                <div className="h-24 w-full relative overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                        {isBlog ? "Guide" : "Solution"}
                    </div>
                </div>
            )}
            <div className="p-3">
                <div className="text-[13px] font-bold leading-tight mb-1 text-foreground">{item.title}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                    {item.excerpt || item.description || item.tagline}
                </div>
                <button className="text-[11px] font-bold text-primary uppercase tracking-wider hover:underline">
                    {isBlog ? "Read Guide" : "See Details"} →
                </button>
            </div>
        </div>
    );
}

function CommunityCard({ item }: { item: any }) {
    return (
        <Link
            href={`/dashboard/hosts/community/${item.id}`}
            className="group block bg-card border border-border rounded-2xl overflow-hidden w-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
        >
            <div className="h-40 w-full relative overflow-hidden">
                <img src={item.image} alt={item.eventName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-accent text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">
                    Community
                </div>
            </div>
            <div className="p-4">
                <div className="text-[16px] font-black leading-tight mb-1 text-foreground">{item.eventName}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <MapPin size={10} /> {item.location}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function EventForm({
    onSubmit,
    defaultCity,
    initialData,
    mode = "create"
}: {
    onSubmit: (data: any) => void;
    defaultCity?: string | null;
    initialData?: any;
    mode?: "create" | "edit";
}) {
    const CATEGORY_OPTIONS = [
        "Venues",
        "Catering",
        "Decorations",
        "Photographers",
        "Entertainment",
        "Event Planners",
        "Makeup Artists",
        "Party Equipment",
        "Cakes & Sweets",
        "Experiences",
    ];

    const [data, setData] = useState({
        eventId: initialData?.eventId || "",
        name: initialData?.name || "",
        guests: initialData?.guests || "",
        budget: initialData?.budget || "",
        city: initialData?.city || defaultCity || "",
        date: initialData?.date || "",
        type: initialData?.type || "",
        categories: initialData?.categories || "",
        tags: initialData?.tags || ""
    });
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        () =>
            String(initialData?.categories || "")
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
    );

    const toggleCategory = (category: string) => {
        const next = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(next);
        setData((prev) => ({ ...prev, categories: next.join(", ") }));
    };
    const currencySymbol = getCurrencySymbol();

    return (
        <div className="bg-card border border-border rounded-2xl p-4 w-full space-y-3 shadow-sm">
            <div className="text-[13px] font-bold text-foreground">Tell us about your event:</div>
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="Event Name (e.g. Ama's 30th)"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="date"
                        placeholder="Date"
                        className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                        value={data.date}
                        onChange={e => setData({ ...data, date: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Event Type (e.g. Wedding)"
                        className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                        value={data.type}
                        onChange={e => setData({ ...data, type: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Guest Count"
                        className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                        value={data.guests}
                        onChange={e => setData({ ...data, guests: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder={`Budget (e.g. ${currencySymbol}1M)`}
                        className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                        value={data.budget}
                        onChange={e => setData({ ...data, budget: e.target.value })}
                    />
                </div>
                <Select value={data.city} onValueChange={(value) => setData({ ...data, city: value })}>
                    <SelectTrigger className="w-full bg-secondary/50 border-border text-sm">
                        <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                        {CITIES.map(c => (
                            <SelectItem key={c.name} value={c.name}>{c.flag} {c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-left flex items-center justify-between"
                        >
                            <span className={selectedCategories.length ? "text-foreground" : "text-muted-foreground"}>
                                {selectedCategories.length ? selectedCategories.join(", ") : "Select categories"}
                            </span>
                            <ChevronDown size={16} className="text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width] bg-background">
                        {CATEGORY_OPTIONS.map((category) => (
                            <DropdownMenuCheckboxItem
                                key={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                            >
                                {category}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <input
                    type="text"
                    placeholder="Tags (optional, comma separated)"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                    value={data.tags}
                    onChange={e => setData({ ...data, tags: e.target.value })}
                />
            </div>
            <button
                onClick={() => onSubmit(data)}
                disabled={!data.name || !data.guests || !data.budget || !data.city}
                className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg text-sm transition-all active:scale-95 disabled:opacity-50"
            >
                {mode === "edit" ? "Update Event" : "Create Event"}
            </button>
        </div>
    );
}

function TicketForm({ onSubmit, eventName, eventId }: { onSubmit: (data: any) => void; eventName?: string; eventId?: string }) {
    const currencySymbol = getCurrencySymbol();
    const [data, setData] = useState({ name: "", price: "", quantity: "", description: "" });
    return (
        <div className="bg-card border border-border rounded-2xl p-4 w-full space-y-3 shadow-sm">
            <div className="text-[13px] font-bold text-foreground flex items-center gap-2">
                <span className="text-xl">🎫</span>
                Set up tickets {eventName ? `for ${eventName}` : ""}:
            </div>
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="Ticket Type (e.g. VIP, General Admission)"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        placeholder={`Price (${currencySymbol})`}
                        className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                        value={data.price}
                        onChange={e => setData({ ...data, price: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                        value={data.quantity}
                        onChange={e => setData({ ...data, quantity: e.target.value })}
                    />
                </div>
                <textarea
                    placeholder="Description (Optional)"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 h-20 resize-none pt-2"
                    value={data.description}
                    onChange={e => setData({ ...data, description: e.target.value })}
                />
            </div>
            <button
                onClick={() => onSubmit({ ...data, eventId })}
                disabled={!data.name || !data.price || !data.quantity}
                className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg text-sm transition-all active:scale-95 disabled:opacity-50"
            >
                Add Ticket Tier
            </button>
        </div>
    );
}

function TicketWorkspace({
    events,
    selectedEventId,
    onEventChange
}: {
    events: SharedEvent[];
    selectedEventId: string | null;
    onEventChange: (id: string | null) => void;
}) {
    const selectedEvent =
        (selectedEventId ? events.find((event) => event.id === selectedEventId) : undefined) ||
        (events.length === 1 ? events[0] : undefined);

    return (
        <div className="space-y-3">
            {events.length > 0 && (
                <Select value={selectedEventId || undefined} onValueChange={(value) => onEventChange(value || null)}>
                    <SelectTrigger className="w-full max-w-[320px] h-10 bg-card border-border">
                        <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                        {events.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                                {event.eventName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {!selectedEvent ? (
                <div className="p-4 border border-dashed border-border rounded-xl text-center text-muted-foreground text-sm">
                    {events.length === 0 ? "No events found in your account." : "Select an event to manage tickets."}
                </div>
            ) : (
                <TicketsTab event={selectedEvent} />
            )}
        </div>
    );
}

function FlightPreferencesForm({
    onSubmit,
    eventId,
    defaultOrigin,
    destination,
}: {
    onSubmit: (data: any) => void;
    eventId?: string;
    defaultOrigin?: string;
    destination?: string;
}) {
    const [data, setData] = useState({
        origin: defaultOrigin || "",
        destination: destination || "",
    });

    const destinationLocked = Boolean(destination && destination.trim());

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            destination: destination || prev.destination || ""
        }));
    }, [destination]);

    useEffect(() => {
        if (typeof window === "undefined" || !eventId) return;
        const raw = window.localStorage.getItem(`waddi-flight-prefs:chat:${eventId}`);
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw);
            setData((prev) => ({
                ...prev,
                origin: parsed.origin || prev.origin,
                destination: parsed.destination || prev.destination,
            }));
        } catch (_e) {
            // Ignore invalid local storage payload.
        }
    }, [eventId]);

    const submit = () => {
        if (typeof window !== "undefined" && eventId) {
            window.localStorage.setItem(`waddi-flight-prefs:chat:${eventId}`, JSON.stringify(data));
        }
        onSubmit({
            eventId,
            origin: data.origin,
            destination: data.destination,
            skipPreferencesPrompt: true
        });
    };

    return (
        <div className="bg-card border border-border rounded-2xl p-4 w-full space-y-3 shadow-sm">
            <div className="text-[13px] font-bold text-foreground">Where are you flying from?</div>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                    value={data.origin}
                    onChange={(e) => setData({ ...data, origin: e.target.value })}
                />
                <span className="text-muted-foreground text-lg leading-none">→</span>
                <input
                    type="text"
                    placeholder="Event location"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${destinationLocked
                        ? "bg-muted/60 border-border text-muted-foreground cursor-not-allowed"
                        : "bg-secondary/50 border-border focus:border-primary/50"
                        }`}
                    value={data.destination}
                    onChange={(e) => setData({ ...data, destination: e.target.value })}
                    disabled={destinationLocked}
                />
            </div>
            <button
                onClick={submit}
                disabled={!data.origin.trim() || !data.destination.trim()}
                className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg text-sm transition-all active:scale-95 disabled:opacity-50"
            >
                Search Flights
            </button>
        </div>
    );
}


function CalendarPicker({ onSelect }: { onSelect: (date: string) => void }) {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const [selected, setSelected] = useState<number | null>(null);
    return (
        <div className="bg-card border border-border rounded-2xl p-4 w-full shadow-sm">
            <div className="text-[13px] font-bold text-foreground mb-3 flex justify-between items-center">
                <span>Select a Date</span>
                <span className="text-[11px] text-muted-foreground font-normal">August 2026</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <span key={d} className="text-[10px] text-muted-foreground font-bold">{d}</span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 6 }).map((_, i) => <div key={`empty-${i}`} />)}
                {days.map(d => (
                    <button
                        key={d}
                        onClick={() => { setSelected(d); onSelect(`August ${d}, 2026`); }}
                        className={cn(
                            "aspect-square text-[12px] flex items-center justify-center rounded-lg transition-colors",
                            selected === d ? "bg-primary text-primary-foreground font-bold" : "hover:bg-secondary text-foreground"
                        )}
                    >
                        {d}
                    </button>
                ))}
            </div>
        </div>
    );
}

function AmaFlowCard({ msg }: { msg: any }) {
    const tableHeaders = msg.columns || [];
    const tableRows = msg.rows || [];
    return (
        <div className="w-full space-y-2.5">
            {msg.kicker && <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-bold">{msg.kicker}</div>}
            {msg.content && <div className="text-foreground text-[16px] leading-relaxed whitespace-pre-line">{msg.content}</div>}
            {msg.meta && <div className="text-[12px] text-primary font-medium">{msg.meta}</div>}

            {tableHeaders.length > 0 && tableRows.length > 0 && (
                <div className="rounded-xl border border-border overflow-hidden bg-card/30">
                    <div
                        className="grid bg-secondary/60 px-2.5 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
                        style={{ gridTemplateColumns: `repeat(${tableHeaders.length}, minmax(0, 1fr))` }}
                    >
                        {tableHeaders.map((h: string) => <span key={h}>{h}</span>)}
                    </div>
                    {tableRows.map((row: string[], idx: number) => (
                        <div
                            key={`${row.join("-")}-${idx}`}
                            className="grid px-2.5 py-2 text-[12px] border-t border-border"
                            style={{ gridTemplateColumns: `repeat(${tableHeaders.length}, minmax(0, 1fr))` }}
                        >
                            {row.map((cell, cIdx) => <span key={`${cell}-${cIdx}`} className="text-foreground">{cell}</span>)}
                        </div>
                    ))}
                </div>
            )}

            {msg.footer && <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">{msg.footer}</div>}
        </div>
    );
}

function Step({ a }: { a: any }) {
    const m = { done: { i: "✓", c: "#20C9A0" }, active: { i: "◌", c: "#E8A020" }, queued: { i: "○", c: "#3A3A5A" } };
    const { i, c } = m[a.status as 'done' | 'active' | 'queued'] || { i: "○", c: "#3A3A5A" };
    return (
        <div className="flex items-center gap-2.5 mb-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: c + "22", color: c }}>{i}</span>
            <span className={cn("text-[13px]", a.status === "queued" ? "text-muted-foreground/40" : a.status === "done" ? "text-muted-foreground" : "text-foreground font-medium")}>{a.label}</span>
        </div>
    );
}

function StoreCard({ item, onAction }: { item: any; onAction?: (action: string, item: any) => void }) {
    const [showActions, setShowActions] = useState(false);

    return (
        <div className="block relative group">
            <div
                onClick={() => setShowActions(!showActions)}
                className={cn(
                    "bg-card border transition-all duration-150 rounded-xl p-3 mb-2 cursor-pointer select-none group-hover:border-primary/50 group-hover:shadow-md",
                    "border-border"
                )}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-foreground font-bold text-sm group-hover:text-primary transition-colors">{item.title}</div>
                        <div className="text-muted-foreground text-[11px] uppercase tracking-wider font-mono">{item.city}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="bg-primary/10 text-primary text-[11px] font-semibold rounded-full px-2 py-0.5">
                            {item.price === null || item.price === undefined || Number.isNaN(Number(item.price))
                                ? "Contact for pricing"
                                : `${formatCurrency(Number(item.price))}+`}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                        <span className="flex items-center gap-0.5"><Star size={10} className="text-yellow-500 fill-yellow-500" /> {item.rating || "4.8"}</span>
                        <span className="flex items-center gap-0.5"><Users size={10} /> {item.runs || "12"} runs</span>
                    </div>
                    {!showActions && (
                        <span className="text-muted-foreground hover:text-foreground transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                            Actions <ChevronDown size={12} />
                        </span>
                    )}
                </div>

                {showActions && (
                    <div className="mt-3 bg-secondary/40 rounded-full p-1 border border-border flex items-center justify-between gap-1 w-full animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onAction && onAction('apply', item); }}
                            className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none">
                            <span className="text-[16px]">⚡</span> <span className="hidden sm:inline">Apply</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onAction && onAction('buy', item); }}
                            className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none">
                            <span className="text-[16px]">💰</span> <span className="hidden sm:inline">Buy Kit</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <Link
                            href={`/dashboard/hosts/chat/${item.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-[11px] font-semibold py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all flex justify-center items-center gap-1.5 leading-none">
                            <span className="text-[16px]">👁️</span> <span className="hidden sm:inline">Preview</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function StoreListMsg({ msg, onStoreAction }: { msg: any; onStoreAction?: (action: string, item: any) => void }) {
    const items = msg.items || [];
    const shown = items.slice(0, 5);
    const hasMore = items.length > shown.length;
    const viewAllHref = msg.viewAllHref || "/dashboard/hosts/store";
    const viewAllLabel = msg.viewAllLabel || "View all kits";
    return (
        <div className="w-full">
            <div className="mb-3">
                {msg.city && <CityBadge city={msg.city} />}
                <div className="text-foreground text-[16px] leading-relaxed">{msg.content}</div>
            </div>
            <div className="w-full max-w-[480px] space-y-3">
                {shown.map((item: any) => (
                    <StoreCard key={item.id} item={item} onAction={onStoreAction} />
                ))}
            </div>
            {hasMore && (
                <Link
                    href={viewAllHref}
                    className="block w-full max-w-[480px] py-2.5 mt-2 border border-dashed border-border rounded-xl text-muted-foreground text-xs hover:text-primary hover:border-primary transition-all font-mono text-center"
                >
                    {viewAllLabel} ({items.length})
                </Link>
            )}
        </div>
    );
}

function DealCard({ deal }: { deal: any }) {
    return (
        <a
            href={deal.url}
            target="_blank"
            rel="noreferrer"
            className="block group relative"
        >
            <div className="bg-card border border-border transition-all duration-150 rounded-2xl p-4 mb-2 cursor-pointer select-none group-hover:border-primary/50 group-hover:shadow-md">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="text-foreground font-bold text-[15px] group-hover:text-primary transition-colors">{deal.deal_name}</div>
                        <div className="text-muted-foreground text-[12px] mt-0.5 line-clamp-1">{deal.tags}</div>
                    </div>
                    <div className="shrink-0 bg-primary/10 text-primary text-[11px] font-bold rounded-full px-2.5 py-1 tracking-tight">
                        {deal.discount}
                    </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        Claim Deal <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    {deal.expires && (
                        <span className="text-[10px] text-muted-foreground font-medium">Expires: {deal.expires}</span>
                    )}
                </div>
            </div>
        </a>
    );
}

function DealsListMsg({ msg }: { msg: any }) {
    const deals = msg.deals || [];
    return (
        <div className="w-full">
            <div className="mb-3">
                <div className="text-foreground text-[16px] leading-relaxed font-medium">{msg.content}</div>
            </div>
            <div className="w-full max-w-[480px] space-y-2">
                {deals.map((deal: any, idx: number) => (
                    <DealCard key={`deal-${idx}`} deal={deal} />
                ))}
            </div>
        </div>
    );
}

function InspirationGalleryMsg({ msg }: { msg: any }) {
    const images = Array.isArray(msg.images) ? msg.images.slice(0, 8) : [];

    return (
        <div className="w-full mt-1">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
                <div className="text-sm font-bold text-foreground">
                    {msg.title || "Inspiration references"}
                </div>
                {msg.query && (
                    <div className="text-[11px] text-muted-foreground">
                        Query: <span className="text-foreground">{msg.query}</span>
                    </div>
                )}
                {images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {images.map((image: any, index: number) => (
                            <a
                                key={`${image.url || index}-${index}`}
                                href={image.pageUrl || image.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
                            >
                                <img
                                    src={image.url}
                                    alt={image.alt || "Inspiration image"}
                                    className="h-28 sm:h-32 w-full object-cover"
                                    loading="lazy"
                                />
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-[12px] text-muted-foreground">
                        No images returned yet. Try again with a slightly different event theme.
                    </div>
                )}
                <div className="text-[11px] text-muted-foreground">
                    Source: {String(msg.source || "internet")}
                </div>
            </div>
        </div>
    );
}

type MsgProps = {
    msg: any;
    onSelectCity: (city: string) => void;
    activeCity: string | null;
    savedVendors: Set<string>;
    onSave: (vendor: any) => void;
    onVendorAction: (action: any, vendor: any) => void;
    onStoreAction: (action: string, item: any) => void;
    onSuggestion: (suggestion: any) => void;
    allVendorsByCity: Record<string, any[]>;
    onFormSubmit: (data: any) => void;
    onTicketFormSubmit: (data: any) => void;
    onFlightFormSubmit: (data: any) => void;
    onCalendarSelect: (date: string) => void;
    liveEvents: SharedEvent[];
    selectedEventId: string | null;
    onEventSelect: (id: string | null) => void;
    onUpgradeToPro?: () => void;
    onFeedback?: (rating: "up" | "down", msg: any) => void;
    onCopy?: (msg: any) => void;
    showSuggestions?: boolean;
};

export function Msg({
    msg,
    onSelectCity,
    activeCity,
    savedVendors,
    onSave,
    onVendorAction,
    onStoreAction,
    onSuggestion,
    allVendorsByCity,
    onFormSubmit,
    onTicketFormSubmit,
    onFlightFormSubmit,
    onCalendarSelect,
    liveEvents,
    selectedEventId,
    onEventSelect,
    onUpgradeToPro,
    onFeedback,
    onCopy,
    showSuggestions = true
}: MsgProps) {
    const ag = msg.role === "agent";
    const activeEvent =
        (msg.eventId && liveEvents.find((ev) => ev.id === msg.eventId)) ||
        (selectedEventId ? liveEvents.find((ev) => ev.id === selectedEventId) : undefined) ||
        (liveEvents.length === 1 ? liveEvents[0] : undefined);
    const isGroundingRedirect = (url?: string) =>
        !!url && url.includes("grounding-api-redirect");
    const toFallbackSearchUrl = (title?: string) => {
        if (!title) return "";
        return `https://www.google.com/search?q=${encodeURIComponent(title)}`;
    };
    const formatUrl = (url?: string, title?: string) => {
        if (!url) return "";
        try {
            const u = new URL(url);
            const host = u.hostname.replace(/^www\./, "");
            const path = u.pathname.replace(/\/$/, "");
            const shortPath = path.length > 24 ? `${path.slice(0, 24)}…` : path;
            return `${host}${shortPath ? shortPath : ""}`;
        } catch (e) {
            const fallback = title ? toFallbackSearchUrl(title) : url;
            return fallback.length > 32 ? `${fallback.slice(0, 32)}…` : fallback;
        }
    };
    return (
        <div className={cn("flex gap-3.5 mb-6", ag ? "flex-row items-start" : "flex-row-reverse items-start")}>
            {ag ? null : null}

            <div className={cn("flex-1 min-w-0 flex flex-col", ag ? "items-start" : "items-end")}>
                <div className={cn("w-full max-w-[95%] sm:max-w-[480px]", ag ? "text-left" : "text-right")}>
                    {msg.type === "city_picker" ? (
                        <div className="flex flex-col gap-2 w-full mt-1">
                            {CITIES.map(c => (
                                <button key={c.name} onClick={() => onSelectCity(c.name)} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-all text-left shadow-sm">
                                    <span className="text-2xl">{c.flag}</span>
                                    <div>
                                        <div className="text-[13px] font-bold">{c.name}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-tight">{c.vibe}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : msg.type === "vendor_cards" ? (
                        <div className="mt-1">
                            <VendorCardMsg
                                msg={msg}
                                savedVendors={savedVendors}
                                onSave={onSave}
                                onVendorAction={onVendorAction}
                                activeCity={activeCity}
                                allVendorsByCity={allVendorsByCity}
                                activeEvent={activeEvent}
                                onAction={onSuggestion}
                            />
                        </div>
                    ) : msg.type === "action" ? (
                        <div className="w-full mt-1">
                            <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50 w-full shadow-sm">
                                <div className="text-foreground text-sm font-bold mb-3">{msg.content}</div>
                                {msg.actions.map((a: any, idx: number) => <Step key={idx} a={a} />)}
                                {activeEvent && (
                                    <div className="mt-3 flex items-center gap-2 border border-border rounded-full px-2 py-1">
                                        <button
                                            onClick={() => onSuggestion({ label: "Search flight deals", action: "search_flights", eventId: activeEvent.id })}
                                            className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none"
                                        >
                                            <span className="text-[16px]">✈️</span> <span className="hidden sm:inline">Search flight deals</span>
                                            <span className="sm:hidden">Flights</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : msg.type === "ama_flow_card" ? (
                        <div className="w-full mt-1">
                            <AmaFlowCard msg={msg} />
                        </div>
                    ) : msg.type === "knowledge" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <div className="w-full">
                                <KnowledgeCard item={msg.data} />
                            </div>
                        </div>
                    ) : msg.type === "community" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <div className="w-full">
                                <CommunityCard item={msg.data} />
                            </div>
                        </div>
                    ) : msg.type === "event_form" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <div className="w-full">
                                <EventForm
                                    onSubmit={onFormSubmit}
                                    defaultCity={activeCity}
                                    initialData={msg.formData}
                                    mode={msg.mode || "create"}
                                />
                            </div>
                        </div>
                    ) : msg.type === "ticket_form" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <div className="w-full">
                                <TicketForm onSubmit={onTicketFormSubmit} eventName={activeEvent?.eventName} eventId={msg.eventId || activeEvent?.id} />
                            </div>
                        </div>
                    ) : msg.type === "flight_form" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <div className="w-full">
                                <FlightPreferencesForm
                                    onSubmit={onFlightFormSubmit}
                                    eventId={msg.eventId || activeEvent?.id}
                                    defaultOrigin={msg.defaultOrigin || activeCity || ""}
                                    destination={msg.destination || activeEvent?.location || ""}
                                />
                            </div>
                        </div>
                    ) : msg.type === "flight_status" || msg.type === "deliberation_status" ? (
                        <div className="w-full mt-1">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/30 px-3 py-1.5 text-[11px] text-muted-foreground">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                <span>{msg.content || "Processing..."}</span>
                            </div>
                        </div>
                    ) : msg.type === "calendar_picker" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <div className="w-full">
                                <CalendarPicker onSelect={onCalendarSelect} />
                            </div>
                        </div>
                    ) : msg.type === "store_cards" ? (
                        <div className="mt-1">
                            <StoreListMsg msg={msg} onStoreAction={onStoreAction} />
                        </div>
                    ) : msg.type === "overview" ? (
                        <div className="w-full mt-1 space-y-4">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            {liveEvents && liveEvents.length > 0 ? (
                                liveEvents.map((event: SharedEvent) => (
                                    <EventOverviewCard key={event.id} event={event} onAction={onSuggestion} />
                                ))
                            ) : (
                                <div className="p-4 border border-dashed border-border rounded-xl text-center text-muted-foreground text-sm">
                                    No events found in your account.
                                </div>
                            )}
                        </div>
                    ) : msg.type === "event_overview" ? (
                        <div className="w-full mt-1 space-y-4">
                            {(() => {
                                const event = liveEvents.find((ev) => ev.id === msg.eventId)
                                    || (selectedEventId ? liveEvents.find((ev) => ev.id === selectedEventId) : undefined);
                                return event ? (
                                    <EventOverviewCard event={event} onAction={onSuggestion} />
                                ) : (
                                    <div className="p-4 border border-dashed border-border rounded-xl text-center text-muted-foreground text-sm">
                                        Event details are syncing. Try again in a moment.
                                    </div>
                                );
                            })()}
                        </div>
                    ) : msg.type === "todo" ? (
                        <div className="w-full mt-1 space-y-3">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <TaskChecklist
                                events={liveEvents}
                                selectedEventId={selectedEventId}
                                onEventChange={onEventSelect}
                                onUpgradeToPro={onUpgradeToPro}
                            />
                        </div>
                    ) : msg.type === "timeline" ? (
                        <div className="w-full mt-1 space-y-3">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <DayOfTimeline
                                events={liveEvents}
                                selectedEventId={selectedEventId}
                                onEventChange={onEventSelect}
                                onUpgradeToPro={onUpgradeToPro}
                            />
                        </div>
                    ) : msg.type === "budget" ? (
                        <div className="w-full mt-1 space-y-3">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <BudgetPlanner
                                events={liveEvents}
                                selectedEventId={selectedEventId}
                                onEventChange={onEventSelect}
                            />
                        </div>
                    ) : msg.type === "tickets" ? (
                        <div className="w-full mt-1 space-y-3">
                            {msg.content && <div className="text-[16px] leading-relaxed text-foreground">{msg.content}</div>}
                            <TicketWorkspace
                                events={liveEvents}
                                selectedEventId={selectedEventId}
                                onEventChange={onEventSelect}
                            />
                        </div>
                    ) : msg.type === "flight_deals" ? (
                        <div className="w-full mt-1">
                            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
                                <div className="text-sm font-bold text-foreground">{msg.title || "Flight deal guidance"}</div>
                                <div className="space-y-2">
                                    {(msg.deals || []).map((d: any, i: number) => (
                                        <div key={`${d.label}-${i}`} className="border border-border/60 rounded-xl p-3">
                                            <div className="text-[13px] font-semibold text-foreground">{d.label || "Deal"}</div>
                                            <div className="text-[11px] text-muted-foreground mt-0.5">
                                                {[d.price, d.dates].filter(Boolean).join(" · ")}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground mt-1">
                                                {d.source ? `Source: ${d.source}` : ""}
                                            </div>
                                            {d.url && (
                                                <a
                                                    href={isGroundingRedirect(d.url) ? toFallbackSearchUrl(d.source || d.label) : d.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[11px] text-primary mt-1 break-all underline hover:no-underline"
                                                >
                                                    {formatUrl(d.url, d.source || d.label)}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                    {(!msg.deals || msg.deals.length === 0) && (
                                        <div className="text-[12px] text-muted-foreground">
                                            {msg.emptyHint || "I couldn't confirm priced options right now. Try different dates or origin."}
                                        </div>
                                    )}
                                </div>
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="pt-2 border-t border-border/60">
                                        <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Sources</div>
                                        <div className="text-[11px] text-muted-foreground space-y-1">
                                            {msg.sources.map((s: any, i: number) => (
                                                <div key={`${s.title}-${i}`} className="break-all">
                                                    {s.title || "Source"}
                                                    {s.url || s.title ? (
                                                        <>
                                                            {" — "}
                                                            <a
                                                                href={isGroundingRedirect(s.url) ? toFallbackSearchUrl(s.title) : (s.url || toFallbackSearchUrl(s.title))}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-primary underline hover:no-underline"
                                                            >
                                                                {formatUrl(s.url || toFallbackSearchUrl(s.title), s.title)}
                                                            </a>
                                                        </>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : msg.type === "deal_cards" ? (
                        <div className="mt-1">
                            <DealsListMsg msg={msg} />
                        </div>
                    ) : msg.type === "inspiration_gallery" ? (
                        <InspirationGalleryMsg msg={msg} />
                    ) : msg.type === "vendors" ? (
                        <div className="w-full mt-1">
                            <VendorGrid />
                        </div>
                    ) : (
                        msg.content ? (
                            <div className={cn(
                                "text-[16px] leading-relaxed whitespace-pre-line mt-1 inline-block",
                                ag
                                    ? "text-foreground text-left"
                                    : "bg-secondary/30 rounded-2xl px-4 py-3 rounded-tr-[4px] text-left"
                            )}>
                                {msg.content}
                            </div>
                        ) : null
                    )}
                </div>

                {ag && msg.suggestions && showSuggestions && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {msg.suggestions.map((s: any, i: number) => (
                            <SuggestionBubble key={i} label={s.label} onClick={() => onSuggestion(s)} />
                        ))}
                        <button
                            type="button"
                            onClick={() => onSuggestion({ label: "I'm good", action: "dismiss_suggestions" })}
                            className="bg-secondary/40 border border-border hover:bg-secondary text-foreground text-[12px] px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 whitespace-nowrap"
                        >
                            I&apos;m good
                        </button>
                    </div>
                )}

                {ag && msg.type === "text" && (
                    <div className="flex items-center gap-1.5 mt-2">
                        <button
                            type="button"
                            aria-label="Copy response"
                            onClick={() => onCopy && onCopy(msg)}
                            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all flex items-center justify-center"
                        >
                            <Copy size={14} />
                        </button>
                        <button
                            type="button"
                            aria-label="Good response"
                            onClick={() => onFeedback && onFeedback("up", msg)}
                            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all flex items-center justify-center"
                        >
                            <ThumbsUp size={14} />
                        </button>
                        <button
                            type="button"
                            aria-label="Bad response"
                            onClick={() => onFeedback && onFeedback("down", msg)}
                            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all flex items-center justify-center"
                        >
                            <ThumbsDown size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
