// ── Vendor Types ──────────────────────────────────────────

export type EventTheme =
    | "All Themes"
    | "Kids Birthday"
    | "Wedding"
    | "Social Gathering"
    | "Corporate Event"
    | "Proposals"
    | "Anniversary"
    | "Bachelor"
    | "Bachelorette"
    | "Bridal";

export type VendorCategory =
    | "All Categories"
    | "Bar Tenders"
    | "Cakes & Sweets"
    | "Catering"
    | "Decorations"
    | "Entertainment"
    | "Event Planners"
    | "Gifts & Invites"
    | "Limousines"
    | "Makeup Artists"
    | "Party Equipment"
    | "Party Wear"
    | "Photographers"
    | "Photo Booths"
    | "Venues"
    | "Yachts"
    | "Experiences";

export type UserRole = 'admin' | 'host' | 'vendor';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface VendorImage {
    url: string;
    alt: string;
}

export interface PortfolioItem {
    id: string;
    title: string;
    type: 'Video' | 'Gallery';
    date: string;
    image: string;
}

export interface Vendor {
    id: string;
    slug: string;
    ownerId: string; // UID of the managing vendor user
    name: string;
    location: string;
    price: string | null;
    rating: number;
    image: string;
    categories: VendorCategory[];
    featured: boolean;
    eventThemes: EventTheme[];
    description: string;
    shortDescription: string;
    gallery: VendorImage[];
    whatsIncluded: string[];
    services: string[];
    isNew?: boolean;
    isSponsored?: boolean;
    portfolio?: PortfolioItem[];
    about?: string;
    stats: {
        eventsPlanned: string;
        satisfiedClients: string;
        corporateEvents: string;
        yearsExperience: string;
        uniqueLocations: string;
    };
    phone: string;
    areaServed: string[];
    yearEstablished: number;
    responseTime: string;
    vendor: {
        name: string;
        logo: string;
        avatar?: string;
        role?: string;
        since?: string;
        slug?: string;
    };
}

// ── Event Types ───────────────────────────────────────────

export interface SharedEvent {
    id: string;
    hostId: string; // UID of the host (creator)
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
    todoList?: string[];
    itineraryItems?: TimelineEntry[];
}

export interface TimelineEntry {
    time: string;
    label: string;
    note?: string;
}

// ── Blog Types ────────────────────────────────────────────

export interface BlogPost {
    id: string;
    title: string;
    category: string;
    date: string;
    image: string;
    author: string;
    excerpt: string;
    content: string;
}

// ── Dashboard Types ───────────────────────────────────────

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

export interface PaymentHistory {
    id: string;
    bookingId: string;
    eventName: string;
    client: string;
    amount: string;
    date: string;
    status: 'completed' | 'pending' | 'processing';
    method: string;
}

export interface PaymentMethod {
    id: string;
    type: 'bank' | 'card';
    bankName?: string;
    cardLast4?: string;
    accountNumber?: string;
    isDefault: boolean;
}

// ── Pricing Types ─────────────────────────────────────────

export interface PricingFeature {
    title: string;
    description: string;
}

export interface OfferingFeature {
    title: string;
    description: string;
}

export interface OfferingFaq {
    question: string;
    answer: string;
}

export interface Offering {
    slug: string;
    title: string;
    tagline: string;
    description: string;
    image: string;
    features: OfferingFeature[];
    whyChooseUs: string[];
    process: { step: string; detail: string }[];
    faq: OfferingFaq[];
}

export interface PlatformFeature {
    title: string;
    description: string;
    slug: string;
    href: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    features: {
        title: string;
        description: string;
        icon: string; // Store icon name as string for Firestore
    }[];
    benefits: string[];
    ctaText: string;
}

export interface FAQ {
    id: number;
    category: string;
    question: string;
    answer: string;
}

export interface FAQCategory {
    id: string;
    label: string;
}

export interface PricingTier {
    name: string;
    tagline: string;
    price: string;
    priceNote: string | null;
    cta: string;
    ctaHref: string;
    highlighted: boolean;
    inheritsFrom: string | null;
    features: PricingFeature[];
}
