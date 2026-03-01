"use client";

import { processGeminiChat } from "@/app/actions/gemini-chat";
import { INITIAL_MESSAGES, MARKET_DATA } from "@/lib/chat-data";
import {
    createChat,
    createEvent,
    getEventById,
    saveChatMessage,
    updateChatMetadata,
    updateEvent
} from "@/lib/firestore-service";
import { SharedEvent, TimelineEntry } from "@/lib/types";
import {
    extractIntent,
    resolveCity,
    getDefaultItineraryItems,
    getDefaultTodoItems
} from "@/lib/chat/workflows";
import type { Dispatch, SetStateAction } from "react";

type UseChatAgentArgs = {
    paramsId: string | string[] | undefined;
    router: { push: (href: string) => void };
    messages: any[];
    setMessages: Dispatch<SetStateAction<any[]>>;
    setInput: Dispatch<SetStateAction<string>>;
    setTyping: Dispatch<SetStateAction<boolean>>;
    activeCity: string | null;
    setActiveCity: Dispatch<SetStateAction<string | null>>;
    allVendorsByCity: Record<string, any[]>;
    liveEvents: SharedEvent[];
    selectedEventId: string | null;
    setSelectedEventId: Dispatch<SetStateAction<string | null>>;
    pendingAction: any;
    setPendingAction: Dispatch<SetStateAction<any>>;
    currentUser: any;
    storeKits: any[];
};

type ActionMetrics = {
    createdEvents: { eventName: string; city: string }[];
    todoAdded: number;
    itineraryAdded: number;
    vendorSearches: { city: string; category: string | null; count: number; topVendors: string[] }[];
    pendingMessages: any[];
};

export function useChatAgent({
    paramsId,
    router,
    messages,
    setMessages,
    setInput,
    setTyping,
    activeCity,
    setActiveCity,
    allVendorsByCity,
    liveEvents,
    selectedEventId,
    setSelectedEventId,
    pendingAction,
    setPendingAction,
    currentUser,
    storeKits
}: UseChatAgentArgs) {
    type WorkflowStage = "event" | "itinerary" | "todo" | "budget" | "vendors" | "ticketing";

    const APPROVAL_ACTIONS = new Set([
        "approve_generate_itinerary",
        "approve_generate_todo",
        "approve_generate_budget",
        "approve_find_vendors"
    ]);

    const getRouteChatId = () => {
        return typeof paramsId === "string" ? paramsId : Array.isArray(paramsId) ? paramsId[0] : "new";
    };

    const buildWorkflowActions = (stage: WorkflowStage) => {
        const order: WorkflowStage[] = ["event", "vendors", "itinerary", "todo", "budget", "ticketing"];
        const labels: Record<WorkflowStage, string> = {
            event: "Event created",
            itinerary: "Itinerary generated",
            todo: "Checklist generated",
            budget: "Budget allocated",
            vendors: "Vendors shortlisted",
            ticketing: "Ticketing set up"
        };
        const stageIndex = order.indexOf(stage);
        return order.map((item, idx) => ({
            label: labels[item],
            status: idx < stageIndex ? "done" : idx === stageIndex ? "active" : "queued"
        }));
    };

    const extractSearchSources = (groundingMetadata: any) => {
        const chunks = groundingMetadata?.groundingChunks || [];
        const sources = chunks
            .map((chunk: any) => {
                const web = chunk?.web || chunk?.webSearchResult || chunk?.webInfo;
                const title = web?.title || chunk?.title || "";
                const uri = web?.uri || web?.url || chunk?.uri || "";
                if (!title && !uri) return null;
                return { title, uri };
            })
            .filter(Boolean);
        const seen = new Set<string>();
        return sources.filter((s: any) => {
            const key = `${s.title}::${s.uri}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        }).slice(0, 5);
    };

    const addAffiliateParams = (rawUrl?: string) => {
        if (!rawUrl) return "";
        try {
            const url = new URL(rawUrl);
            const affiliateParam = process.env.NEXT_PUBLIC_FLIGHT_AFFILIATE_PARAM || "waddi_ref";
            const affiliateId = process.env.NEXT_PUBLIC_FLIGHT_AFFILIATE_ID || "waddi";
            if (!url.searchParams.has(affiliateParam)) {
                url.searchParams.set(affiliateParam, affiliateId);
            }
            if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", "waddi");
            if (!url.searchParams.has("utm_medium")) url.searchParams.set("utm_medium", "assistant");
            if (!url.searchParams.has("utm_campaign")) url.searchParams.set("utm_campaign", "flight_deals");
            return url.toString();
        } catch (_e) {
            return rawUrl;
        }
    };

    const runFlightDealSearch = async (
        event: SharedEvent,
        origin: string,
        destinationOverride?: string,
        chatIdOverride?: string
    ) => {
        const parseFlightPayload = (input: string) => {
            if (!input) return null;
            const candidates: string[] = [input];
            const fenced = input.match(/```json\s*([\s\S]*?)\s*```/i) || input.match(/```\s*([\s\S]*?)\s*```/i);
            if (fenced?.[1]) candidates.push(fenced[1].trim());
            const firstBrace = input.indexOf("{");
            const lastBrace = input.lastIndexOf("}");
            if (firstBrace >= 0 && lastBrace > firstBrace) candidates.push(input.slice(firstBrace, lastBrace + 1));
            for (const chunk of candidates) {
                try {
                    const parsed = JSON.parse(chunk);
                    if (parsed && typeof parsed === "object") return parsed;
                } catch (_e) {
                    // Keep trying next candidate.
                }
            }
            return null;
        };

        const destination = String(event.location || "").trim() || String(destinationOverride || "").trim() || "your event city";
        const date = event.date || "your event date";
        const prompt = `Return flight deal recommendations based on Google Search results.
Trip: ${origin} → ${destination} around ${date}.

Output JSON only (no markdown, no commentary) with this shape:
{
  "type": "flight_deals",
  "title": "Flight deal guidance for ${origin} → ${destination} around ${date}",
  "deals": [
    { "label": "", "price": "", "dates": "", "source": "", "url": "" }
  ],
  "sources": [
    { "title": "", "url": "" }
  ]
}

Rules:
- Use 3 to 5 deals.
- If a field is unknown, set it to "".
- Prefer short labels like "LHR → LOS (via ADD)".
- Do not invent prices, routes, or links. If you cannot verify a deal, omit it.
`;

        const reply = await processGeminiChat(
            [{ role: "user", parts: [{ text: prompt }] }],
            {
                useSearch: true,
                systemInstruction: `You are Waddi, an event planner assistant. Use Google Search grounding to surface flight deal recommendations. Do not refuse. Keep output in the exact requested format.`
            }
        );

        const rawText = reply?.type === "text" ? String(reply.text || "").trim() : "";
        const sources = extractSearchSources((reply as any)?.groundingMetadata);
        let payload: any = parseFlightPayload(rawText);

        if (!payload || payload.type !== "flight_deals") {
            payload = {
                type: "flight_deals",
                title: `Flight deal guidance for ${origin} → ${destination} around ${date}`,
                deals: [],
                sources: sources.map((s: any) => ({ title: s.title || "", url: s.uri || "" })),
                emptyHint: "I couldn't confirm priced options from live search right now. Try nearby dates or another origin."
            };
        } else if (sources.length > 0 && (!Array.isArray(payload.sources) || payload.sources.length === 0)) {
            payload.sources = sources.map((s: any) => ({ title: s.title || "", url: s.uri || "" }));
        }

        payload.deals = Array.isArray(payload.deals)
            ? payload.deals
                .filter((deal: any) => String(deal?.url || "").trim().length > 0)
                .map((deal: any) => ({ ...deal, url: addAffiliateParams(deal?.url) }))
            : [];
        payload.sources = Array.isArray(payload.sources)
            ? payload.sources.map((source: any) => ({ ...source, url: addAffiliateParams(source?.url) }))
            : [];

        if (typeof window !== "undefined" && currentUser?.uid && event?.id) {
            try {
                window.localStorage.setItem(
                    `waddi-flight-deals:${currentUser.uid}:${event.id}`,
                    JSON.stringify({
                        eventId: event.id,
                        updatedAt: Date.now(),
                        title: payload.title || "",
                        deals: payload.deals || [],
                        sources: payload.sources || []
                    })
                );
            } catch (_e) {
                // Ignore storage failures.
            }
        }

        const sourceNames = (payload.sources || [])
            .map((s: any) => String(s?.title || "").trim())
            .filter(Boolean);
        const uniqueSourceNames = Array.from(new Set(sourceNames));
        const verifiedDeals = Array.isArray(payload.deals) ? payload.deals.length : 0;
        const deliberationLine =
            verifiedDeals >= 2 && uniqueSourceNames.length >= 2
                ? `I compared ${uniqueSourceNames.slice(0, 2).join(" and ")} for ${origin} to ${destination}, then kept the most actionable options.`
                : verifiedDeals > 0
                    ? `I found a few verifiable options for ${origin} to ${destination} and filtered to the clearest links.`
                    : uniqueSourceNames.length > 0
                        ? `I checked ${uniqueSourceNames.length} sources for ${origin} to ${destination}, but none exposed reliable fare details right now.`
                        : `I checked live search results for ${origin} to ${destination}, but I couldn't verify strong options yet.`;

        await persistAgentMessage(
            {
                type: "deliberation_status",
                content: deliberationLine
            },
            chatIdOverride
        );

        await persistAgentMessage(
            payload,
            chatIdOverride
        );
    };

    const runInspirationSearch = async (
        event: SharedEvent,
        chatIdOverride?: string
    ) => {
        const params = new URLSearchParams({
            eventName: String(event.eventName || "").trim(),
            location: String(event.location || "").trim(),
            categories: (event.categories || []).join(","),
            themes: (event.themes || []).join(",")
        });

        await persistAgentMessage(
            {
                type: "deliberation_status",
                content: `Pulling visual inspiration for "${event.eventName}"...`
            },
            chatIdOverride
        );

        try {
            const response = await fetch(`/api/inspiration-images?${params.toString()}`, {
                method: "GET",
                cache: "no-store"
            });
            if (!response.ok) {
                throw new Error(`Inspiration request failed with status ${response.status}`);
            }

            const payload = await response.json();
            const images = Array.isArray(payload?.images) ? payload.images : [];

            await persistAgentMessage(
                {
                    type: "inspiration_gallery",
                    content: `Here are visual references for ${event.eventName}.`,
                    title: payload?.title || `Inspiration ideas for ${event.eventName}`,
                    query: payload?.query || "",
                    source: payload?.source || "unsplash",
                    images,
                    suggestions: [
                        { label: "Discover Vendors", action: "vendor_search", eventId: event.id },
                        { label: "Open Budget", action: "budget", eventId: event.id }
                    ]
                },
                chatIdOverride
            );
        } catch (_error) {
            await persistAgentMessage(
                {
                    type: "text",
                    content: "I couldn't pull image inspiration right now. Try again in a moment."
                },
                chatIdOverride
            );
        }
    };

    const persistAgentMessage = async (msg: any, chatIdOverride?: string) => {
        const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const agentMsg = { role: "agent", ...msg, time: nowStr };
        const routeChatId = getRouteChatId();
        const targetChatId = chatIdOverride || (routeChatId !== "new" ? routeChatId : null);

        if (targetChatId) {
            await saveChatMessage(targetChatId, agentMsg);
        } else {
            setMessages((prev) => [...prev, { ...agentMsg, id: Date.now().toString() }]);
        }
    };

    const resolveTargetEvent = (args: any = {}): SharedEvent | null => {
        if (args.eventId) {
            const byId = liveEvents.find((ev) => ev.id === String(args.eventId));
            if (byId) return byId;
        }

        if (selectedEventId) {
            const selected = liveEvents.find((ev) => ev.id === selectedEventId);
            if (selected) return selected;
        }

        if (args.eventName) {
            const query = String(args.eventName).toLowerCase();
            const byName = liveEvents.find((ev) => ev.eventName.toLowerCase().includes(query));
            if (byName) return byName;
        }

        if (liveEvents.length === 1) return liveEvents[0];
        return null;
    };

    const buildActionFallback = (metrics: ActionMetrics) => {
        const parts: string[] = [];
        const latestEvent = metrics.createdEvents[metrics.createdEvents.length - 1];
        if (latestEvent) {
            parts.push(`I set up "${latestEvent.eventName}" in ${latestEvent.city}.`);
        }
        if (metrics.todoAdded > 0 || metrics.itineraryAdded > 0) {
            parts.push(`I added ${metrics.todoAdded} checklist items and ${metrics.itineraryAdded} itinerary items.`);
        }
        const latestSearch = metrics.vendorSearches[metrics.vendorSearches.length - 1];
        if (latestSearch) {
            const focus = latestSearch.category ? `${latestSearch.category} vendors` : "vendors";
            const sample = latestSearch.topVendors.length > 0 ? ` Top matches include ${latestSearch.topVendors.join(", ")}.` : "";
            parts.push(`I found ${latestSearch.count} ${focus} in ${latestSearch.city}.${sample}`);
        }
        const summary = parts.join(" ").trim();
        return summary.length > 0
            ? `${summary} Want me to refine this further based on your style and budget priorities?`
            : "Done. I handled that and I can tune the next step around your priorities. What should I optimize first?";
    };

    const generateActionNarration = async (
        userText: string,
        metrics: ActionMetrics,
        modelText?: string
    ) => {
        const actionLines: string[] = [];
        if (metrics.createdEvents.length > 0) {
            for (const ev of metrics.createdEvents.slice(-2)) {
                actionLines.push(`- created event "${ev.eventName}" in ${ev.city}`);
            }
        }
        if (metrics.todoAdded > 0) actionLines.push(`- added ${metrics.todoAdded} todo items`);
        if (metrics.itineraryAdded > 0) actionLines.push(`- added ${metrics.itineraryAdded} itinerary items`);
        if (metrics.vendorSearches.length > 0) {
            for (const vs of metrics.vendorSearches.slice(-2)) {
                actionLines.push(`- vendor search in ${vs.city}${vs.category ? ` for ${vs.category}` : ""}: ${vs.count} matches`);
            }
        }

        if (actionLines.length === 0) return null;

        const prompt = `You are Waddi, an event planning assistant.
Write a natural response to the user after these tool actions were already completed.

User message:
"${userText}"

Action results:
${actionLines.join("\n")}

Model intent (optional):
${modelText?.trim() || "(none)"}

Rules:
- 2 to 4 sentences.
- Natural, confident, and specific.
- Mention what was completed.
- If vendor results exist, include a recommendation angle.
- End with one short next-step question.
- No markdown, no bullets.`;

        const reply = await processGeminiChat([{ role: "user", parts: [{ text: prompt }] }]);
        const text = reply?.type === "text" ? String(reply.text || "").trim() : "";
        return text || null;
    };

    const processFunctionCall = async (
        functionName: string,
        args: any,
        _modelText: string,
        chatIdOverride?: string,
        eventIdRef?: { current: string | null },
        metrics?: ActionMetrics
    ): Promise<boolean> => {
        if (functionName === "create_event") {
            if (!currentUser) {
                await persistAgentMessage({ type: "text", content: "Please sign in so I can create events in your workspace." }, chatIdOverride);
                return true;
            }

            const city = String(args.city || activeCity || "Lagos");
            const eventName = String(args.eventName || "New Event");
            const guestCount = Number(args.guestCount || 0) || 0;
            const budget = Number(args.budget || 0) || 0;
            const createdEventId = await createEvent({
                hostId: currentUser.uid,
                hostName: currentUser.displayName || currentUser.email || "Host",
                eventName,
                date: String(args.date || ""),
                location: city,
                guestCount,
                budget,
                status: "Planning",
                image: "/placeholder.png",
                description: String(args.description || `Planning workspace for ${eventName}`),
                bookedVendors: [],
                leads: [],
                categories: [],
                themes: [],
                guests: [],
                todoList: [],
                itineraryItems: [],
                budgetBreakdown: []
            });
            setSelectedEventId(createdEventId);
            if (eventIdRef) eventIdRef.current = createdEventId;
            metrics?.createdEvents.push({ eventName, city });
            return true;
        }

        if (functionName === "add_todo_item") {
            const item = String(args.item || args.label || args.task || args.title || args.todo || "").trim();
            if (!item) return true;
            const directId = args.eventId || eventIdRef?.current;
            if (directId) {
                const freshEvent = await getEventById(directId);
                if (freshEvent) {
                    const nextTodo = [...(freshEvent.todoList || [])];
                    if (!nextTodo.includes(item)) nextTodo.push(item);
                    await updateEvent(freshEvent.id, { todoList: nextTodo });
                    setSelectedEventId(freshEvent.id);
                    metrics && (metrics.todoAdded += 1);
                    return true;
                }
            }
            const targetEvent = resolveTargetEvent(args);
            if (!targetEvent) return true;
            const nextTodo = [...(targetEvent.todoList || [])];
            if (!nextTodo.includes(item)) nextTodo.push(item);
            await updateEvent(targetEvent.id, { todoList: nextTodo });
            setSelectedEventId(targetEvent.id);
            metrics && (metrics.todoAdded += 1);
            return true;
        }

        if (functionName === "add_itinerary_item") {
            const time = String(args.time || args.startTime || args.slot || "").trim();
            const label = String(args.label || args.item || args.task || args.activity || args.title || "").trim();
            if (!time || !label) return true;
            const note = args.note ? String(args.note) : "";
            const entry: TimelineEntry = note ? { time, label, note } : { time, label };
            const directId = args.eventId || eventIdRef?.current;
            if (directId) {
                const freshEvent = await getEventById(directId);
                if (freshEvent) {
                    const nextItems: TimelineEntry[] = [...(freshEvent.itineraryItems || [])];
                    nextItems.push(entry);
                    await updateEvent(freshEvent.id, { itineraryItems: nextItems });
                    setSelectedEventId(freshEvent.id);
                    metrics && (metrics.itineraryAdded += 1);
                    return true;
                }
            }
            const targetEvent = resolveTargetEvent(args);
            if (!targetEvent) return true;
            const nextItems: TimelineEntry[] = [...(targetEvent.itineraryItems || [])];
            nextItems.push(entry);
            await updateEvent(targetEvent.id, { itineraryItems: nextItems });
            setSelectedEventId(targetEvent.id);
            metrics && (metrics.itineraryAdded += 1);
            return true;
        }

        if (functionName === "find_vendors") {
            const city = String(args.city || activeCity || "");
            const category = args.category ? String(args.category) : null;
            const vendorsForCity = city ? (allVendorsByCity[city] || []) : Object.values(allVendorsByCity).flat();
            const filtered = category
                ? vendorsForCity.filter((v: any) => {
                    const type = (v.type || "").toLowerCase();
                    const cats = Array.isArray(v.categories) ? v.categories.map((c: string) => c.toLowerCase()) : [];
                    return type.includes(category.toLowerCase()) || cats.some((c: string) => c.includes(category.toLowerCase()));
                })
                : vendorsForCity;

            metrics?.vendorSearches.push({
                city: city || "your area",
                category,
                count: filtered.length,
                topVendors: filtered.slice(0, 3).map((v: any) => String(v?.name || "")).filter(Boolean)
            });
            metrics?.pendingMessages.push({
                type: "vendor_cards",
                content: `Here are the top${category ? ` ${category}` : ""} vendors in ${city || "your area"}:`,
                city,
                vendors: filtered,
                viewAllHref: "/dashboard/hosts/search",
                viewAllLabel: "View all vendors"
            });
            return true;
        }

        return false;
    };

    const getRequiredFunctionCalls = async (
        prompt: string,
        allowedFunctionNames: string[],
        maxAttempts = 3
    ): Promise<{ name: string; args: any }[]> => {
        let attemptPrompt = prompt;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const result = await processGeminiChat(
                [{ role: "user", parts: [{ text: attemptPrompt }] }],
                { forceFunctionCall: true, allowedFunctionNames }
            );

            if (result?.type === "function_call") {
                const rawCalls: { name: string; args: any }[] =
                    (result as any).functionCalls || [{ name: (result as any).functionName!, args: (result as any).args || {} }];
                const filtered = rawCalls.filter((call) => allowedFunctionNames.includes(String(call?.name || "")));
                if (filtered.length > 0) return filtered;
            }

            attemptPrompt = `${prompt}
IMPORTANT: You must respond using function calls only (${allowedFunctionNames.join(", ")}). Do not return plain text.`;
        }

        return [];
    };

    const getWorkflowContext = async (args: any = {}) => {
        const directId = args?.eventId ? String(args.eventId) : selectedEventId;
        if (directId) {
            const byId = await getEventById(directId);
            if (byId) return byId;
        }

        if (args?.eventName) {
            const query = String(args.eventName).toLowerCase();
            const byName = liveEvents.find((ev) => ev.eventName.toLowerCase().includes(query));
            if (byName?.id) {
                const fresh = await getEventById(byName.id);
                if (fresh) return fresh;
                return byName;
            }
        }

        if (liveEvents.length === 1) return liveEvents[0];
        return null;
    };

    const toApprovalPayload = (event: SharedEvent) => ({
        eventId: event.id,
        eventName: event.eventName,
        city: event.location,
        guestCount: event.guestCount,
        budget: event.budget
    });

    const generateTodoForEvent = async (event: SharedEvent, chatIdOverride?: string) => {
        let todoApplied = 0;
        const eventIdRef = { current: event.id };
        const todoPrompt = `For the event "${event.eventName}" with ${event.guestCount} guests, budget ${event.budget || 0}, in ${event.location}, create a concise event planning checklist. Call add_todo_item for each task (aim for 6–8 tasks). The eventName is "${event.eventName}".`;
        const todoCalls = await getRequiredFunctionCalls(todoPrompt, ["add_todo_item"]);
        for (const call of todoCalls) {
            const ok = await processFunctionCall(call.name, { ...call.args, eventId: event.id }, "", chatIdOverride, eventIdRef);
            if (ok && call.name === "add_todo_item") todoApplied++;
        }
        if (todoApplied === 0) {
            const fallbackTodo = getDefaultTodoItems(event.eventName, event.guestCount || 0, event.location || "your city");
            for (const item of fallbackTodo) {
                const ok = await processFunctionCall("add_todo_item", { item, eventId: event.id }, "", chatIdOverride, eventIdRef);
                if (ok) todoApplied++;
            }
        }
        return todoApplied;
    };

    const generateItineraryForEvent = async (event: SharedEvent, chatIdOverride?: string) => {
        let itineraryApplied = 0;
        const eventIdRef = { current: event.id };
        const itineraryPrompt = `Build a realistic day-of itinerary for "${event.eventName}" in ${event.location}, ${event.guestCount} guests. Call add_itinerary_item for each slot (aim for 6–8 items with times like "10:00 AM"). The eventName is "${event.eventName}".`;
        const itineraryCalls = await getRequiredFunctionCalls(itineraryPrompt, ["add_itinerary_item"]);
        for (const call of itineraryCalls) {
            const ok = await processFunctionCall(call.name, { ...call.args, eventId: event.id }, "", chatIdOverride, eventIdRef);
            if (ok && call.name === "add_itinerary_item") itineraryApplied++;
        }
        if (itineraryApplied === 0) {
            const fallbackItinerary = getDefaultItineraryItems();
            for (const slot of fallbackItinerary) {
                const ok = await processFunctionCall("add_itinerary_item", { ...slot, eventId: event.id }, "", chatIdOverride, eventIdRef);
                if (ok) itineraryApplied++;
            }
        }
        return itineraryApplied;
    };

    const generateBudgetForEvent = async (event: SharedEvent) => {
        const budget = Math.max(0, Number(event.budget || 0));
        const template = [
            { category: "Venue", percent: 30 },
            { category: "Catering", percent: 25 },
            { category: "Decor", percent: 12 },
            { category: "Entertainment (DJ/MC)", percent: 10 },
            { category: "Photo/Video", percent: 10 },
            { category: "Attire/Beauty", percent: 5 },
            { category: "Logistics & Contingency", percent: 8 }
        ];

        let running = 0;
        const breakdown = template.map((row, index) => {
            const isLast = index === template.length - 1;
            const amount = isLast
                ? Math.max(budget - running, 0)
                : Math.max(Math.round((budget * row.percent) / 100), 0);
            running += amount;
            return { ...row, amount };
        });

        await updateEvent(event.id, { budgetBreakdown: breakdown });
        return breakdown.length;
    };

    const handleApprovalAction = async (actionData: any, chatIdOverride?: string) => {
        const action = String(actionData?.action || "");
        if (!APPROVAL_ACTIONS.has(action)) return false;

        const event = await getWorkflowContext(actionData);
        if (!event) {
            await persistAgentMessage(
                {
                    type: "text",
                    content: "I couldn't find the event context for that step. Open the event card again and retry approval."
                },
                chatIdOverride
            );
            return true;
        }

        setSelectedEventId(event.id);
        const payload = toApprovalPayload(event);

        if (action === "approve_generate_itinerary") {
            await persistAgentMessage(
                { type: "text", content: `Creating the itinerary for "${event.eventName}" now.` },
                chatIdOverride
            );
            const itineraryApplied = await generateItineraryForEvent(event, chatIdOverride);
            await persistAgentMessage(
                { type: "timeline", content: `Itinerary ready (${itineraryApplied} items).` },
                chatIdOverride
            );
            await persistAgentMessage(
                {
                    type: "action",
                    content: "Planning progress",
                    actions: buildWorkflowActions("itinerary")
                },
                chatIdOverride
            );
            await persistAgentMessage(
                {
                    type: "text",
                    content: "Review the itinerary above. Approve to generate your checklist next.",
                    suggestions: [{ label: "Approve to continue", action: "approve_generate_todo", ...payload }]
                },
                chatIdOverride
            );
            return true;
        }

        if (action === "approve_generate_todo") {
            await persistAgentMessage(
                { type: "text", content: `Creating the checklist for "${event.eventName}" now.` },
                chatIdOverride
            );
            const todoApplied = await generateTodoForEvent(event, chatIdOverride);
            await persistAgentMessage(
                { type: "todo", content: `Checklist ready (${todoApplied} items).` },
                chatIdOverride
            );
            await persistAgentMessage(
                {
                    type: "action",
                    content: "Planning progress",
                    actions: buildWorkflowActions("todo")
                },
                chatIdOverride
            );
            await persistAgentMessage(
                {
                    type: "text",
                    content: "Review the checklist above. Approve to generate the budget plan.",
                    suggestions: [{ label: "Approve to continue", action: "approve_generate_budget", ...payload }]
                },
                chatIdOverride
            );
            return true;
        }

        if (action === "approve_generate_budget") {
            await persistAgentMessage(
                { type: "text", content: `Creating the budget plan for "${event.eventName}" now.` },
                chatIdOverride
            );
            const budgetLines = await generateBudgetForEvent(event);
            const refreshedEvent = await getEventById(event.id);
            await persistAgentMessage(
                {
                    type: "budget",
                    content: `Budget plan ready (${budgetLines} categories).`,
                    eventId: refreshedEvent?.id || event.id
                },
                chatIdOverride
            );
            await persistAgentMessage(
                {
                    type: "action",
                    content: "Planning progress",
                    actions: buildWorkflowActions("budget")
                },
                chatIdOverride
            );
            await persistAgentMessage(
                {
                    type: "text",
                    content: "Budget plan ready. Should we set up your event ticketing now?",
                    suggestions: [{ label: "Set up Tickets", action: "start_ticketing", ...payload }]
                },
                chatIdOverride
            );
            return true;
        }

        if (action === "approve_find_vendors") {
            const city = event.location || String(actionData?.city || activeCity || "");
            const vendorsForCity = city ? (allVendorsByCity[city] || []) : Object.values(allVendorsByCity).flat();
            await persistAgentMessage(
                {
                    type: "vendor_cards",
                    content: `Here are top vendors in ${city || "your area"} for "${event.eventName}":`,
                    city,
                    vendors: vendorsForCity,
                    viewAllHref: "/dashboard/hosts/search",
                    viewAllLabel: "View all vendors"
                },
                chatIdOverride
            );
            await persistAgentMessage(
                {
                    type: "action",
                    content: "Planning progress",
                    actions: buildWorkflowActions("vendors")
                },
                chatIdOverride
            );
            await persistAgentMessage(
                {
                    type: "text",
                    content: "Vendors are ready. Want me to narrow this to catering, decor, photography, or music first?",
                    suggestions: [
                        { label: "Approve to generate itinerary", action: "approve_generate_itinerary", ...payload },
                        { label: "Catering", action: "vendor_search" },
                        { label: "Decor", action: "vendor_search" }
                    ]
                },
                chatIdOverride
            );
            return true;
        }

        return false;
    };

    const dispatchLogic = (text: string, actionData?: any, currentChatId?: string) => {
        const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        if (pendingAction?.action === "search_flights" && !actionData?.action) {
            actionData = { ...pendingAction, origin: text.trim() };
            setPendingAction(null);
        }

        const intent = extractIntent(text, actionData);
        const city = resolveCity(text, activeCity);

        if (city && city !== activeCity) setActiveCity(city);

        setTyping(true);
        setTimeout(async () => {
            setTyping(false);

            let response: any = {
                id: Date.now() + 1,
                role: "agent",
                time: nowStr,
                type: "text"
            };
            const normalizedIntent = intent === "start_experiences" ? "experience" : intent;
            const allVendors = Object.values(allVendorsByCity).flat();
            const activeEvent = resolveTargetEvent(actionData);

            if (normalizedIntent === "search_flights") {
                if (!activeEvent) {
                    response.content = "Which event should I use for the flight search?";
                    setMessages((prev) => [...prev, response]);
                    if (currentChatId) saveChatMessage(currentChatId, response);
                    return;
                }

                let inferredOrigin = String(actionData?.origin || "").trim()
                    || String(activeCity || "").trim();
                if (!inferredOrigin || (activeEvent.location && inferredOrigin.toLowerCase() === activeEvent.location.toLowerCase())) {
                    inferredOrigin = "";
                }

                if (!actionData?.skipPreferencesPrompt && !inferredOrigin) {
                    await persistAgentMessage(
                        {
                            type: "flight_form",
                            eventId: activeEvent.id,
                            defaultOrigin: String(activeCity || "").trim(),
                            destination: String(activeEvent.location || "").trim(),
                            content: "Enter your departure location."
                        },
                        currentChatId
                    );
                    return;
                }

                const eventDestination = String(activeEvent.location || "").trim();
                const fallbackDestination = String(actionData?.destination || "").trim();
                if (!eventDestination && !fallbackDestination) {
                    await persistAgentMessage(
                        {
                            type: "flight_form",
                            eventId: activeEvent.id,
                            defaultOrigin: inferredOrigin,
                            destination: "",
                            content: "Add your departure location and destination."
                        },
                        currentChatId
                    );
                    return;
                }

                await persistAgentMessage(
                    {
                        type: "text",
                        content: `Got it. I’m checking live options from ${inferredOrigin} to ${eventDestination || fallbackDestination || "your event location"} around ${activeEvent.date || "your event date"} and I’ll share the best links next.`
                    },
                    currentChatId
                );
                await runFlightDealSearch(
                    activeEvent,
                    inferredOrigin,
                    fallbackDestination,
                    currentChatId
                );
                return;
            }

            if (normalizedIntent === "get_inspiration") {
                if (!activeEvent) {
                    response.content = "Which event should I use for inspiration?";
                    setMessages((prev) => [...prev, response]);
                    if (currentChatId) saveChatMessage(currentChatId, response);
                    return;
                }

                await runInspirationSearch(activeEvent, currentChatId);
                return;
            }

            if (intent === "start_planning") {
                response.type = "event_form";
                response.content = "Share your event details and I'll build your plan across vendor, itineraries and budget.";
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            if (intent === "dismiss_suggestions") {
                response.type = "text";
                response.content = "Perfect. I’ll pause suggestions for now. If you need anything else, just tell me.";
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            if (intent === "edit_event") {
                const event = resolveTargetEvent(actionData);
                if (!event) {
                    response.type = "text";
                    response.content = "I couldn't find which event to edit. Open an event card and try again.";
                    setMessages((prev) => [...prev, response]);
                    if (currentChatId) saveChatMessage(currentChatId, response);
                    return;
                }

                response.type = "event_form";
                response.mode = "edit";
                response.eventId = event.id;
                response.content = `Getting event details for **${event.eventName}**. Update the form below.`;
                response.formData = {
                    eventId: event.id,
                    name: event.eventName || "",
                    guests: String(event.guestCount || ""),
                    budget: String(event.budget || ""),
                    city: event.location || "",
                    date: event.date || "",
                    type: event.themes?.[0] || "",
                    categories: (event.categories || []).join(", "),
                    tags: (event.themes || []).join(", ")
                };
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            if (intent === "start_ticketing") {
                response.type = "ticket_form";
                const event = resolveTargetEvent(actionData);
                response.content = `Let's set up ticketing for **${event?.eventName || "your event"}**. What tiers are you thinking?`;
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            if (intent === "overview" || intent === "todo" || intent === "timeline" || intent === "budget") {
                response.type = intent;
                if (intent === "overview") {
                    response.content = "I pulled your current events so we can decide what to tackle next.";
                    response.suggestions = [
                        { label: "Open To-do", action: "todo" },
                        { label: "Open Itinerary", action: "timeline" },
                        { label: "Open Budget", action: "budget" }
                    ];
                } else if (intent === "todo") {
                    response.content = "Perfect. Here is your checklist workspace. I can also suggest next tasks after you review it.";
                    response.suggestions = [
                        { label: "Open Itinerary", action: "timeline" },
                        { label: "Open Budget", action: "budget" },
                        { label: "Discover Vendors", action: "vendor_search" }
                    ];
                } else if (intent === "timeline") {
                    response.content = "Got it. Here is your itinerary workspace so we can shape the run-of-show.";
                    response.suggestions = [
                        { label: "Open To-do", action: "todo" },
                        { label: "Open Budget", action: "budget" },
                        { label: "Discover Vendors", action: "vendor_search" }
                    ];
                } else {
                    response.content = "Here is your budget workspace. Once you review the split, I can help rebalance it.";
                    response.suggestions = [
                        { label: "Open To-do", action: "todo" },
                        { label: "Open Itinerary", action: "timeline" },
                        { label: "Discover Vendors", action: "vendor_search" }
                    ];
                }
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            if (intent === "start_store" || intent === "view_store_kit" || intent === "view_kit" || intent === "upsell") {
                if (storeKits.length === 0) {
                    response.type = "text";
                    response.content = "No store chats yet.";
                } else {
                    response.type = "store_cards";
                    response.content = "Shop these itineraries and save event-planning time";
                    response.items = storeKits.map((kit: any) => ({
                        id: kit.id,
                        title: kit.title || kit.name || "Untitled chat",
                        city: kit.city || "Unspecified",
                        price: kit.price || "—",
                        rating: kit.rating,
                        runs: kit.runs
                    }));
                    response.viewAllHref = "/dashboard/hosts/store";
                    response.viewAllLabel = "View all kits";
                }
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            if (!city && (normalizedIntent === "vendor_search" || normalizedIntent === "start_vendor_search")) {
                response.type = "vendor_cards";
                response.content = "Top vendors across all cities:";
                response.vendors = allVendors;
                response.viewAllHref = "/dashboard/hosts/search";
                response.viewAllLabel = "View all vendors";
                response.suggestions = [{ label: "Experiences", action: "start_experiences" }];
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            if (!city && normalizedIntent === "experience") {
                const experienceVendors = allVendors.filter((v: any) =>
                    Array.isArray(v.categories) ? v.categories.includes("Experiences") : v.type === "Experiences"
                );
                if (experienceVendors.length === 0) {
                    response.type = "text";
                    response.content = "I couldn't find experience packages yet. Want all vendors instead?";
                    response.suggestions = [{ label: "Discover Vendors", action: "vendor_search" }];
                } else {
                    response.type = "vendor_cards";
                    response.content = "Top experience packages across all cities:";
                    response.vendors = experienceVendors;
                    response.viewAllHref = "/dashboard/hosts/experiences";
                    response.viewAllLabel = "View all experiences";
                    response.suggestions = [{ label: "Discover Vendors", action: "vendor_search" }];
                }
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            if (!city) {
                response.type = "text";
                const isGreeting = /\b(hi|hello|hey|yo|sup|good\s*(morning|afternoon|evening))\b/i.test(text);
                response.content = isGreeting
                    ? "Hey. What are you planning?"
                    : "Got it. Tell me what you want to plan, and I’ll get started.";
                response.suggestions = [
                    { label: "Plan", action: "start_planning" },
                    { label: "Discover Vendors", action: "vendor_search" },
                    { label: "Experiences", action: "start_experiences" },
                    { label: "Store", action: "start_store" }
                ];
                setPendingAction(null);
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            const market = MARKET_DATA[city];
            const capabilityResponse = market?.capabilityResponses?.[normalizedIntent] || market?.capabilityResponses?.fallback;

            if (capabilityResponse) {
                response = { ...response, ...capabilityResponse };
                if (normalizedIntent === "vendor_search" || normalizedIntent === "start_vendor_search") {
                    response.vendors = allVendorsByCity[city] || [];
                    response.viewAllHref = "/dashboard/hosts/search";
                    response.viewAllLabel = "View all vendors";
                }
                if (normalizedIntent === "experience") {
                    const experienceVendors = (allVendorsByCity[city] || []).filter((v: any) =>
                        Array.isArray(v.categories) ? v.categories.includes("Experiences") : v.type === "Experiences"
                    );
                    if (experienceVendors.length === 0) {
                        response.type = "text";
                        response.content = `I couldn't find experience packages in ${city} yet. Want to see all vendors instead?`;
                        response.suggestions = [{ label: "Discover Vendors", action: "vendor_search" }];
                    } else {
                        response.type = "vendor_cards";
                        response.content = `Top experience packages in ${city}:`;
                        response.vendors = experienceVendors;
                        response.viewAllHref = "/dashboard/hosts/experiences";
                        response.viewAllLabel = "View all experiences";
                        response.suggestions = [{ label: "Discover Vendors", action: "vendor_search" }];
                    }
                }
            } else {
                response.content = `I'm coordinating your ${city} event. How else can I help?`;
                response.suggestions = [
                    { label: "Plan", action: "start_planning" },
                    { label: "Discover Vendors", action: "vendor_search" },
                    { label: "Experiences", action: "start_experiences" },
                    { label: "Store", action: "start_store" }
                ];
            }

            if (currentChatId) {
                saveChatMessage(currentChatId, response);
            } else {
                setMessages((prev) => [...prev, response]);
            }
        }, 1200);
    };

    const handleGeminiAction = async (text: string, chatIdOverride?: string) => {
        const getNaturalReply = async (history: { role: string; parts: { text: string }[] }[]) => {
            const reply = await processGeminiChat(history);
            const replyText = reply?.text && String(reply.text).trim();
            if (replyText) return replyText;

            // Retry once with a direct prompt to force a plain conversational response.
            const retry = await processGeminiChat([
                ...history,
                {
                    role: "user",
                    parts: [{ text: `Reply naturally to this message in one short paragraph: "${text}"` }]
                }
            ]);
            return retry?.text && String(retry.text).trim() ? String(retry.text).trim() : null;
        };

        const rawModelHistory = [...messages, { role: "user", content: text }]
            .slice(-14)
            .map((m: any) => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: String(m.content || "").trim() || `[${m.type || "message"}]` }]
            }));
        const firstUserIndex = rawModelHistory.findIndex((m: any) => m.role === "user");
        const modelHistory =
            firstUserIndex >= 0
                ? rawModelHistory.slice(firstUserIndex)
                : [{ role: "user", parts: [{ text }] }];

        const geminiResult = await processGeminiChat(modelHistory);
        if (!geminiResult) {
            const fallbackText = await getNaturalReply(modelHistory);
            if (fallbackText) {
                await persistAgentMessage({ type: "text", content: fallbackText }, chatIdOverride);
                return true;
            }
            return false;
        }

        if (geminiResult.type === "error") {
            console.error("Gemini request failed in chat hook:", (geminiResult as any).error || geminiResult);
            return false;
        }

        if (geminiResult.type !== "function_call") {
            const plainText = geminiResult.text && String(geminiResult.text).trim();
            if (plainText) {
                await persistAgentMessage(
                    {
                        type: "text",
                        content: plainText,
                        suggestions: [
                            { label: "Start Plan", action: "start_planning" },
                            { label: "Discover Vendors", action: "vendor_search" },
                            { label: "View Todo", action: "todo" }
                        ]
                    },
                    chatIdOverride
                );
                return true;
            }
            const fallbackText = await getNaturalReply(modelHistory);
            if (fallbackText) {
                await persistAgentMessage({ type: "text", content: fallbackText }, chatIdOverride);
                return true;
            }
            return false;
        }

        const allCalls: { name: string; args: any }[] = (geminiResult as any).functionCalls || [{ name: geminiResult.functionName!, args: geminiResult.args || {} }];
        const modelText = geminiResult.text && String(geminiResult.text).trim();
        const eventIdRef = { current: null as string | null };
        const actionMetrics: ActionMetrics = {
            createdEvents: [],
            todoAdded: 0,
            itineraryAdded: 0,
            vendorSearches: [],
            pendingMessages: []
        };
        let handled = false;

        const createCall = allCalls.find((c) => c.name === "create_event");
        if (createCall) {
            const created = await processFunctionCall("create_event", createCall.args || {}, modelText, chatIdOverride, eventIdRef, actionMetrics);
            handled = handled || created;

            if (created && eventIdRef.current) {
                const createdEvent = await getEventById(eventIdRef.current);
                if (createdEvent) {
                    setSelectedEventId(createdEvent.id);
                    await persistAgentMessage(
                        { type: "event_overview", content: "Event created. Review the card below.", eventId: createdEvent.id },
                        chatIdOverride
                    );
                    await persistAgentMessage(
                        {
                            type: "action",
                            content: "Planning progress",
                            actions: buildWorkflowActions("event")
                        },
                        chatIdOverride
                    );
                    await persistAgentMessage(
                        {
                            type: "text",
                            content: "Approve and I’ll generate the itinerary next.",
                            suggestions: [{ label: "Approve to continue", action: "approve_generate_itinerary", ...toApprovalPayload(createdEvent) }]
                        },
                        chatIdOverride
                    );
                    return true;
                }
                await persistAgentMessage(
                    {
                        type: "text",
                        content: "Event created. Approve and I’ll generate the itinerary next.",
                        suggestions: [{ label: "Approve to continue", action: "approve_generate_itinerary", eventId: eventIdRef.current }]
                    },
                    chatIdOverride
                );
                await persistAgentMessage(
                    {
                        type: "action",
                        content: "Planning progress",
                        actions: buildWorkflowActions("event")
                    },
                    chatIdOverride
                );
                return true;
            }
        }

        for (const call of allCalls.filter((c) => c.name !== "create_event")) {
            const ok = await processFunctionCall(call.name, call.args || {}, modelText, chatIdOverride, eventIdRef, actionMetrics);
            if (ok) handled = true;
        }

        if (handled) {
            const naturalNarration =
                await generateActionNarration(text, actionMetrics, modelText) ||
                buildActionFallback(actionMetrics);
            await persistAgentMessage({ type: "text", content: naturalNarration }, chatIdOverride);
            for (const msg of actionMetrics.pendingMessages) {
                await persistAgentMessage(msg, chatIdOverride);
            }
        }

        return handled;
    };

    const send = async (text: string, actionData?: any) => {
        if (!text.trim()) return;
        const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const hasExplicitAction = Boolean(actionData?.action || actionData?.id);

        const pendingFlight = pendingAction?.action === "search_flights";
        if (pendingFlight && !hasExplicitAction) {
            let chatIdStr = getRouteChatId();
            const isNew = chatIdStr === "new" || chatIdStr.startsWith("task-");
            if (isNew && currentUser) {
                chatIdStr = await createChat(currentUser.uid, text.substring(0, 30), activeCity);
                for (const m of INITIAL_MESSAGES) {
                    await saveChatMessage(chatIdStr, { ...m, time: nowStr });
                }
                router.push(`/dashboard/hosts/chat/${chatIdStr}`);
            }
            if (chatIdStr !== "new") {
                await saveChatMessage(chatIdStr, { role: "user", content: text, time: nowStr });
            } else {
                setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: text, time: nowStr }]);
            }
            dispatchLogic(text, pendingAction, chatIdStr !== "new" ? chatIdStr : undefined);
            setInput("");
            return;
        }

        let chatIdStr = getRouteChatId();
        const isNew = chatIdStr === "new" || chatIdStr.startsWith("task-");

        if (isNew && !currentUser) {
            setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: text, time: nowStr }]);
            if (hasExplicitAction) {
                const approvalHandled = await handleApprovalAction(actionData);
                if (!approvalHandled) dispatchLogic(text, actionData);
            } else {
                await addAgentMsg({
                    type: "text",
                    content: "AI request failed. Open Chrome DevTools Console to see the exact Gemini error."
                });
            }
            setInput("");
            return;
        }

        if (isNew && currentUser) {
            const newChatId = await createChat(currentUser.uid, text.substring(0, 30), activeCity);

            for (const m of INITIAL_MESSAGES) {
                await saveChatMessage(newChatId, { ...m, time: nowStr });
            }

            await saveChatMessage(newChatId, { role: "user", content: text, time: nowStr });
            if (hasExplicitAction) {
                const approvalHandled = await handleApprovalAction(actionData, newChatId);
                if (!approvalHandled) dispatchLogic(text, actionData, newChatId);
                router.push(`/dashboard/hosts/chat/${newChatId}`);
                setInput("");
                return;
            }
            const geminiHandled = await handleGeminiAction(text, newChatId);
            if (!geminiHandled && actionData) {
                dispatchLogic(text, actionData, newChatId);
            } else if (!geminiHandled) {
                await persistAgentMessage(
                    {
                        type: "text",
                        content: "AI request failed. Open Chrome DevTools Console to see the exact Gemini error."
                    },
                    newChatId
                );
            }

            router.push(`/dashboard/hosts/chat/${newChatId}`);
            setInput("");
            return;
        }

        if (chatIdStr !== "new") {
            await saveChatMessage(chatIdStr, { role: "user", content: text, time: nowStr });
            if (hasExplicitAction) {
                const approvalHandled = await handleApprovalAction(actionData, chatIdStr);
                if (!approvalHandled) dispatchLogic(text, actionData, chatIdStr);
                setInput("");
                return;
            }
            const geminiHandled = await handleGeminiAction(text, chatIdStr);
            if (!geminiHandled && actionData) {
                dispatchLogic(text, actionData, chatIdStr);
            } else if (!geminiHandled) {
                await persistAgentMessage(
                    {
                        type: "text",
                        content: "AI request failed. Open Chrome DevTools Console to see the exact Gemini error."
                    },
                    chatIdStr
                );
            }
        }

        setInput("");
    };

    const addUserMsg = async (content: string) => {
        const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const userMsg = { role: "user", content, time: nowStr };

        const chatIdStr = getRouteChatId();
        if (chatIdStr !== "new") {
            await saveChatMessage(chatIdStr, userMsg);
        } else {
            setMessages((prev) => [...prev, { ...userMsg, id: Date.now().toString() }]);
        }
    };

    const addAgentMsg = async (msg: any) => {
        await persistAgentMessage(msg);
    };

    const handleSelectCity = async (city: string) => {
        setActiveCity(city);
        const chatIdStr = getRouteChatId();

        if (chatIdStr !== "new") {
            await updateChatMetadata(chatIdStr, { activeCity: city });
        }

        await addAgentMsg({
            content: MARKET_DATA[city]?.greeting || `${city} — let's go. Tapped into the local vendor network. What are we planning?`,
            suggestions: [
                { label: "Discover Vendors", action: "vendor_search" },
            ]
        });

        if (pendingAction) {
            const actionToRun = pendingAction;
            setPendingAction(null);

            setTimeout(() => {
                const text = actionToRun.label || actionToRun.text || "Continue";
                dispatchLogic(text, actionToRun, chatIdStr !== "new" ? chatIdStr : undefined);
            }, 1000);
        }
    };

    const handleFormSubmit = async (data: any) => {
        if (!currentUser) {
            addAgentMsg({ type: "text", content: "Please sign in to create events." });
            return;
        }

        const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const eventName = String(data.name || "My Event").trim();
        const guestCount = Number(data.guests) || 0;
        const budget = Number(String(data.budget || "0").replace(/[^0-9.]/g, "")) || 0;
        const city = String(data.city || activeCity || "Lagos");
        const date = String(data.date || "");
        const eventType = String(data.type || "");
        const categories = String(data.categories || "").split(",").map(c => c.trim()).filter(Boolean);
        const themes = String(data.tags || "").split(",").map(t => t.trim()).filter(Boolean);
        if (eventType && !themes.includes(eventType)) themes.push(eventType);
        const editEventId = String(data.eventId || "").trim();
        const isEditing = Boolean(editEventId);

        if (data.city) setActiveCity(city);

        let chatIdStr = getRouteChatId();
        const isNew = chatIdStr === "new" || chatIdStr.startsWith("task-");
        if (isNew) {
            chatIdStr = await createChat(currentUser.uid, eventName.substring(0, 30), city);
            for (const m of INITIAL_MESSAGES) {
                await saveChatMessage(chatIdStr, { ...m, time: nowStr });
            }
            router.push(`/dashboard/hosts/chat/${chatIdStr}`);
        }

        const userText = `${isEditing ? "Update event" : "Event"}: ${eventName}${date ? `, Date: ${date}` : ""}${eventType ? `, Type: ${eventType}` : ""}, ${guestCount} guests, budget ${budget}, city ${city}${categories.length ? `, Categories: ${data.categories}` : ""}`;
        await saveChatMessage(chatIdStr, { role: "user", content: userText, time: nowStr });

        setTyping(true);
        let targetEventId = editEventId;
        if (isEditing) {
            await updateEvent(editEventId, {
                eventName,
                date,
                location: city,
                guestCount,
                budget,
                categories,
                themes,
                description: `Planning workspace for ${eventName}${eventType ? ` (${eventType})` : ""}`
            });
        } else {
            targetEventId = await createEvent({
                hostId: currentUser.uid,
                hostName: currentUser.displayName || currentUser.email || "Host",
                eventName,
                date,
                location: city,
                guestCount,
                budget,
                status: "Planning",
                image: "/placeholder.png",
                description: `Planning workspace for ${eventName}${eventType ? ` (${eventType})` : ""}`,
                bookedVendors: [],
                leads: [],
                categories,
                themes,
                guests: [],
                todoList: [],
                itineraryItems: [],
                budgetBreakdown: []
            });
        }
        setSelectedEventId(targetEventId);
        const savedEvent = await getEventById(targetEventId);
        if (savedEvent) {
            await saveChatMessage(chatIdStr, {
                role: "agent",
                type: "event_overview",
                content: `${isEditing ? "Event updated" : "Event created"}. Review the card below.`,
                eventId: savedEvent.id,
                time: nowStr
            });
            await saveChatMessage(chatIdStr, {
                role: "agent",
                type: "action",
                content: "Planning progress",
                actions: buildWorkflowActions("event"),
                time: nowStr
            });
            await saveChatMessage(chatIdStr, {
                role: "agent",
                type: "text",
                content: `${isEditing ? "Event update complete" : "Event setup complete"}. I see you're looking for vendors in **${categories.join(", ") || "various categories"}**. Approve and I’ll generate vendor recommendations and your itinerary next.`,
                time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                suggestions: [{ label: "Approve to start recommendations", action: "approve_find_vendors", ...toApprovalPayload(savedEvent) }]
            });
        }

        setTyping(false);
        setInput("");
    };

    const handleTicketFormSubmit = async (data: any) => {
        if (!currentUser) {
            addAgentMsg({ type: "text", content: "Please sign in to manage ticketing." });
            return;
        }

        const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const userText = `Add ${data.name} ticket tier: ₦${data.price} (Limit: ${data.quantity})`;

        let chatIdStr = getRouteChatId();
        if (chatIdStr !== "new") {
            await saveChatMessage(chatIdStr, { role: "user", content: userText, time: nowStr });
        }

        setTyping(true);
        if (selectedEventId) {
            const price = Number(String(data.price).replace(/[^0-9.]/g, "")) || 0;
            await updateEvent(selectedEventId, { ticketPrice: price });
        }

        setTimeout(async () => {
            setTyping(false);
            const responseMsg = {
                role: "agent",
                type: "text",
                content: `Ticket tier **${data.name}** added successfully. Anything else for your event setup?`,
                time: nowStr,
                suggestions: [
                    { label: "Add another tier", action: "start_ticketing" },
                    { label: "View itinerary", action: "timeline" }
                ]
            };
            if (chatIdStr !== "new") {
                await saveChatMessage(chatIdStr, responseMsg);
            } else {
                setMessages((prev) => [...prev, { ...responseMsg, id: (Date.now() + 1).toString() }]);
            }
        }, 1200);
    };

    const handleFlightFormSubmit = async (data: any) => {
        const text = data?.origin
            ? `Search flights from ${data.origin}`
            : "Search flights";

        await send(text, {
            action: "search_flights",
            eventId: data?.eventId,
            origin: String(data?.origin || "").trim() || undefined,
            destination: String(data?.destination || "").trim() || undefined,
            skipPreferencesPrompt: true
        });
    };

    return {
        getRouteChatId,
        send,
        addUserMsg,
        addAgentMsg,
        dispatchLogic,
        handleSelectCity,
        handleFormSubmit,
        handleTicketFormSubmit,
        handleFlightFormSubmit
    };
}
