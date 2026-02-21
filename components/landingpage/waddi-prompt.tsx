"use client";

import { useState } from "react";
import { Sparkles, Plus, Settings2, Mic, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WaddiPrompt() {
    const [query, setQuery] = useState("");

    const suggestions = ["Plan", "Research", "Suggest", "Organize"];

    return (
        <section className="w-full bg-[#f4f7f6] pt-16 pb-8 flex flex-col items-center justify-center px-4">
            <div className="max-w-4xl w-full flex flex-col items-center gap-8">
                {/* Title */}
                <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl md:text-5xl font-medium text-gray-800 tracking-tight">
                        Meet Waddi, your personal event AI assistant
                    </h1>
                </div>

                {/* Prompt Box */}
                <div className="w-full bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 transition-shadow focus-within:shadow-md">
                    <div className="flex flex-col gap-4">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask Waddi..."
                            className="w-full bg-transparent resize-none border-none outline-none text-lg text-gray-700 placeholder:text-gray-400 min-h-[60px] px-2"
                            rows={2}
                        />

                        <div className="flex items-center justify-between px-2 text-gray-500">
                            <div className="flex items-center gap-4">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Add attachment">
                                    <Plus className="w-5 h-5" />
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full transition-colors text-sm font-medium">
                                    <Settings2 className="w-4 h-4" />
                                    Tools
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-full transition-colors text-sm font-medium">
                                    Fast <ChevronDown className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Voice input">
                                    <Mic className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-full shadow-sm text-sm font-medium transition-colors border border-gray-100"
                            onClick={() => setQuery(`Help me ${suggestion.toLowerCase()} `)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
