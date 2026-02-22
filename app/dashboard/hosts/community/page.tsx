"use client";

import React, { useEffect, useState } from 'react';
import { Eye, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { getEvents } from '@/lib/firestore-service';
import { SharedEvent } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function seededCount(seed: string, min: number, range: number) {
  const sum = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return min + (sum % range);
}

const Inspiration: React.FC = () => {
  const [publicEvents, setPublicEvents] = useState<SharedEvent[]>([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const events = await getEvents();
        setPublicEvents(events.filter((event) => (event.publicGallery?.length ?? 0) > 0));
      } catch (error) {
        console.error("Failed to load community events:", error);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Community</h2>
        <p className="text-muted-foreground mt-1">Discover public events organized by other users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {publicEvents.map(item => (
          <Link href={`/dashboard/hosts/community/${item.id}`} key={item.id} className="block h-full min-w-0">
            <Card className="group flex h-full flex-col overflow-hidden border-border bg-card transition-shadow hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.eventName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
                <Badge className="absolute left-3 top-3 bg-accent text-foreground">
                  {item.themes?.[0] || "Event"}
                </Badge>
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-foreground/70 px-2 py-1 text-xs font-semibold text-background backdrop-blur-sm">
                  <Eye className="h-3 w-3 text-foreground" />
                  {seededCount(item.id, 140, 520)}
                </div>
                <button
                  className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  aria-label="Like event"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>

              <CardContent className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold uppercase tracking-wide text-foreground">
                    Community Event
                  </span>
                </div>

                <h3 className="font-serif text-base font-semibold leading-snug text-card-foreground line-clamp-2">
                  {item.eventName}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {item.description || "Shared by a Visual Africa host to inspire your next event."}
                </p>

                <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 shrink-0 text-foreground" />
                    <span>{seededCount(item.id + "likes", 60, 420)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 shrink-0 text-foreground" />
                    <span>{seededCount(item.id + "comments", 8, 120)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Inspiration;
