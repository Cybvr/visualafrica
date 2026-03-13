import { Vendor, SharedEvent } from "./types";

export const CITIES = [
    { name: "Lagos", flag: "🇳🇬", vibe: "Afrobeats · Aso-oke · Suya" },
    { name: "Accra", flag: "🇬🇭", vibe: "Highlife · Kente · Jollof" },
    { name: "Nairobi", flag: "🇰🇪", vibe: "Amapiano · Maasai · Nyama choma" },
    { name: "Cape Town", flag: "🇿🇦", vibe: "Amapiano · Ubuntu · Braai" },
];

export const CITY_COLORS: Record<string, string> = {
    Lagos: "hsl(var(--primary))",
    Accra: "#E8A020",
    Nairobi: "#A78BFA",
    "Cape Town": "#F472B6",
};

export const DEMO_CHAT_HISTORY: any[] = [];

export function buildVendorsList(vendors: Vendor[], city: string) {
    return vendors
        .filter(v => v.location.toLowerCase().includes(city.toLowerCase()))
        .map(v => ({
            id: v.id || "",
            name: v.name || "",
            slug: v.slug || v.id || "",
            image: v.image || "/placeholder.png",
            type: v.categories?.[0] || "",
            categories: v.categories || [],
            tags: v.services?.slice(0, 4) || [],
            price: v.price ?? null,
            rating: v.rating ?? null,
            status: "Available",
            statusColor: "hsl(var(--primary))",
            location: v.location || "Lagos",
        }));
}

export const INITIAL_MESSAGES: any[] = [
    {
        id: 1,
        role: "agent",
        type: "text",
        content: "Hi! I'm Waddi, your AI event assistant. I can help you plan, find vendors, and manage your event. What are we working on today?",
        suggestions: [
            { label: "Plan", action: "start_planning" },
            { label: "Discover Vendors", action: "start_vendor_search" },
            { label: "Experiences", action: "start_experiences" }
        ],
        time: new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })
    }
];


export const MARKET_DATA: Record<string, any> = {
};

export function getChatMessages(chatId: string, allVendorsByCity: Record<string, any[]>, liveEvents: SharedEvent[]) {
    return [];
}
