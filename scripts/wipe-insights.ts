import { adminDb } from '../lib/firebase-admin';

async function wipeAllInsights() {
    console.log('Wiping ALL insights from database...');
    
    try {
        const snapshot = await adminDb.collection('insights').get();
            
        if (snapshot.empty) {
            console.log('Database already clean.');
            return;
        }

        const batch = adminDb.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`✅ Permanently deleted ${snapshot.size} item(s). Database is now EMPTY.`);
    } catch (e) {
        console.error('❌ Wipe Failed:', e);
    }
}

wipeAllInsights().catch(console.error);
