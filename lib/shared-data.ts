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
        status: 'Pending' | 'Confirmed' | 'Paid' | 'Pending Payment' | 'Unresolved';
    }[];
    leads: {
        vendorId: string;
        status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
        message: string;
    }[];
    categories: string[];
    themes: string[];
    itinerary?: string;
    publicGallery?: string[];
    metrics?: { label: string; value: string }[];
    guests: {
        id: string;
        name: string;
        email: string;
        status: 'Confirmed' | 'Pending' | 'Declined';
        type: 'Main Guest' | 'Plus One' | 'VIP';
    }[];
}

export const SHARED_EVENTS: SharedEvent[] = [
    {
        id: '1',
        hostName: 'Organizer Name', // Added hostName
        eventName: 'Tech Conference 2025',
        date: '2025-05-28',
        location: 'Lagos, Nigeria',
        guestCount: 500,
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b175a?auto=format&fit=crop&q=80',
        budget: 5000000,
        description: 'A large-scale technology conference focusing on AI and Fintech in Africa.',
        bookedVendors: [
            { vendorId: 'v-venue-1', service: 'Venues', amount: 'NGN 2,500,000', status: 'Paid' },
            { vendorId: 'v-catering-1', service: 'Catering', amount: 'NGN 1,200,000', status: 'Pending' }
        ],
        leads: [], // Added leads
        categories: ['Corporate', 'Technology', 'Network'],
        themes: ['Modern Tech', 'Green Future'],
        itinerary: '10:00 AM - Registration\n11:00 AM - Opening Keynote\n01:00 PM - Lunch Break\n02:00 PM - Panel Discussions',
        guests: [
            { id: 'g1', name: 'Abigail Okafor', email: 'abigail@tech.com', status: 'Confirmed', type: 'VIP' },
            { id: 'g2', name: 'Bode Thomas', email: 'bode@innovate.ng', status: 'Pending', type: 'Main Guest' },
            { id: 'g3', name: 'Chiamaka Adeleke', email: 'chiamaka@design.io', status: 'Confirmed', type: 'Main Guest' },
            { id: 'g4', name: 'David Wright', email: 'david@global.com', status: 'Pending', type: 'Main Guest' },
            { id: 'g5', name: 'Emily Chen', email: 'emily@techconf.org', status: 'Confirmed', type: 'VIP' },
            { id: 'g6', name: 'Femi Balogun', email: 'femi@fintech.ng', status: 'Declined', type: 'Main Guest' }
        ]
    },
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
        leads: [],
        categories: ['Wedding', 'Outdoor'],
        themes: ['Nigerian Royalty', 'Modern Luxury'],
        guests: []
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
        ],
        categories: ['Workshop', 'Corporate'],
        themes: ['Hands-on Learning', 'Professional Networking'],
        guests: []
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
        leads: [],
        categories: ['Wedding', 'Traditional'],
        themes: ['Grand Celebration', 'Classic Elegance'],
        publicGallery: [
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'
        ],
        metrics: [
            { label: 'Guest Satisfaction', value: '4.9/5' },
            { label: 'Vendors Coordinated', value: '12' }
        ],
        guests: []
    }
];
