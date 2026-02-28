import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { WaddiPrompt } from "@/components/landingpage/waddi-prompt"
import { Hero } from "@/components/landingpage/hero"
import { Features } from "@/components/landingpage/features"
import { HowItWorks } from "@/components/landingpage/how-it-works"
import { Locations } from "@/components/landingpage/locations"
import { Button } from "@/components/ui/button"
import { PwaAuthGate } from "@/components/pwa-auth-gate"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PwaAuthGate />
      <Header />
      <main className="flex-1">
        <WaddiPrompt />
        <Hero />

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
              <div className="space-y-6">
                <h2 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                  You're spending weeks doing what should take hours.
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  Chasing venues, coordinating talent, managing logistics.
                  By the time it's done, you're exhausted before it even starts.
                </p>
              </div>

              <div className="border border-border bg-card">
                <div className="p-4 border-b border-border text-sm font-semibold">
                  Waddi Chat
                </div>
                <div className="p-4 space-y-4 text-sm">
                  <div className="max-w-[85%] bg-card border border-border px-3 py-2">
                    What are you planning?
                  </div>
                  <div className="max-w-[85%] bg-background border border-border px-3 py-2 ml-auto">
                    Surprise 30th birthday in Lagos for 20 guests.
                  </div>
                  <div className="max-w-[85%] bg-card border border-border px-3 py-2">
                    Got it. I’ll build the plan and shortlist top vendors. Want a rooftop or beach vibe?
                  </div>
                  <div className="max-w-[85%] bg-background border border-border px-3 py-2 ml-auto">
                    Rooftop.
                  </div>
                  <div className="max-w-[85%] bg-card border border-border px-3 py-2">
                    Done. I’ll draft the full package for approval.
                  </div>
                </div>
                <div className="p-4 border-t border-border text-[11px] text-muted-foreground">
                  Brief → Build → Confirm → Go
                </div>
              </div>
            </div>
          </div>
        </section>

        <Features />

        <HowItWorks />

        <Locations />

        {/* Final CTA Section */}
        <section className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="font-serif text-5xl md:text-7xl font-bold mb-10 text-foreground">
              Stop planning.<br />Start living it.
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="h-16 px-12 text-xl rounded-full">
                <Link href="/auth/login">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 px-12 text-xl rounded-full">
                <Link href="/auth/login">Contact Sales</Link>
              </Button>
            </div>
            <p className="mt-8 text-muted-foreground">Join 500+ creators making moments with Waddi.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
