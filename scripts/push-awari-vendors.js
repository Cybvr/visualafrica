const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = require("../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const INPUT_PATH = path.join(__dirname, "..", "app", "awari.vendors.json");
const BATCH_SIZE = 400;

function sanitizeVendor(vendor) {
  const clean = { ...vendor };
  clean.image = "/placeholder.png";
  clean.gallery = [];
  clean.vendor = {
    ...(clean.vendor || {}),
    logo: "/placeholder.png",
  };

  return {
    ...clean,
    ownerId: clean.ownerId || "awari-import",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

async function pushAwariVendors() {
  const raw = fs.readFileSync(INPUT_PATH, "utf8");
  const vendors = JSON.parse(raw);

  if (!Array.isArray(vendors)) {
    throw new Error("Expected app/awari.vendors.json to be an array");
  }

  console.log(`Preparing to push ${vendors.length} vendors (without external images)...`);

  let batch = db.batch();
  let ops = 0;
  let total = 0;

  for (const vendor of vendors) {
    const docId = vendor.slug || vendor.id;
    if (!docId) {
      console.warn("Skipping vendor without slug/id:", vendor.name || "[unknown]");
      continue;
    }

    const docRef = db.collection("vendors").doc(String(docId));
    const vendorData = sanitizeVendor(vendor);
    batch.set(docRef, vendorData, { merge: true });
    ops += 1;
    total += 1;

    if (ops >= BATCH_SIZE) {
      await batch.commit();
      console.log(`Committed ${total}/${vendors.length}`);
      batch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) {
    await batch.commit();
    console.log(`Committed ${total}/${vendors.length}`);
  }

  console.log("Vendor push complete.");
}

pushAwariVendors()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Push failed:", error);
    process.exit(1);
  });
