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
        <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                <Input
                    placeholder={placeholder}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-10 pr-4 h-11 bg-secondary/30 border-transparent rounded-xl text-sm font-medium focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40 shadow-none"
                />
            </div>
        </div>
    );
};
