"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Waddi?",
    answer:
      "Waddi is Lagos's trusted event planner marketplace. We connect you with the finest vendors in Lagos for all types of events, from weddings to corporate gatherings and everything in between.",
  },
  {
    question: "How does Waddi simplify event planning?",
    answer:
      "Waddi streamlines the event planning process by allowing you to browse inspiring video reels from vendors, compare services, select your preferred vendors, and receive quotes all in one place. No more endless phone calls and meetings.",
  },
  {
    question: "What kinds of events can I organize using Waddi?",
    answer:
      "You can organize a wide range of events including weddings, kids birthday parties, corporate events, yacht parties, baby showers, engagement parties, graduations, proposals, anniversary parties, and private chef/home events.",
  },
  {
    question: "Is Waddi app free to use?",
    answer:
      "Yes! Browsing vendors, viewing their portfolios, and requesting quotes is completely free for event planners. Vendors pay a small listing fee to showcase their services on the platform.",
  },
  {
    question: "What makes Waddi different from traditional event planning?",
    answer:
      "Waddi offers a curated, video-first marketplace where you can see vendors in action before booking. Our platform provides transparent pricing, verified reviews, and seamless communication between you and your chosen vendors.",
  },
  {
    question: "Can businesses partner with Waddi?",
    answer:
      "Absolutely! If you're an event vendor or service provider in Lagos, you can list your business on Waddi to reach thousands of potential clients. Visit our 'List Your Business' page to get started.",
  },
]

export function FaqSection() {
  return (
    <section className="bg-secondary/50 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find answers to common questions about Waddi
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-border"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
