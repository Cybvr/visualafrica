import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Hero } from "@/components/landingpage/hero"
import { Features } from "@/components/landingpage/features"
import { HowItWorks } from "@/components/landingpage/how-it-works"
import { Locations } from "@/components/landingpage/locations"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />

        <section className="relative py-32 overflow-hidden bg-background">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 max-w-6xl relative">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight text-foreground">
                    You're spending weeks doing what should take <span className="text-primary italic">hours.</span>
                  </h2>
                  <div className="h-1.5 w-24 bg-primary rounded-full" />
                </div>

                <div className="space-y-6 text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  <p>
                    Chasing venues, coordinating talent, managing logistics.
                    By the time it's done, you're exhausted before it even starts.
                  </p>
                  <p className="font-serif text-3xl md:text-4xl text-foreground font-semibold border-l-4 border-primary pl-6 py-2">
                    Waddi changes the math.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                <div className="relative rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
                  <div className="space-y-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-6xl md:text-7xl font-serif font-bold text-primary">0</div>
                      <div className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Logistics stress</div>
                    </div>
                    <div className="pt-8 border-t border-border/50">
                      <div className="flex justify-center -space-x-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted" />
                        ))}
                      </div>
                    </div>
                  </div>
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
