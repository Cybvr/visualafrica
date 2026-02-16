"use client"

import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, Users, LucideIcon } from "lucide-react"

interface Feature {
    icon: LucideIcon
    title: string
    description: string
}

const features: Feature[] = [
    {
        icon: Shield,
        title: "Vetted vendors only",
        description: "Every vendor is verified with past client reviews and portfolio checks before joining our platform."
    },
    {
        icon: CheckCircle,
        title: "Everything in one place",
        description: "Coordinate with all your vendors, manage timelines, and track progress from a single dashboard."
    },
    {
        icon: Users,
        title: "Dedicated support",
        description: "Our team helps coordinate with vendors in Nigeria so you can plan from anywhere."
    }
]

export function TrustSection() {
    return (
        <section className="py-20 px-4 lg:px-8 bg-foreground">
            <div className="mx-auto max-w-4xl">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                        <img
                            src="https://images.pexels.com/photos/30952836/pexels-photo-30952836.jpeg"
                            alt="Professional chef vendor"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute bottom-8 left-8 bg-foreground rounded-full px-6 py-4 shadow-lg flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="font-semibold text-lg text-background">Vendor verified</span>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-background">
                            PLAN WITHOUT THE STRESS
                        </h2>
                        <p className="text-lg text-background mb-12">
                            Hundreds of events planned across Nigeria by people living abroad.
                            We coordinate with local vendors so you don't have to.
                        </p>

                        <div className="space-y-8">
                            {features.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <div key={feature.title} className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-background" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-background text-xl mb-2">{feature.title}</h3>
                                            <p className="text-background">{feature.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <Button size="lg" variant="outline" className="mt-12 h-14 px-10 text-lg hover:text-primary-foreground">
                            See how it works
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}