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
            <main className="flex-1">
                <section className="container mx-auto max-w-2xl px-4 py-10">
                    <SupportContent faqs={faqs} categories={FAQ_CATEGORIES} />
                </section>
            </main>
        </div>
    )
}
