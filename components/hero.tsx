"use client"

import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center lg:px-8">
            <div className="mx-auto max-w-4xl">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
                    Premium Event Planning
                </p>
                <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
                    Africa's Events <br />
                    <span className="text-primary italic">made easy.</span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                    Expert planners, unbeatable prices, and <br className="hidden md:block" />
                    AI-powered event software for extraordinary results.
                </p>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90">
                        Get started for free
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-primary text-primary hover:bg-primary/5">
                        Talk to an expert
                    </Button>
                </div>

                <div className="mt-16 flex items-center justify-center gap-8">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-foreground">5 Stars</p>
                        <p className="text-sm text-muted-foreground">Google Reviews</p>
                    </div>
                    <div className="h-12 w-[1px] bg-border" />
                    <div className="text-center">
                        <p className="text-3xl font-bold text-foreground">500,000+</p>
                        <p className="text-sm text-muted-foreground">Attendees hosted</p>
                    </div>
                    <div className="h-12 w-[1px] bg-border" />
                    <div className="text-center">
                        <p className="text-3xl font-bold text-foreground">1M+</p>
                        <p className="text-sm text-muted-foreground">Vendor partners</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
