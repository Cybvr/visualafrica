import { adminDb } from '../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

async function testDiscovery() {
    console.log('Adding Discovery Items via Admin SDK...');
    
    const items = [
        {
            ruleId: 'discovery-123',
            city: 'Lagos',
            title: 'New Rooftop Lounge Opening in Victoria Island',
            content: 'SkyView Lagos is opening its doors this weekend with a special live jazz performance. Perfect for corporate mixers and private events.',
            url: 'https://social.waddi.africa/discovery/skyview-lagos',
            matchedAt: new Date().toISOString(),
            tags: ['/Listing/Location', 'trending']
        },
        {
            ruleId: 'discovery-456',
            city: 'Accra',
            title: 'Chale Wote Street Art Festival Dates Announced',
            content: 'The 2026 dates for the Chale Wote Street Art Festival have been released. Expect massive crowds and vibrant displays in Jamestown.',
            url: 'https://social.waddi.africa/discovery/chale-wote-2026',
            matchedAt: new Date().toISOString(),
            tags: ['/Listing/Event', 'festival']
        }
    ];

    for (const item of items) {
        await adminDb.collection('insights').add({
            ...item,
            createdAt: FieldValue.serverTimestamp()
        });
    }

    console.log('✅ Discovery items added to Firestore.');
}

testDiscovery().catch(console.error);
