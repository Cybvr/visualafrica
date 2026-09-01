"use client";

import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Home, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
    createChat,
    getEvents,
    getStoreKits,
    getVendors,
    listenToMessages,
    saveChatFeedback,
} from "@/lib/firestore-service";
import { SharedEvent } from "@/lib/types";
import { DEMO_CHAT_HISTORY, INITIAL_MESSAGES, buildVendorsList } from "@/lib/chat-data";
import { useChatAgent } from "@/hooks/use-chat-agent";
import { useSavedVendors } from "@/hooks/use-saved-vendors";
import { Dots, Msg } from "@/components/dashboard/chat/chat-message-renderers";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EventAssistantProps = {
    event: SharedEvent;
};

export default function EventAssistant({ event }: EventAssistantProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [activeCity, setActiveCity] = useState<string | null>(event.location || null);
    const [allVendorsByCity, setAllVendorsByCity] = useState<Record<string, any[]>>({});
    const [storeKits, setStoreKits] = useState<any[]>(() => DEMO_CHAT_HISTORY.filter((kit: any) => kit.published));
    const [selectedEventId, setSelectedEventId] = useState<string | null>(event.id);
    const [pendingAction, setPendingAction] = useState<any>(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [otherEvents, setOtherEvents] = useState<SharedEvent[]>([]);

    const { savedVendorIds, toggleSavedVendor } = useSavedVendors(currentUser?.uid);

    const initialMessage = useMemo(
        () => [{
            ...INITIAL_MESSAGES[0],
            content: `Hi! I'm Waddi. I can help you move ${event.eventName} forward. What should we work on?`,
        }],
        [event.eventName]
    );

    const embeddedRouter = useMemo(() => ({
        push: (_href: string) => undefined,
    }), []);

    useEffect(() => {
        return onAuthStateChanged(auth, setCurrentUser);
    }, []);

    useEffect(() => {
        setActiveCity(event.location || null);
        setSelectedEventId(event.id);
    }, [event.id, event.location]);

    useEffect(() => {
        if (!currentUser?.uid || !event.id) return;
        let cancelled = false;

        createChat(currentUser.uid, `${event.eventName} assistant`, event.location || null)
            .then((createdChatId) => {
                if (!cancelled) setChatId(createdChatId);
            })
            .catch((error) => console.error("Failed to start event assistant:", error));

        return () => {
            cancelled = true;
        };
    }, [currentUser?.uid, event.id]);

    useEffect(() => {
        if (!chatId) {
            setMessages(initialMessage);
            return;
        }

        return listenToMessages(
            chatId,
            (nextMessages) => setMessages(nextMessages.length > 0 ? nextMessages : initialMessage),
            () => setMessages(initialMessage)
        );
    }, [chatId, initialMessage]);

    useEffect(() => {
        if (!currentUser?.uid) return;

        getEvents(currentUser.uid, currentUser.email || undefined)
            .then((events) => setOtherEvents(events.filter((item) => item.id !== event.id)))
            .catch((error) => console.error("Failed to load other events:", error));

        getVendors()
            .then((vendors) => {
                const cities = Array.from(new Set([
                    "Lagos",
                    "Accra",
                    "Nairobi",
                    "Cape Town",
                    event.location,
                ].filter(Boolean)));
                const vendorsByCity: Record<string, any[]> = {};
                cities.forEach((city) => {
                    vendorsByCity[city] = buildVendorsList(vendors, city);
                });
                setAllVendorsByCity(vendorsByCity);
            })
            .catch((error) => console.error("Failed to load vendors for event assistant:", error));

        getStoreKits()
            .then((kits) => {
                const demoKits = DEMO_CHAT_HISTORY.filter((kit: any) => kit.published);
                const dbKits = kits.filter((kit: any) => !demoKits.some((demo: any) => demo.id === kit.id));
                setStoreKits([...dbKits, ...demoKits]);
            })
            .catch((error) => console.error("Failed to load store kits for event assistant:", error));
    }, [currentUser?.uid, event.location]);

    const liveEvents = useMemo(() => [event], [event]);

    const {
        send,
        addUserMsg,
        addAgentMsg,
        dispatchLogic,
        handleSelectCity,
        handleFormSubmit,
        handleTicketFormSubmit,
        handleFlightFormSubmit,
    } = useChatAgent({
        paramsId: chatId || "new",
        router: embeddedRouter,
        searchParams: searchParams as unknown as URLSearchParams,
        messages,
        setMessages,
        setInput,
        setTyping,
        activeCity,
        setActiveCity,
        allVendorsByCity,
        liveEvents,
        selectedEventId,
        setSelectedEventId,
        pendingAction,
        setPendingAction,
        currentUser,
        storeKits,
    });

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const sendWithTokenTracking = async (text: string, actionData?: any) => {
        if (!chatId || !text.trim()) return;
        await send(text, actionData);
    };

    const handleStoreAction = (action: string, item: any) => {
        if (action === "apply") {
            addUserMsg(`Apply ${item.title} to my event plan`);
            dispatchLogic(`Apply ${item.title} kit`);
            return;
        }

        if (action === "buy") {
            void addAgentMsg({
                type: "text",
                content: `The ${item.title} checkout is ready to open.`,
            });
        }
    };

    const handleVendorAction = (action: any, vendor: any) => {
        if (action.id === "message") {
            const vendorId = String(vendor?.id || "").trim();
            if (vendorId) router.push(`/dashboard/hosts/inbox?vendorId=${encodeURIComponent(vendorId)}`);
            return;
        }

        if (action.id === "contract") {
            addUserMsg(`Generate a brief for ${vendor.name}`);
            dispatchLogic(`Create a brief for ${vendor.name}`);
        }
    };

    const handleSaveVendor = (vendor: any) => {
        const vendorKey = vendor?.id || vendor?.slug || vendor?.name;
        if (!vendorKey) return;
        const isSaved = savedVendorIds.has(vendorKey);
        toggleSavedVendor(vendorKey);
        void addAgentMsg({
            type: "text",
            content: isSaved
                ? `Removed ${vendor.name} from your saved vendors.`
                : `Saved ${vendor.name}.`,
        });
    };

    const handleCalendarSelect = (date: string) => {
        void addUserMsg(`Date selected: ${date}`);
        setTyping(true);
        window.setTimeout(() => {
            setTyping(false);
            void addAgentMsg({
                type: "text",
                content: `I've marked ${date} for ${event.eventName}. What should we plan for that day?`,
            });
        }, 700);
    };

    const handleSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();
        void sendWithTokenTracking(input);
    };

    return (
        <section
            // The chat renderers are sized for the full-width chat page; this column is ~300px, so scale them down.
            style={{ "--chat-body": "13px", "--chat-chip": "11px", "--chat-gap": "1rem" } as CSSProperties}
            className="flex min-h-[520px] flex-col overflow-hidden border-b border-border bg-background px-4 lg:h-full lg:min-h-0 lg:border-b-0 lg:px-5"
        >
            <div className="flex items-center justify-between border-b border-border py-2">
                <div className="flex min-w-0 items-center gap-2">
                    <Link
                        href="/dashboard/hosts/events"
                        aria-label="Back to events"
                        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Home size={14} />
                    </Link>
                    <p className="min-w-0 truncate text-xs font-medium text-foreground" title={event.eventName}>
                        {event.eventName}
                    </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-label="Switch event chat"
                            className="ml-3 flex shrink-0 items-center gap-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                            <MessageSquare size={16} />
                            <ChevronDown size={13} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 bg-background text-foreground">
                        <DropdownMenuLabel>Other events</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {otherEvents.length === 0 ? (
                            <div className="px-2 py-2 text-xs text-muted-foreground">No other events yet.</div>
                        ) : (
                            otherEvents.map((otherEvent) => (
                                <DropdownMenuItem
                                    key={otherEvent.id}
                                    onSelect={() => router.push(`/dashboard/hosts/events/${otherEvent.id}`)}
                                    className="cursor-pointer"
                                >
                                    <span className="truncate">{otherEvent.eventName}</span>
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="hide-scrollbar flex-1 overflow-y-auto py-4">
                {messages.map((message, index) => (
                    <div key={message.id || `${message.role}-${index}`}>
                        <Msg
                            msg={message}
                            onSelectCity={handleSelectCity}
                            activeCity={activeCity}
                            savedVendors={savedVendorIds}
                            allVendorsByCity={allVendorsByCity}
                            onSave={handleSaveVendor}
                            onVendorAction={handleVendorAction}
                            onStoreAction={handleStoreAction}
                            onSuggestion={(suggestion: any) => {
                                if (suggestion?.action === "dismiss_suggestions") {
                                    setShowSuggestions(false);
                                    void sendWithTokenTracking(suggestion.label || "I'm good", suggestion);
                                    return;
                                }
                                void sendWithTokenTracking(suggestion?.label || "Continue", suggestion);
                            }}
                            onFormSubmit={handleFormSubmit}
                            onTicketFormSubmit={handleTicketFormSubmit}
                            onFlightFormSubmit={handleFlightFormSubmit}
                            onCalendarSelect={handleCalendarSelect}
                            liveEvents={liveEvents}
                            selectedEventId={selectedEventId}
                            onEventSelect={setSelectedEventId}
                            onCopy={(messageToCopy: any) => {
                                if (typeof messageToCopy?.content === "string") {
                                    void navigator.clipboard.writeText(messageToCopy.content);
                                }
                            }}
                            onFeedback={async (rating: "up" | "down", messageToRate: any) => {
                                if (!chatId) return;
                                await saveChatFeedback(chatId, {
                                    messageId: messageToRate?.id,
                                    rating,
                                    messageType: messageToRate?.type,
                                    content: typeof messageToRate?.content === "string"
                                        ? messageToRate.content.slice(0, 500)
                                        : "",
                                    userId: currentUser?.uid,
                                });
                            }}
                            onUpgradeToPro={() => undefined}
                            showSuggestions={showSuggestions}
                        />
                    </div>
                ))}

                {typing && (
                    <div className="flex items-end gap-2 pb-4">
                        <img src="/images/logo.png" alt="Waddi" className="h-7 w-7 rounded-full object-cover" />
                        <div className="rounded-2xl border border-border bg-secondary/40 px-3 py-2">
                            <Dots />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} className="h-1" />
            </div>

            <div className="-mx-4 border-t border-border px-4 pb-3 pt-3 lg:-mx-5 lg:px-5">
                <form onSubmit={handleSubmit} className="relative rounded-xl border border-border bg-card">
                    <textarea
                        value={input}
                        onChange={(eventInput) => setInput(eventInput.target.value)}
                        onKeyDown={(eventKey) => {
                            if (eventKey.key === "Enter" && !eventKey.shiftKey) {
                                eventKey.preventDefault();
                                void sendWithTokenTracking(input);
                            }
                        }}
                        placeholder="Ask Waddi about this event..."
                        rows={2}
                        disabled={!chatId || typing}
                        className="min-h-[70px] w-full resize-none bg-transparent px-3.5 pb-10 pt-3 text-sm focus:outline-none"
                    />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <button type="button" className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Add an attachment">
                            <Plus size={16} />
                        </button>
                        <button
                            type="submit"
                            disabled={!chatId || !input.trim() || typing}
                            aria-label="Send message"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
                        >
                            <ArrowRight size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
