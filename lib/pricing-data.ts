export interface PricingFeature {
  title: string
  description: string
}

export interface PricingTier {
  name: string
  tagline: string
  price: string
  priceNote: string | null
  cta: string
  ctaHref: string
  highlighted: boolean
  inheritsFrom: string | null
  features: PricingFeature[]
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    tagline: "For teams doing 1-2 events per year.",
    price: "Free",
    priceNote: null,
    cta: "Create account now",
    ctaHref: "/auth/login",
    highlighted: false,
    inheritsFrom: null,
    features: [
      {
        title: "Customizable tasklist",
        description:
          "Start with a Visual Africa template and make it your own with event-specific customizable tasklists.",
      },
      {
        title: "Vendor Marketplace",
        description:
          "Access to 500+ vetted vendors in Lagos, including savings up to 40% with Visual Africa pre-negotiated rates.",
      },
      {
        title: "AI search",
        description:
          "AI assistant helps find the perfect venue, activities & catering, plus builds the itinerary for you.",
      },
      {
        title: "Sending RFPs",
        description:
          "Book vendors easily with automated RFPs and negotiations in one place.",
      },
      {
        title: "AI proposal negotiation",
        description:
          "After receiving a proposal, use our AI tool to negotiate to get the best rate and terms.",
      },
      {
        title: "Messaging with vendors",
        description:
          "Message directly with vendors to ask specific questions, negotiate on price, and more.",
      },
      {
        title: "Booking Vendors",
        description:
          "Book your vendors directly through the Visual Africa platform to keep everything in one place.",
      },
      {
        title: "Guest website",
        description:
          "Create a custom guest website in one click.",
      },
      {
        title: "RSVPs",
        description:
          "Personalized RSVPs that remember your guests' preferences.",
      },
    ],
  },
  {
    name: "Pro",
    tagline: "For teams doing 3+ events per year.",
    price: "$100",
    priceNote: "per month / Billed annually",
    cta: "Book a Call",
    ctaHref: "/contact",
    highlighted: true,
    inheritsFrom: "Free",
    features: [
      {
        title: "Dedicated CSM",
        description:
          "Get a dedicated Customer Success Manager to help you get maximum value from Visual Africa.",
      },
      {
        title: "Company policies",
        description:
          "Build & customize your event policy, by specifying per-person event budget, guest policy, location requirements, and more.",
      },
      {
        title: "Approval flows",
        description:
          "Curate an account-wide list of preferred vendors to simplify the vendor picking process for your planners.",
      },
      {
        title: "Custom insights",
        description:
          "See stats for total events, monthly events, guest count, budget, top venues, RFPs sent, active users, and more.",
      },
      {
        title: "Content templates",
        description:
          "Create custom templates for icebreakers, meetings, workshops, games etc for all of your events to have access to.",
      },
    ],
  },
  {
    name: "Concierge",
    tagline: "High-touch coordination for international clients.",
    price: "$2,500",
    priceNote: "Starting per event / Full service",
    cta: "Book a Call",
    ctaHref: "/contact",
    highlighted: false,
    inheritsFrom: "Pro",
    features: [
      {
        title: "Dedicated Event Director",
        description:
          "Full orchestration of your event with a senior director on the ground in Lagos.",
      },
      {
        title: "Vendor Vetting & Selection",
        description:
          "We narrow down the best vendors to 3 options per category and handle all site visits.",
      },
      {
        title: "Secure Escrow Management",
        description:
          "Manage all local payments through our secure escrow system with full transparency.",
      },
      {
        title: "Guest Concierge",
        description:
          "Dedicated support for your guests, from hotel bookings to airport pickups in Lagos.",
      },
      {
        title: "On-site Orchestration",
        description:
          "Day-of coordination team ensuring every detail is executed flawlessly according to your plan.",
      },
    ],
  },
]
