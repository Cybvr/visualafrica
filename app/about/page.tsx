import { Header } from "@/app/common/header"
import { Footer } from "@/app/common/footer"

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center">
                        <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
                            About Visual<span className="text-primary">Africa</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
                            Lagos's trusted event planner marketplace connecting you with the finest vendors for unforgettable celebrations.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="mt-20">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">Our Mission</h2>
                        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            At Visual Africa, we believe every celebration deserves to be extraordinary. Our mission is to simplify event planning by connecting you with Lagos's most talented vendors—from photographers and caterers to decorators and entertainers. We're here to transform your vision into reality, one unforgettable event at a time.
                        </p>
                    </div>

                    {/* What We Do Section */}
                    <div className="mt-20">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">What We Do</h2>
                        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg border border-border bg-card p-6">
                                <h3 className="font-serif text-xl font-bold">Curated Vendors</h3>
                                <p className="mt-4 text-muted-foreground">
                                    We handpick the best event vendors in Lagos, ensuring quality and professionalism for your special day.
                                </p>
                            </div>
                            <div className="rounded-lg border border-border bg-card p-6">
                                <h3 className="font-serif text-xl font-bold">Effortless Browsing</h3>
                                <p className="mt-4 text-muted-foreground">
                                    Browse inspiring video reels and portfolios to find vendors that match your style and vision.
                                </p>
                            </div>
                            <div className="rounded-lg border border-border bg-card p-6">
                                <h3 className="font-serif text-xl font-bold">Seamless Quotes</h3>
                                <p className="mt-4 text-muted-foreground">
                                    Request and receive quotes from multiple vendors effortlessly, all in one place.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us Section */}
                    <div className="mt-20">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">Why Choose Us</h2>
                        <div className="mt-8 space-y-6">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="font-bold">Trusted Network</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        Access a vetted network of professional vendors with proven track records.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="font-bold">Time-Saving</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        Compare vendors, view portfolios, and get quotes—all without endless phone calls and emails.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="font-bold">Local Expertise</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        We know Lagos. Our vendors understand the local culture and deliver authentic experiences.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 rounded-lg bg-primary px-8 py-12 text-center text-primary-foreground">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">
                            Ready to Plan Your Event?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
                            Join thousands of satisfied clients who've found their perfect vendors through Visual Africa.
                        </p>
                        <a
                            href="/explore/vendors"
                            className="mt-8 inline-block rounded-lg bg-background px-8 py-3 font-semibold text-foreground transition-colors hover:bg-background/90"
                        >
                            Explore Vendors
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
