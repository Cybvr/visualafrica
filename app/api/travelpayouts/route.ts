import { NextResponse } from "next/server";

const TRAVELPAYOUTS_TOKEN = process.env.TRAVELPAYOUTS_API_KEY;
const API_URL = "https://api.travelpayouts.com/v1";

export async function GET(request: Request) {
    if (!TRAVELPAYOUTS_TOKEN) {
        return NextResponse.json(
            { error: "Travelpayouts API key not configured" },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const depart_date = searchParams.get("depart_date");

    if (!origin || !destination) {
        return NextResponse.json(
            { error: "Missing origin or destination IATA codes" },
            { status: 400 }
        );
    }

    try {
        const queryParams = new URLSearchParams({
            origin,
            destination,
            currency: "USD",
            token: TRAVELPAYOUTS_TOKEN,
        });

        if (depart_date) {
            queryParams.append("depart_date", depart_date);
        }

        const response = await fetch(`${API_URL}/prices/cheap?${queryParams.toString()}`);

        if (!response.ok) {
            console.error("Travelpayouts API error:", response.status, await response.text());
            return NextResponse.json(
                { error: "Failed to fetch from Travelpayouts" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Travelpayouts API fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error connecting to Travelpayouts" },
            { status: 500 }
        );
    }
}
