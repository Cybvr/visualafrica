"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getVendors, deleteVendor, bulkUpdateVendors, addVendor } from "@/lib/firestore-service";
import { Vendor, VendorCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, ExternalLink, Save, X, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-service";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import AdminNav from "@/components/admin/AdminNav";

type RowVendor = Vendor & { isDraft?: boolean };
type EditableField = "name" | "location" | "price" | "categories" | "slug" | "featured";
type DraftVendor = {
  id: string;
  name: string;
  location: string;
  slug: string;
  price: number | null;
  featured: boolean;
  categories: VendorCategory[];
  image: string;
};

const DEFAULT_VENDOR_IMAGE = "/images/vendor-spotlight.jpg";

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildVendorLoginEmail(slug: string) {
  const safeSlug = toSlug(slug || "");
  return safeSlug ? `dummy+vendor-${safeSlug}@waddylife.com` : "—";
}

function makeDraftVendor(id: string): DraftVendor {
  return {
    id,
    name: "",
    location: "Lagos, Nigeria",
    slug: "",
    price: null,
    featured: false,
    categories: ["Experiences"],
    image: DEFAULT_VENDOR_IMAGE,
  };
}

function toDraftRow(draft: DraftVendor): RowVendor {
  const slug = draft.slug || toSlug(draft.name || `vendor-${Date.now()}`);
  return {
    id: draft.id,
    ownerId: "admin",
    slug,
    name: draft.name,
    location: draft.location,
    price: draft.price,
    rating: 4.5,
    image: draft.image,
    categories: draft.categories,
    featured: draft.featured,
    eventThemes: ["Social Gathering"],
    description: draft.name ? `${draft.name} services.` : "Vendor description",
    shortDescription: draft.name || "Vendor",
    gallery: [],
    whatsIncluded: [],
    services: [],
    stats: {
      eventsPlanned: "0",
      satisfiedClients: "0%",
      corporateEvents: "0",
      yearsExperience: "0",
      uniqueLocations: "0",
    },
    phone: "",
    areaServed: [],
    yearEstablished: new Date().getFullYear(),
    responseTime: "within 24 hours",
    vendor: {
      name: draft.name || "Vendor",
      logo: "",
      slug,
    },
    isDraft: true,
  };
}

function toVendorPayload(draft: DraftVendor): Omit<Vendor, "id"> {
  const slug = draft.slug || toSlug(draft.name || `vendor-${Date.now()}`);
  const safeName = draft.name || slug;
  return {
    ownerId: "admin",
    slug,
    name: safeName,
    location: draft.location || "Lagos, Nigeria",
    price: draft.price,
    rating: 4.5,
    image: draft.image || DEFAULT_VENDOR_IMAGE,
    categories: draft.categories?.length ? draft.categories : ["Experiences"],
    featured: draft.featured,
    eventThemes: ["Social Gathering"],
    description: `${safeName} services.`,
    shortDescription: safeName,
    gallery: [],
    whatsIncluded: [],
    services: [],
    stats: {
      eventsPlanned: "0",
      satisfiedClients: "0%",
      corporateEvents: "0",
      yearsExperience: "0",
      uniqueLocations: "0",
    },
    phone: "",
    areaServed: [],
    yearEstablished: new Date().getFullYear(),
    responseTime: "within 24 hours",
    vendor: {
      name: safeName,
      logo: "",
      slug,
    },
  };
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editedVendors, setEditedVendors] = useState<Record<string, Partial<Vendor>>>({});
  const [draftVendors, setDraftVendors] = useState<DraftVendor[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [editingCell, setEditingCell] = useState<{ id: string; field: EditableField } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    setLoading(true);
    try {
      const data = await getVendors();
      setVendors(data);
    } catch (error) {
      console.error("Failed to load vendors:", error);
    } finally {
      setLoading(false);
    }
  }

  function updateExistingVendorField(id: string, field: keyof Vendor, value: unknown) {
    setEditedVendors((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  function updateDraftField(id: string, field: keyof DraftVendor, value: unknown) {
    setDraftVendors((prev) =>
      prev.map((draft) => {
        if (draft.id !== id) return draft;
        const next = { ...draft, [field]: value } as DraftVendor;
        if (field === "name" && (!draft.slug || draft.slug === toSlug(draft.name))) {
          next.slug = toSlug(String(value));
        }
        return next;
      })
    );
  }

  function updateRowField(row: RowVendor, field: keyof Vendor, value: unknown) {
    if (row.isDraft) {
      updateDraftField(row.id, field as keyof DraftVendor, value);
      return;
    }
    updateExistingVendorField(row.id, field, value);
  }

  async function handleRowImageUpload(row: RowVendor, file: File) {
    setUploadingImageId(row.id);
    try {
      if (!user) {
        toast.error("You must be signed in to upload images");
        return;
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const pathPrefix = row.isDraft ? `vendors/draft/${row.id}` : `vendors/main/${row.id}`;
      const imageUrl = await uploadImage(file, `${pathPrefix}/${Date.now()}-${safeName}`);
      if (row.isDraft) {
        updateDraftField(row.id, "image", imageUrl);
      } else {
        updateExistingVendorField(row.id, "image", imageUrl);
      }
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImageId(null);
    }
  }

  async function handleDelete(id: string, name: string, isDraft?: boolean) {
    if (isDraft) {
      setDraftVendors((prev) => prev.filter((v) => v.id !== id));
      return;
    }
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteVendor(id);
      setVendors((prev) => prev.filter((v) => v.id !== id));
      setEditedVendors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch {
      alert("Failed to delete vendor");
    }
  }

  async function saveAllChanges() {
    const updates = Object.entries(editedVendors).map(([id, data]) => ({ id, data }));
    const hasDrafts = draftVendors.length > 0;
    if (!updates.length && !hasDrafts) return;

    setIsSaving(true);
    try {
      if (hasDrafts) {
        for (const draft of draftVendors) {
          const payload = toVendorPayload(draft);
          await addVendor(payload);
        }
      }

      if (updates.length) {
        await bulkUpdateVendors(updates);
      }

      await loadVendors();
      setEditedVendors({});
      setDraftVendors([]);
      setRowSelection({});
      toast.success("Changes saved");
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSelectedRows() {
    const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
    if (!selectedRows.length) return;

    const liveRows = selectedRows.filter((r) => !r.isDraft);
    const draftRows = selectedRows.filter((r) => r.isDraft);

    if (liveRows.length && !confirm(`Delete ${liveRows.length} selected vendor(s)? This cannot be undone.`)) {
      return;
    }

    setIsSaving(true);
    try {
      if (draftRows.length) {
        const draftIds = new Set(draftRows.map((r) => r.id));
        setDraftVendors((prev) => prev.filter((d) => !draftIds.has(d.id)));
      }

      if (liveRows.length) {
        const results = await Promise.allSettled(liveRows.map((row) => deleteVendor(row.id)));
        const deletedIds = liveRows
          .filter((_, idx) => results[idx].status === "fulfilled")
          .map((row) => row.id);

        if (deletedIds.length) {
          setVendors((prev) => prev.filter((v) => !deletedIds.includes(v.id)));
          setEditedVendors((prev) => {
            const next = { ...prev };
            deletedIds.forEach((id) => delete next[id]);
            return next;
          });
        }
      }

      setRowSelection({});
    } finally {
      setIsSaving(false);
    }
  }

  const tableData = useMemo<RowVendor[]>(() => {
    const draftRows = draftVendors.map(toDraftRow);
    return [...draftRows, ...vendors];
  }, [draftVendors, vendors]);

  const draftById = useMemo(() => new Map(draftVendors.map((d) => [d.id, d])), [draftVendors]);

  function getRowFieldValue(row: RowVendor, field: EditableField) {
    if (row.isDraft) {
      const draft = draftById.get(row.id);
      return (draft?.[field as keyof DraftVendor] ?? row[field as keyof RowVendor]) as unknown;
    }
    return (editedVendors[row.id]?.[field as keyof Vendor] ?? row[field as keyof RowVendor]) as unknown;
  }

  const columns = useMemo<ColumnDef<RowVendor>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4 w-4 rounded border-border"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-border"
          />
        ),
        size: 44,
      },
      {
        accessorKey: "name",
        header: "Vendor",
        cell: ({ row }) => {
          const rowData = row.original;
          const rowImage = rowData.isDraft
            ? draftVendors.find((d) => d.id === rowData.id)?.image ?? rowData.image
            : editedVendors[rowData.id]?.image ?? rowData.image;

          return (
            <div className="flex items-center gap-3 min-w-[320px]">
              <div className="relative group shrink-0">
                <img
                  src={rowImage}
                  className="w-10 h-10 rounded-lg object-cover border border-border cursor-pointer group-hover:opacity-70 transition-opacity"
                  alt=""
                  onClick={() => document.getElementById(`file-input-${rowData.id}`)?.click()}
                />
                {uploadingImageId === rowData.id ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <Loader2 size={16} className="animate-spin text-white" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/20 rounded-lg">
                    <ImageIcon size={16} className="text-white" />
                  </div>
                )}
                <input
                  id={`file-input-${rowData.id}`}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleRowImageUpload(rowData, file);
                  }}
                />
              </div>
              {editingCell?.id === rowData.id && editingCell?.field === "name" ? (
                <input
                  autoFocus
                  className="w-full bg-background border border-border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-primary/30 outline-none"
                  value={String(getRowFieldValue(rowData, "name") || "")}
                  onChange={(e) => updateRowField(rowData, "name", e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") setEditingCell(null);
                  }}
                  placeholder="Vendor name"
                />
              ) : (
                <button
                  className="w-full min-h-8 text-left px-2 py-1 rounded-md border border-transparent hover:border-border hover:bg-background text-sm"
                  onClick={() => setEditingCell({ id: rowData.id, field: "name" })}
                >
                  {String(getRowFieldValue(rowData, "name") || "Click to edit")}
                </button>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              {editingCell?.id === rowData.id && editingCell?.field === "location" ? (
                <input
                  autoFocus
                  className="w-full min-w-[200px] bg-background border border-border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-primary/30 outline-none"
                  value={String(getRowFieldValue(rowData, "location") || "")}
                  onChange={(e) => updateRowField(rowData, "location", e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") setEditingCell(null);
                  }}
                />
              ) : (
                <button
                  className="w-full min-h-8 text-left px-2 py-1 rounded-md border border-transparent hover:border-border hover:bg-background text-sm min-w-[200px]"
                  onClick={() => setEditingCell({ id: rowData.id, field: "location" })}
                >
                  {String(getRowFieldValue(rowData, "location") || "Click to edit")}
                </button>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const rowData = row.original;
          const value = getRowFieldValue(rowData, "price") as number | null;

          return (
            <div className="relative min-w-[110px]">
              {editingCell?.id === rowData.id && editingCell?.field === "price" ? (
                <>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <input
                    autoFocus
                    type="number"
                    className="w-full bg-background border border-border rounded-md pl-5 pr-2 py-1 text-sm focus:ring-1 focus:ring-primary/30 outline-none"
                    value={value ?? ""}
                    onChange={(e) => updateRowField(rowData, "price", e.target.value ? Number(e.target.value) : null)}
                    onBlur={() => setEditingCell(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") setEditingCell(null);
                    }}
                  />
                </>
              ) : (
                <button
                  className="w-full min-h-8 text-left px-2 py-1 rounded-md border border-transparent hover:border-border hover:bg-background text-sm"
                  onClick={() => setEditingCell({ id: rowData.id, field: "price" })}
                >
                  {value == null ? "—" : `$${value}`}
                </button>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "categories",
        header: "Category",
        cell: ({ row }) => {
          const rowData = row.original;
          const categories = getRowFieldValue(rowData, "categories") as VendorCategory[] | undefined;

          return (
            <>
              {editingCell?.id === rowData.id && editingCell?.field === "categories" ? (
                <select
                  autoFocus
                  className="min-w-[170px] bg-background border border-border rounded-md px-2 py-1 text-xs"
                  value={(categories?.[0] as string) || "Experiences"}
                  onChange={(e) => updateRowField(rowData, "categories", [e.target.value as VendorCategory])}
                  onBlur={() => setEditingCell(null)}
                >
                  {VENDOR_CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  className="min-w-[170px] w-full min-h-8 text-left px-2 py-1 rounded-md border border-transparent hover:border-border hover:bg-background text-xs"
                  onClick={() => setEditingCell({ id: rowData.id, field: "categories" })}
                >
                  {(categories?.[0] as string) || "Experiences"}
                </button>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => {
          const rowData = row.original;
          const isChecked = Boolean(
            getRowFieldValue(rowData, "featured")
          );
          return (
            <div className="text-center min-w-[80px]">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => updateRowField(rowData, "featured", e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              {editingCell?.id === rowData.id && editingCell?.field === "slug" ? (
                <input
                  autoFocus
                  className="w-full min-w-[180px] bg-background border border-border rounded-md px-2 py-1 text-xs font-mono focus:ring-1 focus:ring-primary/30 outline-none"
                  value={String(getRowFieldValue(rowData, "slug") || "")}
                  onChange={(e) => updateRowField(rowData, "slug", e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") setEditingCell(null);
                  }}
                />
              ) : (
                <button
                  className="w-full min-h-8 text-left px-2 py-1 rounded-md border border-transparent hover:border-border hover:bg-background text-xs font-mono min-w-[180px]"
                  onClick={() => setEditingCell({ id: rowData.id, field: "slug" })}
                >
                  {String(getRowFieldValue(rowData, "slug") || "Click to edit")}
                </button>
              )}
            </>
          );
        },
      },
      {
        id: "loginEmail",
        header: "Login Email",
        cell: ({ row }) => {
          const rowData = row.original;
          const slug = String(getRowFieldValue(rowData, "slug") || "");
          return (
            <span className="inline-block min-w-[260px] px-2 py-1 text-xs font-mono text-muted-foreground">
              {buildVendorLoginEmail(slug)}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const v = row.original;
          if (v.isDraft) {
            return (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(v.id, v.name, true)}
                title="Remove draft"
              >
                <X size={16} />
              </Button>
            );
          }

          return (
            <div className="flex justify-end gap-1 min-w-[130px]">
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
          );
        },
      },
    ],
    [draftById, editedVendors, editingCell, uploadingImageId]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue ?? "").toLowerCase().trim();
      if (!q) return true;
      const v = row.original;
      return [v.name, v.location, ...(v.categories || []), v.slug]
        .join(" ")
        .toLowerCase()
        .includes(q);
    },
    enableRowSelection: true,
    initialState: {
      pagination: { pageSize: 20 },
    },
  });

  const selectedCount = table.getSelectedRowModel().rows.length;
  const hasUnsavedChanges = Object.keys(editedVendors).length > 0 || draftVendors.length > 0;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin: Vendors</h1>
          <p className="text-muted-foreground mt-1">
            Spreadsheet-style bulk editing • {vendors.length} live vendors
            {draftVendors.length ? ` • ${draftVendors.length} draft row(s)` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-4 items-end">
          <AdminNav />
          <div className="flex gap-3">
            {hasUnsavedChanges && (
              <Button
                variant="ghost"
                onClick={() => {
                  setEditedVendors({});
                  setDraftVendors([]);
                  setRowSelection({});
                }}
                disabled={isSaving}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <X size={18} /> Discard Changes
              </Button>
            )}
            <Button
              onClick={saveAllChanges}
              disabled={isSaving || !hasUnsavedChanges}
              className={cn(
                "flex items-center gap-2 transition-all",
                hasUnsavedChanges ? "bg-green-600 hover:bg-green-700 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Save All Changes
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setDraftVendors((prev) => {
                  const id = `__new__:${Date.now()}:${prev.length}`;
                  setTimeout(() => setEditingCell({ id, field: "name" }), 0);
                  return [...prev, makeDraftVendor(id)];
                })
              }
              className="flex items-center gap-2"
            >
              <Plus size={18} /> Add Row
            </Button>
            <Button asChild className="bg-primary text-primary-foreground font-bold">
              <Link href="/admin/vendors/new" className="flex items-center gap-2">
                <Plus size={18} /> Full Form
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search by name, location, category, or slug..."
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-secondary/50 border-b border-border">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "hover:bg-secondary/20 transition-colors",
                        row.original.isDraft && "bg-amber-50/50",
                        editedVendors[row.original.id] && "bg-primary/5"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-20 text-center text-muted-foreground">
                      No vendors found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background">
            <div className="text-xs text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft size={14} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/95 backdrop-blur px-3 py-2 shadow-lg w-fit">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
              {selectedCount} selected
            </span>
            <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={deleteSelectedRows} disabled={isSaving}>
              Delete selected
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setRowSelection({})}>
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
