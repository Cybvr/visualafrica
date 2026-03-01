import { NextResponse } from "next/server";

type InspirationImage = {
    url: string;
    alt: string;
    creditName: string;
    creditUrl: string;
    pageUrl: string;
};

const toKeywords = (value: string) =>
    value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 5);

const buildQuery = (params: URLSearchParams) => {
    const eventName = (params.get("eventName") || "").trim();
    const location = (params.get("location") || "").trim();
    const categories = toKeywords(params.get("categories") || "");
    const themes = toKeywords(params.get("themes") || "");

    const parts = [
        eventName,
        ...themes,
        ...categories,
        location ? `${location} event` : "",
        "event decor inspiration"
    ].filter(Boolean);

    const query = parts.join(" ").replace(/\s+/g, " ").trim();
    return query || "event decor inspiration";
};

const fallbackImages = (query: string): InspirationImage[] =>
    Array.from({ length: 8 }, (_, idx) => ({
        url: `https://picsum.photos/seed/${encodeURIComponent(`${query}-${idx + 1}`)}/1600/900`,
        alt: `${query} inspiration ${idx + 1}`,
        creditName: "Picsum",
        creditUrl: "https://picsum.photos",
        pageUrl: "https://picsum.photos"
    }));

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = buildQuery(searchParams);
        const googleApiKey = process.env.GOOGLE_CSE_API_KEY;
        const googleCx = process.env.GOOGLE_CSE_CX;
        const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
        const pexelsApiKey = process.env.PEXELS_API_KEY;

        if (googleApiKey && googleCx) {
            const endpoint = new URL("https://www.googleapis.com/customsearch/v1");
            endpoint.searchParams.set("key", googleApiKey);
            endpoint.searchParams.set("cx", googleCx);
            endpoint.searchParams.set("q", query);
            endpoint.searchParams.set("searchType", "image");
            endpoint.searchParams.set("num", "8");
            endpoint.searchParams.set("safe", "active");

            const response = await fetch(endpoint.toString(), {
                next: { revalidate: 60 * 30 }
            });

            if (response.ok) {
                const payload = await response.json();
                const images: InspirationImage[] = Array.isArray(payload?.items)
                    ? payload.items
                        .map((item: any) => ({
                            url: item?.link || "",
                            alt: item?.title || `${query} inspiration`,
                            creditName: item?.displayLink || "Google source",
                            creditUrl: item?.image?.contextLink || item?.link || "",
                            pageUrl: item?.image?.contextLink || item?.link || ""
                        }))
                        .filter((image: InspirationImage) => Boolean(image.url))
                        .slice(0, 8)
                    : [];

                if (images.length > 0) {
                    return NextResponse.json({
                        title: `Inspiration ideas for ${query}`,
                        query,
                        source: "google-cse",
                        images
                    });
                }
            }
        }

        if (pexelsApiKey) {
            const endpoint = new URL("https://api.pexels.com/v1/search");
            endpoint.searchParams.set("query", query);
            endpoint.searchParams.set("per_page", "8");
            endpoint.searchParams.set("orientation", "landscape");

            const response = await fetch(endpoint.toString(), {
                headers: {
                    Authorization: pexelsApiKey
                },
                next: { revalidate: 60 * 60 }
            });

            if (response.ok) {
                const payload = await response.json();
                const images: InspirationImage[] = Array.isArray(payload?.photos)
                    ? payload.photos
                        .map((item: any) => ({
                            url: item?.src?.large2x || item?.src?.large || item?.src?.medium || "",
                            alt: item?.alt || `${query} inspiration`,
                            creditName: item?.photographer || "Pexels creator",
                            creditUrl: item?.photographer_url || "https://pexels.com",
                            pageUrl: item?.url || "https://pexels.com"
                        }))
                        .filter((image: InspirationImage) => Boolean(image.url))
                        .slice(0, 8)
                    : [];

                if (images.length > 0) {
                    return NextResponse.json({
                        title: `Inspiration ideas for ${query}`,
                        query,
                        source: "pexels",
                        images
                    });
                }
            }
        }

        if (!unsplashAccessKey) {
            return NextResponse.json({
                title: `Inspiration ideas for ${query}`,
                query,
                source: "fallback",
                images: fallbackImages(query)
            });
        }

        const endpoint = new URL("https://api.unsplash.com/search/photos");
        endpoint.searchParams.set("query", query);
        endpoint.searchParams.set("per_page", "8");
        endpoint.searchParams.set("orientation", "landscape");
        endpoint.searchParams.set("content_filter", "high");

        const response = await fetch(endpoint.toString(), {
            headers: {
                Authorization: `Client-ID ${unsplashAccessKey}`
            },
            next: { revalidate: 60 * 60 }
        });

        if (!response.ok) {
            return NextResponse.json(
                {
                    title: `Inspiration ideas for ${query}`,
                    query,
                    source: "fallback",
                    images: fallbackImages(query)
                },
                { status: 200 }
            );
        }

        const payload = await response.json();
        const images: InspirationImage[] = Array.isArray(payload?.results)
            ? payload.results
                .map((item: any) => ({
                    url: item?.urls?.regular || item?.urls?.small || "",
                    alt: item?.alt_description || item?.description || `${query} inspiration`,
                    creditName: item?.user?.name || "Unsplash creator",
                    creditUrl: item?.user?.links?.html || "https://unsplash.com",
                    pageUrl: item?.links?.html || "https://unsplash.com"
                }))
                .filter((image: InspirationImage) => Boolean(image.url))
                .slice(0, 8)
            : [];

        return NextResponse.json({
            title: `Inspiration ideas for ${query}`,
            query,
            source: "unsplash",
            images: images.length > 0 ? images : fallbackImages(query)
        });
    } catch (_error) {
        return NextResponse.json(
            {
                title: "Event inspiration ideas",
                query: "event decor inspiration",
                source: "fallback",
                images: fallbackImages("event decor inspiration")
            },
            { status: 200 }
        );
    }
}
