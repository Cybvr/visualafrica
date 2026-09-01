import Link from "next/link"
import {
    CheckCircle2,
    TrendingUp,
    ShieldCheck,
    Globe,
    Users,
    DollarSign,
    Star,
    ArrowRight,
    Zap,
    BarChart3,
    MessageSquare,
    CreditCard,
} from "lucide-react"
import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "For Vendors | Waddi",
    description:
        "Join Waddi to connect with diaspora clients planning events and manage your bookings in one place.",
}

const benefits = [
    {
        icon: Globe,
        title: "Reach the Diaspora",
        description:
            "Connect with Nigerian and African diaspora clients planning events from the UK, US, Canada, and elsewhere. They are looking for local vendors like you.",
    },
    {
        icon: DollarSign,
        title: "Guaranteed Payments",
        description:
            "Never chase a payment again. Waddi's secure escrow system holds client funds upfront and releases to you automatically upon confirmed delivery.",
    },
    {
        icon: TrendingUp,
        title: "Grow Your Pipeline",
        description:
            "Get discovered through matching. When a client submits an event brief, Waddi shows vendors whose services fit the request.",
    },
    {
        icon: BarChart3,
        title: "Track Your Performance",
        description:
            "Use your vendor dashboard to monitor bookings, reviews, revenue, and response rates. Understand what's working and scale what isn't.",
    },
    {
        icon: MessageSquare,
        title: "Built-In Messaging",
        description:
            "Message clients, share quotes, send proposals, and manage your bookings in one place.",
    },
    {
        icon: ShieldCheck,
        title: "Dispute Protection",
        description:
            "Our dispute process gives you and your clients a clear way to resolve problems.",
    },
]

const stats = [
    { value: "2,000+", label: "Events Planned" },
    { value: "500+", label: "Verified Vendors" },
    { value: "₦800M+", label: "Processed in Payouts" },
    { value: "4.8★", label: "Average Vendor Rating" },
]

const howItWorks = [
    {
        step: "01",
        title: "Create Your Profile",
        description:
            "Sign up and add your portfolio, prices, service areas, and past work. Give clients enough information to decide if you are a fit.",
    },
    {
        step: "02",
        title: "Get Matched",
        description:
            "Waddi shows your profile to clients whose briefs match your specialty. You can focus on relevant leads instead of bidding for every job.",
    },
    {
        step: "03",
        title: "Send Proposals",
        description:
            "Review client briefs, write proposals that fit the job, and message clients through Waddi.",
    },
    {
        step: "04",
        title: "Deliver & Get Paid",
        description:
            "Complete the booking and get paid through secure escrow release, directly to your Nigerian account.",
    },
]

const testimonials = [
    {
        quote:
            "Waddi changed the game for my photography business. I now book three or four diaspora events every month without lifting a finger on marketing.",
        author: "Tunde A.",
        role: "Event Photographer, Lagos",
        rating: 5,
    },
    {
        quote:
            "The payment system is flawless. I used to spend weeks chasing clients. Now, funds hit my account within 48 hours of delivery.",
        author: "Chioma E.",
        role: "Catering & Events, Abuja",
        rating: 5,
    },
    {
        quote:
            "Being a verified vendor on Waddi doubled my bookings in the first quarter. The trust badge alone makes clients choose me over competitors.",
        author: "Emeka O.",
        role: "DJ & Entertainment, Lagos",
        rating: 5,
    },
]

const faqs = [
    {
        q: "Is it free to join as a vendor?",
        a: "Yes. Creating a vendor profile is free. Waddi operates on a success-based commission model. We earn when you earn.",
    },
    {
        q: "What types of vendors can join?",
        a: "We welcome all event-related vendors: photographers, caterers, venues, DJs, decorators, MC/hosts, transport providers, makeup artists, and more.",
    },
    {
        q: "How do I receive payments?",
        a: "Payments are held in escrow and released automatically to your local Nigerian bank account or mobile money within 48 hours of event confirmation.",
    },
    {
        q: "Can I set my own prices?",
        a: "Yes. You control your pricing, availability, and services. Waddi provides the tools while you run your business.",
    },
    {
        q: "What is a Verified Vendor badge?",
        a: "The Verified badge tells clients that you passed our vetting process, which includes a background check, portfolio review, and quality standards. Verified vendors receive priority placement in search results.",
    },
]

export default function ForVendorsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">

                {/* Hero */}
                <section className="relative overflow-hidden bg-foreground px-4 py-24 text-background lg:py-32">
                    {/* Glow */}
                    <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/20 blur-[120px] opacity-60" />
                    <div className="relative mx-auto max-w-5xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                            <Zap className="h-3 w-3" />
                            For Vendors
                        </div>
                        <h1 className="font-serif text-5xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl">
                            Your next big client{" "}
                            <span className="text-primary italic">is already waiting.</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-80 md:text-xl">
                            Connect with diaspora clients planning events in Lagos, Abuja, and beyond.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/auth/login">
                                <Button size="lg" className="h-14 px-10 text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                                    Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/become-verified-vendor">
                                <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full border-background/30 text-background hover:bg-background/10">
                                    Become Verified
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="border-y border-border bg-card">
                    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="font-serif text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                            Everything you need to{" "}
                            <span className="text-primary italic">grow your business</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
                            Waddi helps you manage leads, proposals, and bookings without adding another marketing task.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <benefit.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-foreground">{benefit.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-secondary px-4 py-20 lg:py-28">
                    <div className="mx-auto max-w-5xl">
                        <div className="text-center">
                            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">How it works</h2>
                            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                                From signup to your first booking in days, not months.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {howItWorks.map((step, i) => (
                                <div key={step.step} className="relative">
                                    {i < howItWorks.length - 1 && (
                                        <div className="absolute top-5 left-full hidden h-px w-full bg-border lg:block" />
                                    )}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                        {step.step}
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-foreground">{step.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                            Vendors love Waddi
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
                            Don't take our word for it. Hear from vendors already growing with us.
                        </p>
                    </div>
                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {testimonials.map((t) => (
                            <div key={t.author} className="rounded-2xl border border-border bg-card p-6">
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
                </section>

                {/* Verified CTA Banner */}
                <section className="relative overflow-hidden bg-primary px-4 py-16 text-center text-primary-foreground">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
                    <div className="relative mx-auto max-w-3xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em]">
                            <ShieldCheck className="h-3 w-3" />
                            Verified Vendor Program
                        </div>
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">
                            Stand out. Get more bookings.
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed opacity-90">
                            Our Verified Vendor badge signals trust and quality to clients. Verified vendors appear first in search results and win 3× more bookings.
                        </p>
                        <Link href="/become-verified-vendor" className="mt-8 inline-block">
                            <Button size="lg" className="h-14 px-10 text-base rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                                Apply to Be Verified <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mx-auto max-w-3xl px-4 py-20 lg:py-28">
                    <h2 className="text-center font-serif text-3xl font-bold text-foreground md:text-4xl">Common questions</h2>
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
                <section className="bg-foreground px-4 py-20 text-center text-background lg:py-24">
                    <h2 className="font-serif text-4xl font-bold md:text-5xl">
                        Ready to grow?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed opacity-80">
                        Join verified vendors on Waddi. Sign up free and connect with clients looking for your services.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/auth/login">
                            <Button size="lg" className="h-14 px-10 text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                                Create Vendor Account <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full border-background/30 text-background hover:bg-background/10">
                                Talk to Our Team
                            </Button>
                        </Link>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    )
}
