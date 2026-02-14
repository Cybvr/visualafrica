"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SHARED_EVENTS } from '@/lib/shared-data';
import EventDetail from './EventDetail';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const event = SHARED_EVENTS.find(e => e.id === id);

    if (!event) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <h1 className="text-2xl font-bold">Event not found</h1>
                <button
                    onClick={() => router.push('/dashboard/vendors/events')}
                    className="text-orange-600 font-bold"
                >
                    Back to Events
                </button>
            </div>
        );
    }

    return <EventDetail event={event} onBack={() => router.push('/dashboard/vendors/events')} />;
}
