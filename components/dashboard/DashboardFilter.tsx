"use client";

import React from 'react';
import { Search, Filter, Calendar, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DashboardFilterProps {
    placeholder?: string;
    onSearchChange?: (value: string) => void;
    onStatusClick?: () => void;
    onDateClick?: () => void;
    onFilterClick?: () => void;
}

export const DashboardFilter = ({
    placeholder = "Search...",
    onSearchChange,
    onStatusClick,
    onDateClick,
    onFilterClick
}: DashboardFilterProps) => {
    return (
        <div className="flex items-center gap-2 w-full max-w-2xl">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                <Input
                    placeholder={placeholder}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-9 pr-4 h-10 bg-transparent border-slate-200 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
                />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    onClick={onStatusClick}
                    className="flex items-center gap-1.5 h-10 px-3 border border-slate-200 rounded-lg text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                >
                    <Filter size={12} />
                    Status
                </button>
                <button
                    onClick={onDateClick}
                    className="flex items-center gap-1.5 h-10 px-3 border border-slate-200 rounded-lg text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                >
                    <Calendar size={12} />
                    Date
                </button>
                <button
                    onClick={onFilterClick}
                    className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-lg hover:bg-black transition-all shadow-sm"
                >
                    <SlidersHorizontal size={14} />
                </button>
            </div>
        </div>
    );
};
