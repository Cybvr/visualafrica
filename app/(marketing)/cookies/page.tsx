import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"

export const metadata = {
  title: "Cookie Notice | Waddi",
  description: "How Waddi uses cookies and similar technologies.",
}

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-secondary/30 px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Cookie Notice</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: February 18, 2026</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-bold">1. What Are Cookies?</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Cookies are small text files stored on your device that help websites remember preferences and improve experience.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">2. How We Use Cookies</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We use cookies for core functionality, analytics, security, and performance optimization.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">3. Cookie Categories</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Categories may include essential, preference, analytics, and marketing cookies where applicable.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">4. Managing Cookies</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                You can manage or disable cookies through browser settings, though some features may not function properly.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">5. Contact</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                For cookie questions, contact <a href="mailto:hello@waddi.cc" className="text-primary hover:underline">hello@waddi.cc</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
