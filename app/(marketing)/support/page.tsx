"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { FAQS, FAQ_CATEGORIES } from "@/lib/faqs-data"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mail, MessageCircle, ArrowRight } from "lucide-react"

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("all")

    const filteredFaqs = FAQS.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === "all" || faq.category === activeCategory
        return matchesSearch && matchesCategory
    })

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

                        <div className="mx-auto mt-10 max-w-2xl relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search for answers..."
                                    className="h-14 w-full rounded-2xl border-none bg-background pl-12 pr-4 text-lg shadow-xl ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="container mx-auto max-w-5xl px-4 py-16">
                    <div className="flex flex-col gap-12 lg:flex-row">
                        {/* Sidebar Categories */}
                        <aside className="w-full lg:w-64 space-y-4">
                            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 px-4">Categories</h2>
                            <nav className="flex flex-wrap gap-2 lg:flex-col">
                                <button
                                    onClick={() => setActiveCategory("all")}
                                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all lg:rounded-xl lg:text-left ${activeCategory === "all"
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        }`}
                                >
                                    All Questions
                                </button>
                                {FAQ_CATEGORIES.map((cat: any) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all lg:rounded-xl lg:text-left ${activeCategory === cat.id
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        {/* Questions List */}
                        <div className="flex-1 space-y-8">
                            {filteredFaqs.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full space-y-4 border-none">
                                    {filteredFaqs.map((faq: any) => (
                                        <AccordionItem
                                            key={faq.id}
                                            value={`item-${faq.id}`}
                                            className="rounded-2xl border border-border bg-card px-4 py-2 shadow-sm transition-all hover:shadow-md data-[state=open]:border-primary/30 data-[state=open]:shadow-primary/5"
                                        >
                                            <AccordionTrigger className="text-left font-serif text-lg font-bold hover:no-underline">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                                        <Search className="h-8 w-8" />
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold">No results found</h3>
                                    <p className="mt-2 text-muted-foreground">We couldn't find any answers matching your search. Try different keywords or contact us directly.</p>
                                    <Button variant="outline" className="mt-6 rounded-xl" onClick={() => { setSearchQuery(""); setActiveCategory("all") }}>
                                        Clear Search
                                    </Button>
                                </div>
                            )}

                            {/* Still have questions */}
                            <div className="mt-16 rounded-3xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-8 lg:p-12 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MessageCircle className="w-32 h-32" />
                                </div>
                                <div className="relative">
                                    <h2 className="font-serif text-2xl font-bold md:text-3xl">Still have questions?</h2>
                                    <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
                                        Can't find the answer you're looking for? Our support team is here to help you with anything you need to make your event a success.
                                    </p>
                                    <div className="mt-8 flex flex-wrap gap-4">
                                        <Button className="h-12 rounded-xl bg-primary px-8 font-bold text-foreground hover:bg-primary/90">
                                            <Mail className="mr-2 h-4 w-4" />
                                            Email Support
                                        </Button>
                                        <Button asChild variant="outline" className="h-12 rounded-xl border-primary/20 bg-background px-8 font-bold text-primary hover:bg-primary/10">
                                            <Link href="/dashboard/hosts/ama">
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            Chat with Ama
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
