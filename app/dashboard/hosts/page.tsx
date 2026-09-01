"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Inbox, Plus } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { listenToEvents, listenToUserChats } from "@/lib/firestore-service";
import type { SharedEvent } from "@/lib/types";

type NextAction = {
  label: string;
  href: string;
};

function formatDate(value?: string) {
  if (!value) return "Date not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function relativeDate(value?: string) {
  if (!value) return "Set a date to keep the plan moving";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "Date needs review";
  const days = Math.ceil((time - Date.now()) / 86400000);
  if (days < 0) return "Past date — review this event";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days away`;
}

function nextAction(event: SharedEvent): NextAction {
  const base = `/dashboard/hosts/events/${event.id}`;
  const vendors = event.bookedVendors ?? [];
  const guests = event.guests ?? [];

  if (vendors.length === 0) {
    return { label: "Build your vendor shortlist", href: `${base}/plan` };
  }

  if (vendors.some((vendor) => ["Pending", "Unresolved", "Pending Payment"].includes(vendor.status))) {
    return { label: "Resolve vendor bookings", href: `${base}/plan` };
  }

  if (event.guestCount > guests.length) {
    return { label: "Add your guest list", href: `${base}/guests` };
  }

  if (!event.itinerary && !(event.itineraryItems?.length ?? 0)) {
    return { label: "Build the itinerary", href: `${base}/itinerary` };
  }

  return { label: "Review the event plan", href: base };
}

export default function HostHomePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SharedEvent[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const stopEvents = listenToEvents(user.uid, (nextEvents) => {
      setEvents(nextEvents);
      setLoading(false);
    });
    const stopChats = listenToUserChats(user.uid, setChats);

    return () => {
      stopEvents();
      stopChats();
    };
  }, [user]);

  const activeEvents = useMemo(
    () =>
      events
        .filter((event) => event.status !== "Completed")
        .sort((a, b) => {
          const aTime = new Date(a.date || "9999-12-31").getTime();
          const bTime = new Date(b.date || "9999-12-31").getTime();
          return aTime - bTime;
        }),
    [events]
  );

  const recentChats = chats.slice(0, 4);

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              What needs your attention?
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              Pick up the next step on an event, or start a new plan when you are ready.
            </p>
          </div>
          <Link
            href="/dashboard/hosts/chat/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus size={17} />
            Start a new plan
          </Link>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section aria-labelledby="active-events" className="pt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 id="active-events" className="text-xl font-semibold text-foreground">
                Active events
              </h2>
              <Link href="/dashboard/hosts/events" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <p className="py-10 text-sm text-muted-foreground">Loading your events…</p>
            ) : activeEvents.length === 0 ? (
              <div className="mt-5 border-y border-border py-10">
                <h3 className="text-lg font-semibold text-foreground">Nothing is in motion yet.</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Start with the event or trip you need to move forward today. Waddi will turn the brief into a working plan.
                </p>
                <Link
                  href="/dashboard/hosts/chat/new"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Create your first plan <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="mt-5 border-t border-border">
                {activeEvents.slice(0, 5).map((event) => {
                  const action = nextAction(event);
                  return (
                    <div key={event.id} className="border-b border-border py-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <Link href={`/dashboard/hosts/events/${event.id}`} className="text-lg font-semibold text-foreground hover:text-primary">
                            {event.eventName || "Untitled event"}
                          </Link>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} />{formatDate(event.date)}</span>
                            <span>{event.location || "Location not set"}</span>
                            <span>{relativeDate(event.date)}</span>
                          </div>
                        </div>
                        <Link
                          href={action.href}
                          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline"
                        >
                          {action.label}
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        {event.status === "Confirmed" ? <CheckCircle2 size={14} className="text-primary" /> : <span className="h-2 w-2 rounded-full bg-accent" />}
                        {event.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside aria-labelledby="continue-plan" className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-8">
            <div className="flex items-center justify-between gap-4">
              <h2 id="continue-plan" className="text-xl font-semibold text-foreground">Continue a plan</h2>
              <Inbox size={18} className="text-muted-foreground" />
            </div>
            {recentChats.length === 0 ? (
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Your saved planning conversations will appear here.</p>
            ) : (
              <div className="mt-4 divide-y divide-border">
                {recentChats.map((chat) => (
                  <Link key={chat.id} href={`/dashboard/hosts/chat/${chat.id}`} className="block py-4 first:pt-0 hover:text-primary">
                    <p className="line-clamp-2 text-sm font-semibold text-foreground">{chat.title || "Untitled plan"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Open the conversation</p>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
