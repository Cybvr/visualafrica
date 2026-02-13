import { Header } from "@/app/common/header"
import { Footer } from "@/app/common/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import { VendorSpotlight } from "@/components/vendor-spotlight"
import { EventPlanners } from "@/components/event-planners"
import { BrowseCelebrations } from "@/components/browse-celebrations"
import { FaqSection } from "@/components/faq-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroCarousel />
        <VendorSpotlight />
        <EventPlanners />
        <BrowseCelebrations />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}
