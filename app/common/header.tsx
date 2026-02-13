"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VENDOR_CATEGORIES, CATEGORY_SLUG_MAP } from "@/lib/vendors-data"
import { offerings } from "@/lib/offerings-data"

// Build explore categories from vendor data (skip "All Categories")
const categoryToSlug = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_MAP).map(([slug, cat]) => [cat, slug])
)
const exploreCategories = VENDOR_CATEGORIES.filter(
  (c) => c !== "All Categories"
).map((cat) => ({
  label: cat,
  href: `/explore/vendors/${categoryToSlug[cat] ?? cat.toLowerCase().replace(/\s+/g, "-")}`,
}))

// Build offerings nav from data file
const offeringLinks = offerings.map((o) => ({
  label: o.title,
  href: `/offerings/${o.slug}`,
}))

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo and Desktop Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">VA</span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground">
              Visual<span className="text-primary">Africa</span>
            </span>
          </Link>

          {/* Desktop Nav - Now beside the logo */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {/* Explore Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                Explore <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/explore/vendors" className="cursor-pointer font-bold">
                    All Vendors
                  </Link>
                </DropdownMenuItem>
                {exploreCategories.map((cat) => (
                  <DropdownMenuItem key={cat.label} asChild>
                    <Link href={cat.href} className="cursor-pointer font-bold">
                      {cat.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Offerings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                Offerings <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/offerings" className="cursor-pointer font-bold">
                    All Offerings
                  </Link>
                </DropdownMenuItem>
                {offeringLinks.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href} className="cursor-pointer font-bold">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className="rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/list-business">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Talk to an Expert
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="flex flex-col px-4 py-4" aria-label="Mobile navigation">
            <Link
              href="/explore/vendors"
              className="rounded-md px-3 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Explore Vendors
            </Link>
            <div className="ml-4 flex flex-col border-l border-border pl-2">
              {exploreCategories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
            <Link
              href="/offerings"
              className="rounded-md px-3 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Offerings
            </Link>
            <div className="ml-4 flex flex-col border-l border-border pl-2">
              {offeringLinks.slice(0, 5).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/about"
              className="rounded-md px-3 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="rounded-md px-3 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Link href="/list-business" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Talk to an Expert
                </Button>
              </Link>
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
