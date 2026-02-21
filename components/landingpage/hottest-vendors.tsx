import { getVendors } from "@/lib/firestore-service"
import { Star } from "lucide-react"

import Link from "next/link"

export async function HottestVendors() {
    const vendors = await getVendors()
    const featuredVendors = vendors
        .filter(v => v.featured)
        .slice(0, 4)

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="text-muted-foreground fill-primary" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Trending Now</span>
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                            Hottest Vendors
                        </h2></div>
                    <Link href="/dashboard/hosts">
                        <button className="text-muted-foreground font-black uppercase tracking-widest text-xs hover:tracking-[0.2em] transition-all">
                            Discover all vendors →
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredVendors.map((vendor) => (
                        <Link href={`/dashboard/hosts/vendor/${vendor.slug}`} key={vendor.id} className="group cursor-pointer">
                            <div>
                                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] mb-6">
                                    <img
                                        src={vendor.image}
                                        alt={vendor.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                        <Star className="text-yellow-500 fill-yellow-500" size={10} />
                                        <span className="text-[10px] font-black">{vendor.rating}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                        {vendor.categories[0]}
                                    </p>
                                    <h4 className="font-serif text-2xl font-bold text-foreground group-hover:text-muted-foreground transition-colors">
                                        {vendor.name}
                                    </h4>
                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            {vendor.location.split(",")[0]}
                                        </p>
                                        <p className="text-sm font-black text-foreground">
                                            {vendor.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
