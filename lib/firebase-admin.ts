import * as admin from "firebase-admin"

type ServiceAccountShape = {
  projectId: string
  clientEmail: string
  privateKey: string
}

function getServiceAccountFromEnv(): ServiceAccountShape {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (rawJson) {
    const parsed = JSON.parse(rawJson) as {
      project_id?: string
      client_email?: string
      private_key?: string
      projectId?: string
      clientEmail?: string
      privateKey?: string
    }

    const projectId = parsed.projectId ?? parsed.project_id
    const clientEmail = parsed.clientEmail ?? parsed.client_email
    const privateKey = (parsed.privateKey ?? parsed.private_key)?.replace(/\\n/g, "\n")

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON shape.")
    }

    return {
      projectId,
      clientEmail,
      privateKey,
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
    )
  }

  return { projectId, clientEmail, privateKey }
}

if (!admin.apps.length) {
  const serviceAccount = getServiceAccountFromEnv()
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
  })
}

export const adminDb = admin.firestore()
export const adminAuth = admin.auth()
export { admin }
