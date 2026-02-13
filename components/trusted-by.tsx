export function TrustedBy() {
    const companies = [
        "Google", "Amazon", "Netflix", "Spotify", "Meta", "Apple"
    ]

    return (
        <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground mb-10">
                    The world's best companies use Visual Africa
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {companies.map((company) => (
                        <div key={company} className="text-2xl font-bold text-foreground/80 font-serif">
                            {company}
                        </div>
                    ))}
                </div>
                <p className="text-center mt-12 text-primary font-medium">
                    Delivering extraordinary results
                </p>
            </div>
        </section>
    )
}
