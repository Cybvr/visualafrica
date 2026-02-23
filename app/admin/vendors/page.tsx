"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getVendors, deleteVendor } from "@/lib/firestore-service";
import { Vendor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
                <Button asChild className="bg-primary text-primary-foreground">
                    <Link href="/admin/vendors/new" className="flex items-center gap-2">
                        <Plus size={18} /> Add New Vendor
                    </Link>
                </Button>
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
                    <table className="w-full text-left">
                        <thead className="bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Vendor</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Categories</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredVendors.length > 0 ? filteredVendors.map((v) => (
                                <tr key={v.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={v.image || "/placeholder.png"} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                            <div>
                                                <div className="font-bold text-sm">{v.name}</div>
                                                <div className="text-xs text-muted-foreground">/{v.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{v.location}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {v.categories.slice(0, 2).map(c => (
                                                <span key={c} className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{c}</span>
                                            ))}
                                            {v.categories.length > 2 && <span className="text-[10px] text-muted-foreground">+{v.categories.length - 2}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                                        {v.price !== null ? `$${v.price.toLocaleString()}+` : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
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
