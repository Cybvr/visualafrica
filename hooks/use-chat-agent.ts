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
    const getRouteChatId = () => {
        return typeof paramsId === "string" ? paramsId : Array.isArray(paramsId) ? paramsId[0] : "new";
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
                itineraryItems: []
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

    const dispatchLogic = (text: string, actionData?: any, currentChatId?: string) => {
        const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const intent = extractIntent(text, actionData);
        const city = resolveCity(text, activeCity);

        if (city && city !== activeCity) setActiveCity(city);

        setTyping(true);
        setTimeout(() => {
            setTyping(false);

            let response: any = {
                id: Date.now() + 1,
                role: "agent",
                time: nowStr,
                type: "text"
            };
            const normalizedIntent = intent === "start_experiences" ? "experience" : intent;
            const allVendors = Object.values(allVendorsByCity).flat();

            if (intent === "start_planning") {
                response.type = "event_form";
                response.content = "Share your event details and I'll build your plan.";
                setMessages((prev) => [...prev, response]);
                if (currentChatId) saveChatMessage(currentChatId, response);
                return;
            }

            if (intent === "overview" || intent === "todo" || intent === "timeline") {
                response.type = intent;
                response.content = `Here is your ${intent === "overview" ? "events overview" : (intent === "timeline" ? "itinerary" : intent)} for your planning session:`;
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

        for (const call of allCalls) {
            const ok = await processFunctionCall(call.name, call.args || {}, modelText, chatIdOverride, eventIdRef, actionMetrics);
            if (ok) handled = true;
        }

        if (eventIdRef.current && currentUser) {
            const createdId = eventIdRef.current;
            await new Promise((r) => setTimeout(r, 800));

            const createCall = allCalls.find((c) => c.name === "create_event");
            const eventName = String(createCall?.args?.eventName || "the event");
            const city = String(createCall?.args?.city || activeCity || "");
            const guestCount = Number(createCall?.args?.guestCount || 0);
            const budget = Number(createCall?.args?.budget || 0);
            let todoApplied = 0;
            let itineraryApplied = 0;
            const todoPrompt = `For the event "${eventName}" with ${guestCount} guests, budget ${budget}, in ${city}, create a concise event planning checklist. Call add_todo_item for each task (aim for 6–8 tasks). The eventName is "${eventName}".`;
            const todoCalls = await getRequiredFunctionCalls(todoPrompt, ["add_todo_item"]);
            for (const call of todoCalls) {
                const ok = await processFunctionCall(call.name, { ...call.args, eventId: createdId }, "", chatIdOverride, eventIdRef, actionMetrics);
                if (ok && call.name === "add_todo_item") todoApplied++;
            }
            if (todoApplied === 0) {
                const fallbackTodo = getDefaultTodoItems(eventName, guestCount, city || "your city");
                for (const item of fallbackTodo) {
                    const ok = await processFunctionCall("add_todo_item", { item, eventId: createdId }, "", chatIdOverride, eventIdRef, actionMetrics);
                    if (ok) todoApplied++;
                }
            }
            const itineraryPrompt = `Build a realistic day-of itinerary for "${eventName}" in ${city}, ${guestCount} guests. Call add_itinerary_item for each slot (aim for 6–8 items with times like "10:00 AM"). The eventName is "${eventName}".`;
            const itineraryCalls = await getRequiredFunctionCalls(itineraryPrompt, ["add_itinerary_item"]);
            for (const call of itineraryCalls) {
                const ok = await processFunctionCall(call.name, { ...call.args, eventId: createdId }, "", chatIdOverride, eventIdRef, actionMetrics);
                if (ok && call.name === "add_itinerary_item") itineraryApplied++;
            }
            if (itineraryApplied === 0) {
                const fallbackItinerary = getDefaultItineraryItems();
                for (const slot of fallbackItinerary) {
                    const ok = await processFunctionCall("add_itinerary_item", { ...slot, eventId: createdId }, "", chatIdOverride, eventIdRef, actionMetrics);
                    if (ok) itineraryApplied++;
                }
            }
            if (city) {
                const vendorsForCity = allVendorsByCity[city] || [];
                actionMetrics.vendorSearches.push({
                    city,
                    category: null,
                    count: vendorsForCity.length,
                    topVendors: vendorsForCity.slice(0, 3).map((v: any) => String(v?.name || "")).filter(Boolean)
                });
                actionMetrics.pendingMessages.push({
                    type: "vendor_cards",
                    content: `Here are top vendors in ${city} for your event:`,
                    city,
                    vendors: vendorsForCity,
                    viewAllHref: "/dashboard/hosts/search",
                    viewAllLabel: "View all vendors"
                });
            }
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

        let chatIdStr = getRouteChatId();
        const isNew = chatIdStr === "new" || chatIdStr.startsWith("task-");

        if (isNew && !currentUser) {
            setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: text, time: nowStr }]);
            if (hasExplicitAction) {
                dispatchLogic(text, actionData);
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
                dispatchLogic(text, actionData, newChatId);
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
                dispatchLogic(text, actionData, chatIdStr);
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

        const userText = `My event: ${eventName}, ${guestCount} guests, budget ${budget}, city ${city}`;
        await saveChatMessage(chatIdStr, { role: "user", content: userText, time: nowStr });

        setTyping(true);
        const createdEventId = await createEvent({
            hostId: currentUser.uid,
            hostName: currentUser.displayName || currentUser.email || "Host",
            eventName,
            date: String(data.date || ""),
            location: city,
            guestCount,
            budget,
            status: "Planning",
            image: "/placeholder.png",
            description: `Planning workspace for ${eventName}`,
            bookedVendors: [],
            leads: [],
            categories: [],
            themes: [],
            guests: [],
            todoList: [],
            itineraryItems: []
        });
        setSelectedEventId(createdEventId);

        await saveChatMessage(chatIdStr, {
            role: "agent",
            type: "text",
            content: `Event created: "${eventName}" in ${city}. Next I will generate your checklist.`,
            time: nowStr
        });

        await saveChatMessage(chatIdStr, {
            role: "agent",
            type: "text",
            content: "Generating checklist now.",
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        });
        const todoPrompt = `For the event "${eventName}" with ${guestCount} guests, budget ${budget}, in ${city}, create a concise event planning checklist. Call add_todo_item for each task (aim for 6–8 tasks). The eventName is "${eventName}".`;
        let todoApplied = 0;
        const todoCalls = await getRequiredFunctionCalls(todoPrompt, ["add_todo_item"]);
        for (const call of todoCalls) {
            const ok = await processFunctionCall(call.name, { ...call.args, eventId: createdEventId }, "", chatIdStr, { current: createdEventId });
            if (ok && call.name === "add_todo_item") todoApplied++;
        }
        if (todoApplied === 0) {
            const fallbackTodo = getDefaultTodoItems(eventName, guestCount, city);
            for (const item of fallbackTodo) {
                const ok = await processFunctionCall("add_todo_item", { item, eventId: createdEventId }, "", chatIdStr, { current: createdEventId });
                if (ok) todoApplied++;
            }
        }

        await saveChatMessage(chatIdStr, {
            role: "agent",
            type: "text",
            content: `Checklist ready (${todoApplied} items). Next I will draft your itinerary.`,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        });
        const itineraryPrompt = `Build a realistic day-of itinerary for "${eventName}" in ${city}, ${guestCount} guests. Call add_itinerary_item for each slot (aim for 6–8 items with times like "10:00 AM"). The eventName is "${eventName}".`;
        let itineraryApplied = 0;
        const itineraryCalls = await getRequiredFunctionCalls(itineraryPrompt, ["add_itinerary_item"]);
        for (const call of itineraryCalls) {
            const ok = await processFunctionCall(call.name, { ...call.args, eventId: createdEventId }, "", chatIdStr, { current: createdEventId });
            if (ok && call.name === "add_itinerary_item") itineraryApplied++;
        }
        if (itineraryApplied === 0) {
            const fallbackItinerary = getDefaultItineraryItems();
            for (const slot of fallbackItinerary) {
                const ok = await processFunctionCall("add_itinerary_item", { ...slot, eventId: createdEventId }, "", chatIdStr, { current: createdEventId });
                if (ok) itineraryApplied++;
            }
        }

        await saveChatMessage(chatIdStr, {
            role: "agent",
            type: "text",
            content: `Itinerary ready (${itineraryApplied} items). Next I will find vendors.`,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        });
        const vendorsForCity = allVendorsByCity[city] || [];
        await saveChatMessage(chatIdStr, {
            role: "agent",
            type: "vendor_cards",
            content: `Here are top vendors in ${city} for your event:`,
            city,
            vendors: vendorsForCity,
            viewAllHref: "/dashboard/hosts/search",
            viewAllLabel: "View all vendors",
            time: nowStr
        });

        await saveChatMessage(chatIdStr, {
            role: "agent",
            type: "text",
            content: (todoApplied > 0 && itineraryApplied > 0)
                ? `Done. Event, checklist, itinerary, and vendor options are ready for ${city}. Open Todo and Itinerary to review.`
                : `I created your event and saved vendor options, but checklist or itinerary generation is still incomplete. Open the Todo and Itinerary tabs and I can fill any missing items immediately.`,
            time: nowStr,
            suggestions: [
                { label: "View Todo", action: "todo" },
                { label: "View Itinerary", action: "timeline" },
                { label: "Discover Vendors", action: "vendor_search" }
            ]
        });

        setTyping(false);
        setInput("");
    };

    return {
        getRouteChatId,
        send,
        addUserMsg,
        addAgentMsg,
        dispatchLogic,
        handleSelectCity,
        handleFormSubmit
    };
}
