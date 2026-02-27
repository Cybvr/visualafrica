export function HowItWorks() {
    const steps = [
        {
            id: "01",
            title: "Set Your Brief",
            description: "Pick a city, set a budget, and define the vibe. Waddi's AI takes it from there.",
        },
        {
            id: "02",
            title: "Waddi Builds",
            description: "Our platform scouts venues, coordinates talent, and builds the full package.",
        },
        {
            id: "03",
            title: "Confirm & Customize",
            description: "Review your options, swap vendors if you like, and approve with one click.",
        },
        {
            id: "04",
            title: "Live the Moment",
            description: "Show up and enjoy. Waddi handles all the logistics on the ground.",
        },
    ]

    return (
        <section id="how-it-works" className="py-24 bg-card/50">
            <div className="container mx-auto px-4 max-w-6xl text-center">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-16">
                    Brief → Build → Confirm → Go
                </h2>
                <div className="relative grid gap-12 md:grid-cols-4">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="relative flex flex-col items-center">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background font-serif text-2xl font-bold text-primary shadow-sm">
                                {step.id}
                            </div>
                            <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                            {idx < steps.length - 1 && (
                                <div className="absolute top-8 left-[calc(50%+2rem)] hidden w-[calc(100%-4rem)] border-t-2 border-dashed border-border md:block" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
