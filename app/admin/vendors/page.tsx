"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getVendors, deleteVendor, bulkUpdateVendors } from "@/lib/firestore-service";
import { Vendor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, ExternalLink, Save, X, LayoutGrid, ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-service";

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isBulkEditing, setIsBulkEditing] = useState(false);
    const [editedVendors, setEditedVendors] = useState<{ [id: string]: Partial<Vendor> }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
    const [isBulkUploadingImages, setIsBulkUploadingImages] = useState(false);
    const [bulkImageReport, setBulkImageReport] = useState<{
        matchedCount: number;
        uploadedCount: number;
        failedUploads: string[];
        unmatchedFiles: string[];
    } | null>(null);

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

    const saveBulkChanges = async () => {
        const updates = Object.entries(editedVendors).map(([id, data]) => ({ id, data }));
        if (updates.length === 0) {
            setIsBulkEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            await bulkUpdateVendors(updates);
            await loadVendors();
            setIsBulkEditing(false);
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
    const featuredIds = filteredVendors
        .filter(v => Boolean(editedVendors[v.id]?.featured ?? v.featured))
        .map(v => v.id);
    const allFeaturedSelected =
        featuredIds.length > 0 &&
        selectedVendorIds.length === featuredIds.length &&
        featuredIds.every(id => selectedVendorIds.includes(id));
    const toggleSelectAll = () => {
        if (allSelected) clearSelection();
        else selectAllFiltered();
    };
    const toggleSelectFeatured = (checked: boolean) => {
        setSelectedVendorIds(checked ? featuredIds : []);
    };

    const toKey = (value: string) =>
        value
            .toLowerCase()
            .trim()
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const buildVendorLookup = () => {
        const byId = new Map<string, Vendor>();
        const bySlug = new Map<string, Vendor>();
        const byName = new Map<string, Vendor[]>();

        for (const vendor of vendors) {
            byId.set(toKey(vendor.id), vendor);
            bySlug.set(toKey(vendor.slug), vendor);
            const nameKey = toKey(vendor.name);
            const list = byName.get(nameKey) ?? [];
            list.push(vendor);
            byName.set(nameKey, list);
        }

        return { byId, bySlug, byName };
    };

    const resolveVendorForFile = (fileName: string, lookup: ReturnType<typeof buildVendorLookup>) => {
        const base = toKey(fileName);
        if (!base) return null;
        const byId = lookup.byId.get(base);
        if (byId) return byId;
        const bySlug = lookup.bySlug.get(base);
        if (bySlug) return bySlug;
        const nameMatches = lookup.byName.get(base) ?? [];
        if (nameMatches.length === 1) return nameMatches[0];
        return null;
    };

    const handleBulkMainImageUpload = async (files: FileList | null) => {
        if (!files?.length) return;
        setIsBulkUploadingImages(true);
        setBulkImageReport(null);

        const lookup = buildVendorLookup();
        const unmatchedFiles: string[] = [];
        const failedUploads: string[] = [];
        const imageUpdates: { [id: string]: Partial<Vendor> } = {};
        let matchedCount = 0;
        let uploadedCount = 0;

        for (const file of Array.from(files)) {
            const vendor = resolveVendorForFile(file.name, lookup);
            if (!vendor) {
                unmatchedFiles.push(file.name);
                continue;
            }

            matchedCount += 1;

            try {
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
                const imageUrl = await uploadImage(file, `vendors/main/${vendor.id}/${Date.now()}-${safeName}`);
                const existing = imageUpdates[vendor.id] ?? editedVendors[vendor.id] ?? {};
                imageUpdates[vendor.id] = { ...existing, image: imageUrl };
                uploadedCount += 1;
            } catch (error) {
                failedUploads.push(file.name);
                console.error(`Bulk upload failed for ${file.name}:`, error);
            }
        }

        if (Object.keys(imageUpdates).length > 0) {
            setEditedVendors((prev) => {
                const next = { ...prev };
                for (const [id, data] of Object.entries(imageUpdates)) {
                    next[id] = { ...(next[id] ?? {}), ...data };
                }
                return next;
            });
        }

        setBulkImageReport({ matchedCount, uploadedCount, failedUploads, unmatchedFiles });
        setIsBulkUploadingImages(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin: Vendors</h1>
                    <p className="text-muted-foreground mt-1">Manage your vendor marketplace</p>
                </div>
                <div className="flex gap-3">
                    {!isBulkEditing ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsBulkEditing(true)}
                                className="flex items-center gap-2 border-primary text-primary hover:bg-primary/5"
                            >
                                <LayoutGrid size={18} /> Bulk Edit Mode
                            </Button>
                            <Button asChild className="bg-primary text-primary-foreground">
                                <Link href="/admin/vendors/new" className="flex items-center gap-2">
                                    <Plus size={18} /> Add New Vendor
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setIsBulkEditing(false);
                                    setEditedVendors({});
                                    setSelectedVendorIds([]);
                                }}
                                disabled={isSaving}
                                className="flex items-center gap-2"
                            >
                                <X size={18} /> Cancel
                            </Button>
                            <Button
                                onClick={saveBulkChanges}
                                disabled={isSaving}
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                            >
                                {isSaving ? "Saving..." : <><Save size={18} /> Save All Changes</>}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {!isBulkEditing && (
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, location, or category..."
                        className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            )}

            {isBulkEditing && (
                <div className="mb-6 border border-border rounded-xl bg-card p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold">Bulk Main Image Upload</p>
                            <p className="text-xs text-muted-foreground">
                                Upload multiple images and match by filename to vendor `id`, `slug`, or exact `name`.
                            </p>
                        </div>
                        <label className={cn(
                            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer",
                            "bg-primary text-primary-foreground hover:opacity-90 transition-opacity",
                            isBulkUploadingImages && "opacity-70 cursor-wait"
                        )}>
                            {isBulkUploadingImages ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                            {isBulkUploadingImages ? "Uploading..." : "Select Image Files"}
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                disabled={isBulkUploadingImages}
                                onChange={async (e) => {
                                    const input = e.currentTarget;
                                    await handleBulkMainImageUpload(input.files);
                                    input.value = "";
                                }}
                            />
                        </label>
                    </div>

                    {bulkImageReport && (
                        <div className="mt-3 space-y-1 text-xs">
                            <p className="text-foreground">
                                Matched: <span className="font-semibold">{bulkImageReport.matchedCount}</span> | Uploaded:{" "}
                                <span className="font-semibold">{bulkImageReport.uploadedCount}</span> | Failed:{" "}
                                <span className="font-semibold">{bulkImageReport.failedUploads.length}</span> | Unmatched:{" "}
                                <span className="font-semibold">{bulkImageReport.unmatchedFiles.length}</span>
                            </p>
                            {bulkImageReport.unmatchedFiles.length > 0 && (
                                <p className="text-amber-600 truncate">
                                    Unmatched: {bulkImageReport.unmatchedFiles.slice(0, 8).join(", ")}
                                    {bulkImageReport.unmatchedFiles.length > 8 ? ` +${bulkImageReport.unmatchedFiles.length - 8} more` : ""}
                                </p>
                            )}
                            {bulkImageReport.failedUploads.length > 0 && (
                                <p className="text-red-600 truncate">
                                    Failed uploads: {bulkImageReport.failedUploads.slice(0, 8).join(", ")}
                                    {bulkImageReport.failedUploads.length > 8 ? ` +${bulkImageReport.failedUploads.length - 8} more` : ""}
                                </p>
                            )}
                            <p className="text-muted-foreground">Click “Save All Changes” to persist uploaded main images.</p>
                        </div>
                    )}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-secondary/50 border-b border-border">
                            <tr>
                                {isBulkEditing && (
                                    <th className="w-[6%] px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4 rounded border-border"
                                            title={allSelected ? "Deselect all" : "Select all"}
                                        />
                                    </th>
                                )}
                                <th className="w-[30%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Vendor Name</th>
                                <th className="w-[25%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</th>
                                <th className="w-[15%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Price ($)</th>
                                <th className="w-[10%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {isBulkEditing ? (
                                        <div className="flex items-center gap-2 normal-case">
                                            <input
                                                type="checkbox"
                                                checked={allFeaturedSelected}
                                                onChange={(e) => toggleSelectFeatured(e.target.checked)}
                                                className="h-4 w-4 rounded border-border"
                                                title={allFeaturedSelected ? "Deselect featured" : "Select featured"}
                                            />
                                            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Featured</span>
                                        </div>
                                    ) : (
                                        "Featured"
                                    )}
                                </th>
                                <th className="w-[15%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug</th>
                                <th className="w-[15%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredVendors.length > 0 ? filteredVendors.map((v) => (
                                <tr key={v.id} className={cn("hover:bg-secondary/20 transition-colors", isBulkEditing && "bg-secondary/10")}>
                                    {isBulkEditing && (
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedVendorIds.includes(v.id)}
                                                onChange={() => toggleVendorSelection(v.id)}
                                                className="h-4 w-4 rounded border-border"
                                            />
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        {isBulkEditing ? (
                                            <div className="space-y-1.5">
                                                <input
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                                                    value={editedVendors[v.id]?.name ?? v.name}
                                                    onChange={(e) => handleBulkEditChange(v.id, "name", e.target.value)}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={(editedVendors[v.id]?.image ?? v.image) || "/placeholder.png"}
                                                        className="w-7 h-7 rounded object-cover border border-border"
                                                        alt=""
                                                    />
                                                    <span className="text-[10px] uppercase font-semibold tracking-wide text-muted-foreground">
                                                        {editedVendors[v.id]?.image ? "Main image updated" : "Current main image"}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <img src={v.image || "/placeholder.png"} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                                <div className="font-bold text-sm truncate">{v.name}</div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {isBulkEditing ? (
                                            <input
                                                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                                                value={editedVendors[v.id]?.location ?? v.location}
                                                onChange={(e) => handleBulkEditChange(v.id, "location", e.target.value)}
                                            />
                                        ) : (
                                            <span className="truncate block">{v.location}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isBulkEditing ? (
                                            <input
                                                type="number"
                                                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                                                value={editedVendors[v.id]?.price ?? v.price ?? ""}
                                                onChange={(e) => handleBulkEditChange(v.id, "price", e.target.value ? Number(e.target.value) : null)}
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-foreground">
                                                {v.price !== null ? `$${v.price.toLocaleString()}+` : "N/A"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isBulkEditing ? (
                                            <input
                                                type="checkbox"
                                                checked={Boolean(editedVendors[v.id]?.featured ?? v.featured)}
                                                onChange={(e) => handleBulkEditChange(v.id, "featured", e.target.checked)}
                                                className="h-4 w-4 rounded border-border"
                                            />
                                        ) : (
                                            <span className={cn(
                                                "text-xs font-bold uppercase tracking-wider",
                                                v.featured ? "text-amber-600" : "text-muted-foreground"
                                            )}>
                                                {v.featured ? "Yes" : "No"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                                        {isBulkEditing ? (
                                            <input
                                                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/30 outline-none"
                                                value={editedVendors[v.id]?.slug ?? v.slug}
                                                onChange={(e) => handleBulkEditChange(v.id, "slug", e.target.value)}
                                            />
                                        ) : (
                                            <span className="truncate block">/{v.slug}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!isBulkEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild title="View Public Page">
                                                    <Link href={`/dashboard/hosts/vendor/${v.slug}`} target="_blank">
                                                        <ExternalLink size={18} />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild className="text-blue-500 hover:text-blue-600 hover:bg-blue-50" title="Edit">
                                                    <Link href={`/admin/vendors/${v.id}/edit`}>
                                                        <Edit size={18} />
                                                    </Link>
                                                </Button>
                                                <button
                                                    onClick={() => handleDelete(v.id, v.name)}
                                                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                                {editedVendors[v.id] ? "Modified" : "Unchanged"}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={isBulkEditing ? 7 : 6} className="px-6 py-20 text-center text-muted-foreground">
                                        No vendors found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
