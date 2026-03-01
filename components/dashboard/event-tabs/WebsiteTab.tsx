"use client";

import React, { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { SharedEvent } from "@/lib/types";
import { WEBSITE_TEMPLATES } from "@/lib/website-templates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WebsiteTabProps {
  event: SharedEvent;
}

const WebsiteTab: React.FC<WebsiteTabProps> = ({ event }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(WEBSITE_TEMPLATES[0].id);

  const eventSlug = useMemo(
    () => event.eventName.toLowerCase().replace(/\s+/g, "-"),
    [event.eventName]
  );
  const siteUrl = `Waddi.events/${eventSlug}`;

  const selectedTemplate =
    WEBSITE_TEMPLATES.find((template) => template.id === selectedTemplateId) ??
    WEBSITE_TEMPLATES[0];

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">Website Preview</h3>
      </div>

      <div className="rounded-lg overflow-y-auto max-h-[70vh]">
        {selectedTemplate.id === "classic" && (
          <div className="p-4 bg-white text-slate-900 space-y-4">
            <div className="h-40 rounded-md overflow-hidden">
              <img src={event.image || "/placeholder.png"} alt={event.eventName} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">You're Invited</p>
              <h4 className="text-xl font-semibold">{event.eventName}</h4>
              <p className="text-sm text-slate-600">{event.date} · {event.location}</p>
            </div>
            <p className="text-sm text-slate-700">{event.description}</p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded border border-slate-200 p-2">
                <p className="text-xs text-slate-500">Guests</p>
                <p className="font-medium">{event.guestCount}</p>
              </div>
              <div className="rounded border border-slate-200 p-2">
                <p className="text-xs text-slate-500">Budget</p>
                <p className="font-medium">₦{(event.budget || 0).toLocaleString("en-NG")}</p>
              </div>
            </div>

            <div className="rounded border border-slate-200 p-3 space-y-2">
              <p className="text-sm font-semibold">Event Highlights</p>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Theme: {event.themes?.[0] || "Celebration Experience"}</li>
                <li>• Host: {event.hostName || "Waddi Host"}</li>
                <li>• Vendors booked: {event.bookedVendors?.length || 0}</li>
              </ul>
            </div>

            <div className="rounded border border-slate-200 p-3 space-y-2">
              <p className="text-sm font-semibold">Schedule Snapshot</p>
              <div className="text-sm text-slate-700 space-y-1">
                <p>3:00 PM · Guest arrival</p>
                <p>4:30 PM · Main program</p>
                <p>7:00 PM · Reception</p>
              </div>
            </div>

            <button className="w-full h-9 rounded-md bg-slate-900 text-white text-sm font-medium">
              RSVP Now
            </button>
          </div>
        )}

        {selectedTemplate.id === "minimal" && (
          <div className="p-4 bg-slate-50 text-slate-900">
            <h4 className="text-lg font-semibold mb-1">{event.eventName}</h4>
            <p className="text-xs text-slate-600 mb-4">{event.date}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded border border-slate-200 p-2">
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
              <div className="rounded border border-slate-200 p-2">
                <p className="text-xs text-slate-500">Guests</p>
                <p className="font-medium">{event.guestCount}</p>
              </div>
              <div className="rounded border border-slate-200 p-2 col-span-2">
                <p className="text-xs text-slate-500">Theme</p>
                <p className="font-medium">{event.themes?.[0] || "Event Experience"}</p>
              </div>
            </div>
          </div>
        )}

        {selectedTemplate.id === "vibrant" && (
          <div className="p-4 bg-gradient-to-br from-amber-100 via-rose-100 to-indigo-100 text-slate-900 space-y-3">
            <div className="inline-flex text-[10px] px-2 py-1 rounded-full bg-white/80 border border-white">
              {event.status}
            </div>
            <h4 className="text-xl font-black leading-tight">{event.eventName}</h4>
            <p className="text-sm">{event.location}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-white/70 border border-white">{event.date}</span>
              <span className="px-2 py-1 rounded bg-white/70 border border-white">{event.guestCount} Guests</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteTab;
