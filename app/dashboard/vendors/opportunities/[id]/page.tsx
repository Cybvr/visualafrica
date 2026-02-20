import React from 'react';
import { getEvents } from '@/lib/firestore-service';
import EventDetail from './EventDetail';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
    const { id } = await params;
    const events = await getEvents();
    const event = events.find(e => e.id === id);

    if (!event) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <h1 className="text-2xl font-bold text-foreground">Event not found</h1>
                <Link
                    href="/dashboard/vendors"
                    className="text-primary font-bold hover:underline"
                >
                    Back to Search
                </Link>
            </div>
        );
    }

    return <EventDetail event={event} />;
}
