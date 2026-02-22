import * as admin from "firebase-admin";

const serviceAccount = require("../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

async function listUsers() {
    const snapshot = await db.collection("users").get();
    if (snapshot.empty) {
        console.log("No users found in Firestore.");
        return;
    }

    console.log("Found users:");
    snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ID: ${doc.id} | Name: ${data.displayName} | Email: ${data.email} | Role: ${data.role}`);
    });
}

listUsers().catch(console.error);
