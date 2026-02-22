"use client"

import React from "react";
import { TimelineEntry } from "./types";

export const DayOfTimeline = () => {
    const entries: TimelineEntry[] = [
        { time: "9:00 AM", label: "Bridal party arrives — hair & makeup begins", done: true },
        { time: "11:30 AM", label: "Vendor setup begins (florals, catering, AV)", done: true },
        { time: "2:30 PM", label: "First look — private garden, east terrace", done: true },
        { time: "3:00 PM", label: "Wedding party portraits", done: true },
        { time: "4:30 PM", label: "Guests arrive — cocktail hour begins", note: "Vineyard Trio — pending confirm" },
        { time: "5:15 PM", label: "Ceremony begins at the barrel room steps" },
        { time: "5:45 PM", label: "Cocktail hour continues while party does portraits" },
        { time: "6:30 PM", label: "Guests seated — dinner begins" },
        { time: "7:15 PM", label: "Toasts", note: "TBD: confirm speakers with James" },
        { time: "8:00 PM", label: "First dance + parent dances" },
        { time: "8:30 PM", label: "DJ reception opens — open dancing" },
        { time: "9:30 PM", label: "Cake cutting" },
        { time: "10:00 PM", label: "Late night snacks", note: "TBD: still deciding on station" },
        { time: "11:00 PM", label: "Last dance + send-off (sparkler exit)" },
        { time: "11:30 PM", label: "Venue closes — shuttle departs to hotel" },
    ];

    return (
        <div className="mt-3.5 pl-[18px] relative transition-all duration-300">
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
            {entries.map((e, i) => (
                <div key={i} className="relative pl-3.5 pb-2.5">
                    <div className={`absolute left-[-2px] top-2 w-[7px] h-[7px] rounded-full border-[1.5px] border-primary
            ${e.done ? "bg-primary" : "bg-card"}`}
                    />
                    <div className="text-[11px] text-muted-foreground">{e.time}</div>
                    <div className="text-[13px] text-foreground">
                        {e.label}
                        {e.note && <span className="text-muted-foreground text-[11px] ml-1.5">· {e.note}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
};
