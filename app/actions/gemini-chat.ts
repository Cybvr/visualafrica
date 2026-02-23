"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

type GeminiCallOptions = {
    forceFunctionCall?: boolean;
    allowedFunctionNames?: string[];
};

export async function processGeminiChat(
    chatHistory: { role: string; parts: { text: string }[] }[],
    options?: GeminiCallOptions
) {
    try {
        const allowList = Array.isArray(options?.allowedFunctionNames)
            ? options!.allowedFunctionNames!.filter(Boolean)
            : [];

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are Waddi, an intelligent event planner assistant for African cities (Lagos, Accra, Nairobi, Cape Town, Abuja, Kampala, Dar es Salaam).
When users share event details, ALWAYS call create_event with the parsed details.
After creating an event, generate a realistic todo checklist and day-of itinerary using add_todo_item and add_itinerary_item.
When looking for vendors, use find_vendors with the event city.
Be concise and action-oriented.`,
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
    } catch (e: any) {
        console.error("Gemini API Error:", e);
        return { type: "error", text: "Oops, something went wrong with my logic engine." };
    }
}
