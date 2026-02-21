import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { VendorCard } from "@/components/dashboard/vendor-card"
import { VendorDetail } from "@/components/dashboard/vendor-detail"
import {
  EVENT_THEMES,
  CATEGORY_SLUG_MAP,
} from "@/lib/constants"
import { type EventTheme, type VendorCategory, type Vendor } from "@/lib/types"
import { getVendors, getVendorBySlug, getFaqs } from "@/lib/firestore-service"

const ITEMS_PER_PAGE = 8

interface PageProps {
  params: Promise<{ category?: string[] }>
}

export default async function ExploreVendorsPage({ params }: PageProps) {
  const { category: segments = [] } = await params
  const firstSegment = segments[0] ?? null

  const isVendorDetail =
    firstSegment !== null && !(firstSegment in CATEGORY_SLUG_MAP)

  const allVendors = await getVendors()
  const vendorData = isVendorDetail ? await getVendorBySlug(firstSegment) : undefined
  const faqs = await getFaqs()
  const vendorFaqs = faqs.filter(f => f.category === 'vendors' || f.category === 'general')

  if (isVendorDetail && vendorData) {
    return <VendorDetail vendor={vendorData} />
  }

  return <VendorListingContent categorySlug={firstSegment} vendors={allVendors} faqs={vendorFaqs} />
}

"use client"

import { useSearchParams } from "next/navigation"

function VendorListingContent({
  categorySlug,
  vendors,
  faqs,
}: {
  categorySlug: string | null
  vendors: Vendor[]
  faqs: any[]
}) {
  const initialCategory: VendorCategory = categorySlug
    ? CATEGORY_SLUG_MAP[categorySlug] ?? "All Categories"
    : "All Categories"

  const searchParams = useSearchParams()
  const themeParam = searchParams.get("theme") as EventTheme | null
  const initialTheme = themeParam && EVENT_THEMES.includes(themeParam) ? themeParam : "All Themes"

  const [selectedTheme, setSelectedTheme] = useState<EventTheme>(initialTheme)
  const [selectedCategory, setSelectedCategory] =
    useState<VendorCategory>(initialCategory)
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const locations = useMemo(() => {
    const locs = vendors.map((v) => v.location.split(",")[0].trim())
    return ["All Locations", ...Array.from(new Set(locs))]
  }, [vendors])

  const filteredVendors = useMemo(() => {
    let result = [...vendors]

    if (selectedCategory !== "All Categories") {
      result = result.filter((v) => v.categories.includes(selectedCategory))
    }

    if (selectedTheme !== "All Themes") {
      result = result.filter((v) => v.eventThemes.includes(selectedTheme))
    }

    if (selectedLocation !== "All Locations") {
      result = result.filter((v) => v.location.includes(selectedLocation))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.vendor.name.toLowerCase().includes(q)
      )
    }

    return result
  }, [selectedCategory, selectedTheme, selectedLocation, search, vendors])

  const visibleVendors = filteredVendors.slice(0, visibleCount)
  const hasMore = visibleCount < filteredVendors.length

  const handleClearAll = () => {
    setSelectedTheme("All Themes")
    setSelectedCategory("All Categories")
    setSelectedLocation("All Locations")
    setSearch("")
  }

  const categoryTitle =
    selectedCategory !== "All Categories" ? selectedCategory : "All Vendors"
  const pageTitle = `Plan your next ${categoryTitle} Event`
  const pageDescription =
    "We make event planning simple, fast, and fun for any occasion."

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-foreground px-4 py-20 lg:px-8 flex items-center justify-center text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-4xl font-bold text-background md:text-6xl text-balance">
            {pageTitle}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-background/70 md:text-xl">
            {pageDescription}
          </p>

          <div className="mt-10 max-w-md mx-auto relative group">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full appearance-none bg-background text-foreground px-6 py-4 rounded-2xl font-bold shadow-xl outline-none focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer pr-12 text-lg"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "All Locations" ? "Select Location (Lagos)" : loc}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <ChevronRight className="rotate-90 h-6 w-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Themes */}
      <div className="border-b border-border bg-background sticky top-[64px] z-10 overflow-hidden px-4 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center gap-4 py-4 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
            Event Themes
          </span>
          <div className="flex gap-2 min-w-max pr-4">
            {EVENT_THEMES.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2 ${selectedTheme === theme
                  ? "border-primary bg-primary/5 text-primary shadow-sm scale-105"
                  : "border-transparent bg-secondary/30 text-muted-foreground hover:bg-secondary hover:border-border"
                  }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="border-b border-border bg-secondary/30 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl py-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {["All Categories", "Venues", "Catering", "Photography", "Entertainment", "Decor", "Planning"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as VendorCategory)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                  ? "bg-primary text-foreground"
                  : "bg-background text-foreground hover:bg-secondary"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/30 px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/explore/vendors" className="hover:text-foreground">
            Explore Vendors
          </Link>
          {selectedCategory !== "All Categories" && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{selectedCategory}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <section className="bg-background px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Search */}
          <div className="relative max-w-md text-foreground">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
            <Input
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-foreground"
            />
          </div>

          {/* Results Count */}
          <p className="mt-6 text-sm text-muted-foreground">
            Showing {visibleVendors.length} of {filteredVendors.length} vendors
          </p>

          {/* Vendor Grid */}
          {filteredVendors.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {visibleVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-lg font-medium text-foreground">
                No vendors found
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters or search to find what you are
                looking for.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleClearAll}
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() =>
                  setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                }
                className="border-border text-foreground hover:bg-secondary"
              >
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-secondary/50 px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              Vendor Services Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Find answers to common questions about Vendor Services in Lagos
            </p>
          </div>
          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.id || i}
                value={`faq-${faq.id || i}`}
                className="border-border"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}