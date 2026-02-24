"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getVendors, deleteVendor, bulkUpdateVendors } from "@/lib/firestore-service";
import { Vendor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, ExternalLink, Save, X, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isBulkEditing, setIsBulkEditing] = useState(false);
    const [editedVendors, setEditedVendors] = useState<{ [id: string]: Partial<Vendor> }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);

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
    const allFilteredFeatured =
        filteredVendors.length > 0 &&
        filteredVendors.every(v => Boolean(editedVendors[v.id]?.featured ?? v.featured));
    const toggleSelectAll = () => {
        if (allSelected) clearSelection();
        else selectAllFiltered();
    };
    const toggleBulkFeatured = (checked: boolean) => {
        setEditedVendors(prev => {
            const next = { ...prev };
            filteredVendors.forEach(v => {
                next[v.id] = { ...next[v.id], featured: checked };
            });
            return next;
        });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin: Vendors</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your vendor marketplace • {vendors.length} vendors
                    </p>
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
                                                checked={allFilteredFeatured}
                                                onChange={(e) => toggleBulkFeatured(e.target.checked)}
                                                className="h-4 w-4 rounded border-border cursor-pointer"
                                                title={allFilteredFeatured ? "Unfeature all visible vendors" : "Feature all visible vendors"}
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
                                            <input
                                                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                                                value={editedVendors[v.id]?.name ?? v.name}
                                                onChange={(e) => handleBulkEditChange(v.id, "name", e.target.value)}
                                            />
                                        ) : (
                                            <Link href={`/admin/vendors/${v.id}/edit`} className="flex items-center gap-3 hover:opacity-90">
                                                <img src={v.image || "/placeholder.png"} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                                <div className="font-bold text-sm truncate hover:underline">{v.name}</div>
                                            </Link>
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
