"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";

const SUGGESTIONS = [
  "Plan a surprise 30th birthday in Lagos for 20 guests",
  "Find a wedding venue in Accra with ocean views",
  "Budget for a corporate gala in Nairobi",
  "Book a private chef for a brunch in Cape Town"
];

export default function HostHomePage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleStartChat = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Create a new chat ID and redirect
    // In a real app, we'd save this to Firestore first
    const newId = `chat-${Date.now()}`;
    router.push(`/dashboard/hosts/chat/${newId}?q=${encodeURIComponent(input)}`);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} className="fill-primary" />
          Meet Waddi
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Your event, fully coordinated. <br />
          <span className="text-muted-foreground/60">Ask anything.</span>
        </h1>

        <div className="max-w-2xl mx-auto relative mt-8 group">
          <form onSubmit={handleStartChat}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. Help me plan a traditional wedding in Lagos..."
              className="w-full h-16 bg-card border-2 border-border rounded-2xl px-6 pr-16 text-lg focus:outline-none focus:border-primary/50 transition-all shadow-sm group-hover:shadow-md"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-3 top-3 h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
            >
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </form>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => { setInput(s); }}
              className="text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/30 hover:bg-secondary/60 border border-border px-3 py-1.5 rounded-full transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
