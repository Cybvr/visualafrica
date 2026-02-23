"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vendor, VendorCategory, EventTheme } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface VendorFormProps {
    initialData?: Partial<Vendor>;
    onSubmit: (data: any) => Promise<void>;
    title: string;
}

const CATEGORIES: VendorCategory[] = [
    "Bar Tenders", "Cakes & Sweets", "Catering", "Decorations", "Entertainment",
    "Event Planners", "Gifts & Invites", "Limousines", "Makeup Artists",
    "Party Equipment", "Party Wear", "Photographers", "Photo Booths", "Venues", "Yachts", "Experiences"
];

const THEMES: EventTheme[] = [
    "Kids Birthday", "Wedding", "Social Gathering", "Corporate Event", "Proposals",
    "Anniversary", "Bachelor", "Bachelorette", "Bridal"
];

export default function VendorForm({ initialData, onSubmit, title }: VendorFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        location: initialData?.location || "",
        price: initialData?.price || "",
        image: initialData?.image || "",
        description: initialData?.description || "",
        shortDescription: initialData?.shortDescription || "",
        categories: initialData?.categories || [],
        eventThemes: initialData?.eventThemes || [],
        featured: initialData?.featured || false,
        phone: initialData?.phone || "",
        yearEstablished: initialData?.yearEstablished || new Date().getFullYear(),
        responseTime: initialData?.responseTime || "within 2 hours",
        areaServed: initialData?.areaServed || [],
    });

    const handleCategoryToggle = (cat: VendorCategory) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter(c => c !== cat)
                : [...prev.categories, cat]
        }) as any);
    };

    const handleThemeToggle = (theme: EventTheme) => {
        setFormData(prev => ({
            ...prev,
            eventThemes: prev.eventThemes.includes(theme)
                ? prev.eventThemes.filter(t => t !== theme)
                : [...prev.eventThemes, theme]
        }) as any);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            router.push("/admin/vendors");
        } catch (error) {
            console.error("Submit failed:", error);
            alert("Error saving vendor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-background text-foreground min-h-screen">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/vendors"><ArrowLeft size={20} /></Link>
                </Button>
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8 rounded-2xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Vendor Name *</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Elegant Events"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Slug (URL path) *</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="e.g. elegant-events"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Location *</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Victoria Island, Lagos"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Price String</label>
                        <input
                            type="text"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            placeholder="e.g. 500,000+"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold">Image URL *</label>
                        <input
                            required
                            type="url"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold">Short Description *</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
                        value={formData.shortDescription}
                        onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                        placeholder="Catchy one-liner"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold">Full Description</label>
                    <textarea
                        rows={4}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary resize-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed info about the vendor..."
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold block">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryToggle(cat)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                    formData.categories.includes(cat as any)
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "bg-background border-border text-muted-foreground hover:border-primary/50"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold block">Event Themes</label>
                    <div className="flex flex-wrap gap-2">
                        {THEMES.map(theme => (
                            <button
                                key={theme}
                                type="button"
                                onClick={() => handleThemeToggle(theme)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                    formData.eventThemes.includes(theme as any)
                                        ? "bg-accent border-accent text-white"
                                        : "bg-background border-border text-muted-foreground hover:border-accent/50"
                                )}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="featured" className="text-sm font-bold cursor-pointer">Featured Vendor</label>
                </div>

                <div className="pt-6 border-t border-border flex justify-end gap-3">
                    <Button variant="ghost" type="button" asChild disabled={loading}>
                        <Link href="/admin/vendors">Cancel</Link>
                    </Button>
                    <Button type="submit" className="bg-primary text-primary-foreground min-w-[120px]" disabled={loading}>
                        {loading ? "Saving..." : <span className="flex items-center gap-2"><Save size={18} /> Save Vendor</span>}
                    </Button>
                </div>
            </form>
        </div>
    );
}
