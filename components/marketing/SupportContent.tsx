"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mail, MessageCircle, Sparkles } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FAQ, FAQCategory } from "@/lib/types"

interface SupportContentProps {
    faqs: FAQ[]
    categories: FAQCategory[]
}

export default function SupportContent({ faqs, categories }: SupportContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("all")
    const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
        {
            role: "bot",
            text: "Hey! I can help with payments, vendor bookings, and event planning. Pick a topic to get started."
        }
    ])
    const scrollRef = useRef<HTMLDivElement>(null)

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === "all" || faq.category === activeCategory
        return matchesSearch && matchesCategory
    })
    const initialOptions = useMemo(() => faqs.slice(0, 6), [faqs])

    const addFaqExchange = (faq: FAQ) => {
        setMessages((prev) => [
            ...prev,
            { role: "user", text: faq.question },
            { role: "bot", text: faq.answer }
        ])
    }

    const handleAsk = () => {
        const query = searchQuery.trim()
        if (!query) return
        if (filteredFaqs.length > 0) {
            addFaqExchange(filteredFaqs[0])
        } else {
            setMessages((prev) => [
                ...prev,
                { role: "user", text: query },
                { role: "bot", text: "I couldn’t find a direct match. Try another topic or contact support below." }
            ])
        }
        setSearchQuery("")
    }

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    }, [messages])

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-2xl h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center overflow-hidden">
                            <img src="/logo.png" alt="Waddi" className="h-5 w-5 object-contain" />
                        </div>
                        <div>
                            <div className="text-sm font-bold">Waddi Support</div>
                            <div className="text-[11px] text-muted-foreground">+2349053066692 · support@waddibot.com</div>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Online
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="px-6 py-6 space-y-5 bg-[radial-gradient(circle_at_top,_hsl(var(--secondary)/0.35),_transparent_60%)] overflow-y-auto flex-1"
                >
                    {messages.map((m, idx) => (
                        <div
                            key={`${m.role}-${idx}`}
                            className={m.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary/50 text-foreground"
                                    }`}
                            >
                                {m.text}
                            </div>
                            {idx === 0 && m.role === "bot" && initialOptions.length > 0 && (
                                <div className="max-w-[85%] mt-2 rounded-2xl bg-secondary/50 px-4 py-3 text-sm text-foreground">
                                    <div className="flex flex-wrap gap-2">
                                        {initialOptions.map((faq) => (
                                            <button
                                                key={faq.id}
                                                onClick={() => addFaqExchange(faq)}
                                                className="rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                                            >
                                                {faq.question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredFaqs.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                            No answers matched that search. Try different keywords or message support directly.
                        </div>
                    )}
                </div>

                <div className="border-t border-border px-6 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex-1 flex items-center gap-2 rounded-2xl border border-border bg-background px-2 py-2">
                            <div className="flex items-center gap-2">
                                <TooltipProvider delayDuration={120}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" aria-label="Email support" className="h-9 w-9 rounded-xl p-0 text-muted-foreground hover:text-foreground">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Email support</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button asChild variant="ghost" aria-label="WhatsApp" className="h-9 w-9 rounded-xl p-0 text-muted-foreground hover:text-foreground">
                                                <Link href="https://wa.me/">
                                                    <FaWhatsapp className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Chat with support</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button asChild variant="ghost" aria-label="Plan with Waddi" className="h-9 w-9 rounded-xl p-0 text-muted-foreground hover:text-foreground">
                                                <Link href="/dashboard/hosts">
                                                    <Sparkles className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Plan with Waddi</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ask a question..."
                                className="w-full bg-transparent text-sm outline-none"
                            />
                        </div>
                        <Button onClick={handleAsk} className="h-11 rounded-2xl bg-primary px-6 font-bold text-foreground hover:bg-primary/90">
                            Ask
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}
