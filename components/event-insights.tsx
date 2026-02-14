"use client"

import Link from "next/link"
import { HiArrowRight } from "react-icons/hi2"
import { Button } from "@/components/ui/button"

export function EventInsights() {
    return (
        <section className="py-24 bg-background">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                    {/* Card 1: Image Fact */}
                    <div className="relative group overflow-hidden rounded-[2rem] min-h-[450px] flex flex-col justify-between">
                        <img
                            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200"
                            alt="Celebration in Lagos"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />

                        <div className="relative p-8 z-10">
                            <h3 className="text-2xl font-bold text-white leading-tight">
                                "THE ULTIMATE PARTY HUB!!! <br />Lagos hosts more events than <br />any other African city."
                            </h3>
                        </div>

                        <div className="relative p-8 z-10">
                            <div className="text-white">
                                <p className="text-sm font-bold underline decoration-2 underline-offset-4 mb-4">
                                    Fact: Lagos Weekend Economy <br />Drive, 2025 Reports
                                </p>
                                {/* Pagination Indicators */}
                                <div className="flex gap-1.5">
                                    <div className="h-1 w-6 rounded-full bg-white" />
                                    <div className="h-1 w-3 rounded-full bg-white/40" />
                                    <div className="h-1 w-3 rounded-full bg-white/40" />
                                    <div className="h-1 w-3 rounded-full bg-white/40" />
                                    <div className="h-1 w-3 rounded-full bg-white/40" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Blue Fact (Industry Size) */}
                    <div className="relative bg-[#3b82f6] rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden">
                        {/* Decorative swirl */}
                        <div className="absolute top-0 right-0 p-8">
                            <div className="w-64 h-64 border-[40px] border-white/5 rounded-full -mr-32 -mt-32" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                                Over NGN 2.3 Trillion industry for an unforgettable culture.
                            </h2>
                            <p className="text-lg text-white/90 mb-8 leading-relaxed font-medium">
                                Nigeria's event sector remains a powerhouse. From grand weddings to major festivals, we provide the digital infrastructure to book, plan, and celebrate with ease.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <Link href="/explore/vendors">
                                <Button variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white hover:text-[#3b82f6] font-bold px-6 py-5 rounded-xl transition-all">
                                    Explore listings
                                </Button>
                            </Link>
                        </div>

                        {/* Bottom Swirl decoration */}
                        <div className="absolute bottom-0 right-0 p-8 opacity-20 pointer-events-none">
                            <svg width="120" height="120" viewBox="0 0 200 200" fill="none">
                                <path d="M40 160C80 160 120 120 120 80C120 40 160 0 200 0" stroke="white" strokeWidth="2" strokeDasharray="8 8" />
                                <path d="M0 200C40 200 80 160 80 120C80 80 120 40 160 40" stroke="white" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    {/* Card 3: Deep Brand Color Fact (Vetted Professionals) */}
                    <div className="relative bg-primary rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                                5,000+ Vetted Professionals in one marketplace.
                            </h2>
                            <p className="text-lg text-white/90 mb-8 leading-relaxed font-medium">
                                We've curated Nigeria's top-tier caterers, decorators, and planners. Every vendor on Visual Africa is verified to ensure your party is as seamless as it is spectacular.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <Link href="/explore/vendors">
                                <Button variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white hover:text-primary font-bold px-6 py-5 rounded-xl transition-all">
                                    Learn more
                                </Button>
                            </Link>
                        </div>

                        {/* Subtle overlay pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    </div>

                </div>
            </div>
        </section>
    )
}
