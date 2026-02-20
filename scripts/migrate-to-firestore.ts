import * as admin from 'firebase-admin';
import { vendors } from '../lib/vendors-data';
import { SHARED_EVENTS } from '../lib/shared-data';
import { BLOG_POSTS } from '../lib/blog-data';

// Note: We need to use a relative path to the service account JSON
// Since this script runs from 'scripts/', the path should be '../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json'
const serviceAccount = require('../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

async function migrate() {
    console.log('Starting migration...');

    // 1. Migrate Vendors
    console.log('Migrating vendors...');
    const vendorBatch = db.batch();
    vendors.forEach((vendor) => {
        const ref = db.collection('vendors').doc(vendor.id);
        vendorBatch.set(ref, vendor);
    });
    await vendorBatch.commit();
    console.log(`Migrated ${vendors.length} vendors.`);

    // 2. Migrate Events
    console.log('Migrating events...');
    const eventBatch = db.batch();
    SHARED_EVENTS.forEach((event) => {
        const ref = db.collection('events').doc(event.id);
        eventBatch.set(ref, event);
    });
    await eventBatch.commit();
    console.log(`Migrated ${SHARED_EVENTS.length} events.`);

    // 3. Migrate Blog Posts
    console.log('Migrating blog posts...');
    const blogBatch = db.batch();
    BLOG_POSTS.forEach((post) => {
        const ref = db.collection('blogPosts').doc(post.id);
        blogBatch.set(ref, post);
    });
    await blogBatch.commit();
    console.log(`Migrated ${BLOG_POSTS.length} blog posts.`);

    console.log('Migration completed successfully!');
}

migrate().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
});
