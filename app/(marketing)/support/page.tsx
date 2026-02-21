import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { getFaqs } from "@/lib/firestore-service"
import SupportContent from "@/components/marketing/SupportContent"
import { FAQCategory } from "@/lib/types"

const FAQ_CATEGORIES: FAQCategory[] = [
    { id: 'general', label: 'General' },
    { id: 'hosts', label: 'For Hosts' },
    { id: 'vendors', label: 'For Vendors' },
    { id: 'payments', label: 'Payments & Security' },
];

export default async function SupportPage() {
    const faqs = await getFaqs()

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
                    <div className="absolute inset-x-0 bottom-0 box-content h-24 w-full translate-y-px fill-background">
                        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-full">
                            <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>

                    <div className="container relative mx-auto max-w-5xl px-4 text-center">
                        <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            How can we <span className="text-primary italic">help?</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                            Find answers to common questions about Waddi, planning events in Africa, and managing your bookings.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="container mx-auto max-w-5xl px-4 py-16">
                    <SupportContent faqs={faqs} categories={FAQ_CATEGORIES} />
                </section>
            </main>

            <Footer />
        </div>
    )
}
