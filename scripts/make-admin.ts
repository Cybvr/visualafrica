import * as admin from "firebase-admin";

const serviceAccount = require("../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();
const uid = "tA597LSiFySFo2UjlKGW4SBmepm1";

async function makeAdmin() {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        console.error(`User with UID ${uid} not found.`);
        return;
    }

    await userRef.update({
        role: "admin",
        updatedAt: new Date().toISOString()
    });

    console.log(`Successfully promoted ${uid} (Jide Pinheiro) to admin.`);
}

makeAdmin().catch(console.error);
