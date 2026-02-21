"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Phone,
  Instagram,
  Globe,
  Linkedin,
  MessageCircle,
  Heart,
  Share2,
  Link2,
  Check,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Vendor } from "@/lib/types"

export function VendorDetail({ vendor }: { vendor: Vendor }) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % vendor.gallery.length)
  }
  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + vendor.gallery.length) % vendor.gallery.length
    )
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-foreground px-4 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-start gap-6">
          {/* Vendor Avatar */}
          <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-background/20 md:block">
            <Image
              src={vendor.vendor.logo}
              alt={vendor.vendor.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="font-serif text-2xl font-bold text-background md:text-3xl text-balance">
              {vendor.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-background/70 md:text-base">
              {vendor.description}
            </p>
            {vendor.price && (
              <p className="mt-2 text-lg font-bold text-background">
                {vendor.price}
              </p>
            )}
          </div>

          {/* Rating Badge */}
          <div className="hidden shrink-0 md:block">
            <div className="flex items-center gap-2 rounded-xl bg-primary/20 px-4 py-3">
              <span className="text-2xl font-bold text-background">
                {vendor.rating}
              </span>
              <Star className="h-6 w-6 fill-primary text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/50 px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/explore/vendors" className="hover:text-foreground">
            Explore Vendors
          </Link>
          {vendor.categories[0] && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="hover:text-foreground">
                {vendor.categories[0]}
              </span>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground line-clamp-1">{vendor.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="bg-background px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Column */}
            <div className="flex-1">
              {/* Image Gallery */}
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <Image
                  src={vendor.gallery[currentImage]?.url ?? vendor.image}
                  alt={
                    vendor.gallery[currentImage]?.alt ?? vendor.name
                  }
                  fill
                  className="object-cover"
                />
                {vendor.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-background"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-background"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {vendor.gallery.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {vendor.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md ${i === currentImage
                          ? "ring-2 ring-primary"
                          : "opacity-60 hover:opacity-80"
                        }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Tabs */}
              <Tabs defaultValue="about" className="mt-8">
                <TabsList className="w-full justify-start border-b border-border bg-transparent p-0">
                  <TabsTrigger
                    value="about"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Services
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about" className="mt-6">
                  {/* What's Included */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {"What's included:"}
                    </h3>
                    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {vendor.whatsIncluded.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-sm text-foreground"
                        >
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Vendor Profile */}
                  <Card className="mt-8 border-border bg-secondary/30">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-foreground">
                        {vendor.vendor.name}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {vendor.about}
                      </p>

                      <div className="mt-6 space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                          Premier Event Planning Services by{" "}
                          {vendor.vendor.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">
                            {vendor.stats.eventsPlanned} Events Planned
                          </strong>{" "}
                          - Delivering exceptional experiences with precision
                          and creativity.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">
                            {vendor.stats.satisfiedClients} Satisfied Clients
                          </strong>{" "}
                          - Trusted by individuals and brands for seamless
                          celebrations.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">
                            {vendor.stats.corporateEvents} Corporate & Social
                            Events
                          </strong>{" "}
                          - Expertise across diverse event formats and
                          occasions.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">
                            {vendor.stats.yearsExperience} Years of Extensive
                            Experience
                          </strong>{" "}
                          - A legacy of excellence in event management.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">
                            {vendor.stats.uniqueLocations} Unique Locations
                          </strong>{" "}
                          - Curated venues that make every event truly
                          unforgettable.
                        </p>
                      </div>

                      {/* Event themes */}
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-foreground">
                          Event themes
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {vendor.eventThemes.map((theme) => (
                            <Badge
                              key={theme}
                              variant="secondary"
                              className="text-xs"
                            >
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Listed in */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-foreground">
                          Listed in
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {vendor.categories.map((cat) => (
                            <Badge
                              key={cat}
                              variant="secondary"
                              className="text-xs"
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="mt-6 space-y-3 border-t border-border pt-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Location:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {vendor.location}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Area Served
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {vendor.areaServed.join(", ")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">
                              Year Established:
                            </strong>{" "}
                            {vendor.yearEstablished}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="mt-6">
                  <h3 className="text-lg font-bold text-foreground">
                    Services Offered
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {vendor.services.map((service) => (
                      <Badge
                        key={service}
                        variant="outline"
                        className="px-4 py-2 text-sm"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                    {vendor.vendor.name} offers comprehensive event services
                    tailored to your specific needs. Contact them directly for
                    custom packages and detailed service descriptions.
                  </p>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-6">
                  <div className="text-center py-12">
                    <Star className="mx-auto h-12 w-12 text-primary/30" />
                    <h3 className="mt-4 text-lg font-bold text-foreground">
                      Reviews Coming Soon
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Be the first to review {vendor.vendor.name}. Reviews from
                      verified customers will appear here.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="w-full shrink-0 lg:w-80">
              <div className="flex flex-col gap-6 lg:sticky lg:top-24">
                {/* Request a Quote Card */}
                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-card-foreground">
                      Request a Quote
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Interested in services from {vendor.vendor.name}? Fill out
                      this form to request pricing and availability.
                    </p>
                    <Button className="mt-4 w-full bg-primary text-foreground hover:bg-primary/90">
                      Get a Quote
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact Vendor */}
                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-card-foreground">
                      Contact this Vendor
                    </h3>
                    <div className="mt-4 flex items-center gap-3">
                      <a
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary hover:text-foreground"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary hover:text-foreground"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary hover:text-foreground"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary hover:text-foreground"
                        aria-label="Website"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Services
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {vendor.services.slice(0, 4).map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {vendor.services.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{vendor.services.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Response Time
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-sm text-foreground">
                          {vendor.responseTime}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Share
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Share via WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Share via Instagram"
                        >
                          <Instagram className="h-4 w-4" />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Copy link"
                        >
                          <Link2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
