import * as admin from 'firebase-admin';

const serviceAccount = require('../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export { admin };
