import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSolutions } from "@/lib/firestore-service"

export const metadata = {
  title: "Our Solutions | Waddi",
  description:
    "Find the Waddi service that fits your event, from corporate offsites and conferences to full-service planning.",
}

export default async function SolutionsPage() {
  const solutions = await getSolutions()
  return (
    <>
      {/* Hero */}
      <section className="bg-foreground px-4 py-20 text-background lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
            Our Solutions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
            From corporate retreats to full-service event planning, Waddi helps you organise the work around your event.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <Link
              key={solution.slug}
              href={`/solutions/${solution.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/20 transition-opacity group-hover:bg-foreground/10" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-xl font-bold text-card-foreground">
                  {solution.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary">
                  {solution.tagline}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {solution.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-4 py-16 text-center text-foreground">
        <h2 className="font-serif text-3xl font-bold md:text-4xl">
          Not sure which service fits?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed opacity-90 md:text-base">
          Tell us what you are planning and we will point you to the right service.
        </p>
        <Link href="/contact">
          <Button
            size="lg"
            className="mt-8 bg-foreground text-background hover:bg-foreground/90"
          >
            Get in Touch
          </Button>
        </Link>
      </section>
    </>
  )
}
