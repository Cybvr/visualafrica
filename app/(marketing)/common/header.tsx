"use client"

import { useState, useEffect, useMemo } from "react"
import type { ComponentType } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  ChevronDown,
  Search,
  CalendarCheck,
  Activity,
  CreditCard,
  Users,
  Map,
  Presentation,
  Video,
  Globe,
  LayoutGrid,
  Zap,
  FileText,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth"
import { getPlatformFeatures, getSolutions } from "@/lib/firestore-service"
import { Offering, PlatformFeature } from "@/lib/types"

const eventTypeSlugs = ["offsites-retreats", "client-events", "skos", "conferences", "incentive-trips"]
const serviceOfferingSlugs = ["full-service-planning", "expedited-planning"]

const platformIconMap: Record<string, ComponentType<{ className?: string }>> = {
  Discover: Search,
  Book: CalendarCheck,
  Track: Activity,
  Pay: CreditCard,
}

const offeringIconMap: Record<string, ComponentType<{ className?: string }>> = {
  "offsites-retreats": Map,
  "client-events": Users,
  skos: Presentation,
  conferences: Video,
  "incentive-trips": Globe,
  "full-service-planning": LayoutGrid,
  "expedited-planning": Zap,
}

type AuthUser = FirebaseUser | null

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<AuthUser>(null)
  const [solutions, setSolutions] = useState<Offering[]>([])
  const [platformFeatures, setPlatformFeatures] = useState<PlatformFeature[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    async function loadMenuData() {
      try {
        const [solutionData, platformData] = await Promise.all([
          getSolutions(),
          getPlatformFeatures(),
        ])
        setSolutions(solutionData)
        setPlatformFeatures(platformData)
      } catch (error) {
        console.error("Failed to load navigation data:", error)
      }
    }
    loadMenuData()
  }, [])

  const eventTypes = useMemo(
    () =>
      solutions
        .filter((o) => eventTypeSlugs.includes(o.slug))
        .map((o) => ({
          label: o.title,
          href: `/solutions/${o.slug}`,
          slug: o.slug,
        })),
    [solutions]
  )

  const serviceSolutions = useMemo(
    () =>
      solutions
        .filter((o) => serviceOfferingSlugs.includes(o.slug))
        .map((o) => ({
          label: o.title,
          href: `/solutions/${o.slug}`,
          slug: o.slug,
        })),
    [solutions]
  )


  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full pt-2">
      <div className="mx-auto flex w-[95%] max-w-5xl items-center justify-between rounded-full bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Waddi Logo" className="h-8 w-auto object-contain" />
            <span className="font-logo text-xl font-normal text-foreground">
              Waddi
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none">
              Platform
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[500px] border-none bg-background p-4 shadow-2xl rounded-3xl">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div className="col-span-2 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Platform Features</span>
                </div>
                {platformFeatures.map((feature) => {
                  const Icon = platformIconMap[feature.title]
                  return (
                    <DropdownMenuItem key={feature.title} asChild className="p-0 focus:bg-transparent">
                      <Link href={feature.href} className="group flex items-start gap-3 rounded-2xl p-3 transition-all hover:bg-secondary/50">
                        {Icon && (
                          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-card text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-bold text-foreground">
                            {feature.title}
                          </span>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                            {feature.description}
                          </p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none">
              Solutions
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[600px] border-none bg-background p-6 shadow-2xl rounded-3xl">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block border-b border-border/50 pb-1">Event Types</span>
                  <div className="space-y-1">
                    {eventTypes.map((item) => {
                      const Icon = "slug" in item ? offeringIconMap[item.slug] : null
                      return (
                        <DropdownMenuItem key={item.label} asChild className="p-0 focus:bg-transparent">
                          <Link href={item.href} className="group flex items-center gap-3 rounded-2xl p-2 transition-all hover:bg-secondary/50">
                            {Icon && (
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon className="h-4 w-4" />
                              </span>
                            )}
                            <span className="text-sm font-bold leading-tight text-foreground">
                              {item.label}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block border-b border-border/50 pb-1">Service Solutions</span>
                  <div className="space-y-1">
                    {serviceSolutions.map((item) => {
                      const Icon = "slug" in item ? offeringIconMap[item.slug] : null
                      return (
                        <DropdownMenuItem key={item.label} asChild className="p-0 focus:bg-transparent">
                          <Link href={item.href} className="group flex items-center gap-3 rounded-2xl p-2 transition-all hover:bg-secondary/50">
                            {Icon && (
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon className="h-4 w-4" />
                              </span>
                            )}
                            <span className="text-sm font-bold leading-tight text-foreground">
                              {item.label}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none">
              Resources
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[280px] border-none bg-background p-4 shadow-2xl rounded-3xl">
              <div className="space-y-2">
                <div className="pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Learn More</span>
                </div>
                <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                  <Link href="/blog" className="group flex items-start gap-3 rounded-2xl p-3 transition-all hover:bg-secondary/50">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-bold text-foreground">
                        Blog
                      </span>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        Tips, guides, and inspiration for planning amazing events
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                  <Link href="/support" className="group flex items-start gap-3 rounded-2xl p-3 transition-all hover:bg-secondary/50">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-bold text-foreground">
                        Support
                      </span>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        Find answers to common questions and get help
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/pricing"
            className="flex items-center rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Pricing
          </Link>
          </nav>
        </div>

        <div className="hidden w-[180px] flex-shrink-0 items-center justify-end gap-3 lg:flex">
          <Link href="/request-demo">
            <Button variant="outline" size="sm" className="flex items-center gap-2 border-primary/20 text-primary hover:bg-primary hover:text-foreground">
              Request a Demo
            </Button>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Account <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className=" border-none bg-background p-6 shadow-2xl rounded-3xl">
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
              <Button size="sm" className="flex items-center gap-2 bg-primary text-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] overflow-y-auto sm:w-[400px]">
            <nav className="mt-8 flex flex-col gap-4" aria-label="Mobile navigation">
              <div className="flex flex-col gap-2">
                <span className="px-3 text-sm font-bold text-foreground">Platform</span>
                <div className="ml-4 flex flex-col gap-2 border-l border-border pl-4">
                  {platformFeatures.map((feature) => (
                    <Link
                      key={feature.title}
                      href={feature.href}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {feature.title}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/solutions"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                Solutions
              </Link>
              <div className="ml-4 flex flex-col gap-2 border-l border-border pl-4">
                {eventTypes.concat(serviceSolutions).slice(0, 7).map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/blog"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <Link href="/request-demo" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-foreground">
                    Request a Demo
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
                    <Button className="w-full bg-primary text-foreground hover:bg-primary/90">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
