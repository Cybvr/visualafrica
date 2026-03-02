"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getExperiences, deleteExperience, updateExperience } from "@/lib/firestore-service";
import { Experience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Search,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import AdminNav from "@/components/admin/AdminNav";
import { ReassignExperienceDialog } from "@/components/admin/ReassignExperienceDialog";

type EditableField = "title" | "price";

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
  return safeSlug ? `dummy+vendor-${safeSlug}@waddylife.com` : "-";
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editedExperiences, setEditedExperiences] = useState<Record<string, Partial<Experience>>>({});
  const [editingCell, setEditingCell] = useState<{ id: string; field: EditableField } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [reassignExperience, setReassignExperience] = useState<Experience | null>(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    setLoading(true);
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error("Failed to load experiences:", error);
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  }

  function getMergedValue<T extends keyof Experience>(exp: Experience, field: T): Experience[T] {
    const pending = editedExperiences[exp.id]?.[field];
    return (pending ?? exp[field]) as Experience[T];
  }

  function updateField(id: string, field: keyof Experience, value: unknown) {
    setEditedExperiences((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  function clearPendingChanges() {
    setEditedExperiences({});
    setEditingCell(null);
  }

  async function saveAllChanges() {
    const updates = Object.entries(editedExperiences).filter(([, data]) => Object.keys(data).length > 0);
    if (!updates.length) return;

    setIsSaving(true);
    try {
      await Promise.all(
        updates.map(([id, data]) => {
          const payload: Partial<Experience> = {};

          if (typeof data.title === "string") {
            payload.title = data.title.trim();
          }

          if (typeof data.price === "number" || data.price === null) {
            payload.price = data.price;
          }

          return updateExperience(id, payload);
        })
      );

      setExperiences((prev) =>
        prev.map((exp) => ({
          ...exp,
          ...(editedExperiences[exp.id] || {}),
        }))
      );

      clearPendingChanges();
      toast.success("Experience updates saved");
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Failed to save all changes");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setIsDeleting(id);
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((v) => v.id !== id));
      setEditedExperiences((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success("Experience deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete experience");
    } finally {
      setIsDeleting(null);
    }
  }

  const columns = useMemo<ColumnDef<Experience>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Experience",
        cell: ({ row }) => {
          const exp = row.original;
          const title = String(getMergedValue(exp, "title") || "");
          const isEditing = editingCell?.id === exp.id && editingCell.field === "title";

          return (
            <div className="flex items-center gap-3 min-w-[300px]">
              <img
                src={exp.image || "/placeholder.png"}
                className="w-12 h-12 rounded-lg object-cover border border-border shrink-0"
                alt=""
              />
              <div className="min-w-0 w-full">
                {isEditing ? (
                  <input
                    autoFocus
                    className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-sm"
                    value={title}
                    onChange={(event) => updateField(exp.id, "title", event.target.value)}
                    onBlur={() => setEditingCell(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === "Escape") {
                        setEditingCell(null);
                      }
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingCell({ id: exp.id, field: "title" })}
                    className="font-bold text-sm truncate text-left w-full hover:text-primary"
                    title="Click to edit"
                  >
                    {title || "Untitled Experience"}
                  </button>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "vendorName",
        header: "Vendor",
        cell: ({ row }) => {
          const exp = row.original;
          return (
            <div className="flex flex-col min-w-[150px]">
              <span className="text-sm font-bold">
                {exp.vendorName || "Unknown Vendor"}
              </span>
            </div>
          );
        },
      },
      {
        id: "vendorEmail",
        header: "Current Owner Email",
        cell: ({ row }) => {
          const email = buildVendorLoginEmail(row.original.vendorSlug || "");
          return (
            <span className="inline-block max-w-[230px] truncate text-xs font-mono text-muted-foreground bg-secondary/30 px-2 py-1 rounded-md">
              {email}
            </span>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const exp = row.original;
          const price = getMergedValue(exp, "price");
          const isEditing = editingCell?.id === exp.id && editingCell.field === "price";

          return isEditing ? (
            <input
              autoFocus
              type="number"
              className="w-24 bg-background border border-border rounded-lg px-2.5 py-1.5 text-sm"
              value={price ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                updateField(exp.id, "price", value === "" ? null : Number(value));
              }}
              onBlur={() => setEditingCell(null)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === "Escape") {
                  setEditingCell(null);
                }
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingCell({ id: exp.id, field: "price" })}
              className="text-sm font-bold hover:text-primary"
              title="Click to edit"
            >
              ${price ?? 0}
            </button>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const exp = row.original;
          return (
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" asChild title="View Details" className="h-9 w-9">
                <Link href={`/dashboard/hosts/experiences/${exp.id}`} target="_blank">
                  <ExternalLink size={16} />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReassignExperience(exp)}
                className="h-9 px-3 text-xs font-semibold"
              >
                Reassign
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(exp.id, exp.title)}
                disabled={isDeleting === exp.id}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 w-9"
              >
                {isDeleting === exp.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </Button>
            </div>
          );
        },
      },
    ],
    [editingCell, editedExperiences, isDeleting]
  );

  const table = useReactTable({
    data: experiences,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue ?? "").toLowerCase().trim();
      if (!q) return true;
      const v = row.original;
      const email = buildVendorLoginEmail(v.vendorSlug || "");
      return [v.title, v.vendorName, v.vendorSlug, email].join(" ").toLowerCase().includes(q);
    },
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  const pendingChangesCount = Object.keys(editedExperiences).length;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Admin: Experiences</h1>
          <p className="text-muted-foreground mt-1">
            Manage all curated experiences across the platform • {experiences.length} total
          </p>
        </div>
        <div className="flex flex-col gap-4 items-end">
          <AdminNav />
          {pendingChangesCount > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearPendingChanges} disabled={isSaving}>
                <X size={14} className="mr-1" /> Discard
              </Button>
              <Button size="sm" onClick={saveAllChanges} disabled={isSaving}>
                {isSaving ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Save size={14} className="mr-1" />} Save {pendingChangesCount}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search by experience title, vendor, or owner email..."
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm shadow-sm"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-muted-foreground animate-pulse">Loading experiences...</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-secondary/50 border-b border-border">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary/10 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-20 text-center text-muted-foreground">
                      No experiences found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-background/50">
            <div className="text-xs text-muted-foreground font-medium">
              Showing page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="rounded-lg"
              >
                <ChevronLeft size={14} className="mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="rounded-lg"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {reassignExperience ? (
        <ReassignExperienceDialog
          experience={reassignExperience}
          onClose={() => setReassignExperience(null)}
          onSuccess={async () => {
            setReassignExperience(null);
            await loadExperiences();
            toast.success("Experience ownership updated");
          }}
        />
      ) : null}
    </div>
  );
}
