import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

async function ensureAdmin(idToken: string) {
  const decoded = await adminAuth.verifyIdToken(idToken);
  const profileSnap = await adminDb.collection("users").doc(decoded.uid).get();
  if (!profileSnap.exists || profileSnap.data()?.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return decoded;
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!idToken) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    let adminEmail = "";
    try {
      const decoded = await ensureAdmin(idToken);
      adminEmail = String(decoded.email || "").trim().toLowerCase();
    } catch (err) {
      if (err instanceof Error && err.message === "FORBIDDEN") {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const vendorsSnap = await adminDb.collection("vendors").get();

    const options = await Promise.all(
      vendorsSnap.docs.map(async (docSnap) => {
        const data = docSnap.data() || {};
        const ownerId = String(data.ownerId || "").trim();
        const loginEmail = String(data.loginEmail || "").trim().toLowerCase();
        if (!ownerId && !loginEmail) return null;

        if (!loginEmail && ownerId === "admin" && adminEmail) {
          return {
            vendorId: docSnap.id,
            vendorName: String(data.name || "Unknown Vendor"),
            ownerId,
            email: adminEmail,
          };
        }

        if (loginEmail) {
          return {
            vendorId: docSnap.id,
            vendorName: String(data.name || "Unknown Vendor"),
            ownerId,
            email: loginEmail,
          };
        }

        try {
          const userRecord = await adminAuth.getUser(ownerId);
          const email = (userRecord.email || "").trim().toLowerCase();
          if (!email) return null;

          return {
            vendorId: docSnap.id,
            vendorName: String(data.name || "Unknown Vendor"),
            ownerId,
            email,
          };
        } catch {
          return null;
        }
      })
    );

    const deduped = Array.from(
      new Map(
        options
          .filter((option): option is NonNullable<typeof option> => Boolean(option))
          .map((option) => [option.email, option])
      ).values()
    ).sort((a, b) => a.vendorName.localeCompare(b.vendorName));

    return NextResponse.json({ options: deduped });
  } catch (error) {
    console.error("admin/reassign-options error", error);
    return NextResponse.json({ error: "Failed to load reassign options." }, { status: 500 });
  }
}
