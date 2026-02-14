"use client"

import Link from "next/link"
import { HiArrowRight } from "react-icons/hi2"
import { Button } from "@/components/ui/button"

export function EventInsights() {
    return (
        <section className="py-24 bg-background">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                    {/* Testimonial Card */}
                    <div className="relative group overflow-hidden rounded-[2.5rem] min-h-[500px] flex flex-col justify-end">
                        <img
                            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"
                            alt="People celebrating"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="relative p-10 lg:p-12 z-10">
                            <p className="text-2xl lg:text-3xl font-bold text-white mb-8 leading-tight">
                                "Visual Africa made our wedding planning feel like a breeze. We found all our vendors in one weekend!"
                            </p>

                            <div className="space-y-1">
                                <p className="text-white font-bold">Chidi & Amaka,</p>
                                <p className="text-white/70 text-sm">Wedding at The Monarch, Lagos</p>
                            </div>

                            {/* Pagination Indicators - visual only */}
                            <div className="flex gap-2 mt-8">
                                <div className="h-1 w-8 rounded-full bg-white" />
                                <div className="h-1 w-4 rounded-full bg-white/30" />
                                <div className="h-1 w-4 rounded-full bg-white/30" />
                                <div className="h-1 w-4 rounded-full bg-white/30" />
                            </div>
                        </div>
                    </div>

                    {/* Facts Card */}
                    <div className="relative bg-[#3b82f6] rounded-[2.5rem] p-10 lg:p-16 flex flex-col justify-center overflow-hidden">
                        {/* Decorative swirl */}
                        <div className="absolute top-0 right-0 p-8">
                            <div className="w-64 h-64 border-[40px] border-white/5 rounded-full -mr-32 -mt-32" />
                        </div>

                        <div className="relative z-10 max-w-md">
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-[1.1]">
                                Over 20,000 unique parties happen in Lagos every weekend.
                            </h2>
                            <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium">
                                From grand weddings to intimate beach house linkups, Nigeria's event scene is unmatched. Find everything you need to host an unforgettable experience.
                            </p>

                            <Link href="/explore/vendors">
                                <Button className="bg-white text-[#3b82f6] hover:bg-white/90 font-bold px-8 py-6 rounded-2xl text-lg group transition-all">
                                    Explore listings
                                    <HiArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>

                        {/* Bottom Swirl decoration */}
                        <div className="absolute bottom-0 right-0 p-12 opacity-30">
                            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40 160C80 160 120 120 120 80C120 40 160 0 200 0" stroke="white" strokeWidth="2" strokeDasharray="8 8" />
                                <path d="M0 200C40 200 80 160 80 120C80 80 120 40 160 40" stroke="white" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
