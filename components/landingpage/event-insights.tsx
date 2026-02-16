"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function EventInsights() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            title: "Lagos generates 30-35% of Nigeria's GDP and hosts more celebrations than any other African city.",
            source: "Lagos State Government, World Bank 2022",
            image: "https://images.pexels.com/photos/20367607/pexels-photo-20367607.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
            title: "Africa hosts over 5 million weddings annually, with the continent's wedding industry projected to reach $65.6 billion by 2032.",
            source: "Africa.com, Allied Market Research 2024",
            image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200"
        },
        {
            title: "South Africa's informal economy employs 19.5% of the workforce, with event vendors operating predominantly through referrals and unregistered micro-businesses.",
            source: "Statistics South Africa, SALGA 2024",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"
        }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [slides.length])

    return (
        <section className="py-24 bg-background">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                    {/* Card 1: Image Fact with Carousel */}
                    <div className="relative group overflow-hidden rounded-[2rem] min-h-[450px] flex flex-col justify-between">
                        <img
                            src={slides[currentSlide].image}
                            alt="Celebration in Nigeria"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40" />

                        <div className="relative p-8 z-10">
                            <h3 className="text-2xl font-bold text-white leading-tight transition-opacity duration-500">
                                {slides[currentSlide].title}
                            </h3>
                        </div>

                        <div className="relative p-8 z-10">
                            <div className="text-white">
                                <p className="text-xs text-white/80 mb-4">
                                    Source: {slides[currentSlide].source}
                                </p>
                                {/* Pagination Indicators */}
                                <div className="flex gap-1.5">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`h-1 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-white' : 'w-3 bg-white/40'
                                                }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
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
                                Nigeria's event industry contributes over ₦100 billion to GDP annually.
                            </h2>
                            <p className="text-lg text-white/90 mb-6 leading-relaxed font-medium">
                                From grand weddings averaging 1,000 guests to major corporate events, Nigeria's celebration economy is a powerhouse. Over 80% of event vendors are informal micro-businesses thriving on referrals and social media.
                            </p>
                            <p className="text-xs text-white/70">
                                Source: THISDAY, SMEDAN Industry Report 2024
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
                                Average Nigerian wedding: ₦5M-₦20M budget, 1,000 guests.
                            </h2>
                            <p className="text-lg text-white/90 mb-6 leading-relaxed font-medium">
                                Nigerian weddings are multi-funded cultural performances. Lagos hotel bookings alone generate ₦7 billion annually from wedding-related stays, while Instagram has become the new exhibition hall for vendors.
                            </p>
                            <p className="text-xs text-white/70">
                                Source: CNN Africa, Hospitality Association of Nigeria 2023
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