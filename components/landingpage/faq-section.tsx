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
      "Waddi is an event planning marketplace for Lagos. Find vendors for weddings, corporate gatherings, and other events.",
  },
  {
    question: "How does Waddi simplify event planning?",
    answer:
      "Browse vendor videos, compare services, choose who you want to contact, and request quotes in one place.",
  },
  {
    question: "What kinds of events can I organize using Waddi?",
    answer:
      "You can organize a wide range of events including weddings, kids birthday parties, corporate events, yacht parties, baby showers, engagement parties, graduations, proposals, anniversary parties, and private chef/home events.",
  },
  {
    question: "Is Waddi app free to use?",
    answer:
      "Yes. Event planners can browse vendors, view portfolios, and request quotes for free. Vendors pay a listing fee to display their services.",
  },
  {
    question: "What makes Waddi different from traditional event planning?",
    answer:
      "Waddi lets you see vendors in action before booking. You can compare prices, read reviews, and message the vendors you choose.",
  },
  {
    question: "Can businesses partner with Waddi?",
    answer:
      "Yes. If you are an event vendor or service provider in Lagos, you can list your business on Waddi and reach potential clients.",
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
