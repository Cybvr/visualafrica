import * as admin from "firebase-admin";
import fs from "node:fs";
import path from "node:path";

type SeedCollectionConfig<T> = {
  collection: string;
  file: string;
  getId: (item: T, index: number) => string;
  transform?: (item: T) => Record<string, unknown>;
};

const serviceAccount = require("../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const seedDir = path.join(process.cwd(), "scripts", "seeds");

const collections: SeedCollectionConfig<Record<string, unknown>>[] = [
  {
    collection: "vendors",
    file: "vendors.json",
    getId: (item, index) => String(item.id ?? item.slug ?? `vendor-${index}`),
  },
  {
    collection: "events",
    file: "events.json",
    getId: (item, index) => String(item.id ?? `event-${index}`),
  },
  {
    collection: "blogPosts",
    file: "blog-posts.json",
    getId: (item, index) => String(item.id ?? `post-${index}`),
  },
  {
    collection: "faqs",
    file: "faqs.json",
    getId: (item, index) => String(item.id ?? `faq-${index}`),
  },
  {
    collection: "pricingTiers",
    file: "pricing-tiers.json",
    getId: (item, index) =>
      String(item.id ?? item.name?.toString().toLowerCase().replace(/\s+/g, "-") ?? `tier-${index}`),
  },
  {
    collection: "solutions",
    file: "solutions.json",
    getId: (item, index) => String(item.slug ?? item.id ?? `solution-${index}`),
  },
  {
    collection: "platformFeatures",
    file: "platform-features.json",
    getId: (item, index) => String(item.slug ?? item.id ?? `platform-${index}`),
  },
];

function loadSeedFile<T>(fileName: string): T[] {
  const fullPath = path.join(seedDir, fileName);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Skipping ${fileName}: file not found at ${fullPath}`);
    return [];
  }

  const content = fs.readFileSync(fullPath, "utf8");
  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error(`Seed file ${fileName} must contain a JSON array.`);
  }
  return parsed as T[];
}

async function collectionCount(collection: string): Promise<number> {
  const snapshot = await db.collection(collection).count().get();
  return snapshot.data().count;
}

async function writeBatch(collection: string, docs: Record<string, unknown>[], getId: (item: Record<string, unknown>, index: number) => string) {
  const batchSize = 400;
  for (let i = 0; i < docs.length; i += batchSize) {
    const chunk = docs.slice(i, i + batchSize);
    const batch = db.batch();
    chunk.forEach((docData, index) => {
      const id = getId(docData, i + index);
      batch.set(db.collection(collection).doc(id), docData, { merge: true });
    });
    await batch.commit();
  }
}

async function migrateCollection(config: SeedCollectionConfig<Record<string, unknown>>) {
  const before = await collectionCount(config.collection);
  const seed = loadSeedFile<Record<string, unknown>>(config.file);

  if (!seed.length) {
    console.log(`[${config.collection}] no seed records found. existing docs: ${before}`);
    return;
  }

  const normalized = config.transform ? seed.map(config.transform) : seed;
  await writeBatch(config.collection, normalized, config.getId);
  const after = await collectionCount(config.collection);

  console.log(
    `[${config.collection}] seed records: ${seed.length}, existing before: ${before}, existing after: ${after}`
  );
}

async function migrate() {
  console.log("Starting Firestore migration (seed-based)...");
  console.log(`Seed directory: ${seedDir}`);

  for (const config of collections) {
    await migrateCollection(config);
  }

  console.log("Migration completed.");
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
