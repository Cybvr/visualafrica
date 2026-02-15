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
        <div className="flex flex-col lg:flex-row gap-4 items-center p-3 bg-card border border-border rounded-[2.5rem] shadow-sm">
            <div className="relative flex-1 w-full lg:w-auto">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                    placeholder={placeholder}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-16 pr-6 h-14 bg-background border-border rounded-[2rem] text-sm font-bold focus:ring-primary/20"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <button
                    onClick={onStatusClick}
                    className="flex items-center gap-2 h-14 px-8 bg-background border border-border rounded-[2rem] text-sm font-black hover:bg-slate-50 transition-all"
                >
                    <Filter size={18} className="text-primary" />
                    Status
                </button>
                <button
                    onClick={onDateClick}
                    className="flex items-center gap-2 h-14 px-8 bg-background border border-border rounded-[2rem] text-sm font-black hover:bg-slate-50 transition-all"
                >
                    <Calendar size={18} className="text-primary" />
                    Date
                </button>
                <button
                    onClick={onFilterClick}
                    className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>
        </div>
    );
};
