"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Search, SlidersHorizontal, X, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { VendorCard } from "@/components/vendor-card"
import { VendorFilters } from "@/components/vendor-filters"
import { VendorDetail } from "@/components/vendor-detail"
import {
  vendors,
  getVendorBySlug,
  CATEGORY_SLUG_MAP,
  VENDOR_FAQ,
  type EventTheme,
  type VendorCategory,
} from "@/lib/vendors-data"

const ITEMS_PER_PAGE = 6

export default function ExploreVendorsPage() {
  const params = useParams()
  const segments = (params?.category as string[] | undefined) ?? []
  const firstSegment = segments[0] ?? null

  // Check if this is a vendor detail page (slug not matching any category)
  const isVendorDetail =
    firstSegment !== null && !(firstSegment in CATEGORY_SLUG_MAP)
  const vendorData = isVendorDetail ? getVendorBySlug(firstSegment) : undefined

  if (isVendorDetail && vendorData) {
    return <VendorDetail vendor={vendorData} />
  }

  // Otherwise, render the listing page
  return <VendorListingContent categorySlug={firstSegment} />
}

function VendorListingContent({
  categorySlug,
}: {
  categorySlug: string | null
}) {
  // Determine initial category from URL
  const initialCategory: VendorCategory = categorySlug
    ? CATEGORY_SLUG_MAP[categorySlug] ?? "All Categories"
    : "All Categories"

  const [selectedTheme, setSelectedTheme] = useState<EventTheme>("All Themes")
  const [selectedCategory, setSelectedCategory] =
    useState<VendorCategory>(initialCategory)
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const filteredVendors = useMemo(() => {
    let result = [...vendors]

    if (selectedCategory !== "All Categories") {
      result = result.filter((v) => v.categories.includes(selectedCategory))
    }

    if (selectedTheme !== "All Themes") {
      result = result.filter((v) => v.eventThemes.includes(selectedTheme))
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
  }, [selectedCategory, selectedTheme, search])

  const visibleVendors = filteredVendors.slice(0, visibleCount)
  const hasMore = visibleCount < filteredVendors.length

  const handleClearAll = () => {
    setSelectedTheme("All Themes")
    setSelectedCategory("All Categories")
    setSearch("")
  }

  const categoryTitle =
    selectedCategory !== "All Categories" ? selectedCategory : "All Vendors"
  const pageTitle = `Event Vendors Lagos | ${categoryTitle}, Catering & More`
  const pageDescription =
    "For every party planner in Lagos, explore packages with caterers, decorators, and entertainment. We make party planning simple, fast, and fun for any occasion."

  // Active filter pills
  const activeFilters: { label: string; onRemove: () => void }[] = []
  if (selectedCategory !== "All Categories") {
    activeFilters.push({
      label: selectedCategory,
      onRemove: () => setSelectedCategory("All Categories"),
    })
  }
  if (selectedTheme !== "All Themes") {
    activeFilters.push({
      label: selectedTheme,
      onRemove: () => setSelectedTheme("All Themes"),
    })
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-foreground px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-serif text-3xl font-bold text-background md:text-4xl text-balance">
            {pageTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-background/70 md:text-base">
            {pageDescription}
          </p>
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
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Desktop Sidebar Filters */}
            <div className="hidden lg:block">
              <VendorFilters
                selectedTheme={selectedTheme}
                selectedCategory={selectedCategory}
                onThemeChange={setSelectedTheme}
                onCategoryChange={setSelectedCategory}
                onClearAll={handleClearAll}
              />
            </div>

            {/* Main Column */}
            <div className="flex-1">
              {/* Search + Mobile Filter Toggle */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 lg:hidden"
                  onClick={() => setShowMobileFilters(true)}
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Active Filter Pills */}
              {activeFilters.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeFilters.map((f) => (
                    <Badge
                      key={f.label}
                      variant="secondary"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                    >
                      {f.label}
                      <button onClick={f.onRemove} aria-label={`Remove ${f.label} filter`}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Results Count */}
              <p className="mt-4 text-sm text-muted-foreground">
                Showing {visibleVendors.length} of {filteredVendors.length}{" "}
                vendors
              </p>

              {/* Vendor Grid */}
              {filteredVendors.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
          </div>
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
            {VENDOR_FAQ.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
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

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative ml-auto h-full w-80 max-w-full overflow-y-auto bg-background p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>
            <div className="mt-6">
              <VendorFilters
                selectedTheme={selectedTheme}
                selectedCategory={selectedCategory}
                onThemeChange={(t) => {
                  setSelectedTheme(t)
                }}
                onCategoryChange={(c) => {
                  setSelectedCategory(c)
                }}
                onClearAll={() => {
                  handleClearAll()
                  setShowMobileFilters(false)
                }}
              />
            </div>
            <Button
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowMobileFilters(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
