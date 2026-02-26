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
      "I used to be the person booking everything last minute. Like genuinely thought it would be fine. Then Detty December came and every vendor I wanted was either gone or double the price. I just sat there refreshing like that was going to help. This year I booked 90 days out, locked in my vendors, got ₦25,000 credit — and honestly just forgot about it until it was time. That's the version of me I want to be every year.",
    ],
  },
  {
    name: "First Premium Booking",
    content: [
      "I kept scrolling past the Waddi Verified section because I assumed it wasn't for me. Like those vendors are for people with bigger budgets, bigger events. My friend talked me into it. Used the ₦15,000 credit, booked my first one — and that event still comes up in conversation. Sometimes you just have to let yourself have the good thing.",
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
      content: [{ type: "text", text: "Promos and Offers" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Story-led promos that help people connect first, then book experiences with clear value and simple next steps.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Book Early, Lock In More" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I used to be the person booking everything last minute. Like genuinely thought it would be fine. Then Detty December came and every vendor I wanted was either gone or double the price. I just sat there refreshing like that was going to help. This year I booked 90 days out, locked in my vendors, got ₦25,000 credit — and honestly just forgot about it until it was time. That's the version of me I want to be every year.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "First Premium Booking" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I kept scrolling past the Waddi Verified section because I assumed it wasn't for me. Like those vendors are for people with bigger budgets, bigger events. My friend talked me into it. Used the ₦15,000 credit, booked my first one — and that event still comes up in conversation. Sometimes you just have to let yourself have the good thing.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Full City Bundle" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The group chat was a disaster. Twelve people, four vendors, nobody agreeing on anything. I just bundled everything through Waddi, sent one link, saved 15%. The chat went quiet in a good way. Planning is supposed to feel like this.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "5+ Bookings? You Get Concierge" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I had seven bookings across two cities and I was losing my mind a little. Concierge just... took it. Sent me updates, handled the back and forth, kept everything moving. I don't know who they are but I owe them something.",
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
      content: [{ type: "text", text: "Overview" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Waddi is where great experiences get discovered, planned, and booked. For people who want to show up, and hosts who need the right talent to make it happen.",
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
      content: [{ type: "text", text: "Narratives and Experiences" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Guidelines for experience-led storytelling across different countries.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Core strategy" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Every event is an experience. We do not just sell services; we sell the narrative of a world-class celebration curated by local experts. This is how we frame stories across markets.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Narrative Sample" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Experience-led storytelling." }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Planning an event in Kigali meant finding the soul of the city. We curated a day that moved from the aromatic heights of @questioncoffee to the vibrant energy of @nyarutaramarket.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Every event is an experience, and Waddi makes it world-class. With thousands of vetted vendors across African cities, you are not just booking services, you are crafting a narrative. From intimate retreats to grand celebrations, Waddi gives you the tools to plan with confidence and the connections to make it real.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "If you are hosting in Kigali and want an event that feels like the city itself, use my link and start planning with Waddi.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "#Waddi #ExperienceKigali #EventPlanning #VisitKigali #AfricanEvents",
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
      content: [{ type: "text", text: "Growth Playbook" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Goal: Drive discovery through city and cultural moments, then convert through curated vendor access and seamless booking.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "What to run" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Experience Spotlight — Meta Reels, TikTok, Instagram Stories. KPI: Engagement rate.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Global Curation — Google Performance Max, Pinterest, YouTube Shorts. KPI: Inquiry rate.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Experience Bundles — Influencer whitelisting, Email retargeting, Meta Advantage+. KPI: Bundle checkout starts.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "How to test (30 days)" }],
    },
    {
      type: "orderedList",
      attrs: { start: 1 },
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Test urgency language vs trust language in headlines." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Test video-first ads vs static card ads." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Test category pages vs bundle pages as destination." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Test broad lookalikes vs intent keyword audiences." }] }],
        },
      ],
    },
  ],
}

export const influencerHooks = [
  "POV: you have 10 days to plan your Kigali trip.",
  "What ₦250,000 can get you for a full Kigali experience weekend.",
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
