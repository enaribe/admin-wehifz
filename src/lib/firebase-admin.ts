import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let db: Firestore;
let auth: Auth;

function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // Check if we have service account credentials
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccount) {
      // Use service account from environment variable (JSON string)
      app = initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      // Use Application Default Credentials (for local development with GOOGLE_APPLICATION_CREDENTIALS)
      app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app);
  auth = getAuth(app);

  return { app, db, auth };
}

// Initialize on import
const firebase = initializeFirebaseAdmin();

export { firebase, db, auth };

// Collection names (shared with mobile app)
export const COLLECTIONS = {
  USERS: 'users',
  CHALLENGES: 'challenges',
  PARTICIPANTS: 'participants',
  MESSAGES: 'messages',
  PROGRESS: 'progress',
  VERSES: 'verses',
  SURAHS: 'surahs',
} as const;
