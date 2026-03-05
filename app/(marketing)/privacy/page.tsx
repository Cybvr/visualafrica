import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"

export const metadata = {
  title: "Privacy Policy | Waddi",
  description:
    "Learn how Waddi collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-secondary/30 px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: February 18, 2026</p>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              This Privacy Policy explains how Waddi collects, uses, stores, and shares information when you use our
              platform. By using Waddi, you agree to the practices described below.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-bold">1. Information We Collect</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We may collect account details, contact information, event details, payment-related metadata, and
                communication records needed to deliver and improve the service.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">2. How We Use Information</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We use your information to operate the platform, connect hosts and vendors, provide support, prevent
                fraud, and improve product features and reliability.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">3. Sharing and Disclosure</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We share information only as needed to deliver services, comply with legal obligations, or protect
                users and platform integrity. We do not sell personal data.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">4. Data Security</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We use administrative, technical, and organizational safeguards to protect your information, but no
                method of storage or transmission can be guaranteed 100% secure.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">5. Your Choices</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                You may request access, correction, or deletion of your personal information, subject to applicable
                legal and operational requirements.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">6. Contact</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                For privacy questions, contact us at <a href="mailto:hello@waddi.cc" className="text-primary hover:underline">hello@waddi.cc</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
