
export interface EventData {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'Planning' | 'Active' | 'Completed';
  guestCount: number;
  budgetTotal: number;
  budgetSpent: number;
  description: string;
  theme: string;
  showCommunityInspiration: boolean;
  thumbnail: string;
  publicGallery?: string[];
  metrics?: { label: string; value: string }[];
}

export const eventData: EventData = {
  id: 'event-123',
  name: 'Q2 Team Strategy Retreat',
  location: 'Lagos, Nigeria',
  startDate: '2025-05-29',
  endDate: '2025-06-03',
  status: 'Planning',
  guestCount: 60,
  budgetTotal: 8000000,
  budgetSpent: 6800000,
  description: 'Our annual mid-year strategy session focused on expanding our footprint across West Africa.',
  theme: 'Modern Industrial',
  showCommunityInspiration: true,
  thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
};

export const MOCK_EVENTS: EventData[] = [
  eventData,
  {
    id: 'event-124',
    name: 'Adeleke Wedding',
    location: 'Epe Resort, Lagos',
    startDate: '2025-08-15',
    endDate: '2025-08-17',
    status: 'Planning',
    guestCount: 450,
    budgetTotal: 25000000,
    budgetSpent: 12000000,
    description: 'A grand celebration of love in the heart of Epe.',
    theme: 'Tropical Luxury',
    showCommunityInspiration: true,
    thumbnail: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    publicGallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    ],
    metrics: [
      { label: 'Guest Satisfaction', value: '4.9/5' },
      { label: 'Photos Shared', value: '2.5k+' },
      { label: 'Vendor Rating', value: '98%' },
    ],
  },
  {
    id: 'event-125',
    name: 'Tech Lagos 2025',
    location: 'Landmark Centre',
    startDate: '2025-11-10',
    endDate: '2025-11-12',
    status: 'Active',
    guestCount: 1200,
    budgetTotal: 45000000,
    budgetSpent: 40000000,
    description: 'The biggest tech conference in West Africa.',
    theme: 'Neon Future',
    showCommunityInspiration: false,
    thumbnail: 'https://images.unsplash.com/photo-1540575861501-7c00117fc24b?auto=format&fit=crop&q=80&w=800',
  }
];

// Formatting helpers
export const formatEventDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${s.toLocaleDateString('en-US', options)} – ${e.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
};
