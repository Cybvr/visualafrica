import { adminDb } from '../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Waddi Firehose Ingestion Script
 * 
 * This script connects to the Ahrefs Firehose SSE stream and filters real-time 
 * web updates into Firestore insights using the Admin SDK.
 * 
 * Usage: FIREHOSE_TAP_TOKEN=fh_... npx tsx --env-file=.env.local scripts/firehose-ingest.ts
 */

const TAP_TOKEN = process.env.FIREHOSE_TAP_TOKEN;
const FIREHOSE_BASE_URL = 'https://api.firehose.com';

if (!TAP_TOKEN) {
    console.error('FIREHOSE_TAP_TOKEN environment variable is required.');
    process.exit(1);
}

// Map city names to Lucene tags or keywords if needed
const CITY_KEYWORDS: Record<string, string[]> = {
    'Lagos': ['Lagos', 'Eko', 'Victoria Island', 'Lekki'],
    'Accra': ['Accra', 'Ghana'],
    'Nairobi': ['Nairobi', 'Kenya'],
    'Cape Town': ['Cape Town', 'South Africa']
};

async function startIngestion() {
    console.log('Connecting to Firehose stream...');

    try {
        const response = await fetch(`${FIREHOSE_BASE_URL}/v1/stream?since=1h`, {
            headers: {
                'Authorization': `Bearer ${TAP_TOKEN}`,
                'Accept': 'text/event-stream'
            }
        });

        if (!response.body) {
            throw new Error('No response body from Firehose');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.replace('data: ', '').trim();
                    if (dataStr === '[]') continue;

                    try {
                        const event = JSON.parse(dataStr);
                        await handleEvent(event);
                    } catch (e) {
                        console.error('Failed to parse event data:', dataStr, e);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Stream connection error:', error);
        // Exponential backoff or retry logic would go here in production
        setTimeout(startIngestion, 5000);
    }
}

async function handleEvent(event: any) {
    const { document, query_id } = event;
    const { title, url, markdown, page_category } = document;

    console.log(`Matched Rule [${query_id}]: ${title || url}`);

    // Determine relevant city
    let city: string | undefined;
    for (const [cityName, keywords] of Object.entries(CITY_KEYWORDS)) {
        if (keywords.some(k => title?.includes(k) || markdown?.includes(k))) {
            city = cityName;
            break;
        }
    }

    // Save to Firestore via Admin SDK
    try {
        await adminDb.collection('insights').add({
            ruleId: query_id,
            city,
            title: title || 'Real-time Update',
            content: markdown?.slice(0, 1000) || '',
            url,
            matchedAt: event.matched_at,
            tags: page_category || [],
            createdAt: FieldValue.serverTimestamp()
        });
    } catch (err) {
        console.error('Error saving insight to Firestore:', err);
    }
}

startIngestion();
