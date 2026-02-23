"use client"

import { useState, useEffect } from "react";
import { SharedEvent } from "@/lib/types";
import { updateEvent } from "@/lib/firestore-service";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ListChecks, Trash2 } from "lucide-react";

interface TaskChecklistProps {
    events?: SharedEvent[];
    selectedEventId?: string | null;
    onEventChange?: (id: string) => void;
}

const DEFAULT_TASKS = [
    "Sign photography contract — deposit due Mar 25",
    "Confirm final menu selections with Harvest Table Catering",
    "Finalize floral mockup review with Bloom & Branch",
    "Send RSVP reminder #2",
    "Book hotel room block — The Inn at Napa Valley",
    "Confirm shuttle logistics between venue and hotel",
    "Order wedding favors — finalize packaging",
];

export const TaskChecklist = ({ events = [], selectedEventId, onEventChange }: TaskChecklistProps) => {
    const selectedEvent = events.find(e => e.id === selectedEventId);
    const [items, setItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");

    // Initialize items from event data or default
    useEffect(() => {
        if (selectedEvent) {
            setItems(selectedEvent.todoList || []);
        } else {
            setItems([]);
        }
    }, [selectedEvent]);

    const handleAddItem = async () => {
        const next = newItem.trim();
        if (!next || !selectedEventId) return;

        const updatedItems = [...items, next];
        setItems(updatedItems);
        setNewItem("");

        try {
            await updateEvent(selectedEventId, { todoList: updatedItems });
        } catch (err) {
            console.error("Failed to update checklist", err);
            // Revert on failure? For now just log
        }
    };

    const handleDeleteItem = async (index: number) => {
        if (!selectedEventId) return;
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        try {
            await updateEvent(selectedEventId, { todoList: updatedItems });
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    return (
        <div className="space-y-4 shadow-sm">
            {events.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                    <Select value={selectedEventId || undefined} onValueChange={onEventChange}>
                        <SelectTrigger className="w-full h-8 bg-secondary/30 border-border text-[12px] font-medium rounded-lg">
                            <div className="flex items-center gap-2">
                                <ListChecks size={14} className="text-primary" />
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
                        <ListChecks size={20} />
                    </div>
                    <div className="text-[13px] font-medium text-foreground">No Event Selected</div>
                    <div className="text-[11px] text-muted-foreground max-w-[200px]">
                        Select an event from the dropdown above to view its task checklist.
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2">
                        <input
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAddItem(); }}
                            placeholder="Add to-do item..."
                            className="h-8 w-full rounded-lg border border-border bg-secondary/20 px-3 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                        />
                        <button
                            onClick={handleAddItem}
                            disabled={!newItem.trim()}
                            className="h-8 px-3 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {items.length > 0 ? (
                            items.map((item, idx) => (
                                <div key={`${item}-${idx}`} className="flex items-center justify-between group py-1.5 px-2 hover:bg-secondary/20 rounded-lg transition-colors">
                                    <div className="flex items-start gap-2.5 text-[13px] leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                        <span className="text-foreground font-medium">{item}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteItem(idx)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-[11px] text-muted-foreground text-center py-4">
                                No tasks yet. Start planning!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
