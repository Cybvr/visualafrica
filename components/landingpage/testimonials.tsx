import { Button } from "@/components/ui/button"
import { Quote } from "lucide-react"

export function Testimonials() {
    const reviews = [
        {
            quote: "Every facet of the experience was executed with a level of precision that left us in awe... Their meticulous attention to detail was truly unparalleled...",
            author: "Chioma Okafor",
            title: "CEO",
            company: "A+ Digital"
        },
        {
            quote: "Visual Africa did a lot of the decision making for us in terms of things to try, and gave us better options than I could have found on my own.",
            author: "Adebayo Adeleke",
            title: "Principal Engineer",
            company: "Atomic Tech"
        },
        {
            quote: "Visual Africa is an absolute game changer for planning events. The event went without a hitch and will be using them again. Fantastic folks working there!",
            author: "Ngozi Eze",
            title: "Founder",
            company: "TrustedSec"
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
                        <div key={i} className="bg-background p-8 rounded-2xl shadow-sm flex flex-col justify-between">
                            <div>
                                <Quote className="h-8 w-8 text-primary/20 mb-6" />
                                <p className="text-lg leading-relaxed text-foreground italic mb-8">
                                    "{review.quote}"
                                </p>
                            </div>
                            <div className="border-t border-border pt-6">
                                <p className="font-bold text-foreground">{review.author}</p>
                                <p className="text-sm text-muted-foreground">{review.title}, {review.company}</p>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    )
}