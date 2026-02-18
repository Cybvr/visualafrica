import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"

export const metadata = {
  title: "AI Usage Policy | Waddi",
  description: "How AI features are used within Waddi and your responsibilities.",
}

export default function AiPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-secondary/30 px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-serif text-4xl font-bold md:text-5xl">AI Usage Policy</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: February 18, 2026</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-bold">1. Scope</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                This policy describes AI-assisted features on Waddi, including planning suggestions and workflow support.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">2. AI Output Limitations</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                AI-generated content may be incomplete or inaccurate and should be reviewed before making decisions.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">3. Prohibited Uses</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                You may not use AI features to create unlawful, harmful, deceptive, or rights-infringing content.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">4. Data Handling</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Data submitted to AI features is handled according to our Privacy Policy and security practices.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">5. Contact</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                For AI policy questions, contact <a href="mailto:hello@waddi.com" className="text-primary hover:underline">hello@waddi.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
