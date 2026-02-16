
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
  isSponsored?: boolean
  isNew?: boolean
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
  phone: string
  areaServed: string[]
  yearEstablished: number
  responseTime: string
  portfolio: PortfolioItem[]
}

export const vendors: Vendor[] = [
  // --- EXPERIENCES (Existing) ---
  {
    id: "v1",
    slug: "private-terrace-sunrise-proposal-lekki-view",
    name: "Private Terrace Sunrise Proposal | Lekki View",
    categories: ["Experiences"],
    eventThemes: ["Proposals"],
    description: "Propose at sunrise from a private terrace in Lekki with breathtaking views of the city.",
    shortDescription: "Propose at sunrise from a private terrace in Lekki...",
    price: "From $600",
    rating: 4.9,
    featured: true,
    isSponsored: true,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
    gallery: [{ url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800", alt: "setup" }],
    vendor: { name: "Olu & Co Events", logo: "", slug: "olu-and-co" },
    whatsIncluded: ["Private terrace", "Luxury decor", "Photography"],
    services: ["Event Planning"],
    about: "Specialists in luxury African experiences.",
    stats: { eventsPlanned: "100+", satisfiedClients: "100+", corporateEvents: "45+", yearsExperience: "20+", uniqueLocations: "15+" },
    location: "Lekki Phase 1, Lagos",
    phone: "+234 803 123 4567",
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
    description: "A romantic maritime experience on Lagos waters aboard a luxury catamaran.",
    shortDescription: "Maritime experience on Lagos waters.",
    price: "From $800",
    rating: 4.8,
    featured: true,
    isNew: true,
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    gallery: [{ url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800", alt: "catamaran" }],
    vendor: { name: "Olu & Co Events", logo: "", slug: "olu-and-co" },
    whatsIncluded: ["Catamaran cruise", "Champagne"],
    services: ["Yacht Charters"],
    about: "Luxury sea events.",
    stats: { eventsPlanned: "100+", satisfiedClients: "100+", corporateEvents: "45+", yearsExperience: "20+", uniqueLocations: "15+" },
    location: "Victoria Island, Lagos",
    phone: "+234 802 987 6543",
    areaServed: ["Lagos"],
    yearEstablished: 2019,
    responseTime: "Within 24 hours",
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
    price: "From $650",
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
    phone: "+234 805 000 7777",
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
    price: "From $450",
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
    phone: "+234 908 666 5555",
    areaServed: ["Lagos"],
    yearEstablished: 2019,
    responseTime: "Within 24 hours",
    portfolio: [
      { id: "p6", title: "Beach Sunset Proposal", type: "Video", date: "Dec 2025", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800" }
    ]
  },

  // --- LAGOS VENDORS ---
  {
    id: "v-venue-1",
    slug: "the-monarch-event-center",
    name: "The Monarch Event Center",
    categories: ["Venues"],
    eventThemes: ["Wedding", "Corporate Event", "Social Gathering"],
    description: "A majestic and royal event center located in Lekki, perfect for grand weddings and high-profile corporate events.",
    shortDescription: "A majestic space for your grand celebrations.",
    price: "From $4,500",
    rating: 5.0,
    featured: true,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Monarch Group", logo: "", slug: "monarch" },
    whatsIncluded: ["Grand Hall", "Changing Rooms", "Security", "Parking"],
    services: ["Venue Rental", "Event Support"],
    about: "The Monarch is an architectural masterpiece designed to host royalty.",
    stats: { eventsPlanned: "200+", satisfiedClients: "200+", corporateEvents: "80+", yearsExperience: "6+", uniqueLocations: "1" },
    location: "Lekki, Lagos",
    phone: "+234 809 111 2222",
    areaServed: ["Lagos"],
    yearEstablished: 2019,
    responseTime: "Within 2 hours",
    portfolio: []
  },
  {
    id: "v-catering-1",
    slug: "the-eventful-chef",
    name: "The Eventful Chef",
    categories: ["Catering"],
    eventThemes: ["Wedding", "Corporate Event", "Social Gathering"],
    description: "Premium catering service offering a fusion of local and international cuisines for weddings and corporate galas.",
    shortDescription: "Premium fusion catering for upscale events.",
    price: "From $25/Guest",
    rating: 4.8,
    featured: true,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "The Eventful Chef Ltd", logo: "", slug: "eventful-chef" },
    whatsIncluded: ["Buffet Service", "Plated Service", "Drinks Management"],
    services: ["Catering", "Private Dining"],
    about: "We bring culinary excellence to your special moments.",
    stats: { eventsPlanned: "500+", satisfiedClients: "1000+", corporateEvents: "200+", yearsExperience: "10+", uniqueLocations: "30+" },
    location: "Victoria Island, Lagos",
    phone: "+234 803 555 1234",
    areaServed: ["Lagos"],
    yearEstablished: 2015,
    responseTime: "Within 4 hours",
    portfolio: [
      { id: "p3", title: "Corporate Awards Night", type: "Video", date: "Nov 2025", image: "https://images.unsplash.com/photo-1540575861501-7c00117fc24b?auto=format&fit=crop&q=80&w=800" },
    ]
  },
  {
    id: "v-photo-1",
    slug: "elite-studio-nigeria",
    name: "Elite Studio Nigeria",
    categories: ["Photographers"],
    eventThemes: ["Wedding", "Social Gathering", "Corporate Event"],
    description: "Top-tier photography studio specializing in capturing timeless moments for weddings and events in Lagos.",
    shortDescription: "Capturing timeless moments for weddings and events.",
    price: "From $800",
    rating: 4.9,
    featured: false,
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Elite Studio", logo: "", slug: "elite-studio" },
    whatsIncluded: ["Full Day Coverage", "Photobook", "Edited Soft Copies"],
    services: ["Photography", "Videography"],
    about: "We tell your story through our lens with elegance and style.",
    stats: { eventsPlanned: "300+", satisfiedClients: "500+", corporateEvents: "100+", yearsExperience: "8+", uniqueLocations: "50+" },
    location: "Ikeja, Lagos",
    phone: "+234 802 222 9999",
    areaServed: ["Lagos", "Abuja"],
    yearEstablished: 2016,
    responseTime: "Within 12 hours",
    portfolio: [
      { id: "p4", title: "Luxury Wedding", type: "Gallery", date: "Oct 2025", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" },
    ]
  },
  {
    id: "v-lagos-4",
    slug: "landmark-event-centre",
    name: "Landmark Event Centre",
    categories: ["Venues"],
    eventThemes: ["Corporate Event", "Social Gathering", "Wedding"],
    description: "A premier event facility on the beachfront of the Atlantic Ocean, ideal for exhibitions, conferences, and concerts.",
    shortDescription: "Premier beachfront event facility.",
    price: "From $5,000",
    rating: 4.7,
    featured: true,
    image: "https://images.unsplash.com/photo-1561489411-2092c462ea7a?auto=format&fit=crop&q=80&w=800", // Generic event hall
    gallery: [],
    vendor: { name: "Landmark Africa", logo: "", slug: "landmark" },
    whatsIncluded: ["Main Hall", "Exhibition Space", "Beach Access"],
    services: ["Venue Rental"],
    about: "Where business meets leisure on the Lagos coastline.",
    stats: { eventsPlanned: "1000+", satisfiedClients: "5000+", corporateEvents: "800+", yearsExperience: "12+", uniqueLocations: "1" },
    location: "Victoria Island, Lagos",
    phone: "+234 1 234 5678",
    areaServed: ["Lagos"],
    yearEstablished: 2014,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-lagos-5",
    slug: "civic-centre",
    name: "The Civic Centre",
    categories: ["Venues"],
    eventThemes: ["Corporate Event", "Wedding", "Social Gathering"],
    description: "An iconic venue in Lagos featuring stunning waterfront views and state-of-the-art facilities for all event types.",
    shortDescription: "Iconic waterfront venue in Lagos.",
    price: "From $4,000",
    rating: 4.6,
    featured: false,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", // Modern building
    gallery: [],
    vendor: { name: "Civic Centre", logo: "", slug: "civic-centre" },
    whatsIncluded: ["Banquet Hall", "Meeting Rooms", "Waterfront View"],
    services: ["Venue Rental"],
    about: "A landmark location for prestigious events.",
    stats: { eventsPlanned: "800+", satisfiedClients: "3000+", corporateEvents: "500+", yearsExperience: "15+", uniqueLocations: "1" },
    location: "Victoria Island, Lagos",
    phone: "+234 1 888 9999",
    areaServed: ["Lagos"],
    yearEstablished: 2009,
    responseTime: "Within 24 hours",
    portfolio: []
  },

  // --- ACCRA VENDORS ---
  {
    id: "v-accra-1",
    slug: "kempinski-hotel-gold-coast-city",
    name: "Kempinski Hotel Gold Coast City",
    categories: ["Venues"],
    eventThemes: ["Corporate Event", "Wedding", "Social Gathering"],
    description: "Luxury hotel venue offering world-class ballrooms and impeccable service for high-end events in Accra.",
    shortDescription: "Luxury hotel venue for high-end events.",
    price: "From $5,500",
    rating: 4.9,
    featured: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", // Luxury hotel
    gallery: [],
    vendor: { name: "Kempinski Accra", logo: "", slug: "kempinski-accra" },
    whatsIncluded: ["Ballroom", "Catering", "Accommodation"],
    services: ["Venue Rental", "Catering", "Accommodation"],
    about: "The ultimate address for luxury events in Ghana.",
    stats: { eventsPlanned: "600+", satisfiedClients: "1200+", corporateEvents: "300+", yearsExperience: "10+", uniqueLocations: "1" },
    location: "Accra Central, Accra",
    phone: "+233 30 244 8888",
    areaServed: ["Accra"],
    yearEstablished: 2015,
    responseTime: "Within 12 hours",
    portfolio: []
  },
  {
    id: "v-accra-2",
    slug: "labadi-beach-hotel",
    name: "Labadi Beach Hotel",
    categories: ["Venues"],
    eventThemes: ["Wedding", "Social Gathering", "Corporate Event"],
    description: "Ghana's premier hotel resort, offering elegant event spaces and lush gardens right by the ocean.",
    shortDescription: "Premier hotel resort event spaces by the ocean.",
    price: "From $4,000",
    rating: 4.7,
    featured: false,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800", // Beach resort
    gallery: [],
    vendor: { name: "Labadi Beach Hotel", logo: "", slug: "labadi-beach" },
    whatsIncluded: ["Conference Rooms", "Garden Venue", "Beach Access"],
    services: ["Venue Rental", "Catering"],
    about: "Experience the best of Ghanaian hospitality.",
    stats: { eventsPlanned: "1500+", satisfiedClients: "5000+", corporateEvents: "600+", yearsExperience: "30+", uniqueLocations: "1" },
    location: "Labadi, Accra",
    phone: "+233 30 277 2501",
    areaServed: ["Accra"],
    yearEstablished: 1991,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-accra-3",
    slug: "flair-catering-services",
    name: "Flair Catering Services",
    categories: ["Catering"],
    eventThemes: ["Wedding", "Corporate Event"],
    description: "One of Ghana's most experienced catering companies, known for excellent service and delicious local and international dishes.",
    shortDescription: "Experienced catering with delicious local and international dishes.",
    price: "From $20/Guest",
    rating: 4.8,
    featured: false,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Flair Catering", logo: "", slug: "flair-catering" },
    whatsIncluded: ["Buffet", "Table Service", "Bar Service"],
    services: ["Catering"],
    about: "Decades of culinary excellence.",
    stats: { eventsPlanned: "2000+", satisfiedClients: "10000+", corporateEvents: "800+", yearsExperience: "50+", uniqueLocations: "50+" },
    location: "Ridge, Accra",
    phone: "+233 30 222 2222",
    areaServed: ["Accra"],
    yearEstablished: 1968,
    responseTime: "Within 48 hours",
    portfolio: []
  },
  {
    id: "v-accra-4",
    slug: "grahl-photography",
    name: "Grahl Photography",
    categories: ["Photographers"],
    eventThemes: ["Wedding", "Corporate Event"],
    description: "Professional photography and videography services, capturing the beauty and emotion of Ghanaian weddings and events.",
    shortDescription: "Professional photography capturing beauty and emotion.",
    price: "From $700",
    rating: 4.8,
    featured: true,
    image: "https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&q=80&w=800", // Photographer
    gallery: [],
    vendor: { name: "Grahl Photography", logo: "", slug: "grahl" },
    whatsIncluded: ["Full Coverage", "Aerial/Drone", "Photobook"],
    services: ["Photography", "Videography"],
    about: "We document life's most precious moments.",
    stats: { eventsPlanned: "400+", satisfiedClients: "600+", corporateEvents: "50+", yearsExperience: "10+", uniqueLocations: "20+" },
    location: "Accra",
    phone: "+233 24 444 5555",
    areaServed: ["Ghana"],
    yearEstablished: 2014,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-accra-5",
    slug: "cleaver-house",
    name: "Cleaver House",
    categories: ["Venues"],
    eventThemes: ["Corporate Event", "Social Gathering", "Wedding"],
    description: "A historic venue in Accra offering a unique blend of colonial architecture and modern event facilities.",
    shortDescription: "Historic venue with colonial architecture.",
    price: "From $2,000",
    rating: 4.6,
    featured: false,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800", // Historic building event
    gallery: [],
    vendor: { name: "Cleaver House", logo: "", slug: "cleaver-house" },
    whatsIncluded: ["Event Hall", "Garden", "Parking"],
    services: ["Venue Rental"],
    about: "Timeless elegance for your special events.",
    stats: { eventsPlanned: "300+", satisfiedClients: "500+", corporateEvents: "100+", yearsExperience: "15+", uniqueLocations: "1" },
    location: "Adabraka, Accra",
    phone: "+233 30 222 3333",
    areaServed: ["Accra"],
    yearEstablished: 1900,
    responseTime: "Within 48 hours",
    portfolio: []
  },

  // --- CAPE TOWN VENDORS ---
  {
    id: "v-cpt-1",
    slug: "mount-nelson-hotel",
    name: "Mount Nelson, A Belmond Hotel",
    categories: ["Venues"],
    eventThemes: ["Wedding", "Corporate Event", "Social Gathering"],
    description: "An iconic pink hotel at the foot of Table Mountain, offering lush gardens and ballrooms for legendary celebrations.",
    shortDescription: "Iconic hotel venue at the foot of Table Mountain.",
    price: "From $6,000",
    rating: 5.0,
    featured: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Belmond", logo: "", slug: "belmond" },
    whatsIncluded: ["Ballroom", "Garden", "Catering", "Stay"],
    services: ["Venue Rental", "Catering", "Accommodation"],
    about: "Cape Town's most iconic luxury hotel.",
    stats: { eventsPlanned: "1000+", satisfiedClients: "5000+", corporateEvents: "500+", yearsExperience: "100+", uniqueLocations: "1" },
    location: "Gardens, Cape Town",
    phone: "+27 21 483 1000",
    areaServed: ["Cape Town"],
    yearEstablished: 1899,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-cpt-2",
    slug: "kirstenbosch-botanical-garden",
    name: "Kirstenbosch National Botanical Garden",
    categories: ["Venues"],
    eventThemes: ["Wedding", "Social Gathering"],
    description: "Set against the eastern slopes of Table Mountain, offering acclaimed gardens for outdoor weddings and events.",
    shortDescription: "Acclaimed gardens for outdoor weddings and events.",
    price: "From $1,500",
    rating: 4.8,
    featured: false,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800", // Garden
    gallery: [],
    vendor: { name: "SANBI", logo: "", slug: "sanbi" },
    whatsIncluded: ["Outdoor Venue", "Marquee Site"],
    services: ["Venue Rental"],
    about: "World-renowned botanical garden setting.",
    stats: { eventsPlanned: "500+", satisfiedClients: "5000+", corporateEvents: "100+", yearsExperience: "100+", uniqueLocations: "1" },
    location: "Newlands, Cape Town",
    phone: "+27 21 799 8783",
    areaServed: ["Cape Town"],
    yearEstablished: 1913,
    responseTime: "Within 3 days",
    portfolio: []
  },
  {
    id: "v-cpt-3",
    slug: "table-seven",
    name: "Table Seven",
    categories: ["Catering"],
    eventThemes: ["Wedding", "Social Gathering", "Corporate Event"],
    description: "Exceptional catering focusing on seasonal, sustainable produce to create memorable culinary experiences.",
    shortDescription: "Seasonal, sustainable culinary experiences.",
    price: "From $40/Guest",
    rating: 4.9,
    featured: true,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Table Seven", logo: "", slug: "table-seven" },
    whatsIncluded: ["Custom Menus", "Staffing", "Bar Service"],
    services: ["Catering", "Event Management"],
    about: "Honest food, exceptional service.",
    stats: { eventsPlanned: "200+", satisfiedClients: "500+", corporateEvents: "50+", yearsExperience: "10+", uniqueLocations: "20+" },
    location: "Salt River, Cape Town",
    phone: "+27 21 447 0707",
    areaServed: ["Western Cape"],
    yearEstablished: 2015,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-cpt-4",
    slug: "greg-lumley-photography",
    name: "Greg Lumley Photography",
    categories: ["Photographers"],
    eventThemes: ["Wedding", "Corporate Event"],
    description: "Cape Town based photographer with a talent for capturing the energy and emotion of events.",
    shortDescription: "Capturing the energy and emotion of events.",
    price: "From $1,200",
    rating: 4.8,
    featured: false,
    image: "https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Greg Lumley", logo: "", slug: "greg-lumley" },
    whatsIncluded: ["Wedding Coverage", "Corporate Shoots", "Editing"],
    services: ["Photography"],
    about: "Professional, creative, and experienced.",
    stats: { eventsPlanned: "500+", satisfiedClients: "800+", corporateEvents: "200+", yearsExperience: "20+", uniqueLocations: "100+" },
    location: "Cape Town",
    phone: "+27 83 604 0107",
    areaServed: ["Western Cape"],
    yearEstablished: 2005,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-cpt-5",
    slug: "the-old-biscuit-mill",
    name: "The Old Biscuit Mill",
    categories: ["Venues"],
    eventThemes: ["Social Gathering", "Corporate Event", "Wedding"],
    description: "A vibrant, mixed-use location offering rustic and industrial-chic spaces for creative events.",
    shortDescription: "Rustic and industrial-chic spaces for creative events.",
    price: "From $2,000",
    rating: 4.6,
    featured: false,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800", // Industrial venue
    gallery: [],
    vendor: { name: "Old Biscuit Mill", logo: "", slug: "old-biscuit-mill" },
    whatsIncluded: ["Venue Hire", "Security"],
    services: ["Venue Rental"],
    about: "A hub of creativity and culture in Woodstock.",
    stats: { eventsPlanned: "500+", satisfiedClients: "2000+", corporateEvents: "100+", yearsExperience: "15+", uniqueLocations: "1" },
    location: "Woodstock, Cape Town",
    phone: "+27 21 447 8194",
    areaServed: ["Cape Town"],
    yearEstablished: 2008,
    responseTime: "Within 48 hours",
    portfolio: []
  },

  // --- NAIROBI VENDORS ---
  {
    id: "v-nbo-1",
    slug: "villa-rosa-kempinski-nairobi",
    name: "Villa Rosa Kempinski Nairobi",
    categories: ["Venues"],
    eventThemes: ["Wedding", "Corporate Event"],
    description: "Offering the perfect fusion of European luxury and Kenyan hospitality for grand weddings and conferences.",
    shortDescription: "European luxury meets Kenyan hospitality.",
    price: "From $5,000",
    rating: 4.9,
    featured: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Kempinski Nairobi", logo: "", slug: "kempinski-nairobi" },
    whatsIncluded: ["Ballroom", "Catering", "Accommodation"],
    services: ["Venue Rental", "Catering", "Accommodation"],
    about: "Timeless elegance in the heart of Nairobi.",
    stats: { eventsPlanned: "400+", satisfiedClients: "800+", corporateEvents: "300+", yearsExperience: "10+", uniqueLocations: "1" },
    location: "Westlands, Nairobi",
    phone: "+254 703 049 000",
    areaServed: ["Nairobi"],
    yearEstablished: 2013,
    responseTime: "Within 12 hours",
    portfolio: []
  },
  {
    id: "v-nbo-2",
    slug: "sankara-nairobi",
    name: "Sankara Nairobi",
    categories: ["Venues"],
    eventThemes: ["Corporate Event", "Social Gathering"],
    description: "Contemporary 5-star hotel with versatile infrastructure and personalized service for modern events.",
    shortDescription: "Contemporary 5-star hotel for modern events.",
    price: "From $3,500",
    rating: 4.7,
    featured: false,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Sankara", logo: "", slug: "sankara" },
    whatsIncluded: ["Meeting Rooms", "Rooftop Venue", "Catering"],
    services: ["Venue Rental", "Catering"],
    about: "Modern luxury defined.",
    stats: { eventsPlanned: "600+", satisfiedClients: "2000+", corporateEvents: "500+", yearsExperience: "12+", uniqueLocations: "1" },
    location: "Westlands, Nairobi",
    phone: "+254 20 420 8000",
    areaServed: ["Nairobi"],
    yearEstablished: 2010,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-nbo-3",
    slug: "away-home-events",
    name: "Away Home Events and Catering",
    categories: ["Catering", "Event Planners"],
    eventThemes: ["Wedding", "Social Gathering", "Corporate Event"],
    description: "Leading event planning and catering company, offering luxury decor and tent solutions.",
    shortDescription: "Leading event planning and catering services.",
    price: "From $20/Guest",
    rating: 4.8,
    featured: false,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Away Home", logo: "", slug: "away-home" },
    whatsIncluded: ["Catering", "Tents & Decor", "Planning"],
    services: ["Catering", "Event Planning"],
    about: "Making you feel at home at your own event.",
    stats: { eventsPlanned: "300+", satisfiedClients: "1000+", corporateEvents: "100+", yearsExperience: "10+", uniqueLocations: "50+" },
    location: "Nairobi",
    phone: "+254 722 123 456",
    areaServed: ["Kenya"],
    yearEstablished: 2014,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-nbo-4",
    slug: "eclat-flash-media",
    name: "Eclat Flash Media",
    categories: ["Photographers"],
    eventThemes: ["Corporate Event", "Wedding"],
    description: "Premier provider of corporate event photography, specializing in high-quality imagery to enhance brand visibility.",
    shortDescription: "Premier corporate event photography.",
    price: "From $500",
    rating: 4.6,
    featured: false,
    image: "https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    vendor: { name: "Eclat Flash", logo: "", slug: "eclat-flash" },
    whatsIncluded: ["Event Photography", "Fast Turnaround"],
    services: ["Photography"],
    about: "Professional imagery for professional brands.",
    stats: { eventsPlanned: "200+", satisfiedClients: "400+", corporateEvents: "150+", yearsExperience: "7+", uniqueLocations: "30+" },
    location: "Nairobi",
    phone: "+254 700 000 000",
    areaServed: ["Kenya"],
    yearEstablished: 2017,
    responseTime: "Within 24 hours",
    portfolio: []
  },
  {
    id: "v-nbo-5",
    slug: "carnivore-grounds",
    name: "The Carnivore Grounds",
    categories: ["Venues", "Catering"],
    eventThemes: ["Social Gathering", "Corporate Event"],
    description: "Famous for its 'Beast of a Feast' experience and massive grounds suitable for concerts and large festivals.",
    shortDescription: "Famous grounds for concerts and feasts.",
    price: "From $1,000",
    rating: 4.7,
    featured: false,
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800", // Outdoor festival
    gallery: [],
    vendor: { name: "Tamarind Group", logo: "", slug: "tamarind" },
    whatsIncluded: ["Grounds Access", "Catering Options"],
    services: ["Venue Rental", "Catering"],
    about: "Africa's greatest eating experience.",
    stats: { eventsPlanned: "2000+", satisfiedClients: "10000+", corporateEvents: "500+", yearsExperience: "40+", uniqueLocations: "1" },
    location: "Langata, Nairobi",
    phone: "+254 20 600 5933",
    areaServed: ["Nairobi"],
    yearEstablished: 1980,
    responseTime: "Within 48 hours",
    portfolio: []
  }
]

export const VENDOR_FAQ = [
  {
    question: "How do I book vendors through Waddi?",
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
