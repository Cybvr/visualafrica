import { Card, CardContent } from "@/components/ui/card"
import {
  Heart,
  Users,
  GlassWater,
  PartyPopper,
  Gem,
  Cake,
} from "lucide-react"

const planners = [
  {
    title: "Wedding Planner",
    icon: Heart,
    description: "Full-service wedding planning from start to finish",
  },
  {
    title: "Team Building",
    icon: Users,
    description: "Corporate team building events and experiences",
  },
  {
    title: "Gala Dinner",
    icon: GlassWater,
    description: "Elegant gala dinners and formal events",
  },
  {
    title: "Kids Party Planner",
    icon: PartyPopper,
    description: "Fun and creative birthday parties for children",
  },
  {
    title: "Proposal Planner",
    icon: Gem,
    description: "Romantic and memorable proposal setups",
  },
  {
    title: "Birthday Coordinator",
    icon: Cake,
    description: "Unforgettable birthday celebrations for all ages",
  },
]

export function EventPlanners() {
  return (
    <section className="bg-secondary/50 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Event Planners for Every Occasion
          </h2>
          <p className="mt-3 text-muted-foreground">
            Connect with specialized planners who bring your vision to life
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {planners.map((planner) => (
            <Card
              key={planner.title}
              className="group cursor-pointer border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <planner.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-card-foreground">
                    {planner.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {planner.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
