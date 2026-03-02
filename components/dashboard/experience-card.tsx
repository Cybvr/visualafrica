import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MapPin, Star } from "lucide-react"
import type { Experience } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

export function ExperienceCard({
  experience,
  experienceHref,
  saved = false,
  onToggleSave,
}: {
  experience: Experience
  experienceHref?: string
  saved?: boolean
  onToggleSave?: (experience: Experience) => void
}) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [experience.id, experience.image])

  const initials = (experience.vendorName || "Unknown Vendor")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const cardContent = (
    <Card className="group flex h-full flex-col overflow-hidden border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        {experience.image && !imageFailed ? (
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Image
            src="/placeholder.png"
            alt="Placeholder image"
            fill
            className="object-cover"
          />
        )}

        <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
          Experience
        </Badge>

        {experience.rating > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-foreground/70 px-2 py-1 text-xs font-semibold text-background backdrop-blur-sm">
            <Star className="h-3 w-3 fill-primary text-foreground" />
            {experience.rating}
          </div>
        )}

        <button
          className={`absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 transition-colors hover:bg-background ${saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          aria-label={saved ? "Remove from saved experiences" : "Save experience"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleSave?.(experience)
          }}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
        </button>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-foreground">
            {experience.vendorName || "Unknown Vendor"}
          </span>
          <p className="shrink-0 text-sm font-semibold text-foreground">
            {experience.price === null || experience.price === undefined || Number.isNaN(Number(experience.price))
              ? "Contact for pricing"
              : `From ${formatCurrency(Number(experience.price))}`}
          </p>
        </div>

        <h3 className="font-serif text-base font-semibold leading-snug text-card-foreground line-clamp-2">
          {experience.title}
        </h3>

        <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-foreground" />
          <span className="truncate">{experience.location}</span>
        </div>

        <div className="mt-4 border-t border-border pt-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{experience.vendorName || "Unknown Vendor"}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-primary text-foreground" />
                  <span>{experience.rating || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (experienceHref) {
    return (
      <Link href={experienceHref} className="block h-full w-full transition-transform hover:scale-[1.02]">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
