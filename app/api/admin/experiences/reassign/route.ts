import { NextResponse } from "next/server";
import { admin, adminAuth, adminDb } from "@/lib/firebase-admin";

type Body = {
  experienceId?: string;
  targetOwnerEmail?: string;
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
    const experienceId = body.experienceId?.trim();
    const targetOwnerEmail = body.targetOwnerEmail ? normalizeEmail(body.targetOwnerEmail) : "";

    if (!experienceId || !targetOwnerEmail) {
      return NextResponse.json({ error: "experienceId and targetOwnerEmail are required." }, { status: 400 });
    }

    const expRef = adminDb.collection("experiences").doc(experienceId);
    const expSnap = await expRef.get();
    if (!expSnap.exists) {
      return NextResponse.json({ error: "Experience not found." }, { status: 404 });
    }

    const targetUser = await adminAuth.getUserByEmail(targetOwnerEmail);

    let targetVendorSnap = await adminDb
      .collection("vendors")
      .where("ownerId", "==", targetUser.uid)
      .limit(1)
      .get();

    // Backward compatibility for vendors stored with loginEmail instead of ownerId linkage.
    if (targetVendorSnap.empty) {
      targetVendorSnap = await adminDb
        .collection("vendors")
        .where("loginEmail", "==", targetOwnerEmail)
        .limit(1)
        .get();
    }

    // Legacy fallback: some records use ownerId="admin" for admin-owned vendors.
    if (targetVendorSnap.empty) {
      const targetProfileSnap = await adminDb.collection("users").doc(targetUser.uid).get();
      if (targetProfileSnap.exists && targetProfileSnap.data()?.role === "admin") {
        targetVendorSnap = await adminDb
          .collection("vendors")
          .where("ownerId", "==", "admin")
          .limit(1)
          .get();
      }
    }

    if (targetVendorSnap.empty) {
      return NextResponse.json({ error: "No vendor is linked to that owner email." }, { status: 404 });
    }

    const targetVendorDoc = targetVendorSnap.docs[0];
    const targetVendorData = targetVendorDoc.data() || {};

    const now = admin.firestore.FieldValue.serverTimestamp();

    await expRef.set(
      {
        vendorId: targetVendorDoc.id,
        location: targetVendorData.location || expSnap.data()?.location || "",
        updatedAt: now,
      },
      { merge: true }
    );

    return NextResponse.json({
      ok: true,
      targetVendorId: targetVendorDoc.id,
      targetVendorName: targetVendorData.name || "",
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.includes("user-not-found")) {
      return NextResponse.json({ error: "Target owner email was not found." }, { status: 404 });
    }
    console.error("admin/reassign-experience error", error);
    return NextResponse.json({ error: "Failed to reassign experience." }, { status: 500 });
  }
}
