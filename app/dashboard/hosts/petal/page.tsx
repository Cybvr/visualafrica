"use client"
import { useState, useRef, useEffect } from "react";

import {
    Message,
    EventOverviewCard,
    VendorGrid,
    TaskChecklist,
    DayOfTimeline,
    TypingIndicator,
    ActionBtn
} from "@/components/dashboard/chat";

// ─── Animations (keyframes only — no theme vars) ──────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes typingPulse {
    0%, 80%, 100% { opacity: .3; transform: scale(.9); }
    40%           { opacity: 1;  transform: scale(1.1); }
  }
  .msg-animate { animation: fadeUp 0.3s ease forwards; opacity: 0; }
  .font-display { font-family: 'Playfair Display', serif; }
  .font-sans-dm { font-family: 'DM Sans', sans-serif; }
`;

// ─── Initial messages ─────────────────────────────────────────────────────────

const buildInitialMessages = (): Message[] => [
    {
        id: 1, role: "agent", timestamp: "10:14 AM",
        content: (
            <>
                <p className="mb-2.5">Good morning, Sophie! I've pulled together everything from our last session. Here's where the Harrington Wedding currently stands:</p>
                <EventOverviewCard />
                <p className="mt-3.5">Your photography contract is still unsigned — I'd flag that as the one thing to close this week before the deposit deadline on March 25th. Want me to draft a follow-up to Marcus Leigh Photography?</p>
            </>
        ),
    },
    {
        id: 2, role: "user", timestamp: "10:18 AM",
        content: "Yes please do that. Also, I was thinking of adding a live band for cocktail hour in addition to the DJ for the reception. Can you find some options around Napa? Budget's flexible, probably up to $3,500 for the cocktail set.",
    },
    {
        id: 3, role: "agent", timestamp: "10:19 AM",
        content: (
            <>
                <p className="mb-2.5">On it — I've drafted the Marcus Leigh follow-up and queued it for your review.</p>
                <p>For cocktail hour, here are three live bands available June 14 within budget. I checked against Sunstone's approved vendor list — all three are on it:</p>
                <VendorGrid />
                <p className="mt-3.5">The Vineyard Trio would be my pick for a Napa vineyard setting — their repertoire is dialed in for that atmosphere, and they've played Sunstone twice. The Aurelio Quartet is stunning but more suited to a formal indoor space than an outdoor cocktail lawn.</p>
                <div className="flex gap-2 mt-3.5 flex-wrap">
                    <ActionBtn primary>Request availability</ActionBtn>
                    <ActionBtn>See set lists</ActionBtn>
                    <ActionBtn>Compare in detail</ActionBtn>
                </div>
            </>
        ),
    },
    {
        id: 4, role: "user", timestamp: "10:23 AM",
        content: "Let's go with The Vineyard Trio. Go ahead and request the date hold. Also what's left on the planning checklist? We're 113 days out — want to make sure we're not missing anything urgent.",
    },
    {
        id: 5, role: "agent", timestamp: "10:24 AM",
        content: (
            <>
                <p>Date hold request sent to The Vineyard Trio — I'll notify you when they confirm (usually within 24hrs). Added to budget: $2,800, leaving you $3,700 in flex budget.</p>
                <p className="mt-2.5">Here's your full checklist, sorted by urgency:</p>
                <TaskChecklist />
                <p className="mt-3.5">The photography contract is the only thing I'm genuinely worried about — Marcus typically releases held dates if paperwork isn't signed 8 weeks before the event, and you're approaching that. I'd prioritize that above everything else today.</p>
            </>
        ),
    },
    {
        id: 6, role: "user", timestamp: "10:28 AM",
        content: "What does the day-of itinerary look like right now? I want to review it with James tonight.",
    },
    {
        id: 7, role: "agent", timestamp: "10:28 AM",
        content: (
            <>
                <p>Here's the current day-of draft. A few slots are still TBD — I've flagged them:</p>
                <DayOfTimeline />
                <div className="flex gap-2 mt-3.5 flex-wrap">
                    <ActionBtn primary>Export itinerary PDF</ActionBtn>
                    <ActionBtn>Edit itinerary</ActionBtn>
                    <ActionBtn>Share with James</ActionBtn>
                </div>
            </>
        ),
    },
];


// ─── Main component ───────────────────────────────────────────────────────────

export default function EventAgentChat() {
    const [messages, setMessages] = useState<Message[]>(buildInitialMessages());
    const [inputVal, setInputVal] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const sendMessage = () => {
        const text = inputVal.trim();
        if (!text) return;
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [...prev, { id: Date.now(), role: "user", timestamp: now, content: text }]);
        setInputVal("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1, role: "agent",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                content: <p>Got it — I'm pulling the relevant details now. In a live session I'd have full access to your vendor contracts, guest list, and budget.</p>,
            }]);
        }, 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputVal(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans-dm">
            <style>{GLOBAL_CSS}</style>

            {/* ── Main chat ─────────────────────────────── */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Topbar */}
                <div className="px-7 py-4 border-b border-border bg-card flex items-center justify-between flex-shrink-0">
                    <div>
                        <div className="font-display text-[18px] font-normal text-foreground">Harrington Wedding</div>
                        <div className="text-xs text-muted-foreground mt-0.5">June 14, 2026 · Napa Valley, CA · ~180 guests</div>
                    </div>
                    <div className="flex gap-2">
                        {[
                            <path key="dl" d="M7.5 1v9M4 7l3.5 3L11 7M2 12h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
                            <><circle key="sh1" cx="11.5" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3" /><circle key="sh2" cx="3.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.3" /><circle key="sh3" cx="11.5" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.3" /><path key="sh4" d="M5 6.7l5-2.5M5 8.3l5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></>,
                            <><circle key="cg1" cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3" /><path key="cg2" d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.9 2.9l1.1 1.1M11 11l1.1 1.1M2.9 12.1l1.1-1.1M11 4l1.1-1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></>,
                        ].map((paths, i) => (
                            <button key={i} className="w-[34px] h-[34px] rounded-lg bg-transparent border border-border text-muted-foreground cursor-pointer flex items-center justify-center text-sm transition-all hover:border-primary hover:text-primary">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">{paths}</svg>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-7 flex flex-col">
                    <div className="text-center text-muted-foreground text-[11px] tracking-widest uppercase py-3">
                        3 days ago — March 19
                    </div>

                    {messages.map((msg, idx) => (
                        <div
                            key={msg.id}
                            className={`msg-animate px-7 py-1.5 flex gap-3.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            style={{ animationDelay: `${Math.min(idx, 8) * 0.05}s` }}
                        >
                            {/* Avatar */}
                            <div className={`w-[30px] h-[30px] rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-semibold
                ${msg.role === "agent"
                                    ? "bg-muted border border-border text-primary font-display text-sm font-normal"
                                    : "bg-primary text-primary-foreground"
                                }`}
                            >
                                {msg.role === "agent" ? "P" : "SH"}
                            </div>

                            {/* Bubble */}
                            <div className="max-w-[680px] min-w-0">
                                <div className={`text-[11px] text-muted-foreground mb-1 flex items-center gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <span className="font-medium">{msg.role === "agent" ? "Petal" : "Sophie"}</span>
                                    <span className="opacity-60">{msg.timestamp}</span>
                                </div>
                                <div className={`border border-border px-[18px] py-3.5 text-sm leading-relaxed text-foreground
                  ${msg.role === "agent"
                                        ? "bg-card rounded-[4px_14px_14px_14px]"
                                        : "bg-muted rounded-[14px_4px_14px_14px]"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="msg-animate px-7 py-1.5 flex gap-3.5" style={{ animationDelay: "0s" }}>
                            <div className="w-[30px] h-[30px] rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center bg-muted border border-border text-primary font-display text-sm">
                                P
                            </div>
                            <div>
                                <div className="text-[11px] text-muted-foreground mb-1 font-medium">Petal</div>
                                <TypingIndicator />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-7 pb-5 pt-4 border-t border-border bg-card flex-shrink-0">
                    <div className="bg-background border border-border rounded-[14px] px-3.5 py-2.5 flex items-end gap-2.5 focus-within:border-primary/40 transition-colors">
                        <textarea
                            ref={textareaRef}
                            value={inputVal}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Petal anything about this event…"
                            rows={1}
                            className="flex-1 bg-transparent border-none outline-none text-foreground font-sans-dm text-sm resize-none min-h-[22px] max-h-[120px] leading-relaxed py-0.5 placeholder:text-muted-foreground"
                        />
                        <div className="flex gap-1.5 items-center flex-shrink-0">
                            <button className="w-7 h-7 rounded-md bg-transparent border-none text-muted-foreground cursor-pointer flex items-center justify-center hover:text-primary transition-colors">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                    <path d="M12 7L7.5 11.5C6.1 12.9 3.9 12.9 2.5 11.5C1.1 10.1 1.1 7.9 2.5 6.5L7.5 1.5C8.5 0.5 10.1 0.5 11.1 1.5C12.1 2.5 12.1 4.1 11.1 5.1L6 10.2C5.4 10.8 4.5 10.8 3.9 10.2C3.3 9.6 3.3 8.7 3.9 8.1L8.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                            </button>
                            <button
                                onClick={sendMessage}
                                className="w-[34px] h-[34px] rounded-[10px] bg-primary text-primary-foreground border-none cursor-pointer flex items-center justify-center flex-shrink-0 hover:opacity-85 transition-opacity"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 13V1M1 7l6-6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2 text-center opacity-60">
                        Petal can access vendors, contracts, and guest data for this event
                    </p>
                </div>
            </main>

            {/* ── Right panel ───────────────────────────── */}
            <aside className="w-[300px] bg-card border-l border-border flex flex-col flex-shrink-0">
                <div className="p-5 border-b border-border font-display text-sm text-foreground">
                    Event Overview
                </div>

                <div className="px-5 py-4 border-b border-border">
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2.5">Status</div>
                    {[["Budget used", "$48,500"], ["Remaining", "$6,500"], ["Tasks complete", "5 / 14"], ["RSVPs in", "142 / 178"], ["Vendors locked", "7 / 9"]].map(([k, v], i) => (
                        <div key={k} className="flex justify-between text-[13px] mb-1.5">
                            <span className="text-muted-foreground text-xs">{k}</span>
                            <span className={i === 1 ? "text-primary" : "text-foreground"}>{v}</span>
                        </div>
                    ))}
                    <div className="h-[3px] bg-muted rounded-full overflow-hidden mt-1.5">
                        <div className="h-full w-[88%] bg-primary rounded-full" />
                    </div>
                </div>

                <div className="px-5 py-4 border-b border-border">
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2.5">Open Actions</div>
                    <div className="flex flex-col gap-2">
                        {[
                            { text: "Sign photo contract", sym: "!", symCls: "border-destructive text-destructive", done: false },
                            { text: "Finalize catering menu", sym: "!", symCls: "border-yellow-500 text-yellow-500", done: false },
                            { text: "Floral mockup review", sym: "", symCls: "border-border text-muted-foreground", done: false },
                            { text: "Book hotel room block", sym: "", symCls: "border-border text-muted-foreground", done: false },
                            { text: "Send RSVP reminder #2", sym: "", symCls: "border-border text-muted-foreground", done: false },
                            { text: "DJ confirmed", sym: "✓", symCls: "border-primary/40 text-primary bg-primary/10", done: true },
                            { text: "Venue signed", sym: "✓", symCls: "border-primary/40 text-primary bg-primary/10", done: true },
                        ].map(item => (
                            <div key={item.text} className={`flex items-center gap-2 text-xs ${item.done ? "text-foreground" : "text-muted-foreground"}`}>
                                <div className={`w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center text-[8px] border-[1.5px] ${item.symCls}`}>
                                    {item.sym}
                                </div>
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-5 py-4 flex-1 overflow-y-auto">
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2.5">Upcoming Deadlines</div>
                    {[
                        { d: "25", m: "Mar", title: "Photo contract deposit", sub: "Marcus Leigh Photography" },
                        { d: "10", m: "Apr", title: "Floral mockup deadline", sub: "Bloom & Branch Studio" },
                        { d: "18", m: "Apr", title: "Final headcount to caterer", sub: "Harvest Table Catering" },
                        { d: "1", m: "May", title: "Final venue walk-through", sub: "Sunstone Winery" },
                        { d: "14", m: "Jun", title: "Wedding Day", sub: "Sunstone Winery, Napa", accent: true },
                    ].map(item => (
                        <div key={item.d + item.m} className="flex gap-2.5 py-2 border-b border-border last:border-0">
                            <div className="text-center w-7 flex-shrink-0">
                                <div className="font-display text-base text-primary leading-none">{item.d}</div>
                                <div className="text-[9px] text-muted-foreground uppercase tracking-widest">{item.m}</div>
                            </div>
                            <div>
                                <div className={`text-xs ${item.accent ? "text-primary" : "text-foreground"}`}>{item.title}</div>
                                <div className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}