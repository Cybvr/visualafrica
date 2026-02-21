import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Heart, MapPin } from "lucide-react"
import type { Vendor } from "@/lib/types"

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        {vendor.image ? (
          <Image
            src={vendor.image}
            alt={vendor.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        {vendor.featured && (
          <Badge className="absolute left-3 top-3 bg-accent text-foreground">
            Featured
          </Badge>
        )}
        {vendor.rating > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-foreground/70 px-2 py-1 text-xs font-semibold text-background backdrop-blur-sm">
            <Star className="h-3 w-3 fill-primary text-foreground" />
            {vendor.rating}
          </div>
        )}
        <button
          className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-foreground">
            {vendor.categories[0]}
          </span>
          <p className="shrink-0 text-sm font-semibold text-foreground">
            {vendor.price ?? "Contact for pricing"}
          </p>
        </div>

        <h3 className="font-serif text-base font-semibold leading-snug text-card-foreground line-clamp-2">
          {vendor.name}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-1">
          {vendor.shortDescription}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-foreground" />
          <span className="truncate">{vendor.location}</span>
        </div>
      </CardContent>
    </Card>
  )
}
