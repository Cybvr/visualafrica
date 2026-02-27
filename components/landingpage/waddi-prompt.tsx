"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SUGGESTIONS = [
    "Plan a surprise 30th birthday in Lagos for 20 guests",
    "Find a wedding venue in Accra with ocean views",
    "Budget for a corporate gala in Nairobi",
    "Book a private chef for a brunch in Cape Town"
];

export function WaddiPrompt() {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleStartChat = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        // Route to the real new-chat flow; chat page will create/persist via send()
        router.push(`/dashboard/hosts/chat/new?q=${encodeURIComponent(input)}`);
    };

    if (!mounted) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-10 py-6">
            <div className="text-center space-y-6 py-12 px-4 md:px-0">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                    Stop planning.
                    <br />
                    Start living it.
                </h1>

                <div className="max-w-2xl mx-auto relative mt-8 group">
                    <form onSubmit={handleStartChat}>
                        <div className="relative bg-card border-2 border-border rounded-2xl shadow-sm group-hover:shadow-md focus-within:border-primary/50 transition-all overflow-hidden">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleStartChat();
                                    }
                                }}
                                placeholder="E.g. Help me plan a traditional wedding in Lagos..."
                                rows={1}
                                className="w-full bg-transparent px-6 pt-5 pb-16 text-base focus:outline-none resize-none min-h-[108px]"
                            />

                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="h-10 w-10 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors inline-flex items-center justify-center"
                                            aria-label="Open sample prompts"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-80 p-1 bg-background">
                                        {SUGGESTIONS.map((s, i) => (
                                            <DropdownMenuItem
                                                key={i}
                                                onClick={() => setInput(s)}
                                                className="py-2 whitespace-normal leading-relaxed cursor-pointer"
                                            >
                                                {s}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
                                >
                                    <ArrowRight size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
