import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"

export const metadata = {
  title: "Terms of Service | Waddi",
  description: "Terms governing your use of the Waddi platform.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-secondary/30 px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Terms of Service</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: February 18, 2026</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-bold">1. Agreement to Terms</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                By accessing or using Waddi, you agree to these Terms and applicable laws.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">2. Accounts and Eligibility</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                You are responsible for maintaining account security and providing accurate account details.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">3. Bookings and Payments</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Payment terms, escrow conditions, fees, and cancellation rules may vary by booking and are shown during checkout.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">4. Acceptable Use</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                You agree not to misuse the platform, submit unlawful content, or interfere with service operations.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">5. Limitation of Liability</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Waddi is not liable for indirect or consequential damages.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">6. Contact</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Questions about these terms can be sent to <a href="mailto:hello@waddi.cc" className="text-primary hover:underline">hello@waddi.cc</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
