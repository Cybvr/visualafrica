import { Button } from "@/components/ui/button"

export function EventExperts() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Meet our in-house <br /> event experts
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Our experienced team of full-time event planners can turn any idea or budget into a one-of-a-kind event.
                        </p>
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                            Meet the team
                        </Button>


                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                            <div key={i} className="aspect-square bg-muted rounded-2xl overflow-hidden relative">
                                {/* Fallback pattern if images aren't available */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary">Expert {i}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
