"use client";

import { useState } from "react";
import { SharedEvent } from "@/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Sparkles, Wallet } from "lucide-react";
import { BudgetBreakdownCard } from "@/components/dashboard/chat/budget-breakdown-card";
import { processGeminiChat } from "@/app/actions/gemini-chat";
import { updateEvent } from "@/lib/firestore-service";

interface BudgetPlannerProps {
    events?: SharedEvent[];
    selectedEventId?: string | null;
    onEventChange?: (id: string) => void;
}

export const BudgetPlanner = ({ events = [], selectedEventId, onEventChange }: BudgetPlannerProps) => {
    const selectedEvent = events.find((e) => e.id === selectedEventId);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestError, setSuggestError] = useState<string | null>(null);

    const buildFallbackBudget = (budget: number) => {
        const safeBudget = Math.max(0, Number(budget || 0));
        const template = [
            { category: "Venue", percent: 30 },
            { category: "Catering", percent: 25 },
            { category: "Decor", percent: 12 },
            { category: "Entertainment (DJ/MC)", percent: 10 },
            { category: "Photo/Video", percent: 10 },
            { category: "Attire/Beauty", percent: 5 },
            { category: "Logistics & Contingency", percent: 8 }
        ];

        let running = 0;
        return template.map((row, index) => {
            const isLast = index === template.length - 1;
            const amount = isLast
                ? Math.max(safeBudget - running, 0)
                : Math.max(Math.round((safeBudget * row.percent) / 100), 0);
            running += amount;
            return { ...row, amount };
        });
    };

    const handleSuggestBudget = async () => {
        if (!selectedEventId || !selectedEvent || isSuggesting) return;
        setIsSuggesting(true);
        setSuggestError(null);

        try {
            const result = await processGeminiChat([{
                role: "user",
                parts: [{
                    text: `Create a realistic event budget allocation.
Event: ${selectedEvent.eventName}
City: ${selectedEvent.location}
Guests: ${selectedEvent.guestCount}
Total budget: ${selectedEvent.budget}
Current allocations: ${selectedEvent.budgetBreakdown?.length ? selectedEvent.budgetBreakdown.map((b) => `${b.category} ${b.percent}%`).join(" | ") : "none"}

Rules:
- Return JSON only as an array.
- 5 to 8 rows.
- Each row: {"category":"...", "percent": number}.
- Percents must total exactly 100.
- Categories should be event-relevant (e.g. Venue, Catering, Decor, Entertainment, Photo/Video, Logistics).
- No markdown, no explanation.`
                }]
            }]);

            const raw = String((result as any)?.text || "").trim();
            const jsonText = raw
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/```$/i, "")
                .trim();

            let parsed: any[] = [];
            try {
                parsed = JSON.parse(jsonText);
            } catch {
                parsed = [];
            }

            const normalized = Array.isArray(parsed)
                ? parsed
                    .map((row: any) => ({
                        category: String(row?.category || "").trim(),
                        percent: Number(row?.percent || 0)
                    }))
                    .filter((row: any) => row.category && Number.isFinite(row.percent) && row.percent > 0)
                : [];

            const source = normalized.length >= 3 ? normalized.slice(0, 8) : buildFallbackBudget(selectedEvent.budget).map(({ category, percent }) => ({ category, percent }));
            const percentTotal = source.reduce((sum, row) => sum + row.percent, 0) || 100;
            const adjusted = source.map((row, idx) => {
                if (idx === source.length - 1) return { ...row, percent: Math.max(0, 100 - source.slice(0, -1).reduce((s, r) => s + r.percent, 0)) };
                return { ...row, percent: Math.max(0, Math.round((row.percent / percentTotal) * 100)) };
            });

            const roundedTotal = adjusted.reduce((sum, row) => sum + row.percent, 0);
            if (roundedTotal !== 100 && adjusted.length > 0) {
                adjusted[adjusted.length - 1].percent = Math.max(0, adjusted[adjusted.length - 1].percent + (100 - roundedTotal));
            }

            const budget = Math.max(0, Number(selectedEvent.budget || 0));
            let running = 0;
            const breakdown = adjusted.map((row, idx) => {
                const isLast = idx === adjusted.length - 1;
                const amount = isLast
                    ? Math.max(budget - running, 0)
                    : Math.max(Math.round((budget * row.percent) / 100), 0);
                running += amount;
                return { category: row.category, percent: row.percent, amount };
            });

            await updateEvent(selectedEventId, { budgetBreakdown: breakdown });
        } catch (err) {
            console.error("Failed to suggest budget allocations", err);
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
                                <Wallet size={14} className="text-primary" />
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
                        <Wallet size={20} />
                    </div>
                    <div className="text-[13px] font-medium text-foreground">No Event Selected</div>
                    <div className="text-[11px] text-muted-foreground max-w-[220px]">
                        Select an event from the dropdown above to view its budget allocation.
                    </div>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center justify-between gap-2">
                        <button
                            onClick={handleSuggestBudget}
                            disabled={isSuggesting}
                            className="h-8 px-3 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-60 inline-flex items-center gap-1.5"
                        >
                            <Sparkles size={12} className="text-primary" />
                            {isSuggesting ? "Suggesting..." : "Suggest budget"}
                        </button>
                    </div>

                    {suggestError && (
                        <div className="text-[11px] text-destructive">{suggestError}</div>
                    )}

                    <BudgetBreakdownCard event={selectedEvent} />
                </div>
            )}
        </div>
    );
};
