import { adminDb } from '../lib/firebase-admin';

async function countInsights() {
    const snapshot = await adminDb.collection('insights').get();
    console.log(`Current insights count: ${snapshot.size}`);
    if (snapshot.size > 0) {
        snapshot.docs.forEach(doc => {
            console.log(`- ${doc.data().title} (City: ${doc.data().city})`);
        });
    }
}

countInsights().catch(console.error);
