import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file." }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
You are Yinka, an AI event planning assistant for Waddi.
Your job is to extract event details from the user's message and return them in a strict JSON format.

Available Themes:
- Wedding
- Corporate
- Birthday
- Workshop
- Festival
- All Themes (Default)

Available Locations:
- Lekki Phase 1, Lagos
- Victoria Island, Lagos
- Ikeja, Lagos
- Abuja
- Accra
- Other

Return ONLY JSON in this format:
{
    "eventName": "String",
    "theme": "Wedding" | "Corporate" | "Birthday" | "Workshop" | "Festival" | "All Themes",
    "date": "YYYY-MM-DD",
    "location": "String",
    "guestCount": Number,
    "budget": Number,
    "description": "String"
}

If any value is missing or unclear, provide a reasonable guess based on the context or leave as empty string/0.
Translate relative dates (like "next month" or "this December") to absolute dates based on the current year 2025/2026.
`;

        const result = await model.generateContent([
            { text: systemPrompt },
            { text: `User message: ${prompt}` }
        ]);

        const response = result.response;
        let text = response.text();

        // Clean up JSON response if it contains markdown formatting
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const eventData = JSON.parse(text);

        return NextResponse.json(eventData);
    } catch (error) {
        console.error("Yinka AI Error:", error);
        return NextResponse.json({ error: "Failed to process request with Yinka." }, { status: 500 });
    }
}
