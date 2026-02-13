import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  Heart,
  PartyPopper,
  Briefcase,
  Ship,
  Baby,
  Gem,
  GraduationCap,
  Diamond,
  Cake,
  ChefHat,
} from "lucide-react"

const celebrations = [
  { title: "Weddings", icon: Heart, href: "/wedding", color: "bg-red-500/10 text-red-600" },
  { title: "Kids Birthday Parties", icon: PartyPopper, href: "/kids-parties", color: "bg-primary/10 text-primary" },
  { title: "Corporate Events", icon: Briefcase, href: "/corporate", color: "bg-blue-500/10 text-blue-600" },
  { title: "Yacht Parties", icon: Ship, href: "/social", color: "bg-cyan-500/10 text-cyan-600" },
  { title: "Baby Showers", icon: Baby, href: "/social", color: "bg-pink-500/10 text-pink-500" },
  { title: "Engagement Parties", icon: Diamond, href: "/social", color: "bg-accent/10 text-accent" },
  { title: "Graduation", icon: GraduationCap, href: "/social", color: "bg-green-500/10 text-green-600" },
  { title: "Proposals", icon: Gem, href: "/concierge", color: "bg-primary/10 text-primary" },
  { title: "Anniversary Parties", icon: Cake, href: "/social", color: "bg-amber-500/10 text-amber-600" },
  { title: "Private Chef / Home Events", icon: ChefHat, href: "/social", color: "bg-orange-500/10 text-orange-600" },
]

export function BrowseCelebrations() {
  return (
    <section className="bg-background px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Browse by Celebration
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find the perfect vendors for your special occasion
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {celebrations.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="group h-full cursor-pointer border-border bg-card transition-all hover:border-primary/30 hover:shadow-md">
                <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${item.color} transition-transform group-hover:scale-110`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium text-card-foreground">
                    {item.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
