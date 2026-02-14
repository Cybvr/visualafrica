import { Vendor } from './vendors-data';

export interface SharedEvent {
    id: string;
    hostName: string;
    eventName: string;
    date: string;
    location: string;
    guestCount: number;
    budget: number;
    status: 'Planning' | 'Confirmed' | 'Completed';
    image: string;
    description: string;
    bookedVendors: {
        vendorId: string;
        service: string;
        amount: string;
        status: 'Pending' | 'Confirmed' | 'Paid';
    }[];
    leads: {
        vendorId: string;
        status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
        message: string;
    }[];
}

export const SHARED_EVENTS: SharedEvent[] = [
    {
        id: 'ev-001',
        hostName: 'Chidi & Amaka',
        eventName: 'Chidi & Amaka Wedding',
        date: 'Dec 12, 2025',
        location: 'Lekki Phase 1, Lagos',
        guestCount: 250,
        budget: 15000000,
        status: 'Planning',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
        description: 'A luxurious outdoor wedding with a modern Nigerian royalty theme.',
        bookedVendors: [
            { vendorId: 'v1', service: 'Event Planning', amount: '₦1,500,000', status: 'Confirmed' },
            { vendorId: 'v-catering-1', service: 'Catering', amount: '₦3,750,000', status: 'Pending' }
        ],
        leads: []
    },
    {
        id: 'ev-002',
        hostName: 'Folake Ademola',
        eventName: 'Ademola Photography Workshop',
        date: 'Oct 12, 2026',
        location: 'Victoria Island, Lagos',
        guestCount: 50,
        budget: 2000000,
        status: 'Planning',
        image: 'https://images.unsplash.com/photo-1540575861501-7c00117fc24b?auto=format&fit=crop&q=80&w=800',
        description: 'A hands-on workshop for aspiring photographers in Lagos.',
        bookedVendors: [],
        leads: [
            { vendorId: 'v1', status: 'New', message: 'Looking for a full-day wedding coverage in Lekki.' }
        ]
    },
    {
        id: 'ev-003',
        hostName: 'Aisha Bello',
        eventName: 'Bello & Ibrahim Wedding',
        date: 'June 15, 2026',
        location: 'Civic Centre, VI',
        guestCount: 400,
        budget: 20000000,
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
        description: 'Traditional and white wedding celebration of the Bello family.',
        bookedVendors: [
            { vendorId: 'v1', service: 'Full Coordination', amount: '₦2,500,000', status: 'Confirmed' }
        ],
        leads: []
    }
];
