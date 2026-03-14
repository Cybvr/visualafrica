import { adminDb } from '../lib/firebase-admin';

async function clearTestInsights() {
    console.log('Cleaning up test insights...');
    
    try {
        const snapshot = await adminDb.collection('insights')
            .where('ruleId', '==', 'test-rule-123')
            .get();
            
        if (snapshot.empty) {
            console.log('No test insights found.');
            return;
        }

        const batch = adminDb.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`✅ Cleaned up ${snapshot.size} test insight(s).`);
    } catch (e) {
        console.error('❌ Cleanup Failed:', e);
    }
}

clearTestInsights().catch(console.error);
