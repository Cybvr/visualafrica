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
    name: "Starter",
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
    name: "Enterprise",
    tagline: "For teams doing 3+ events per year.",
    price: "NGN 150,000",
    priceNote: "per month / Annual subscription",
    cta: "Book a Call",
    ctaHref: "/contact",
    highlighted: true,
    inheritsFrom: "Starter",
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
    name: "Full Service",
    tagline: "We plan and run your event end-to-end.",
    price: "NGN 20,000",
    priceNote: "per person / As low as",
    cta: "Book a Call",
    ctaHref: "/contact",
    highlighted: false,
    inheritsFrom: "Enterprise",
    features: [
      {
        title: "Rate Negotiations",
        description:
          "Our dedicated sourcing team negotiates the best rates with venues and vendors on your behalf.",
      },
      {
        title: "Timeline & deadline tracking",
        description:
          "Keep every milestone, cutoff, and deliverable on track with built-in timeline and deadline management.",
      },
      {
        title: "Itinerary crafting",
        description:
          "We design detailed itineraries that organize every activity, meeting, and experience in one place.",
      },
      {
        title: "Budget management",
        description:
          "Track spend in real time, manage approvals, and stay on budget across every event.",
      },
      {
        title: "Venue & vendor management",
        description:
          "Manage venue contracts, room blocks, and all vendors from a single dashboard.",
      },
      {
        title: "Transportation needs",
        description:
          "Coordinate shuttles, flights, and on-site transportation to move your group smoothly.",
      },
      {
        title: "Swag distribution",
        description:
          "Collect sizes, manage shipping, and distribute swag to attendees before, during, or after your event.",
      },
    ],
  },
]
