import { getVendors } from "@/lib/firestore-service"
import Image from "next/image"
import Link from "next/link"

export async function Locations() {
    const vendors = await getVendors()

    // Filter for vendors that are featured and take up to 8 items
    const itemsToShow = vendors.filter(v => v.featured).slice(0, 8)

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                            Wherever the moment is.
                        </h2>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors cursor-pointer">
                            ←
                        </div>
                        <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors cursor-pointer">
                            →
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative w-full">
                <div className="flex gap-6 overflow-x-auto pb-12 px-[max(1rem,calc((100vw-72rem)/2))] scrollbar-hide snap-x">
                    {itemsToShow.map((item: any, idx: number) => (
                        <Link
                            key={item.id || idx}
                            href={`/explore/vendors/${item.slug}`}
                            className="flex-none w-[200px] md:w-[240px] group relative h-[280px] overflow-hidden rounded-[2rem] border border-border bg-card snap-start block"
                        >
                            <Image
                                src={item.image || "/images/waddiup.png"}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-widest border border-white/20">
                                        {item.categories?.[0] || "Experience"}
                                    </span>
                                    <span className="text-[9px] font-medium text-white/60 uppercase tracking-widest">{item.location}</span>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-white leading-tight mb-1">
                                    {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                    {/* Empty spacer at the end to match leading padding */}
                    <div className="flex-none w-[max(1rem,calc((100vw-72rem)/2))]" />
                </div>
            </div>
        </section>
    )
}
