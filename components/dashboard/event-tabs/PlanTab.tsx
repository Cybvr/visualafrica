"use client";

import * as React from 'react';
import { Plus, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
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
import { updateEvent } from '@/lib/firestore-service';
import { uploadImage } from '@/lib/upload-service';
import { useAuth } from '@/components/providers/auth-provider';
import { toast } from 'sonner';

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
    const [eventName, setEventName] = React.useState(event.eventName);
    const [location, setLocation] = React.useState(event.location);
    const [guestCount, setGuestCount] = React.useState(String(event.guestCount || ''));
    const [description, setDescription] = React.useState(event.description || '');
    const [category, setCategory] = React.useState(event.categories?.[0] || '');
    const [theme, setTheme] = React.useState(event.themes?.[0] || '');
    const [isSaving, setIsSaving] = React.useState(false);

    // Restoring missing state and refs
    const { user } = useAuth();
    const coverInputRef = React.useRef<HTMLInputElement>(null);
    const [coverImage, setCoverImage] = React.useState<string>(event.image || '/placeholder.png');
    const [isUploadingCover, setIsUploadingCover] = React.useState(false);
    const initialDate = event.date ? new Date(event.date) : undefined;
    const [date, setDate] = React.useState<Date | undefined>(
        initialDate && !isNaN(initialDate.getTime()) ? initialDate : undefined
    );
    const [time, setTime] = React.useState<string>(
        initialDate && !isNaN(initialDate.getTime())
            ? initialDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
            : '12:00'
    );

    React.useEffect(() => {
        setCoverImage(event.image || '/placeholder.png');
        setEventName(event.eventName);
        setLocation(event.location);
        setGuestCount(String(event.guestCount || ''));
        setDescription(event.description || '');
        setCategory(event.categories?.[0] || '');
        setTheme(event.themes?.[0] || '');
        const evDate = event.date ? new Date(event.date) : undefined;
        if (evDate && !isNaN(evDate.getTime())) {
            setDate(evDate);
            setTime(evDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        }
    }, [event]);

    const handleSaveChanges = async () => {
        if (!event.id) return;
        setIsSaving(true);
        try {
            // Construct a date object if we have both date and time
            let finalDate = event.date;
            if (date) {
                const combined = new Date(date);
                if (time) {
                    const [hours, minutes] = time.split(':').map(Number);
                    combined.setHours(hours, minutes);
                }
                finalDate = combined.toISOString();
            }

            await updateEvent(event.id, {
                eventName,
                location,
                date: finalDate,
                guestCount: Number(guestCount),
                description,
                categories: category ? [category] : [],
                themes: theme ? [theme] : []
            });
            toast.success('Changes saved successfully');
        } catch (error) {
            console.error('Failed to save event changes:', error);
            toast.error('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCoverFileUpload = async (file?: File) => {
        if (!file || !event.id) return;
        if (!file.type.startsWith('image/')) return;

        if (!user) {
            toast.error('You must be signed in to upload images');
            return;
        }

        setIsUploadingCover(true);
        try {
            const ext = file.name.split('.').pop() || 'jpg';
            const path = `events/${event.id}/cover-${Date.now()}.${ext}`;
            const imageUrl = await uploadImage(file, path);
            await updateEvent(event.id, { image: imageUrl });
            setCoverImage(imageUrl);
            toast.success('Cover image updated successfully');
        } catch (error) {
            console.error('Failed to update event cover image:', error);
            toast.error('Failed to update cover image. Please check your connection and permissions.');
        } finally {
            setIsUploadingCover(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pt-2">
            {/* Event Details Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">General Information</h3>
                </div>

                {/* Event Cover Image */}
                <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden relative group bg-muted border border-border">
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                            const input = e.currentTarget;
                            const file = input.files?.[0];
                            input.value = '';
                            await handleCoverFileUpload(file);
                        }}
                    />
                    <img
                        src={coverImage}
                        alt={event.eventName}
                        className="w-full h-full object-cover"
                    />
                    {user && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="font-bold"
                                onClick={() => coverInputRef.current?.click()}
                                disabled={isUploadingCover}
                            >
                                {isUploadingCover ? 'Uploading...' : 'Change Cover Image'}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                            <Input
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                className="h-10 bg-background border-border"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">Location</label>
                            <Input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="h-10 bg-background border-border"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-10 justify-start text-left font-normal bg-background border-border",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">Time</label>
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="h-10 bg-background border-border"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">Guest Count</label>
                            <Input
                                type="number"
                                value={guestCount}
                                onChange={(e) => setGuestCount(e.target.value)}
                                className="h-10 bg-background border-border"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">Event Category</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="h-10 bg-background border-border rounded-md">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">Design Theme</label>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="h-10 bg-background border-border rounded-md">
                                    <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    {THEMES.map((theme) => (
                                        <SelectItem key={theme} value={theme}>
                                            {theme}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">Event Description</label>
                            <Textarea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-background border-border resize-none"
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
                    <h3 className="text-base font-semibold text-foreground">Success Metrics</h3>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2">
                        Add Metric
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {event.metrics?.map((metric: { label: string; value: string }, i: number) => (
                        <div key={i} className="bg-background p-3 rounded-md border border-border">
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">{metric.label}</p>
                            </div>
                            <p className="text-base font-medium text-foreground">{metric.value}</p>
                        </div>
                    ))}
                </div>
            </section>


            <div className="flex justify-end">
                <Button
                    size="sm"
                    className="rounded-md"
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
};

export default PlanTab;
