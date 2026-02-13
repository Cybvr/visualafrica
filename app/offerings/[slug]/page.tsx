import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { offerings, getOfferingBySlug } from "@/lib/offerings-data"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function generateStaticParams() {
  return offerings.map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const offering = getOfferingBySlug(slug)
  if (!offering) return { title: "Not Found" }
  return {
    title: `${offering.title} | Visual Africa`,
    description: offering.description,
  }
}

export default async function OfferingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const offering = getOfferingBySlug(slug)
  if (!offering) notFound()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0">
          <Image
            src={offering.image}
            alt={offering.title}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
          <nav
            className="mb-6 flex items-center gap-2 text-sm text-background/60"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="transition-colors hover:text-background/90"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/offerings"
              className="transition-colors hover:text-background/90"
            >
              Offerings
            </Link>
            <span>/</span>
            <span className="text-background/90">{offering.title}</span>
          </nav>
          <h1 className="max-w-3xl font-serif text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
            {offering.title}
          </h1>
          <p className="mt-2 text-lg font-medium text-primary">
            {offering.tagline}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background/80">
            {offering.description}
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          What we deliver
        </h2>
        <p className="mt-2 text-muted-foreground">
          Everything you need for a successful {offering.title.toLowerCase()}{" "}
          experience.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {offering.features.map((feature, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-lg font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-secondary px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-secondary-foreground md:text-4xl">
            Our process
          </h2>
          <p className="mt-2 text-muted-foreground">
            A proven approach to delivering exceptional events.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {offering.process.map((step, i) => (
              <div key={i} className="relative flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {i + 1}
                </div>
                {i < offering.process.length - 1 && (
                  <div className="absolute left-6 top-12 hidden h-0.5 w-[calc(100%-1.5rem)] bg-primary/20 lg:block" />
                )}
                <h3 className="mt-4 text-base font-semibold text-secondary-foreground">
                  {step.step}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Why choose Visual Africa
            </h2>
            <p className="mt-2 text-muted-foreground">
              The trusted partner for{" "}
              {offering.title.toLowerCase()} in Lagos and beyond.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {offering.whyChooseUs.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={offering.image}
              alt={`${offering.title} by Visual Africa`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      {offering.faq.length > 0 && (
        <section className="bg-secondary px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl lg:px-8">
            <h2 className="text-center font-serif text-3xl font-bold text-secondary-foreground md:text-4xl">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="mt-10">
              {offering.faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-base font-medium text-secondary-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary px-4 py-16 text-center text-primary-foreground">
        <h2 className="font-serif text-3xl font-bold md:text-4xl">
          Ready to get started?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed opacity-90 md:text-base">
          Let us plan your next {offering.title.toLowerCase()} event. Get in
          touch today for a free consultation.
        </p>
        <Link href="/contact">
          <Button
            size="lg"
            className="mt-8 bg-foreground text-background hover:bg-foreground/90"
          >
            Request a Consultation
          </Button>
        </Link>
      </section>
    </>
  )
}
