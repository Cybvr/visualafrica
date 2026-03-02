"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    MapPin, Calendar, Users, Rocket,
    ChevronLeft, ChevronRight, Share2, Printer, Ticket,
    Plus, Mail, Download, Upload,
    LayoutDashboard, Store, FileText, Inbox, ListChecks, Globe, Plane, LucideIcon,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { listenToEventById, updateEvent } from '@/lib/firestore-service';
import { SharedEvent } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ShareEventDialog } from '@/components/dashboard/ShareEventDialog';
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
    const currentTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(currentTab);
    const [activeFilter, setActiveFilter] = useState<'all' | 'local' | 'docs'>('all');
    const [event, setEvent] = useState<SharedEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImportingGuests, setIsImportingGuests] = useState(false);
    const [guestImportMessage, setGuestImportMessage] = useState<string | null>(null);
    const [hostPhoto, setHostPhoto] = useState<string | null>(null);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [isUpdatingBriefState, setIsUpdatingBriefState] = useState(false);

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

    useEffect(() => {
        async function fetchTeamMembers() {
            if (!event?.hostId) return;
            try {
                const profileRef = doc(db, 'userProfiles', event.hostId);
                const snap = await getDoc(profileRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setTeamMembers(data.teamMembers || []);
                    setHostPhoto(data.photoURL || null);
                }
            } catch (error) {
                console.error("Failed to load team members:", error);
            }
        }
        fetchTeamMembers();
    }, [event?.hostId]);

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

    const isBriefOpen = Boolean(event.isPublicBrief && event.publicBriefStatus !== "closed");

    const handleTogglePublicBrief = async () => {
        if (isUpdatingBriefState) return;
        setIsUpdatingBriefState(true);
        try {
            const nextOpenState = !isBriefOpen;
            await updateEvent(event.id, {
                isPublicBrief: nextOpenState,
                publicBriefStatus: nextOpenState ? "open" : "closed",
            });
        } catch (error) {
            console.error("Failed to update brief visibility:", error);
        } finally {
            setIsUpdatingBriefState(false);
        }
    };

    const navItems: Array<{ value: string; label: string; meta: string; scope: 'local' | 'docs'; icon: LucideIcon }> = [
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

    const filteredNavItems = navItems.filter((item) =>
        activeFilter === 'all' ? true : item.scope === activeFilter
    );

    const renderActivePanel = () => {
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
        <div className="max-w-7xl mx-auto space-y-6 py-6">
            {/* Header with navigation and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/hosts/events" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ChevronLeft size={16} />
                        Back to Events
                    </Link>
                    <span className="text-muted">•</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded border bg-primary/10 text-primary border-primary/20">
                        {event.status}
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">{event.eventName}</h1>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-1 text-sm">
                                <MapPin size={16} className="text-muted-foreground" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <Calendar size={16} className="text-muted-foreground" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <Users size={16} className="text-muted-foreground" />
                                <span>{event.guestCount} guests</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <Ticket size={16} className="text-muted-foreground" />
                                <span>{event.ticketPrice ? formatCurrency(event.ticketPrice) : 'Free'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <span className="font-medium text-success">{formatCurrency(event.budget || 0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Switch
                                        checked={isBriefOpen}
                                        disabled={isUpdatingBriefState}
                                        onCheckedChange={() => {
                                            void handleTogglePublicBrief();
                                        }}
                                        aria-label={`Toggle public brief for ${event.eventName}`}
                                        className="scale-90"
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-foreground text-background font-bold px-3 py-1.5 rounded-lg">
                                    <p className="text-[10px] uppercase tracking-wider">Public Brief Is {isBriefOpen ? 'Open' : 'Closed'}</p>
                                </TooltipContent>
                            </Tooltip>

                            <ShareEventDialog event={event} teamMembers={teamMembers} hostPhoto={hostPhoto} />

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={`/e/${event.id}`}
                                        target="_blank"
                                        className="bg-card hover:bg-secondary/50 border border-border flex items-center justify-center h-10 w-10 rounded-xl transition-colors shrink-0"
                                    >
                                        <ExternalLink size={18} />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-foreground text-background font-bold px-3 py-1.5 rounded-lg">
                                    <p className="text-[10px] uppercase tracking-wider">View RSVP Site</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[210px_minmax(0,1fr)] gap-4 lg:gap-6 items-start">
                    <aside className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            {[
                                { key: 'all' as const, label: 'All' },
                                { key: 'local' as const, label: 'Local' },
                                { key: 'docs' as const, label: 'Documents' },
                            ].map((filter) => {
                                const selected = activeFilter === filter.key;
                                return (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() => setActiveFilter(filter.key)}
                                        className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${selected
                                            ? "bg-foreground text-background"
                                            : "bg-secondary text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="lg:hidden -mx-1 px-1 overflow-x-auto pb-1">
                            <div className="flex items-center gap-2 min-w-max">
                                {filteredNavItems.map((item) => {
                                    const isActive = activeTab === item.value;
                                    const ItemIcon = item.icon;
                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => handleTabChange(item.value)}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${isActive
                                                ? "bg-foreground text-background border-foreground"
                                                : "bg-card text-foreground border-border hover:bg-secondary"
                                                }`}
                                        >
                                            <ItemIcon size={14} className={isActive ? "text-background" : "text-muted-foreground"} />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="hidden lg:block space-y-2">
                            {filteredNavItems.map((item) => {
                                const isActive = activeTab === item.value;
                                const ItemIcon = item.icon;
                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => handleTabChange(item.value)}
                                        className={`w-full rounded-lg border px-2.5 py-1.5 text-left transition-colors ${isActive
                                            ? "bg-card border-border"
                                            : "bg-secondary/30 border-transparent hover:bg-card hover:border-border"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0 flex items-center gap-2.5">
                                                <ItemIcon size={15} className="shrink-0 text-muted-foreground" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{item.meta}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-muted-foreground" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <section className="min-w-0 bg-card rounded-xl shadow-sm p-3 md:p-4 flex flex-col h-full">
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                            <div className="flex flex-col">
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

                            <div className="flex flex-wrap items-center gap-2">
                                {/* Tab-Specific Actions */}
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
                                            className="h-8 gap-1.5 rounded-md px-2.5"
                                            onClick={() => importInputRef.current?.click()}
                                            disabled={isImportingGuests}
                                        >
                                            <Upload size={14} />
                                            {isImportingGuests ? "Importing..." : "Import CSV"}
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-md px-2.5">
                                            <Plus size={14} />
                                            New
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 w-8 rounded-md p-0">
                                            <Mail size={14} />
                                        </Button>
                                    </>
                                )}

                                {activeTab === 'vendors' && (
                                    <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-md px-2.5">
                                        <Plus size={14} />
                                        New
                                    </Button>
                                )}

                                {activeTab === 'contracts' && (
                                    <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-md px-2.5">
                                        <Plus size={14} />
                                        New
                                    </Button>
                                )}

                                {/* Universal Actions for all tabs */}
                                <Button variant="outline" size="sm" className="h-8 w-8 rounded-md p-0" title="Share">
                                    <Share2 size={14} />
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 w-8 rounded-md p-0" title="Download">
                                    <Download size={14} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 rounded-md p-0"
                                    title="Print"
                                    onClick={() => typeof window !== 'undefined' && window.print()}
                                >
                                    <Printer size={14} />
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            {renderActivePanel()}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
