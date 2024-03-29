import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';

export const initializeFirebase = () => {
  /* ------------------------------------------------------------
   * Firebase
   * ------------------------------------------------------------*/
  // Set the config options
  const adminConfig: ServiceAccount = {
    projectId: process.env.ENV_FIREBASE_PROJECT_ID,
    privateKey: process.env.ENV_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.ENV_FIREBASE_CLIENT_EMAIL,
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });

  // fireorm
  const firestore = admin.firestore();
  fireorm.initialize(firestore);

  // エミュレータ
  if (process.env.NODE_ENV === 'development') {
    firestore.settings({
      host: 'localhost:8080',
      ssl: false,
    });
  }
};
