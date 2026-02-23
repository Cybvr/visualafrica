"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    getVendors,
    getBlogPosts,
    getEvents,
    getChatById,
    saveChatMessage,
    listenToMessages,
    updateChatMetadata,
    createChat
} from "@/lib/firestore-service";
import { Vendor, BlogPost, SharedEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import ChatHeader from "@/components/dashboard/ChatHeader";
import { PricingDialog } from "@/components/dashboard/PricingDialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/dashboard/Sidebar";
import { DEMO_CHAT_HISTORY, MARKET_DATA, INITIAL_MESSAGES, getChatMessages, CITY_COLORS, CITIES, buildVendorsList } from "@/lib/chat-data";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Plus,
    ChevronDown,
    Mic,
    ArrowRight,
    MapPin,
    Star,
    Users,
    Search,
    Sparkles,
    ShoppingBag,
    CalendarDays,
    ListTodo,
    Clock3
} from "lucide-react";
import Link from 'next/link';
import {
    EventOverviewCard,
    VendorGrid,
    TaskChecklist,
    DayOfTimeline,
} from "@/components/dashboard/chat";

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
    const sourceVendors = (msg.vendors && msg.vendors.length > 0) ? msg.vendors : allForCity;
    const shown = sourceVendors.slice(0, 5);
    const hasMore = sourceVendors.length > shown.length;
    const viewAllHref = msg.viewAllHref || "/dashboard/hosts/search";
    const viewAllLabel = msg.viewAllLabel || "View all vendors";

    return (
        <div className="w-full">
            <div className="mb-3">
                {msg.city && <CityBadge city={msg.city} />}
                <div className="text-foreground text-[14px] leading-relaxed">{msg.content}</div>
            </div>
            <div className="w-full max-w-[480px] space-y-3">
                {shown.map((v: any) => (
                    <VCard key={v.name} v={v} savedVendors={savedVendors} onSave={onSave} onVendorAction={onVendorAction} />
                ))}
            </div>
            {hasMore && (
                <Link
                    href={viewAllHref}
                    className="block w-full max-w-[480px] py-2.5 mt-2 border border-dashed border-border rounded-xl text-muted-foreground text-xs hover:text-primary hover:border-primary transition-all font-mono text-center"
                >
                    {viewAllLabel} ({sourceVendors.length})
                </Link>
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

function EventForm({ onSubmit, defaultCity }: { onSubmit: (data: any) => void; defaultCity?: string | null }) {
    const [data, setData] = useState({ name: "", guests: "", budget: "", city: defaultCity || "" });
    return (
        <div className="bg-card border border-border rounded-2xl p-4 w-full space-y-3 shadow-sm">
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
            </div>
            <button
                onClick={() => onSubmit(data)}
                disabled={!data.name || !data.guests || !data.budget || !data.city}
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
                        <span className="bg-primary/10 text-primary text-[11px] font-semibold rounded-full px-2 py-0.5">{item.price}</span>
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
                            <span className="text-[14px]">⚡</span> <span className="hidden sm:inline">Apply</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onAction && onAction('buy', item); }}
                            className="flex-1 text-[11px] font-semibold py-1.5 hover:bg-background rounded-full transition-all flex justify-center items-center gap-1.5 text-foreground leading-none">
                            <span className="text-[14px]">💰</span> <span className="hidden sm:inline">Buy Kit</span>
                        </button>
                        <div className="w-[1px] h-3 bg-border"></div>
                        <Link
                            href={`/dashboard/hosts/chat/${item.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-[11px] font-semibold py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all flex justify-center items-center gap-1.5 leading-none">
                            <span className="text-[14px]">👁️</span> <span className="hidden sm:inline">Preview</span>
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
                <div className="text-foreground text-[14px] leading-relaxed">{msg.content}</div>
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

function Msg({ msg, onSelectCity, activeCity, savedVendors, onSave, onVendorAction, onStoreAction, onSuggestion, allVendorsByCity, onFormSubmit, onCalendarSelect, liveEvents, selectedEventId, onEventSelect }: any) {
    const ag = msg.role === "agent";
    return (
        <div className={cn("flex gap-3.5 mb-6", ag ? "flex-row items-start" : "flex-row-reverse items-start")}>
            {ag ? (
                <img src="/images/logo.png" alt="Waddi" className="w-[32px] h-[32px] rounded-full object-cover shrink-0 mt-0.5" />
            ) : (
                <div className="w-[32px] h-[32px] rounded-full bg-primary text-primary-foreground flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold shadow-sm">
                    YOU
                </div>
            )}

            <div className={cn("flex-1 min-w-0 flex flex-col", ag ? "items-start" : "items-end")}>
                {/* Petal-style Header */}
                <div className={cn("text-[11px] text-muted-foreground mb-1 flex items-center gap-2", !ag && "justify-end")}>
                    {ag ? (
                        <>
                            <span className="font-semibold text-foreground/80">Waddi bot</span>
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Lite</span>
                        </>
                    ) : (
                        <span className="font-semibold text-foreground/80">You</span>
                    )}
                    <span className="opacity-50 font-medium">{msg.time}</span>
                </div>

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
                            <VendorCardMsg msg={msg} savedVendors={savedVendors} onSave={onSave} onVendorAction={onVendorAction} activeCity={activeCity} allVendorsByCity={allVendorsByCity} />
                        </div>
                    ) : msg.type === "action" ? (
                        <div className="w-full mt-1">
                            <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50 w-full shadow-sm">
                                <div className="text-foreground text-sm font-bold mb-3">{msg.content}</div>
                                {msg.actions.map((a: any, idx: number) => <Step key={idx} a={a} />)}
                            </div>
                        </div>
                    ) : msg.type === "ama_flow_card" ? (
                        <div className="w-full mt-1">
                            <AmaFlowCard msg={msg} />
                        </div>
                    ) : msg.type === "knowledge" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[14px] leading-relaxed text-foreground">{msg.content}</div>}
                            <div className="w-full">
                                <KnowledgeCard item={msg.data} />
                            </div>
                        </div>
                    ) : msg.type === "community" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[14px] leading-relaxed text-foreground">{msg.content}</div>}
                            <div className="w-full">
                                <CommunityCard item={msg.data} />
                            </div>
                        </div>
                    ) : msg.type === "event_form" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[14px] leading-relaxed text-foreground">{msg.content}</div>}
                            <div className="w-full">
                                <EventForm onSubmit={onFormSubmit} defaultCity={activeCity} />
                            </div>
                        </div>
                    ) : msg.type === "calendar_picker" ? (
                        <div className="w-full space-y-2 mt-1">
                            {msg.content && <div className="text-[14px] leading-relaxed text-foreground">{msg.content}</div>}
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
                            {liveEvents && liveEvents.length > 0 ? (
                                liveEvents.map((event: SharedEvent) => (
                                    <EventOverviewCard key={event.id} event={event} />
                                ))
                            ) : (
                                <div className="p-4 border border-dashed border-border rounded-xl text-center text-muted-foreground text-sm">
                                    No events found in your account.
                                </div>
                            )}
                        </div>
                    ) : msg.type === "todo" ? (
                        <div className="w-full mt-1">
                            <TaskChecklist events={liveEvents} selectedEventId={selectedEventId} onEventChange={onEventSelect} />
                        </div>
                    ) : msg.type === "timeline" ? (
                        <div className="w-full mt-1">
                            <DayOfTimeline events={liveEvents} selectedEventId={selectedEventId} onEventChange={onEventSelect} />
                        </div>
                    ) : msg.type === "vendors" ? (
                        <div className="w-full mt-1">
                            <VendorGrid />
                        </div>
                    ) : (
                        msg.content ? (
                            <div className={cn(
                                "rounded-2xl px-4 py-3 text-[14px] leading-relaxed whitespace-pre-line shadow-sm border mt-1 inline-block",
                                ag
                                    ? "bg-card border-border text-foreground rounded-tl-[4px] text-left"
                                    : "bg-secondary/30 border-border text-foreground rounded-tr-[4px] text-left"
                            )}>
                                {msg.content}
                            </div>
                        ) : null
                    )}
                </div>

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
    const [storeKits] = useState<any[]>(() => DEMO_CHAT_HISTORY.filter((kit: any) => kit.published));
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [chatTitle, setChatTitle] = useState("New Chat");
    const [dataLoaded, setDataLoaded] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [waddiModel, setWaddiModel] = useState<'lite' | 'pro'>('lite');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<any>(null);
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handlePillClick = async (pill: any) => {
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });

        // If pill has an explicit action, route through the logic engine
        if (pill.action) {
            const userContent = pill.id === 'store' ? "Browse Store" : (pill.action === 'vendor_search' ? "Show me vendors" : `Show me ${pill.label.toLowerCase()}`);
            send(userContent, pill);
            return;
        }

        // Special handling for My Events to pull from DB
        if (pill.id === 'overview') {
            setTyping(true);
            try {
                const refreshedEvents = await getEvents();
                setLiveEvents(refreshedEvents);
            } catch (err) {
                console.error("Failed to refresh events", err);
            }
        }

        // Fallback for static UI views (Overview, Todo, etc)
        // If it's a new chat, use send to ensure it's created and persisted
        const userContent = `Show me ${pill.label.toLowerCase()}`;
        send(userContent, pill);
    };

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
        if (!dataLoaded || !currentUser) return;

        const chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';

        if (chatIdStr === 'new') {
            const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
            setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
            setChatTitle("New Chat");
            setActiveCity(null);
            setHistoryLoaded(true);
            return;
        }

        // Fetch chat metadata
        getChatById(chatIdStr).then(chat => {
            if (chat) {
                setChatTitle(chat.title);
                setActiveCity(chat.activeCity);
                if (chat.savedVendors) setSavedVendors(new Set(chat.savedVendors));
            } else if (chatIdStr !== 'new') {
                // Not in Firestore yet (could be a fresh task-ID from sidebar)
                const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
                setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
                setChatTitle("New Chat");
                setActiveCity(null);
            }
        });

        // Listen for messages in real-time
        const unsubscribe = listenToMessages(chatIdStr, (msgs) => {
            if (msgs.length > 0) {
                setMessages(msgs);
            } else {
                const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
                setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
            }
            setHistoryLoaded(true);
        });

        return () => unsubscribe();
    }, [params.id, dataLoaded, currentUser]);

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

    // ── Logic Dispatcher ─────────────────────────────────────

    const extractIntent = (text: string, actionData?: any) => {
        const lower = text.toLowerCase().trim();

        // Priority 1: Direct action passed from metadata
        const directAction = actionData?.capId || actionData?.action;
        if (directAction) return directAction;

        // Priority 2: Keyword matching (NLP-lite)
        if (lower.includes("budget") || lower.includes("price") || lower.includes("cost")) return "budget";
        if (lower.includes("vendor") || lower.includes("search") || lower.includes("find") || lower.includes("caterer") || lower.includes("dj")) return "vendor_search";
        if (lower.includes("book") || lower.includes("confirm") || lower.includes("hold")) return "book";
        if (lower.includes("negotiate") || lower.includes("deal") || lower.includes("discount")) return "negotiate";
        if (lower.includes("rsvp") || lower.includes("invite") || lower.includes("guests")) return "rsvp";
        if (lower.includes("upsell") || lower.includes("kit") || lower.includes("store")) return "upsell";
        if (lower.includes("experience")) return "experience";

        return "fallback";
    };

    const resolveCity = (text: string, currentCity: string | null) => {
        const lower = text.toLowerCase();
        const found = CITIES.find(c => lower.includes(c.name.toLowerCase()));
        return found ? found.name : currentCity;
    };

    /**
     * The core logic engine (n8n node style)
     * Handles intent -> capability mapping & prerequisite checking
     */
    const dispatchLogic = (text: string, actionData?: any, currentChatId?: string) => {
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
        const intent = extractIntent(text, actionData);
        const city = resolveCity(text, activeCity);

        // State sensing: capture city automatically
        if (city && city !== activeCity) setActiveCity(city);

        setTyping(true);
        setTimeout(() => {
            setTyping(false);

            let response: any = {
                id: Date.now() + 1,
                role: "agent",
                time: nowStr,
                type: "text"
            };
            const normalizedIntent = intent === "start_experiences" ? "experience" : intent;
            const allVendors = Object.values(allVendorsByCity).flat();

            if (intent === "start_planning") {
                response.type = "event_form";
                response.content = "Share your event details and I'll build your plan.";
                setMessages(prev => [...prev, response]);
                return;
            }

            if (intent === "start_store" || intent === "view_store_kit" || intent === "view_kit" || intent === "upsell") {
                if (storeKits.length === 0) {
                    response.type = "text";
                    response.content = "No store chats yet.";
                } else {
                    response.type = "store_cards";
                    response.content = "Shop these iternaries and save event planning time";
                    response.items = storeKits.map((kit: any) => ({
                        id: kit.id,
                        title: kit.title || kit.name || "Untitled chat",
                        city: kit.city || "Unspecified",
                        price: kit.price || "—",
                        rating: kit.rating,
                        runs: kit.runs
                    }));
                    response.viewAllHref = "/dashboard/hosts/store";
                    response.viewAllLabel = "View all kits";
                }
                setMessages(prev => [...prev, response]);
                return;
            }

            if (!city && (normalizedIntent === "vendor_search" || normalizedIntent === "start_vendor_search")) {
                response.type = "vendor_cards";
                response.content = "Top vendors across all cities:";
                response.vendors = allVendors;
                response.viewAllHref = "/dashboard/hosts/search";
                response.viewAllLabel = "View all vendors";
                response.suggestions = [{ label: "Experiences", action: "start_experiences" }];
                setMessages(prev => [...prev, response]);
                return;
            }

            if (!city && normalizedIntent === "experience") {
                const experienceVendors = allVendors.filter((v: any) =>
                    Array.isArray(v.categories) ? v.categories.includes("Experiences") : v.type === "Experiences"
                );
                if (experienceVendors.length === 0) {
                    response.type = "text";
                    response.content = "I couldn't find experience packages yet. Want all vendors instead?";
                    response.suggestions = [{ label: "Discover Vendors", action: "vendor_search" }];
                } else {
                    response.type = "vendor_cards";
                    response.content = "Top experience packages across all cities:";
                    response.vendors = experienceVendors;
                    response.viewAllHref = "/dashboard/hosts/experiences";
                    response.viewAllLabel = "View all experiences";
                    response.suggestions = [{ label: "Discover Vendors", action: "vendor_search" }];
                }
                setMessages(prev => [...prev, response]);
                return;
            }

            // Prerequisite node: City context
            if (!city) {
                response.content = "I'd love to help with that! To give you accurate data and local options, which city are we planning for?";
                response.type = "city_picker";
                // Store the full context of this action for later
                setPendingAction(actionData || { action: intent, text: text });
                setMessages(prev => [...prev, response]);
                return;
            }

            // Execution node: Capability Registry
            const market = MARKET_DATA[city];
            const capabilityResponse = market?.capabilityResponses?.[normalizedIntent] || market?.capabilityResponses?.fallback;

            if (capabilityResponse) {
                response = { ...response, ...capabilityResponse };
                // Dynamic injector for vendors
                if (normalizedIntent === 'vendor_search' || normalizedIntent === 'start_vendor_search') {
                    response.vendors = allVendorsByCity[city] || [];
                    response.viewAllHref = "/dashboard/hosts/search";
                    response.viewAllLabel = "View all vendors";
                }
                if (normalizedIntent === "experience") {
                    const experienceVendors = (allVendorsByCity[city] || []).filter((v: any) =>
                        Array.isArray(v.categories) ? v.categories.includes("Experiences") : v.type === "Experiences"
                    );
                    if (experienceVendors.length === 0) {
                        response.type = "text";
                        response.content = `I couldn't find experience packages in ${city} yet. Want to see all vendors instead?`;
                        response.suggestions = [{ label: "Discover Vendors", action: "vendor_search" }];
                    } else {
                        response.type = "vendor_cards";
                        response.content = `Top experience packages in ${city}:`;
                        response.vendors = experienceVendors;
                        response.viewAllHref = "/dashboard/hosts/experiences";
                        response.viewAllLabel = "View all experiences";
                        response.suggestions = [{ label: "Discover Vendors", action: "vendor_search" }];
                    }
                }
            } else {
                response.content = `I'm coordinating your ${city} event. How else can I help?`;
                response.suggestions = [
                    { label: "Plan", action: "start_planning" },
                    { label: "Discover Vendors", action: "vendor_search" },
                    { label: "Experiences", action: "start_experiences" },
                    { label: "Store", action: "start_store" }
                ];
            }

            if (currentChatId) {
                saveChatMessage(currentChatId, response);
            } else {
                setMessages(prev => [...prev, response]);
            }
        }, 1200);
    };

    const send = async (text: string, actionData?: any) => {
        if (!text.trim()) return;
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });

        let chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
        const isNew = chatIdStr === 'new' || chatIdStr.startsWith('task-');

        if (isNew && currentUser) {
            const newChatId = await createChat(currentUser.uid, text.substring(0, 30), activeCity);

            // Persist initial greeting too so it's not lost
            for (const m of INITIAL_MESSAGES) {
                await saveChatMessage(newChatId, { ...m, time: nowStr });
            }

            await saveChatMessage(newChatId, { role: "user", content: text, time: nowStr });

            // Trigger logic before redirecting, passing the new ID
            dispatchLogic(text, actionData, newChatId);

            router.push(`/dashboard/hosts/chat/${newChatId}`);
            return;
        }

        if (chatIdStr !== 'new') {
            await saveChatMessage(chatIdStr, { role: "user", content: text, time: nowStr });
            dispatchLogic(text, actionData, chatIdStr);
        }

        setInput("");
    };

    const handleSelectCity = async (city: string) => {
        setActiveCity(city);
        const chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';

        if (chatIdStr !== 'new') {
            await updateChatMetadata(chatIdStr, { activeCity: city });
        }

        // Logic Flow Node: Show greeting
        await addAgentMsg({
            content: MARKET_DATA[city]?.greeting || `${city} — let's go. Tapped into the local vendor network. What are we planning?`,
            suggestions: [
                { label: "Discover Vendors", action: "vendor_search" },
            ]
        });

        // Workflow Resumption Node
        if (pendingAction) {
            const actionToRun = pendingAction;
            setPendingAction(null);

            setTimeout(() => {
                const text = actionToRun.label || actionToRun.text || "Continue";
                dispatchLogic(text, actionToRun, chatIdStr !== 'new' ? chatIdStr : undefined);
            }, 1000);
        }
    };

    const handleFormSubmit = (data: any) => {
        if (data.city) setActiveCity(data.city);
        addUserMsg(`My event: ${data.name}, ${data.guests} guests, budget ${data.budget}, city ${data.city}`);
        withTyping(1200, () => {
            addAgentMsg({
                type: "text",
                content: "Got it! I'm creating your event draft and finding the best vendors now.",
                suggestions: []
            });
        });
    };

    const handleCalendarSelect = (date: string) => {
        addUserMsg(`Date selected: ${date}`);
        withTyping(1000, () => {
            addAgentMsg({
                type: "text",
                content: `Great choice! I've marked ${date} on the calendar. What's the plan for that day?`,
                suggestions: [{ label: "Discover Vendors", action: "vendor_search" }]
            });
        });
    };

    const addUserMsg = async (content: string) => {
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
        const userMsg = { role: "user", content, time: nowStr };

        const chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
        if (chatIdStr !== 'new') {
            await saveChatMessage(chatIdStr, userMsg);
        } else {
            setMessages(prev => [...prev, { ...userMsg, id: Date.now().toString() }]);
        }
    };

    const addAgentMsg = async (msg: any) => {
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
        const agentMsg = { role: "agent", ...msg, time: nowStr };

        const chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
        if (chatIdStr !== 'new') {
            await saveChatMessage(chatIdStr, agentMsg);
        } else {
            setMessages(prev => [...prev, { ...agentMsg, id: Date.now().toString() }]);
        }
    };

    const withTyping = (delayMs: number, fn: () => void) => {
        setTyping(true);
        setTimeout(() => { setTyping(false); fn(); }, delayMs);
    };

    const handleStoreAction = (action: string, item: any) => {
        if (action === 'apply') {
            addUserMsg(`Apply ${item.title} kit to my plan`);
            dispatchLogic(`Apply ${item.title} kit`);
        } else if (action === 'buy') {
            addAgentMsg({
                content: `Processing purchase for ${item.title} (${item.price}). Secure checkout will open in a new tab...`,
                type: "text"
            });
            // Simulate checkout
            setTimeout(() => {
                addAgentMsg({
                    content: `Purchase successful! The ${item.title} has been applied to your event workspace.`,
                    type: "text"
                });
            }, 2000);
        }
    };

    const handleVendorAction = (action: any, vendor: any) => {
        if (action.id === 'message') {
            addUserMsg(`Message ${vendor.name}`);
            dispatchLogic(`I'd like to message ${vendor.name}`);
        } else if (action.id === 'contract') {
            addUserMsg(`Generate brief for ${vendor.name}`);
            dispatchLogic(`Create a brief for ${vendor.name}`);
        }
    };

    const handleSaveVendor = (vendor: any) => {
        setSavedVendors(prev => {
            const next = new Set(prev);
            if (next.has(vendor.name)) {
                next.delete(vendor.name);
                addAgentMsg({ content: `Removed ${vendor.name} from your saved vendors.`, type: 'text' });
            } else {
                next.add(vendor.name);
                addAgentMsg({ content: `Saved ${vendor.name}! You can view your saved vendors in the Vendors tab.`, type: 'text' });
            }
            return next;
        });
    };

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

    const downloadChatTranscript = () => {
        const chatId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
        const safeTitle = (chatTitle || "chat").replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "");
        const filename = `${safeTitle || "chat"}-${chatId}-transcript.txt`;
        const generatedAt = new Date().toLocaleString("en-US");

        const lines = messages.map((m: any) => {
            const speaker = m.role === "user" ? "You" : "Ama";
            const timestamp = m.time ? ` [${m.time}]` : "";
            const content =
                typeof m.content === "string" && m.content.trim().length > 0
                    ? m.content.trim()
                    : `[${m.type || "message"}]`;
            return `${speaker}${timestamp}: ${content}`;
        });

        const body = [
            `Chat: ${chatTitle || "New Chat"}`,
            `Generated: ${generatedAt}`,
            "",
            ...lines
        ].join("\n");

        const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-background h-screen flex flex-col overflow-hidden relative">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <ChatHeader
                    onOpenMenu={() => setIsMobileMenuOpen(true)}
                    title={chatTitle}
                    onRename={async (newTitle) => {
                        setChatTitle(newTitle);
                        const chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
                        if (chatIdStr !== 'new') {
                            await updateChatMetadata(chatIdStr, { title: newTitle });
                        }
                    }}
                    onDelete={resetToNewChat}
                    onDownload={downloadChatTranscript}
                    waddiModel={waddiModel}
                    onChangeWaddiModel={(model) => {
                        if (model === 'pro') {
                            if (waddiModel !== 'pro') {
                                setIsPricingOpen(true);
                            }
                        } else {
                            setWaddiModel(model);
                        }
                    }}
                />

                <PricingDialog
                    open={isPricingOpen}
                    onOpenChange={setIsPricingOpen}
                    onUpgrade={() => {
                        setWaddiModel('pro');
                        addAgentMsg({
                            content: "Welcome to Waddi Pro! You now have access to deeper planning insights and advanced negotiation features.",
                            type: 'text'
                        });
                    }}
                />

                {/* Corridor Pills */}
                <div className="flex gap-2.5 px-4 sm:px-6 py-3 border-b border-border overflow-x-auto bg-background/50 backdrop-blur-sm hide-scrollbar shrink-0">
                    {[
                        { id: 'start_planning', label: 'Plan', icon: Plus, action: 'start_planning' },
                        { id: 'vendors_search', label: 'Discover Vendors', icon: Search, action: 'vendor_search' },
                        { id: 'experience', label: 'Experiences', icon: Sparkles, action: 'experience' },
                        { id: 'store', label: 'Shop', icon: ShoppingBag, action: 'start_store' },
                        { id: 'overview', label: 'My Events', icon: CalendarDays },
                        { id: 'todo', label: 'To-do List', icon: ListTodo },
                        { id: 'timeline', label: 'Timeline', icon: Clock3 },
                    ].map(pill => (
                        <button
                            key={pill.id}
                            onClick={() => handlePillClick(pill)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-[12px] font-medium text-foreground hover:border-primary/50 hover:bg-secondary/50 transition-all whitespace-nowrap shadow-sm"
                        >
                            <pill.icon size={14} className="shrink-0" />
                            {pill.label}
                        </button>
                    ))}
                </div>

                <SheetContent side="left" className="p-0 w-64 border-none">
                    <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .msg-animate { 
            animation: fadeUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; 
            opacity: 0; 
        }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:hsl(var(--border));border-radius:4px}
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
                    {messages.map((m, idx) => (
                        <div key={m.id} className="msg-animate" style={{ animationDelay: `${Math.min(idx, 8) * 0.05}s` }}>
                            <Msg
                                msg={m}
                                onSelectCity={handleSelectCity}
                                activeCity={activeCity}
                                savedVendors={savedVendors}
                                allVendorsByCity={allVendorsByCity}
                                onSuggestion={(s: any) => {
                                    send(s.label, s);
                                }}
                                onStoreAction={handleStoreAction}
                                onVendorAction={handleVendorAction}
                                onSave={handleSaveVendor}
                                onFormSubmit={handleFormSubmit}
                                onCalendarSelect={handleCalendarSelect}
                                liveEvents={liveEvents}
                                selectedEventId={selectedEventId}
                                onEventSelect={setSelectedEventId}
                            />
                        </div>
                    ))}
                    {typing && (
                        <div className="flex items-end gap-2 mb-6 msg-animate">
                            <img src="/images/logo.png" alt="Ama" className="w-[32px] h-[32px] rounded-full object-cover " />
                            <div className="bg-secondary/40 rounded-2xl px-4 py-3 shadow-sm border border-border/50"><Dots /></div>
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
                            placeholder="Ask Waddi anything about this chat..."
                            rows={1}
                            className="w-full bg-transparent px-5 pt-5 pb-16 text-sm focus:outline-none resize-none min-h-[100px]"
                        />

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
                                    <Plus size={18} />
                                </button>
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
                    <p className="text-[11px] text-muted-foreground mt-3 text-center opacity-60">
                        Waddi can access vendors, contracts, and guest data for this event
                    </p>
                </div>
            </div>
        </div>
    );
}
