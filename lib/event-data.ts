
import { SHARED_EVENTS } from './shared-data';

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
  categories: string[];
  themes: string[];
  itinerary?: string;
}

export const MOCK_EVENTS: EventData[] = SHARED_EVENTS.map(event => ({
  id: event.id,
  name: event.eventName,
  location: event.location,
  startDate: event.date,
  endDate: event.date,
  status: event.status === 'Confirmed' ? 'Active' : (event.status === 'Completed' ? 'Completed' : 'Planning'),
  guestCount: event.guestCount,
  budgetTotal: event.budget,
  budgetSpent: event.budget * 0.8,
  description: event.description,
  theme: 'Modern',
  showCommunityInspiration: true,
  thumbnail: event.image,
  categories: event.categories,
  themes: event.themes,
  itinerary: event.itinerary,
}));

export const eventData: EventData = MOCK_EVENTS[0];

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
