export interface OfferingFeature {
  title: string
  description: string
}

export interface OfferingFaq {
  question: string
  answer: string
}

export interface Offering {
  slug: string
  title: string
  tagline: string
  description: string
  image: string
  features: OfferingFeature[]
  whyChooseUs: string[]
  process: { step: string; detail: string }[]
  faq: OfferingFaq[]
}

export const offerings: Offering[] = [
  {
    slug: "offsites-retreats",
    title: "Offsites & Retreats",
    tagline: "Team bonding experiences that inspire and energize",
    description:
      "Plan unforgettable offsite retreats that bring your team together. From luxury resort getaways to immersive team-building programs, we handle every detail so your team can focus on connecting and creating.",
    image: "/images/offerings/offsites-retreats.jpg",
    features: [
      {
        title: "Venue Sourcing",
        description:
          "Access our curated network of retreat venues across Lagos and beyond, from beachfront resorts to countryside estates.",
      },
      {
        title: "Activity Coordination",
        description:
          "Custom team-building activities, workshops, and excursions designed to foster collaboration and creativity.",
      },
      {
        title: "Logistics Management",
        description:
          "End-to-end transportation, accommodation, and meal planning for seamless retreat execution.",
      },
      {
        title: "Budget Optimization",
        description:
          "Leverage our vendor relationships for pre-negotiated rates, saving you up to 40% on retreat costs.",
      },
    ],
    whyChooseUs: [
      "Curated network of 50+ retreat venues in Nigeria and West Africa",
      "Dedicated retreat coordinator from planning to execution",
      "Custom activity programs tailored to your team goals",
      "All-inclusive package options for stress-free budgeting",
      "Post-event feedback and reporting",
    ],
    process: [
      { step: "Discovery Call", detail: "We learn about your team, goals, and preferences." },
      { step: "Venue Shortlist", detail: "We present 3-5 curated venue options for your review." },
      { step: "Proposal & Planning", detail: "Full itinerary, activity plan, and budget breakdown." },
      { step: "Execution", detail: "On-site coordination ensuring everything runs perfectly." },
    ],
    faq: [
      {
        question: "How far in advance should we book an offsite retreat?",
        answer:
          "We recommend booking at least 6-8 weeks in advance for the best venue availability and pricing. However, we also offer expedited planning for tighter timelines.",
      },
      {
        question: "Can you organize retreats outside Lagos?",
        answer:
          "Yes, we organize retreats across Nigeria, Ghana, and other West African destinations. Our network spans beach resorts, safari lodges, and countryside estates.",
      },
      {
        question: "What is the typical group size for retreats?",
        answer:
          "We handle retreats from 10 to 500+ people. Our planning approach scales to match your group size and budget.",
      },
    ],
  },
  {
    slug: "client-events",
    title: "Client Events",
    tagline: "Impress your clients with unforgettable experiences",
    description:
      "Create lasting impressions with premium client entertainment events. From intimate dinners to large-scale appreciation galas, we design experiences that strengthen business relationships and elevate your brand.",
    image: "/images/offerings/client-events.jpg",
    features: [
      {
        title: "Branded Experiences",
        description:
          "Seamlessly integrate your brand identity into every detail, from invitations to venue decor.",
      },
      {
        title: "Premium Catering",
        description:
          "Access to Lagos's finest caterers and private chefs for bespoke dining experiences.",
      },
      {
        title: "Entertainment Curation",
        description:
          "Live bands, DJs, cultural performances, and interactive entertainment tailored to your audience.",
      },
      {
        title: "Guest Management",
        description:
          "Digital RSVPs, seating arrangements, and VIP coordination for a flawless guest experience.",
      },
    ],
    whyChooseUs: [
      "Experience hosting client events for top Nigerian corporations",
      "Discreet, professional service that reflects your brand values",
      "Access to exclusive venues and entertainment acts",
      "Complete guest management from invite to follow-up",
      "Detailed post-event analytics and ROI reporting",
    ],
    process: [
      { step: "Brand Alignment", detail: "We understand your brand, clients, and event objectives." },
      { step: "Creative Concept", detail: "Themed concept and mood board for your approval." },
      { step: "Full Production", detail: "Venue setup, catering, entertainment, and tech coordination." },
      { step: "Flawless Execution", detail: "On-the-day management with a dedicated event team." },
    ],
    faq: [
      {
        question: "Can you handle events for international clients visiting Lagos?",
        answer:
          "Absolutely. We specialize in hosting international delegations and can coordinate airport transfers, hotel accommodations, and cultural experiences alongside your event.",
      },
      {
        question: "What types of client events do you organize?",
        answer:
          "We handle everything from intimate dinners for 10 to gala events for 1,000+, including product launches, appreciation dinners, networking events, and branded experiences.",
      },
    ],
  },
  {
    slug: "skos",
    title: "SKOs",
    tagline: "Sales kickoffs that drive performance and alignment",
    description:
      "Energize your sales team with expertly produced Sales Kickoff events. We combine motivational content, team-building, and strategic sessions in unforgettable settings that set the tone for a successful year.",
    image: "/images/offerings/skos.jpg",
    features: [
      {
        title: "Venue & AV Production",
        description:
          "Conference halls with professional staging, sound, lighting, and live streaming capabilities.",
      },
      {
        title: "Content & Agenda Support",
        description:
          "Help structuring your SKO agenda for maximum engagement, including breakout sessions and workshops.",
      },
      {
        title: "Team Activities",
        description:
          "Competitive team challenges, awards ceremonies, and networking events that build camaraderie.",
      },
      {
        title: "Swag & Branding",
        description:
          "Custom branded merchandise, welcome kits, and event collateral that energize your team.",
      },
    ],
    whyChooseUs: [
      "Proven track record of successful SKOs for leading companies",
      "Full AV production with experienced technicians",
      "Custom agenda design to maximize engagement",
      "Branded swag and merchandise coordination",
      "Hybrid event capabilities for remote participants",
    ],
    process: [
      { step: "Strategic Brief", detail: "Understand sales goals, themes, and key messages." },
      { step: "Venue & Production", detail: "Secure venue and plan full AV, staging, and tech." },
      { step: "Content Coordination", detail: "Agenda flow, speaker coordination, and breakout sessions." },
      { step: "Event Day", detail: "Full production team on-site ensuring flawless delivery." },
    ],
    faq: [
      {
        question: "Can you support hybrid SKOs with remote attendees?",
        answer:
          "Yes, we provide full hybrid event support including live streaming, virtual breakout rooms, and remote audience engagement tools.",
      },
      {
        question: "How many attendees can you accommodate for an SKO?",
        answer:
          "We have organized SKOs from 50 to 2,000+ attendees. Our venue network and production capabilities scale to any size.",
      },
    ],
  },
  {
    slug: "conferences",
    title: "Conferences",
    tagline: "World-class conferences, expertly delivered",
    description:
      "From industry summits to multi-day conferences, we deliver polished, professional events that position your organization as a thought leader. Full production, speaker management, and attendee engagement -- all handled.",
    image: "/images/offerings/conferences.jpg",
    features: [
      {
        title: "Full Event Production",
        description:
          "Stage design, AV engineering, lighting, and live streaming for broadcast-quality events.",
      },
      {
        title: "Speaker Management",
        description:
          "Speaker outreach, travel coordination, green room management, and schedule coordination.",
      },
      {
        title: "Registration & Check-in",
        description:
          "Digital registration, QR code check-in, badge printing, and attendee tracking.",
      },
      {
        title: "Sponsorship Packages",
        description:
          "Design and sell sponsorship tiers with branded activations, booth spaces, and digital visibility.",
      },
    ],
    whyChooseUs: [
      "Managed conferences with 100 to 5,000+ attendees",
      "Partnerships with top conference venues across Lagos",
      "End-to-end speaker and sponsor management",
      "Professional registration and check-in systems",
      "Post-event content packaging and distribution",
    ],
    process: [
      { step: "Vision & Scope", detail: "Define conference theme, audience, and objectives." },
      { step: "Production Planning", detail: "Venue, speakers, sponsors, and full tech plan." },
      { step: "Marketing Support", detail: "Event website, registration, and promotional collateral." },
      { step: "Live Production", detail: "On-site team managing every aspect of the conference." },
    ],
    faq: [
      {
        question: "Do you help with marketing and ticket sales for conferences?",
        answer:
          "Yes, we can support with event websites, email campaigns, social media promotion, and ticketing platform integration.",
      },
      {
        question: "Can you manage multi-day conferences?",
        answer:
          "Absolutely. We specialize in multi-day events with complex agendas, multiple tracks, and rotating speaker schedules.",
      },
    ],
  },
  {
    slug: "incentive-trips",
    title: "Incentive Trips",
    tagline: "Reward excellence with extraordinary experiences",
    description:
      "Design incentive travel programs that truly motivate. From luxury beach getaways to adventure safaris, we create reward experiences that your top performers will never forget.",
    image: "/images/offerings/incentive-trips.jpg",
    features: [
      {
        title: "Destination Curation",
        description:
          "Handpicked destinations across Africa with unique cultural and adventure experiences.",
      },
      {
        title: "Luxury Accommodations",
        description:
          "Premium hotels, boutique lodges, and exclusive villas with negotiated group rates.",
      },
      {
        title: "Curated Experiences",
        description:
          "Private tours, gourmet dining, adventure activities, and cultural immersion programs.",
      },
      {
        title: "Travel Logistics",
        description:
          "Flights, ground transportation, visa support, and 24/7 concierge during the trip.",
      },
    ],
    whyChooseUs: [
      "Relationships with premium properties across 10+ African destinations",
      "Custom itineraries that balance relaxation with adventure",
      "Group rates that maximize your incentive budget",
      "24/7 on-trip concierge and support",
      "Branded welcome kits and trip memorabilia",
    ],
    process: [
      { step: "Program Design", detail: "Define eligibility criteria, budget, and destination preferences." },
      { step: "Destination Proposal", detail: "Present curated destination and itinerary options." },
      { step: "Booking & Logistics", detail: "Handle all reservations, flights, and ground transport." },
      { step: "Trip Execution", detail: "On-ground team ensuring a seamless, memorable experience." },
    ],
    faq: [
      {
        question: "What destinations are available for incentive trips?",
        answer:
          "We organize trips across Nigeria, Ghana, Kenya, Tanzania, South Africa, Morocco, and other African destinations. We can also arrange international trips upon request.",
      },
      {
        question: "What is the minimum group size for an incentive trip?",
        answer:
          "We can design trips for groups as small as 10 or as large as 500+. The experience is customized based on group size and budget.",
      },
    ],
  },
  {
    slug: "expedited-planning",
    title: "Expedited Planning",
    tagline: "Last-minute events, zero compromises",
    description:
      "Need an event planned fast? Our expedited planning service delivers quality events on tight timelines. With priority access to vendors and a dedicated rapid-response team, we make the impossible possible.",
    image: "/images/offerings/expedited-planning.jpg",
    features: [
      {
        title: "Rapid Vendor Matching",
        description:
          "Priority access to our vendor network with confirmed availability within 24 hours.",
      },
      {
        title: "Dedicated Rush Team",
        description:
          "A specialized team focused entirely on your event with accelerated planning workflows.",
      },
      {
        title: "Pre-built Templates",
        description:
          "Start from proven event templates and customize, dramatically reducing planning time.",
      },
      {
        title: "Real-time Coordination",
        description:
          "Live project dashboard with instant updates, approvals, and vendor communication.",
      },
    ],
    whyChooseUs: [
      "Events planned and executed in as little as 48 hours",
      "Priority vendor access with guaranteed availability",
      "No quality compromise despite tight timelines",
      "Dedicated project manager available around the clock",
      "Transparent pricing with no rush surcharges on vendor rates",
    ],
    process: [
      { step: "Urgent Brief", detail: "Quick intake call to understand your needs and timeline." },
      { step: "Rapid Sourcing", detail: "Vendor matching and venue confirmation within 24 hours." },
      { step: "Express Planning", detail: "Condensed planning phase with daily check-ins." },
      { step: "Swift Execution", detail: "Full team deployment for flawless event delivery." },
    ],
    faq: [
      {
        question: "How quickly can you plan an event?",
        answer:
          "We have planned and executed events in as little as 48 hours. However, the more time we have, the more options we can explore. Even a week gives us significant flexibility.",
      },
      {
        question: "Is there a premium charge for expedited planning?",
        answer:
          "Our planning fee has a small premium for expedited timelines, but we never mark up vendor rates. You often still save money through our pre-negotiated vendor pricing.",
      },
    ],
  },
  {
    slug: "full-service-planning",
    title: "Full Service Planning",
    tagline: "Sit back while we bring your vision to life",
    description:
      "Our comprehensive full-service planning takes care of everything from initial concept to post-event wrap-up. Your dedicated event planner manages every vendor, every timeline, and every detail so you can enjoy the event stress-free.",
    image: "/images/offerings/full-service-planning.jpg",
    features: [
      {
        title: "Dedicated Event Planner",
        description:
          "A senior planner assigned exclusively to your event, available for calls, meetings, and site visits.",
      },
      {
        title: "Vendor Sourcing & Management",
        description:
          "We source, vet, negotiate with, and manage all vendors on your behalf.",
      },
      {
        title: "Budget & Timeline Tracking",
        description:
          "Real-time budget tracking, payment scheduling, and milestone management.",
      },
      {
        title: "Day-of Coordination",
        description:
          "Full event team on-site managing setup, vendor arrivals, guest flow, and breakdown.",
      },
    ],
    whyChooseUs: [
      "End-to-end planning from concept to post-event reporting",
      "Dedicated senior event planner for your event",
      "Access to 1,000+ vetted vendors across all categories",
      "Average 35% savings through pre-negotiated vendor rates",
      "Unlimited revisions until you are completely satisfied",
    ],
    process: [
      { step: "Vision Meeting", detail: "Deep dive into your event vision, goals, and style." },
      { step: "Creative Proposal", detail: "Full concept, mood board, vendor recommendations, and budget." },
      { step: "Production Phase", detail: "Vendor booking, contract management, and detailed logistics." },
      { step: "Event Day & Beyond", detail: "Full on-site team, real-time management, and post-event wrap-up." },
    ],
    faq: [
      {
        question: "What is included in full-service planning?",
        answer:
          "Everything. From initial concept and vendor sourcing to budget management, timeline tracking, day-of coordination, and post-event wrap-up. You truly just show up and enjoy.",
      },
      {
        question: "How much does full-service planning cost?",
        answer:
          "Our fees are based on event complexity and size. We offer transparent pricing during the proposal phase. The savings we negotiate with vendors often offset our planning fee.",
      },
      {
        question: "Can I be involved in the planning decisions?",
        answer:
          "Absolutely. You have full approval authority at every stage. We handle the work, but every key decision is yours to make.",
      },
    ],
  },
]

export function getOfferingBySlug(slug: string): Offering | undefined {
  return offerings.find((o) => o.slug === slug)
}

export const OFFERING_SLUGS = offerings.map((o) => o.slug)
