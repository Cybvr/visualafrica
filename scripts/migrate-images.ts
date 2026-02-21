import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import fs from "fs";
import path from "path";

// Initialize Firebase Admin with the same credentials used for Firestore migration
const serviceAccount = JSON.parse(
    fs.readFileSync("./visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json", "utf8")
);

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
});

const bucket = getStorage().bucket();

async function uploadFolder(localPath: string, remoteRoot: string) {
    if (!fs.existsSync(localPath)) {
        console.log(`Directory ${localPath} does not exist, skipping.`);
        return;
    }

    const entries = fs.readdirSync(localPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullLocalPath = path.join(localPath, entry.name);
        const remotePath = path.join(remoteRoot, entry.name);

        if (entry.isDirectory()) {
            await uploadFolder(fullLocalPath, remotePath);
        } else {
            console.log(`Uploading ${fullLocalPath} to ${remotePath}...`);
            await bucket.upload(fullLocalPath, {
                destination: remotePath,
                public: true, // Make public so we can use URLs directly
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                }
            });
        }
    }
}

async function run() {
    try {
        console.log("Starting image migration to Firebase Storage...");
        await uploadFolder("./public/images", "images");
        await uploadFolder("./public/testimonials", "testimonials");
        console.log("Image migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

run();
