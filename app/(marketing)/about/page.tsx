import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center">
                        <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl text-balance">
                            Bridging the gap between the <span className="text-primary italic">diaspora</span> and Lagos.
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
                            The local help and clear information you need to plan an event in Nigeria from anywhere in the world.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="mt-20">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">Our Mission</h2>
                        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            Distance should not make it harder to plan a celebration. Waddi gives Nigerians abroad a secure, transparent way to organise events in Lagos, with local support when you need it.
                        </p>
                    </div>

                    {/* What We Do Section */}
                    <div className="mt-20">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">What We Do</h2>
                        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg border border-border bg-card p-6">
                                <h3 className="font-serif text-xl font-bold">Secure Escrow</h3>
                                <p className="mt-4 text-muted-foreground text-sm">
                                    Pay with international cards. We hold funds in escrow until the vendor delivers, protecting your investment.
                                </p>
                            </div>
                            <div className="rounded-lg border border-border bg-card p-6">
                                <h3 className="font-serif text-xl font-bold">Remote Orchestration</h3>
                                <p className="mt-4 text-muted-foreground text-sm">
                                    Manage your guest list and itinerary from abroad while our local experts handle the orchestration on the ground.
                                </p>
                            </div>
                            <div className="rounded-lg border border-border bg-card p-6">
                                <h3 className="font-serif text-xl font-bold">Vetted vendors</h3>
                                <p className="mt-4 text-muted-foreground text-sm">
                                    Find Lagos vendors who have been checked for quality and reliability.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us Section */}
                    <div className="mt-20">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">Why Choose Us</h2>
                        <div className="mt-8 space-y-6">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-foreground">
                                    ✓
                                </div>
                                <div>
                            <h3 className="font-bold">Built for Nigerians abroad</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        Designed specifically for the needs of Nigerians abroad, with secure payments and platform guarantees.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-foreground">
                                    ✓
                                </div>
                                <div>
                            <h3 className="font-bold">Local coordination</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        From venue scouting to on-site management, we provide the local feet on the ground you need.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-foreground">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="font-bold">Cultural Expertise</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        We understand Nigerian celebrations and how to work with local vendors.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 rounded-lg bg-primary px-8 py-12 text-center text-foreground">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">
                            Ready to Plan Your Event?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
                            Find the vendors you need for your event.
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
