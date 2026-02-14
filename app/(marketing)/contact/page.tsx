import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center">
                        <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
                            Get in Touch
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-12 lg:grid-cols-2">
                        {/* Contact Form */}
                        <div>
                            <h2 className="font-serif text-2xl font-bold">Send us a Message</h2>
                            <form className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Tunde Bakare"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="tunde@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="font-serif text-2xl font-bold">Contact Information</h2>
                            <div className="mt-6 space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <a
                                            href="mailto:hello@Waddi.com"
                                            className="mt-1 text-muted-foreground hover:text-primary"
                                        >
                                            hello@Waddi.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Phone</h3>
                                        <a
                                            href="tel:+2341234567890"
                                            className="mt-1 text-muted-foreground hover:text-primary"
                                        >
                                            +234 123 456 7890
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Location</h3>
                                        <p className="mt-1 text-muted-foreground">
                                            Lagos, Nigeria
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="mt-12">
                                <h3 className="font-serif text-xl font-bold">Business Hours</h3>
                                <div className="mt-4 space-y-2 text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span>9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span>10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span>Closed</span>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="mt-12 rounded-lg border border-border bg-card p-6">
                                <h3 className="font-semibold">Looking for Quick Answers?</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Check out our FAQ section for answers to common questions.
                                </p>
                                <a
                                    href="/faqs"
                                    className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                                >
                                    Visit FAQs →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
