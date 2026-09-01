import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Calendar, Phone, Mail } from "lucide-react"

export default function RequestDemoPage() {
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
              Get in touch with our team to learn how Waddi can support your next event.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            {/* What to expect - right column */}
            <div>
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
                  <span>We will talk through next steps and options that fit your needs.</span>
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
                      Monday to Friday, 9:00 AM to 6:00 PM WAT. Contact us and we will arrange a convenient time.
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
                    <a href="mailto:hello@waddi.cc" className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                      hello@waddi.cc
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
