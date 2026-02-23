"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getVendors, deleteVendor, bulkUpdateVendors } from "@/lib/firestore-service";
import { Vendor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, ExternalLink, Save, X, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isBulkEditing, setIsBulkEditing] = useState(false);
    const [editedVendors, setEditedVendors] = useState<{ [id: string]: Partial<Vendor> }>({});
    const [isSaving, setIsSaving] = useState(false);

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

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="w-[30%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Vendor Name</th>
                                <th className="w-[25%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</th>
                                <th className="w-[15%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Price ($)</th>
                                <th className="w-[15%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug</th>
                                <th className="w-[15%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredVendors.length > 0 ? filteredVendors.map((v) => (
                                <tr key={v.id} className={cn("hover:bg-secondary/20 transition-colors", isBulkEditing && "bg-secondary/10")}>
                                    <td className="px-6 py-4">
                                        {isBulkEditing ? (
                                            <input
                                                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                                                value={editedVendors[v.id]?.name ?? v.name}
                                                onChange={(e) => handleBulkEditChange(v.id, "name", e.target.value)}
                                            />
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
                                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
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

