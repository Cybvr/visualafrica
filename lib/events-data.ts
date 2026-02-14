import { SHARED_EVENTS } from './shared-data';

export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    guestCount: number;
    status: 'Planning' | 'Confirmed' | 'Completed';
    image: string;
    budget: number;
    description: string;
    bookedVendors: {
        vendorId: string;
        service: string;
        amount: string;
        status: 'Pending' | 'Confirmed' | 'Paid';
    }[];
    publicGallery?: string[];
    metrics?: { label: string; value: string }[];
}

export const EVENTS: Event[] = SHARED_EVENTS.map(event => ({
    id: event.id,
    name: event.eventName,
    date: event.date,
    location: event.location,
    guestCount: event.guestCount,
    status: event.status,
    image: event.image,
    budget: event.budget,
    description: event.description,
    bookedVendors: event.bookedVendors,
}));
