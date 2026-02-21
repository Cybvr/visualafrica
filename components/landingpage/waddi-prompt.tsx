"use client";

import { useState } from "react";
import { Mic, ArrowUp } from "lucide-react";

type Category = "Plan" | "Budget" | "Discover" | "Track" | null;

const CATEGORY_PROMPTS: Record<NonNullable<Category>, { placeholder: string; prompts: string[] }> = {
    Plan: {
        placeholder: "What do you want to plan?",
        prompts: [
            "Plan a 3-day corporate retreat in Lagos",
            "Create a timeline for a wedding reception",
            "Draft a run-of-show for a tech conference",
            "Help me plan a product launch event"
        ]
    },
    Budget: {
        placeholder: "What are you budgeting for?",
        prompts: [
            "Create a budget for a 100-person gala",
            "How much should I allocate for catering?",
            "Help me reduce my event venue costs",
            "Draft a sponsorship proposal budget"
        ]
    },
    Discover: {
        placeholder: "What are you looking for?",
        prompts: [
            "Find top-rated photographers in Abuja",
            "Suggest unique venues for a product launch",
            "Discover trending event themes for 2026",
            "Show me the best caterers for vegetarian food"
        ]
    },
    Track: {
        placeholder: "What do you want to track?",
        prompts: [
            "Track my vendor payments",
            "Create a checklist for event day",
            "Manage my guest list RSVPs",
            "Set up milestone reminders"
        ]
    }
};

const SUGGESTIONS: NonNullable<Category>[] = ["Plan", "Budget", "Discover", "Track"];

export function WaddiPrompt() {
    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<Category>(null);

    const activeConfig = activeCategory ? CATEGORY_PROMPTS[activeCategory] : null;
    const placeholderText = activeConfig ? activeConfig.placeholder : "Ask Waddi...";

    return (
        <section className="w-full bg-background pt-16 pb-8 flex flex-col items-center justify-center px-4">
            <div className="max-w-4xl w-full flex flex-col items-center gap-8">
                {/* Title */}
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-5xl font-medium text-foreground tracking-tight text-center">
                        Your event, fully coordinated. Ask anything
                    </h1>
                </div>

                {/* Prompt Box */}
                <div className="w-full bg-background rounded-[2rem] shadow-sm border border-border p-4 transition-shadow focus-within:shadow-md">
                    <div className="flex flex-col gap-4">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onClick={() => {
                                // Once they click into textarea, if they have an active category with empty query, we can keep it.
                            }}
                            placeholder={placeholderText}
                            className="w-full bg-transparent resize-none border-none outline-none text-lg text-foreground placeholder:text-gray-400 min-h-[60px] px-2"
                            rows={2}
                        />

                        <div className="flex items-center justify-between px-2">
                            {/* Empty flex-1 to push the buttons to the right */}
                            <div className="flex flex-1"></div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted-foreground" title="Voice input">
                                    <Mic className="w-5 h-5" />
                                </button>
                                <button
                                    className={`p-2 rounded-full transition-colors flex items-center justify-center ${query.length > 0
                                        ? "bg-background text-foreground hover:bg-background/90 shadow-sm"
                                        : "bg-background text-foreground"
                                        }`}
                                    title="Send message"
                                    disabled={query.trim().length === 0}
                                    onClick={() => {
                                        console.log("Sending query:", query);
                                    }}
                                >
                                    <ArrowUp className="w-6 h-6 p-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggestions Corridor */}
                <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-3xl">
                    {SUGGESTIONS.map((suggestion) => (
                        <button
                            key={suggestion}
                            className={`px-6 py-3 rounded-full shadow-sm text-sm font-medium transition-colors border ${activeCategory === suggestion
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-card hover:bg-background text-foreground border-border"
                                }`}
                            onClick={() => setActiveCategory(activeCategory === suggestion ? null : suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                {/* Sub-prompts */}
                <div className="w-full max-w-3xl min-h-[160px] transition-all duration-300">
                    {activeCategory && activeConfig && (
                        <div className="w-full flex flex-col items-start gap-3 pl-4 md:pl-8 pt-4">
                            {activeConfig.prompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    className={`text-left text-base transition-colors ${index === 0
                                        ? "px-5 py-2.5 bg-[#ebebeb] hover:bg-[#e0e0e0] text-foreground rounded-full font-medium"
                                        : "px-2 py-1.5 hover:text-foreground text-foreground rounded-lg w-full lg:w-3/4"
                                        }`}
                                    onClick={() => setQuery(prompt)}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
