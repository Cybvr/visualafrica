const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "app", "awari.json");
const OUTPUT = path.join(ROOT, "app", "awari.vendors.json");

const VENDOR_CATEGORIES = [
  "Bar Tenders",
  "Cakes & Sweets",
  "Catering",
  "Decorations",
  "Entertainment",
  "Event Planners",
  "Gifts & Invites",
  "Limousines",
  "Makeup Artists",
  "Party Equipment",
  "Party Wear",
  "Photographers",
  "Photo Booths",
  "Venues",
  "Yachts",
  "Experiences",
];

const EVENT_THEMES = [
  "Kids Birthday",
  "Wedding",
  "Social Gathering",
  "Corporate Event",
  "Proposals",
  "Anniversary",
  "Bachelor",
  "Bachelorette",
  "Bridal",
];

const CATEGORY_MATCHERS = [
  { category: "Bar Tenders", re: /\b(bar|bartend|cocktail|mixolog)\b/i },
  { category: "Cakes & Sweets", re: /\b(cake|pastr|dessert|sweet|bakery)\b/i },
  { category: "Catering", re: /\b(cater|restaurant|food|grill|kitchen|chef|buffet|brunch|dining)\b/i },
  { category: "Decorations", re: /\b(decor|floral|flower|balloon|styling|tablescape)\b/i },
  { category: "Entertainment", re: /\b(dj|band|music|mc|entertain|club|lounge)\b/i },
  { category: "Event Planners", re: /\b(event planner|planning|coordination|coordinator|management)\b/i },
  { category: "Gifts & Invites", re: /\b(gift|invite|invitation|stationery|souvenir)\b/i },
  { category: "Limousines", re: /\b(limo|limousine|chauffeur|car hire|transport)\b/i },
  { category: "Makeup Artists", re: /\b(makeup|beauty|mua|gele|bridal glam)\b/i },
  { category: "Party Equipment", re: /\b(rental|equipment|chairs|tables|canopy|tent|stage|sound)\b/i },
  { category: "Party Wear", re: /\b(fashion|dress|gown|tailor|outfit|party wear)\b/i },
  { category: "Photographers", re: /\b(photo|photograph|studio|videograph|cinematography)\b/i },
  { category: "Photo Booths", re: /\b(photo booth|selfie booth)\b/i },
  { category: "Venues", re: /\b(venue|hall|hotel|resort|garden|event center|event centre)\b/i },
  { category: "Yachts", re: /\b(yacht|boat|cruise)\b/i },
  { category: "Experiences", re: /\b(experience|tour|adventure|activity)\b/i },
];

const THEME_MATCHERS = [
  { theme: "Kids Birthday", re: /\b(kids?|children|birthday)\b/i },
  { theme: "Wedding", re: /\b(wedding|traditional marriage|nikah)\b/i },
  { theme: "Corporate Event", re: /\b(corporate|conference|summit|brand|office|product launch)\b/i },
  { theme: "Proposals", re: /\b(proposal|engagement)\b/i },
  { theme: "Anniversary", re: /\b(anniversary)\b/i },
  { theme: "Bachelor", re: /\b(bachelor)\b/i },
  { theme: "Bachelorette", re: /\b(bachelorette|bridal shower)\b/i },
  { theme: "Bridal", re: /\b(bridal)\b/i },
];

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function compactUnique(values) {
  return [...new Set(values.filter(Boolean).map((v) => String(v).trim()).filter(Boolean))];
}

function titleCase(input) {
  return String(input || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toTextBlob(raw) {
  const parts = [];
  parts.push(raw.name, raw.caption, raw.description);
  if (raw.category && raw.category.name) parts.push(raw.category.name);
  if (Array.isArray(raw.subCategory)) parts.push(...raw.subCategory.map((s) => s && s.name));
  if (Array.isArray(raw.tags)) parts.push(...raw.tags);
  return parts.filter(Boolean).join(" ");
}

function mapCategories(raw) {
  const text = toTextBlob(raw);
  const matched = [];

  for (const item of CATEGORY_MATCHERS) {
    if (item.re.test(text)) matched.push(item.category);
  }

  if (matched.length === 0) {
    if (/eat\s*&\s*drink|restaurant|food|dining/i.test(text)) {
      return ["Catering"];
    }
    return ["Experiences"];
  }

  return compactUnique(matched).filter((c) => VENDOR_CATEGORIES.includes(c));
}

function mapThemes(raw) {
  const text = toTextBlob(raw);
  const matched = [];
  for (const item of THEME_MATCHERS) {
    if (item.re.test(text)) matched.push(item.theme);
  }
  if (matched.length === 0) return ["Social Gathering"];
  return compactUnique(matched).filter((t) => EVENT_THEMES.includes(t));
}

function getLocation(raw) {
  const a0 = Array.isArray(raw.address) ? raw.address[0] || {} : {};
  if (a0.address) return String(a0.address);

  const city = a0.city ? String(a0.city) : "";
  const state = a0.state ? String(a0.state) : "";
  const country = a0.country ? String(a0.country) : "Nigeria";
  const formatted = [city, state, country].filter(Boolean).join(", ");
  return formatted || "Lagos, Nigeria";
}

function getAreaServed(raw) {
  const a0 = Array.isArray(raw.address) ? raw.address[0] || {} : {};
  const values = compactUnique([a0.city, a0.state].filter(Boolean));
  if (values.length > 0) return values;
  return ["Lagos"];
}

function getPhone(raw) {
  if (Array.isArray(raw.phoneNumber) && raw.phoneNumber.length > 0) return String(raw.phoneNumber[0]);
  if (typeof raw.phoneNumber === "string" && raw.phoneNumber.trim()) return raw.phoneNumber.trim();
  const a0 = Array.isArray(raw.address) ? raw.address[0] || {} : {};
  if (Array.isArray(a0.phoneNumber) && a0.phoneNumber.length > 0) return String(a0.phoneNumber[0]);
  return "";
}

function getImageUrls(raw) {
  const numbered = Object.keys(raw)
    .filter((k) => /^image\d+$/.test(k))
    .sort((a, b) => Number(a.replace("image", "")) - Number(b.replace("image", "")))
    .map((k) => raw[k]);

  return compactUnique([raw.mainImage, ...numbered, raw.logo].filter(Boolean));
}

function toVendor(raw, usedSlugs) {
  const name = String(raw.name || "").trim() || "Unnamed Vendor";
  const id = String(raw._id || slugify(name));
  let slug = String(raw.slug || "").trim();
  if (!slug) slug = slugify(name);
  if (!slug) slug = `vendor-${id}`;

  if (usedSlugs.has(slug)) {
    let n = 2;
    while (usedSlugs.has(`${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }
  usedSlugs.add(slug);

  const categories = mapCategories(raw);
  const eventThemes = mapThemes(raw);
  const imageUrls = getImageUrls(raw);
  const image = imageUrls[0] || "/placeholder.png";
  const gallery = imageUrls.slice(0, 12).map((url, idx) => ({
    url,
    alt: `${name} image ${idx + 1}`,
  }));

  const description = String(raw.description || raw.caption || `${name} vendor profile`).trim();
  const shortDescription = String(raw.caption || description).slice(0, 140).trim();
  const rating = Number(raw.ratings) > 0 ? Number(raw.ratings) : 0;
  const eventCount = Number(raw.eventCount) > 0 ? Number(raw.eventCount) : 0;
  const tags = Array.isArray(raw.tags) ? raw.tags : [];
  const services = compactUnique(
    [
      ...(Array.isArray(raw.subCategory) ? raw.subCategory.map((s) => s && s.name) : []),
      ...tags.map((t) => titleCase(t)),
    ].filter(Boolean)
  ).slice(0, 12);

  const whatsIncluded = services.slice(0, 6);
  const yearEstablished = 2020;

  return {
    id,
    slug,
    ownerId: "awari-import",
    name,
    location: getLocation(raw),
    price: null,
    rating,
    image,
    categories,
    featured: rating >= 4.8 || eventCount >= 15,
    eventThemes,
    description,
    shortDescription,
    gallery,
    whatsIncluded,
    services,
    isNew: false,
    isSponsored: false,
    about: description,
    stats: {
      eventsPlanned: eventCount > 0 ? `${eventCount}+` : "0",
      satisfiedClients: eventCount > 0 ? `${Math.max(eventCount, 10)}+` : "0",
      corporateEvents: eventCount > 0 ? `${Math.floor(eventCount / 2)}+` : "0",
      yearsExperience: `${Math.max(new Date().getFullYear() - yearEstablished, 1)}`,
      uniqueLocations: `${Math.max(getAreaServed(raw).length, 1)}`,
    },
    phone: getPhone(raw),
    areaServed: getAreaServed(raw),
    yearEstablished,
    responseTime: "within 2 hours",
    vendor: {
      name,
      logo: raw.logo || image,
      role: "Vendor",
      since: String(yearEstablished),
      slug,
    },
  };
}

function main() {
  const rawText = fs.readFileSync(INPUT, "utf8");
  const records = JSON.parse(rawText);
  if (!Array.isArray(records)) {
    throw new Error(`Expected ${INPUT} to contain an array`);
  }

  const usedSlugs = new Set();
  const vendors = records.map((record) => toVendor(record, usedSlugs));

  fs.writeFileSync(OUTPUT, JSON.stringify(vendors, null, 2) + "\n");
  console.log(`Mapped ${vendors.length} records`);
  console.log(`Output: ${OUTPUT}`);
}

main();
