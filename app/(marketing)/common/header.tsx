"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-2">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between rounded-full bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Link href="/" className="flex items-center gap-2" onClick={closeMobile}>
          <img src="/logo.png" alt="Waddi Logo" className="h-8 w-auto object-contain" />
          <span className="font-logo text-xl font-normal text-foreground">Waddi</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Main navigation">
          <Link href="/explore/experiences" className="text-sm font-semibold text-foreground transition-colors hover:text-primary">
            Explore
          </Link>
          {user ? (
            <Link href="/dashboard" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Open workspace
            </Link>
          ) : (
            <Link href="/auth/login" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Start planning
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="rounded-full p-2 text-foreground transition-colors hover:bg-secondary md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-2 w-full max-w-5xl rounded-3xl border border-border bg-background p-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <Link href="/explore/experiences" onClick={closeMobile} className="rounded-xl px-3 py-3 text-sm font-semibold text-foreground hover:bg-secondary">
              Explore experiences
            </Link>
            {user ? (
              <Link href="/dashboard" onClick={closeMobile} className="rounded-xl bg-primary px-3 py-3 text-center text-sm font-semibold text-primary-foreground">
                Open workspace
              </Link>
            ) : (
              <Link href="/auth/login" onClick={closeMobile} className="rounded-xl bg-primary px-3 py-3 text-center text-sm font-semibold text-primary-foreground">
                Start planning
              </Link>
            )}
            {user && (
              <button
                type="button"
                onClick={async () => {
                  await signOut(auth)
                  closeMobile()
                }}
                className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
