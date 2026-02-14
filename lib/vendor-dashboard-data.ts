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
    status: 'Upcoming' | 'Confirmed' | 'Pending Payment' | 'Completed';
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
            status: event.status === 'Confirmed' ? 'Confirmed' : (event.status === 'Completed' ? 'Completed' : 'Upcoming')
        }))
);

// Global Vendor Dashboard Data
export const VENDOR_DASHBOARD_DATA = {
    currentVendorId: CURRENT_VENDOR_ID,
    leads: derivedLeads,
    bookings: derivedBookings,

    calendarEvents: {
        14: { title: "Wedding - Johnson", type: "Wedding" },
        22: { title: "Corporate Party", type: "Corporate" },
    } as Record<number, CalendarEvent>,

    portfolioItems: [
        { id: "p1", title: "Wedding Ceremony Highlights", type: "Video", date: "Jan 2026", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
        { id: "p2", title: "Garden Reception Decor", type: "Gallery", date: "Dec 2025", image: "https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&q=80&w=800" },
        { id: "p3", title: "Corporate Awards Night", type: "Video", date: "Nov 2025", image: "https://images.unsplash.com/photo-1540575861501-7c00117fc24b?auto=format&fit=crop&q=80&w=800" },
        { id: "p4", title: "Birthday Bash", type: "Gallery", date: "Oct 2025", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" },
    ] as PortfolioItem[],

    chats: [
        {
            id: "c1",
            name: "Sarah Williams",
            lastMessage: "Can we schedule a call for tomorrow?",
            time: "2m ago",
            unread: true,
            online: true,
            messages: [
                { id: "m1", senderName: "Sarah Williams", text: "Hi there! I'm interested in your wedding photography package. Do you have availability for Oct 12th?", time: "10:45 AM", isMe: false },
                { id: "m2", senderName: "Me", text: "Hello Sarah! Yes, I'm currently free on that date. I'd love to chat more about your vision for the day.", time: "10:48 AM", isMe: true }
            ]
        },
        { id: "c2", name: "Akin Fadey", lastMessage: "The contract looks good, thanks!", time: "1h ago", unread: false, online: false, messages: [] },
        { id: "c3", name: "Modupe Alabi", lastMessage: "I've sent the payment receipt.", time: "4h ago", unread: false, online: true, messages: [] },
    ] as Chat[],

    stats: {
        monthlyRevenue: "₦2,400,000",
        growth: 12,
        activeBookings: derivedBookings.length,
        avgRating: 4.9
    }
};

export function getCurrentVendor(): Vendor | undefined {
    return vendors.find(v => v.id === VENDOR_DASHBOARD_DATA.currentVendorId);
}
