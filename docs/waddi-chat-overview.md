# Waddi Chat Overview

## Introduction
**Waddi Chat** (formerly known as Ama) is the core conversational AI interface driving the planning and coordination experience. At its heart, Waddi is a Large Language Model (LLM) deeply integrated into the platform's ecosystem. It acts as a highly knowledgeable, autonomous event coordinator that communicates directly with hosts, navigating the database to assist them in real-time.

## How Waddi Interacts with the App Data
Waddi doesn't just hold conversations; it **sees** the application's underlying data. 
- **Database Context**: Waddi actively queries the database to understand the available resources and context. It knows which vendors are registered, what services they offer, their pricing, and their current availability across different cities. Crucially, it also sees **past and existing events** (like community inspirations or user-specific upcoming events), giving it deep contextual awareness of how similar events were built and budgeted.
- **Dynamic Retrieval**: When a host asks for suggestions, Waddi retrieves live vendor profiles, community event inspirations, and portfolio items directly from the database and injects them seamlessly into the chat flow as interactive rich-media cards.

## Actions & Execution
Waddi goes beyond answering questions by actually executing tasks for the user. It manages this through a combination of predefined hooks and inferred intents.

### Predefined Actions
The system provides Waddi with specific, structured capabilities (predefined actions) such as:
1. **Vendor Searches**: Immediately pulling up curated lists of vendors based on city, theme, or budget.
2. **Budgeting**: Generating detailed, line-by-line financial breakdowns and tracking remaining allocations.
3. **Scheduling & Itinerary**: Managing calendar interactions and proposing event timelines.
4. **Negotiation & Booking**: Firing off automated sequence actions—like sending out quote requests, confirming holds with vendors, and preparing contracts.
5. **Upselling**: Intelligently upselling pre-built Store templates (kits) when a user needs a jumpstart, or suggesting high-value vendor "Experiences" when discussing standard bookings.

### Inferred Intents
Because Waddi is an LLM, it doesn't rely solely on rigid commands. It can infer what action is needed based on the natural flow of the conversation. 
- If a user casually mentions, *"That catering price is a bit high, can we get a bundle deal with the DJ?"*, Waddi infers the intent to **Negotiate**. It then triggers the negotiation action flow, reaching out (or simulating reaching out) to the specific vendors involved to secure a discount.
- If a user says, *"Let's go with the estate venue"*, Waddi infers the intent to **Book** and initiates the deposit or holding workflow for that specific venue without needing a rigid button click.

## Summary
Waddi Chat bridges the gap between a standard LLM and a robust event management platform. By reading live database content and acting on both predefined triggers and intelligently inferred intents, Waddi provides hosts with an "Event Planner in a Pocket" that drastically cuts down the time from conception to execution.
