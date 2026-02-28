"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    getVendors,
    getEvents,
    getChatById,
    createChat,
    saveChatMessage,
    saveChatFeedback,
    listenToMessages,
    updateChatMetadata,
    getStoreKits,
    listenToEvents
} from "@/lib/firestore-service";
import { SharedEvent } from "@/lib/types";
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import ChatHeader from "@/components/dashboard/ChatHeader";
import { PricingDialog } from "@/components/dashboard/PricingDialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/dashboard/Sidebar";
import { DEMO_CHAT_HISTORY, INITIAL_MESSAGES, buildVendorsList } from "@/lib/chat-data";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Plus,
    ChevronDown,
    Mic,
    ArrowRight,
} from "lucide-react";
import type { IconType } from "react-icons";
import {
    MdAddCircle,
    MdEvent,
    MdChecklist,
    MdAccountBalanceWallet,
    MdSchedule,
    MdTravelExplore,
    MdAutoAwesome,
    MdStorefront,
} from "react-icons/md";
import { Dots, Msg } from "@/components/dashboard/chat/chat-message-renderers";
import { useChatAgent } from "@/hooks/use-chat-agent";
import { useSavedVendors } from "@/hooks/use-saved-vendors";

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [messages, setMessages] = useState<any[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [activeCity, setActiveCity] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { savedVendorIds, toggleSavedVendor, mergeSavedVendors } = useSavedVendors(currentUser?.uid);
    const [allVendorsByCity, setAllVendorsByCity] = useState<Record<string, any[]>>({});
    const [liveEvents, setLiveEvents] = useState<SharedEvent[]>([]);
    const [storeKits, setStoreKits] = useState<any[]>(() => DEMO_CHAT_HISTORY.filter((kit: any) => kit.published));
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [chatTitle, setChatTitle] = useState("New Chat");
    const [chatMetadata, setChatMetadata] = useState<any>(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [waddiModel, setWaddiModel] = useState<'lite' | 'pro'>('lite');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<any>(null);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const autoPromptSentRef = useRef<string | null>(null);
    const chatIdStr = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "new";
    const canShareChat = chatIdStr !== "new" && !chatIdStr.startsWith("task-");

    useEffect(() => {
        const title = (chatTitle || "New Chat").trim();
        document.title = `${title} | Waddi`;
    }, [chatTitle]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handlePillClick = async (pill: any) => {
        // If pill has an explicit action, route through the action dispatcher
        if (pill.action) {
            const userContent = pill.id === 'store' ? "Browse Store" : (pill.action === 'vendor_search' ? "Show me vendors" : `Show me ${pill.label.toLowerCase()}`);
            send(userContent, pill);
            return;
        }

        // Special handling for My Events to pull from DB
        if (pill.id === 'overview') {
            setTyping(true);
            try {
                if (currentUser) {
                    const refreshedEvents = await getEvents(currentUser.uid);
                    setLiveEvents(refreshedEvents);
                }
            } catch (err) {
                console.error("Failed to refresh events", err);
            }
        }

        // Fallback for static UI views (Overview, Todo, etc)
        // If it's a new chat, use send to ensure it's created and persisted
        const userContent = `Show me ${pill.label.toLowerCase()}`;
        send(userContent, pill);
    };

    const chatQuickActions: { id: string; label: string; icon: IconType; colorClass: string; action?: string }[] = [
        { id: 'start_planning', label: 'Plan', icon: MdAddCircle, colorClass: 'text-emerald-600', action: 'start_planning' },
        { id: 'overview', label: 'My Events', icon: MdEvent, colorClass: 'text-indigo-600' },
        { id: 'todo', label: 'To-do', icon: MdChecklist, colorClass: 'text-violet-600' },
        { id: 'budget', label: 'Budget', icon: MdAccountBalanceWallet, colorClass: 'text-green-600' },
        { id: 'timeline', label: 'Itinerary', icon: MdSchedule, colorClass: 'text-amber-600' },
        { id: 'vendors_search', label: 'Discover Vendors', icon: MdTravelExplore, colorClass: 'text-sky-600', action: 'vendor_search' },
        { id: 'experience', label: 'Experiences', icon: MdAutoAwesome, colorClass: 'text-pink-600', action: 'experience' },
        { id: 'store', label: 'Shop', icon: MdStorefront, colorClass: 'text-orange-600', action: 'start_store' },
    ];

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = listenToEvents(currentUser.uid, (evs) => {
            setLiveEvents(evs);
            setDataLoaded(true);
        });

        // Still need vendors and store kits once
        getVendors().then(v => {
            const cities = ["Lagos", "Accra", "Nairobi", "Cape Town"];
            const vendorsByCity: Record<string, any[]> = {};
            cities.forEach(city => vendorsByCity[city] = buildVendorsList(v, city));
            setAllVendorsByCity(vendorsByCity);
        });

        getStoreKits().then(fetchedStoreKits => {
            const demoKits = DEMO_CHAT_HISTORY.filter((kit: any) => kit.published);
            const dbKitsDeduped = fetchedStoreKits.filter(dbKit => !demoKits.some((demoKit: any) => demoKit.id === dbKit.id));
            setStoreKits([...dbKitsDeduped, ...demoKits]);
        });

        return () => unsubscribe();
    }, [currentUser]);

    useEffect(() => {
        if (!dataLoaded || !currentUser) return;

        const chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
        const isTransientNewChat = chatIdStr === 'new' || chatIdStr.startsWith('task-');

        if (isTransientNewChat) {
            const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
            setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
            setChatTitle("New Chat");
            setActiveCity(null);
            setChatMetadata(null);
            setHistoryLoaded(true);
            return;
        }

        // Fetch chat metadata
        getChatById(chatIdStr).then(chat => {
            if (chat) {
                setChatTitle(chat.title);
                setActiveCity(chat.activeCity);
                setChatMetadata(chat);
                if (chat.savedVendors) mergeSavedVendors(chat.savedVendors);
            } else {
                const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
                setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
                setChatTitle("New Chat");
                setActiveCity(null);
                setChatMetadata(null);
            }
        }).catch((err) => {
            console.error("Failed to load chat metadata:", err);
            const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
            setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
            setChatTitle("New Chat");
            setActiveCity(null);
            setChatMetadata(null);
            setHistoryLoaded(true);
        });

        // Listen for messages in real-time
        const unsubscribe = listenToMessages(
            chatIdStr,
            (msgs) => {
                if (msgs.length > 0) {
                    setMessages(msgs);
                } else {
                    const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
                    setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
                }
                setHistoryLoaded(true);
            },
            (error) => {
                console.error("Failed to listen to chat messages:", error);
                const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
                setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
                setChatTitle("New Chat");
                setActiveCity(null);
                setChatMetadata(null);
                setHistoryLoaded(true);
            }
        );

        return () => unsubscribe();
    }, [params.id, dataLoaded, currentUser]);

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

    const {
        getRouteChatId,
        send,
        addUserMsg,
        addAgentMsg,
        dispatchLogic,
        handleSelectCity,
        handleFormSubmit
    } = useChatAgent({
        paramsId: params.id,
        router,
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
        storeKits
    });

    useEffect(() => {
        const routeChatId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
        const prefillPrompt = (searchParams.get("q") || "").trim();

        if (!prefillPrompt || routeChatId !== "new") return;
        if (!historyLoaded || !dataLoaded || autoPromptSentRef.current === prefillPrompt) return;

        autoPromptSentRef.current = prefillPrompt;
        setInput(prefillPrompt);
        void send(prefillPrompt);
    }, [params.id, searchParams, historyLoaded, dataLoaded, send, setInput]);

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
        const vendorKey = vendor?.id || vendor?.slug || vendor?.name;
        if (!vendorKey) return;
        const isSaved = savedVendorIds.has(vendorKey);
        toggleSavedVendor(vendorKey);
        addAgentMsg({
            content: isSaved
                ? `Removed ${vendor.name} from your saved vendors.`
                : `Saved ${vendor.name}! You can view your saved vendors in the Vendors tab.`,
            type: 'text'
        });
    };

    const resetToNewChat = () => {
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
        setMessages(INITIAL_MESSAGES.map(m => ({ ...m, time: nowStr })));
        setInput("");
        setTyping(false);
        setActiveCity(null);
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
                    sharePath={canShareChat ? `/share/chat/${chatIdStr}` : undefined}
                    onRename={async (newTitle) => {
                        setChatTitle(newTitle);
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
                    onPublish={async (data) => {
                        const chatIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
                        if (chatIdStr !== 'new') {
                            // Resolve publisherName: check saved nickname first
                            let publisherName = currentUser?.displayName || currentUser?.email || "Anonymous";
                            if (currentUser?.uid) {
                                const profileSnap = await getDoc(doc(db, 'userProfiles', currentUser.uid));
                                if (profileSnap.exists() && profileSnap.data().nickname) {
                                    publisherName = profileSnap.data().nickname;
                                }
                            }
                            const newMetaData = {
                                published: true,
                                title: data.title,
                                city: data.city,
                                category: data.category,
                                price: data.price,
                                description: data.description,
                                image: data.image || "/images/logo.png",
                                publisherName: currentUser?.displayName || currentUser?.email || "Anonymous",
                                rating: "5.0",
                                runs: 1
                            };
                            await updateChatMetadata(chatIdStr, newMetaData);
                            setChatMetadata((prev: any) => ({ ...prev, ...newMetaData }));
                        }
                    }}
                    initialPublishData={chatMetadata ? {
                        city: chatMetadata.city,
                        price: chatMetadata.price,
                        description: chatMetadata.description,
                        category: chatMetadata.category,
                        image: chatMetadata.image
                    } : undefined}
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
                                savedVendors={savedVendorIds}
                                allVendorsByCity={allVendorsByCity}
                                onSuggestion={(s: any) => {
                                    send(s.label, s);
                                }}
                                onCopy={(msg: any) => {
                                    const content = typeof msg?.content === "string" ? msg.content : "";
                                    if (!content) return;
                                    navigator.clipboard.writeText(content);
                                }}
                                onFeedback={async (rating: "up" | "down", msg: any) => {
                                    const chatId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : 'new';
                                    if (!chatId || chatId === "new") return;
                                    const content = typeof msg?.content === "string" ? msg.content : "";
                                    await saveChatFeedback(chatId, {
                                        messageId: msg?.id,
                                        rating,
                                        messageType: msg?.type,
                                        content: content.slice(0, 500),
                                        userId: currentUser?.uid
                                    });
                                }}
                                onStoreAction={handleStoreAction}
                                onVendorAction={handleVendorAction}
                                onSave={handleSaveVendor}
                                onFormSubmit={handleFormSubmit}
                                onCalendarSelect={handleCalendarSelect}
                                liveEvents={liveEvents}
                                selectedEventId={selectedEventId}
                                onEventSelect={setSelectedEventId}
                                onUpgradeToPro={() => setIsPricingOpen(true)}
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

            <div className="bg-background/80 backdrop-blur-md pt-2">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="relative bg-card rounded-[24px] shadow-sm overflow-hidden transition-all">
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="h-9 px-3 text-[12px] font-semibold text-foreground border border-border rounded-lg bg-card hover:bg-secondary transition-colors inline-flex items-center gap-1.5">
                                            Actions
                                            <ChevronDown size={14} className="text-muted-foreground" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-52 p-1 bg-background">
                                        {chatQuickActions.map((pill) => (
                                            <DropdownMenuItem
                                                key={pill.id}
                                                onClick={() => handlePillClick(pill)}
                                                className="flex items-center gap-2 cursor-pointer py-2 text-foreground"
                                            >
                                                <pill.icon size={16} className={pill.colorClass} />
                                                <span className="text-sm font-medium">{pill.label}</span>
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
                    <p className="text-[11px] text-muted-foreground mt-3 text-center opacity-60 hidden md:block">
                        Waddi can access vendors, contracts, and guest data for this event
                    </p>
                </div>
            </div>
        </div>
    );
}
