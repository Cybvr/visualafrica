"use client"

import { useState, useEffect } from "react";
import { SharedEvent } from "@/lib/types";
import { updateEvent } from "@/lib/firestore-service";
import { processGeminiChat } from "@/app/actions/gemini-chat";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Check, ListChecks, Pencil, Trash2, X } from "lucide-react";

interface TaskChecklistProps {
    events?: SharedEvent[];
    selectedEventId?: string | null;
    onEventChange?: (id: string) => void;
    onUpgradeToPro?: () => void;
}

export const TaskChecklist = ({ events = [], selectedEventId, onEventChange, onUpgradeToPro }: TaskChecklistProps) => {
    const selectedEvent = events.find(e => e.id === selectedEventId);
    const [items, setItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestError, setSuggestError] = useState<string | null>(null);
    const AI_SUGGESTION_LIMIT = 3;
    const usedSuggestions = Number(selectedEvent?.aiTodoSuggestionsUsed || 0);
    const remainingSuggestions = Math.max(0, AI_SUGGESTION_LIMIT - usedSuggestions);

    // Initialize items from event data or default
    useEffect(() => {
        if (selectedEvent) {
            setItems(selectedEvent.todoList || []);
        } else {
            setItems([]);
        }
        setEditingIndex(null);
        setEditingValue("");
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
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditingValue("");
        }
        try {
            await updateEvent(selectedEventId, { todoList: updatedItems });
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    const handleStartEdit = (index: number) => {
        setEditingIndex(index);
        setEditingValue(items[index] || "");
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditingValue("");
    };

    const handleSaveEdit = async (index: number) => {
        if (!selectedEventId) return;
        const next = editingValue.trim();
        if (!next) return;

        const updatedItems = items.map((item, i) => (i === index ? next : item));
        setItems(updatedItems);
        setEditingIndex(null);
        setEditingValue("");

        try {
            await updateEvent(selectedEventId, { todoList: updatedItems });
        } catch (err) {
            console.error("Failed to update task", err);
        }
    };

    const handleSuggestTasks = async () => {
        if (!selectedEventId || !selectedEvent || remainingSuggestions <= 0 || isSuggesting) return;
        setIsSuggesting(true);
        setSuggestError(null);

        try {
            const result = await processGeminiChat(
                [{
                    role: "user",
                    parts: [{
                        text: `Suggest up to ${remainingSuggestions} practical next todo items for this event.
Event: ${selectedEvent.eventName}
City: ${selectedEvent.location}
Guests: ${selectedEvent.guestCount}
Budget: ${selectedEvent.budget}
Existing tasks: ${items.length > 0 ? items.join(" | ") : "none"}

Rules:
- Use add_todo_item function calls only.
- Return at most ${remainingSuggestions} calls.
- Do not duplicate existing tasks.
- Keep each item short and specific.`
                    }]
                }],
                { forceFunctionCall: true, allowedFunctionNames: ["add_todo_item"] }
            );

            if (!result || result.type !== "function_call") {
                setSuggestError("AI could not generate suggestions right now.");
                return;
            }

            const calls = ((result as any).functionCalls || [])
                .filter((call: any) => call?.name === "add_todo_item")
                .map((call: any) => String(call?.args?.item || "").trim())
                .filter((item: string) => !!item);

            const deduped = calls.filter((item: string, idx: number) =>
                calls.findIndex((x: string) => x.toLowerCase() === item.toLowerCase()) === idx
                && !items.some(existing => existing.toLowerCase() === item.toLowerCase())
            );
            const toAdd = deduped.slice(0, remainingSuggestions);

            if (toAdd.length === 0) {
                setSuggestError("No new tasks found. Try again after updating your event details.");
                return;
            }

            const updatedItems = [...items, ...toAdd];
            const nextUsed = usedSuggestions + toAdd.length;
            setItems(updatedItems);
            await updateEvent(selectedEventId, {
                todoList: updatedItems,
                aiTodoSuggestionsUsed: nextUsed
            });
        } catch (err) {
            console.error("Failed to suggest todo items", err);
            setSuggestError("AI request failed. Please try again.");
        } finally {
            setIsSuggesting(false);
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
                                <SelectValue placeholder="Select Event" />
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

                    {remainingSuggestions <= 0 && (
                        <div className="text-[11px] flex items-center justify-between gap-2 rounded-lg border border-amber-400/30 bg-amber-50/40 px-3 py-2">
                            <span className="text-amber-700">Free limit reached. Upgrade for unlimited AI task suggestions.</span>
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

                    <div className="flex flex-col gap-1.5">
                        {items.length > 0 ? (
                            items.map((item, idx) => (
                                <div key={`${item}-${idx}`} className="flex items-center justify-between group py-1.5 px-2 hover:bg-secondary/20 rounded-lg transition-colors">
                                    {editingIndex === idx ? (
                                        <div className="flex items-center gap-2 w-full">
                                            <input
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleSaveEdit(idx);
                                                    if (e.key === "Escape") handleCancelEdit();
                                                }}
                                                autoFocus
                                                className="h-8 w-full rounded-lg border border-border bg-secondary/20 px-3 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                                            />
                                            <button
                                                onClick={() => handleSaveEdit(idx)}
                                                disabled={!editingValue.trim()}
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
                                        <>
                                            <div className="flex items-start gap-2.5 text-[13px] leading-relaxed">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                                <span className="text-foreground font-medium">{item}</span>
                                            </div>
                                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleStartEdit(idx)}
                                                    className="p-1 hover:text-primary transition-colors"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(idx)}
                                                    className="p-1 hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-[11px] text-muted-foreground text-center py-4">
                                No tasks yet. Start planning!
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSuggestTasks}
                        disabled={isSuggesting || remainingSuggestions <= 0}
                        className="h-8 w-full rounded-lg border border-border bg-secondary/40 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                        {remainingSuggestions > 0
                            ? (isSuggesting ? "Suggesting..." : `Suggest Next Tasks (${remainingSuggestions} left)`)
                            : "Limit Reached"}
                    </button>
                </div>
            )}
        </div>
    );
};
