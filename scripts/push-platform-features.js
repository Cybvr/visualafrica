const admin = require("firebase-admin");
const fs = require("node:fs");
const path = require("node:path");

const serviceAccount = require("../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json");
const seedPath = path.join(process.cwd(), "scripts", "seeds", "platform-features.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

function loadSeed() {
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found: ${seedPath}`);
  }
  const raw = fs.readFileSync(seedPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("platform-features.json must be a JSON array.");
  }
  return parsed;
}

function validateFeature(feature, index) {
  const required = [
    "title",
    "description",
    "slug",
    "href",
    "heroTitle",
    "heroSubtitle",
    "heroImage",
    "features",
    "benefits",
    "ctaText",
  ];

  for (const key of required) {
    if (!(key in feature)) {
      throw new Error(`Feature at index ${index} is missing required key: ${key}`);
    }
  }
}

async function pushPlatformFeatures() {
  const features = loadSeed();
  features.forEach(validateFeature);

  const incomingIds = new Set(features.map((f) => String(f.slug)));
  const collectionRef = db.collection("platformFeatures");
  const snapshot = await collectionRef.get();
  const existingIds = snapshot.docs.map((doc) => doc.id);

  const batch = db.batch();

  for (const feature of features) {
    const docId = String(feature.slug);
    batch.set(collectionRef.doc(docId), feature, { merge: false });
  }

  for (const docId of existingIds) {
    if (!incomingIds.has(docId)) {
      batch.delete(collectionRef.doc(docId));
    }
  }

  await batch.commit();

  console.log(
    `platformFeatures sync complete. upserted=${features.length}, deleted=${existingIds.filter((id) => !incomingIds.has(id)).length}`
  );
}

pushPlatformFeatures().catch((error) => {
  console.error("platformFeatures sync failed:", error);
  process.exit(1);
});
