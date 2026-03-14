export type Campaign = {
  name: string
  angle: string
  channels: string[]
  creative: string
  landingPage: string
  kpi: string
}

export type Offer = {
  name: string
  content: string[]
}

export type InfluencerStoryFrame = {
  step: string
  prompt: string
}

export const campaigns: Campaign[] = [
  {
    name: "Experience Spotlight",
    angle: "Event-as-the-Experience",
    channels: ["Meta Reels", "TikTok", "Instagram Stories"],
    creative: "Cinematic event highlights: 'An evening in Lagos' focusing on the atmosphere, curation, and vendor artistry.",
    landingPage: "/explore?city=lagos",
    kpi: "Engagement rate (Story storytelling)",
  },
  {
    name: "Global Curation",
    angle: "Cross-Border Planning",
    channels: ["Google Performance Max", "Pinterest", "YouTube Shorts"],
    creative: "The host's guide: 'How to plan a world-class gala in Accra' featuring Waddi's vetted partners.",
    landingPage: "/explore?mode=curated",
    kpi: "Inquiry rate",
  },
  {
    name: "Experience Bundles",
    angle: "Modular Planning",
    channels: ["Influencer whitelisting", "Email retargeting", "Meta Advantage+"],
    creative: "Curated bundles: Signature Decor + Elite Catering + Tech Setup in one flow.",
    landingPage: "/dashboard/hosts/experiences?type=event",
    kpi: "Bundle checkout starts",
  },
]

export const offers: Offer[] = [
  {
    name: "Book Early, Lock In More",
    content: [
      "I used to be the person booking everything last minute. Like genuinely thought it would be fine. Then Detty December came and every vendor I wanted was either gone or double the price. I just sat there refreshing like that was going to help. This year I booked 90 days out, locked in my vendors, got $25,000 credit — and honestly just forgot about it until it was time. That's the version of me I want to be every year.",
    ],
  },
  {
    name: "First Premium Booking",
    content: [
      "I kept scrolling past the Waddi Verified section because I assumed it wasn't for me. Like those vendors are for people with bigger budgets, bigger events. My friend talked me into it. Used the $15,000 credit, booked my first one — and that event still comes up in conversation. Sometimes you just have to let yourself have the good thing.",
    ],
  },
  {
    name: "Full City Bundle",
    content: [
      "The group chat was a disaster. Twelve people, four vendors, nobody agreeing on anything. I just bundled everything through Waddi, sent one link, saved 15%. The chat went quiet in a good way. Planning is supposed to feel like this.",
    ],
  },
  {
    name: "5+ Bookings? You Get Concierge",
    content: [
      "I had seven bookings across two cities and I was losing my mind a little. Concierge just... took it. Sent me updates, handled the back and forth, kept everything moving. I don't know who they are but I owe them something.",
    ],
  },
]

export const promosTiptapDoc = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Payments and Security" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Learn how payments work on Waddi, how deposits are handled, and how to keep your account secure.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Payment methods" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Cards and bank transfer options are shown at checkout." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "If a payment method is not available in your city, contact support." }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Deposits and milestones" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Vendors can request a deposit to secure a date. For larger events, payments can be split into milestones tied to delivery.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Refunds and disputes" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Refund eligibility depends on the vendor policy and booking status." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "If there is a delivery issue, open a support ticket within 48 hours." }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Security tips" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Only pay through Waddi to keep your booking protected." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Do not share verification codes or passwords with anyone." }] }],
        },
      ],
    },
  ],
}

export const overviewTiptapDoc = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Help Center" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Find quick answers, step-by-step guidance, and troubleshooting for planning, bookings, and payments.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Categories" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Hosting and Planning" }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Vendors and Bookings" }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Payments and Security" }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Account and Access" }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Quick answers" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Create a new event and set a date range." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Invite collaborators and assign tasks." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Request vendor quotes and compare offers." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Pay deposits securely through Waddi." }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Need more help?" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "If you cannot find what you need here, visit Support to message our team directly.",
        },
      ],
    },
  ],
}

export const experiencesTiptapDoc = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Vendors and Bookings" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "How to discover vendors, request quotes, and manage bookings on Waddi.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Finding vendors" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Search by city, category, and budget range." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Use filters for availability, ratings, and verified partners." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Save vendors to compare later." }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Requesting quotes" }],
    },
    {
      type: "orderedList",
      attrs: { start: 1 },
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Open a vendor profile and choose Request Quote." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Share your event details, date range, and guest count." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Review the response and ask follow-up questions in chat." }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Bookings and contracts" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Confirm the scope, price, and timing before paying a deposit." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Keep all agreements in the Waddi chat for easy reference." }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Changes or cancellations" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "If plans change, message the vendor immediately and review their cancellation terms before rescheduling.",
        },
      ],
    },
  ],
}

export const playbookTiptapDoc = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Hosting and Planning" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Set up your event, organize tasks, and keep everyone aligned from first idea to final day.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Start a new event" }],
    },
    {
      type: "orderedList",
      attrs: { start: 1 },
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Open your dashboard and choose New Event." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Add a title, date range, and city." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Select the type of event and guest count." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Save to unlock your plan and vendor shortlist." }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Build your plan" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Track milestones with your timeline and checklist." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Set a budget and compare vendor quotes against it." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Use chat for quick planning questions and suggestions." }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Share with collaborators" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Invite co-hosts or planners so they can view tasks, chat with vendors, and update the plan.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Helpful prompts" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Create a timeline for a 150-person wedding in Lagos." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Suggest a budget split for venue, decor, and catering." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "List the top vendors I should book first." }] }],
        },
      ],
    },
  ],
}

export const influencerHooks = [
  "POV: you have 10 days to plan your Kigali trip.",
  "What $250,000 can get you for a full Kigali experience weekend.",
  "I used Waddi to book 3 experiences in one evening.",
  "Before Waddi vs after Waddi trip planning.",
  "The Kigali spots most people skip.",
]

export const influencerStoryFrames: InfluencerStoryFrame[] = [
  {
    step: "Hook (0-3s)",
    prompt: "Open with urgency, budget, or a bold result.",
  },
  {
    step: "Problem (3-8s)",
    prompt: "Show the planning pain: too many tabs, unclear prices, slow responses.",
  },
  {
    step: "Journey (8-20s)",
    prompt: "Show 2-3 clips of discovery, shortlist, and booking inside Waddi.",
  },
  {
    step: "Proof (20-30s)",
    prompt: "Show real experience outcome, partner names, and one clear number.",
  },
  {
    step: "CTA (final 3s)",
    prompt: "Tell viewers exactly what to do: tap bio link and book on Waddi.",
  },
]

export const copyHooks = [
  "Book trusted vendors in minutes, not weeks.",
  "Compare packages side by side.",
  "See availability before you message anyone.",
  "From discovery to booking in one flow.",
]

export const tests = [
  "Test urgency language vs trust language in headlines.",
  "Test video-first ads vs static card ads.",
  "Test category pages vs bundle pages as destination.",
  "Test broad lookalikes vs intent keyword audiences.",
]
