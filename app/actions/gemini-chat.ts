"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const DEFAULT_MODEL_CANDIDATES = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
];

type GeminiCallOptions = {
    forceFunctionCall?: boolean;
    allowedFunctionNames?: string[];
    useSearch?: boolean;
    systemInstruction?: string;
};

export async function processGeminiChat(
    chatHistory: { role: string; parts: { text: string }[] }[],
    options?: GeminiCallOptions
) {
    const configuredModel = process.env.GEMINI_MODEL?.trim();
    const modelCandidates = Array.from(
        new Set([configuredModel, ...DEFAULT_MODEL_CANDIDATES].filter((m): m is string => !!m))
    );

    const buildSystemInstruction = () =>
        options?.systemInstruction?.trim() ||
        `You are Waddi, an intelligent event planner assistant for African cities (Lagos, Accra, Nairobi, Cape Town, Abuja, Kampala, Dar es Salaam).
When users share event details, ALWAYS call create_event with the parsed details.
Do NOT call add_todo_item, add_itinerary_item, or find_vendors in the same turn as create_event unless the user explicitly asks to skip approvals and do everything at once.
When looking for vendors, use find_vendors with the event city.
For normal conversation (when no tool is needed), reply naturally and conversationally, then end with one short action-oriented question that moves the user toward a concrete next step in Waddi.
Be concise and action-oriented.`;

    const callSearchModel = async (modelName: string, prompt: string) => {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        const body = {
            systemInstruction: { parts: [{ text: buildSystemInstruction() }] },
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ google_search: {} }]
        };
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
            body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok) {
            const err: any = new Error(json?.error?.message || "Gemini search request failed");
            (err as any).status = res.status;
            throw err;
        }
        const parts = json?.candidates?.[0]?.content?.parts || [];
        const text = parts.map((p: any) => p?.text || "").join("").trim();
        const groundingMetadata = json?.candidates?.[0]?.groundingMetadata;
        return { text, groundingMetadata };
    };

    try {
        const allowList = Array.isArray(options?.allowedFunctionNames)
            ? options!.allowedFunctionNames!.filter(Boolean)
            : [];

        let lastModelError: any = null;
        for (const modelName of modelCandidates) {
            try {
                if (options?.useSearch) {
                    const prompt = chatHistory[chatHistory.length - 1]?.parts?.[0]?.text || "";
                    const result = await callSearchModel(modelName, prompt);
                    return { type: "text", text: result.text, groundingMetadata: result.groundingMetadata };
                }

                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: buildSystemInstruction(),
                    tools: [
                        {
                            functionDeclarations: [
                                {
                                    name: "create_event",
                                    description: "Create a new event when the user shares event details. Call this whenever the user mentions an event name, guest count, budget, and city.",
                                    parameters: {
                                        type: "OBJECT" as any,
                                        properties: {
                                            eventName: { type: "STRING" as any, description: "Name of the event" },
                                            guestCount: { type: "INTEGER" as any, description: "Number of guests" },
                                            budget: { type: "INTEGER" as any, description: "Estimated budget in local currency" },
                                            city: { type: "STRING" as any, description: "City where the event will be held (e.g., Lagos, Accra, Nairobi, Cape Town)" },
                                            date: { type: "STRING" as any, description: "Optional event date, e.g. 2026-06-30" },
                                            description: { type: "STRING" as any, description: "Optional event description" }
                                        },
                                        required: ["eventName", "guestCount", "budget", "city"]
                                    }
                                },
                                {
                                    name: "add_todo_item",
                                    description: "Add a single task item to an event todo list. Call this multiple times to build a checklist.",
                                    parameters: {
                                        type: "OBJECT" as any,
                                        properties: {
                                            eventId: { type: "STRING" as any, description: "Optional event id if known." },
                                            eventName: { type: "STRING" as any, description: "Optional event name if event id is unknown." },
                                            item: { type: "STRING" as any, description: "Task to add to the event checklist." }
                                        },
                                        required: ["item"]
                                    }
                                },
                                {
                                    name: "add_itinerary_item",
                                    description: "Add a timeline item to an event itinerary. Call this multiple times to build a day-of schedule.",
                                    parameters: {
                                        type: "OBJECT" as any,
                                        properties: {
                                            eventId: { type: "STRING" as any, description: "Optional event id if known." },
                                            eventName: { type: "STRING" as any, description: "Optional event name if event id is unknown." },
                                            time: { type: "STRING" as any, description: "Time for the itinerary item, e.g. 14:30 or 2:30 PM." },
                                            label: { type: "STRING" as any, description: "Short itinerary title." },
                                            note: { type: "STRING" as any, description: "Optional details for this itinerary item." }
                                        },
                                        required: ["time", "label"]
                                    }
                                },
                                {
                                    name: "find_vendors",
                                    description: "Find and display vendors for a specific city, optionally filtered by category. Use this to show vendor recommendations.",
                                    parameters: {
                                        type: "OBJECT" as any,
                                        properties: {
                                            city: { type: "STRING" as any, description: "City to search for vendors (e.g. Nairobi, Lagos, Accra, Cape Town)." },
                                            category: { type: "STRING" as any, description: "Optional vendor category to filter by (e.g. Catering, DJ, Decor, Photography)." }
                                        },
                                        required: ["city"]
                                    }
                                }
                            ]
                        }
                    ],
                    ...(options?.forceFunctionCall
                        ? {
                            toolConfig: {
                                functionCallingConfig: {
                                    mode: "ANY" as any,
                                    ...(allowList.length > 0 ? { allowedFunctionNames: allowList } : {})
                                }
                            }
                        }
                        : {})
                });

                const history = chatHistory.slice(0, -1).map(h => ({
                    role: h.role, // "user" or "model"
                    parts: h.parts
                }));

                const chatSession = model.startChat({
                    history: history,
                });

                const latestMsg = chatHistory[chatHistory.length - 1].parts[0].text;
                const result = await chatSession.sendMessage(latestMsg);

                let functionCalls: any[] | undefined;
                if (typeof result.response.functionCalls === "function") {
                    functionCalls = result.response.functionCalls();
                } else {
                    // fallback for older SDK format
                    functionCalls = result.response.candidates?.[0]?.content?.parts?.filter((p: any) => p.functionCall)?.map((p: any) => p.functionCall);
                }

                if (functionCalls && functionCalls.length > 0) {
                    let responseText = "";
                    try { responseText = result.response.text(); } catch (e) { }

                    return {
                        type: "function_call",
                        // Return ALL function calls so the page can process batches
                        functionCalls: functionCalls,
                        // Keep legacy single-call fields for backwards compatibility
                        functionName: functionCalls[0].name,
                        args: functionCalls[0].args,
                        text: responseText || "On it!"
                    };
                }

                let replyText = "";
                try {
                    replyText = result.response.text();
                } catch (e) {
                    console.error("No text in response:", e);
                }

                return { type: "text", text: replyText };
            } catch (modelErr: any) {
                lastModelError = modelErr;
                const isNotFound = Number(modelErr?.status) === 404;
                if (isNotFound) {
                    console.warn(`Gemini model unavailable: ${modelName}. Trying next candidate.`);
                    continue;
                }
                throw modelErr;
            }
        }

        throw lastModelError || new Error("No Gemini model candidates available.");
    } catch (e: any) {
        const errorPayload = {
            message: e?.message || "Unknown Gemini error",
            status: e?.status,
            code: e?.code,
            details: e?.details
        };
        console.error("Gemini API Error:", errorPayload);
        return { type: "error", text: "", error: errorPayload };
    }
}
