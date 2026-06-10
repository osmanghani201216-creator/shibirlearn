/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize core Firebase App instance
const app = initializeApp(firebaseConfig);

// Enable external cloud APIs for Firebase Firestore and Authentication
export const isFirebaseEnabled = true;

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore database instance
// Using firestoreDatabaseId if specified, falling back to default database matching guidelines
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Google auth provider
export const googleProvider = new GoogleAuthProvider();

// Defined Operation types for error wrapping
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// Struct of raw diagnostic payload info
export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

/**
 * Validates connection to Firestore at initial system boot
 */
async function testConnection() {
  if (!isFirebaseEnabled || !firebaseConfig.apiKey) {
    console.log("Firebase config placeholder or disabled; operating in offline mode.");
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration of the applet.");
    }
  }
}

testConnection();

/**
 * Explicit Error Handler wrapping "Missing or insufficient permissions"
 * as strictly required by system guidelines for cloud operations.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Core Google sign-in helper utilizing popup
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Authentication error: ", error);
    throw error;
  }
}

/**
 * Standard Sign out helper
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out error: ", error);
    throw error;
  }
}
