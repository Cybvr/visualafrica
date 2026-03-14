import { adminDb } from '../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

async function testInsight() {
    console.log('Saving test insight via Admin SDK...');
    
    const insight = {
        ruleId: 'test-rule-123',
        city: 'Lagos',
        title: 'Lagos Traffic Alert: Major disruption on Third Mainland Bridge',
        content: 'Commuters are advised to take alternative routes due to an accident on the bridge. Expect delays of up to 2 hours.',
        url: 'https://social.waddi.africa/status/traffic-123',
        matchedAt: new Date().toISOString(),
        tags: ['alert', 'safety', 'traffic'],
        createdAt: FieldValue.serverTimestamp()
    };

    try {
        await adminDb.collection('insights').add(insight);
        console.log('✅ Ingestion Test Passed! Insight saved to Firestore.');
        
        console.log('Fetching recent insights to confirm...');
        const snapshot = await adminDb.collection('insights')
            .limit(1)
            .get();
            
        if (!snapshot.empty) {
            console.log('Confirmed discovery:', snapshot.docs[0].data().title);
        }
    } catch (e) {
        console.error('❌ Test Failed:', e);
    }
}

testInsight().catch(console.error);
