import React from 'react';
import { notFound } from 'next/navigation';
import { getVendorById, getEventById } from '@/lib/firestore-service';
import HostEventVendorDetailClient from './HostEventVendorDetailClient';

interface PageProps {
    params: Promise<{ id: string; vendorId: string }>;
}

export default async function EventVendorDetailPage({ params }: PageProps) {
    const { id: eventId, vendorId } = await params;

    const vendor = await getVendorById(vendorId);
    const event = await getEventById(eventId);

    if (!vendor || !event) return notFound();

    return <HostEventVendorDetailClient vendor={vendor} event={event} />;
}
