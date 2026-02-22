"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getVendors, getBlogPosts, getEvents } from "@/lib/firestore-service";
import { Vendor, BlogPost, SharedEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import ChatHeader from "@/components/dashboard/ChatHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/dashboard/Sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Plus, ChevronDown, Mic, ArrowRight, MapPin } from "lucide-react";
import Link from 'next/link';

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
    { id: "budget", label: "Budget", icon: "💰" },
    { id: "create_event", label: "Create", icon: "✨" },
    { id: "vendor_search", label: "Discover", icon: "🔍" },
    { id: "rsvp", label: "Track", icon: "📨" },
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
            slug: v.slug || v.id,
            type: v.categories[0],
            tags: v.services.slice(0, 4),
            price: v.price || "Contact for price",
            rating: v.rating,
            status: "Available",
            statusColor: "hsl(var(--primary))",
        }));
}

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

// ── Initial Messages ─────────────────────────────────────

const INITIAL_MESSAGES: any[] = [
    {
        id: 1,
        role: "agent",
        type: "text",
        content: "Hi! I'm Ama, your AI event coordinator. How can I help you today?",
        suggestions: [
            { label: "Budget", action: "capability", capId: "budget" },
            { label: "Create", action: "start_planning" },
            { label: "Discover", action: "start_vendor_search" },
            { label: "Track", action: "capability", capId: "rsvp" }
        ],
        time: new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })
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
            className="bg-card border border-border hover:border-primary/50 text-foreground text-[12px] px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95  whitespace-nowrap"
        >
            {label}
        </button>
    );
}

function VCard({ v, savedVendors, onSave, onVendorAction }: { v: any; savedVendors: Set<string>; onSave: (v: any) => void; onVendorAction: (a: any, v: any) => void }) {
    const isSaved = savedVendors.has(v.name);
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
                        <div className="text-foreground font-bold text-sm group-hover:text-primary transition-colors">{v.name}</div>
                        <div className="text-muted-foreground text-[11px]">{v.type}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {isSaved && <span className="text-primary text-sm">🔖</span>}
                        <span className="bg-primary/10 text-primary text-[11px] font-semibold rounded-full px-2 py-0.5">{v.status}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                    {v.tags.map((t: string) => <span key={t} className="bg-secondary text-muted-foreground text-[11px] rounded px-1.5 py-0.5">{t}</span>)}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-primary font-bold text-sm">{v.price}</span>
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
                            <span className="text-[14px]">💬</span> <span className="hidden sm:inline">Message</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onVendorAction && onVendorAction({ id: 'contract' }, v); }}
                            className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none">
                            <span className="text-[14px]">📄</span> <span className="hidden sm:inline">Brief</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onSave(v); }}
                            className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none">
                            <span className="text-[14px]">🔖</span> <span className="hidden sm:inline">Save</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <Link
                            href={`/dashboard/hosts/vendor/${v.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-[11px] font-semibold py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all flex justify-center items-center gap-1.5 leading-none">
                            <span className="text-[14px]">👤</span> <span className="hidden sm:inline">View</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function VendorCardMsg({ msg, savedVendors, onSave, onVendorAction, activeCity, allVendorsByCity }: { msg: any; savedVendors: Set<string>; onSave: (v: any) => void; onVendorAction: (a: any, v: any) => void; activeCity: string | null, allVendorsByCity: Record<string, any[]> }) {
    const targetCity = msg.city || activeCity;
    const allForCity = targetCity ? allVendorsByCity[targetCity] || [] : [];
    const [expanded, setExpanded] = useState(false);

    // Ensure we have some vendors to show by defaulting to the city's list if the message list is empty
    const initialVendors = (msg.vendors && msg.vendors.length > 0) ? msg.vendors : allForCity.slice(0, 3);
    const shown = expanded ? allForCity : initialVendors;
    const hasMore = allForCity.length > initialVendors.length;

    return (
        <div className="w-full">
            <div className="bg-secondary/40 border border-border rounded-xl p-3.5 mb-2 shadow-sm">
                {msg.city && <CityBadge city={msg.city} />}
                <div className="text-foreground text-[14px] leading-relaxed">{msg.content}</div>
            </div>
            <div className="space-y-2">
                {shown.map((v: any) => (
                    <VCard key={v.name} v={v} savedVendors={savedVendors} onSave={onSave} onVendorAction={onVendorAction} />
                ))}
            </div>
            {allForCity.length > 0 && hasMore && (
                <button onClick={() => setExpanded(e => !e)} className="w-full py-2.5 mt-1 border border-dashed border-border rounded-xl text-muted-foreground text-xs hover:text-primary hover:border-primary transition-all font-mono">
                    {expanded ? "▲ Show less" : `▼ View more vendors (${allForCity.length - initialVendors.length} more)`}
                </button>
            )}
        </div>
    );
}

function KnowledgeCard({ item }: { item: any }) {
    const isBlog = !!item.author;
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden max-w-[280px] shadow-sm">
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
            className="group block bg-card border border-border rounded-2xl overflow-hidden max-w-[280px] shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
        >
            <div className="h-40 w-full relative overflow-hidden">
                <img src={item.image} alt={item.eventName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-accent text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">
                    Community
                </div>
            </div>
            <div className="p-4">
                <div className="text-[14px] font-black leading-tight mb-1 text-foreground">{item.eventName}</div>
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

function EventForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [data, setData] = useState({ name: "", guests: "", budget: "" });
    return (
        <div className="bg-card border border-border rounded-2xl p-4 max-w-[300px] w-full space-y-3 shadow-sm">
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
        <div className="bg-card border border-border rounded-2xl p-4 max-w-[300px] w-full shadow-sm">
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
            {msg.content && <div className="text-foreground text-[14px] leading-relaxed whitespace-pre-line">{msg.content}</div>}
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

function Msg({ msg, onSelectCity, activeCity, savedVendors, onSave, onVendorAction, onSuggestion, allVendorsByCity, onFormSubmit, onCalendarSelect }: any) {
    const ag = msg.role === "agent";
    return (
        <div className={cn("flex gap-2 mb-6", ag ? "flex-row items-start" : "flex-row-reverse items-end")}>
            {ag && <img src="/images/ama.png" alt="Ama" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />}
            <div className={cn("max-w-[85%] flex flex-col", ag ? "items-start" : "items-end")}>
                {msg.type === "city_picker" ? (
                    <div className="flex flex-col gap-2 w-full max-w-[300px]">
                        {CITIES.map(c => (
                            <button key={c.name} onClick={() => onSelectCity(c.name)} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-all text-left">
                                <span className="text-2xl">{c.flag}</span>
                                <div>
                                    <div className="text-[13px] font-bold">{c.name}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-tight">{c.vibe}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : msg.type === "vendor_cards" ? (
                    <VendorCardMsg msg={msg} savedVendors={savedVendors} onSave={onSave} onVendorAction={onVendorAction} activeCity={activeCity} allVendorsByCity={allVendorsByCity} />
                ) : msg.type === "action" ? (
                    <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50 w-full">
                        <div className="text-foreground text-sm font-bold mb-3">{msg.content}</div>
                        {msg.actions.map((a: any, idx: number) => <Step key={idx} a={a} />)}
                    </div>
                ) : msg.type === "ama_flow_card" ? (
                    <AmaFlowCard msg={msg} />
                ) : msg.type === "knowledge" ? (
                    <div className="space-y-2">
                        {msg.content && <div className="text-[14px] leading-relaxed text-foreground">{msg.content}</div>}
                        <KnowledgeCard item={msg.data} />
                    </div>
                ) : msg.type === "community" ? (
                    <div className="space-y-2">
                        {msg.content && <div className="text-[14px] leading-relaxed text-foreground">{msg.content}</div>}
                        <CommunityCard item={msg.data} />
                    </div>
                ) : msg.type === "event_form" ? (
                    <div className="space-y-2">
                        {msg.content && <div className="text-[14px] leading-relaxed text-foreground">{msg.content}</div>}
                        <EventForm onSubmit={onFormSubmit} />
                    </div>
                ) : msg.type === "calendar_picker" ? (
                    <div className="space-y-2">
                        {msg.content && <div className="text-[14px] leading-relaxed text-foreground">{msg.content}</div>}
                        <CalendarPicker onSelect={onCalendarSelect} />
                    </div>
                ) : (
                    <div className={cn("rounded-2xl px-4 py-2.5 text-sm sm:text-base leading-relaxed whitespace-pre-line",
                        ag ? "bg-transparent text-foreground px-0 rounded-none shadow-none" : "bg-card border border-border text-foreground rounded-br-none shadow-sm")}>
                        {msg.content}
                    </div>
                )}

                {ag && msg.suggestions && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {msg.suggestions.map((s: any, i: number) => (
                            <SuggestionBubble key={i} label={s.label} onClick={() => onSuggestion(s)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [activeCity, setActiveCity] = useState<string | null>(null);
    const [savedVendors, setSavedVendors] = useState<Set<string>>(new Set());
    const [allVendorsByCity, setAllVendorsByCity] = useState<Record<string, any[]>>({});
    const [liveEvents, setLiveEvents] = useState<SharedEvent[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [chatTitle, setChatTitle] = useState("New Chat");
    const [dataLoaded, setDataLoaded] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [waddiModel, setWaddiModel] = useState<'lite' | 'pro'>('lite');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    useEffect(() => {
        async function init() {
            const [v, evs] = await Promise.all([getVendors(), getEvents()]);
            const cities = ["Lagos", "Accra", "Nairobi", "Cape Town"];
            const vendorsByCity: Record<string, any[]> = {};
            cities.forEach(city => vendorsByCity[city] = buildVendorsList(v, city));
            setAllVendorsByCity(vendorsByCity);
            setLiveEvents(evs);
            setDataLoaded(true);
        }
        init();
    }, []);

    useEffect(() => {
        if (!dataLoaded) return;

        const chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';

        try {
            const savedChatRaw = localStorage.getItem(`chat_${chatIdStr}`);
            if (savedChatRaw) {
                const parsed = JSON.parse(savedChatRaw);
                if (parsed && parsed.messages && parsed.messages.length > 0) {
                    setMessages(parsed.messages);
                    if (parsed.chatTitle) setChatTitle(parsed.chatTitle);
                    if (parsed.activeCity) setActiveCity(parsed.activeCity);
                    if (parsed.savedVendors) setSavedVendors(new Set(parsed.savedVendors));
                    setHistoryLoaded(true);
                    return;
                }
            }
        } catch (e) {
            console.error("Failed to parse chat history", e);
        }

        const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });

        // Populate initial messages based on chat ID using LIVE data
        if (params.id === 'lagos-bday') {
            const lagosVendors = allVendorsByCity["Lagos"] || [];
            const v1 = lagosVendors[0]?.name || "Local Vendor";
            const v2 = lagosVendors[1]?.name || "Premium Catering";
            const v3 = lagosVendors[2]?.name || "Event Venue";

            setMessages([
                {
                    id: 'msg-1',
                    role: "user",
                    content: "I'm looking for some help with my birthday weekend in Lagos.",
                    time: "Yesterday"
                },
                {
                    id: 'msg-2',
                    role: "agent",
                    type: "text",
                    content: MARKET_DATA.Lagos.greeting,
                    suggestions: [
                        { label: "Start Planning", action: "start_planning" },
                        { label: "Search Vendors", action: "vendor_search" }
                    ],
                    time: "Yesterday"
                },
                {
                    id: 'msg-3',
                    role: "agent",
                    type: "ama_flow_card",
                    kicker: "BUDGET OVERVIEW",
                    content: "Here's the current allocation for your Lagos weekend using our verified vendors:",
                    columns: ["Activity", "Vendor", "Price", "Status"],
                    rows: [
                        ["Spa", v1, "₦180k", "Quote requested"],
                        ["Dinner", v2, "₦350k", "Quote requested"],
                        ["Experience", v3, "₦600k", "Quote requested"]
                    ],
                    footer: `Total Allocated: ₦1.13M · Remaining: ₦870k`,
                    suggestions: [
                        { label: "Update Budget", action: "budget" },
                        { label: "Negotiate Bundle", action: "negotiate" }
                    ],
                    time: "Yesterday"
                },
                {
                    id: 'msg-4',
                    role: "user",
                    content: "Thanks! Can you also look for some high-end clubs for the Saturday night?",
                    time: "02:14 PM"
                }
            ]);
            setChatTitle("Lagos birthday weekend");
            setActiveCity("Lagos");
        } else if (params.id === 'accra-wedding') {
            const accraVendors = allVendorsByCity["Accra"] || [];
            const v1 = accraVendors[0]?.name || "Accra Catering";
            const v2 = accraVendors[1]?.name || "Ghana DJ";
            const v3 = accraVendors[2]?.name || "Luxury Decor";

            // Find a real Accra event
            const accraEvent = liveEvents.find(e => (e.location || "").toLowerCase().includes("accra")) || liveEvents[0];

            setMessages([
                {
                    id: 'msg-h-1',
                    role: "user",
                    content: "Searching for wedding vendors in Accra for December.",
                    time: "Tuesday"
                },
                {
                    id: 'msg-a-2',
                    role: "agent",
                    type: "ama_flow_card",
                    kicker: "BUDGET OVERVIEW",
                    content: "Preliminary shortlist for your Accra wedding:",
                    columns: ["Activity", "Vendor", "Price", "Status"],
                    rows: [
                        ["Catering", v1, "₵17,000", "Confirmed"],
                        ["Music", v2, "₵2,200", "Confirmed"],
                        ["Decor", v3, "₵3,500", "Quote received"]
                    ],
                    footer: `Total Allocated: ₵22,700 · Remaining: ₵7,300`,
                    suggestions: [
                        { label: "Show more catering", action: "vendor_search" },
                        { label: "Adjust Budget", action: "budget" }
                    ],
                    time: "Tuesday"
                },
                {
                    id: 'msg-h-2',
                    role: "user",
                    content: "What about photographers?",
                    time: "Wednesday"
                },
                {
                    id: 'msg-a-3',
                    role: "agent",
                    type: "vendor_cards",
                    city: "Accra",
                    content: "Here are some top photographers from our Accra database:",
                    vendors: accraVendors.slice(0, 3),
                    suggestions: [
                        { label: "Contract All", action: "book" },
                        { label: "See more options", action: "vendor_search" }
                    ],
                    time: "Wednesday"
                },
                {
                    id: 'msg-a-4',
                    role: "agent",
                    type: "community",
                    content: accraEvent ? `This real event shared by ${accraEvent.hostName} had a similar vibe. You might find their vendor list helpful:` : "Check out this community inspiration:",
                    data: accraEvent || {
                        id: "accra-wedding-ref",
                        eventName: "Modern Accra Wedding",
                        location: "Labadi, Accra",
                        description: "A stunning seaside ceremony using local vendors.",
                        image: "/images/events/wedding-1.jpg"
                    },
                    suggestions: [
                        { label: "Duplicate this plan", action: "duplicate_event" },
                        { label: "Ask about their caterer", action: "text" }
                    ],
                    time: "Wednesday"
                }
            ]);
            setChatTitle("Accra wedding shortlist");
            setActiveCity("Accra");
        } else if (params.id === 'nairobi-boat') {
            const nairobiVendors = allVendorsByCity["Nairobi"] || [];
            setMessages([
                {
                    id: 'n-1',
                    role: "user",
                    content: "Planning a boat + dinner outing in Nairobi for September. Any ideas?",
                    time: "Last week"
                },
                {
                    id: 'n-2',
                    role: "agent",
                    type: "text",
                    content: MARKET_DATA.Nairobi.greeting,
                    suggestions: [
                        { label: "Show boat venues", action: "vendor_search" },
                        { label: "Plan itinerary", action: "capability", capId: "itinerary" }
                    ],
                    time: "Last week"
                },
                {
                    id: 'n-3',
                    role: "agent",
                    type: "ama_flow_card",
                    kicker: "NAIROBI PLAN",
                    content: "I've drafted a plan using live Nairobi vendors:",
                    columns: ["Activity", "Vendor", "Price", "Status"],
                    rows: [
                        ["Experience", nairobiVendors[0]?.name || "Nairobi Club", "KSh 45,000", "Available"],
                        ["Dinner", nairobiVendors[1]?.name || "Local Grill", "KSh 85,000", "Table held"]
                    ],
                    footer: `Total Allocated: KSh 130,000 · Remaining: KSh 20,000`,
                    suggestions: [
                        { label: "Check cheaper options", action: "vendor_search" },
                        { label: "Confirm dinner table", action: "book" }
                    ],
                    time: "Last week"
                },
                {
                    id: 'n-4',
                    role: "user",
                    content: "The price for the boat seems high. Can we look for smaller options?",
                    time: "09:12 AM"
                }
            ]);
            setChatTitle("Nairobi boat + dinner plan");
            setActiveCity("Nairobi");
        } else if (params.id === 'cape-town-brunch') {
            const ctVendors = allVendorsByCity["Cape Town"] || [];
            setMessages([
                {
                    id: 'ct-1',
                    role: "user",
                    content: "Need brunch vendors for a baby shower in Cape Town. Around 40 guests.",
                    time: "Monday"
                },
                {
                    id: 'ct-2',
                    role: "agent",
                    type: "text",
                    content: MARKET_DATA["Cape Town"].greeting,
                    suggestions: [
                        { label: "Search Brunches", action: "vendor_search" },
                        { label: "Venue shortlist", action: "capability", capId: "shortlist" }
                    ],
                    time: "Monday"
                },
                {
                    id: 'ct-3',
                    role: "agent",
                    type: "vendor_cards",
                    city: "Cape Town",
                    content: "These live venues have great brunch availability for October:",
                    vendors: ctVendors.slice(0, 2),
                    suggestions: [
                        { label: "Request more", action: "vendor_search" },
                        { label: "Book " + (ctVendors[0]?.name || "Venue"), action: "book" }
                    ],
                    time: "Monday"
                },
                {
                    id: 'ct-4',
                    role: "agent",
                    type: "ama_flow_card",
                    kicker: "BUDGET OVERVIEW",
                    content: "Current budget snapshot for your Cape Town event:",
                    columns: ["Activity", "Vendor", "Price", "Status"],
                    rows: [
                        ["Venue", ctVendors[0]?.name || "Estate", "R12,000", "Confirmed"],
                        ["Catering", ctVendors[1]?.name || "Kitchen", "R18,500", "Received"]
                    ],
                    footer: `Total Allocated: R30,500 · Remaining: R9,500`,
                    suggestions: [
                        { label: "Full budget breakdown", action: "budget" },
                        { label: "Contract catering", action: "book" }
                    ],
                    time: "Tuesday"
                },
                {
                    id: 'ct-5',
                    role: "user",
                    content: `Let's go with ${ctVendors[0]?.name || "the estate"}. Can you check if they allow outside cake?`,
                    time: "11:45 AM"
                }
            ]);
            setChatTitle("Cape Town brunch vendors");
            setActiveCity("Cape Town");
        } else if (params.id && params.id !== 'new') {
            const mockTitles: Record<string, string> = {
                "accra-wedding": "Accra wedding shortlist",
                "nairobi-boat": "Nairobi boat + dinner plan",
                "cape-town-brunch": "Cape Town brunch vendors"
            };
            setChatTitle(mockTitles[params.id as string] || "Conversation");
            setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
        } else {
            setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
            setChatTitle("New Chat");
        }
        setHistoryLoaded(true);
    }, [params.id, dataLoaded]);

    useEffect(() => {
        if (!historyLoaded) return;
        const chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
        if (messages.length > 0) {
            localStorage.setItem(`chat_${chatIdStr}`, JSON.stringify({
                messages,
                chatTitle,
                activeCity,
                savedVendors: Array.from(savedVendors)
            }));
        }
    }, [messages, chatTitle, activeCity, savedVendors, historyLoaded, params.id]);

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

    const send = (text: string, actionData?: any) => {
        if (!text.trim()) return;
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [...prev, { id: Date.now(), role: "user", content: text, time: nowStr }]);
        setInput("");

        setTyping(true);
        setTimeout(() => {
            setTyping(false);

            let response: any = {
                id: Date.now() + 1,
                role: "agent",
                time: nowStr,
                type: "text"
            };

            const capId = actionData?.capId || actionData?.action;

            if (activeCity && capId && MARKET_DATA[activeCity]?.capabilityResponses?.[capId]) {
                const mock = MARKET_DATA[activeCity].capabilityResponses[capId];
                response = { ...response, ...mock };
                // If it's a vendor search, ensure we inject the actual vendors
                if (capId === 'vendor_search') {
                    response.vendors = allVendorsByCity[activeCity] || [];
                }
            } else if (activeCity && text.toLowerCase().includes("budget")) {
                const mock = MARKET_DATA[activeCity].capabilityResponses.budget;
                response = { ...response, ...mock };
            } else if (!activeCity) {
                response.content = "I'm looking into that for you. Which city are we talking about?";
                response.type = "city_picker";
            } else {
                response.content = `I'm on it. Processing your request for ${activeCity}...`;
                response.suggestions = [
                    { label: "Search Vendors", action: "vendor_search" },
                    { label: "Check Budget", action: "budget" }
                ];
            }

            setMessages(prev => [...prev, response]);
        }, 1500);
    };

    const handleSelectCity = (city: string) => {
        setActiveCity(city);
        const now = () => new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [...prev, {
            id: Date.now(),
            role: "agent",
            content: MARKET_DATA[city].greeting,
            suggestions: [
                { label: "Discover", action: "vendor_search" },
                { label: "Budget", action: "capability", capId: "budget" }
            ],
            time: now()
        }]);
    };

    const handleFormSubmit = (data: any) => {
        addUserMsg(`My event: ${data.name}, ${data.guests} guests, budget ${data.budget}`);
        withTyping(1200, () => {
            addAgentMsg({
                type: "text",
                content: "Got it! I'm creating your event draft and finding the best vendors now.",
                suggestions: [{ label: "Show budget breakdown", action: "capability", capId: "budget" }]
            });
        });
    };

    const handleCalendarSelect = (date: string) => {
        addUserMsg(`Date selected: ${date}`);
        withTyping(1000, () => {
            addAgentMsg({
                type: "text",
                content: `Great choice! I've marked ${date} on the calendar. What's the plan for that day?`,
                suggestions: [{ label: "Search vendors", action: "vendor_search" }]
            });
        });
    };

    const addUserMsg = (content: string) => {
        const now = () => new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [...prev, { id: Date.now(), role: "user", content, time: now() }]);
    };

    const addAgentMsg = (msg: any) => {
        const now = () => new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [...prev, { id: Date.now(), role: "agent", ...msg, time: now() }]);
    };

    const withTyping = (delayMs: number, fn: () => void) => {
        setTyping(true);
        setTimeout(() => { setTyping(false); fn(); }, delayMs);
    };

    const [mode, setMode] = useState<'chat' | 'planning'>('chat');

    const resetToNewChat = () => {
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
        setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
        setInput("");
        setTyping(false);
        setActiveCity(null);
        setSavedVendors(new Set());
        setChatTitle("New Chat");
        router.push("/dashboard/hosts/chat/new");
    };

    return (
        <div className="bg-background h-screen flex flex-col overflow-hidden relative">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <ChatHeader
                    onOpenMenu={() => setIsMobileMenuOpen(true)}
                    title={chatTitle}
                    onRename={setChatTitle}
                    onDelete={resetToNewChat}
                    waddiModel={waddiModel}
                    onChangeWaddiModel={setWaddiModel}
                />
                <SheetContent side="left" className="p-0 w-64 border-none">
                    <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:hsl(var(--border));border-radius:4px}
      `}</style>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
                    {messages.map(m => (
                        <Msg
                            key={m.id}
                            msg={m}
                            onSelectCity={handleSelectCity}
                            activeCity={activeCity}
                            savedVendors={savedVendors}
                            allVendorsByCity={allVendorsByCity}
                            onSuggestion={(s: any) => {
                                send(s.label, s);
                            }}
                            onFormSubmit={handleFormSubmit}
                            onCalendarSelect={handleCalendarSelect}
                        />
                    ))}
                    {typing && (
                        <div className="flex items-end gap-2 mb-6">
                            <img src="/images/ama.png" alt="Ama" className="w-8 h-8 rounded-full object-cover" />
                            <div className="bg-secondary/40 rounded-2xl px-4 py-3"><Dots /></div>
                        </div>
                    )}
                    <div ref={scrollRef} className="h-4" />
                </div>
            </div>

            <div className="p-4 sm:p-6 bg-background/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-card border border-border rounded-[24px] shadow-sm overflow-hidden focus-within:border-primary/50 transition-all">
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                            placeholder={mode === 'chat' ? "Message Ama..." : "Tell Ama what to plan..."}
                            rows={1}
                            className="w-full bg-transparent px-5 pt-5 pb-16 text-sm focus:outline-none resize-none min-h-[100px]"
                        />

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
                                    <Plus size={18} />
                                </button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-1 px-3 py-1.5 text-[14px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors">
                                            <ChevronDown size={14} className="text-muted-foreground" />
                                            {mode === 'chat' ? 'Chat' : 'Plan'}
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-40">
                                        <DropdownMenuItem onClick={() => setMode('chat')}>Chat Mode</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setMode('planning')}>Plan Mode</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="w-px h-4 bg-border mx-1"></div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-1 px-3 py-1.5 text-[14px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors max-w-[150px]">
                                            <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                                            <span className="truncate">
                                                {selectedEventId ? liveEvents.find(e => e.id === selectedEventId)?.eventName || 'Select Event' : 'Select Event'}
                                            </span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-48 max-h-[300px] overflow-y-auto">
                                        <DropdownMenuItem onClick={() => setSelectedEventId(null)}>None</DropdownMenuItem>
                                        {liveEvents.map(event => (
                                            <DropdownMenuItem key={event.id} onClick={() => setSelectedEventId(event.id || null)} className="truncate">
                                                {event.eventName}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
                                    <Mic size={18} />
                                </button>
                                <button
                                    onClick={() => send(input)}
                                    disabled={!input.trim()}
                                    className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 transition-all active:scale-95 shadow-lg shrink-0"
                                >
                                    <ArrowRight size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
