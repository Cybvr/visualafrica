"use client";

import { useState, useEffect } from "react";
import { Experience, Vendor } from "@/lib/types";
import { getExperiencesByVendor, addExperience, updateExperience, deleteExperience } from "@/lib/firestore-service";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-service";

interface ExperienceManagementProps {
    vendor: Vendor;
}

export default function ExperienceManagement({ vendor }: ExperienceManagementProps) {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>>({
        vendorId: vendor.id,
        title: "",
        description: "",
        image: "",
        price: null,
        rating: 5,
        location: vendor.location,
    });

    useEffect(() => {
        fetchExperiences();
    }, [vendor.id]);

    async function fetchExperiences() {
        setLoading(true);
        try {
            const data = await getExperiencesByVendor(vendor.id);
            setExperiences(data);
        } catch (error) {
            console.error("Error fetching experiences:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (exp: Experience) => {
        setEditingId(exp.id);
        setFormData({
            vendorId: exp.vendorId,
            title: exp.title,
            description: exp.description,
            image: exp.image,
            price: exp.price,
            rating: exp.rating,
            location: exp.location,
            duration: exp.duration,
            whatsIncluded: exp.whatsIncluded,
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            vendorId: vendor.id,
            title: "",
            description: "",
            image: "",
            price: null,
            rating: 5,
            location: vendor.location,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateExperience(editingId, formData);
            } else {
                await addExperience(formData);
            }
            await fetchExperiences();
            handleCancel();
        } catch (error) {
            console.error("Error saving experience:", error);
            alert("Failed to save experience");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this experience?")) return;
        setLoading(true);
        try {
            await deleteExperience(id);
            await fetchExperiences();
        } catch (error) {
            console.error("Error deleting experience:", error);
            alert("Failed to delete experience");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            const url = await uploadImage(file, `experiences/${Date.now()}-${file.name}`);
            setFormData(prev => ({ ...prev, image: url }));
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Experiences</h2>
                {!editingId && (
                    <Button onClick={() => setEditingId('new')} className="gap-2">
                        <Plus size={16} /> Add Experience
                    </Button>
                )}
            </div>

            {editingId && (
                <form onSubmit={handleSubmit} className="bg-secondary/20 border border-border p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold">{editingId === 'new' ? 'Add New Experience' : 'Edit Experience'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                            <input
                                required
                                className="w-full bg-background border border-border rounded-xl px-4 py-2"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Price</label>
                            <input
                                type="number"
                                className="w-full bg-background border border-border rounded-xl px-4 py-2"
                                value={formData.price || ""}
                                onChange={e => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : null })}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
                            <textarea
                                rows={3}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Image</label>
                            <div className="flex items-center gap-4">
                                {formData.image ? (
                                    <img src={formData.image} className="w-16 h-16 rounded-lg object-cover border" alt="Prev" />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border">
                                        <ImageIcon className="text-muted-foreground" size={24} />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="exp-image-upload"
                                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('exp-image-upload')?.click()}
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading..." : "Upload Image"}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Location</label>
                            <input
                                className="w-full bg-background border border-border rounded-xl px-4 py-2"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Experience"}</Button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experiences.map(exp => (
                    <div key={exp.id} className="bg-card border border-border p-4 rounded-2xl flex gap-4">
                        <img src={exp.image} className="w-20 h-20 rounded-xl object-cover border" alt={exp.title} />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold truncate">{exp.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{exp.description}</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-bold">${exp.price}</span>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(exp)}>
                                        <Edit2 size={14} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(exp.id)}>
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {experiences.length === 0 && !loading && !editingId && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed">
                        No experiences found for this vendor.
                    </div>
                )}
            </div>
        </div>
    );
}
