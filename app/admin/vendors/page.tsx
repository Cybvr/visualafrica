"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getVendors, deleteVendor, bulkUpdateVendors } from "@/lib/firestore-service";
import { Vendor, VendorCategory, EventTheme } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, ExternalLink, Save, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-service";
import { VENDOR_CATEGORIES, EVENT_THEMES } from "@/lib/constants";

type BulkListMode = "add" | "remove" | "replace";

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [editedVendors, setEditedVendors] = useState<{ [id: string]: Partial<Vendor> }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
    const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
    const [bulkCategoryMode, setBulkCategoryMode] = useState<BulkListMode>("add");
    const [bulkThemeMode, setBulkThemeMode] = useState<BulkListMode>("add");
    const [bulkCategories, setBulkCategories] = useState<VendorCategory[]>([]);
    const [bulkThemes, setBulkThemes] = useState<EventTheme[]>([]);


    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        setLoading(true);
        try {
            const data = await getVendors();
            setVendors(data);
        } catch (error) {
            console.error("Failed to load vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteVendor(id);
                setVendors(vendors.filter(v => v.id !== id));
            } catch (error) {
                alert("Failed to delete vendor");
            }
        }
    };

    const handleBulkEditChange = (id: string, field: keyof Vendor, value: any) => {
        setEditedVendors(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleRowImageUpload = async (id: string, file: File) => {
        setUploadingImageId(id);
        try {
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const imageUrl = await uploadImage(file, `vendors/main/${id}/${Date.now()}-${safeName}`);
            handleBulkEditChange(id, "image", imageUrl);
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert("Failed to upload image");
        } finally {
            setUploadingImageId(null);
        }
    };

    const saveBulkChanges = async () => {
        const updates = Object.entries(editedVendors).map(([id, data]) => ({ id, data }));


        setIsSaving(true);
        try {
            await bulkUpdateVendors(updates);
            await loadVendors();
            setEditedVendors({});
            setSelectedVendorIds([]);
        } catch (error) {
            alert("Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.categories.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleVendorSelection = (id: string) => {
        setSelectedVendorIds(prev =>
            prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]
        );
    };

    const selectAllFiltered = () => setSelectedVendorIds(filteredVendors.map(v => v.id));
    const clearSelection = () => setSelectedVendorIds([]);
    const allSelected = filteredVendors.length > 0 && selectedVendorIds.length === filteredVendors.length;
    const hasUnsavedChanges = Object.keys(editedVendors).length > 0;
    const selectedCount = selectedVendorIds.length;
    const totalVendorCount = vendors.length;
    const filteredVendorCount = filteredVendors.length;
    const categoryOptions = VENDOR_CATEGORIES.filter((c) => c !== "All Categories");
    const themeOptions = EVENT_THEMES.filter((t) => t !== "All Themes");

    const applyListByMode = <T extends string>(current: T[], values: T[], mode: BulkListMode): T[] => {
        const set = new Set(current);
        if (mode === "replace") return [...new Set(values)];
        if (mode === "add") {
            values.forEach((v) => set.add(v));
            return Array.from(set);
        }
        values.forEach((v) => set.delete(v));
        return Array.from(set);
    };

    const applyCategoriesToSelected = () => {
        if (!selectedVendorIds.length || !bulkCategories.length) return;
        setEditedVendors((prev) => {
            const next = { ...prev };
            selectedVendorIds.forEach((id) => {
                const vendor = vendors.find((v) => v.id === id);
                if (!vendor) return;
                const current = (next[id]?.categories as VendorCategory[] | undefined) ?? vendor.categories ?? [];
                const updated = applyListByMode(current, bulkCategories, bulkCategoryMode);
                next[id] = { ...(next[id] ?? {}), categories: updated };
            });
            return next;
        });
    };

    const applyThemesToSelected = () => {
        if (!selectedVendorIds.length || !bulkThemes.length) return;
        setEditedVendors((prev) => {
            const next = { ...prev };
            selectedVendorIds.forEach((id) => {
                const vendor = vendors.find((v) => v.id === id);
                if (!vendor) return;
                const current = (next[id]?.eventThemes as EventTheme[] | undefined) ?? vendor.eventThemes ?? [];
                const updated = applyListByMode(current, bulkThemes, bulkThemeMode);
                next[id] = { ...(next[id] ?? {}), eventThemes: updated };
            });
            return next;
        });
    };

    const deleteSelectedVendors = async () => {
        if (!selectedVendorIds.length) return;
        if (!confirm(`Delete ${selectedVendorIds.length} selected vendor(s)? This cannot be undone.`)) return;

        setIsSaving(true);
        try {
            const results = await Promise.allSettled(
                selectedVendorIds.map((id) => deleteVendor(id))
            );

            const failedCount = results.filter((r) => r.status === "rejected").length;
            const deletedIds = selectedVendorIds.filter((_, index) => results[index].status === "fulfilled");

            if (deletedIds.length) {
                setVendors((prev) => prev.filter((v) => !deletedIds.includes(v.id)));
                setEditedVendors((prev) => {
                    const next = { ...prev };
                    deletedIds.forEach((id) => {
                        delete next[id];
                    });
                    return next;
                });
                setSelectedVendorIds((prev) => prev.filter((id) => !deletedIds.includes(id)));
            }

            if (failedCount > 0) {
                alert(`${failedCount} vendor(s) could not be deleted. Please try again.`);
            }
        } catch (error) {
            console.error("Bulk delete failed:", error);
            alert("Failed to delete selected vendors");
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <div className="p-8 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin: Vendors</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your vendor marketplace • {totalVendorCount} total
                        {searchTerm.trim() ? ` • ${filteredVendorCount} shown` : ""}
                    </p>
                </div>
                <div className="flex gap-3">
                    {hasUnsavedChanges && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditedVendors({});
                                setSelectedVendorIds([]);
                            }}
                            disabled={isSaving}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <X size={18} /> Discard Changes
                        </Button>
                    )}
                    <Button
                        onClick={saveBulkChanges}
                        disabled={isSaving || !hasUnsavedChanges}
                        className={cn(
                            "flex items-center gap-2 transition-all",
                            hasUnsavedChanges ? "bg-green-600 hover:bg-green-700 text-white" : "bg-muted text-muted-foreground"
                        )}
                    >
                        {isSaving ? (
                            <><Loader2 size={18} className="animate-spin" /> Saving...</>
                        ) : (
                            <><Save size={18} /> Save All Changes</>
                        )}
                    </Button>
                    <div className="w-px bg-border mx-1" />
                    <Button asChild className="bg-primary text-primary-foreground">
                        <Link href="/admin/vendors/new" className="flex items-center gap-2">
                            <Plus size={18} /> Add New Vendor
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, location, or category..."
                    className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>



            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="w-[4%] px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={() => {
                                            if (allSelected) clearSelection();
                                            else selectAllFiltered();
                                        }}
                                        className="h-4 w-4 rounded border-border"
                                        title={allSelected ? "Deselect all" : "Select all"}
                                    />
                                </th>
                                <th className="w-[30%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Vendor Name</th>
                                <th className="w-[20%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</th>
                                <th className="w-[12%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</th>
                                <th className="w-[12%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Featured</th>
                                <th className="w-[10%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug</th>
                                <th className="w-[12%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredVendors.length > 0 ? filteredVendors.map((v) => (
                                <tr key={v.id} className={cn("hover:bg-secondary/20 transition-colors", editedVendors[v.id] && "bg-primary/5")}>
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedVendorIds.includes(v.id)}
                                            onChange={() => toggleVendorSelection(v.id)}
                                            className="h-4 w-4 rounded border-border"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative group shrink-0">
                                                <img
                                                    src={editedVendors[v.id]?.image ?? v.image}
                                                    className="w-10 h-10 rounded-lg object-cover border border-border cursor-pointer group-hover:opacity-70 transition-opacity"
                                                    alt=""
                                                    onClick={() => document.getElementById(`file-input-${v.id}`)?.click()}
                                                />
                                                {uploadingImageId === v.id ? (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                                                        <Loader2 size={16} className="animate-spin text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/20 rounded-lg">
                                                        <ImageIcon size={16} className="text-white" />
                                                    </div>
                                                )}
                                                <input
                                                    id={`file-input-${v.id}`}
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleRowImageUpload(v.id, file);
                                                    }}
                                                />
                                            </div>
                                            <input
                                                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                                                value={editedVendors[v.id]?.name ?? v.name}
                                                onChange={(e) => handleBulkEditChange(v.id, "name", e.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        <input
                                            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                                            value={editedVendors[v.id]?.location ?? v.location}
                                            onChange={(e) => handleBulkEditChange(v.id, "location", e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                            <input
                                                type="number"
                                                className="w-full bg-background border border-border rounded-lg pl-5 pr-2 py-1.5 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                                                value={editedVendors[v.id]?.price ?? v.price ?? ""}
                                                onChange={(e) => handleBulkEditChange(v.id, "price", e.target.value ? Number(e.target.value) : null)}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(editedVendors[v.id]?.featured ?? v.featured)}
                                            onChange={(e) => handleBulkEditChange(v.id, "featured", e.target.checked)}
                                            className="h-4 w-4 rounded border-border"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                                        <input
                                            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/30 outline-none"
                                            value={editedVendors[v.id]?.slug ?? v.slug}
                                            onChange={(e) => handleBulkEditChange(v.id, "slug", e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild title="View Public Page">
                                                <Link href={`/dashboard/hosts/vendor/${v.slug}`} target="_blank">
                                                    <ExternalLink size={16} />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild className="text-blue-500 hover:text-blue-600 hover:bg-blue-50" title="Edit Full Detail">
                                                <Link href={`/admin/vendors/${v.id}/edit`}>
                                                    <Edit size={16} />
                                                </Link>
                                            </Button>
                                            <button
                                                onClick={() => handleDelete(v.id, v.name)}
                                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-muted-foreground">
                                        No vendors found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedCount > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[min(92vw,980px)]">
                    <div className="mb-2 rounded-xl border border-border bg-background/95 backdrop-blur p-3 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
                                <div className="flex gap-2">
                                    <select
                                        value={bulkCategoryMode}
                                        onChange={(e) => setBulkCategoryMode(e.target.value as BulkListMode)}
                                        className="h-8 rounded border border-border bg-background px-2 text-xs"
                                    >
                                        <option value="add">Add</option>
                                        <option value="remove">Remove</option>
                                        <option value="replace">Replace</option>
                                    </select>
                                    <select
                                        multiple
                                        value={bulkCategories}
                                        onChange={(e) => setBulkCategories(Array.from(e.target.selectedOptions).map((o) => o.value as VendorCategory))}
                                        className="min-h-20 flex-1 rounded border border-border bg-background px-2 py-1 text-xs"
                                    >
                                        {categoryOptions.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <Button size="sm" className="h-8 text-xs self-start" onClick={applyCategoriesToSelected} disabled={!bulkCategories.length}>
                                        Apply
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Themes</p>
                                <div className="flex gap-2">
                                    <select
                                        value={bulkThemeMode}
                                        onChange={(e) => setBulkThemeMode(e.target.value as BulkListMode)}
                                        className="h-8 rounded border border-border bg-background px-2 text-xs"
                                    >
                                        <option value="add">Add</option>
                                        <option value="remove">Remove</option>
                                        <option value="replace">Replace</option>
                                    </select>
                                    <select
                                        multiple
                                        value={bulkThemes}
                                        onChange={(e) => setBulkThemes(Array.from(e.target.selectedOptions).map((o) => o.value as EventTheme))}
                                        className="min-h-20 flex-1 rounded border border-border bg-background px-2 py-1 text-xs"
                                    >
                                        {themeOptions.map((theme) => (
                                            <option key={theme} value={theme}>{theme}</option>
                                        ))}
                                    </select>
                                    <Button size="sm" className="h-8 text-xs self-start" onClick={applyThemesToSelected} disabled={!bulkThemes.length}>
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-border bg-background/95 backdrop-blur px-3 py-2 shadow-lg w-fit">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {selectedCount} selected
                        </span>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 text-xs"
                            onClick={deleteSelectedVendors}
                            disabled={isSaving}
                        >
                            Delete selected
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs"
                            onClick={clearSelection}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
