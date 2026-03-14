import Link from "next/link"
import type { ReactNode } from "react"
import { BookOpen, TrendingUp, Gift, Sparkles } from "lucide-react"

const docsNav = [
  { href: "/docs", label: "Overview", icon: BookOpen },
  { href: "/docs/playbook", label: "Hosting and Planning", icon: TrendingUp },
  { href: "/docs/experiences", label: "Vendors and Bookings", icon: Sparkles },
  { href: "/docs/promos-offers", label: "Payments and Security", icon: Gift },
]

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
          <div className="sticky top-0 flex h-screen flex-col p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Help Center</p>
            <nav className="mt-4 space-y-1 text-sm">
              {docsNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 font-semibold text-foreground hover:bg-muted/50 transition-colors"
                >
                  <item.icon size={16} className="text-muted-foreground" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-background px-4 py-8 lg:px-10">
          <nav className="mb-6 flex gap-3 overflow-x-auto pb-2 lg:hidden">
            {docsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-foreground underline decoration-muted-foreground underline-offset-4"
              >
                <item.icon size={14} className="text-muted-foreground" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Knowledge Base</p>
            <article className="mt-4 space-y-10 text-base font-medium leading-7 text-foreground">
              {children}
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}
