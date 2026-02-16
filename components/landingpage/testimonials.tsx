import { Button } from "@/components/ui/button"
import { Quote } from "lucide-react"
import Image from "next/image"

export function Testimonials() {
    const reviews = [
        {
            quote: "Every facet of the experience was executed with a level of precision that left us in awe... Their meticulous attention to detail was truly unparalleled...",
            author: "Chioma Okafor",
            title: "CEO",
            company: "A+ Digital",
            image: "/testimonials/chioma-okafor.png"
        },
        {
            quote: "Waddi did a lot of the decision making for us in terms of things to try, and gave us better options than I could have found on my own.",
            author: "Adebayo Adeleke",
            title: "Principal Engineer",
            company: "Atomic Tech",
            image: "/testimonials/adebayo-adeleke.png"
        },
        {
            quote: "Waddi is an absolute game changer for planning events. The event went without a hitch and will be using them again. Fantastic folks working there!",
            author: "Ngozi Eze",
            title: "Founder",
            company: "TrustedSec",
            image: "/testimonials/ngozi-eze.png"
        }
    ]

    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
                        5-star events.
                    </h2>
                    <h3 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                        Trusted by top companies.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-background rounded-3xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow">
                            {/* Image Section - Large and Prominent */}
                            <div className="relative h-80 w-full bg-gradient-to-br from-primary/5 to-accent/5">
                                <Image
                                    src={review.image}
                                    alt={review.author}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="p-8 flex flex-col flex-1">
                                <Quote className="h-10 w-10 text-primary/30 mb-4" />
                                <p className="text-base leading-relaxed text-foreground italic mb-6 flex-1">
                                    "{review.quote}"
                                </p>
                                <div className="border-t border-border pt-6">
                                    <p className="font-bold text-foreground text-lg">{review.author}</p>
                                    <p className="text-sm text-muted-foreground">{review.title}, {review.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}