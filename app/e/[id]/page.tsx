import { adminDb } from "@/lib/firebase-admin";
import { notFound } from "next/navigation";
import { SharedEvent } from "@/lib/types";
import PublicEventClient from "./PublicEventClient";

interface PublicEventPageProps {
    params: Promise<{ id: string }>;
}

// Helper to serialize Firestore data for RSC to Client boundary
function serializeData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    // Handle Firestore Timestamps
    if (typeof data.toDate === 'function') {
        return data.toDate().toISOString();
    }

    if (Array.isArray(data)) {
        return data.map(serializeData);
    }

    const plain: any = {};
    for (const [key, value] of Object.entries(data)) {
        plain[key] = serializeData(value);
    }
    return plain;
}

export default async function PublicEventPage({ params }: PublicEventPageProps) {
    const { id } = await params;

    // Fetch event from Firestore using Admin SDK (for SSR)
    const docRef = adminDb.collection("events").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        notFound();
    }

    const eventData = docSnap.data();
    const isOpenPublicBrief = eventData?.isPublicBrief === true && (eventData?.publicBriefStatus || "closed") === "open";
    const isPublished = eventData?.published === true;

    if (!isOpenPublicBrief && !isPublished) {
        notFound();
    }

    const event = serializeData({ id: docSnap.id, ...eventData }) as SharedEvent;

    return <PublicEventClient event={event} />;
}
