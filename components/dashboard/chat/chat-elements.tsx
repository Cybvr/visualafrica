"use client"

import React from "react";

export const Stars = ({ n }: { n: number }) => (
    <span className="text-primary tracking-tighter">
        {"★".repeat(Math.floor(n))}{"☆".repeat(5 - Math.floor(n))}
    </span>
);

export const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full border ${className}`}>
        {children}
    </span>
);

export const Tag = ({ children }: { children: React.ReactNode }) => (
    <span className="text-[11px] bg-primary/10 text-primary border border-primary/25 px-2.5 py-0.5 rounded-full">
        {children}
    </span>
);

export const ActionBtn = ({ children, primary = false, onClick }: {
    children: React.ReactNode; primary?: boolean; onClick?: () => void;
}) => (
    <button
        onClick={onClick}
        className={`font-sans-dm text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition-all border font-medium
      ${primary
                ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
    >
        {children}
    </button>
);
