import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"

export const metadata = {
  title: "Legal | Waddi",
  description: "Important legal information, terms, and policies for using Waddi.",
}

export default function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-secondary/30 px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Legal</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: February 18, 2026</p>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              This page summarizes important legal terms that govern access to and use of Waddi.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-bold">1. Acceptance of Terms</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                By accessing or using Waddi, you agree to comply with these terms and all applicable laws and
                regulations.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">2. Platform Role</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Waddi provides tools that connect event hosts and vendors. Specific service delivery obligations remain
                between the contracting parties, unless expressly stated otherwise.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">3. Payments and Fees</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Pricing, payment timelines, refunds, and applicable fees are communicated in relevant booking flows,
                proposals, or plan details at the time of purchase.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">4. Intellectual Property</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Waddi trademarks, branding, software, and content are protected by intellectual property laws and may
                not be used without permission.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">5. Liability and Disclaimers</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                The platform is provided on an "as available" basis. To the fullest extent permitted by law, Waddi
                disclaims implied warranties and limits liability for indirect or consequential damages.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">6. Contact</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                For legal inquiries, contact <a href="mailto:hello@waddi.com" className="text-primary hover:underline">hello@waddi.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
