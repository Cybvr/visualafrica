"use client"

import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, Users, LucideIcon } from "lucide-react"
import Image from "next/image"

interface TrustFeature {
    icon: LucideIcon
    title: string
    description: string
}

const trustFeatures: TrustFeature[] = [
    {
        icon: Shield,
        title: "Vetted vendors only",
        description: "Every vendor is verified with past client reviews and portfolio checks before joining our platform."
    },
    {
        icon: CheckCircle,
        title: "Payment protection",
        description: "Your payment is held securely until your event is successfully completed."
    },
    {
        icon: Users,
        title: "Dedicated support",
        description: "Our team coordinates with vendors in Nigeria so you can plan from anywhere with confidence."
    }
]

export function TrustSection() {
    return (
        <section className="py-20 px-4 lg:px-8 bg-white">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                        <Image
                            src="/images/planning-event.jpg"
                            alt="Planning event from abroad"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-8 left-8 bg-white rounded-full px-6 py-4 shadow-lg flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-semibold text-lg">Vendor verified</span>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                            TRUSTED AT EVERY STEP
                        </h2>
                        <p className="text-lg text-gray-600 mb-12">
                            Hundreds of events planned across Nigeria by people living abroad.
                            We coordinate with local vendors so you don't have to.
                        </p>

                        <div className="space-y-8">
                            {trustFeatures.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <div key={feature.title} className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <Button size="lg" variant="outline" className="mt-12 h-14 px-10 text-lg">
                            See how it works
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}