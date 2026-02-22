"use client"

import React from "react";

export const TypingIndicator = () => (
    <div className="bg-card border border-border rounded-[4px_14px_14px_14px] px-[18px] py-3.5 inline-flex items-center gap-1.5">
        {[0, 200, 400].map(d => (
            <div
                key={d}
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                style={{ animation: "typingPulse 1.2s infinite", animationDelay: `${d}ms` }}
            />
        ))}
    </div>
);
