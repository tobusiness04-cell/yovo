import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, firebaseInitError } from '../lib/firebase';
import { AdminUser } from '../types';

const PRIMARY_ADMIN_UID = 'YiiizflljtQElyHH0jICdy34drb2';
const BOOTSTRAP_ADMIN_EMAIL = 'to.business04@gmail.com';

interface AdminAuthContextType {
  currentUser: AdminUser | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setIsLoading(false);
      setCurrentUser(null);
      setIsAdmin(false);
      return;
    }

    // Official Firebase Authentication state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {

        try {
          if (!db) {
            throw new Error('Firestore database is not initialized.');
          }

          // Strict Authorization Model: Firebase Auth + request.auth.uid + admins/{user.uid}
          const adminDocRef = doc(db, 'admins', user.uid);
          let adminDocSnap = await getDoc(adminDocRef);

          // Bootstrap primary admin UID if document is missing or needs syncing
          if (!adminDocSnap.exists() && (user.uid === PRIMARY_ADMIN_UID || user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase())) {
            try {
              await setDoc(adminDocRef, {
                role: 'admin',
                email: user.email || BOOTSTRAP_ADMIN_EMAIL,
                displayName: user.displayName || user.email?.split('@')[0] || 'المدير العام',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              }, { merge: true });
              adminDocSnap = await getDoc(adminDocRef);
            } catch (autoErr) {
              console.error('Auto-provisioning admin document notice:', autoErr);
            }
          }

          // Strict validation: Only grant admin access if admins/{user.uid} actually exists in Firestore
          if (adminDocSnap.exists()) {
            const data = adminDocSnap.data();
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              role: (data?.role as 'admin' | 'superadmin') || 'admin',
              displayName: user.displayName || user.email?.split('@')[0] || 'مسؤول المتجر',
            });
            setIsAdmin(true);
            setAuthError(null);
          } else {
            // Strict Authorization Failure: User authenticated, but has NO document in admins/{uid}
            setCurrentUser(null);
            setIsAdmin(false);
            setAuthError('هذا الحساب غير مصرح له بالوصول إلى لوحة الإدارة. لا يوجد سجل مسؤول مرتبط.');
            await firebaseSignOut(auth);
          }
        } catch (error: any) {
          console.error('Error verifying admin authorization in Firestore:', error);
          setCurrentUser(null);
          setIsAdmin(false);
          setAuthError('تعذر التحقق من صلاحيات المسؤول في قاعدة البيانات.');
          await firebaseSignOut(auth);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Firebase Authentication Email/Password Login
   * Followed by Firestore admins/{currentUser.uid} authorization check
   */
  const login = async (email: string, pass: string): Promise<void> => {
    setAuthError(null);
    setIsLoading(true);

    try {
      if (!auth) {
        throw new Error(
          firebaseInitError?.message
            ? `فشل تهيئة خدمة المصادقة: ${firebaseInitError.message}`
            : 'خدمة المصادقة Firebase غير متاحة في البيئة الحالية.'
        );
      }

      if (!db) {
        throw new Error(
          firebaseInitError?.message
            ? `فشل تهيئة قاعدة البيانات: ${firebaseInitError.message}`
            : 'خدمة قاعدة بيانات Firestore غير متاحة في البيئة الحالية.'
        );
      }

      // Step 1: Authenticate strictly via Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      if (!user || !user.uid) {
        throw new Error('تعذر التحقق من هوية المستخدم.');
      }

      // Step 2: Ensure fresh token and check admins/{uid} document in Firestore
      try {
        await user.getIdToken(true);
      } catch (tokenErr) {
        console.warn('Could not force refresh token:', tokenErr);
      }

      const adminDocRef = doc(db, 'admins', user.uid);
      let adminDocSnap = await getDoc(adminDocRef);

      if (!adminDocSnap.exists() && (user.uid === PRIMARY_ADMIN_UID || user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase())) {
        try {
          await setDoc(adminDocRef, {
            role: 'admin',
            email: user.email || BOOTSTRAP_ADMIN_EMAIL,
            displayName: user.displayName || user.email?.split('@')[0] || 'المدير العام',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true });
          adminDocSnap = await getDoc(adminDocRef);
        } catch (autoErr) {
          console.error('Auto-provisioning admin document on login:', autoErr);
        }
      }

      if (!adminDocSnap.exists()) {
        // Step 3: Deny access if UID does not exist in admins collection
        await firebaseSignOut(auth);
        const deniedMessage = 'هذا الحساب ليس لديه صلاحيات الوصول إلى لوحة الإدارة. لا يوجد سجل مسؤول مرتبط.';
        setAuthError(deniedMessage);
        throw new Error(deniedMessage);
      }

      // Step 4: Allow access
      const data = adminDocSnap.data();
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        role: (data?.role as 'admin' | 'superadmin') || 'admin',
        displayName: user.displayName || user.email?.split('@')[0] || 'المدير العام',
      });
      setIsAdmin(true);
      setAuthError(null);
    } catch (err: any) {
      console.error('Admin authentication error:', err?.code || err?.message);
      let message = 'تعذر تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.';

      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'صيغة البريد الإلكتروني غير صالحة.';
      } else if (err.code === 'auth/user-disabled') {
        message = 'تم تعطيل هذا الحساب. يرجى مراجعة إدارة المتجر.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'تم حظر المحاولات مؤقتاً بسبب كثرة المحاولات الخاطئة. يرجى المحاولة لاحقاً.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
      } else if (err.code === 'permission-denied') {
        message = 'تم رفض الوصول: الحساب غير مصرح له في قاعدة البيانات.';
      } else if (err.message && typeof err.message === 'string') {
        message = err.message;
      }

      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Firebase Authentication SignOut
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
      setCurrentUser(null);
      setIsAdmin(false);
      setFirebaseUser(null);
      setAuthError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setAuthError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthenticated: Boolean(currentUser && isAdmin && firebaseUser),
        isAdmin,
        isLoading,
        isFirebaseConfigured,
        login,
        logout,
        authError,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
