"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
    return (
        <section className="h-screen px-4 py-2 md:px-6">
            <div className="relative mx-auto flex h-full max-w-7xl items-center overflow-hidden rounded-[3rem] border border-border bg-card/50 px-8 py-16 lg:px-16 lg:py-24">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="grid gap-12 lg:grid-cols-2 items-center relative z-10">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Waddi Experience v1.0
                            </div>
                            <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl leading-[0.9]">
                                We decide.<br />
                                <span className="text-primary italic">You show up.</span>
                            </h1>
                            <p className="max-w-xl text-xl text-muted-foreground md:text-2xl leading-relaxed">
                                Waddi is for people who create moments — not spreadsheets. Events, trips, and experiences built for you in minutes.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full">
                                <Link href="/auth/login">Plan your moment</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full">
                                <Link href="#how-it-works">See how it works</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-border shadow-2xl">
                            <Image
                                src="/images/waddiup.png"
                                alt="Waddi Experience"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Status Card Decoration */}
                        <div className="absolute -bottom-6 -left-6 md:-left-12 max-w-[280px] rounded-3xl border border-border bg-background/90 backdrop-blur-xl p-6 shadow-xl hidden sm:block">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Planning</span>
                            </div>
                            <p className="text-sm font-medium mb-1">Rooftop Soirée in Lagos</p>
                            <div className="flex justify-between text-[11px] text-muted-foreground">
                                <span>Brief received</span>
                                <span className="text-primary">92% Built</span>
                            </div>
                            <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[92%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
