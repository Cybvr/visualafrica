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
}

export const EVENTS: Event[] = [
    {
        id: '1',
        name: 'Mike & Whitney Wedding',
        date: 'Dec 12, 2025',
        location: 'Lekki Phase 1, Lagos',
        guestCount: 250,
        status: 'Planning',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
        budget: 15000000,
        description: 'A luxurious outdoor wedding with a modern African theme.'
    },
    {
        id: '2',
        name: 'John & Alice Anniversary',
        date: 'Mar 15, 2026',
        location: 'Victoria Island, Lagos',
        guestCount: 100,
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
        budget: 5000000,
        description: 'Intimate golden jubilee anniversary celebration.'
    },
    {
        id: '3',
        name: 'Tech Corp Gala',
        date: 'Nov 20, 2025',
        location: 'Eko Hotels & Suites',
        guestCount: 500,
        status: 'Planning',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
        budget: 25000000,
        description: 'Annual end-of-year gala for Tech Corp employees and partners.'
    }
];
