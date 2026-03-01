export type WebsiteTemplate = {
  id: "classic" | "minimal" | "vibrant";
  name: string;
};

export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: "classic",
    name: "Classic Invite",
  },
  {
    id: "minimal",
    name: "Minimal Schedule",
  },
  {
    id: "vibrant",
    name: "Vibrant Spotlight",
  },
];
