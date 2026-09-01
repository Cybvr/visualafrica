import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, Shield, Zap, Globe, Users, Star, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function TravelPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="px-4 py-8 md:px-6 md:py-12">
                    <div className="relative mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-center overflow-hidden rounded-[3rem] border border-border bg-card/50 px-8 py-16 text-center lg:px-16 lg:py-24">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10 max-w-4xl space-y-8">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Visa applications
                            </div>
                            <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl leading-[0.9] text-balance">
                                Get your visa application <br />
                                ready <span className="text-primary italic">in 5 minutes</span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl leading-relaxed">
                                Tell us about your trip. Waddi helps you prepare the paperwork and keeps the application moving.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row justify-center pt-4">
                                <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                    <Link href="/auth/login">Start an application</Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-2 transition-all hover:bg-secondary/50">
                                    <Link href="#how-it-works">See the steps</Link>
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="pt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <Image src="/logo.png" alt="Partner 1" width={100} height={40} className="h-8 w-auto object-contain" />
                                <div className="h-8 w-[1px] bg-border hidden sm:block" />
                                <span className="text-sm font-bold tracking-widest uppercase">For people preparing to travel</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Steps Section */}
                <section id="how-it-works" className="py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">The Process</h2>
                            <h3 className="font-serif text-4xl md:text-5xl font-bold mb-4">Four steps to submit</h3>
                            <p className="text-muted-foreground text-lg">Waddi handles the repetitive parts of a visa application.</p>
                        </div>
                        <div className="relative grid gap-12 md:grid-cols-4">
                            {[
                                { id: "01", title: "Register", desc: "Create your account in seconds." },
                                { id: "02", title: "Review", desc: "Waddi checks your profile before you submit." },
                                { id: "03", title: "My Documents", desc: "Securely upload your required documents." },
                                { id: "04", title: "Submit", desc: "We handle the rest and track it for you." }
                            ].map((step, idx, arr) => (
                                <div key={step.id} className="relative flex flex-col items-center group">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary bg-background font-serif text-2xl font-bold text-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        {step.id}
                                    </div>
                                    <h4 className="mb-3 text-xl font-bold">{step.title}</h4>
                                    <p className="text-sm text-muted-foreground text-center">{step.desc}</p>
                                    {idx < arr.length - 1 && (
                                        <div className="absolute top-8 left-[calc(50%+3rem)] hidden w-[calc(100%-6rem)] border-t-2 border-dashed border-border md:block" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-24 bg-secondary/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Testimonials</h2>
                            <h3 className="font-serif text-4xl md:text-5xl font-bold">What our users are saying</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                { name: "Sarah J.", role: "Solo Traveler", quote: "Waddi made my Schengen visa application so much easier. I didn't have to worry about missing documents.", img: "/images/waddiup.png" },
                                { name: "David O.", role: "Business Professional", quote: "Fast, reliable, and secure. The specialist consultation was worth every penny.", img: "/images/holiday-escape.png" },
                                { name: "Amina K.", role: "Student", quote: "The AI analysis gave me confidence that my profile was strong enough for the UK visa.", img: "/images/lagos_cityscape_1772218168891.png" }
                            ].map((user, i) => (
                                <Card key={i} className="border-none bg-background rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                    <div className="relative h-64 w-full">
                                        <Image src={user.img} alt={user.name} fill className="object-cover transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                                    </div>
                                    <CardContent className="p-8">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                                        </div>
                                        <p className="text-lg italic mb-6">"{user.quote}"</p>
                                        <div className="border-t border-border pt-4">
                                            <p className="font-bold">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.role}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 border-y border-border">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
                            {[
                                { label: "Success Rate", value: "94%" },
                                { label: "Satisfaction", value: "99.7%" },
                                { label: "Active Users", value: "100K+" },
                                { label: "Records Processed", value: "5M+" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <p className="text-4xl md:text-5xl font-serif font-bold text-primary">{stat.value}</p>
                                    <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Built for section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Applications</h2>
                                <h3 className="font-serif text-4xl md:text-5xl font-bold leading-tight">Built for all visa applicants</h3>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    Whether it's your first time applying or you're a seasoned traveler, Waddi adapts to your needs.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-4 p-6 rounded-2xl bg-secondary/50 border border-border">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Users className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xl mb-2">For Beginners</h4>
                                            <p className="text-muted-foreground italic">Simple steps for first-time applicants. We guide you through every detail with simple language.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-6 rounded-2xl bg-secondary/50 border border-border">
                                        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <Zap className="text-accent h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xl mb-2">For Professionals</h4>
                                            <p className="text-muted-foreground italic">Efficiency for frequent travelers. Save time with automated document handling and bulk submissions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-border shadow-2xl">
                                <Image src="/images/waddi_hero_image_1772218141292.png" alt="Waddi Planning" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Destinations Section */}
                <section className="py-24 bg-card/30">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div className="max-w-xl">
                                <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Explore</h2>
                                <h3 className="font-serif text-4xl md:text-5xl font-bold">Where do you want to go?</h3>
                            </div>
                            <Button variant="ghost" className="rounded-full font-bold group">
                                View all destinations <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { city: "Brussels", country: "Belgium", img: "/images/book.jpg" },
                                { city: "Athens", country: "Greece", img: "/images/holiday-escape.png" },
                                { city: "Rome", country: "Italy", img: "/images/lagos_cityscape_1772218168891.png" },
                                { city: "Paris", country: "France", img: "/images/waddi.png" }
                            ].map((dest, i) => (
                                <div key={i} className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer">
                                    <Image src={dest.img} alt={dest.city} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{dest.country}</p>
                                        <p className="text-white text-2xl font-bold">{dest.city}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="rounded-[3rem] bg-primary p-12 lg:p-20 text-white flex flex-col lg:flex-row gap-12 items-center overflow-hidden relative">
                            {/* Decorative background circle */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="flex-1 space-y-8 relative z-10">
                                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Shield className="h-8 w-8" />
                                </div>
                                <h3 className="font-serif text-4xl md:text-6xl font-bold leading-tight">Privacy & Security First</h3>
                                <p className="text-xl text-white/80 leading-relaxed">
                                    Your data is your property. We use bank-level encryption and follow strict international standards to ensure your documents are safe and handled with care.
                                </p>
                                <div className="grid sm:grid-cols-3 gap-6 pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center"><Check className="h-3 w-3" /></div>
                                        <span className="text-sm font-bold">256-bit Encryption</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center"><Check className="h-3 w-3" /></div>
                                        <span className="text-sm font-bold">ISO 27001 Certified</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center"><Check className="h-3 w-3" /></div>
                                        <span className="text-sm font-bold">GDPR Compliant</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 relative z-10">
                                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-12 h-16 text-lg rounded-full font-bold">
                                    Security Whitepaper
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-24 bg-secondary/20">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Pricing</h2>
                            <h3 className="font-serif text-4xl md:text-5xl font-bold mb-4">Simple pricing, no surprises</h3>
                            <p className="text-muted-foreground text-lg">Choose the plan that fits your travel needs.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { plan: "Essential", price: "$149", features: ["Automated Document Checklist", "AI Profile Analysis", "Status Tracking", "Secure Storage"], highlight: false },
                                { plan: "Professional", price: "$299", features: ["Everything in Essential", "Specialist Consultation", "Expedited Handling", "Support via WhatsApp"], highlight: true },
                                { plan: "Global", price: "$499", features: ["Everything in Professional", "Multi-Visa Management", "Airport Concierge", "Refusal Protection"], highlight: false }
                            ].map((tier, i) => (
                                <Card key={i} className={`border-2 rounded-[2.5rem] p-8 flex flex-col ${tier.highlight ? 'border-primary bg-background shadow-2xl relative scale-105' : 'border-border bg-background'}`}>
                                    {tier.highlight && (
                                        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="mb-8">
                                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">{tier.plan}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-serif font-bold">{tier.price}</span>
                                            <span className="text-muted-foreground">/visa</span>
                                        </div>
                                    </div>
                                    <ul className="space-y-4 mb-12 flex-1">
                                        {tier.features.map((f, j) => (
                                            <li key={j} className="flex gap-3 text-sm font-medium">
                                                <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"><Check className="h-3 w-3" /></div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button className={`w-full h-14 rounded-full font-bold ${tier.highlight ? 'bg-primary' : 'variant-outline'}`} variant={tier.highlight ? 'default' : 'outline'}>
                                        Select {tier.plan}
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-16">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground">Answers to common questions about Waddi's visa services.</p>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            {[
                                { q: "How long does the process take?", a: "The initial application setup usually takes less than 5 minutes. Processing times depend on the consulate of the country you are applying to." },
                                { q: "Is Waddi a government agency?", a: "No, Waddi is a private platform that simplifies the application process for you. We provide high-tech tools and expertise to increase your success rate." },
                                { q: "What if my visa is rejected?", a: "Our AI analysis and specialist consultation aim to minimize this risk. If you have our Global plan, you may be eligible for refusal protection benefits." },
                                { q: "Are my documents safe?", a: "Absolutely. We use bank-level encryption and ensure all data is stored securely. We never share your information without your consent." }
                            ].map((faq, i) => (
                                <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                                    <AccordionTrigger className="text-left font-bold hover:text-primary py-6">{faq.q}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{faq.a}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-4">
                    <div className="mx-auto max-w-7xl rounded-[3rem] bg-foreground text-background p-12 lg:p-24 text-center space-y-8 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                        
                        <h2 className="font-serif text-4xl md:text-7xl font-bold max-w-4xl mx-auto leading-tight relative z-10"> Ready to simplify your visa process?</h2>
                        <p className="text-xl opacity-80 max-w-2xl mx-auto relative z-10">
                            Join thousands of happy travelers who saved weeks of stress. Get started with Waddi today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 relative z-10">
                            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full h-16 px-12 text-lg font-bold">Get Started Now</Button>
                            <Button size="lg" variant="outline" className="border-background/20 hover:bg-background/10 rounded-full h-16 px-12 text-lg font-bold">Learn More</Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
