import { Button } from "@/components/ui/button"

import { vendors } from "@/lib/vendors-data"

export function HandpickedExperiences() {
    const experiences = vendors
        .filter(v => v.categories.includes("Experiences"))
        .slice(0, 4)
        .map(v => ({
            id: v.id,
            slug: v.slug,
            location: v.location.split(",")[0], // Just the city
            title: v.name,
            price: v.price?.match(/NGN [\d,]+/)?.[0] || v.price,
            image: v.image,
            category: v.categories[0]
        }))

    return (
        <section className="py-24 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
                            Handpicked experiences
                        </h2>
                        <h3 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                            For your team
                        </h3>
                    </div>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                        View all pre-built events
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {experiences.map((exp) => (
                        <div key={exp.title} className="group cursor-pointer">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-4">
                                <img
                                    src={exp.image}
                                    alt={exp.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-foreground uppercase tracking-wider">
                                        {exp.category}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                {exp.location}
                            </p>
                            <h4 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {exp.title}
                            </h4>
                            <p className="text-sm text-foreground">
                                from <span className="font-bold text-lg text-primary">{exp.price}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
