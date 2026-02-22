"use client"

import { useState } from "react";

export const TaskChecklist = () => {
    const [checked, setChecked] = useState<Set<string>>(new Set(["venue", "dj", "invites", "makeup", "officiant"]));
    const toggle = (id: string) => setChecked(prev => {
        const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
    });

    const sections = [
        {
            label: "🔴 Overdue / This Week",
            items: [
                { id: "photo-contract", text: <>Sign photography contract — deposit due <strong>Mar 25</strong></> },
                { id: "catering-menu", text: "Confirm final menu selections with Harvest Table Catering" },
            ],
        },
        {
            label: "🟡 Next 30 Days",
            items: [
                { id: "floral", text: "Finalize floral mockup review with Bloom & Branch (Apr 10 deadline)" },
                { id: "rsvp", text: "Send RSVP reminder #2 — currently 142/178 responded" },
                { id: "hotel", text: "Book hotel room block — The Inn at Napa Valley" },
                { id: "shuttle", text: "Confirm shuttle logistics between venue and hotel" },
                { id: "favors", text: "Order wedding favors — decision needed on packaging" },
            ],
        },
        {
            label: "✅ Completed",
            items: [
                { id: "venue", text: "Venue contract signed — Sunstone Winery" },
                { id: "dj", text: "DJ booked — Echo Sound (reception)" },
                { id: "invites", text: "Invitations sent — Mar 12" },
                { id: "makeup", text: "Hair & makeup artist booked (bridal party)" },
                { id: "officiant", text: "Officiant confirmed" },
            ],
        },
    ];

    return (
        <div className="mt-3.5 flex flex-col gap-3.5">
            {sections.map(s => (
                <div key={s.label}>
                    <div className="text-[11px] tracking-widest uppercase text-muted-foreground mb-2">{s.label}</div>
                    <div className="flex flex-col gap-1.5">
                        {s.items.map(item => {
                            const done = checked.has(item.id);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => toggle(item.id)}
                                    className="flex items-start gap-2.5 text-[13px] cursor-pointer leading-relaxed"
                                >
                                    <div className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center text-[9px] transition-all border-[1.5px]
                    ${done
                                            ? "bg-primary/10 border-primary/40 text-primary"
                                            : "bg-transparent border-border text-primary"
                                        }`}
                                    >
                                        {done ? "✓" : ""}
                                    </div>
                                    <span className={done ? "text-muted-foreground line-through" : "text-foreground"}>
                                        {item.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
