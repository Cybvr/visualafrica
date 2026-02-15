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
        <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                    placeholder={placeholder}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-11 pr-4 h-11 bg-card border-border rounded-xl text-sm font-medium focus:ring-primary/20 transition-all"
                />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                    onClick={onStatusClick}
                    className="flex items-center gap-2 h-11 px-4 bg-card border border-border rounded-xl text-xs font-bold hover:bg-slate-50 transition-all text-muted-foreground hover:text-foreground"
                >
                    <Filter size={14} className="text-primary" />
                    Status
                </button>
                <button
                    onClick={onDateClick}
                    className="flex items-center gap-2 h-11 px-4 bg-card border border-border rounded-xl text-xs font-bold hover:bg-slate-50 transition-all text-muted-foreground hover:text-foreground"
                >
                    <Calendar size={14} className="text-primary" />
                    Date
                </button>
                <button
                    onClick={onFilterClick}
                    className="flex items-center justify-center w-11 h-11 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
                >
                    <SlidersHorizontal size={16} />
                </button>
            </div>
        </div>
    );
};
