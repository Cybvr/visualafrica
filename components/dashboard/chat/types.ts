export type Role = "agent" | "user";

export interface Message {
    id: number;
    role: Role;
    timestamp: string;
    content: React.ReactNode;
}

export interface VendorOption {
    name: string;
    genre: string;
    price: string;
    rating: string;
    count: number;
    stars: number;
}

export interface TimelineEntry {
    time: string;
    label: string;
    note?: string;
}
