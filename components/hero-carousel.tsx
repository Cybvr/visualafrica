"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "/images/hero-wedding.jpg",
    title: "Create Your Dream Wedding in Lagos",
    cta: "Plan a Wedding",
    href: "/wedding",
  },
  {
    image: "/images/hero-corporate.jpg",
    title: "Elevate Your Corporate Events",
    cta: "Plan a Corporate Event",
    href: "/corporate",
  },
  {
    image: "/images/hero-kids.jpg",
    title: "Magical Kids Birthday Parties",
    cta: "Plan a Kids Party",
    href: "/kids-parties",
  },
  {
    image: "/images/hero-yacht.jpg",
    title: "Exclusive Yacht Parties in Lagos",
    cta: "Plan a Yacht Party",
    href: "/social",
  },
  {
    image: "/images/hero-proposal.jpg",
    title: "Picture-Perfect Proposals in Lagos",
    cta: "Plan a Proposal",
    href: "/concierge",
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden md:h-[80vh]">
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary md:text-base">
          {"Lagos's Trusted Event Planner Marketplace"}
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight text-background md:text-5xl lg:text-6xl text-balance">
          {slides[current].title}
        </h1>
        <Button
          size="lg"
          className="mt-8 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <a href={slides[current].href}>{slides[current].cta}</a>
        </Button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/20 text-background backdrop-blur-sm transition-colors hover:bg-background/40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/20 text-background backdrop-blur-sm transition-colors hover:bg-background/40"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current
                ? "w-8 bg-primary"
                : "w-2 bg-background/50 hover:bg-background/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
