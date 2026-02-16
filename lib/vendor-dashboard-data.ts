import { vendors, Vendor } from './vendors-data';
import { SHARED_EVENTS } from './shared-data';

export interface Lead {
    id: string;
    name: string;
    event: string;
    date: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
    detail: string;
    avatar?: string;
}

export interface Booking {
    id: string;
    event: string;
    date: string;
    location: string;
    client: string;
    amount: string;
    status: 'Upcoming' | 'Confirmed' | 'Pending Payment' | 'Completed' | 'Unresolved' | 'Paid';
}

export interface CalendarEvent {
    title: string;
    type: string;
}

export interface PortfolioItem {
    id: string;
    title: string;
    type: 'Video' | 'Gallery';
    date: string;
    image: string;
}

export interface ChatMessage {
    id: string;
    senderName: string;
    text: string;
    time: string;
    isMe: boolean;
}

export interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: boolean;
    online: boolean;
    messages: ChatMessage[];
}

const CURRENT_VENDOR_ID = "v1";

// Derive leads from shared events
const derivedLeads: Lead[] = SHARED_EVENTS.flatMap(event =>
    event.leads
        .filter(l => l.vendorId === CURRENT_VENDOR_ID)
        .map((l, i) => ({
            id: `l-${event.id}-${i}`,
            name: event.hostName,
            event: event.eventName,
            date: event.date,
            status: l.status,
            detail: l.message
        }))
);

// Derive bookings from shared events
const derivedBookings: Booking[] = SHARED_EVENTS.flatMap(event =>
    event.bookedVendors
        .filter(bv => bv.vendorId === CURRENT_VENDOR_ID)
        .map((bv, i) => ({
            id: `b-${event.id}-${i}`,
            event: event.eventName,
            date: event.date,
            location: event.location,
            client: event.hostName,
            amount: bv.amount,
            status: bv.status as Booking['status']
        }))
);

export function getCurrentVendor(): Vendor | undefined {
    return vendors.find(v => v.id === CURRENT_VENDOR_ID);
}

// Global Vendor Dashboard Data
export const VENDOR_DASHBOARD_DATA = {
    currentVendorId: CURRENT_VENDOR_ID,
    leads: derivedLeads,
    bookings: derivedBookings,
    portfolioItems: getCurrentVendor()?.portfolio || [] as PortfolioItem[],

    chats: [
        {
            id: "c1",
            name: "Folake Ademola",
            lastMessage: "Can we schedule a call for tomorrow?",
            time: "2m ago",
            unread: true,
            online: true,
            messages: [
                { id: "m1", senderName: "Folake Ademola", text: "Hi there! I'm interested in your wedding photography package. Do you have availability for Oct 12th?", time: "10:45 AM", isMe: false },
                { id: "m2", senderName: "Me", text: "Hello Folake! Yes, I'm currently free on that date. I'd love to chat more about your vision for the day.", time: "10:48 AM", isMe: true }
            ]
        },
        { id: "c2", name: "Akin Fadeyi", lastMessage: "The contract looks good, thanks!", time: "1h ago", unread: false, online: false, messages: [] },
        { id: "c3", name: "Modupe Alabi", lastMessage: "I've sent the payment receipt.", time: "4h ago", unread: false, online: true, messages: [] },
    ] as Chat[],

    stats: {
        monthlyRevenue: "$15,250",
        growth: 12,
        activeBookings: derivedBookings.length,
        avgRating: 4.9
    }
};
