import { NextResponse } from "next/server";
import { admin, adminAuth, adminDb } from "@/lib/firebase-admin";

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type Body = {
  businessName?: string;
  city?: string;
  phone?: string;
  categories?: string[];
  description?: string;
};

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!idToken) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = String(decoded.email || "").trim().toLowerCase();

    const body = (await req.json()) as Body;
    const businessName = String(body.businessName || "").trim();
    const city = String(body.city || "").trim();
    const phone = String(body.phone || "").trim();
    const description = String(body.description || "").trim();
    const categories = Array.isArray(body.categories)
      ? body.categories.map((c) => String(c || "").trim()).filter(Boolean)
      : [];

    if (!businessName || !city || !phone || categories.length === 0) {
      return NextResponse.json(
        { error: "businessName, city, phone, and at least one category are required." },
        { status: 400 }
      );
    }

    const byOwner = await adminDb
      .collection("vendors")
      .where("ownerId", "==", uid)
      .limit(1)
      .get();

    if (!byOwner.empty) {
      const existing = byOwner.docs[0];
      return NextResponse.json({
        ok: true,
        vendorId: existing.id,
        vendorName: String(existing.data()?.name || ""),
        existed: true,
      });
    }

    if (email) {
      const byEmail = await adminDb
        .collection("vendors")
        .where("loginEmail", "==", email)
        .limit(1)
        .get();

      if (!byEmail.empty) {
        const existing = byEmail.docs[0];
        await existing.ref.set(
          {
            ownerId: uid,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        return NextResponse.json({
          ok: true,
          vendorId: existing.id,
          vendorName: String(existing.data()?.name || ""),
          existed: true,
        });
      }
    }

    const baseSlug = toSlug(businessName) || `vendor-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const slugSnap = await adminDb
        .collection("vendors")
        .where("slug", "==", slug)
        .limit(1)
        .get();

      if (slugSnap.empty) break;
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const logoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(businessName)}`;

    const vendorDoc = {
      ownerId: uid,
      loginEmail: email,
      slug,
      name: businessName,
      location: city,
      price: null,
      rating: 5,
      image: logoUrl,
      categories,
      featured: false,
      eventThemes: [],
      description: description || `Professional services by ${businessName}.`,
      shortDescription: description || `Professional services by ${businessName}.`,
      gallery: [],
      whatsIncluded: [],
      services: categories,
      isNew: true,
      about: description || `Professional services by ${businessName}.`,
      stats: {
        eventsPlanned: "0+",
        satisfiedClients: "0+",
        corporateEvents: "0+",
        yearsExperience: "0+",
        uniqueLocations: "1+",
      },
      phone,
      areaServed: [city],
      yearEstablished: new Date().getFullYear(),
      responseTime: "Within 24 hours",
      vendor: {
        name: businessName,
        logo: logoUrl,
        since: String(new Date().getFullYear()),
        slug,
      },
      createdAt: now,
      updatedAt: now,
    };

    const createdRef = await adminDb.collection("vendors").add(vendorDoc);

    return NextResponse.json({
      ok: true,
      vendorId: createdRef.id,
      vendorName: businessName,
      existed: false,
    });
  } catch (error) {
    console.error("vendor/claim error", error);
    return NextResponse.json({ error: "Failed to claim vendor profile." }, { status: 500 });
  }
}
