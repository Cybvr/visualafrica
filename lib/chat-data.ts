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

export const DEMO_CHAT_HISTORY = [
    {
        id: "lagos-bday",
        title: "Lagos birthday weekend",
        city: "Lagos",
        price: "$89",
        rating: 4.8,
        runs: 132,
        image: "",
        published: true,
    },
    {
        id: "accra-wedding",
        title: "Accra wedding shortlist",
        city: "Accra",
        price: "$99",
        rating: 4.9,
        runs: 164,
        image: "",
        published: true,
    },
    {
        id: "nairobi-boat",
        title: "Nairobi boat + dinner plan",
        city: "Nairobi",
        price: "$79",
        rating: 4.7,
        runs: 86,
        image: "",
        published: false,
    },
    {
        id: "cape-town-brunch",
        title: "Cape Town brunch vendors",
        city: "Cape Town",
        price: "$72",
        rating: 4.6,
        runs: 58,
        image: "",
        published: true,
    },
    {
        id: "corporate-hq",
        title: "Nairobi HQ Launch",
        city: "Nairobi",
        price: "$120",
        rating: 4.9,
        runs: 41,
        image: "",
        published: true,
    },
];

export function buildVendorsList(vendors: Vendor[], city: string) {
    return vendors
        .filter(v => v.location.toLowerCase().includes(city.toLowerCase()))
        .map(v => ({
            name: v.name,
            slug: v.slug || v.id,
            type: v.categories[0],
            categories: v.categories,
            tags: v.services.slice(0, 4),
            price: v.price || "Contact for price",
            rating: v.rating,
            status: "Available",
            statusColor: "hsl(var(--primary))",
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
            { label: "Experiences", action: "start_experiences" },
            { label: "Store", action: "start_store" }
        ],
        time: new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })
    }
];


export const MARKET_DATA: Record<string, any> = {
    Accra: {
        greeting: "Accra — perfect. I'm pulling from the Ghanaian vendor network now. Caterers, Highlife DJs, kente decor, venues. What's the event?",
        capabilityResponses: {
            vendor_search: { type: "vendor_cards", city: "Accra", content: "Top vendors available in Accra:", vendors: [] },
            start_vendor_search: { type: "vendor_cards", city: "Accra", content: "Top vendors available in Accra:", vendors: [] },
            negotiate: {
                type: "action", content: "Negotiating bundle across Accra vendors:", actions: [
                    { label: "Contacting Maame's Kitchen for bulk rate", status: "done" },
                    { label: "Contacting DJ Ohene for package discount", status: "done" },
                    { label: "Requesting 12% bundle across catering + DJ + decor", status: "active" },
                ]
            },
            book: {
                type: "action", content: "Confirming Accra bookings:", actions: [
                    { label: "Sending deposit request to Maame's Kitchen", status: "done" },
                    { label: "Confirming DJ Ohene date hold", status: "active" },
                    { label: "Generating vendor contracts", status: "queued" },
                ]
            },
            rsvp: {
                type: "action", content: "Launching Accra RSVP campaign:", actions: [
                    { label: "Drafting bilingual invite (English + Twi)", status: "done" },
                    { label: "Sending to diaspora community list (340 contacts)", status: "active" },
                    { label: "Setting up RSVP tracking dashboard", status: "queued" },
                ]
            },
            budget: { type: "text", content: "Accra budget summary:\n\nCatering (200 guests): ₵17,000 · DJ: ₵2,200 · Decor: ₵1,200 · Venue (est.): ₵4,500\n\nRunning total: ₵24,900 (~$1,620 USD)\nBundle savings pending — est. ₵2,988 off (12%)." },
            upsell: {
                type: "ama_flow_card",
                kicker: "WADDI SUGGESTION",
                content: "Since this is your first wedding in Accra, I recommend the 'Coastal Wedding Kit' from our store. It's a complete blueprint used for Labadi Beach ceremonies.",
                meta: "Kit Price: $89 · Proven Vendor List Included",
                suggestions: [
                    { label: "View Store Kit", action: "view_store_kit" },
                    { label: "Apply Kit", action: "apply_kit" }
                ]
            },
            experience: {
                type: "vendor_cards",
                city: "Accra",
                content: "For a memorable wedding, check out these exclusive Ghanaian experiences:",
                vendors: [
                    { name: "Private Shoreline Fireworks", type: "Experience", tags: ["Luxury", "Coastal", "Night"], price: "₵8,500", status: "Premium", statusColor: "hsl(var(--primary))" },
                    { name: "Traditional Kente Procession", type: "Experience", tags: ["Cultural", "Authentic"], price: "₵4,200", status: "Available", statusColor: "hsl(var(--primary))" }
                ],
                suggestions: [
                    { label: "Action Booking", action: "book" }
                ]
            }
        }
    },
    Lagos: {
        greeting: "Lagos — let's go. Tapped into the Lagos vendor network. Suya caterers, Afrobeats DJs, aso-oke stylists, waterfront venues. What are we planning?",
        capabilityResponses: {
            vendor_search: { type: "vendor_cards", city: "Lagos", content: "Top vendors available in Lagos:", vendors: [] },
            start_vendor_search: { type: "vendor_cards", city: "Lagos", content: "Top vendors available in Lagos:", vendors: [] },
            negotiate: {
                type: "action", content: "Negotiating bundle across Lagos vendors:", actions: [
                    { label: "Contacting Mama Titi's for volume rate", status: "done" },
                    { label: "Contacting DJ Neptune for package deal", status: "done" },
                    { label: "Requesting 10% bundle across catering + DJ + decor", status: "active" },
                ]
            },
            book: {
                type: "action", content: "Confirming Lagos bookings:", actions: [
                    { label: "Sending deposit request to Mama Titi's Kitchen", status: "done" },
                    { label: "Confirming DJ Neptune date hold", status: "active" },
                    { label: "Securing venue deposit — Landmark Centre", status: "queued" },
                ]
            },
            rsvp: {
                type: "action", content: "Launching Lagos RSVP campaign:", actions: [
                    { label: "Drafting bilingual invite (English + Yoruba)", status: "done" },
                    { label: "Sending to diaspora community list (410 contacts)", status: "active" },
                    { label: "Setting up RSVP tracking link", status: "queued" },
                ]
            },
            budget: { type: "text", content: "Lagos budget summary:\n\nCatering (300 guests): ₦1,350,000 · DJ: ₦180,000 · Decor: ₦85,000 · Venue (est.): ₦850,000\n\nRunning total: ₦2,465,000 (~$1,540 USD)\nBundle savings pending — est. ₦246,500 off (10%)." },
            upsell: {
                type: "ama_flow_card",
                kicker: "WADDI SUGGESTION",
                content: "I've noticed you're exploring high-end Lagos options. Our 'Eko Atlantic Corporate Kit' includes pre-vetted security and rapid-transfer logistics specifically for this area.",
                meta: "Kit Price: $120 · Expertly Curated",
                suggestions: [
                    { label: "View Store Kit", action: "view_store_kit" },
                    { label: "Apply Kit", action: "apply_kit" }
                ]
            },
            experience: {
                type: "vendor_cards",
                city: "Lagos",
                content: "For a true Lagos luxury experience, these database-exclusive options are available:",
                vendors: [
                    { name: "Private Yacht Concert", type: "Experience", tags: ["Exclusive", "Music", "Epe"], price: "₦2.5M", status: "Available", statusColor: "hsl(var(--primary))" },
                    { name: "Aso-oke Runway Workshop", type: "Experience", tags: ["Fashion", "Interactive"], price: "₦450k", status: "New", statusColor: "hsl(var(--primary))" }
                ],
                suggestions: [
                    { label: "Negotiate Bundle", action: "negotiate" }
                ]
            }
        }
    },
    Nairobi: {
        greeting: "Nairobi — great choice. Into the Kenyan vendor network now. Nyama choma caterers, Gengetone & Amapiano DJs, Maasai-inspired decor. What are we building?",
        capabilityResponses: {
            vendor_search: { type: "vendor_cards", city: "Nairobi", content: "Top vendors available in Nairobi:", vendors: [] },
            start_vendor_search: { type: "vendor_cards", city: "Nairobi", content: "Top vendors available in Nairobi:", vendors: [] },
            negotiate: {
                type: "action", content: "Negotiating bundle across Nairobi vendors:", actions: [
                    { label: "Contacting Nyama Choma Kings for group rate", status: "done" },
                    { label: "Requesting DJ + decor package discount", status: "active" },
                    { label: "Targeting 12% bundle saving", status: "queued" },
                ]
            },
            book: {
                type: "action", content: "Confirming Nairobi bookings:", actions: [
                    { label: "Assigning local on-ground coordinator", status: "done" },
                    { label: "Sending deposit to Nyama Choma Kings", status: "active" },
                    { label: "Confirming venue — Nairobi Safari Club Gardens", status: "queued" },
                ]
            },
            rsvp: {
                type: "action", content: "Launching Nairobi RSVP campaign:", actions: [
                    { label: "Drafting trilingual invite (English + Swahili + Kikuyu)", status: "done" },
                    { label: "Sending to diaspora community list (290 contacts)", status: "active" },
                    { label: "Setting up RSVP tracking dashboard", status: "queued" },
                ]
            },
            budget: { type: "text", content: "Nairobi budget summary:\n\nCatering (150 guests): KSh 420,000 · DJ: KSh 55,000 · Decor: KSh 22,000 · Venue (est.): KSh 120,000\n\nRunning total: KSh 617,000 (~$4,750 USD)\nBundle savings pending — est. KSh 74,000 off." },
            upsell: {
                type: "ama_flow_card",
                kicker: "WADDI SUGGESTION",
                content: "Since this is a high-profile launch, I've identified the 'Nairobi Premium HQ Kit' from our store. It includes a pre-negotiated venue-catering-security bundle that saves you 15% and roughly 12 hours of planning time.",
                meta: "Kit Price: $79 · Est. Savings: KSh 85k+",
                suggestions: [
                    { label: "View Store Kit", action: "view_store_kit" },
                    { label: "Apply Kit", action: "apply_kit" }
                ]
            },
            experience: {
                type: "vendor_cards",
                city: "Nairobi",
                content: "For a corporate crowd, I recommend these curated 'Experiences' instead of standard vendors. They offer unique guest engagement:",
                vendors: [
                    { name: "Sunset Skyline Safari", type: "Experience", tags: ["Rooftop", "VR Safari", "Premium"], price: "KSh 18,000pp", status: "Available", statusColor: "hsl(var(--primary))" },
                    { name: "Nairobi Tech-Art Fusion", type: "Experience", tags: ["Interactive", "Networking", "Modern"], price: "KSh 12,000pp", status: "Highly Rated", statusColor: "hsl(var(--primary))" }
                ],
                suggestions: [
                    { label: "Action Booking", action: "book" },
                    { label: "Discover Vendors", action: "vendor_search" }
                ]
            }
        }
    },
    "Cape Town": {
        greeting: "Cape Town — on it. Into the South African vendor network. Braai caterers, Amapiano DJs, Cape Malay & Pan-African decor, estate venues. What's the event?",
        capabilityResponses: {
            vendor_search: { type: "vendor_cards", city: "Cape Town", content: "Top vendors available in Cape Town:", vendors: [] },
            start_vendor_search: { type: "vendor_cards", city: "Cape Town", content: "Top vendors available in Cape Town:", vendors: [] },
            negotiate: {
                type: "action", content: "Negotiating bundle across Cape Town vendors:", actions: [
                    { label: "Contacting Braai Masters for group rate", status: "done" },
                    { label: "Requesting DJ + decor bundle", status: "active" },
                    { label: "Targeting 10% saving across all three", status: "queued" },
                ]
            },
            book: {
                type: "action", content: "Confirming Cape Town bookings:", actions: [
                    { label: "Sending deposit to Braai Masters CT", status: "done" },
                    { label: "Confirming DJ Bongani date hold", status: "active" },
                    { label: "Securing Groot Constantia Lawns deposit", status: "queued" },
                ]
            },
            rsvp: {
                type: "action", content: "Launching Cape Town RSVP campaign:", actions: [
                    { label: "Drafting invite (English + Zulu + Afrikaans)", status: "done" },
                    { label: "Sending to diaspora community list (260 contacts)", status: "active" },
                    { label: "Setting up RSVP tracking dashboard", status: "queued" },
                ]
            },
            budget: { type: "text", content: "Cape Town budget summary:\n\nCatering (150 guests): R48,000 · DJ: R4,500 · Decor: R12,000 · Venue (est.): R22,000\n\nRunning total: R86,500 (~$4,700 USD)\nBundle savings pending — est. R8,650 off (10%)." },
            upsell: {
                type: "ama_flow_card",
                kicker: "WADDI SUGGESTION",
                content: "Planning in the Winelands can be complex. The 'Constantia Estate Kit' handles all local permits and estate-vetted caterers automatically.",
                meta: "Kit Price: $65 · Recommended by 40+ Hosts",
                suggestions: [
                    { label: "View Kit", action: "view_store_kit" },
                    { label: "Apply to Plan", action: "apply_kit" }
                ]
            },
            experience: {
                type: "vendor_cards",
                city: "Cape Town",
                content: "Looking for something beyond a standard venue? These Cape Town experiences are live in our database:",
                vendors: [
                    { name: "Table Mountain Sunset Yoga", type: "Experience", tags: ["Wellness", "Iconic"], price: "R1,200pp", status: "Available", statusColor: "hsl(var(--primary))" },
                    { name: "Winelands Private Barrel Tasting", type: "Experience", tags: ["Gourmet", "Luxury"], price: "R3,500pp", status: "Exclusive", statusColor: "hsl(var(--primary))" }
                ],
                suggestions: [
                    { label: "Action Booking", action: "book" }
                ]
            }
        }
    }
};

export function getChatMessages(chatId: string, allVendorsByCity: Record<string, any[]>, liveEvents: SharedEvent[]) {
    if (chatId === 'lagos-bday') {
        const lagosVendors = allVendorsByCity["Lagos"] || [];
        const v1 = lagosVendors[0]?.name || "Local Vendor";
        const v2 = lagosVendors[1]?.name || "Premium Catering";
        const v3 = lagosVendors[2]?.name || "Event Venue";

        return [
            { id: 'msg-1', role: "user", content: "I'm looking for some help with my birthday weekend in Lagos.", time: "Yesterday" },
            {
                id: 'msg-2', role: "agent", type: "text",
                content: MARKET_DATA.Lagos.greeting,
                suggestions: [
                    { label: "Plan", action: "start_planning" },
                    { label: "Discover Vendors", action: "vendor_search" }
                ],
                time: "Yesterday"
            },
            {
                id: 'msg-3', role: "agent", type: "ama_flow_card", kicker: "BUDGET OVERVIEW",
                content: "Here's the current allocation for your Lagos weekend using our verified vendors:",
                columns: ["Activity", "Vendor", "Price", "Status"],
                rows: [
                    ["Spa", v1, "₦180k", "Quote requested"],
                    ["Dinner", v2, "₦350k", "Quote requested"],
                    ["Experience", v3, "₦600k", "Quote requested"]
                ],
                footer: `Total Allocated: ₦1.13M · Remaining: ₦870k`,
                suggestions: [
                    { label: "Update Budget", action: "budget" },
                    { label: "Negotiate Bundle", action: "negotiate" }
                ],
                time: "Yesterday"
            },
            { id: 'msg-4', role: "user", content: "Thanks! Can you also look for some high-end clubs for the Saturday night?", time: "02:14 PM" }
        ];
    } else if (chatId === 'accra-wedding') {
        const accraVendors = allVendorsByCity["Accra"] || [];
        const v1 = accraVendors[0]?.name || "Accra Catering";
        const v2 = accraVendors[1]?.name || "Ghana DJ";
        const v3 = accraVendors[2]?.name || "Luxury Decor";

        const accraEvent = liveEvents.find(e => (e.location || "").toLowerCase().includes("accra")) || liveEvents[0];

        return [
            { id: 'msg-h-1', role: "user", content: "Searching for wedding vendors in Accra for December.", time: "Tuesday" },
            {
                id: 'msg-a-2', role: "agent", type: "ama_flow_card", kicker: "BUDGET OVERVIEW",
                content: "Preliminary shortlist for your Accra wedding:",
                columns: ["Activity", "Vendor", "Price", "Status"],
                rows: [
                    ["Catering", v1, "₵17,000", "Confirmed"],
                    ["Music", v2, "₵2,200", "Confirmed"],
                    ["Decor", v3, "₵3,500", "Quote received"]
                ],
                footer: `Total Allocated: ₵22,700 · Remaining: ₵7,300`,
                suggestions: [
                    { label: "Discover Vendors", action: "vendor_search" },
                    { label: "Review Budget", action: "budget" }
                ],
                time: "Tuesday"
            },
            { id: 'msg-h-2', role: "user", content: "What about photographers?", time: "Wednesday" },
            {
                id: 'msg-a-3', role: "agent", type: "vendor_cards", city: "Accra",
                content: "Here are some top photographers from our Accra database:",
                vendors: accraVendors.slice(0, 3),
                suggestions: [
                    { label: "Action Booking", action: "book" },
                    { label: "Discover Vendors", action: "vendor_search" }
                ],
                time: "Wednesday"
            },
            {
                id: 'msg-a-4', role: "agent", type: "community",
                content: accraEvent ? `This real event shared by ${accraEvent.hostName} had a similar vibe. You might find their vendor list helpful:` : "Check out this community inspiration:",
                data: accraEvent || {
                    id: "accra-wedding-ref",
                    eventName: "Modern Accra Wedding",
                    location: "Labadi, Accra",
                    description: "A stunning seaside ceremony using local vendors.",
                    image: "/images/events/wedding-1.jpg"
                },
                suggestions: [
                    { label: "Apply Kit", action: "duplicate_event" },
                    { label: "Discover Vendors", action: "text" }
                ],
                time: "Wednesday"
            }
        ];
    } else if (chatId === 'nairobi-boat') {
        const nairobiVendors = allVendorsByCity["Nairobi"] || [];
        return [
            { id: 'n-1', role: "user", content: "Planning a boat + dinner outing in Nairobi for September. Any ideas?", time: "Last week" },
            {
                id: 'n-2', role: "agent", type: "text", content: MARKET_DATA.Nairobi.greeting,
                suggestions: [
                    { label: "Discover Vendors", action: "vendor_search" },
                    { label: "Manage Itinerary", action: "capability", capId: "itinerary" }
                ],
                time: "Last week"
            },
            {
                id: 'n-3', role: "agent", type: "ama_flow_card", kicker: "NAIROBI PLAN",
                content: "I've drafted a plan using live Nairobi vendors:",
                columns: ["Activity", "Vendor", "Price", "Status"],
                rows: [
                    ["Experience", nairobiVendors[0]?.name || "Nairobi Club", "KSh 45,000", "Available"],
                    ["Dinner", nairobiVendors[1]?.name || "Local Grill", "KSh 85,000", "Table held"]
                ],
                footer: `Total Allocated: KSh 130,000 · Remaining: KSh 20,000`,
                suggestions: [
                    { label: "Discover Vendors", action: "vendor_search" },
                    { label: "Action Booking", action: "book" }
                ],
                time: "Last week"
            },
            { id: 'n-4', role: "user", content: "The price for the boat seems high. Can we look for smaller options?", time: "09:12 AM" }
        ];
    } else if (chatId === 'cape-town-brunch') {
        const ctVendors = allVendorsByCity["Cape Town"] || [];
        return [
            { id: 'ct-1', role: "user", content: "Need brunch vendors for a baby shower in Cape Town. Around 40 guests.", time: "Monday" },
            {
                id: 'ct-2', role: "agent", type: "text", content: MARKET_DATA["Cape Town"].greeting,
                suggestions: [
                    { label: "Discover Vendors", action: "vendor_search" },
                    { label: "Venue Shortlist", action: "capability", capId: "shortlist" }
                ],
                time: "Monday"
            },
            {
                id: 'ct-3', role: "agent", type: "vendor_cards", city: "Cape Town",
                content: "These live venues have great brunch availability for October:",
                vendors: ctVendors.slice(0, 2),
                suggestions: [
                    { label: "Discover Vendors", action: "vendor_search" },
                    { label: "Action Booking", action: "book" }
                ],
                time: "Monday"
            },
            {
                id: 'ct-4', role: "agent", type: "ama_flow_card", kicker: "BUDGET OVERVIEW",
                content: "Current budget snapshot for your Cape Town event:",
                columns: ["Activity", "Vendor", "Price", "Status"],
                rows: [
                    ["Venue", ctVendors[0]?.name || "Estate", "R12,000", "Confirmed"],
                    ["Catering", ctVendors[1]?.name || "Kitchen", "R18,500", "Received"]
                ],
                footer: `Total Allocated: R30,500 · Remaining: R9,500`,
                suggestions: [
                    { label: "Review Budget", action: "budget" },
                    { label: "Action Booking", action: "book" }
                ],
                time: "Tuesday"
            },
            { id: 'ct-5', role: "user", content: `Let's go with ${ctVendors[0]?.name || "the estate"}. Can you check if they allow outside cake?`, time: "11:45 AM" }
        ];
    } else if (chatId === 'corporate-hq') {
        const nairobiVendors = allVendorsByCity["Nairobi"] || [];
        return [
            { id: 'chq-1', role: "user", content: "I'm planning a high-profile corporate launch for our new HQ in Nairobi this October.", time: "Monday" },
            {
                id: 'chq-2', role: "agent", type: "text", content: MARKET_DATA.Nairobi.greeting,
                suggestions: [
                    { label: "Review Budget", action: "capability", capId: "budget" },
                    { label: "Browse Store", action: "capability", capId: "upsell" }
                ],
                time: "Monday"
            },
            {
                id: 'chq-3', role: "agent", type: "ama_flow_card",
                kicker: "AGENT UPSELL",
                content: "I've analyzed your intent. For a high-stakes HQ launch, the 'Strategic Launch Kit' in our store is your best bet. It includes a curated list of vendors who have previously handled international corporate openings in Nairobi.",
                meta: "Kit Price: $99 · Includes: Project Plan, Vendor Briefs, and Budget Template.",
                suggestions: [
                    { label: "View Store Kit", action: "view_kit" },
                    { label: "Discover Vendors", action: "vendor_search" }
                ],
                time: "Monday"
            },
            { id: 'chq-4', role: "user", content: "That kit sounds interesting. What about something unique for the evening reception? Not just a standard DJ.", time: "10:30 AM" },
            {
                id: 'chq-5', role: "agent", type: "vendor_cards", city: "Nairobi",
                content: "Understood. Bypassing standard DJs. I've pulled these exclusive 'Experiences' from the database that fit a corporate profile:",
                vendors: [
                    {
                        name: "Nairobi Skyline Orchestra",
                        type: "Experience",
                        tags: ["Classical-Fusion", "Rooftop", "Premium"],
                        price: "KSh 250,000",
                        status: "Available",
                        rating: 4.9
                    },
                    {
                        name: "Interactive Safari VR Lounge",
                        type: "Experience",
                        tags: ["Tech", "Immersive", "Branded"],
                        price: "KSh 180,000",
                        status: "Exclusive",
                        rating: 5.0
                    }
                ],
                suggestions: [
                    { label: "Negotiate Bundle", action: "negotiate" },
                    { label: "Action Booking", action: "book" }
                ],
                time: "10:31 AM"
            }
        ];
    }

    return [];
}
