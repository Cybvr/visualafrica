import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BLOG_POSTS } from "@/lib/blog-data"

export function FeaturesGrid() {
    const features = [
        {
            title: "Itinerary Builder",
            description: "Build your itinerary in minutes, not days, with Visual Africa's AI-powered Itinerary Builder.",
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
                <div className="relative mb-16 rounded-2xl overflow-hidden min-h-[500px] flex items-center">
                    <Image
                        src="/images/waddi2.png"
                        alt="Visual Africa Event Planning"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="relative z-10 max-w-xl p-8 md:p-12 text-white">
                        <h2 className="text-sm font-semibold uppercase tracking-widest mb-4">
                            High touch and high tech
                        </h2>
                        <h3 className="font-serif text-4xl md:text-5xl font-bold">
                            Service unlike <br /> anywhere else
                        </h3>
                        <p className="mt-6 text-lg text-white/90">
                            Take the hassle out of event planning with our team of expert event planners.
                        </p>
                        <Button className="mt-8 bg-primary hover:bg-primary/90" size="lg">
                            Get started
                        </Button>
                    </div>
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

                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {BLOG_POSTS.slice(0, 3).map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="group block"
                        >
                            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 shadow-lg transition-all group-hover:shadow-2xl group-hover:-translate-y-1">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <h4 className="font-serif text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                                {post.title}
                            </h4>
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {post.excerpt}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}