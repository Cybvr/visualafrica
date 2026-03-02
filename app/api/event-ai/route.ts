import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODEL_CANDIDATES = [
    process.env.GEMINI_MODEL?.trim(),
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
].filter((m): m is string => Boolean(m));

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
        }

        const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
        const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

        if (!idToken) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        try {
            await adminAuth.verifyIdToken(idToken);
        } catch {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const { prompt } = await req.json();
        if (typeof prompt !== "string" || !prompt.trim()) {
            return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
        }
        if (prompt.length > 2000) {
            return NextResponse.json({ error: "Prompt is too long." }, { status: 400 });
        }

        let model = genAI.getGenerativeModel({ model: MODEL_CANDIDATES[0] });

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

        let result: any = null;
        let lastError: any = null;
        for (const modelName of MODEL_CANDIDATES) {
            try {
                model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent([
                    { text: systemPrompt },
                    { text: `User message: ${prompt}` }
                ]);
                break;
            } catch (error: any) {
                lastError = error;
                const message = String(error?.message || "");
                if (message.includes("404") || message.includes("not found")) {
                    continue;
                }
                throw error;
            }
        }

        if (!result) throw lastError || new Error("No compatible Gemini model available.");

        const response = result.response;
        let text = response.text();

        // Clean up JSON response if it contains markdown formatting
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const eventData = JSON.parse(text);

        return NextResponse.json(eventData);
    } catch (error) {
        console.error("Yinka AI Error:", error);
        return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
    }
}
