import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Hero } from "@/components/landingpage/hero"
import { FeaturesGrid } from "@/components/landingpage/features-grid"
import { HandpickedExperiences } from "@/components/handpicked-experiences"
import { HottestVendors } from "@/components/landingpage/hottest-vendors"
import { EventInsights } from "@/components/landingpage/event-insights"
import { Testimonials } from "@/components/landingpage/testimonials"
import { TrustSection } from "@/components/landingpage/trust"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HottestVendors />
        <HandpickedExperiences />
        <FeaturesGrid />
        <TrustSection />
        <EventInsights />
        <Testimonials />

        {/* Final CTA Section */}
        <section className="py-24 bg-primary text-foreground text-center">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8 text-white">
              Ready to plan your <br /> next event?
            </h2>
            <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg bg-white text-primary hover:bg-gray-100">
              <Link href="/auth/login">Get started</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}