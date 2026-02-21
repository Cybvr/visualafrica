"use client";

import { useState, useEffect, useRef } from "react";
import { getVendors, getBlogPosts } from "@/lib/firestore-service";
import { Vendor, BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────

const CITIES = [
    { name: "Lagos", flag: "🇳🇬", vibe: "Afrobeats · Aso-oke · Suya" },
    { name: "Accra", flag: "🇬🇭", vibe: "Highlife · Kente · Jollof" },
    { name: "Nairobi", flag: "🇰🇪", vibe: "Amapiano · Maasai · Nyama choma" },
    { name: "Cape Town", flag: "🇿🇦", vibe: "Amapiano · Ubuntu · Braai" },
];

const CITY_COLORS: Record<string, string> = {
    Lagos: "hsl(var(--primary))",
    Accra: "#E8A020",
    Nairobi: "#A78BFA",
    "Cape Town": "#F472B6",
};

const CAPABILITIES = [
    { id: "create_event", label: "Create Event", icon: "✨" },
    { id: "vendor_search", label: "Vendor Search", icon: "🔍" },
    { id: "rsvp", label: "RSVP Blast", icon: "📨" },
    { id: "budget", label: "Budget Track", icon: "💰" },
];

const VENDOR_ACTIONS = [
    { id: "message", label: "Say Hello", icon: "💬" },
    { id: "contract", label: "Send Paperwork", icon: "📄" },
    { id: "profile", label: "See their story", icon: "👤" },
    { id: "save", label: "Shortlist", icon: "🔖" },
];

// ── Data Helpers ─────────────────────────────────────────

function buildVendorsList(vendors: Vendor[], city: string) {
    return vendors
        .filter(v => v.location.toLowerCase().includes(city.toLowerCase()))
        .map(v => ({
            name: v.name,
            type: v.categories[0],
            tags: v.services.slice(0, 4),
            price: v.price || "Contact for price",
            rating: v.rating,
            status: "Available",
            statusColor: "hsl(var(--primary))",
        }));
}

// ALL_VENDORS will be initialized in the component

// ── Market Data ──────────────────────────────────────────

const MARKET_DATA: Record<string, any> = {
    Accra: {
        greeting: "Accra — perfect. I'm pulling from the Ghanaian vendor network now. Caterers, Highlife DJs, kente decor, venues. What's the event?",
        capabilityResponses: {
            vendor_search: { type: "vendor_cards", city: "Accra", content: "Top vendors available in Accra:", vendors: [] },
            negotiate: {
                type: "action", content: "Negotiating bundle across Accra vendors:", actions: [
                    { label: "Contacting Maame's Kitchen for bulk rate", status: "done" },
                    { label: "Contacting DJ Ohene for package discount", status: "done" },
                    { label: "Requesting 12% bundle across catering + DJ + decor", status: "active" },
                ]
            },
            book: {
                type: "action", content: "Confirming Accra bookings:", actions: [
                    { label: "Sending deposit request to Maame's Kitchen", status: "done" },
                    { label: "Confirming DJ Ohene date hold", status: "active" },
                    { label: "Generating vendor contracts", status: "queued" },
                ]
            },
            rsvp: {
                type: "action", content: "Launching Accra RSVP campaign:", actions: [
                    { label: "Drafting bilingual invite (English + Twi)", status: "done" },
                    { label: "Sending to diaspora community list (340 contacts)", status: "active" },
                    { label: "Setting up RSVP tracking dashboard", status: "queued" },
                ]
            },
            budget: { type: "text", content: "Accra budget summary:\n\nCatering (200 guests): ₵17,000 · DJ: ₵2,200 · Decor: ₵1,200 · Venue (est.): ₵4,500\n\nRunning total: ₵24,900 (~$1,620 USD)\nBundle savings pending — est. ₵2,988 off (12%)." },
        }
    },
    Lagos: {
        greeting: "Lagos — let's go. Tapped into the Lagos vendor network. Suya caterers, Afrobeats DJs, aso-oke stylists, waterfront venues. What are we planning?",
        capabilityResponses: {
            vendor_search: {
                type: "vendor_cards",
                city: "Lagos",
                content: "Top vendors available in Lagos:",
                vendors: [],
                suggestions: [{ label: "Let Ama handle booking", action: "ama_run_vendor_flow" }]
            },
            negotiate: {
                type: "action", content: "Negotiating bundle across Lagos vendors:", actions: [
                    { label: "Contacting Mama Titi's for volume rate", status: "done" },
                    { label: "Contacting DJ Neptune for package deal", status: "done" },
                    { label: "Requesting 10% bundle across catering + DJ + decor", status: "active" },
                ]
            },
            book: {
                type: "action", content: "Confirming Lagos bookings:", actions: [
                    { label: "Sending deposit request to Mama Titi's Kitchen", status: "done" },
                    { label: "Confirming DJ Neptune date hold", status: "active" },
                    { label: "Securing venue deposit — Landmark Centre", status: "queued" },
                ]
            },
            rsvp: {
                type: "action", content: "Launching Lagos RSVP campaign:", actions: [
                    { label: "Drafting bilingual invite (English + Yoruba)", status: "done" },
                    { label: "Sending to diaspora community list (410 contacts)", status: "active" },
                    { label: "Setting up RSVP tracking link", status: "queued" },
                ]
            },
            budget: { type: "text", content: "Lagos budget summary:\n\nCatering (300 guests): ₦1,350,000 · DJ: ₦180,000 · Decor: ₦85,000 · Venue (est.): ₦850,000\n\nRunning total: ₦2,465,000 (~$1,540 USD)\nBundle savings pending — est. ₦246,500 off (10%)." },
        }
    },
    Nairobi: {
        greeting: "Nairobi — great choice. Into the Kenyan vendor network now. Nyama choma caterers, Gengetone & Amapiano DJs, Maasai-inspired decor. What are we building?",
        capabilityResponses: {
            vendor_search: { type: "vendor_cards", city: "Nairobi", content: "Top vendors available in Nairobi:", vendors: [] },
            negotiate: {
                type: "action", content: "Negotiating bundle across Nairobi vendors:", actions: [
                    { label: "Contacting Nyama Choma Kings for group rate", status: "done" },
                    { label: "Requesting DJ + decor package discount", status: "active" },
                    { label: "Targeting 12% bundle saving", status: "queued" },
                ]
            },
            book: {
                type: "action", content: "Confirming Nairobi bookings:", actions: [
                    { label: "Assigning local on-ground coordinator", status: "done" },
                    { label: "Sending deposit to Nyama Choma Kings", status: "active" },
                    { label: "Confirming venue — Nairobi Safari Club Gardens", status: "queued" },
                ]
            },
            rsvp: {
                type: "action", content: "Launching Nairobi RSVP campaign:", actions: [
                    { label: "Drafting trilingual invite (English + Swahili + Kikuyu)", status: "done" },
                    { label: "Sending to diaspora community list (290 contacts)", status: "active" },
                    { label: "Setting up RSVP tracking dashboard", status: "queued" },
                ]
            },
            budget: { type: "text", content: "Nairobi budget summary:\n\nCatering (150 guests): KSh 420,000 · DJ: KSh 55,000 · Decor: KSh 22,000 · Venue (est.): KSh 120,000\n\nRunning total: KSh 617,000 (~$4,750 USD)\nBundle savings pending — est. KSh 74,000 off." },
        }
    },
    "Cape Town": {
        greeting: "Cape Town — on it. Into the South African vendor network. Braai caterers, Amapiano DJs, Cape Malay & Pan-African decor, estate venues. What's the event?",
        capabilityResponses: {
            vendor_search: { type: "vendor_cards", city: "Cape Town", content: "Top vendors available in Cape Town:", vendors: [] },
            negotiate: {
                type: "action", content: "Negotiating bundle across Cape Town vendors:", actions: [
                    { label: "Contacting Braai Masters for group rate", status: "done" },
                    { label: "Requesting DJ + decor bundle", status: "active" },
                    { label: "Targeting 10% saving across all three", status: "queued" },
                ]
            },
            book: {
                type: "action", content: "Confirming Cape Town bookings:", actions: [
                    { label: "Sending deposit to Braai Masters CT", status: "done" },
                    { label: "Confirming DJ Bongani date hold", status: "active" },
                    { label: "Securing Groot Constantia Lawns deposit", status: "queued" },
                ]
            },
            rsvp: {
                type: "action", content: "Launching Cape Town RSVP campaign:", actions: [
                    { label: "Drafting invite (English + Zulu + Afrikaans)", status: "done" },
                    { label: "Sending to diaspora community list (260 contacts)", status: "active" },
                    { label: "Setting up RSVP tracking dashboard", status: "queued" },
                ]
            },
            budget: { type: "text", content: "Cape Town budget summary:\n\nCatering (150 guests): R48,000 · DJ: R4,500 · Decor: R12,000 · Venue (est.): R22,000\n\nRunning total: R86,500 (~$4,700 USD)\nBundle savings pending — est. R8,650 off (10%)." },
        }
    }
};

// ── Ama Lagos Booking Flow Data ──────────────────────────

const AMA_LAGOS_FLOW = {
    searchSummary: "searching vendors in Lagos · Feb 7–9 · 12 people · ₦2M budget...",
    initialRows: [
        { activity: "Spa", vendor: "Zen Spa VI", price: "₦180k", status: "Quote requested" },
        { activity: "Dinner", vendor: "Nok by Alara", price: "₦350k", status: "Quote requested" },
        { activity: "Boat", vendor: "Lagos Boat Club", price: "₦600k", status: "Quote requested" },
    ],
    initialAllocated: "₦1.13M",
    initialRemaining: "₦870k",
    updateRows: [
        { vendor: "Zen Spa VI", details: "₦180k · Feb 7, 10am–2pm · confirmed" },
        { vendor: "Lagos Boat Club", details: "₦620k · Feb 8, 5–9pm · confirmed (sunset slot, ₦20k over original quote)" },
    ],
    backupVendor: "Cécil Restaurant — Private terrace · seats 16 · Feb 8 available · ₦280k",
    itineraryRows: [
        { time: "Feb 7, 10am", activity: "Spa Day", vendor: "Zen Spa VI", cost: "₦180k" },
        { time: "Feb 8, 7pm", activity: "Dinner", vendor: "Cécil Restaurant", cost: "₦280k" },
        { time: "Feb 8, 5pm", activity: "Boat Party", vendor: "Lagos Boat Club", cost: "₦620k" },
    ],
    finalTotal: "₦1.08M",
    finalRemaining: "₦920k",
};

// ── Initial Messages ─────────────────────────────────────

const INITIAL_MESSAGES = [
    {
        id: 1,
        role: "agent",
        type: "text",
        content: "Hi, I'm ama, your diaspora event agent. I find vendors, negotiate deals, manage bookings, and coordinate events. What would you like to do? ✨",
        time: "9:01 AM",
        suggestions: [
            { label: "Create Event", action: "start_planning" },
            { label: "Vendor Search", action: "start_vendor_search" },
            { label: "RSVP Blast", action: "capability", capId: "rsvp" }
        ]
    }
];

// ── UI Components ────────────────────────────────────────

function Dots() {
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
            className="bg-card border border-border hover:border-primary/50 text-foreground text-[12px] px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 shadow-sm whitespace-nowrap"
        >
            {label}
        </button>
    );
}

function KnowledgeCard({ item }: { item: any }) {
    const isBlog = !!item.author;
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm max-w-[280px]">
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

function EventForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [data, setData] = useState({ name: "", guests: "", budget: "" });
    return (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm max-w-[300px] w-full space-y-3">
            <div className="text-[13px] font-bold text-foreground">Almost there! Just the basics:</div>
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="Event Name (e.g. Ama's 30th)"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Guest Count"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                    value={data.guests}
                    onChange={e => setData({ ...data, guests: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Budget (e.g. $5k)"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                    value={data.budget}
                    onChange={e => setData({ ...data, budget: e.target.value })}
                />
            </div>
            <button
                onClick={() => onSubmit(data)}
                disabled={!data.name || !data.guests || !data.budget}
                className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg text-sm transition-all active:scale-95 disabled:opacity-50"
            >
                Create Event
            </button>
        </div>
    );
}

function CalendarPicker({ onSelect }: { onSelect: (date: string) => void }) {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const [selected, setSelected] = useState<number | null>(null);
    return (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm max-w-[300px] w-full">
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

function CityPicker({ onSelect, activeCity }: { onSelect: (city: string) => void; activeCity: string | null }) {
    return (
        <div className="flex flex-col gap-2 max-w-[300px]">
            {CITIES.map(c => {
                const isActive = activeCity === c.name;
                return (
                    <button key={c.name} onClick={() => onSelect(c.name)}
                        className={cn(
                            "flex items-center gap-3 transition-all duration-200 outline-none text-left rounded-xl px-3.5 py-2.5 border",
                            isActive ? "bg-primary/10 border-primary" : "bg-card border-border hover:border-primary/30"
                        )}
                        style={isActive ? { cursor: 'default' } : { cursor: 'pointer' }}
                    >
                        <span className="text-2xl flex-shrink-0">{c.flag}</span>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-[13px] font-bold", isActive ? "text-primary" : "text-foreground")}>{c.name}</span>
                                {isActive && <span className="text-[10px] font-bold font-mono text-primary">● ACTIVE</span>}
                            </div>
                            <div className="text-muted-foreground text-[11px] mt-0.5">{c.vibe}</div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

function VendorActionMenu({ vendor, onClose, onSave, isSaved, onAction }: { vendor: any; onClose: () => void; onSave: (v: any) => void; isSaved: boolean; onAction: (a: any, v: any) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handle(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [onClose]);

    return (
        <div ref={ref} className="absolute top-full left-0 right-0 z-[100] bg-card border border-border rounded-xl overflow-hidden shadow-2xl mt-1">
            {VENDOR_ACTIONS.map((action, i) => {
                const isLast = i === VENDOR_ACTIONS.length - 1;
                const isSaveAction = action.id === "save";
                return (
                    <button key={action.id} onClick={() => { onAction(action, vendor); if (isSaveAction) onSave(vendor); }}
                        className={cn(
                            "flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left text-[13px] transition-colors",
                            isSaveAction && isSaved ? "text-primary" : "text-foreground",
                            !isLast && "border-b border-border"
                        )}
                        onMouseEnter={e => e.currentTarget.classList.add('bg-muted')}
                        onMouseLeave={e => e.currentTarget.classList.remove('bg-muted')}
                    >
                        <span className="text-base">{isSaveAction && isSaved ? "🔖" : action.icon}</span>
                        <span>{isSaveAction && isSaved ? "Saved to list" : action.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

function VCard({ v, savedVendors, onSave, onAction }: { v: any; savedVendors: Set<string>; onSave: (v: any) => void; onAction: (a: any, v: any) => void }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const isSaved = savedVendors.has(v.name);

    return (
        <div className="relative">
            <div
                onClick={() => setMenuOpen(o => !o)}
                className={cn(
                    "bg-card border transition-all duration-150 rounded-xl p-3 mb-2 cursor-pointer select-none",
                    menuOpen ? "border-muted-foreground/30" : "border-border"
                )}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-foreground font-bold text-sm">{v.name}</div>
                        <div className="text-muted-foreground text-[11px]">{v.type}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {isSaved && <span className="text-primary text-sm">🔖</span>}
                        <span className="bg-primary/10 text-primary text-[11px] font-semibold rounded-full px-2 py-0.5">{v.status}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                    {v.tags.map((t: string) => <span key={t} className="bg-secondary text-muted-foreground text-[11px] rounded px-1.5 py-0.5">{t}</span>)}
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-primary font-bold text-sm">{v.price}</span>
                    <span className="text-foreground text-xs">⭐ {v.rating}</span>
                </div>
            </div>
            {menuOpen && (
                <VendorActionMenu
                    vendor={v}
                    onClose={() => setMenuOpen(false)}
                    onSave={onSave}
                    isSaved={isSaved}
                    onAction={(action, vendor) => { onAction(action, vendor); if (action.id !== "save") setMenuOpen(false); }}
                />
            )}
        </div>
    );
}

function VendorCardMsg({ msg, savedVendors, onSave, onVendorAction, activeCity, allVendorsByCity }: { msg: any; savedVendors: Set<string>; onSave: (v: any) => void; onVendorAction: (a: any, v: any) => void; activeCity: string | null, allVendorsByCity: Record<string, any[]> }) {
    const allForCity = activeCity ? allVendorsByCity[activeCity] || [] : [];
    const [expanded, setExpanded] = useState(false);
    const shown = expanded ? allForCity : msg.vendors;
    const hasMore = allForCity.length > msg.vendors.length;

    return (
        <div style={{ width: "100%" }}>
            <div style={{ background: "#1A1A26", border: "1px solid #2A2A42", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", marginBottom: 6 }}>
                {msg.city && <CityBadge city={msg.city} />}
                <div style={{ color: "#F0EDE6", fontSize: 14 }}>{msg.content}</div>
            </div>
            {shown.map((v: any) => (
                <VCard key={v.name} v={v} savedVendors={savedVendors} onSave={onSave} onAction={onVendorAction} />
            ))}
            {hasMore && (
                <button onClick={() => setExpanded(e => !e)} style={{
                    width: "100%", padding: "9px", marginTop: 4, marginBottom: 8,
                    background: "#1A1A26", border: "1px dashed #2A2A42",
                    borderRadius: 10, color: "#7A7A9A", fontSize: 12,
                    cursor: "pointer", fontFamily: "monospace", transition: "all 0.15s"
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8A020"; e.currentTarget.style.color = "#E8A020"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#2A2A42"; e.currentTarget.style.color = "#7A7A9A"; }}
                >
                    {expanded ? "▲ Show less" : `▼ View more vendors (${allForCity.length - msg.vendors.length} more)`}
                </button>
            )}
        </div>
    );
}

function Step({ a }: { a: any }) {
    const m = { done: { i: "✓", c: "#20C9A0" }, active: { i: "◌", c: "#E8A020" }, queued: { i: "○", c: "#3A3A5A" } };
    const { i, c } = m[a.status as 'done' | 'active' | 'queued'] || { i: "○", c: "#3A3A5A" };
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: c + "22", color: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i}</span>
            <span style={{ color: a.status === "queued" ? "#3A3A5A" : a.status === "done" ? "#A0A0C0" : "#F0EDE6", fontSize: 13 }}>{a.label}</span>
        </div>
    );
}

function AmaFlowCard({ msg }: { msg: any }) {
    const tableHeaders = msg.columns || [];
    const tableRows = msg.rows || [];
    return (
        <div className="bg-card/90 border border-border rounded-2xl p-3.5 shadow-sm w-full space-y-2.5">
            {msg.kicker && <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-bold">{msg.kicker}</div>}
            {msg.content && <div className="text-foreground text-[13px] leading-relaxed whitespace-pre-line">{msg.content}</div>}
            {msg.meta && <div className="text-[12px] text-primary font-medium">{msg.meta}</div>}

            {tableHeaders.length > 0 && tableRows.length > 0 && (
                <div className="rounded-xl border border-border overflow-hidden">
                    <div
                        className="grid bg-secondary/60 px-2.5 py-2 text-[11px] font-bold text-muted-foreground"
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

            {msg.footer && <div className="text-[12px] text-muted-foreground font-medium">{msg.footer}</div>}
        </div>
    );
}

// ── Msg Component ────────────────────────────────────────
// Each message type is handled explicitly with its own typed callback.

interface MsgProps {
    msg: any;
    onSelectCity: (city: string) => void;
    activeCity: string | null;
    savedVendors: Set<string>;
    onSave: (v: any) => void;
    onVendorAction: (a: any, v: any) => void;
    onFormSubmit: (data: any) => void;
    onCalendarSelect: (date: string) => void;
    onSuggestion: (s: any) => void;
    allVendorsByCity: Record<string, any[]>;
}

function Msg({ msg, onSelectCity, activeCity, savedVendors, onSave, onVendorAction, onFormSubmit, onCalendarSelect, onSuggestion, allVendorsByCity }: MsgProps) {
    const ag = msg.role === "agent";
    return (
        <div className={cn("flex gap-2 mb-4", ag ? "flex-row items-end" : "flex-row-reverse items-end")}>
            {ag && (
                <img
                    src="/images/ama.png"
                    alt="Ama"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 shadow-sm"
                />
            )}
            <div className={cn("max-w-[85%] flex flex-col", ag ? "items-start" : "items-end")}>
                {msg.type === "city_picker" ? (
                    <CityPicker onSelect={onSelectCity} activeCity={activeCity} />
                ) : msg.type === "thinking" ? (
                    <div className="bg-secondary/50 border border-dashed border-border rounded-2xl p-3 shadow-inner">
                        <Dots /><div className="mt-1.5 text-muted-foreground text-xs italic">{msg.content}</div>
                    </div>
                ) : msg.type === "vendor_cards" ? (
                    <VendorCardMsg msg={msg} savedVendors={savedVendors} onSave={onSave} onVendorAction={onVendorAction} activeCity={activeCity} allVendorsByCity={allVendorsByCity} />
                ) : msg.type === "action" ? (
                    <div className="bg-card/80 border border-border rounded-2xl p-3.5 shadow-sm w-full">
                        <div className="text-foreground text-[13px] font-medium mb-2.5">{msg.content}</div>
                        {msg.actions.map((a: any, idx: number) => <Step key={idx} a={a} />)}
                    </div>
                ) : msg.type === "ama_flow_card" ? (
                    <AmaFlowCard msg={msg} />
                ) : msg.type === "knowledge" ? (
                    <div className="space-y-2">
                        {msg.content && <div className="bg-card border border-border rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed shadow-sm rounded-bl-none text-foreground">{msg.content}</div>}
                        <KnowledgeCard item={msg.data} />
                    </div>
                ) : msg.type === "event_form" ? (
                    <div className="space-y-2">
                        {msg.content && <div className="bg-card border border-border rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed shadow-sm rounded-bl-none text-foreground">{msg.content}</div>}
                        <EventForm onSubmit={onFormSubmit} />
                    </div>
                ) : msg.type === "calendar_picker" ? (
                    <div className="space-y-2">
                        {msg.content && <div className="bg-card border border-border rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed shadow-sm rounded-bl-none text-foreground">{msg.content}</div>}
                        <CalendarPicker onSelect={onCalendarSelect} />
                    </div>
                ) : msg.content ? (
                    <div className={cn(
                        "rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed shadow-sm min-w-[50px] whitespace-pre-line",
                        ag ? "bg-card border border-border rounded-bl-none text-foreground" : "bg-primary text-primary-foreground rounded-br-none"
                    )}>{msg.content}</div>
                ) : null}

                {ag && msg.suggestions && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.suggestions.map((s: any, i: number) => (
                            <SuggestionBubble key={i} label={s.label} onClick={() => onSuggestion(s)} />
                        ))}
                    </div>
                )}

                {msg.time && <div className="text-[10px] text-muted-foreground/60 mt-1 uppercase font-bold tracking-tighter">{msg.time}</div>}
            </div>
        </div>
    );
}

// ── App ──────────────────────────────────────────────────

export default function App() {
    const [allVendors, setAllVendors] = useState<Vendor[]>([]);
    const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
    const [marketData, setMarketData] = useState<Record<string, any>>(MARKET_DATA);
    const [allVendorsByCity, setAllVendorsByCity] = useState<Record<string, any[]>>({});
    const [messages, setMessages] = useState<any[]>(INITIAL_MESSAGES as any[]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [activeCity, setActiveCity] = useState<string | null>(null);
    const [savedVendors, setSavedVendors] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        async function loadData() {
            try {
                const [v, b] = await Promise.all([getVendors(), getBlogPosts()]);
                setAllVendors(v);
                setAllBlogPosts(b);

                const cities = ["Lagos", "Accra", "Nairobi", "Cape Town"];
                const vendorsByCity: Record<string, any[]> = {};
                cities.forEach(city => {
                    vendorsByCity[city] = buildVendorsList(v, city);
                });
                setAllVendorsByCity(vendorsByCity);

                // Update marketData with real vendors
                const updatedMarketData = { ...MARKET_DATA };
                cities.forEach(city => {
                    if (updatedMarketData[city]) {
                        updatedMarketData[city].capabilityResponses.vendor_search.vendors = vendorsByCity[city].slice(0, 3);
                    }
                });
                setMarketData(updatedMarketData);

            } catch (error) {
                console.error("Error loading Ama data:", error);
            }
        }
        loadData();
    }, []);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

    const market = activeCity ? marketData[activeCity] : null;

    if (!mounted) return null;

    const onVendorAction = (a: any, v: any) => handleVendorAction(a, v);
    const onSave = (v: any) => handleSaveVendor(v);

    // ── Message helpers ──────────────────────────────────

    const now = () => new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });

    const addMsg = (msg: any) => setMessages(prev => [...prev, { id: Date.now(), time: now(), ...msg }]);

    const addUserMsg = (content: string) => addMsg({ role: "user", type: "text", content });

    const addAgentMsg = (msg: any) => addMsg({ role: "agent", ...msg });

    const withTyping = (delayMs: number, fn: () => void) => {
        setTyping(true);
        setTimeout(() => { setTyping(false); fn(); }, delayMs);
    };

    // ── Vendor handlers ──────────────────────────────────

    const handleSaveVendor = (vendor: any) => {
        setSavedVendors(prev => {
            const next = new Set(prev);
            next.has(vendor.name) ? next.delete(vendor.name) : next.add(vendor.name);
            return next;
        });
    };

    const handleVendorAction = (action: any, vendor: any) => {
        if (action.id === "save") return;
        const responses: Record<string, any> = {
            message: {
                type: "action", content: `Sending message to ${vendor.name}:`, actions: [
                    { label: `Opening message thread with ${vendor.name}`, status: "done" },
                    { label: "Attaching event brief", status: "active" },
                ]
            },
            contract: {
                type: "action", content: `Sending contract to ${vendor.name}:`, actions: [
                    { label: "Generating standard vendor contract", status: "done" },
                    { label: `Sending to ${vendor.name} for e-signature`, status: "active" },
                    { label: "Setting signature reminder (48hr)", status: "queued" },
                ]
            },
            negotiate: {
                type: "action", content: `Negotiating with ${vendor.name}:`, actions: [
                    { label: `Reviewing ${vendor.name}'s rate card`, status: "done" },
                    { label: "Sending counter-offer (10–15% off)", status: "active" },
                    { label: "Awaiting response", status: "queued" },
                ]
            },
            profile: { type: "text", content: `${vendor.name}\n\n${vendor.type} · ${vendor.rating}⭐ · ${vendor.price}\nTags: ${vendor.tags.join(", ")}\nStatus: ${vendor.status}\n\nFull profile, past events, and reviews available in the vendor directory.` },
        };
        const r = responses[action.id];
        if (!r) return;
        addUserMsg(`${action.label} — ${vendor.name}`);
        addAgentMsg(r);
    };

    // ── City selection ───────────────────────────────────

    const handleSelectCity = (cityName: string) => {
        if (activeCity === cityName) return;
        setActiveCity(cityName);
        const data = MARKET_DATA[cityName];
        addAgentMsg({
            type: "text",
            content: data.greeting,
            suggestions: [
                { label: "🔍 Show me vendors", action: "vendor_search" },
                { label: "📖 See the local guide", action: "show_guide", city: cityName },
                { label: "✨ Start Planning", action: "start_planning", city: cityName }
            ]
        });
    };

    // ── Capability handler ───────────────────────────────

    const handleCapability = (cap: any) => {
        if (!cap) return;

        if (!market) {
            setMessages(prev => {
                if (prev.some(m => m.type === "city_picker")) return prev;
                return [
                    ...prev,
                    { id: Date.now(), role: "agent", type: "text", content: "Where is the event? Pick a city first.", time: now() },
                    { id: Date.now() + 1, role: "agent", type: "city_picker", content: null, time: now() }
                ];
            });
            return;
        }

        if (cap.id === "create_event") {
            handleSuggestion({ action: "start_planning", city: activeCity });
            return;
        }

        const labels: Record<string, string> = {
            vendor_search: `Find vendors in ${activeCity}`,
            negotiate: `Negotiate deals in ${activeCity}`,
            book: `Book & confirm in ${activeCity}`,
            rsvp: `Send RSVP blast for ${activeCity} event`,
            budget: `Show ${activeCity} budget breakdown`
        };
        addUserMsg(labels[cap.id] || `Run ${cap.id}`);
        withTyping(1400, () => {
            const r = market.capabilityResponses[cap.id];
            addAgentMsg(r);
        });
    };

    // ── Ama booking flow ─────────────────────────────────

    const startAmaVendorFlow = () => {
        addAgentMsg({
            type: "ama_flow_card",
            kicker: "Ama",
            content: `On it.\n${AMA_LAGOS_FLOW.searchSummary}\n\nFound 3 vendors. Quote requests sent.`,
            columns: ["Activity", "Vendor", "Price", "Status"],
            rows: AMA_LAGOS_FLOW.initialRows.map(r => [r.activity, r.vendor, r.price, r.status]),
            meta: `Allocated: ${AMA_LAGOS_FLOW.initialAllocated} · Remaining: ${AMA_LAGOS_FLOW.initialRemaining}`,
            footer: "Watching all three. If anyone goes quiet past 6hrs I'll pull in a replacement and let you know.",
            suggestions: [
                { label: "Swap a Vendor", action: "ama_swap_vendor" },
                { label: "Add Activity", action: "ama_add_activity" },
            ],
        });

        withTyping(1800, () => {
            addAgentMsg({
                type: "ama_flow_card",
                kicker: "3hrs later — Ama pings you",
                content: "2 of 3 quotes in.",
                columns: ["Vendor", "Update"],
                rows: AMA_LAGOS_FLOW.updateRows.map(r => [r.vendor, r.details]),
                footer: "Nok by Alara hasn't responded. I've already contacted Cécil Restaurant as backup — waiting on their quote.\nContracts for Spa and Boat are ready to review.",
                suggestions: [
                    { label: "Approve Spa + Boat", action: "ama_approve_spa_boat" },
                    { label: "Reject Boat Price", action: "ama_reject_boat_price" },
                    { label: "See Cécil Details", action: "ama_see_cecil" },
                ],
            });
        });
    };

    // ── Free-text send ───────────────────────────────────

    const send = (text: string) => {
        if (!text.trim()) return;
        addUserMsg(text);
        setInput("");
        withTyping(1200, () => {
            const reply = market
                ? { type: "text", content: `On it — checking ${activeCity} vendors for that now.` }
                : { type: "text", content: "Sure — just pick a city first so I can pull the right vendor network." };
            addAgentMsg(reply);
        });
    };

    // ── Form & calendar handlers ─────────────────────────

    const handleCalendarSelect = (date: string) => {
        withTyping(800, () => {
            addAgentMsg({
                type: "event_form",
                content: `Perfect. I've noted down ${date}. One last step to get you accurate quotes:`,
            });
        });
    };

    const handleFormSubmit = (data: any) => {
        withTyping(1500, () => {
            addAgentMsg({
                type: "text",
                content: `Done! ${data.name} is now on my radar for ${activeCity}. I've pencilled in a budget of ${data.budget} for ${data.guests} guests. \n\nI'm reaching out to vendors now to get initial quotes based on your date. 🚀`,
                suggestions: [
                    { label: "🔍 Show me matching vendors", action: "vendor_search" },
                    { label: "💰 Review budget breakdown", action: "capability", capId: "budget" },
                    ...(activeCity === "Lagos" ? [{ label: "Let Ama handle booking", action: "ama_run_vendor_flow" }] : []),
                ]
            });
        });
    };

    // ── Suggestion dispatch map ──────────────────────────
    // Each action string maps to a focused handler. No more if/else chains.

    const SUGGESTION_HANDLERS: Record<string, (s: any) => void> = {
        // Open city picker then search vendors
        start_vendor_search: () => {
            addAgentMsg({ type: "city_picker", content: "Sure, let's find some vendors. Which city are we looking at?" });
        },

        // Shortcut: vendor_search = run vendor_search capability
        vendor_search: () => handleCapability(CAPABILITIES.find(c => c.id === "vendor_search")),

        // Show calendar → form → confirmation
        start_planning: (s) => {
            withTyping(800, () => {
                const venue = s.city === "Lagos" ? "Lekki Terrace" : s.city === "Accra" ? "Labadi Beach" : s.city === "Nairobi" ? "Safari Club" : "the estate";
                addAgentMsg({ type: "calendar_picker", content: `Pick a date and I'll check availability for ${venue}...` });
            });
        },

        // Show local blog guide
        show_guide: (s) => {
            withTyping(1000, () => {
                const guide = allBlogPosts.find(b => b.title.toLowerCase().includes(s.city.toLowerCase())) || allBlogPosts[1];
                addAgentMsg({
                    type: "knowledge",
                    content: `Here's the inside scoop on ${s.city}. We've vetted these spots specifically for the diaspora community.`,
                    data: guide,
                    suggestions: [
                        { label: "🔍 Now find vendors", action: "vendor_search" },
                        { label: "💰 Help with budget", action: "capability", capId: "budget" },
                        { label: "✨ Start Planning", action: "start_planning", city: s.city }
                    ]
                });
            });
        },

        // Run a named capability (rsvp, budget, etc.)
        capability: (s) => handleCapability(CAPABILITIES.find(c => c.id === s.capId)),

        // Hand off to Ama's full booking flow
        ama_run_vendor_flow: (s) => {
            addUserMsg(s.label || "Let Ama handle booking");
            startAmaVendorFlow();
        },

        // Ama flow: swap a vendor
        ama_swap_vendor: () => {
            addUserMsg("Swap a Vendor");
            addAgentMsg({ type: "text", content: "Swapping now. I'll keep Zen Spa VI and Lagos Boat Club, then source one dinner replacement under ₦350k." });
        },

        // Ama flow: add an activity
        ama_add_activity: () => {
            addUserMsg("Add Activity");
            addAgentMsg({ type: "text", content: "Send me the activity type and ideal time window. I'll source options and fit it into the current budget." });
        },

        // Ama flow: approve spa + boat, show Cécil backup
        ama_approve_spa_boat: () => {
            addUserMsg("Approve Spa + Boat · See Cécil Details");
            addAgentMsg({
                type: "ama_flow_card",
                kicker: "Ama",
                content: "Spa and Boat locked. Deposit reminders scheduled. Both vendors have been sent the weekend timeline.",
                columns: ["Backup Option", "Details"],
                rows: [["Cécil Restaurant", "Private terrace · seats 16 · Feb 8 available · ₦280k"]],
                footer: "₦70k cheaper than Nok. I'd book it.",
                suggestions: [
                    { label: "Book Cécil", action: "ama_book_cecil" },
                    { label: "Wait for Nok", action: "ama_wait_for_nok" },
                    { label: "See Other Options", action: "ama_other_options" },
                ]
            });
        },

        // Ama flow: reject boat price, push back
        ama_reject_boat_price: () => {
            addUserMsg("Reject Boat Price");
            addAgentMsg({
                type: "text",
                content: "I pushed back on the ₦20k increase and asked for either the original ₦600k or added value. I'll update you once they respond.",
                suggestions: [
                    { label: "See Cécil Details", action: "ama_see_cecil" },
                    { label: "Approve Spa + Boat", action: "ama_approve_spa_boat" },
                ],
            });
        },

        // Ama flow: show Cécil backup details
        ama_see_cecil: () => {
            addUserMsg("See Cécil Details");
            addAgentMsg({
                type: "ama_flow_card",
                kicker: "Ama",
                content: AMA_LAGOS_FLOW.backupVendor,
                footer: "₦70k cheaper than Nok. I'd book it.",
                suggestions: [
                    { label: "Book Cécil", action: "ama_book_cecil" },
                    { label: "Wait for Nok", action: "ama_wait_for_nok" },
                    { label: "See Other Options", action: "ama_other_options" },
                ],
            });
        },

        // Ama flow: book Cécil → final itinerary
        ama_book_cecil: () => {
            addUserMsg("Book Cécil");
            addAgentMsg({
                type: "ama_flow_card",
                kicker: "Ama",
                content: "All three vendors confirmed. Here's your weekend.",
                columns: ["Time", "Activity", "Vendor", "Cost"],
                rows: AMA_LAGOS_FLOW.itineraryRows.map(r => [r.time, r.activity, r.vendor, r.cost]),
                meta: `Total: ${AMA_LAGOS_FLOW.finalTotal} · Remaining: ${AMA_LAGOS_FLOW.finalRemaining}`,
                footer: "Monitoring all vendors until event day. I'll flag anything that changes.",
                suggestions: [
                    { label: "Share Itinerary", action: "text_reply", text: "Share the itinerary with my group." },
                    { label: "Add Activity", action: "ama_add_activity" },
                    { label: "View Contracts", action: "text_reply", text: "Show me the contracts for all confirmed vendors." },
                ],
            });
        },

        // Ama flow: wait for Nok's response
        ama_wait_for_nok: () => {
            addUserMsg("Wait for Nok");
            addAgentMsg({ type: "text", content: "Understood. I'll hold Cécil as backup for now and keep chasing Nok for a final quote." });
        },

        // Ama flow: see other dinner options
        ama_other_options: () => {
            addUserMsg("See Other Options");
            addAgentMsg({ type: "text", content: "I'll pull two more dinner options in Victoria Island with private seating for 12–16 guests under ₦320k." });
        },

        // Send a pre-filled text message
        text_reply: (s) => send(s.text),
    };

    const handleSuggestion = (s: any) => {
        const handler = SUGGESTION_HANDLERS[s.action];
        if (handler) handler(s);
    };

    // ── Render ───────────────────────────────────────────

    return (
        <div className="bg-background h-[calc(100dvh-5.5rem)] sm:h-[calc(100dvh-6rem)] md:h-[calc(100dvh-9rem)] flex flex-col overflow-hidden">
            <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        textarea:focus{outline:none}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:hsl(var(--border));border-radius:4px}
        button:hover{opacity:0.85}
      `}</style>

            {/* Header */}
            <div className="bg-card border-b border-border px-2.5 py-2 sm:p-3 flex-shrink-0 flex items-center gap-2.5">
                <img
                    src="/images/ama.png"
                    alt="Ama"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-lg"
                />
                <div className="flex-1">
                    <div className="text-foreground font-bold text-sm">Ama</div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-foreground text-[10px] uppercase tracking-wider font-bold">Active · Diaspora Agent</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {savedVendors.size > 0 && (
                        <div className="flex items-center gap-1.5 bg-secondary border border-border rounded-full px-2.5 py-1 shadow-sm">
                            <span className="text-xs">🔖</span>
                            <span className="text-foreground text-[10px] font-bold uppercase">{savedVendors.size} saved</span>
                        </div>
                    )}
                    {activeCity && (
                        <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-foreground text-[11px] font-bold uppercase tracking-tight">{activeCity}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 space-y-3 sm:space-y-4">
                {messages.map(m => (
                    <Msg
                        key={m.id}
                        msg={m}
                        onSelectCity={handleSelectCity}
                        activeCity={activeCity}
                        savedVendors={savedVendors}
                        onSave={handleSaveVendor}
                        onVendorAction={handleVendorAction}
                        onFormSubmit={handleFormSubmit}
                        onCalendarSelect={handleCalendarSelect}
                        onSuggestion={handleSuggestion}
                        allVendorsByCity={allVendorsByCity}
                    />
                ))}
                {typing && (
                    <div className="flex items-end gap-2 text-foreground">
                        <img
                            src="/images/ama.png"
                            alt="Ama"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 outline outline-2 outline-primary/20"
                        />
                        <div className="bg-secondary border border-border rounded-2xl rounded-bl-none p-3 shadow-sm"><Dots /></div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="bg-background border-t border-border p-2.5 pb-3 sm:p-3 sm:pb-4 flex-shrink-0">
                <div className="flex gap-2 bg-secondary/50 border border-border rounded-2xl p-2 items-end focus-within:border-primary/50 transition-colors shadow-inner">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                        placeholder={market ? `Message Ama about your ${activeCity} event...` : "Message Ama — or select a city..."}
                        rows={1}
                        className="flex-1 bg-transparent border-none text-foreground text-sm resize-none leading-relaxed px-2 py-1 placeholder:text-muted-foreground/50"
                    />
                    <button onClick={() => send(input)} className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all transform active:scale-90 shadow-md",
                        input.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground opacity-50"
                    )}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
