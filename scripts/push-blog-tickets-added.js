const admin = require("firebase-admin");
const serviceAccount = require("../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

const postId = "tickets-are-live-on-waddi";
const post = {
    title: "Tickets are Live on Waddi",
    category: "Updates",
    date: "March 1, 2026",
    author: "Waddi Team",
    excerpt:
        "You can now manage ticket sales and guest access directly within your Waddi event workspace.",
    image: "/images/waddi_hero_image_1772218141292.png", // Reusing an existing image for now
    content: `
<p>Selling tickets for your events shouldn't require jumping between three different platforms.</p>

<p>We've integrated ticketing directly into the Waddi workspace. Now you can create ticket tiers, manage guest lists, and track sales in the same place you build your event brief.</p>

<h2>Simple Setup</h2>
<p>Whether it's an early bird special or a VIP package, you can set up tiers in seconds. Guests get their tickets delivered instantly, and you get a real-time view of your attendee list.</p>

<p>Ready to sell out? Head to your event dashboard and click the 'Tickets' tab to get started.</p>
  `.trim(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
    await db.collection("blogPosts").doc(postId).set(post, { merge: true });
    console.log(`Upserted blog post: ${postId}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Failed to push blog post:", error);
        process.exit(1);
    });
