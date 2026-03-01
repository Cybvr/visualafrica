const admin = require("firebase-admin");
const serviceAccount = require("../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const LEGACY_POST_ID = "welcome-itroducing-waddi";
const postId = "introducing-waddi";
const post = {
  title: "Introducing Waddi: We Decide. You Show Up.",
  category: "Updates",
  date: "March 1, 2026",
  author: "Waddi Team",
  excerpt:
    "Waddi helps you go from event chaos to a clear plan in minutes: brief, build, confirm, and go.",
  image: "/images/waddi_hero_image_1772218141292.png",
  content: `
<p>Event planning usually starts with excitement and ends with twenty open tabs, unread messages, and a spreadsheet you no longer trust.</p>

<p>Waddi was built to fix that. We handle the heavy lifting so you can focus on the moment itself.</p>

<h2>Why Waddi Exists</h2>
<p>If you've ever spent weeks chasing venues, coordinating talent, and managing logistics, you already know the problem. Planning should not feel like a full-time operations job.</p>
<p>Our goal is simple: turn what normally takes weeks into something you can confidently set up in hours.</p>

<h2>How It Works: Brief → Build → Confirm → Go</h2>
<p>The Waddi flow is straightforward:</p>
<ul>
  <li><strong>Set Your Brief:</strong> choose your city, budget, and vibe.</li>
  <li><strong>Waddi Builds:</strong> we scout options, coordinate moving parts, and prepare your package.</li>
  <li><strong>Confirm & Customize:</strong> review, swap, and approve what fits you.</li>
  <li><strong>Live the Moment:</strong> show up while we handle logistics.</li>
</ul>

<h2>The Experience in One Chat</h2>
<p>A typical flow looks like this:</p>
<p><em>You:</em> “Surprise 30th birthday in Lagos for 20 guests.”<br/>
<em>Waddi:</em> “Got it. I'll build the plan and shortlist top vendors. Rooftop or beach vibe?”<br/>
<em>You:</em> “Rooftop.”<br/>
<em>Waddi:</em> “Done. I'll draft the full package for approval.”</p>

<h2>What You Can Do Today</h2>
<ul>
  <li>Build an AI itinerary tailored to your group and goals.</li>
  <li>Use AI proposal negotiation to get better rates and terms.</li>
  <li>Manage tasks in one place instead of scattered tools.</li>
  <li>Launch a guest website and RSVP flow in one click.</li>
</ul>

<h2>Start Here</h2>
<p>Waddi is for people who create moments, not spreadsheets. If you're ready to stop planning and start living it, this is your invite.</p>
<p>Join 500+ creators already making moments with Waddi.</p>
  `.trim(),
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  await db.collection("blogPosts").doc(postId).set(post, { merge: true });
  if (LEGACY_POST_ID !== postId) {
    const legacyRef = db.collection("blogPosts").doc(LEGACY_POST_ID);
    const legacySnap = await legacyRef.get();
    if (legacySnap.exists) {
      await legacyRef.delete();
      console.log(`Deleted legacy post: ${LEGACY_POST_ID}`);
    }
  }
  console.log(`Upserted blog post: ${postId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to push blog post:", error);
    process.exit(1);
  });
