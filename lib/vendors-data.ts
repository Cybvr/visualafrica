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
  | "Bridal"

export type VendorCategory =
  | "All Categories"
  | "Packages"
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
  "Packages",
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
]

export const CATEGORY_SLUG_MAP: Record<string, VendorCategory> = {
  packages: "Packages",
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
}

export interface VendorImage {
  url: string
  alt: string
}

export interface Vendor {
  id: string
  slug: string
  name: string
  categories: VendorCategory[]
  eventThemes: EventTheme[]
  description: string
  shortDescription: string
  price: string | null
  rating: number
  featured: boolean
  image: string
  gallery: VendorImage[]
  vendor: {
    name: string
    logo: string
    slug: string
  }
  whatsIncluded: string[]
  services: string[]
  about: string
  stats: {
    eventsPlanned: string
    satisfiedClients: string
    corporateEvents: string
    yearsExperience: string
    uniqueLocations: string
  }
  location: string
  areaServed: string[]
  yearEstablished: number
  responseTime: string
}

export const vendors: Vendor[] = [
  {
    id: "v1",
    slug: "private-terrace-sunrise-proposal-lekki-view",
    name: "Private Terrace Sunrise Proposal | Lekki View",
    categories: ["Packages"],
    eventThemes: ["Proposals"],
    description:
      "Propose at sunrise from a private terrace in Lekki, the highest point overlooking the lagoon, with luxury decor, 100 roses, and a private photographer & videographer.",
    shortDescription:
      "Propose at sunrise from a private terrace in Lekki, with luxury decor, 100 roses, and a private photographer & videographer.",
    price: "From NGN 850,000",
    rating: 4.9,
    featured: true,
    image: "/images/vendors/terrace-proposal.jpg",
    gallery: [
      { url: "/images/vendors/terrace-proposal.jpg", alt: "Terrace sunrise proposal setup" },
      { url: "/images/hero-proposal.jpg", alt: "Romantic proposal at sunset" },
      { url: "/images/hero-wedding.jpg", alt: "Wedding celebration" },
    ],
    vendor: {
      name: "Qrated Event",
      logo: "/images/vendors/terrace-proposal.jpg",
      slug: "qrated-event",
    },
    whatsIncluded: [
      "Private terrace at Lekki, Lagos",
      "Luxury decor setup",
      "Private photographer & videographer",
      "Heart-shaped frame & LED candles",
      "Fresh flowers & rose petals",
      "100 fresh rose bouquet with personal message",
    ],
    services: ["Luxury Travel", "Event Planning", "Bespoke Experiences", "Private Yacht Charters", "Proposal Setup"],
    about:
      "Qrated Event specializes in luxury travel and event planning, with a strong focus on creating bespoke experiences for special occasions. They manage everything from weddings, anniversaries, and bespoke proposals to corporate galas and desert parties. Their services include customized itineraries, private yacht charters, and unique celebrations in iconic locations.",
    stats: {
      eventsPlanned: "100+",
      satisfiedClients: "100+",
      corporateEvents: "45+",
      yearsExperience: "20+",
      uniqueLocations: "15+",
    },
    location: "Lekki Phase 1, Lagos",
    areaServed: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Accra"],
    yearEstablished: 2019,
    responseTime: "Usually responds within 24 hours",
  },
  {
    id: "v2",
    slug: "luxury-catamaran-cruise-proposal",
    name: "Luxury Catamaran | Cruise Proposal",
    categories: ["Packages", "Yachts"],
    eventThemes: ["Proposals"],
    description:
      "Luxury catamaran cruise proposal with flowers, decor, bouquet, and professional photography. An unforgettable maritime experience on Lagos waters.",
    shortDescription:
      "Luxury catamaran cruise proposal with flowers, decor, bouquet, and professional photography on Lagos waters.",
    price: null,
    rating: 4.8,
    featured: true,
    image: "/images/vendors/catamaran-yacht.jpg",
    gallery: [
      { url: "/images/vendors/catamaran-yacht.jpg", alt: "Luxury catamaran setup" },
      { url: "/images/hero-yacht.jpg", alt: "Yacht party at sunset" },
    ],
    vendor: {
      name: "Qrated Event",
      logo: "/images/vendors/terrace-proposal.jpg",
      slug: "qrated-event",
    },
    whatsIncluded: [
      "Private catamaran cruise",
      "Floral arrangements and decor",
      "Champagne and refreshments",
      "Professional photographer",
      "Romantic music setup",
      "Sunset cruise timing",
    ],
    services: ["Luxury Travel", "Event Planning", "Bespoke Experiences", "Private Yacht Charters"],
    about:
      "Qrated Event delivers luxury maritime experiences on the beautiful Lagos waterfront. From intimate proposals to lavish celebrations, every detail is meticulously planned.",
    stats: {
      eventsPlanned: "100+",
      satisfiedClients: "100+",
      corporateEvents: "45+",
      yearsExperience: "20+",
      uniqueLocations: "15+",
    },
    location: "Victoria Island, Lagos",
    areaServed: ["Lagos", "Abuja"],
    yearEstablished: 2019,
    responseTime: "Usually responds within 24 hours",
  },
  {
    id: "v3",
    slug: "luxury-beach-proposal-lagos-sunset",
    name: "Luxury Beach Proposal at Lagos Sunset",
    categories: ["Packages"],
    eventThemes: ["Proposals"],
    description:
      "Romantic Lagos beach proposal at sunset with heart frame, candles, floral decor, roses & full photographer and videographer coverage.",
    shortDescription:
      "Romantic beach proposal at sunset with heart frame, candles, floral decor, and full coverage.",
    price: null,
    rating: 4.9,
    featured: true,
    image: "/images/vendors/beach-proposal.jpg",
    gallery: [
      { url: "/images/vendors/beach-proposal.jpg", alt: "Beach proposal setup" },
      { url: "/images/hero-proposal.jpg", alt: "Romantic proposal" },
    ],
    vendor: {
      name: "Qrated Event",
      logo: "/images/vendors/terrace-proposal.jpg",
      slug: "qrated-event",
    },
    whatsIncluded: [
      "Private beach setup",
      "Heart-shaped candle arrangement",
      "Floral arch and decorations",
      "Rose petals pathway",
      "Professional photographer & videographer",
      "Champagne and refreshments",
    ],
    services: ["Event Planning", "Bespoke Experiences", "Proposal Setup"],
    about:
      "Qrated Event creates unforgettable beach proposal experiences along Lagos's most stunning coastlines.",
    stats: {
      eventsPlanned: "100+",
      satisfiedClients: "100+",
      corporateEvents: "45+",
      yearsExperience: "20+",
      uniqueLocations: "15+",
    },
    location: "Tarkwa Bay, Lagos",
    areaServed: ["Lagos"],
    yearEstablished: 2019,
    responseTime: "Usually responds within 24 hours",
  },
  {
    id: "v4",
    slug: "boujee-bride-balloon-decor-package",
    name: "Boujee Bride Balloon Decor Package",
    categories: ["Packages", "Decorations"],
    eventThemes: ["Bridal", "Wedding"],
    description:
      "This bridal decor package is perfect for small gatherings or as an add-on to a bigger bridal celebration. Features premium balloons, flowers, and elegant styling.",
    shortDescription:
      "Bridal decor package perfect for small gatherings or as an add-on to a bigger bridal celebration.",
    price: "From NGN 350,000",
    rating: 4.7,
    featured: false,
    image: "/images/vendors/balloon-decor.jpg",
    gallery: [
      { url: "/images/vendors/balloon-decor.jpg", alt: "Bridal balloon decor" },
      { url: "/images/hero-wedding.jpg", alt: "Wedding celebration" },
    ],
    vendor: {
      name: "The Sign & Easel Company",
      logo: "/images/vendors/balloon-decor.jpg",
      slug: "sign-easel-company",
    },
    whatsIncluded: [
      "Premium balloon arrangement",
      "Floral accents",
      "Elegant table centerpieces",
      "Personalized signage",
      "Setup and breakdown",
    ],
    services: ["Decorations", "Event Styling", "Balloon Art"],
    about:
      "The Sign & Easel Company specializes in bespoke event decorations, creating stunning visual experiences for weddings, bridal showers, and celebrations of all kinds.",
    stats: {
      eventsPlanned: "250+",
      satisfiedClients: "200+",
      corporateEvents: "30+",
      yearsExperience: "8+",
      uniqueLocations: "20+",
    },
    location: "Ikeja, Lagos",
    areaServed: ["Lagos", "Abuja", "Ibadan"],
    yearEstablished: 2018,
    responseTime: "Usually responds within 12 hours",
  },
  {
    id: "v5",
    slug: "classic-gender-reveal-decor-package",
    name: "Classic Gender Reveal Decor Package",
    categories: ["Packages", "Decorations"],
    eventThemes: ["Social Gathering", "Kids Birthday"],
    description:
      "A playful, colourful and exciting way to share your big gender reveal surprise. Designed for intimate gatherings with stunning decor.",
    shortDescription:
      "A playful, colourful way to share your big gender reveal surprise with stunning decor.",
    price: "From NGN 200,000",
    rating: 4.6,
    featured: true,
    image: "/images/vendors/gender-reveal.jpg",
    gallery: [
      { url: "/images/vendors/gender-reveal.jpg", alt: "Gender reveal decor" },
      { url: "/images/hero-kids.jpg", alt: "Kids party celebration" },
    ],
    vendor: {
      name: "The Sign & Easel Company",
      logo: "/images/vendors/balloon-decor.jpg",
      slug: "sign-easel-company",
    },
    whatsIncluded: [
      "Gender reveal balloon setup",
      "Confetti and smoke cannons",
      "Themed table decorations",
      "Photo backdrop setup",
      "Setup and breakdown",
    ],
    services: ["Decorations", "Event Styling", "Balloon Art"],
    about:
      "The Sign & Easel Company creates memorable gender reveal experiences with vibrant decor and exciting surprise elements.",
    stats: {
      eventsPlanned: "250+",
      satisfiedClients: "200+",
      corporateEvents: "30+",
      yearsExperience: "8+",
      uniqueLocations: "20+",
    },
    location: "Ikeja, Lagos",
    areaServed: ["Lagos", "Abuja", "Ibadan"],
    yearEstablished: 2018,
    responseTime: "Usually responds within 12 hours",
  },
  {
    id: "v6",
    slug: "ultimate-yacht-decor-package",
    name: "Ultimate Yacht Decor Package",
    categories: ["Packages", "Yachts", "Decorations"],
    eventThemes: ["Social Gathering"],
    description:
      "High-end yacht decor with disco balls, champagne wall, and LED balloons for luxury yacht parties. The ultimate maritime celebration experience.",
    shortDescription:
      "High-end yacht decor with disco balls, champagne wall, and LED balloons for luxury parties.",
    price: "From NGN 500,000",
    rating: 4.8,
    featured: true,
    image: "/images/vendors/yacht-decor.jpg",
    gallery: [
      { url: "/images/vendors/yacht-decor.jpg", alt: "Yacht decor package" },
      { url: "/images/hero-yacht.jpg", alt: "Luxury yacht party" },
    ],
    vendor: {
      name: "The Sign & Easel Company",
      logo: "/images/vendors/balloon-decor.jpg",
      slug: "sign-easel-company",
    },
    whatsIncluded: [
      "Disco ball installation",
      "Champagne wall setup",
      "LED balloon arrangements",
      "Premium floral decor",
      "Sound and lighting setup",
      "Full setup and breakdown",
    ],
    services: ["Decorations", "Event Styling", "Yacht Events"],
    about:
      "The Sign & Easel Company delivers show-stopping yacht party decorations that transform any vessel into a floating celebration venue.",
    stats: {
      eventsPlanned: "250+",
      satisfiedClients: "200+",
      corporateEvents: "30+",
      yearsExperience: "8+",
      uniqueLocations: "20+",
    },
    location: "Victoria Island, Lagos",
    areaServed: ["Lagos"],
    yearEstablished: 2018,
    responseTime: "Usually responds within 12 hours",
  },
]

export const VENDOR_FAQ = [
  {
    question: "How do I book vendors through Visual Africa?",
    answer:
      "Simply browse our vendor listings, view their profiles, and click 'Get a Quote' to submit your event details. The vendor will respond directly with pricing and availability.",
  },
  {
    question: "Are all vendors on the platform verified?",
    answer:
      "Yes, all vendors on Visual Africa go through a verification process. We check business credentials, portfolios, and client reviews before listing any vendor on our platform.",
  },
  {
    question: "What areas do your vendors serve?",
    answer:
      "Most of our vendors are based in Lagos and serve the greater Lagos area. Some vendors also serve Abuja, Port Harcourt, Ibadan, and other major Nigerian cities. Check each vendor's profile for specific areas served.",
  },
  {
    question: "How do I get quotes from vendors?",
    answer:
      "You can request quotes directly from vendor profile pages by clicking the 'Get a Quote' button. Fill in your event details and the vendor will respond with a customized quote.",
  },
  {
    question: "Can Visual Africa help me as a party planner?",
    answer:
      "Visual Africa is designed to help both individual event organizers and professional party planners find the best vendors for any occasion.",
  },
  {
    question: "How do I find an event planner to arrange everything for me?",
    answer:
      "Browse our Event Planners category to find experienced professionals who can handle all aspects of your event, from planning to execution.",
  },
  {
    question: "What should I look out for when choosing a party planner for my event?",
    answer:
      "Look for verified reviews, portfolio quality, response time, experience with your type of event, and transparent pricing. Our platform makes it easy to compare vendors side by side.",
  },
  {
    question: "What are the pros and cons of planning the event myself versus hiring an event planner?",
    answer:
      "Planning yourself gives you full control and can save money, but requires significant time and effort. Hiring a planner brings expertise, vendor relationships, and stress-free execution. Many of our users start by browsing vendors themselves, then hire a planner for the final coordination.",
  },
  {
    question: "Can I book vendors myself instead of using a party planner? How many quote requests can I send?",
    answer:
      "You can book vendors directly through our platform. There is no limit to the number of quote requests you can send, so feel free to compare options before making your choice.",
  },
  {
    question: "Is Visual Africa for both professional party planners and individuals planning their own events?",
    answer:
      "Yes! Visual Africa serves both professional event planners looking for trusted vendors and individuals who want to plan their own celebrations with expert vendor support.",
  },
]

export function getVendorBySlug(slug: string): Vendor | undefined {
  return vendors.find((v) => v.slug === slug)
}

export function getVendorsByCategory(categorySlug: string): Vendor[] {
  const category = CATEGORY_SLUG_MAP[categorySlug]
  if (!category) return vendors
  return vendors.filter((v) => v.categories.includes(category))
}

export function getVendorsByTheme(theme: EventTheme): Vendor[] {
  if (theme === "All Themes") return vendors
  return vendors.filter((v) => v.eventThemes.includes(theme))
}

export function filterVendors(
  categorySlug?: string,
  theme?: EventTheme,
  search?: string
): Vendor[] {
  let result = [...vendors]

  if (categorySlug && categorySlug !== "all") {
    const category = CATEGORY_SLUG_MAP[categorySlug]
    if (category) {
      result = result.filter((v) => v.categories.includes(category))
    }
  }

  if (theme && theme !== "All Themes") {
    result = result.filter((v) => v.eventThemes.includes(theme))
  }

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.vendor.name.toLowerCase().includes(q)
    )
  }

  return result
}
