import type { Metadata } from "next"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BookOpen, CreditCard, CalendarCheck, Users, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Help Center | Waddi",
}

export default function DocsOverviewPage() {
  const categories = [
    {
      title: "Hosting and Planning",
      description: "Start events, build timelines, and keep tasks organized.",
      href: "/docs/playbook",
      icon: CalendarCheck,
      articles: [
        "Start a new event",
        "Build a planning timeline",
        "Invite collaborators",
      ],
    },
    {
      title: "Vendors and Bookings",
      description: "Find vendors, request quotes, and manage bookings.",
      href: "/docs/experiences",
      icon: Users,
      articles: [
        "Search and filter vendors",
        "Request a quote",
        "Confirm a booking",
      ],
    },
    {
      title: "Payments and Security",
      description: "Understand deposits, refunds, and account safety.",
      href: "/docs/promos-offers",
      icon: CreditCard,
      articles: [
        "Payment methods",
        "Refunds and disputes",
        "Security tips",
      ],
    },
  ]

  const popular = [
    { label: "Create a new event", href: "/docs/playbook" },
    { label: "Request a vendor quote", href: "/docs/experiences" },
    { label: "Pay a deposit securely", href: "/docs/promos-offers" },
    { label: "Invite a co-host", href: "/docs/playbook" },
  ]

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground">
          <BookOpen size={14} className="text-muted-foreground" />
          Knowledge Base
        </div>
        <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
        <p className="text-base text-muted-foreground">
          Browse categories or search for quick answers about planning, bookings, and payments.
        </p>
      </header>

      <section className="space-y-3">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-3.5 text-muted-foreground" />
          <Input
            placeholder="Search articles"
            className="pl-9 h-11"
            aria-label="Search articles"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Tip: Try “refund”, “quote”, or “timeline”.
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center">
                <cat.icon size={18} className="text-foreground" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{cat.title}</div>
                <div className="text-xs text-muted-foreground">{cat.description}</div>
              </div>
            </div>
            <div className="mt-4 text-xs font-semibold text-muted-foreground">Top articles</div>
            <ul className="mt-2 space-y-1 text-sm text-foreground">
              {cat.articles.map((a) => (
                <li key={a} className="truncate">{a}</li>
              ))}
            </ul>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Popular articles</h2>
        <ul className="space-y-2">
          {popular.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-sm font-medium text-foreground underline decoration-muted-foreground underline-offset-4">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-muted/30 p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-foreground">Still need help?</div>
          <div className="text-xs text-muted-foreground">Chat with support for account or booking issues.</div>
        </div>
        <Button asChild>
          <Link href="/support">Contact Support</Link>
        </Button>
      </section>
    </div>
  )
}
