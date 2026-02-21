import { EventTheme, VendorCategory } from "./types"

export const EVENT_THEMES: EventTheme[] = [
    "All Themes",
    "Kids Birthday",
    "Wedding",
    "Social Gathering",
    "Corporate Event",
    "Proposals",
    "Anniversary",
    "Bachelor",
    "Bachelorette",
    "Bridal",
]

export const VENDOR_CATEGORIES: VendorCategory[] = [
    "All Categories",
    "Bar Tenders",
    "Cakes & Sweets",
    "Catering",
    "Decorations",
    "Entertainment",
    "Event Planners",
    "Gifts & Invites",
    "Limousines",
    "Makeup Artists",
    "Party Equipment",
    "Party Wear",
    "Photographers",
    "Photo Booths",
    "Venues",
    "Yachts",
    "Experiences",
]

export const CATEGORY_SLUG_MAP: Record<string, VendorCategory> = {
    bartenders: "Bar Tenders",
    cakes: "Cakes & Sweets",
    catering: "Catering",
    decorations: "Decorations",
    entertainment: "Entertainment",
    planners: "Event Planners",
    gifts: "Gifts & Invites",
    limousines: "Limousines",
    makeup: "Makeup Artists",
    equipment: "Party Equipment",
    partywear: "Party Wear",
    photographers: "Photographers",
    photobooths: "Photo Booths",
    venues: "Venues",
    yachts: "Yachts",
    experiences: "Experiences",
}
