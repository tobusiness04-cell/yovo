import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, isFirebaseConfigured } from '../lib/firebase';
import { Product, Category, StoreConfig } from '../types';
import { initialProducts } from '../data/products';
import { storeConfig as defaultStoreConfig } from '../config';

const LOCAL_STORAGE_PRODUCTS_KEY = 'yovo_products_cache';
const LOCAL_STORAGE_CATEGORIES_KEY = 'yovo_categories_cache';
const LOCAL_STORAGE_SETTINGS_KEY = 'yovo_settings_cache';

// Default starter categories
export const defaultCategories: Category[] = [
  { id: 'cat-design', name: 'تصميم', slug: 'design', available: true, displayOrder: 1 },
  { id: 'cat-video', name: 'مونتاج', slug: 'video', available: true, displayOrder: 2 },
  { id: 'cat-ai', name: 'ذكاء اصطناعي AI', slug: 'ai', available: true, displayOrder: 3 },
  { id: 'cat-productivity', name: 'إنتاجية', slug: 'productivity', available: true, displayOrder: 4 },
  { id: 'cat-learning', name: 'تعليم ولغات', slug: 'learning', available: true, displayOrder: 5 },
  { id: 'cat-other', name: 'أخرى', slug: 'other', available: true, displayOrder: 6 },
];

function getLocalProducts(): Product[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not read products from localStorage:', e);
  }
  return initialProducts;
}

function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Could not save products to localStorage:', e);
  }
}

function getLocalCategories(): Category[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not read categories from localStorage:', e);
  }
  return defaultCategories;
}

function saveLocalCategories(cats: Category[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(cats));
  } catch (e) {
    console.warn('Could not save categories to localStorage:', e);
  }
}

function getLocalSettings(): StoreConfig {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (saved) {
      return { ...defaultStoreConfig, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not read settings from localStorage:', e);
  }
  return defaultStoreConfig;
}

function saveLocalSettings(settings: Partial<StoreConfig>): void {
  try {
    const current = getLocalSettings();
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  } catch (e) {
    console.warn('Could not save settings to localStorage:', e);
  }
}

/**
 * Real-time subscription to Products
 */
export function subscribeProducts(
  callback: (products: Product[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    // Deliver local cache or default products
    callback(getLocalProducts());
    const handleStorageChange = () => callback(getLocalProducts());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }

  const productsCollection = collection(db, 'products');

  const unsubscribe = onSnapshot(
    productsCollection,
    (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        products.push({
          id: docSnap.id,
          name: data.name || '',
          slug: data.slug || docSnap.id,
          category: data.category || 'أخرى',
          categorySlug: data.categorySlug || 'other',
          categoryId: data.categoryId || '',
          description: data.description || '',
          price: typeof data.price === 'number' ? data.price : Number(data.price) || 0,
          currency: data.currency || 'دج',
          duration: data.duration || 'شهري',
          features: Array.isArray(data.features) ? data.features : [],
          imageUrl: data.imageUrl || data.image || '',
          image: data.image || data.imageUrl || '',
          iconName: data.iconName || 'Zap',
          brandColor: data.brandColor || 'slate',
          available: data.available !== false,
          popular: Boolean(data.popular),
          displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 99,
          guarantee: data.guarantee || '',
          activationTime: data.activationTime || 'خلال 15 - 30 دقيقة',
          contactUrl: data.contactUrl || '',
          orderCtaText: data.orderCtaText || 'اطلب الآن',
          plans: Array.isArray(data.plans)
            ? data.plans.map((p: any) => ({
                id: p.id || `plan_${Math.random()}`,
                duration: p.duration || '',
                price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
                currency: p.currency || data.currency || 'دج',
                available: p.available !== false,
                popular: Boolean(p.popular),
                note: p.note || '',
              }))
            : [],
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        });
      });

      // Sort by displayOrder ascending, then by name
      products.sort((a, b) => {
        const orderA = a.displayOrder ?? 99;
        const orderB = b.displayOrder ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        return (a.name || '').localeCompare(b.name || '', 'ar');
      });

      saveLocalProducts(products);
      callback(products);
    },
    (error) => {
      console.error('Firestore onSnapshot products error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'products');
    }
  );

  return unsubscribe;
}

/**
 * Real-time subscription to Categories
 */
export function subscribeCategories(
  callback: (categories: Category[]) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    callback(getLocalCategories());
    const handleStorageChange = () => callback(getLocalCategories());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }

  const categoriesCollection = collection(db, 'categories');

  const unsubscribe = onSnapshot(
    categoriesCollection,
    (snapshot) => {
      if (snapshot.empty) {
        callback(getLocalCategories());
        return;
      }

      const categories: Category[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        categories.push({
          id: docSnap.id,
          name: data.name || '',
          slug: data.slug || docSnap.id,
          available: data.available !== false,
          displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 99,
        });
      });

      categories.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
      saveLocalCategories(categories);
      callback(categories);
    },
    (error) => {
      console.warn('Error fetching categories from Firestore:', error);
      callback(getLocalCategories());
    }
  );

  return unsubscribe;
}

/**
 * Real-time subscription to Settings
 */
export function subscribeSettings(
  callback: (settings: StoreConfig) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    callback(getLocalSettings());
    const handleStorageChange = () => callback(getLocalSettings());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }

  const settingsDocRef = doc(db, 'settings', 'store');

  const unsubscribe = onSnapshot(
    settingsDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const merged: StoreConfig = {
          ...defaultStoreConfig,
          ...data,
        };
        saveLocalSettings(merged);
        callback(merged);
      } else {
        callback(getLocalSettings());
      }
    },
    (error) => {
      console.warn('Error fetching settings from Firestore:', error);
      callback(getLocalSettings());
    }
  );

  return unsubscribe;
}

export const subscribeStoreSettings = subscribeSettings;

/**
 * Save or update product
 */
export async function saveProduct(product: Partial<Product>): Promise<string> {
  const productId = product.id || `prod_${Date.now()}`;
  const now = new Date().toISOString();

  const productData: any = {
    ...product,
    id: productId,
    updatedAt: isFirebaseConfigured ? serverTimestamp() : now,
  };

  if (!product.id) {
    productData.createdAt = isFirebaseConfigured ? serverTimestamp() : now;
  }

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'products', productId), productData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${productId}`);
    }
  }

  // Also update local storage cache
  const local = getLocalProducts();
  const index = local.findIndex((p) => p.id === productId);
  if (index >= 0) {
    local[index] = { ...local[index], ...productData };
  } else {
    local.push(productData as Product);
  }
  saveLocalProducts(local);

  return productId;
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  }

  const local = getLocalProducts().filter((p) => p.id !== productId);
  saveLocalProducts(local);
}

/**
 * Toggle product availability
 */
export async function toggleProductStatus(productId: string, currentAvailable: boolean): Promise<void> {
  const newAvailable = !currentAvailable;

  if (db && isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'products', productId), {
        available: newAvailable,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    }
  }

  const local = getLocalProducts().map((p) =>
    p.id === productId ? { ...p, available: newAvailable } : p
  );
  saveLocalProducts(local);
}

/**
 * Duplicate a product
 */
export async function duplicateProduct(product: Product): Promise<string> {
  const newId = `prod_${Date.now()}`;
  const duplicated: Product = {
    ...product,
    id: newId,
    name: `${product.name} (نسخة)`,
    slug: `${product.slug || product.id}-copy`,
    displayOrder: (product.displayOrder || 0) + 1,
    plans: product.plans.map((plan, i) => ({
      ...plan,
      id: `${newId}-plan-${i + 1}`,
    })),
  };

  return saveProduct(duplicated);
}

/**
 * Save Category
 */
export async function saveCategory(category: Partial<Category>): Promise<string> {
  const catId = category.id || `cat_${Date.now()}`;
  const catData = {
    ...category,
    id: catId,
  };

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'categories', catId), catData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `categories/${catId}`);
    }
  }

  const local = getLocalCategories();
  const index = local.findIndex((c) => c.id === catId);
  if (index >= 0) {
    local[index] = { ...local[index], ...catData } as Category;
  } else {
    local.push(catData as Category);
  }
  saveLocalCategories(local);

  return catId;
}

/**
 * Delete Category
 */
export async function deleteCategory(categoryId: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${categoryId}`);
    }
  }

  const local = getLocalCategories().filter((c) => c.id !== categoryId);
  saveLocalCategories(local);
}

/**
 * Save store settings
 */
export async function saveStoreSettings(settings: Partial<StoreConfig>): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'settings', 'store'), settings, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/store');
    }
  }

  saveLocalSettings(settings);
}

/**
 * Seed initial products, categories and settings into Firestore
 */
export async function seedInitialData(): Promise<{ productsCount: number; categoriesCount: number }> {
  let seededProducts = 0;
  let seededCategories = 0;

  if (db && isFirebaseConfigured) {
    // Seed categories
    for (const cat of defaultCategories) {
      await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
      seededCategories++;
    }

    // Seed products (only add missing products so existing edits/prices are never wiped)
    for (let i = 0; i < initialProducts.length; i++) {
      const p = initialProducts[i];
      const existingDoc = await getDoc(doc(db, 'products', p.id));
      if (!existingDoc.exists()) {
        await setDoc(
          doc(db, 'products', p.id),
          {
            ...p,
            displayOrder: i + 1,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
        seededProducts++;
      }
    }

    // Seed settings if not exists
    const settingsDoc = await getDoc(doc(db, 'settings', 'store'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'settings', 'store'), defaultStoreConfig, { merge: true });
    }
  } else {
    saveLocalProducts(initialProducts);
    saveLocalCategories(defaultCategories);
    saveLocalSettings(defaultStoreConfig);
    seededProducts = initialProducts.length;
    seededCategories = defaultCategories.length;
  }

  return { productsCount: seededProducts, categoriesCount: seededCategories };
}
