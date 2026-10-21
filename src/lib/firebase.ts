import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

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
  };
}

export const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || 'AIzaSyCpONka9S3arDn7076qLCT6XvAfhyZ7hzM',
  authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || 'yovo-38d03.firebaseapp.com',
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || 'yovo-38d03',
  storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || 'yovo-38d03.firebasestorage.app',
  messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || '1084238047014',
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || '1:1084238047014:web:b074022c339fd438abc3e7',
};

export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY' &&
  !firebaseConfig.apiKey.includes('placeholder')
);

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let initErrorInstance: Error | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
  } catch (err: any) {
    console.error('Firebase initialization error:', err);
    initErrorInstance = err instanceof Error ? err : new Error(String(err));
  }
} else {
  initErrorInstance = new Error('متغيرات بيئة Firebase (VITE_FIREBASE_API_KEY أو VITE_FIREBASE_PROJECT_ID) غير مكتملة.');
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const firebaseInitError = initErrorInstance;

/**
 * Recursively strips undefined fields from an object before sending to Firestore.
 * Preserves Date objects, FieldValues (serverTimestamp, deleteField), arrays, and primitives.
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (!obj || typeof obj !== 'object') return obj;

  const result: Record<string, any> = {};

  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) {
      continue; // completely omit undefined fields
    }
    if (val !== null && typeof val === 'object') {
      // Preserve Firestore FieldValues (serverTimestamp, etc.)
      if (typeof (val as any).toMillis === 'function' || (val as any)._methodName) {
        result[key] = val;
      } else if (Array.isArray(val)) {
        result[key] = val.map((item) =>
          item !== null && typeof item === 'object' && !(item instanceof Date) && typeof (item as any).toMillis !== 'function'
            ? sanitizeForFirestore(item)
            : item
        );
      } else if (val instanceof Date) {
        result[key] = val;
      } else {
        result[key] = sanitizeForFirestore(val);
      }
    } else {
      result[key] = val;
    }
  }

  return result;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const currentAuthUser = authInstance?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuthUser?.uid,
      email: currentAuthUser?.email,
      emailVerified: currentAuthUser?.emailVerified,
      isAnonymous: currentAuthUser?.isAnonymous,
      tenantId: currentAuthUser?.tenantId,
      providerInfo: currentAuthUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
