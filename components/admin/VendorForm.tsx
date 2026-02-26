"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vendor, VendorCategory, EventTheme } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-service";

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
    const [uploading, setUploading] = useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialData?.slug));
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        location: initialData?.location || "",
        price: initialData?.price || "",
        image: initialData?.image || "",
        description: initialData?.description || "",
        categories: initialData?.categories || [],
        eventThemes: initialData?.eventThemes || [],
        featured: initialData?.featured || false,
        phone: initialData?.phone || "",
        yearEstablished: initialData?.yearEstablished || new Date().getFullYear(),
        responseTime: initialData?.responseTime || "within 2 hours",
        areaServed: initialData?.areaServed || [],
    });

    const toSlug = (value: string) =>
        value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

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
            const normalizedData = {
                ...formData,
                slug: (formData.slug && formData.slug.trim()) || toSlug(formData.name),
                shortDescription: (formData.description || formData.name || "").trim().slice(0, 140),
                price: formData.price === "" ? null : Number(formData.price),
            };
            await onSubmit(normalizedData);
            router.push("/admin/vendors");
        } catch (error) {
            console.error("Submit failed:", error);
            alert("Error saving vendor");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file?: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file, `vendors/${Date.now()}-${file.name}`);
            setFormData((prev) => ({ ...prev, image: url }));
        } catch (err: any) {
            const message = err?.code
                ? `Upload failed (${err.code}). Check Firebase Storage rules and try again.`
                : "Upload failed. Check Firebase Storage rules and try again.";
            alert(message);
            console.error("Vendor image upload error:", err);
        } finally {
            setUploading(false);
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
                            onChange={e => {
                                const nextName = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    name: nextName,
                                    slug: slugManuallyEdited ? prev.slug : toSlug(nextName),
                                }));
                            }}
                            placeholder="e.g. Elegant Events"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Slug (URL path)</label>
                        <input
                            type="text"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
                            value={formData.slug}
                            onChange={e => {
                                setSlugManuallyEdited(true);
                                setFormData({ ...formData, slug: toSlug(e.target.value) });
                            }}
                            placeholder="Auto-generated from name"
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
                        <label className="text-sm font-bold">Price ($)</label>
                        <input
                            type="number"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : "" as any })}
                            placeholder="Optional, e.g. 500000"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold">Vendor Image *</label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const file = e.dataTransfer.files?.[0];
                                await handleFileUpload(file);
                            }}
                            className={cn(
                                "relative border-2 border-dashed border-border rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 bg-secondary/20 hover:bg-secondary/30 group cursor-pointer",
                                uploading && "opacity-50 cursor-wait"
                            )}
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    await handleFileUpload(file);
                                }}
                            />

                            {formData.image ? (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
                                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-sm font-bold flex items-center gap-2">
                                            <Upload size={16} /> Click or drag to change
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="text-primary" size={32} />
                                    </div>
                                    <p className="font-bold text-sm">Drag & drop your vendor image</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP. Max 5MB</p>
                                </div>
                            )}

                            {uploading && (
                                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>
                    </div>
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
