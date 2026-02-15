"use client"

import { useState, useEffect } from "react"
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
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { EVENT_THEMES } from "@/lib/vendors-data"

const themeLinks = EVENT_THEMES.filter(t => t !== "All Themes").map(theme => ({
  label: theme,
  href: `/explore/vendors?theme=${encodeURIComponent(theme)}`,
}))

const eventTypeSlugs = ["offsites-retreats", "client-events", "skos", "conferences", "incentive-trips"]
const serviceOfferingSlugs = ["full-service-planning", "expedited-planning"]

const eventTypes = offerings.filter(o => eventTypeSlugs.includes(o.slug)).map(o => ({
  label: o.title,
  href: `/offerings/${o.slug}`,
}))

const serviceOfferings = offerings.filter(o => serviceOfferingSlugs.includes(o.slug)).map(o => ({
  label: o.title,
  href: `/offerings/${o.slug}`,
}))

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full pt-2">
      <div className="py-2 px-4 rounded-full mx-auto flex max-w-5xl items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Visual Africa Logo" className="h-8 w-auto object-contain" />
            <span className="font-logo text-xl font-normal text-foreground">
              Waddi
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none">
                Themes <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[500px] p-4 bg-white rounded-3xl shadow-2xl border-none">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div className="col-span-2 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Choose a Theme</span>
                  </div>
                  {themeLinks.map((theme) => (
                    <DropdownMenuItem key={theme.label} asChild className="p-0 focus:bg-transparent">
                      <Link href={theme.href} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-secondary/50 group transition-all">
                        <span className="text-sm font-bold text-foreground">
                          {theme.label}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none">
                Offerings <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[600px] p-6 bg-white rounded-3xl shadow-2xl border-none">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block pb-1 border-b border-border/50">Event Types</span>
                    <div className="space-y-1">
                      {eventTypes.map((item) => (
                        <DropdownMenuItem key={item.label} asChild className="p-0 focus:bg-transparent">
                          <Link href={item.href} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-secondary/50 group transition-all">
                            <span className="text-sm font-bold text-foreground leading-tight">
                              {item.label}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block pb-1 border-b border-border/50">Service Offerings</span>
                    <div className="space-y-1">
                      {serviceOfferings.map((item) => (
                        <DropdownMenuItem key={item.label} asChild className="p-0 focus:bg-transparent">
                          <Link href={item.href} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-secondary/50 group transition-all">
                            <span className="text-sm font-bold text-foreground leading-tight">
                              {item.label}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/book-a-call">
            <Button variant="outline" size="sm" className="flex items-center gap-2 text-primary hover:bg-primary hover:text-primary-foreground border-primary/20">
              Book a Call
            </Button>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Account <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer font-bold">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-bold text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="flex flex-col px-4 py-4" aria-label="Mobile navigation">
            <Link
              href="/explore/vendors"
              className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Themes
            </Link>
            <div className="ml-4 flex flex-col border-l border-border pl-2">
              {themeLinks.slice(0, 6).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/offerings"
              className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Offerings
            </Link>
            <div className="ml-4 flex flex-col border-l border-border pl-2">
              {eventTypes.concat(serviceOfferings).slice(0, 7).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/about"
              className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Link href="/book-a-call" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Book a Call
                </Button>
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-secondary text-secondary-foreground">
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={() => { handleLogout(); setMobileOpen(false); }} variant="destructive" className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
