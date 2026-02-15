import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Heart, MapPin } from "lucide-react"
import type { Vendor } from "@/lib/vendors-data"

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Card className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-lg">
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
          <Badge className="absolute left-3 top-3 bg-accent text-accent">
            Featured
          </Badge>
        )}
        {vendor.rating > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-foreground/70 px-2 py-1 text-xs font-semibold text-background backdrop-blur-sm">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {vendor.rating}
          </div>
        )}
        <button
          className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:bg-background hover:text-accent"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-serif text-base font-semibold leading-snug text-card-foreground line-clamp-2">
          {vendor.name}
        </h3>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {vendor.categories.map((cat) => (
            <span
              key={cat}
              className="text-xs font-medium uppercase tracking-wide text-primary"
            >
              {cat}
              {vendor.categories.indexOf(cat) < vendor.categories.length - 1
                ? ", "
                : ""}
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {vendor.shortDescription}
        </p>
        {vendor.price && (
          <p className="mt-2 text-sm font-semibold text-accent">
            {vendor.price}
          </p>
        )}
        {!vendor.price && (
          <p className="mt-2 text-sm italic text-muted-foreground">
            Contact for pricing
          </p>
        )}

        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{vendor.location}</span>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <div className="relative h-7 w-7 overflow-hidden rounded-full bg-muted">
            {vendor.vendor.logo ? (
              <Image
                src={vendor.vendor.logo}
                alt={vendor.vendor.name}
                fill
                className="object-cover"
              />
            ) : null}
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {vendor.vendor.name}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {vendor.eventThemes.map((theme) => (
            <Badge
              key={theme}
              variant="secondary"
              className="text-xs font-normal"
            >
              {theme}
            </Badge>
          ))}
        </div>

        <Link href={`/explore/vendors/${vendor.slug}`} className="mt-4 block">
          <Button className="w-full bg-primary text-foreground hover:bg-primary/90">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}