import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare } from "lucide-react"

const vendors = [
  {
    name: "Social Gatherings at Terra Kulture",
    subtitle: "Celebrations Lagos",
    by: "Terra Kulture",
    category: "Venues",
    image: "/images/vendor-spotlight.jpg",
  },
]

export function VendorSpotlight() {
  return (
    <section className="bg-background px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Vendor Spotlight
          </h2>
          <p className="mt-3 text-muted-foreground">
            Discover top-rated vendors and partners for your next celebration
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Card
              key={vendor.name}
              className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
                  {vendor.category}
                </Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="font-serif text-lg font-semibold text-card-foreground">
                  {vendor.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  by {vendor.by}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 border-border text-foreground hover:bg-secondary"
                  >
                    <Eye className="h-4 w-4" />
                    View Product
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact Vendor
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
