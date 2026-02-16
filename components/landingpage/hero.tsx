"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
    return (
        <section className="px-8  md:px-8 md:py-2">
            <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden rounded-3xl bg-black px-4 py-20 text-center lg:px-8">
                {/* Image Background */}
                <Image
                    src="/images/waddiup.png"
                    alt="Waddi Events"
                    fill
                    className="object-cover rounded-3xl"
                    priority
                />

                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/50 rounded-3xl" />

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-4xl">
                    <h1 className="mb-6 font-serif text-4xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
                        Plan your African event from abroad.
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
                        Find trusted vendors, coordinate everything, and book in one place.
                    </p>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button asChild size="lg" className="h-14 px-10 text-lg bg-primary text-white hover:bg-primary/90">
                            <Link href="/auth/login">Get started for free</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg border-white text-foreground">
                            <Link href="/request-demo">Request a Demo</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}