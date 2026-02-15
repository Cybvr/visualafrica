import Link from "next/link"
import { Check } from "lucide-react"
import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Button } from "@/components/ui/button"
import { pricingTiers } from "@/lib/pricing-data"

export const metadata = {
  title: "Pricing | Visual Africa",
  description:
    "Choose the right plan for your event planning needs. Flexible pricing for teams of all sizes.",
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-foreground px-4 py-20 text-center text-background lg:py-28">
          <h1 className="font-serif text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
            Event planning,{" "}
            <span className="text-primary">untangled.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
            Book venues, manage guests, and plan events in one platform.
          </p>
        </section>

        {/* Section Label */}
        <div className="bg-secondary px-4 py-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Software Platform
          </p>
        </div>

        {/* Pricing Cards */}
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-lg border p-8 transition-shadow hover:shadow-lg ${tier.highlighted
                  ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary"
                  : "border-border bg-card"
                  }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-foreground">
                    Most Popular
                  </div>
                )}

                {/* Tier Header */}
                <div>
                  <h3
                    className={`text-xl font-bold ${tier.highlighted ? "text-primary" : "text-card-foreground"
                      }`}
                  >
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tier.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-card-foreground">
                    {tier.price}
                  </span>
                </div>
                {tier.priceNote && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tier.priceNote}
                  </p>
                )}

                {/* CTA */}
                <Link href={tier.ctaHref} className="mt-6 block">
                  <Button
                    className={`w-full ${tier.highlighted
                      ? "bg-primary text-foreground hover:bg-primary/90"
                      : tier.name === "Free"
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "border-primary bg-card text-primary hover:bg-primary hover:text-foreground"
                      }`}
                    variant={
                      tier.highlighted || tier.name === "Free"
                        ? "default"
                        : "outline"
                    }
                  >
                    {tier.cta}
                  </Button>
                </Link>

                {/* Inherits note */}
                {tier.inheritsFrom && (
                  <p className="mt-6 border-b border-border pb-4 text-sm font-medium text-muted-foreground">
                    Everything in{" "}
                    <span className="font-semibold text-foreground">
                      {tier.inheritsFrom}
                    </span>
                    , plus
                  </p>
                )}

                {/* Subtitle for Concierge */}
                {tier.name === "Concierge" && (
                  <p className="mt-6 border-b border-border pb-4 text-sm font-medium text-muted-foreground">
                    Full orchestration for peace of mind from abroad:
                  </p>
                )}

                {/* Features */}
                <ul
                  className={`flex flex-1 flex-col gap-4 ${tier.inheritsFrom || tier.name === "Concierge"
                    ? "mt-4"
                    : "mt-6"
                    }`}
                >
                  {tier.features.map((feature) => (
                    <li key={feature.title} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-card-foreground">
                          {feature.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Expert On-The-Ground Support Label */}
        <div className="bg-secondary px-4 py-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Expert On-The-Ground Support
          </p>
        </div>

        {/* Full Service Detail */}
        <section className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8 lg:py-24">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Need local feet on the ground?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Our Concierge plan gives you a dedicated local orchestration team
            in Lagos. We handle every detail from vendor vetting to guest
            logistics, so you can focus on your celebration while we manage the execution.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="mt-8 bg-primary text-foreground hover:bg-primary/90"
            >
              Book a Call
            </Button>
          </Link>
        </section>

        {/* FAQ */}
        <section className="bg-secondary px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif text-3xl font-bold text-secondary-foreground md:text-4xl">
              Pricing FAQ
            </h2>
            <div className="mt-10 flex flex-col gap-6">
              {[
                {
                  q: "Can I switch plans later?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
                },
                {
                  q: "How do I pay vendors from abroad?",
                  a: "We accept all major international credit cards via Stripe and PayPal. We hold your funds in a secure escrow system and only release payment to local vendors once they deliver on their contract.",
                },
                {
                  q: "How do I know I can trust the vendors?",
                  a: "Every vendor in our Concierge network is personally vetted by our local team and must pass a strict quality and reliability check before being listed.",
                },
                {
                  q: "Can you handle guest logistics?",
                  a: "Yes, our Concierge tier includes full guest support, including hotel block bookings, airport pickups (Eko/Lekki), and local transport coordination.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <h3 className="text-base font-semibold text-card-foreground">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary px-4 py-16 text-center text-foreground">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            Ready to simplify event planning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed opacity-90 md:text-base">
            Get started for free or talk to our team about the plan that fits
            your needs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                Start for Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-foreground hover:bg-primary-foreground/10"
              >
                Talk to Sales
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
