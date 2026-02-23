"use client"

import { useState } from "react";
import { TimelineEntry } from "./types";
import { SharedEvent } from "@/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface DayOfTimelineProps {
    events?: SharedEvent[];
    selectedEventId?: string | null;
    onEventChange?: (id: string) => void;
}

export const DayOfTimeline = ({ events = [], selectedEventId, onEventChange }: DayOfTimelineProps) => {
    const [entries, setEntries] = useState<TimelineEntry[]>([
        { time: "9:00 AM", label: "Bridal party arrives — hair & makeup begins" },
        { time: "11:30 AM", label: "Vendor setup begins (florals, catering, AV)" },
        { time: "2:30 PM", label: "First look — private garden, east terrace" },
        { time: "3:00 PM", label: "Wedding party portraits" },
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
    ]);
    const [newTime, setNewTime] = useState("");
    const [newLabel, setNewLabel] = useState("");

    const handleAddEntry = () => {
        const time = newTime.trim();
        const label = newLabel.trim();
        if (!time || !label) return;
        setEntries(prev => [...prev, { time, label }]);
        setNewTime("");
        setNewLabel("");
    };

    return (
        <div className="space-y-4">
            {events.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                    <Select value={selectedEventId || undefined} onValueChange={onEventChange}>
                        <SelectTrigger className="w-full h-8 bg-secondary/30 border-border text-[12px] font-medium rounded-lg">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-primary" />
                                <SelectValue placeholder="Context: Select Event" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {events.map((ev) => (
                                <SelectItem key={ev.id} value={ev.id} className="text-[12px]">
                                    {ev.eventName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {!selectedEventId ? (
                <div className="py-8 px-4 border border-dashed border-border rounded-xl bg-secondary/10 flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary">
                        <Calendar size={20} />
                    </div>
                    <div className="text-[13px] font-medium text-foreground">No Event Selected</div>
                    <div className="text-[11px] text-muted-foreground max-w-[200px]">
                        Select an event from the dropdown above to view its day-of itinerary.
                    </div>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2">
                        <input
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAddEntry(); }}
                            placeholder="Time (e.g. 5:30 PM)"
                            className="h-8 w-36 rounded-lg border border-border bg-secondary/20 px-3 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                        />
                        <input
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAddEntry(); }}
                            placeholder="Add itinerary item..."
                            className="h-8 w-full rounded-lg border border-border bg-secondary/20 px-3 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                        />
                        <button
                            onClick={handleAddEntry}
                            disabled={!newTime.trim() || !newLabel.trim()}
                            className="h-8 px-3 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                        >
                            Add
                        </button>
                    </div>

                    <div className="pl-[18px] relative transition-all duration-300">
                        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
                        {entries.map((e, i) => (
                            <div key={`${e.time}-${e.label}-${i}`} className="relative pl-3.5 pb-2.5">
                                <div className="absolute left-[-2px] top-2 w-[7px] h-[7px] rounded-full border-[1.5px] border-primary bg-card" />
                                <div className="text-[11px] text-muted-foreground">{e.time}</div>
                                <div className="text-[13px] text-foreground font-medium">
                                    {e.label}
                                    {e.note && <span className="text-muted-foreground text-[11px] ml-1.5 font-normal">· {e.note}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
