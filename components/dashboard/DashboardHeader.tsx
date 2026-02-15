"use client";

import React from 'react';
import { DashboardFilter } from './DashboardFilter';

interface Tab {
    id: string;
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
}

interface DashboardHeaderProps {
    title: string;
    description: string;
    searchPlaceholder?: string;
    onSearchChange?: (val: string) => void;
    tabs?: Tab[];
}

export const DashboardHeader = ({
    title,
    description,
    searchPlaceholder,
    onSearchChange,
    tabs
}: DashboardHeaderProps) => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">{title}</h2>
                    <p className="text-muted-foreground font-medium">{description}</p>
                </div>
                <div className="flex-1 max-w-xl w-full">
                    <DashboardFilter
                        placeholder={searchPlaceholder}
                        onSearchChange={onSearchChange}
                    />
                </div>
            </div>

            {tabs && tabs.length > 0 && (
                <div className="flex items-center gap-2 border-b border-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={tab.onClick}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 -mb-[2px] ${tab.active
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab.label} {tab.count !== undefined && `(${tab.count})`}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
