import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Sparkles } from "lucide-react"

export function FeaturesGrid() {
    const features = [
        {
            title: "Itinerary Builder",
            description: "Build your itinerary in minutes, not days, with Visual Africa’s AI-powered Itinerary Builder.",
            icon: Calendar,
            cta: "Get started"
        },
        {
            title: "Easy Guest Management",
            description: "Easily manage event attendees with attendee management tools.",
            icon: Users,
            cta: "Get started"
        },
        {
            title: "AI Event Assistant",
            description: "Cutting-edge AI is there to assist you at every step to save you time.",
            icon: Sparkles,
            cta: "Get started"
        }
    ]

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="mb-16">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
                        High touch and high tech
                    </h2>
                    <h3 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                        Service unlike <br /> anywhere else
                    </h3>
                    <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                        Take the hassle out of event planning with our team of expert event planners.
                    </p>
                    <Button className="mt-8 bg-primary hover:bg-primary/90" size="lg">
                        Get started
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.title} className="border-none bg-secondary/30 shadow-none hover:bg-secondary/50 transition-colors">
                            <CardContent className="p-8">
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h4 className="font-serif text-2xl font-bold mb-4">{feature.title}</h4>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    {feature.description}
                                </p>
                                <Button variant="link" className="p-0 h-auto text-primary font-semibold hover:no-underline group">
                                    {feature.cta} <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                        <h4 className="text-3xl font-bold font-serif mb-4">Get a budget estimate in 1 minute or less</h4>
                    </div>
                    <Button size="lg" variant="secondary" className="whitespace-nowrap bg-white text-primary hover:bg-gray-100">
                        Try free budget tool
                    </Button>
                </div>
            </div>
        </section>
    )
}
