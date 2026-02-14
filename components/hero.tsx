"use client"

import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center lg:px-8 overflow-hidden bg-black">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src="/video/about.mp4" type="video/mp4" />
            </video>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-4xl">
                <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
                    Africa's Events <br />
                    <span className="text-primary italic">made easy.</span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
                    Expert planners, unbeatable prices, and <br className="hidden md:block" />
                    AI-powered event software for extraordinary results.
                </p>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90">
                        Get started for free
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white text-foreground hover:bg-white/10">
                        Talk to an expert
                    </Button>
                </div>
            </div>
        </section>
    )
}   