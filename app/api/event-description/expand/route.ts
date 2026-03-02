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

type Body = {
  eventName?: string;
  location?: string;
  date?: string;
  guestCount?: number;
  category?: string;
  theme?: string;
  currentDescription?: string;
};

export async function POST(req: Request) {
  try {
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

    const body = (await req.json()) as Body;
    const eventName = String(body.eventName || "").trim();
    const location = String(body.location || "").trim();
    const date = String(body.date || "").trim();
    const category = String(body.category || "").trim();
    const theme = String(body.theme || "").trim();
    const currentDescription = String(body.currentDescription || "").trim();
    const guestCount = Number(body.guestCount || 0) || 0;

    if (!eventName) {
      return NextResponse.json({ error: "Event name is required." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 503 });
    }

    const boundedDescription = currentDescription.slice(0, 1200);

    const prompt = `You are an expert event copywriter.
Expand the following event description into a stronger, longer version for a planning dashboard.

Rules:
- Return ONLY the expanded description text (no JSON, no markdown, no title).
- Keep it practical and specific.
- Keep it between 90 and 160 words.
- Avoid hype language and avoid adding fake facts.
- If details are missing, write naturally without inventing specifics.

Event details:
- Name: ${eventName}
- Location: ${location || "Not provided"}
- Date: ${date || "Not provided"}
- Guest count: ${guestCount || 0}
- Category: ${category || "Not provided"}
- Theme: ${theme || "Not provided"}

Current description:
${boundedDescription || "No current description provided."}`;

    let text = "";
    let lastError: any = null;

    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = result.response;
        text = response.text().trim();
        if (text) break;
      } catch (error: any) {
        lastError = error;
        const message = String(error?.message || "");
        if (message.includes("404") || message.includes("not found")) {
          continue;
        }
        throw error;
      }
    }

    if (!text) {
      if (lastError) {
        throw lastError;
      }
      return NextResponse.json({ error: "Gemini returned an empty description." }, { status: 502 });
    }

    return NextResponse.json({ description: text, source: "ai" });
  } catch (error: any) {
    const message = String(error?.message || "Failed to expand description.");
    const cause = error?.cause
      ? {
          message: String(error.cause?.message || ""),
          code: String(error.cause?.code || ""),
          errno: String(error.cause?.errno || ""),
          syscall: String(error.cause?.syscall || ""),
          hostname: String(error.cause?.hostname || ""),
        }
      : undefined;
    console.error("expand-description error", error);
    return NextResponse.json(
      {
        error: message,
        cause,
        name: String(error?.name || ""),
      },
      { status: 500 }
    );
  }
}
