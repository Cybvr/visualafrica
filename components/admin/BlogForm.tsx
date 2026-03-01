"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-service";
import { toast } from "sonner";

interface BlogFormProps {
    initialData?: Partial<BlogPost>;
    onSubmit: (data: Omit<BlogPost, 'id'>) => Promise<void>;
    title: string;
}

const CATEGORIES = [
    "Updates",
    "Planning Guides",
    "Expert Insights",
    "Lagos Stories",
    "Vendor Spotlights",
    "Event Infrastructure",
    "Diaspora Tips"
];

export default function BlogForm({ initialData, onSubmit, title }: BlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        category: initialData?.category || CATEGORIES[0],
        date: initialData?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        author: initialData?.author || "Waddi Editorial",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        image: initialData?.image || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) {
            toast.error("Please upload a cover image");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData as Omit<BlogPost, 'id'>);
            toast.success("Blog post saved successfully");
            router.push("/admin/blog");
            router.refresh();
        } catch (error) {
            console.error("Submit failed:", error);
            toast.error("Error saving blog post");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file?: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file, `blog/${Date.now()}-${file.name}`);
            setFormData((prev) => ({ ...prev, image: url }));
            toast.success("Image uploaded successfully");
        } catch (err: any) {
            console.error("Blog image upload error:", err);
            toast.error("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto bg-background text-foreground min-h-screen">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/blog"><ArrowLeft size={20} /></Link>
                </Button>
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border p-8 rounded-2xl shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Post Title *</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-primary transition-all"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter a catchy title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Excerpt (Short Summary) *</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none font-medium"
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="A brief summary of the post..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Body Content (HTML allowed) *</label>
                            <textarea
                                required
                                rows={15}
                                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-4 focus:outline-none focus:border-primary resize-y font-medium leading-relaxed"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your story here... HTML tags like <p>, <h2>, <strong> are supported."
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6 sticky top-8">
                        <div className="space-y-4">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block">Cover Image *</label>
                            <div
                                onClick={() => document.getElementById('blogFileInput')?.click()}
                                className={cn(
                                    "relative aspect-[16/10] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 bg-secondary/20 hover:bg-secondary/30 transition-all cursor-pointer group overflow-hidden",
                                    uploading && "opacity-50 cursor-wait"
                                )}
                            >
                                <input
                                    id="blogFileInput"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        await handleFileUpload(file);
                                    }}
                                />

                                {formData.image ? (
                                    <div className="relative w-full h-full">
                                        <img src={formData.image} className="w-full h-full object-cover" alt="Cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-xs font-bold flex items-center gap-2">
                                                <Upload size={14} /> Change Image
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 text-primary">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-xs font-bold">Upload main cover image</p>
                                    </div>
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 size={24} className="animate-spin text-primary" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                                <select
                                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm font-bold appearance-none cursor-pointer"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Author Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm font-bold"
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Publish Date</label>
                                <input
                                    type="text"
                                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm font-bold"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button type="submit" className="w-full bg-primary text-primary-foreground font-black py-6 rounded-xl hover:shadow-lg transition-all" disabled={loading || uploading}>
                                {loading ? (
                                    <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Saving...</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Save size={18} /> Publish Post</span>
                                )}
                            </Button>
                            <Button variant="ghost" type="button" className="w-full font-bold" asChild disabled={loading}>
                                <Link href="/admin/blog">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
