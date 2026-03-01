"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Globe, Users, Mail, Plus, ExternalLink, Upload, Download } from 'lucide-react';
import { listenToEventById, updateEvent } from '@/lib/firestore-service';
import { SharedEvent } from '@/lib/types';

type GuestStatus = SharedEvent["guests"][number]["status"];
type GuestType = SharedEvent["guests"][number]["type"];

const normalizeStatus = (value: string): GuestStatus => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "confirmed" || normalized === "going" || normalized === "yes") return "Confirmed";
  if (normalized === "declined" || normalized === "no") return "Declined";
  return "Pending";
};

const normalizeType = (value: string): GuestType => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "vip") return "VIP";
  if (normalized === "plus one" || normalized === "plus-one" || normalized === "plusone") return "Plus One";
  return "Main Guest";
};

const parseCsvRow = (row: string): string[] => {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];
    const next = row[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
};

const getCsvHeaders = (line: string): string[] =>
  parseCsvRow(line).map((header) => header.trim().toLowerCase());

const toCsv = (rows: string[][]): string =>
  rows
    .map((columns) =>
      columns
        .map((value) => {
          const safe = (value ?? "").toString();
          return /[,"\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
        })
        .join(",")
    )
    .join("\n");

const GuestWebsite: React.FC = () => {
  const params = useParams();
  const eventId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [event, setEvent] = useState<SharedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    const unsubscribe = listenToEventById(eventId, (nextEvent) => {
      setEvent(nextEvent);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [eventId]);

  const guests = event?.guests ?? [];

  const statusCounts = useMemo(() => {
    return guests.reduce<Record<GuestStatus, number>>(
      (acc, guest) => {
        acc[guest.status] += 1;
        return acc;
      },
      { Confirmed: 0, Pending: 0, Declined: 0 }
    );
  }, [guests]);

  const upsertGuests = async (nextGuests: SharedEvent["guests"]) => {
    if (!event?.id) return;
    setSaving(true);
    setImportError(null);
    setImportSuccess(null);
    try {
      await updateEvent(event.id, {
        guests: nextGuests,
        guestCount: nextGuests.length,
      });
    } catch (error) {
      console.error("Failed to update guests:", error);
      setImportError("Could not update guest list. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCsvImport = async (file: File) => {
    if (!event) return;
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      setImportError("CSV is empty. Add at least one guest row.");
      return;
    }

    const headers = getCsvHeaders(lines[0]);
    const getHeaderIndex = (candidates: string[]) =>
      headers.findIndex((h) => candidates.includes(h));

    const nameIndex = getHeaderIndex(["name", "full name", "guest"]);
    const emailIndex = getHeaderIndex(["email", "email address"]);
    const statusIndex = getHeaderIndex(["status", "rsvp"]);
    const typeIndex = getHeaderIndex(["type", "guest type"]);

    if (nameIndex === -1 && emailIndex === -1) {
      setImportError("CSV must include at least a name or email column.");
      return;
    }

    const parsedGuests: SharedEvent["guests"] = [];

    lines.slice(1).forEach((line) => {
      const cols = parseCsvRow(line);
      const name = nameIndex >= 0 ? (cols[nameIndex] ?? "").trim() : "";
      const email = emailIndex >= 0 ? (cols[emailIndex] ?? "").trim() : "";
      if (!name && !email) return;

      const statusRaw = statusIndex >= 0 ? cols[statusIndex] ?? "" : "";
      const typeRaw = typeIndex >= 0 ? cols[typeIndex] ?? "" : "";

      parsedGuests.push({
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: name || email,
        email,
        status: normalizeStatus(statusRaw),
        type: normalizeType(typeRaw),
      });
    });

    if (parsedGuests.length === 0) {
      setImportError("No valid guest rows found in CSV.");
      return;
    }

    const mergedByKey = new Map<string, SharedEvent["guests"][number]>();
    guests.forEach((guest) => {
      const key = guest.email?.toLowerCase() || guest.id;
      mergedByKey.set(key, guest);
    });
    parsedGuests.forEach((guest) => {
      const key = guest.email?.toLowerCase() || guest.id;
      const existing = mergedByKey.get(key);
      mergedByKey.set(key, existing ? { ...existing, ...guest, id: existing.id } : guest);
    });

    const nextGuests = Array.from(mergedByKey.values());
    await upsertGuests(nextGuests);
    setImportSuccess(`Imported ${parsedGuests.length} guest${parsedGuests.length === 1 ? "" : "s"}.`);
  };

  const handleExportCsv = () => {
    if (!guests.length) return;
    const csv = toCsv([
      ["name", "email", "status", "type"],
      ...guests.map((guest) => [guest.name, guest.email, guest.status, guest.type]),
    ]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(event?.eventName || "event").replace(/\s+/g, "-").toLowerCase()}-guests.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto text-sm text-muted-foreground">Loading guest list...</div>;
  }

  if (!event) {
    return <div className="max-w-7xl mx-auto text-sm text-destructive">Event not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Guest Portal</h2>
        <button className="bg-background text-foreground px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 opacity-70 cursor-not-allowed" disabled>
          <Plus size={16} />
          Add Guest (Soon)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Registration List</h3>
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full" /> {statusCounts.Confirmed} Going</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-amber-500 rounded-full" /> {statusCounts.Pending} Pending</span>
              </div>
            </div>

            <div className="space-y-4">
              {guests.length === 0 ? (
                <div className="p-6 rounded-2xl border border-border text-sm text-muted-foreground">
                  No guests yet. Import a CSV to populate this list.
                </div>
              ) : guests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-4 bg-card rounded-2xl group hover:bg-card border border-transparent hover:border-border transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent text-accent font-bold flex items-center justify-center rounded-full">
                      {guest.name?.[0] || "G"}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{guest.name}</p>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">{guest.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${guest.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : guest.status === "Declined"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                      {guest.status}
                    </span>
                    <button className="p-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><Mail size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
            {importError && <p className="mt-4 text-sm text-destructive">{importError}</p>}
            {importSuccess && <p className="mt-4 text-sm text-green-600">{importSuccess}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background text-foreground rounded-3xl p-8 space-y-6 shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between">
              <Globe className="text-primary" size={32} />
              <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded border border-green-500/30">Live</div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">RSVP Website</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Your custom guest portal is live at:<br />
                <a href={`/e/${event.id}`} target="_blank" className="text-foreground font-medium hover:underline">
                  {typeof window !== 'undefined' ? `${window.location.host}/e/${event.id}` : `/e/${event.id}`}
                </a>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-card text-foreground py-3 rounded-xl font-bold text-sm hover:bg-card">Edit Site</button>
              <button className="p-3 bg-background rounded-xl hover:bg-slate-700"><ExternalLink size={20} /></button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
            <h3 className="font-bold text-foreground text-lg">Quick Actions</h3>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleCsvImport(file);
                  e.currentTarget.value = "";
                }}
              />
              <button
                className="w-full flex items-center gap-4 p-4 hover:bg-card rounded-2xl transition-all border border-slate-50 group"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
              >
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><Upload size={20} /></div>
                <div className="text-left">
                  <p className="font-bold text-sm">{saving ? "Importing..." : "Import Guest CSV"}</p>
                  <p className="text-xs text-muted-foreground">name,email,status,type</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-4 hover:bg-card rounded-2xl transition-all border border-slate-50 group">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:textforeground transition-all"><Mail size={20} /></div>
                <div className="text-left">
                  <p className="font-bold text-sm">Send Email Invite</p>
                  <p className="text-xs text-muted-foreground">Remind pending guests</p>
                </div>
              </button>
              <button
                className="w-full flex items-center gap-4 p-4 hover:bg-card rounded-2xl transition-all border border-slate-50 group"
                onClick={handleExportCsv}
                disabled={!guests.length}
              >
                <div className="w-10 h-10 bg-accent text-accent rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-foreground transition-all"><Download size={20} /></div>
                <div className="text-left">
                  <p className="font-bold text-sm">Export List</p>
                  <p className="text-xs text-muted-foreground">Download CSV/PDF</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestWebsite;
