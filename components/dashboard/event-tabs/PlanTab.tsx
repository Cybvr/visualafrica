"use client";

import * as React from 'react';
import { useState } from 'react';
import { Layout, Plus } from 'lucide-react';
import { SharedEvent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const CATEGORIES = [
    'Wedding',
    'Corporate',
    'Technology',
    'Workshop',
    'Outdoor',
    'Traditional',
    'Network'
];

const THEMES = [
    'Nigerian Royalty',
    'Modern Luxury',
    'Modern Tech',
    'Green Future',
    'Hands-on Learning',
    'Professional Networking',
    'Grand Celebration',
    'Classic Elegance'
];

interface PlanTabProps {
    event: SharedEvent;
}

const PlanTab: React.FC<PlanTabProps> = ({ event }) => {
    const [isPublic, setIsPublic] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-6">
            {/* Event Details Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        <Layout size={18} />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Event Details</h2>
                </div>

                <div className="space-y-6 bg-background p-6 rounded-lg border border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                            <Input
                                type="text"
                                defaultValue={event.eventName}
                                className="bg-background border border-border focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Location</label>
                            <Input
                                type="text"
                                defaultValue={event.location}
                                className="bg-background border border-border focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Date</label>
                            <Input
                                type="text"
                                defaultValue={event.date}
                                className="bg-background border border-border focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Guest Count</label>
                            <Input
                                type="number"
                                defaultValue={event.guestCount}
                                className="bg-background border border-border focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Event Category</label>
                            <Select defaultValue={event.categories?.[0]}>
                                <SelectTrigger className="bg-background border border-border focus:ring-primary h-12 rounded-xl">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="rounded-lg">
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Design Theme</label>
                            <Select defaultValue={event.themes?.[0]}>
                                <SelectTrigger className="bg-background border border-border focus:ring-primary h-12 rounded-xl">
                                    <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {THEMES.map((theme) => (
                                        <SelectItem key={theme} value={theme} className="rounded-lg">
                                            {theme}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Event Description</label>
                            <Textarea
                                rows={4}
                                defaultValue={event.description}
                                className="bg-background border border-border focus-visible:ring-primary resize-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            <Plus size={18} />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Public Gallery</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="text-accent font-medium">
                        Add Photo
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {event.publicGallery?.map((img: string, i: number) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted relative group">
                            <img
                                src={img}
                                alt={`Gallery ${i}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <button className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-accent transition-all">
                        <Plus size={20} />
                        <span className="text-xs font-medium">Upload</span>
                    </button>
                </div>
            </section>

            {/* Success Metrics Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            <Plus size={18} />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Success Metrics</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="text-accent font-medium">
                        Add Metric
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {event.metrics?.map((metric: { label: string; value: string }, i: number) => (
                        <div key={i} className="bg-background p-4 rounded-lg border border-border group relative">
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">{metric.label}</p>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="ml-auto h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Plus size={14} className="rotate-45" />
                                </Button>
                            </div>
                            <p className="text-lg font-medium text-foreground">{metric.value}</p>
                        </div>
                    ))}
                </div>
            </section>


            <div className="flex justify-end">
                <Button size="lg" className="shadow-sm">
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default PlanTab;
