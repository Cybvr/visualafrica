import { CITIES } from "@/lib/chat-data";

export const extractIntent = (text: string, actionData?: any) => {
    const lower = text.toLowerCase().trim();

    const directAction = actionData?.capId || actionData?.action || actionData?.id;
    if (directAction) return directAction;

    if (lower.includes("budget") || lower.includes("price") || lower.includes("cost")) return "budget";
    if (lower.includes("flight") || lower.includes("airfare") || lower.includes("airline")) return "search_flights";
    if (lower.includes("ticket") || lower.includes("ticketing")) return "start_ticketing";
    if (lower.includes("vendor") || lower.includes("search") || lower.includes("find") || lower.includes("caterer") || lower.includes("dj")) return "vendor_search";
    if (lower.includes("book") || lower.includes("confirm") || lower.includes("hold")) return "book";
    if (lower.includes("negotiate") || lower.includes("deal") || lower.includes("discount")) return "negotiate";
    if (lower.includes("rsvp") || lower.includes("invite") || lower.includes("guests")) return "rsvp";
    if (lower.includes("upsell") || lower.includes("kit") || lower.includes("store")) return "upsell";
    if (lower.includes("experience")) return "experience";

    return "fallback";
};

export const resolveCity = (text: string, currentCity: string | null) => {
    const lower = text.toLowerCase();
    const found = CITIES.find((c) => lower.includes(c.name.toLowerCase()));
    return found ? found.name : currentCity;
};

export const getDefaultTodoItems = (eventName: string, guestCount: number, city: string) => {
    const crowdCue = guestCount > 0 ? `for ${guestCount} guests` : "for your guest list";
    return [
        `Confirm venue and date in ${city}`,
        `Finalize budget allocations ${crowdCue}`,
        "Shortlist and contact top vendors",
        "Send invitations and track RSVPs",
        "Confirm menu and dietary requirements",
        "Plan decor, setup, and teardown",
        "Build a day-of run sheet and assign responsibilities",
        `Prepare final checklist for ${eventName}`
    ];
};

export const getDefaultItineraryItems = () => {
    return [
        { time: "09:00 AM", label: "Venue access and setup starts" },
        { time: "11:00 AM", label: "Vendor arrivals and technical checks" },
        { time: "01:00 PM", label: "Host briefing and final walkthrough" },
        { time: "03:00 PM", label: "Guest arrival and welcome period" },
        { time: "04:00 PM", label: "Main program begins" },
        { time: "06:00 PM", label: "Food service and networking" },
        { time: "08:00 PM", label: "Highlights, toasts, and closing moments" },
        { time: "09:00 PM", label: "Wrap-up and vendor breakdown" }
    ];
};
