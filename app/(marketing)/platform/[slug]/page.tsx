import { notFound } from "next/navigation"
import { getPlatformFeatures } from "@/lib/firestore-service"
import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check, ArrowRight, Zap } from "lucide-react"
import { IconRenderer } from "@/components/marketing/IconRenderer"

// Generate static params for all platform pages
export async function generateStaticParams() {
    const platformFeatures = await getPlatformFeatures()
    return platformFeatures.map((feature) => ({
        slug: feature.slug,
    }))
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const platformFeatures = await getPlatformFeatures()
    const feature = platformFeatures.find((f) => f.slug === resolvedParams.slug)

    if (!feature) {
        notFound()
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-secondary py-20 lg:py-32">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                                {feature.title} Platform
                            </div>
                            <h1 className="mb-6 font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                                {feature.heroTitle}
                            </h1>
                            <p className="mb-10 text-lg leading-relaxed text-muted-foreground md:text-xl">
                                {feature.heroSubtitle}
                            </p>
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                <Button asChild size="lg" className="h-12 px-8 text-primary-foreground text-base">
                                    <Link href="/auth/login">
                                        {feature.ctaText}
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                                    <Link href="/book-a-call">
                                        Talk to an Expert
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Features Grid */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 md:text-center max-w-3xl mx-auto">
                            <h2 className="font-serif text-3xl font-bold md:text-4xl text-foreground mb-4">
                                Built for modern event planning
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Everything you need to execute flawless events, integrated into one powerful platform.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {feature.features.map((item, index) => (
                                <div
                                    key={index}
                                    className="group rounded-2xl border border-border bg-white p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                                >
                                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <IconRenderer name={item.icon} className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="bg-background py-24 text-white">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h2 className="mb-6 font-serif text-3xl font-bold md:text-4xl">
                                    Why top planners choose Waddi {feature.title}
                                </h2>
                                <p className="mb-8 text-lg text-muted-foreground">
                                    Join thousands of event professionals who trust our platform to deliver exceptional experiences.
                                </p>

                                <ul className="space-y-4">
                                    {feature.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-foreground-200">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-10">
                                    <Button asChild size="lg" className="h-14 px-8 text-base bg-white text-foreground hover:bg-card">
                                        <Link href="/auth/login">
                                            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 overflow-hidden">
                                {/* Abstract visual representation */}
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/20 text-primary mb-6 backdrop-blur-sm">
                                            <Zap className="h-10 w-10 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Powering Your Success</h3>
                                        <p className="text-muted-foreground">Advanced tools for professional results</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary text-foreground text-center">
                    <div className="container mx-auto px-4">
                        <h2 className="font-serif text-4xl text-primary-foreground md:text-5xl font-bold mb-6">
                            Ready to transform your event planning?
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-primary-foreground text-lg opacity-90">
                            Start using Waddi {feature.title} today and experience the difference.
                        </p>
                        <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg bg-white text-primary hover:bg-card">
                            <Link href="/auth/login">Create Free Account</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
