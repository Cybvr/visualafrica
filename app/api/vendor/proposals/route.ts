import { NextResponse } from "next/server";
import { admin, adminAuth, adminDb } from "@/lib/firebase-admin";

type Body = {
  eventId?: string;
  quotedPrice?: string;
  deliveryTimeline?: string;
  message?: string;
};

function toMoneyText(input: string) {
  const trimmed = String(input || "").trim();
  if (!trimmed) return "";
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!idToken) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = String(decoded.email || "").trim().toLowerCase();

    const body = (await req.json()) as Body;
    const eventId = String(body.eventId || "").trim();
    const quotedPrice = String(body.quotedPrice || "").trim();
    const deliveryTimeline = String(body.deliveryTimeline || "").trim();
    const message = String(body.message || "").trim();

    if (!eventId || !quotedPrice || !deliveryTimeline || !message) {
      return NextResponse.json(
        { error: "eventId, quotedPrice, deliveryTimeline, and message are required." },
        { status: 400 }
      );
    }

    const eventRef = adminDb.collection("events").doc(eventId);
    const eventSnap = await eventRef.get();
    if (!eventSnap.exists) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    let vendorSnap = await adminDb.collection("vendors").where("ownerId", "==", uid).limit(1).get();
    if (vendorSnap.empty && email) {
      vendorSnap = await adminDb.collection("vendors").where("loginEmail", "==", email).limit(1).get();
    }

    if (vendorSnap.empty) {
      return NextResponse.json({ error: "No vendor profile linked to this account." }, { status: 404 });
    }

    const vendorDoc = vendorSnap.docs[0];
    const vendorId = vendorDoc.id;
    const vendorData = vendorDoc.data() || {};
    const service = String((vendorData.categories || [])[0] || "Proposal");

    const eventData = eventSnap.data() || {};
    const existingLeads = Array.isArray(eventData.leads) ? [...eventData.leads] : [];
    const existingBookings = Array.isArray(eventData.bookedVendors) ? [...eventData.bookedVendors] : [];

    const proposalMessage = [
      message,
      `Quoted price: ${toMoneyText(quotedPrice)}`,
      `Timeline: ${deliveryTimeline}`,
    ].join("\n");

    const leadIndex = existingLeads.findIndex((lead: any) => lead?.vendorId === vendorId);
    if (leadIndex >= 0) {
      existingLeads[leadIndex] = {
        ...existingLeads[leadIndex],
        status: "Contacted",
        message: proposalMessage,
      };
    } else {
      existingLeads.push({
        vendorId,
        status: "Contacted",
        message: proposalMessage,
      });
    }

    const bookingIndex = existingBookings.findIndex((booking: any) => booking?.vendorId === vendorId);
    if (bookingIndex >= 0) {
      existingBookings[bookingIndex] = {
        ...existingBookings[bookingIndex],
        amount: toMoneyText(quotedPrice),
        status: "Pending",
        service: existingBookings[bookingIndex]?.service || service,
      };
    } else {
      existingBookings.push({
        vendorId,
        service,
        amount: toMoneyText(quotedPrice),
        status: "Pending",
      });
    }

    await eventRef.set(
      {
        leads: existingLeads,
        bookedVendors: existingBookings,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // ── Save as Chat Message for Host Inbox ──────────────────────────
    const hostId = eventData.hostId;
    if (hostId) {
      const chatId = `${eventId}:${vendorId}`;
      const chatRef = adminDb.collection("chats").doc(chatId);

      // Update or create chat document metadata
      await chatRef.set({
        userId: hostId, // For compatibility with global inbox queries
        hostId,
        vendorId,
        eventId,
        eventName: eventData.eventName || "Event",
        lastMsg: "New Proposal Received",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        participants: [hostId, vendorId],
        type: 'proposal'
      }, { merge: true });

      // Add the proposal as a message in the subcollection
      await chatRef.collection("messages").add({
        senderId: vendorId,
        senderName: vendorData.name || "Vendor",
        text: proposalMessage,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        isMe: false, // From vendor's perspective in host inbox
        type: 'proposal_auto_msg'
      });
    }

    return NextResponse.json({ ok: true, vendorId });
  } catch (error) {
    console.error("vendor/proposals error", error);
    return NextResponse.json({ error: "Failed to submit proposal." }, { status: 500 });
  }
}
