"use client"

import React from "react";
import { Badge } from "./chat-elements";

export const EventOverviewCard = () => (
    <div className="bg-muted border border-border rounded-xl p-4 mt-3.5">
        <div className="flex justify-between items-start mb-3">
            <div>
                <div className="font-display text-base text-foreground">Harrington Wedding</div>
                <div className="text-xs text-muted-foreground mt-0.5">Created Feb 2 · Last updated 3 days ago</div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">On Track</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
            {[
                ["Date", "June 14, 2026"], ["Venue", "Sunstone Winery"],
                ["Guest count", "178 confirmed"], ["Budget", "$48,500 / $55,000"],
                ["Planner", "Sophie H."], ["Days out", "113 days"],
            ].map(([label, val]) => (
                <div key={label}>
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-0.5">{label}</div>
                    <div className="text-[13px] text-foreground">{val}</div>
                </div>
            ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-3.5">
            <div className="flex justify-between mb-2">
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground">Budget Allocated</span>
                <span className="font-display text-sm text-foreground">88%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden mb-2.5">
                <div className="h-full w-[88%] bg-primary rounded-full" />
            </div>
            <div className="flex flex-wrap gap-3.5">
                {[["Venue", "$18,200"], ["Catering", "$14,800"], ["Florals", "$6,400"], ["Music", "$4,200"], ["Photo", "$4,900"]].map(([k, v]) => (
                    <span key={k} className="text-[11px] text-muted-foreground">
                        {k} <span className="text-foreground">{v}</span>
                    </span>
                ))}
            </div>
        </div>
    </div>
);
