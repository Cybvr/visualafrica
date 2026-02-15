"use client"

import { useEffect } from "react"
import Cal, { getCalApi } from "@calcom/embed-react"
import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Calendar, Phone, Mail } from "lucide-react"

export default function RequestDemoPage() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" })
      cal?.("ui", { hideEventTypeDetails: false, layout: "month_view" })
    })()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 md:px-12 lg:px-16 xl:px-20">
          {/* Hero */}
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
              Request a Demo
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Schedule a free consultation with our team. Pick a time that works for you.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Cal.com embed - left column */}
            <div className="lg:col-span-3">
              <h2 className="font-serif text-2xl font-bold mb-6">Choose a time</h2>
              <div className="min-h-[600px] w-full overflow-hidden rounded-xl border border-border bg-card p-4">
                <Cal
                  namespace="30min"
                  calLink="pinheirojide/30min"
                  style={{ width: "100%", height: "100%", overflow: "scroll" }}
                  config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
                />
              </div>
            </div>

            {/* What to expect - right column */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-bold">What to expect</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">1</span>
                  <span>Pick a date and time that works for you.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">2</span>
                  <span>A quick call to understand your event and how we can help.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">3</span>
                  <span>Next steps and options tailored to your needs—no pressure.</span>
                </li>
              </ul>

              <div className="mt-12 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Availability</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Mon–Fri, 9:00 AM – 6:00 PM WAT. Choose any slot in the calendar.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Prefer to reach out?</h3>
                    <a href="tel:+2341234567890" className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                      +234 123 456 7890
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email us</h3>
                    <a href="mailto:hello@waddi.com" className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                      hello@waddi.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
