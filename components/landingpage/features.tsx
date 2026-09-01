"use client"

import { useState } from "react";
import { CalendarDays, MessageSquareText, ClipboardList, Globe } from "lucide-react";

const features = [
  {
    id: "itinerary",
    title: "Build an itinerary",
    body: "Tell Waddi what you have in mind and get an itinerary for your group.",
    tag: "AI",
    wide: true,
    Icon: CalendarDays,
  },
  {
    id: "negotiation",
    title: "Vendor proposals",
    body: "Review vendor proposals and keep the rates and terms in one place.",
    tag: "AI",
    wide: false,
    Icon: MessageSquareText,
  },
  {
    id: "tasklist",
    title: "One task list",
    body: "Keep logistics, vendors, and the rest of the work in one place.",
    tag: "OPS",
    wide: false,
    Icon: ClipboardList,
  },
  {
    id: "guest",
    title: "Guest details",
    body: "Create a guest page and keep track of RSVPs and preferences.",
    tag: "CX",
    wide: true,
    Icon: Globe,
  },
];

export function Features() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="bg-background text-foreground container mx-auto px-4 lg:px-14 py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-none tracking-tight max-w-xl font-serif">
          Keep the plan moving.
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed md:text-right shrink-0 font-light">
          Waddi keeps the work in one place
          <br />
          so you can focus on the event.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f) => {
          const isHovered = hovered === f.id;
          return (
            <div
              key={f.id}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}
              className={[
                f.wide ? "md:col-span-2" : "md:col-span-1",
                "relative flex flex-col min-h-[220px] rounded-3xl border p-8 overflow-hidden cursor-default transition-all duration-300",
                isHovered ? "bg-accent/50 border-primary/20" : "bg-card border-border",
              ].join(" ")}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-8">
                <div className="bg-primary p-2.5 rounded-xl">
                  <f.Icon className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground border border-border px-3 py-1 rounded-full">
                    {f.tag}
                  </span>
                  <span
                    className={[
                      "text-xl transition-all duration-300",
                      isHovered
                        ? "translate-x-0.5 -translate-y-0.5 text-primary"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    ↗
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight mb-3 leading-snug">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light flex-1">
                {f.body}
              </p>

              {/* Bottom accent line */}
              <div
                className={[
                  "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out",
                  isHovered ? "w-full" : "w-0",
                ].join(" ")}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
