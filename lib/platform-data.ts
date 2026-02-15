import {
    Search,
    CalendarCheck,
    Activity,
    CreditCard,
    ShieldCheck,
    Zap,
    Globe,
    Users,
    LayoutDashboard,
    FileText,
    MessageSquare
} from "lucide-react"

export interface PlatformFeature {
    title: string
    description: string
    slug: string
    href: string
    heroTitle: string
    heroSubtitle: string
    heroImage: string
    features: {
        title: string
        description: string
        icon: any
    }[]
    benefits: string[]
    ctaText: string
}

export const platformFeatures: PlatformFeature[] = [
    {
        title: "Discover",
        description: "Browse vetted vendors and proven event templates. Find what works, duplicate the playbook.",
        slug: "discover",
        href: "/platform/discover",
        heroTitle: "Find the Perfect Team for Your Event",
        heroSubtitle: "Access a curated marketplace of top-tier vendors and proven event templates. Stop guessing, start planning with confidence.",
        heroImage: "/images/discover-hero.jpg",
        features: [
            {
                title: "Vetted Vendor Marketplace",
                description: "Every vendor is screen for quality, reliability, and professionalism. Browse portfolios, reviews, and pricing upfront.",
                icon: Search
            },
            {
                title: "Event Templates",
                description: "Don't start from scratch. Clone successful event itineraries, budgets, and vendor teams from similar events.",
                icon: FileText
            },
            {
                title: "Global Search",
                description: "Filter by location, service type, price range, and availability to find exactly what you need, wherever you are.",
                icon: Globe
            }
        ],
        benefits: [
            "Save 20+ hours on vendor research",
            "Access transparent pricing details",
            "Clone successful event blueprints",
            "Verified reviews from real clients"
        ],
        ctaText: "Start Exploring"
    },
    {
        title: "Book",
        description: "Coordinate multiple vendors in one flow. Everyone works off the same timeline, budget, and brief.",
        slug: "book",
        href: "/platform/book",
        heroTitle: "Streamline Your Booking Process",
        heroSubtitle: "Book multiple vendors in a single checkout flow. Automatically sync contracts, timelines, and deliverables.",
        heroImage: "/images/book-hero.jpg",
        features: [
            {
                title: "Unified Checkout",
                description: "Secure multiple vendors with a single deposit. No more chasing individual bank transfers and receipts.",
                icon: CreditCard
            },
            {
                title: "Smart Contracts",
                description: "Standardized digital contracts that protect both you and the vendor. e-Sign everything in one click.",
                icon: ShieldCheck
            },
            {
                title: "Availability Sync",
                description: "Real-time calendar checking prevents double bookings and scheduling conflicts before they happen.",
                icon: CalendarCheck
            }
        ],
        benefits: [
            "One contract, multiple vendors",
            "Instant booking confirmation",
            "Automated deposit handling",
            "Standardized service agreements"
        ],
        ctaText: "Start Booking"
    },
    {
        title: "Track",
        description: "Real-time updates from every vendor. Know what's confirmed, what's pending, what needs attention.",
        slug: "track",
        href: "/platform/track",
        heroTitle: "Complete Visibility, Zero Stress",
        heroSubtitle: "Monitor every deliverable, deadline, and payment in real-time. Keep your entire event team aligned.",
        heroImage: "/images/track-hero.jpg",
        features: [
            {
                title: "Live Dashboard",
                description: "A centralized command center for your event. See status updates, pending tasks, and budget usage at a glance.",
                icon: LayoutDashboard
            },
            {
                title: "Milestone Tracking",
                description: "Track progress against key milestones. Get notified automatically when vendors complete tasks or miss deadlines.",
                icon: Activity
            },
            {
                title: "Team Collaboration",
                description: "Chat directly with vendors, share files, and manage feedback loops all within the platform.",
                icon: MessageSquare
            }
        ],
        benefits: [
            "Real-time status tracking",
            "Automated deadline reminders",
            "Centralized communication channel",
            "Visual progress indicators"
        ],
        ctaText: "Get Dashboard Access"
    },
    {
        title: "Pay",
        description: "Secure escrow payments. Vendors get paid when deliverables hit. You stay protected across borders.",
        slug: "pay",
        href: "/platform/pay",
        heroTitle: "Secure Payments, Global Protection",
        heroSubtitle: "Your funds are held in escrow and only released when milestones are met. Pay in your currency, they receive in theirs.",
        heroImage: "/images/pay-hero.jpg",
        features: [
            {
                title: "Escrow Protection",
                description: "Funds are held securely and only released to vendors upon your approval of completed work.",
                icon: ShieldCheck
            },
            {
                title: "Multi-Currency Support",
                description: "Pay in USD, GBP, or EUR. Vendors receive payments in their local currency automatically.",
                icon: Globe
            },
            {
                title: "Automated Invoicing",
                description: "Generate and organize all your event invoices and receipts in one compliant financial record.",
                icon: FileText
            }
        ],
        benefits: [
            "100% payment security",
            "No international transaction headaches",
            "Milestone-based releases",
            "Automated financial reporting"
        ],
        ctaText: "Secure Your Funds"
    },
]
