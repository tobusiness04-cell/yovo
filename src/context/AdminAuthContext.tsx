import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { AdminUser } from '../types';

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

const LOCAL_ADMIN_KEY = 'yovo_local_admin_session';

// Trusted admin emails bootstrap list
const AUTHORIZED_ADMIN_EMAILS = [
  'to.business04@gmail.com',
  'admin@yovo.dz',
  'admin@yovodz.com',
];

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Check local storage for mock/demo admin session in preview mode
      const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCurrentUser(parsed);
          setIsAdmin(true);
        } catch (e) {
          localStorage.removeItem(LOCAL_ADMIN_KEY);
        }
      }
      setIsLoading(false);
      return;
    }

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          let verifiedAdmin = false;

          // 1. Check if email is in trusted bootstrap list
          if (user.email && AUTHORIZED_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
            verifiedAdmin = true;
          }

          // 2. Check Firestore admins collection if db is available
          if (!verifiedAdmin && db) {
            try {
              const adminDoc = await getDoc(doc(db, 'admins', user.uid));
              if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
                verifiedAdmin = true;
              }
            } catch (err) {
              console.warn('Error checking admin document in Firestore:', err);
            }
          }

          if (verifiedAdmin) {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              role: 'admin',
              displayName: user.displayName || user.email?.split('@')[0],
            });
            setIsAdmin(true);
            setAuthError(null);
          } else {
            setCurrentUser(null);
            setIsAdmin(false);
            setAuthError('هذا الحساب غير مصرح له بالدخول كمسؤول.');
            await firebaseSignOut(auth);
          }
        } catch (error) {
          console.error('Error verifying admin authorization:', error);
          setIsAdmin(false);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    setAuthError(null);
    setIsLoading(true);

    try {
      if (!isFirebaseConfigured || !auth) {
        // Preview / local mode login for demonstration
        if (email.trim() && pass.length >= 6) {
          const localAdmin: AdminUser = {
            uid: 'local-admin-1',
            email: email.trim(),
            role: 'admin',
            displayName: 'مسؤول المتجر',
          };
          localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(localAdmin));
          setCurrentUser(localAdmin);
          setIsAdmin(true);
          setIsLoading(false);
          return;
        } else {
          throw new Error('يرجى إدخال بريد إلكتروني صحيح وكلمة مرور لا تقل عن 6 أحرف.');
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      // Verify admin authorization
      let verified = false;
      if (user.email && AUTHORIZED_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        verified = true;
      }

      if (!verified && db) {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
          verified = true;
        }
      }

      if (!verified) {
        await firebaseSignOut(auth);
        throw new Error('هذا الحساب ليس لديه صلاحيات الوصول إلى لوحة الإدارة.');
      }

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        role: 'admin',
        displayName: user.displayName || user.email?.split('@')[0],
      });
      setIsAdmin(true);
    } catch (err: any) {
      console.error('Admin Login failed:', err);
      let message = 'تعذر تسجيل الدخول. يرجى التحقق من البريد وكلمة المرور.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'تم حظر المحاولات مؤقتاً بسبب كثرة المحاولات الخاطئة. حاول لاحقاً.';
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (auth && isFirebaseConfigured) {
        await firebaseSignOut(auth);
      }
      localStorage.removeItem(LOCAL_ADMIN_KEY);
      setCurrentUser(null);
      setIsAdmin(false);
      setFirebaseUser(null);
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
        isAuthenticated: Boolean(currentUser && isAdmin),
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
