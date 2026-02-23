import Link from "next/link"
import { Button } from "@/components/ui/button"

const capabilities = ["Plan", "Budget", "Discover", "Track"]

const sampleMessages = [
  {
    role: "agent",
    text: "Hi, I'm Ama. I can find vendors, negotiate deals, and coordinate your event end-to-end.",
  },
  {
    role: "user",
    text: "Help me plan a Lagos birthday party for 120 guests.",
  },
  {
    role: "agent",
    text: "Perfect. I found top Lagos vendors and built a first budget draft. Want me to shortlist options now?",
  },
]

export function AmaSection() {
  return (
    <section className="bg-secondary/20 py-20 lg:py-24">
      <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Meet Waddi</p>
          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Your AI event agent for planning across Africa.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Ama helps you discover vendors, manage bookings, and keep budgets on track while you plan from anywhere.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {capabilities.map((capability) => (
              <span
                key={capability}
                className="rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-bold text-foreground"
              >
                {capability}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/dashboard/hosts">Chat with Waddi</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-lg">
          <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
            <img src="/images/logo.png" alt="Ama" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-bold text-foreground">Ama</p>
              <p className="text-xs text-muted-foreground">Online now</p>
            </div>
          </div>
          <div className="space-y-3">
            {sampleMessages.map((message, idx) => (
              <div
                key={`${message.role}-${idx}`}
                className={
                  message.role === "agent"
                    ? "max-w-[90%] rounded-2xl rounded-bl-none border border-border bg-background px-3 py-2 text-sm text-foreground"
                    : "ml-auto max-w-[85%] rounded-2xl rounded-br-none bg-primary px-3 py-2 text-sm text-primary-foreground"
                }
              >
                {message.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
