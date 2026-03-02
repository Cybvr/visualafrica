import Link from "next/link"
import { MapPin, Star } from "lucide-react"

import { getExperiences } from "@/lib/firestore-service"

export async function HandpickedExperiences() {
    const experiencesData = await getExperiences()
    const experiences = experiencesData
        .slice(0, 8)
        .map(e => ({
            id: e.id,
            slug: e.vendorSlug, // Or e.id if we use dedicated experience pages
            location: e.location.split(",")[0], // Just the city
            title: e.title,
            rating: e.rating || 0,
            image: e.image,
        }))

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Explore
                        </p>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
                            Featured Experiences
                        </h2>
                    </div>
                    <Link
                        href="/dashboard/hosts/search?tab=experiences"
                        className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:tracking-[0.2em] transition-all"
                    >
                        View all
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                    {experiences.map((exp) => (
                        <Link
                            href={`/dashboard/hosts/vendor/${exp.slug}`}
                            key={exp.title}
                            className="group min-w-[220px] max-w-[220px] snap-start"
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border">
                                <img
                                    src={exp.image || "/placeholder.png"}
                                    alt={exp.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <div className="absolute top-3 right-3 bg-white/90 text-black text-[10px] font-black rounded-full px-2 py-1 flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                                    {exp.rating}
                                </div>
                                <div className="absolute left-3 right-3 bottom-3 text-white">
                                    <p className="text-sm font-black line-clamp-1">{exp.title}</p>
                                    <p className="text-[11px] flex items-center gap-1 mt-1 text-white/90">
                                        <MapPin className="w-3 h-3" />
                                        {exp.location}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
