
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
  | "Experiences"

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

export interface VendorImage {
  url: string
  alt: string
}

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'Video' | 'Gallery';
  date: string;
  image: string;
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
  portfolio: PortfolioItem[]
}

export const vendors: Vendor[] = [
  {
    id: "v1",
    slug: "private-terrace-sunrise-proposal-lekki-view",
    name: "Private Terrace Sunrise Proposal | Lekki View",
    categories: ["Experiences"],
    eventThemes: ["Proposals"],
    description: "Propose at sunrise from a private terrace in Lekki...",
    shortDescription: "Propose at sunrise from a private terrace in Lekki...",
    price: "From NGN 850,000",
    rating: 4.9,
    featured: true,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
    gallery: [{ url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800", alt: "setup" }],
    vendor: { name: "Olu & Co Events", logo: "", slug: "olu-and-co" },
    whatsIncluded: ["Private terrace", "Luxury decor", "Photography"],
    services: ["Event Planning"],
    about: "Specialists in luxury African experiences.",
    stats: { eventsPlanned: "100+", satisfiedClients: "100+", corporateEvents: "45+", yearsExperience: "20+", uniqueLocations: "15+" },
    location: "Lekki Phase 1, Lagos",
    areaServed: ["Lagos"],
    yearEstablished: 2019,
    responseTime: "Within 24 hours",
    portfolio: [
      { id: "p1", title: "Wedding Ceremony Highlights", type: "Video", date: "Jan 2026", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
      { id: "p2", title: "Garden Reception Decor", type: "Gallery", date: "Dec 2025", image: "https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&q=80&w=800" },
    ]
  },
  {
    id: "v2",
    slug: "luxury-catamaran-cruise-proposal",
    name: "Luxury Catamaran | Cruise Proposal",
    categories: ["Experiences", "Yachts"],
    eventThemes: ["Proposals", "Social Gathering"],
    description: "Maritime experience on Lagos waters.",
    shortDescription: "Maritime experience on Lagos waters.",
    price: "From NGN 1,200,000",
    rating: 4.8,
    featured: true,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
    gallery: [{ url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800", alt: "catamaran" }],
    vendor: { name: "Olu & Co Events", logo: "", slug: "olu-and-co" },
    whatsIncluded: ["Catamaran cruise", "Champagne"],
    services: ["Yacht Charters"],
    about: "Luxury sea events.",
    stats: { eventsPlanned: "100+", satisfiedClients: "100+", corporateEvents: "45+", yearsExperience: "20+", uniqueLocations: "15+" },
    location: "Victoria Island, Lagos",
    areaServed: ["Lagos"],
    yearEstablished: 2019,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-catering-1",
    slug: "naija-gourmet-flavors",
    name: "Naija Gourmet Flavors",
    categories: ["Catering"],
    eventThemes: ["Wedding", "Corporate Event", "Anniversary"],
    description: "Authentic Nigerian and Continental cuisine for upscale events.",
    shortDescription: "Authentic Nigerian and Continental cuisine for upscale events.",
    price: "From NGN 15,000/Guest",
    rating: 4.9,
    featured: true,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Abike's Kitchen", logo: "", slug: "abikes-kitchen" },
    whatsIncluded: ["Plated Service", "Buffet Options"],
    services: ["Catering"],
    about: "Best in class catering.",
    stats: { eventsPlanned: "500+", satisfiedClients: "1000+", corporateEvents: "200+", yearsExperience: "15+", uniqueLocations: "30+" },
    location: "Ikoyi, Lagos",
    areaServed: ["Lagos", "Abuja"],
    yearEstablished: 2010,
    responseTime: "Within 6 hours",
    portfolio: [
      { id: "p3", title: "Corporate Awards Night", type: "Video", date: "Nov 2025", image: "https://images.unsplash.com/photo-1540575861501-7c00117fc24b?auto=format&fit=crop&q=80&w=800" },
    ]
  },
  {
    id: "v-photo-1",
    slug: "eko-lens-studio",
    name: "Eko Lens Studio",
    categories: ["Photographers", "Photo Booths"],
    eventThemes: ["Wedding", "Social Gathering", "Kids Birthday"],
    description: "Capturing moments that last a lifetime.",
    shortDescription: "Capturing moments that last a lifetime.",
    price: "From NGN 450,000",
    rating: 4.7,
    featured: false,
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Eko Lens", logo: "", slug: "eko-lens" },
    whatsIncluded: ["Full Day Coverage", "Edited Photos"],
    services: ["Photography"],
    about: "Visual storytellers.",
    stats: { eventsPlanned: "300+", satisfiedClients: "300+", corporateEvents: "50+", yearsExperience: "8+", uniqueLocations: "100+" },
    location: "Ikeja, Lagos",
    areaServed: ["Nationwide"],
    yearEstablished: 2016,
    responseTime: "Within 12 hours",
    portfolio: [
      { id: "p4", title: "Birthday Bash", type: "Gallery", date: "Oct 2025", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" },
    ]
  },
  {
    id: "v-venue-1",
    slug: "the-monarch-event-center",
    name: "The Monarch Event Center",
    categories: ["Venues"],
    eventThemes: ["Wedding", "Corporate Event", "Social Gathering"],
    description: "A majestic space for your grand celebrations.",
    shortDescription: "A majestic space for your grand celebrations.",
    price: "From NGN 5,000,000",
    rating: 5.0,
    featured: true,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Monarch Group", logo: "", slug: "monarch" },
    whatsIncluded: ["Main Hall", "Bridal Suite", "Ample Parking"],
    services: ["Venue Rental"],
    about: "Lagos' most prestigious venue.",
    stats: { eventsPlanned: "50+", satisfiedClients: "50+", corporateEvents: "20+", yearsExperience: "5+", uniqueLocations: "1" },
    location: "Lekki, Lagos",
    areaServed: ["Lagos"],
    yearEstablished: 2020,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-makeup-1",
    slug: "glam-by-oluwatiti",
    name: "Glam by Oluwatiti",
    categories: ["Makeup Artists"],
    eventThemes: ["Wedding", "Bridal", "Bachelorette"],
    description: "Enhancing your natural beauty for your special day.",
    shortDescription: "Enhancing your natural beauty for your special day.",
    price: "From NGN 120,000",
    rating: 4.8,
    featured: false,
    image: "https://images.unsplash.com/photo-1512496011951-a6994413c2ca?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Glam by Oluwatiti", logo: "", slug: "glam-oluwatiti" },
    whatsIncluded: ["Bridal Makeup", "Touch-up kit"],
    services: ["Makeup"],
    about: "Expert bridal artistry.",
    stats: { eventsPlanned: "400+", satisfiedClients: "400+", corporateEvents: "10+", yearsExperience: "6+", uniqueLocations: "400+" },
    location: "Surulere, Lagos",
    areaServed: ["Lagos", "Ibadan"],
    yearEstablished: 2018,
    responseTime: "Within 3 hours",
    portfolio: []
  },
  {
    id: "v-exp-3",
    slug: "rooftop-dinner-proposal-ikoyi",
    name: "Rooftop Dinner Proposal | Ikoyi Skyline",
    categories: ["Experiences"],
    eventThemes: ["Proposals", "Anniversary"],
    description: "Intimate rooftop dining experience with panoramic city views and private chef service.",
    shortDescription: "Intimate rooftop dining with panoramic city views.",
    price: "From NGN 950,000",
    rating: 4.9,
    featured: true,
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800",
    gallery: [
      { url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800", alt: "rooftop setup" }
    ],
    vendor: { name: "Olu & Co Events", logo: "", slug: "olu-and-co" },
    whatsIncluded: ["Private rooftop venue", "4-course dinner", "Live violinist", "Professional photography", "Customized decor"],
    services: ["Event Planning", "Catering"],
    about: "Specialists in luxury African experiences.",
    stats: {
      eventsPlanned: "100+",
      satisfiedClients: "100+",
      corporateEvents: "45+",
      yearsExperience: "20+",
      uniqueLocations: "15+"
    },
    location: "Ikoyi, Lagos",
    areaServed: ["Lagos"],
    yearEstablished: 2019,
    responseTime: "Within 24 hours",
    portfolio: [
      { id: "p5", title: "Rooftop Engagement", type: "Gallery", date: "Jan 2026", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" }
    ]
  },
  {
    id: "v-exp-4",
    slug: "beach-bonfire-proposal-takwa-bay",
    name: "Beach Bonfire Proposal | Takwa Bay",
    categories: ["Experiences"],
    eventThemes: ["Proposals", "Social Gathering"],
    description: "Secluded beach proposal with bonfire, acoustic music, and oceanfront setting.",
    shortDescription: "Secluded beach proposal with bonfire and acoustic music.",
    price: "From NGN 650,000",
    rating: 4.7,
    featured: false,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    gallery: [
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800", alt: "beach bonfire" }
    ],
    vendor: { name: "Olu & Co Events", logo: "", slug: "olu-and-co" },
    whatsIncluded: ["Private beach section", "Bonfire setup", "Acoustic guitarist", "Champagne & light bites", "Floral pathway", "Photography"],
    services: ["Event Planning"],
    about: "Specialists in luxury African experiences.",
    stats: {
      eventsPlanned: "100+",
      satisfiedClients: "100+",
      corporateEvents: "45+",
      yearsExperience: "20+",
      uniqueLocations: "15+"
    },
    location: "Takwa Bay, Lagos",
    areaServed: ["Lagos"],
    yearEstablished: 2019,
    responseTime: "Within 24 hours",
    portfolio: [
      { id: "p6", title: "Beach Sunset Proposal", type: "Video", date: "Dec 2025", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800" }
    ]
  }
]

export const VENDOR_FAQ = [
  {
    question: "How do I book vendors through Visual Africa?",
    answer: "Simply browse our vendor listings, view their profiles, and click 'Get a Quote' to submit your event details.",
  }
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
