import { NextResponse } from "next/server";
import { admin, adminAuth, adminDb } from "@/lib/firebase-admin";

type Body = {
  vendorId?: string;
  ownerId?: string;
  email?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureAdmin(idToken: string) {
  const decoded = await adminAuth.verifyIdToken(idToken);
  const profileSnap = await adminDb.collection("users").doc(decoded.uid).get();
  if (!profileSnap.exists || profileSnap.data()?.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return decoded.uid;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!idToken) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    try {
      await ensureAdmin(idToken);
    } catch (err) {
      if (err instanceof Error && err.message === "FORBIDDEN") {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const vendorId = body.vendorId?.trim();
    const ownerId = body.ownerId?.trim();
    const email = body.email ? normalizeEmail(body.email) : "";

    if (!vendorId || !ownerId || !email) {
      return NextResponse.json({ error: "vendorId, ownerId and email are required." }, { status: 400 });
    }

    const vendorRef = adminDb.collection("vendors").doc(vendorId);
    const vendorSnap = await vendorRef.get();
    if (!vendorSnap.exists) {
      return NextResponse.json({ error: "Vendor not found." }, { status: 404 });
    }

    const vendorData = vendorSnap.data() || {};
    if (vendorData.ownerId !== ownerId) {
      return NextResponse.json({ error: "Owner mismatch for vendor." }, { status: 400 });
    }

    await adminAuth.updateUser(ownerId, { email });

    const now = admin.firestore.FieldValue.serverTimestamp();

    await Promise.all([
      adminDb.collection("users").doc(ownerId).set(
        {
          email,
          updatedAt: now,
        },
        { merge: true }
      ),
      vendorRef.set(
        {
          loginEmail: email,
          updatedAt: now,
        },
        { merge: true }
      ),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.includes("email-already-exists")) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
    console.error("admin/vendor-login-email error", error);
    return NextResponse.json({ error: "Failed to update vendor login email." }, { status: 500 });
  }
}
