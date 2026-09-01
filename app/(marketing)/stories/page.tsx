import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Users, Heart } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Success Stories | Waddi - Real Events, Real Results",
    description: "Read how hosts in Lagos used Waddi to plan events with local vendors.",
}

export default function StoriesPage() {
    const stories = [
        {
            id: "chidi-amaka-wedding",
            title: "Chidi & Amaka's Dream Wedding",
            category: "Wedding",
            image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
            excerpt: "How a couple planning from abroad created their perfect Nigerian royalty-themed wedding with 250 guests.",
            location: "Lekki Phase 1, Lagos",
            guestCount: 250,
            date: "December 2025",
            highlight: "Coordinated 12 vendors for an outdoor celebration"
        },
        {
            id: "tech-conference-2025",
            title: "Tech Conference 2025 Success",
            category: "Corporate Event",
            image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b175a?auto=format&fit=crop&q=80",
            excerpt: "A startup scaled their annual tech conference from 100 to 500 attendees with Waddi's platform.",
            location: "Lagos, Nigeria",
            guestCount: 500,
            date: "May 2025",
            highlight: "Discovered and booked perfect venue and catering within 2 weeks"
        },
        {
            id: "bello-ibrahim-wedding",
            title: "The Bello & Ibrahim Grand Celebration",
            category: "Traditional Wedding",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
            excerpt: "A traditional and white wedding that brought together 400 guests in classic elegance.",
            location: "Civic Centre, VI",
            guestCount: 400,
            date: "June 2026",
            highlight: "Achieved 4.9/5 guest satisfaction with full vendor coordination"
        },
        {
            id: "corporate-retreat",
            title: "Tech Startup's Offsite Retreat",
            category: "Corporate Event",
            image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800",
            excerpt: "A growing startup used Waddi to plan a team retreat for its staff.",
            location: "Ikeja, Lagos",
            guestCount: 75,
            date: "March 2025",
            highlight: "Found unique venue with team-building activities included"
        },
        {
            id: "birthday-celebration",
            title: "Milestone 50th Birthday Bash",
            category: "Social Gathering",
            image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
            excerpt: "How a family planned a milestone celebration with local vendors.",
            location: "Victoria Island, Lagos",
            guestCount: 150,
            date: "August 2025",
            highlight: "Personalized decor and entertainment exceeded all expectations"
        },
        {
            id: "product-launch",
            title: "Luxury Product Launch Event",
            category: "Corporate Event",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
            excerpt: "A fashion brand launched its new collection at an event for VIP guests.",
            location: "Lekki, Lagos",
            guestCount: 200,
            date: "October 2025",
            highlight: "Premium photography and videography captured every moment"
        }
    ]

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary to-accent px-4 py-24 lg:px-8 text-center">
                    <div className="mx-auto max-w-4xl">
                        <h1 className="font-serif text-5xl font-bold text-white md:text-7xl text-balance">
                            Events people planned with Waddi.
                        </h1>
                        <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-xl">
                            See how hosts in Lagos planned weddings, conferences, and celebrations with local vendors.
                        </p>
                    </div>
                </section>

                {/* Stories Grid */}
                <section className="bg-background px-4 py-20 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
                                Stories from hosts
                            </h2>
                            <h3 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                                What hosts planned
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stories.map((story) => (
                                <div
                                    key={story.id}
                                    className="bg-card rounded-3xl overflow-hidden border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                                >
                                    {/* Story Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={story.image}
                                            alt={story.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-full text-white shadow-sm">
                                                {story.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Story Content */}
                                    <div className="p-6">
                                        <h4 className="font-serif text-2xl font-bold text-foreground mb-3 line-clamp-2">
                                            {story.title}
                                        </h4>
                                        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                                            {story.excerpt}
                                        </p>

                                        {/* Event Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin size={14} className="text-primary" />
                                                {story.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Users size={14} className="text-primary" />
                                                {story.guestCount} guests
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar size={14} className="text-primary" />
                                                {story.date}
                                            </div>
                                        </div>

                                        {/* Highlight */}
                                        <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                                            <p className="text-sm font-medium text-foreground flex items-start gap-2">
                                                <Heart size={16} className="text-primary flex-shrink-0 mt-0.5" />
                                                <span>{story.highlight}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-secondary/50 px-4 py-24 lg:px-8 text-center">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Planning an event of your own?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Start with the event you need to organise.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-primary text-foreground hover:bg-primary/90">
                                <Link href="/auth/login">Start Planning</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/explore/vendors">Browse Vendors</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
