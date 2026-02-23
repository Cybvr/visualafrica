"use client"

import { useState, useEffect } from "react";
import { TimelineEntry, SharedEvent } from "@/lib/types";
import { updateEvent } from "@/lib/firestore-service";
import { processGeminiChat } from "@/app/actions/gemini-chat";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Calendar, Trash2 } from "lucide-react";

interface DayOfTimelineProps {
    events?: SharedEvent[];
    selectedEventId?: string | null;
    onEventChange?: (id: string) => void;
    onUpgradeToPro?: () => void;
}

export const DayOfTimeline = ({ events = [], selectedEventId, onEventChange, onUpgradeToPro }: DayOfTimelineProps) => {
    const selectedEvent = events.find(e => e.id === selectedEventId);
    const [entries, setEntries] = useState<TimelineEntry[]>([]);
    const [newTime, setNewTime] = useState("");
    const [newLabel, setNewLabel] = useState("");
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestError, setSuggestError] = useState<string | null>(null);
    const AI_SUGGESTION_LIMIT = 3;
    const usedSuggestions = Number(selectedEvent?.aiItinerarySuggestionsUsed || 0);
    const remainingSuggestions = Math.max(0, AI_SUGGESTION_LIMIT - usedSuggestions);

    // Initialize entries from event data
    useEffect(() => {
        if (selectedEvent) {
            setEntries(selectedEvent.itineraryItems || []);
        } else {
            setEntries([]);
        }
    }, [selectedEvent]);

    const handleAddEntry = async () => {
        const time = newTime.trim();
        const label = newLabel.trim();
        if (!time || !label || !selectedEventId) return;

        const newEntry: TimelineEntry = { time, label };
        const updatedEntries = [...entries, newEntry];
        setEntries(updatedEntries);
        setNewTime("");
        setNewLabel("");

        try {
            await updateEvent(selectedEventId, { itineraryItems: updatedEntries });
        } catch (err) {
            console.error("Failed to update itinerary", err);
        }
    };

    const handleDeleteEntry = async (index: number) => {
        if (!selectedEventId) return;
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
        try {
            await updateEvent(selectedEventId, { itineraryItems: updatedEntries });
        } catch (err) {
            console.error("Failed to delete itinerary entry", err);
        }
    };

    const handleSuggestSlots = async () => {
        if (!selectedEventId || !selectedEvent || remainingSuggestions <= 0 || isSuggesting) return;
        setIsSuggesting(true);
        setSuggestError(null);

        try {
            const result = await processGeminiChat(
                [{
                    role: "user",
                    parts: [{
                        text: `Suggest up to ${remainingSuggestions} realistic itinerary slots for this event.
Event: ${selectedEvent.eventName}
Date: ${selectedEvent.date || "not set"}
City: ${selectedEvent.location}
Guests: ${selectedEvent.guestCount}
Budget: ${selectedEvent.budget}
Existing itinerary: ${entries.length > 0 ? entries.map((e) => `${e.time} ${e.label}`).join(" | ") : "none"}

Rules:
- Use add_itinerary_item function calls only.
- Return at most ${remainingSuggestions} calls.
- Include a clear time and label.
- Avoid duplicates with existing itinerary items.`
                    }]
                }],
                { forceFunctionCall: true, allowedFunctionNames: ["add_itinerary_item"] }
            );

            if (!result || result.type !== "function_call") {
                setSuggestError("AI could not generate itinerary slots right now.");
                return;
            }

            const slots: TimelineEntry[] = ((result as any).functionCalls || [])
                .filter((call: any) => call?.name === "add_itinerary_item")
                .map((call: any) => {
                    const time = String(call?.args?.time || "").trim();
                    const label = String(call?.args?.label || "").trim();
                    const note = String(call?.args?.note || "").trim();
                    if (!time || !label) return null;
                    return note ? { time, label, note } : { time, label };
                })
                .filter(Boolean);

            const deduped = slots.filter((slot: TimelineEntry, idx: number) =>
                slots.findIndex((x: TimelineEntry) =>
                    x.time.toLowerCase() === slot.time.toLowerCase() &&
                    x.label.toLowerCase() === slot.label.toLowerCase()
                ) === idx &&
                !entries.some((existing) =>
                    existing.time.toLowerCase() === slot.time.toLowerCase() &&
                    existing.label.toLowerCase() === slot.label.toLowerCase()
                )
            );

            const toAdd = deduped.slice(0, remainingSuggestions);
            if (toAdd.length === 0) {
                setSuggestError("No new slots found. Try again after adding more event details.");
                return;
            }

            const updatedEntries = [...entries, ...toAdd];
            const nextUsed = usedSuggestions + toAdd.length;
            setEntries(updatedEntries);
            await updateEvent(selectedEventId, {
                itineraryItems: updatedEntries,
                aiItinerarySuggestionsUsed: nextUsed
            });
        } catch (err) {
            console.error("Failed to suggest itinerary slots", err);
            setSuggestError("AI request failed. Please try again.");
        } finally {
            setIsSuggesting(false);
        }
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
                        {entries.length > 0 ? (
                            entries.map((e, i) => (
                                <div key={`${e.time}-${e.label}-${i}`} className="relative pl-3.5 pb-2.5 group hover:bg-secondary/20 rounded-lg transition-colors">
                                    <div className="absolute left-[-2px] top-2 w-[7px] h-[7px] rounded-full border-[1.5px] border-primary bg-card" />
                                    <div className="flex items-center justify-between px-2">
                                        <div>
                                            <div className="text-[11px] text-muted-foreground">{e.time}</div>
                                            <div className="text-[13px] text-foreground font-medium">
                                                {e.label}
                                                {e.note && <span className="text-muted-foreground text-[11px] ml-1.5 font-normal">· {e.note}</span>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteEntry(i)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-[11px] text-muted-foreground text-center py-4">
                                No itinerary items yet.
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSuggestSlots}
                        disabled={isSuggesting || remainingSuggestions <= 0}
                        className="h-8 w-full rounded-lg border border-border bg-secondary/40 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                        {remainingSuggestions > 0
                            ? (isSuggesting ? "Suggesting..." : `Suggest Next Slots (${remainingSuggestions} left)`)
                            : "Limit Reached"}
                    </button>

                    {remainingSuggestions <= 0 && (
                        <div className="text-[11px] flex items-center justify-between gap-2 rounded-lg border border-amber-400/30 bg-amber-50/40 px-3 py-2">
                            <span className="text-amber-700">Free limit reached. Upgrade for unlimited AI itinerary suggestions.</span>
                            <button
                                onClick={onUpgradeToPro}
                                className="shrink-0 h-7 px-2.5 rounded-md border border-amber-500/40 bg-white text-[11px] font-semibold text-amber-700 hover:bg-amber-100/50 transition-colors"
                            >
                                Switch to Waddi Pro
                            </button>
                        </div>
                    )}

                    {suggestError && (
                        <div className="text-[11px] text-destructive">{suggestError}</div>
                    )}
                </div>
            )}
        </div>
    );
};
