import Link from "next/link"
import { Facebook, Instagram, MessageCircle } from "lucide-react"
import { solutions } from "@/lib/solutions-data"
import { platformFeatures } from "@/lib/platform-data"

const quickLinks = [
  { label: "Vendor Signup", href: "/vendor-signup" },
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/support" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
]

// Build solutions links from data
const solutionLinks = solutions.map((s) => ({
  label: s.title,
  href: `/solutions/${s.slug}`,
}))

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Notice", href: "/cookies" },
  { label: "AI Usage Policy", href: "/ai-policy" },
  { label: "Legal", href: "/legal" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      {/* CTA Banner */}
      <div className="bg-primary px-4 py-16 text-center text-white">
        <h2 className="font-serif text-3xl font-bold md:text-4xl">
          Connect | Create | Celebrate
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed opacity-90 md:text-base">
          We connect you with the finest vendors in Lagos for your event. Browse
          through inspiring video reels, select vendors and receive quotes,
          effortlessly.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 transition-colors hover:bg-primary-foreground/30"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 transition-colors hover:bg-primary-foreground/30"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 transition-colors hover:bg-primary-foreground/30"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Waddi Logo" className="h-12 w-auto object-contain" />
              <span className="font-logo text-5xl font-normal">
                Waddi
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              We connect African vendors with diaspora clients planning events back home.
            </p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-50">
                Current Location
              </p>
              <p className="mt-1 text-sm font-medium">Lagos</p>
            </div>
          </div>

          {/* Thunder About (formerly Company + Quick Links) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50">
              Thunder About
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-70 transition-opacity hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50">
              Platform
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {platformFeatures.map((feature) => (
                <li key={feature.title}>
                  <Link
                    href={feature.href}
                    className="text-sm opacity-70 transition-opacity hover:opacity-100"
                  >
                    {feature.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50">
              Solutions
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {solutionLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-70 transition-opacity hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs opacity-50 transition-opacity hover:opacity-80"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs opacity-50">
            &copy; 2026 Waddi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
