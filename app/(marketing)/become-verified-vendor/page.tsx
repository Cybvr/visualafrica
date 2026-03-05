import Link from "next/link"
import {
    ShieldCheck,
    CheckCircle2,
    Clock,
    Star,
    ArrowRight,
    FileCheck,
    Award,
    Zap,
    TrendingUp,
    Upload,
    ClipboardCheck,
    BadgeCheck,
} from "lucide-react"
import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Become a Verified Vendor | Waddi",
    description:
        "Apply for Waddi's Verified Vendor badge. Build trust with diaspora clients, rank higher in search results, and win 3× more bookings.",
}

const perks = [
    {
        icon: Star,
        title: "Priority Placement",
        description:
            "Verified vendors appear at the top of search results and AI-matched recommendations — giving you first access to every relevant client brief.",
    },
    {
        icon: TrendingUp,
        title: "3× More Bookings",
        description:
            "Data shows verified vendors receive three times as many confirmed bookings as non-verified vendors on the same platform.",
    },
    {
        icon: ShieldCheck,
        title: "Trust Badge",
        description:
            "Display the Waddi Verified shield on your profile, proposals, and any shared links. Clients book with confidence when they see it.",
    },
    {
        icon: Award,
        title: "Premium Profile Treatment",
        description:
            "Verified profiles receive enhanced formatting, featured gallery placements, and are showcased in our 'Handpicked Vendors' section.",
    },
    {
        icon: Zap,
        title: "Faster Response Priority",
        description:
            "When clients post urgent briefs, verified vendors receive notifications first — giving you a competitive head start on every hot lead.",
    },
    {
        icon: FileCheck,
        title: "Verified Proposals",
        description:
            "Your proposals carry a 'Verified' stamp, making them stand out from competitors and increasing client conversion rates significantly.",
    },
]

const requirementGroups = [
    {
        title: "Business Credentials",
        items: [
            "Valid CAC registration or business license",
            "Professional bank account in your business name",
            "Proof of physical operating location",
        ],
    },
    {
        title: "Portfolio & Track Record",
        items: [
            "Minimum 5 completed events (documented with photos/video)",
            "At least 3 client references we can contact",
            "A polished portfolio or showreel",
        ],
    },
    {
        title: "Quality Standards",
        items: [
            "Pass our virtual quality interview",
            "Agree to Waddi's vendor code of conduct",
            "Response rate above 90% within 24 hours",
        ],
    },
]

const applicationSteps = [
    {
        icon: Upload,
        step: "01",
        title: "Submit Application",
        description:
            "Complete the online application form with your business details, portfolio links, and references. Takes around 15 minutes.",
    },
    {
        icon: ClipboardCheck,
        step: "02",
        title: "Document Review",
        description:
            "Our vetting team reviews your submission within 3–5 business days. We may reach out to your references or request additional materials.",
    },
    {
        icon: Clock,
        step: "03",
        title: "Quality Interview",
        description:
            "A 30-minute video call with our vendor success team to assess your professionalism, communication style, and service standards.",
    },
    {
        icon: BadgeCheck,
        step: "04",
        title: "Go Verified",
        description:
            "Once approved, your badge goes live immediately. Your profile is promoted and your first leads arrive within 48 hours.",
    },
]

const faqs = [
    {
        q: "How long does the verification process take?",
        a: "From submission to decision, the full process typically takes 7–10 business days. Urgent applications may be fast-tracked for a small processing fee.",
    },
    {
        q: "Is there a cost to become verified?",
        a: "The application is free. Once approved, Verified Vendors remain on our enhanced tier as part of our standard commission model — no additional monthly fees.",
    },
    {
        q: "Can my application be declined?",
        a: "Yes. We maintain strict standards to protect client trust. If declined, you'll receive detailed feedback and can reapply after 60 days once you've addressed the gaps.",
    },
    {
        q: "Do I need to be based in Lagos?",
        a: "Currently, verification is open to vendors operating in Lagos and Abuja. We're rapidly expanding to cover Accra, Nairobi, and other African cities.",
    },
    {
        q: "What happens after I'm verified?",
        a: "You receive your badge, priority listing, and a dedicated onboarding session with our Vendor Success team to maximize your visibility from day one.",
    },
]

const testimonials = [
    {
        quote:
            "The verification process was thorough but quick. Within a week of getting my badge, I had 4 new inquiries from diaspora clients in the UK.",
        author: "Adaeze O.",
        role: "Venue & Decor, Lagos",
        rating: 5,
    },
    {
        quote:
            "Worth every step. Clients specifically ask for verified vendors — it saves so much time convincing them of your credibility.",
        author: "Seun B.",
        role: "Events MC & Host, Abuja",
        rating: 5,
    },
]

export default function BecomeVerifiedVendorPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">

                {/* Hero */}
                <section className="relative overflow-hidden bg-foreground px-4 py-24 text-background lg:py-32">
                    <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[140px] opacity-50" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px] opacity-40" />
                    <div className="relative mx-auto max-w-5xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                            <ShieldCheck className="h-3 w-3" />
                            Verified Vendor Program
                        </div>
                        <h1 className="font-serif text-5xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl">
                            The badge that{" "}
                            <span className="text-primary italic">wins trust</span>{" "}
                            and bookings.
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-80 md:text-xl">
                            Waddi Verified vendors earn 3× more bookings. Apply today and let your badge do the selling — so you can focus on delivering extraordinary experiences.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/auth/login">
                                <Button size="lg" className="h-14 px-10 text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                                    Apply Now — It's Free <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/for-vendors">
                                <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full border-background/30 text-background hover:bg-background/10">
                                    Learn About Vendor Benefits
                                </Button>
                            </Link>
                        </div>

                        {/* Social Proof Pills */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-full border border-background/10 bg-background/5 px-4 py-1.5 text-xs text-background/70">
                                <CheckCircle2 className="h-3 w-3 text-primary" /> 500+ Verified Vendors
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full border border-background/10 bg-background/5 px-4 py-1.5 text-xs text-background/70">
                                <CheckCircle2 className="h-3 w-3 text-primary" /> 3× More Bookings on Average
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full border border-background/10 bg-background/5 px-4 py-1.5 text-xs text-background/70">
                                <CheckCircle2 className="h-3 w-3 text-primary" /> 7–10 Day Approval
                            </div>
                        </div>
                    </div>
                </section>

                {/* What You Get */}
                <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                            What your badge{" "}
                            <span className="text-primary italic">unlocks</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
                            The Verified badge isn't just a label. It's a growth engine for your vendor business.
                        </p>
                    </div>
                    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {perks.map((perk) => (
                            <div
                                key={perk.title}
                                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                    <perk.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-foreground">{perk.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{perk.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Requirements */}
                <section className="bg-secondary px-4 py-20 lg:py-28">
                    <div className="mx-auto max-w-5xl">
                        <div className="text-center">
                            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                                What we look for
                            </h2>
                            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
                                Our standards are high — because our clients expect the best. Here's what you'll need to qualify.
                            </p>
                        </div>
                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            {requirementGroups.map((group) => (
                                <div key={group.title} className="rounded-2xl border border-border bg-card p-6">
                                    <h3 className="text-base font-bold text-foreground">{group.title}</h3>
                                    <ul className="mt-4 space-y-3">
                                        {group.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2.5">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                                <span className="text-sm text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Application Steps */}
                <section className="mx-auto max-w-5xl px-4 py-20 lg:px-8 lg:py-28">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                            How to apply
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
                            A clear, straightforward process. No bureaucracy — just a thorough check so both you and your clients can feel confident.
                        </p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {applicationSteps.map((step, i) => (
                            <div key={step.step} className="relative">
                                {i < applicationSteps.length - 1 && (
                                    <div className="absolute top-5 left-full hidden h-px w-full bg-border lg:block" />
                                )}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
                                    {step.step}
                                </div>
                                <h3 className="mt-4 text-base font-bold text-foreground">{step.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials */}
                <section className="bg-card border-y border-border px-4 py-16 lg:py-20">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="text-center font-serif text-2xl font-bold text-foreground md:text-3xl">
                            Verified vendors speak
                        </h2>
                        <div className="mt-10 grid gap-6 md:grid-cols-2">
                            {testimonials.map((t) => (
                                <div key={t.author} className="rounded-2xl border border-border bg-background p-6">
                                    <div className="flex gap-1">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                                        ))}
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-foreground italic">"{t.quote}"</p>
                                    <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                                            {t.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{t.author}</p>
                                            <p className="text-xs text-muted-foreground">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mx-auto max-w-3xl px-4 py-20 lg:py-28">
                    <h2 className="text-center font-serif text-3xl font-bold text-foreground md:text-4xl">
                        Questions about verification
                    </h2>
                    <div className="mt-10 flex flex-col gap-4">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="rounded-2xl border border-border bg-card p-6">
                                <h3 className="text-base font-bold text-foreground">{faq.q}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="relative overflow-hidden bg-primary px-4 py-20 text-center text-primary-foreground lg:py-24">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.07),transparent_60%)]" />
                    <div className="relative mx-auto max-w-3xl">
                        <ShieldCheck className="mx-auto h-12 w-12 opacity-70" />
                        <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
                            Your badge is waiting.
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed opacity-90">
                            Apply today. Get verified in 7–10 days. Start winning premium clients who trust your standard.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/auth/login">
                                <Button size="lg" className="h-14 px-10 text-base rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                                    Start Your Application <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                    Talk to Us First
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    )
}
