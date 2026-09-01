import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { getVendors } from "@/lib/firestore-service";

export async function FeaturedLocations() {
  const vendors = await getVendors();
  const featured = vendors.filter((v) => v.featured).slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Explore
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
              Featured Locations
            </h2>
          </div>
          <Link
            href="/dashboard/hosts/vendors"
            className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:tracking-[0.2em] transition-all"
          >
            View all
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {featured.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/dashboard/hosts/vendor/${vendor.slug}`}
              className="group min-w-[220px] max-w-[220px] snap-start"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border">
                <img
                  src={vendor.image || "/placeholder.png"}
                  alt={vendor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-3 right-3 bg-white/90 text-black text-[10px] font-black rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                  {vendor.rating || 0}
                </div>
                <div className="absolute left-3 right-3 bottom-3 text-white">
                  <p className="text-sm font-black line-clamp-1">{vendor.name}</p>
                  <p className="text-[11px] flex items-center gap-1 mt-1 text-white/90">
                    <MapPin className="w-3 h-3" />
                    {vendor.location.split(",")[0]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
