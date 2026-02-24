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
import { Calendar, Check, Download, Pencil, Trash2, X } from "lucide-react";

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
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingTime, setEditingTime] = useState("");
    const [editingLabel, setEditingLabel] = useState("");
    const [editingNote, setEditingNote] = useState("");
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestError, setSuggestError] = useState<string | null>(null);
    const AI_SUGGESTION_LIMIT = 3;
    const usedSuggestions = Number(selectedEvent?.aiItinerarySuggestionsUsed || 0);
    const remainingSuggestions = Math.max(0, AI_SUGGESTION_LIMIT - usedSuggestions);

    const escapeIcsText = (value: string) =>
        value
            .replace(/\\/g, "\\\\")
            .replace(/\n/g, "\\n")
            .replace(/,/g, "\\,")
            .replace(/;/g, "\\;");

    const formatUtcForIcs = (date: Date) => {
        const pad = (num: number) => String(num).padStart(2, "0");
        return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
    };

    const parseDateAndTime = (dateText: string, timeText: string) => {
        const base = new Date(dateText);
        if (Number.isNaN(base.getTime())) return null;

        const trimmed = timeText.trim();
        let hours = 0;
        let minutes = 0;
        const ampmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
        const twentyFourMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);

        if (ampmMatch) {
            hours = Number(ampmMatch[1]);
            minutes = Number(ampmMatch[2] || 0);
            const period = ampmMatch[3].toUpperCase();
            if (hours === 12) hours = 0;
            if (period === "PM") hours += 12;
        } else if (twentyFourMatch) {
            hours = Number(twentyFourMatch[1]);
            minutes = Number(twentyFourMatch[2]);
        } else {
            return null;
        }

        if (hours > 23 || minutes > 59) return null;
        const parsed = new Date(base);
        parsed.setHours(hours, minutes, 0, 0);
        return parsed;
    };

    const handleDownloadIcs = () => {
        if (!selectedEvent || entries.length === 0) return;

        const dtStamp = formatUtcForIcs(new Date());
        const icsEvents: string[] = [];

        entries.forEach((entry, index) => {
            const start = parseDateAndTime(selectedEvent.date, entry.time);
            if (!start) return;
            const end = new Date(start.getTime() + 60 * 60 * 1000);
            const uid = `${selectedEvent.id}-${index}-${start.getTime()}@visualafrica`;
            const descriptionParts = [entry.note?.trim(), `Event: ${selectedEvent.eventName}`].filter(Boolean);

            icsEvents.push(
                "BEGIN:VEVENT",
                `UID:${uid}`,
                `DTSTAMP:${dtStamp}`,
                `DTSTART:${formatUtcForIcs(start)}`,
                `DTEND:${formatUtcForIcs(end)}`,
                `SUMMARY:${escapeIcsText(entry.label)}`,
                `DESCRIPTION:${escapeIcsText(descriptionParts.join(" | "))}`,
                `LOCATION:${escapeIcsText(selectedEvent.location || "TBD")}`,
                "END:VEVENT"
            );
        });

        if (icsEvents.length === 0) {
            alert("Could not generate calendar file. Check event date and itinerary times.");
            return;
        }

        const fileBody = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//VisualAfrica//Event Itinerary//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            `X-WR-CALNAME:${escapeIcsText(`${selectedEvent.eventName} Itinerary`)}`,
            ...icsEvents,
            "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([fileBody], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        const safeName = (selectedEvent.eventName || "event").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        anchor.href = url;
        anchor.download = `${safeName}-itinerary.ics`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
    };

    // Initialize entries from event data
    useEffect(() => {
        if (selectedEvent) {
            setEntries(selectedEvent.itineraryItems || []);
        } else {
            setEntries([]);
        }
        setEditingIndex(null);
        setEditingTime("");
        setEditingLabel("");
        setEditingNote("");
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
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditingTime("");
            setEditingLabel("");
            setEditingNote("");
        }
        try {
            await updateEvent(selectedEventId, { itineraryItems: updatedEntries });
        } catch (err) {
            console.error("Failed to delete itinerary entry", err);
        }
    };

    const handleStartEdit = (index: number) => {
        const entry = entries[index];
        if (!entry) return;
        setEditingIndex(index);
        setEditingTime(entry.time || "");
        setEditingLabel(entry.label || "");
        setEditingNote(entry.note || "");
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditingTime("");
        setEditingLabel("");
        setEditingNote("");
    };

    const handleSaveEdit = async (index: number) => {
        if (!selectedEventId) return;
        const time = editingTime.trim();
        const label = editingLabel.trim();
        const note = editingNote.trim();
        if (!time || !label) return;

        const updatedEntries = entries.map((entry, i) => (
            i === index
                ? (note ? { ...entry, time, label, note } : { ...entry, time, label, note: undefined })
                : entry
        ));

        setEntries(updatedEntries);
        setEditingIndex(null);
        setEditingTime("");
        setEditingLabel("");
        setEditingNote("");

        try {
            await updateEvent(selectedEventId, { itineraryItems: updatedEntries });
        } catch (err) {
            console.error("Failed to update itinerary entry", err);
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
                                <SelectValue placeholder="Select Event" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {events.map((ev) => (
                                <SelectItem key={ev.id} value={ev.id} className="text-[12px] text-foreground">
                                    {ev.eventName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {!selectedEventId ? (
                <div className="py-8 px-4 border border-dashed border-border rounded-xl bg-secondary/10 flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-foreground">
                        <Calendar size={20} />
                    </div>
                    <div className="text-[13px] font-medium text-foreground">No Event Selected</div>
                    <div className="text-[11px] text-muted-foreground max-w-[200px]">
                        Select an event from the dropdown above to view its day-of itinerary.
                    </div>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex justify-end">
                        <button
                            onClick={handleDownloadIcs}
                            disabled={entries.length === 0}
                            className="h-8 px-3 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                            <Download size={12} />
                            Download .ics
                        </button>
                    </div>
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
                                    {editingIndex === i ? (
                                        <div className="flex items-center gap-2 px-2">
                                            <input
                                                value={editingTime}
                                                onChange={(event) => setEditingTime(event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") handleSaveEdit(i);
                                                    if (event.key === "Escape") handleCancelEdit();
                                                }}
                                                autoFocus
                                                className="h-8 w-28 rounded-lg border border-border bg-secondary/20 px-2 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                                            />
                                            <input
                                                value={editingLabel}
                                                onChange={(event) => setEditingLabel(event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") handleSaveEdit(i);
                                                    if (event.key === "Escape") handleCancelEdit();
                                                }}
                                                className="h-8 w-full rounded-lg border border-border bg-secondary/20 px-2 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                                            />
                                            <input
                                                value={editingNote}
                                                onChange={(event) => setEditingNote(event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") handleSaveEdit(i);
                                                    if (event.key === "Escape") handleCancelEdit();
                                                }}
                                                placeholder="Note (optional)"
                                                className="h-8 w-40 rounded-lg border border-border bg-secondary/20 px-2 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                                            />
                                            <button
                                                onClick={() => handleSaveEdit(i)}
                                                disabled={!editingTime.trim() || !editingLabel.trim()}
                                                className="p-1 text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                                            >
                                                <Check size={12} />
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="p-1 text-muted-foreground hover:text-foreground"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between px-2">
                                            <div>
                                                <div className="text-[11px] text-muted-foreground">{e.time}</div>
                                                <div className="text-[13px] text-foreground font-medium">
                                                    {e.label}
                                                    {e.note && <span className="text-muted-foreground text-[11px] ml-1.5 font-normal">· {e.note}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleStartEdit(i)}
                                                    className="p-1 hover:text-foreground transition-colors"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEntry(i)}
                                                    className="p-1 hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
