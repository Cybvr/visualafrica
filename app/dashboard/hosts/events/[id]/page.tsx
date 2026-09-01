"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    Calendar, Home, Users,
    Printer, Ticket,
    Plus, Mail, Download, Upload,
    LayoutDashboard, Store, FileText, Inbox, ListChecks, Globe, Plane, PanelLeft, LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listenToEventById, updateEvent } from '@/lib/firestore-service';
import { SharedEvent } from '@/lib/types';
import PlanTab from '@/components/dashboard/event-tabs/PlanTab';
import GuestsTab from '@/components/dashboard/event-tabs/GuestsTab';
import VendorsTab from '@/components/dashboard/event-tabs/VendorsTab';
import ContractsTab from '@/components/dashboard/event-tabs/ContractsTab';
import InboxTab from '@/components/dashboard/event-tabs/InboxTab';
import WebsiteTab from '@/components/dashboard/event-tabs/WebsiteTab';
import FlightsTab from '@/components/dashboard/event-tabs/FlightsTab';
import TicketsTab from '@/components/dashboard/event-tabs/TicketsTab';
import { TaskChecklist, DayOfTimeline } from '@/components/dashboard/chat';
import { formatCurrency } from '@/lib/utils';
import EventAssistant from '@/components/dashboard/EventAssistant';

// Tabs that get the add button, mapped to that button's tooltip/label.
const ADDABLE_TABS: Record<string, string> = {
    guests: "Add guest",
    vendors: "Add vendor",
    contracts: "Add contract",
};

const parseCsvRow = (row: string): string[] => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < row.length; i += 1) {
        const char = row[i];
        const next = row[i + 1];
        if (char === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (char === "," && !inQuotes) {
            cells.push(current.trim());
            current = "";
            continue;
        }
        current += char;
    }
    cells.push(current.trim());
    return cells;
};

const normalizeStatus = (value: string): SharedEvent["guests"][number]["status"] => {
    const normalized = value.trim().toLowerCase();
    if (normalized === "confirmed" || normalized === "going" || normalized === "yes") return "Confirmed";
    if (normalized === "declined" || normalized === "no") return "Declined";
    return "Pending";
};

const normalizeType = (value: string): SharedEvent["guests"][number]["type"] => {
    const normalized = value.trim().toLowerCase();
    if (normalized === "vip") return "VIP";
    if (normalized === "plus one" || normalized === "plus-one" || normalized === "plusone") return "Plus One";
    return "Main Guest";
};

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const importInputRef = React.useRef<HTMLInputElement>(null);

    // Get active tab from URL or default to 'overview'
    const currentTab = searchParams.get('tab') || 'home';
    const [activeTab, setActiveTab] = useState(currentTab);
    const [event, setEvent] = useState<SharedEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImportingGuests, setIsImportingGuests] = useState(false);
    const [guestImportMessage, setGuestImportMessage] = useState<string | null>(null);
    const [isNavVisible, setIsNavVisible] = useState(true);

    // Sync state with URL
    useEffect(() => {
        setActiveTab(currentTab);
    }, [currentTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        const unsubscribe = listenToEventById(id, (eventData) => {
            setEvent(eventData);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    const handleImportGuestsCsv = async (file: File) => {
        if (!event) return;
        setGuestImportMessage(null);
        setIsImportingGuests(true);

        try {
            const text = await file.text();
            const lines = text
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean);

            if (lines.length < 2) {
                setGuestImportMessage("CSV is empty. Add at least one guest row.");
                return;
            }

            const headers = parseCsvRow(lines[0]).map((h) => h.toLowerCase());
            const getHeaderIndex = (candidates: string[]) => headers.findIndex((h) => candidates.includes(h));
            const nameIndex = getHeaderIndex(["name", "full name", "guest"]);
            const emailIndex = getHeaderIndex(["email", "email address"]);
            const statusIndex = getHeaderIndex(["status", "rsvp"]);
            const typeIndex = getHeaderIndex(["type", "guest type"]);

            if (nameIndex === -1 && emailIndex === -1) {
                setGuestImportMessage("CSV must include at least a name or email column.");
                return;
            }

            const imported: SharedEvent["guests"] = [];
            lines.slice(1).forEach((line) => {
                const cols = parseCsvRow(line);
                const name = nameIndex >= 0 ? (cols[nameIndex] ?? "").trim() : "";
                const email = emailIndex >= 0 ? (cols[emailIndex] ?? "").trim() : "";
                if (!name && !email) return;
                imported.push({
                    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    name: name || email,
                    email,
                    status: normalizeStatus(statusIndex >= 0 ? (cols[statusIndex] ?? "") : ""),
                    type: normalizeType(typeIndex >= 0 ? (cols[typeIndex] ?? "") : ""),
                });
            });

            if (imported.length === 0) {
                setGuestImportMessage("No valid guest rows found in CSV.");
                return;
            }

            const mergedByKey = new Map<string, SharedEvent["guests"][number]>();
            event.guests.forEach((guest) => {
                const key = guest.email?.toLowerCase() || guest.id;
                mergedByKey.set(key, guest);
            });
            imported.forEach((guest) => {
                const key = guest.email?.toLowerCase() || guest.id;
                const existing = mergedByKey.get(key);
                mergedByKey.set(key, existing ? { ...existing, ...guest, id: existing.id } : guest);
            });

            const nextGuests = Array.from(mergedByKey.values());
            await updateEvent(event.id, {
                guests: nextGuests,
                guestCount: nextGuests.length,
            });
            setGuestImportMessage(`Imported ${imported.length} guest${imported.length === 1 ? "" : "s"}.`);
        } catch (error) {
            console.error("Failed to import guests:", error);
            setGuestImportMessage("Could not import CSV. Please try again.");
        } finally {
            setIsImportingGuests(false);
        }
    };

    if (isLoading) {
        return <div className="max-w-4xl mx-auto py-12 text-center text-muted-foreground">Loading event...</div>;
    }

    if (!event) {
        return <div className="max-w-4xl mx-auto py-12 text-center text-muted-foreground">Event not found.</div>;
    }

    const navItems: Array<{ value: string; label: string; meta: string; scope: 'local' | 'docs'; icon: LucideIcon }> = [
        { value: "home", label: "Home", meta: "Event workspace", scope: "local", icon: Home },
        { value: "overview", label: "Overview", meta: "Event plan", scope: "local", icon: LayoutDashboard },
        { value: "vendors", label: "Vendors", meta: `${event.bookedVendors.length} booked`, scope: "local", icon: Store },
        { value: "guests", label: "Guests", meta: `${event.guests.length} invited`, scope: "local", icon: Users },
        { value: "tickets", label: "Tickets", meta: event.ticketPrice ? formatCurrency(event.ticketPrice) : 'Free', scope: "local", icon: Ticket },
        { value: "contracts", label: "Contracts", meta: "Uploaded docs", scope: "docs", icon: FileText },
        { value: "inbox", label: "Inbox", meta: "Messages", scope: "local", icon: Inbox },
        { value: "itinerary", label: "Itinerary", meta: "Agent generated", scope: "docs", icon: Calendar },
        { value: "flights", label: "Flights", meta: "Travel planning", scope: "docs", icon: Plane },
        { value: "todo", label: "To-Do List", meta: "Agent checklist", scope: "docs", icon: ListChecks },
        { value: "website", label: "Website", meta: "RSVP page", scope: "local", icon: Globe },
    ];

    const filteredNavItems = navItems;

    const renderEventHome = () => (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {navItems.filter((item) => item.value !== "home").map((item) => {
                const ItemIcon = item.icon;
                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => handleTabChange(item.value)}
                        className="group text-left"
                    >
                        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/30 p-3 transition-colors group-hover:bg-secondary">
                            {/* Mirrors the panel header: icon on the left, share/download/print on the right. */}
                            <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
                                <ItemIcon size={14} className="text-muted-foreground" />
                                <div className="flex items-center gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-muted" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-muted" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-muted" />
                                </div>
                            </div>
                            <div className="space-y-2 pt-3">
                                <div className="h-2 w-4/5 rounded-full bg-muted" />
                                <div className="h-2 w-full rounded-full bg-muted" />
                                <div className="h-2 w-3/5 rounded-full bg-muted" />
                            </div>
                        </div>
                        <p className="mt-2 truncate text-sm font-medium text-foreground">{item.label}</p>
                    </button>
                );
            })}
        </div>
    );

    const renderActivePanel = () => {
        if (activeTab === "home") {
            return renderEventHome();
        }
        if (activeTab === "overview") {
            return <PlanTab event={event} />;
        }
        if (activeTab === "vendors") {
            return <VendorsTab event={event} />;
        }
        if (activeTab === "guests") {
            return <GuestsTab event={event} />;
        }
        if (activeTab === "website") {
            return <WebsiteTab event={event} />;
        }
        if (activeTab === "tickets") {
            return <TicketsTab event={event} />;
        }
        if (activeTab === "contracts") {
            return <ContractsTab eventId={id} bookedVendors={event.bookedVendors} />;
        }
        if (activeTab === "inbox") {
            return <InboxTab event={event} />;
        }
        if (activeTab === "itinerary") {
            return (
                <DayOfTimeline
                    events={event ? [event] : []}
                    selectedEventId={id}
                    onEventChange={() => { }}
                />
            );
        }
        if (activeTab === "flights") {
            return <FlightsTab event={event} />;
        }
        if (activeTab === "todo") {
            return (
                <TaskChecklist
                    events={event ? [event] : []}
                    selectedEventId={id}
                    onEventChange={() => { }}
                />
            );
        }
        return <PlanTab event={event} />;
    };

    const activeItem = navItems.find((item) => item.value === activeTab) ?? navItems[0];

    return (
        <div className="h-full w-full max-w-none overflow-hidden">
            <div className="grid h-full min-h-0 grid-cols-1 items-start gap-6 lg:items-stretch lg:grid-cols-[minmax(280px,300px)_minmax(0,1fr)]">
                <EventAssistant event={event} />
                <div className="mb-3 min-h-0 min-w-0 space-y-6 overflow-y-auto rounded-sm border border-border px-4 pb-4 lg:my-4 lg:mr-4 lg:px-5 lg:pb-5">
            <div className="space-y-6">
                <header className="sticky top-0 z-10 -mx-4 flex min-w-0 items-center justify-between gap-3 border-b border-border bg-background px-4 pb-1.5 pt-2 lg:-mx-5 lg:px-5">
                    <button
                        type="button"
                        onClick={() => setIsNavVisible((visible) => !visible)}
                        aria-expanded={isNavVisible}
                        aria-label={isNavVisible ? "Hide menu" : "Show menu"}
                        title={isNavVisible ? "Hide menu" : "Show menu"}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                        <PanelLeft size={13} />
                    </button>
                    <div className="flex shrink-0 items-center gap-2">
                        <Button variant="ghost" size="sm" title="Share">
                            Share
                        </Button>
                        <Button variant="ghost" size="sm" title="Download" aria-label="Download">
                            <Download size={13} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Print"
                            aria-label="Print"
                            onClick={() => typeof window !== 'undefined' && window.print()}
                        >
                            <Printer size={13} />
                        </Button>
                    </div>
                </header>

                <div className={`grid min-w-0 grid-cols-1 items-start transition-all duration-300 ease-in-out motion-reduce:transition-none ${isNavVisible
                    ? "gap-4 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8"
                    : "gap-0 lg:grid-cols-[0px_minmax(0,1fr)] lg:gap-0"
                    }`}>
                    <aside
                        aria-hidden={!isNavVisible}
                        className={`overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none lg:sticky lg:top-12 lg:max-h-none ${isNavVisible
                            ? "max-h-24 pt-2 opacity-100"
                            : "pointer-events-none max-h-0 pt-0 opacity-0"
                            }`}
                    >
                        <div className="lg:hidden -mx-1 px-1 overflow-x-auto pb-1">
                            <div className="flex items-center gap-2 min-w-max">
                                {filteredNavItems.map((item) => {
                                    const isActive = activeTab === item.value;
                                    const ItemIcon = item.icon;
                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            tabIndex={isNavVisible ? undefined : -1}
                                            onClick={() => handleTabChange(item.value)}
                                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${isActive
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-card text-foreground border-border hover:bg-secondary"
                                                }`}
                                        >
                                            <ItemIcon size={16} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="hidden max-h-[calc(100vh-11rem)] overflow-y-auto lg:block">
                            {filteredNavItems.map((item) => {
                                const isActive = activeTab === item.value;
                                const ItemIcon = item.icon;
                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        tabIndex={isNavVisible ? undefined : -1}
                                        onClick={() => handleTabChange(item.value)}
                                        className={`flex min-h-12 w-full items-center gap-3 border-b border-border px-2 py-3 text-left transition-colors hover:text-foreground ${isActive ? "text-primary" : "text-muted-foreground"
                                            }`}
                                    >
                                        <ItemIcon size={20} className={`shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                        <span className="min-w-0 truncate text-base font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <section className="min-w-0 bg-card rounded-sm shadow-sm p-3 md:p-4 flex flex-col h-full">
                        <header className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
                            <div className="flex min-w-0 flex-col">
                                <p className="text-sm font-medium text-foreground">{activeItem.label}</p>
                                {activeTab === 'website' && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <span>Website:</span>
                                        <a
                                            href={`/e/${event.id}`}
                                            target="_blank"
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {typeof window !== 'undefined' ? `${window.location.host}/e/${event.id}` : `/e/${event.id}`}
                                        </a>
                                    </div>
                                )}
                                {activeTab === 'guests' && guestImportMessage && (
                                    <p className="text-xs text-muted-foreground">{guestImportMessage}</p>
                                )}
                            </div>

                            <div className="flex shrink-0 items-center gap-1.5">
                                {/* Tab-Specific Actions — icon only, sized to match the content header. */}
                                {activeTab === 'guests' && (
                                    <>
                                        <input
                                            ref={importInputRef}
                                            type="file"
                                            accept=".csv,text/csv"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                await handleImportGuestsCsv(file);
                                                e.currentTarget.value = "";
                                            }}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 w-7 rounded-md p-0"
                                            title={isImportingGuests ? "Importing guests..." : "Import guests from CSV"}
                                            aria-label="Import guests from CSV"
                                            onClick={() => importInputRef.current?.click()}
                                            disabled={isImportingGuests}
                                        >
                                            <Upload size={13} />
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-7 w-7 rounded-md p-0" title="Email guests" aria-label="Email guests">
                                            <Mail size={13} />
                                        </Button>
                                    </>
                                )}

                                {ADDABLE_TABS[activeTab] && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 rounded-md p-0"
                                        title={ADDABLE_TABS[activeTab]}
                                        aria-label={ADDABLE_TABS[activeTab]}
                                    >
                                        <Plus size={13} />
                                    </Button>
                                )}
                            </div>
                        </header>
                        <div className="flex-1 overflow-auto">
                            {renderActivePanel()}
                        </div>
                    </section>
                </div>
            </div>
            </div>
            </div>
        </div>
    );
}
