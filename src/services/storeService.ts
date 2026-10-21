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
import { db, handleFirestoreError, OperationType, isFirebaseConfigured, sanitizeForFirestore } from '../lib/firebase';
import { Product, Category, StoreConfig, Order, OrderStatus, Expense, AdCampaign, LandingPage } from '../types';
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

  const sanitizedData = sanitizeForFirestore(productData);

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'products', productId), sanitizedData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${productId}`);
    }
  }

  // Also update local storage cache
  const local = getLocalProducts();
  const index = local.findIndex((p) => p.id === productId);
  if (index >= 0) {
    local[index] = { ...local[index], ...sanitizedData };
  } else {
    local.push(sanitizedData as Product);
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

// ----------------------------------------------------
// Local storage helpers for Order, Expense, Campaign, LandingPage
// ----------------------------------------------------
const LOCAL_STORAGE_ORDERS_KEY = 'yovo_orders_cache';
const LOCAL_STORAGE_EXPENSES_KEY = 'yovo_expenses_cache';
const LOCAL_STORAGE_CAMPAIGNS_KEY = 'yovo_campaigns_cache';
const LOCAL_STORAGE_LANDING_PAGES_KEY = 'yovo_landing_pages_cache';

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: Order[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Could not save orders to localStorage:', e);
  }
}

function getLocalExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EXPENSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.warn('Could not save expenses to localStorage:', e);
  }
}

function getLocalCampaigns(): AdCampaign[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CAMPAIGNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCampaigns(campaigns: AdCampaign[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(campaigns));
  } catch (e) {
    console.warn('Could not save campaigns to localStorage:', e);
  }
}

function getLocalLandingPages(): LandingPage[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LANDING_PAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalLandingPages(pages: LandingPage[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_LANDING_PAGES_KEY, JSON.stringify(pages));
  } catch (e) {
    console.warn('Could not save landing pages to localStorage:', e);
  }
}

// ----------------------------------------------------
// ORDERS SERVICE
// ----------------------------------------------------

export function generateOrderId(): string {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${datePart}-${rand}`;
}

export interface CreateOrderParams {
  productId?: string;
  product?: Product;
  productName?: string;
  planId?: string;
  plan?: { id: string; duration?: string; price?: number | string; purchaseCost?: number; adCost?: number; otherCost?: number; [key: string]: any };
  planName?: string;
  customerInstagram?: string;
  customerPhone?: string;
  customerWhatsApp?: string;
  customerName?: string;
  landingPageId?: string;
  notes?: string;
  clientRequestId?: string;
  // Deprecated/ignored client financial params kept for backwards type compatibility
  sellingPrice?: number;
  currency?: string;
  productCost?: number;
  adCost?: number;
  paymentFee?: number;
  otherCosts?: number;
}

/**
 * Detects whether the current execution environment is Google AI Studio preview or local development,
 * where Cloudflare Worker (/api/orders) is not running and Firebase Client SDK must be used directly.
 */
export function isPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) return true;
  const host = (window.location.hostname || '').toLowerCase();
  return (
    host.includes('run.app') ||
    host.includes('webcontainer') ||
    host.includes('localhost') ||
    host === '127.0.0.1' ||
    host.includes('aistudio') ||
    host.includes('googleusercontent.com')
  );
}

/**
 * Creates an order record with initial 'pending' status directly in Firestore via Firebase Client SDK.
 * Used in Google AI Studio preview and local development environments.
 */
async function createPendingOrderViaFirebaseSDK(params: CreateOrderParams): Promise<Order> {
  const cleanProductId = (params.productId || params.product?.id || '').trim();
  if (!cleanProductId) {
    throw new Error('معرّف المنتج مطلوب لتسجيل الطلب.');
  }

  // Look up product to resolve reliable price and plan details
  const prod = params.product || getLocalProducts().find((p) => p.id === cleanProductId);
  let cleanPlanId = (params.planId || params.plan?.id || '').trim();
  let targetPlan = params.plan;

  if (!targetPlan && prod?.plans && cleanPlanId) {
    targetPlan = prod.plans.find((p) => p.id === cleanPlanId);
  }
  if (!targetPlan && prod?.plans && prod.plans.length > 0) {
    targetPlan = prod.plans[0];
    cleanPlanId = targetPlan.id;
  }

  // Calculate pricing & finances authoritatively
  const rawPrice =
    targetPlan?.price !== undefined && targetPlan?.price !== ''
      ? targetPlan.price
      : prod?.price !== undefined
      ? prod.price
      : params.sellingPrice || 0;

  const sellingPrice = Number(rawPrice) || 0;
  const productCost = Number(targetPlan?.purchaseCost ?? params.productCost ?? prod?.purchaseCost ?? 0);
  const adCost = Number(targetPlan?.adCost ?? params.adCost ?? prod?.adCost ?? 0);
  const paymentFee = Number(params.paymentFee ?? 0);
  const otherCosts = Number(targetPlan?.otherCost ?? params.otherCosts ?? prod?.otherCosts ?? 0);
  const totalCost = productCost + adCost + paymentFee + otherCosts;
  const profit = sellingPrice - totalCost;
  const currency = params.currency || prod?.currency || 'دج';

  const orderId = generateOrderId();
  const phone = (params.customerPhone || params.customerWhatsApp || '').trim();
  const whatsapp = (params.customerWhatsApp || phone).trim();
  const clientRequestId =
    params.clientRequestId?.trim() ||
    `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`;
  const nowIso = new Date().toISOString();

  const firestoreData = sanitizeForFirestore({
    id: orderId,
    productId: cleanProductId,
    productName: params.productName || prod?.name || 'اشتراك رقمي',
    planId: cleanPlanId || 'default',
    planName: params.planName || targetPlan?.duration || 'شهري',
    sellingPrice,
    productCost,
    adCost,
    paymentFee,
    otherCosts,
    totalCost,
    profit,
    currency,
    status: 'pending',
    customerPhone: phone,
    customerWhatsApp: whatsapp,
    customerInstagram: (params.customerInstagram || '').trim(),
    customerName: (params.customerName || '').trim(),
    landingPageId: (params.landingPageId || '').trim(),
    notes: (params.notes || '').trim(),
    clientRequestId,
    createdAt: isFirebaseConfigured ? serverTimestamp() : nowIso,
    updatedAt: isFirebaseConfigured ? serverTimestamp() : nowIso,
  });

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'orders', orderId), firestoreData);
    } catch (fsErr: any) {
      console.error('Direct Firestore order creation failed in preview:', fsErr);
      handleFirestoreError(fsErr, OperationType.CREATE, `orders/${orderId}`);
      throw new Error('تعذر تسجيل الطلب في قاعدة البيانات. يرجى التحقق من اتصالك والمحاولة مجدداً.');
    }
  } else {
    const local = getLocalOrders();
    local.unshift({
      ...firestoreData,
      createdAt: nowIso,
      updatedAt: nowIso,
    } as Order);
    saveLocalOrders(local);
  }

  const confirmedOrder: Order = {
    id: orderId,
    productId: cleanProductId,
    productName: params.productName || prod?.name || 'اشتراك رقمي',
    planId: cleanPlanId || 'default',
    planName: params.planName || targetPlan?.duration || 'شهري',
    sellingPrice,
    productCost,
    adCost,
    paymentFee,
    otherCosts,
    totalCost,
    profit,
    currency,
    status: 'pending',
    customerPhone: phone,
    customerWhatsApp: whatsapp,
    customerInstagram: (params.customerInstagram || '').trim(),
    customerName: (params.customerName || '').trim(),
    landingPageId: (params.landingPageId || '').trim(),
    notes: (params.notes || '').trim(),
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  return confirmedOrder;
}

/**
 * Resolves the configured order backend strategy:
 * - 'worker-api': Authoritative Cloudflare Worker API (staging or production).
 * - 'direct-firestore': Direct client Firestore creation.
 */
export function getOrderBackendStrategy(): 'worker-api' | 'direct-firestore' {
  const configuredBackend = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ORDER_BACKEND
    ? import.meta.env.VITE_ORDER_BACKEND
    : ''
  ).trim().toLowerCase();
  if (configuredBackend === 'worker-api') {
    return 'worker-api';
  }
  if (configuredBackend === 'direct-firestore') {
    return 'direct-firestore';
  }

  // If VITE_ORDER_API_BASE_URL is set, default to worker-api
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ORDER_API_BASE_URL?.trim()) {
    return 'worker-api';
  }

  // If not in preview (i.e. on production Cloudflare host), default to worker-api
  if (!isPreviewEnvironment()) {
    return 'worker-api';
  }

  // Fallback in preview when no backend or staging URL is configured
  return 'direct-firestore';
}

/**
 * Resolves the order creation endpoint URL.
 * When VITE_ORDER_API_BASE_URL is configured, builds:
 * `${VITE_ORDER_API_BASE_URL}/api/orders`
 * When not configured, returns '/api/orders'.
 */
export function getOrderApiEndpoint(): string {
  const rawBase = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ORDER_API_BASE_URL
    ? import.meta.env.VITE_ORDER_API_BASE_URL
    : ''
  ).trim();
  if (rawBase) {
    const cleanBase = rawBase.replace(/\/+$/, '');
    return `${cleanBase}/api/orders`;
  }
  // In Google AI Studio preview, if worker-api backend is enabled, default to the existing deployed Worker:
  if (isPreviewEnvironment() && getOrderBackendStrategy() === 'worker-api') {
    return 'https://yovo.to-business04.workers.dev/api/orders';
  }
  return '/api/orders';
}

/**
 * Creates an order record with initial 'pending' status.
 * Supports configurable worker-api backend with VITE_ORDER_API_BASE_URL,
 * or direct Firebase Client SDK.
 */
export async function createPendingOrder(params: CreateOrderParams): Promise<Order> {
  // 1. Offline connection check
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مجدداً.');
  }

  const backendStrategy = getOrderBackendStrategy();

  // 2. Direct Firestore flow (only if strategy is explicitly direct-firestore)
  if (backendStrategy === 'direct-firestore') {
    return createPendingOrderViaFirebaseSDK(params);
  }

  // 3. Worker API Flow (when backendStrategy is 'worker-api')
  const endpoint = getOrderApiEndpoint();

  // Safety check: if in preview mode and endpoint is relative '/api/orders' without worker base URL:
  if (isPreviewEnvironment() && endpoint === '/api/orders') {
    throw new Error(
      'تم تفعيل خيار خادم الطلبات (VITE_ORDER_BACKEND=worker-api) ولكن لم يتم تحديد عنوان خادم الطلبات VITE_ORDER_API_BASE_URL.'
    );
  }

  // 4. Validate and extract required product identifier (Production & Staging API flow)
  const cleanProductId = (params.productId || params.product?.id || '').trim();
  if (!cleanProductId) {
    throw new Error('معرّف المنتج مطلوب لتسجيل الطلب.');
  }

  // 5. Extract optional plan identifier
  const cleanPlanId = (params.planId || params.plan?.id || '').trim() || undefined;

  // 6. Generate or reuse cryptographic client request ID for robust idempotency
  const clientRequestId =
    params.clientRequestId?.trim() ||
    `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`;

  // 7. Construct strict allowlist payload for the server
  // Absolute financial isolation: NO sellingPrice, productCost, profit or status sent from browser!
  const apiPayload: Record<string, string> = {
    productId: cleanProductId,
    clientRequestId,
  };

  if (cleanPlanId) {
    apiPayload.planId = cleanPlanId;
  }

  const phone = (params.customerPhone || params.customerWhatsApp || '').trim();
  if (phone) {
    apiPayload.customerPhone = phone;
    apiPayload.customerWhatsApp = (params.customerWhatsApp || phone).trim();
  }

  if (params.customerInstagram?.trim()) {
    apiPayload.customerInstagram = params.customerInstagram.trim();
  }
  if (params.customerName?.trim()) {
    apiPayload.customerName = params.customerName.trim();
  }
  if (params.landingPageId?.trim()) {
    apiPayload.landingPageId = params.landingPageId.trim();
  }
  if (params.notes?.trim()) {
    apiPayload.notes = params.notes.trim();
  }

  // 8. Network request with timeout (15 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Request-Id': clientRequestId,
        'Idempotency-Key': clientRequestId,
      },
      body: JSON.stringify(apiPayload),
      signal: controller.signal,
    });
  } catch (fetchErr: any) {
    if (fetchErr?.name === 'AbortError') {
      throw new Error(
        'استغرقت الاستجابة وقتاً أطول من المتوقع. يرجى التحقق من اتصالك أو التواصل معنا مباشرة عبر واتساب للتأكيد.'
      );
    }
    // CRITICAL: Fail explicitly without falling back to Firebase direct writes!
    throw new Error('تعذر الاتصال بخدمة الطلبات. يرجى التحقق من اتصال الإنترنت والمحاولة مجدداً.');
  } finally {
    clearTimeout(timeoutId);
  }

  // 9. Parse and validate JSON response
  let result: any;
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  try {
    if (contentType.includes('text/html')) {
      throw new Error('HTML_RESPONSE');
    }
    result = await response.json();
  } catch (parseErr: any) {
    if (parseErr?.message === 'HTML_RESPONSE') {
      throw new Error('استجابة غير صالحة من خادم الطلبات: استلم المتصفح صفحة HTML بدلاً من استجابة JSON.');
    }
    // CRITICAL: Fail explicitly without falling back to Firebase direct writes!
    throw new Error('استجابة غير صالحة من خادم الطلبات.');
  }

  // 10. Handle HTTP and application errors with clear Arabic messages
  if (!response.ok || !result || result.success !== true) {
    const status = response.status;
    let errorMessage = result?.error;

    if (!errorMessage) {
      if (status === 400) {
        errorMessage = 'بيانات الطلب غير صالحة. يرجى إعادة اختيار الخطة والمحاولة ثانية.';
      } else if (status === 403) {
        errorMessage = 'غير مصرح بالوصول إلى خدمة الطلبات (CORS/Forbidden).';
      } else if (status === 404) {
        errorMessage = 'الاشتراك أو الخطة المحددة غير متوفرة حالياً.';
      } else if (status === 429) {
        errorMessage = 'تم تجاوز عدد محاولات الطلب مؤقتاً. يرجى الانتظار دقيقة والمحاولة ثانية.';
      } else if (status === 502 || status === 503) {
        errorMessage = 'خدمة تسجيل الطلبات غير متوفرة مؤقتاً. يرجى المحاولة بعد قليل أو التواصل عبر واتساب.';
      } else {
        errorMessage = 'حدث خطأ غير متوقع أثناء معالجة الطلب. يرجى المحاولة لاحقاً.';
      }
    }
    // CRITICAL: Fail explicitly without falling back to Firebase direct writes!
    throw new Error(errorMessage);
  }

  // 9. Confirm valid server order ID
  const orderId = result.orderId;
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('لم يتم استلام معرّف طلب صالح ومؤكد من الخادم.');
  }

  // 10. Construct fully typed Order object from server-calculated data
  const serverOrder = result.order || {};
  const confirmedOrder: Order = {
    id: orderId,
    productId: serverOrder.productId || result.productId || cleanProductId,
    productName:
      serverOrder.productName ||
      result.productName ||
      params.productName ||
      params.product?.name ||
      'اشتراك رقمي',
    planId: serverOrder.planId || result.planId || cleanPlanId || 'default',
    planName:
      serverOrder.planName ||
      result.planName ||
      params.planName ||
      params.plan?.duration ||
      'شهري',
    sellingPrice:
      typeof serverOrder.sellingPrice === 'number'
        ? serverOrder.sellingPrice
        : Number(result.sellingPrice) || 0,
    productCost: typeof serverOrder.productCost === 'number' ? serverOrder.productCost : 0,
    adCost: typeof serverOrder.adCost === 'number' ? serverOrder.adCost : 0,
    paymentFee: typeof serverOrder.paymentFee === 'number' ? serverOrder.paymentFee : 0,
    otherCosts: typeof serverOrder.otherCosts === 'number' ? serverOrder.otherCosts : 0,
    totalCost: typeof serverOrder.totalCost === 'number' ? serverOrder.totalCost : 0,
    profit: typeof serverOrder.profit === 'number' ? serverOrder.profit : 0,
    currency: serverOrder.currency || result.currency || params.currency || params.product?.currency || 'دج',
    status: 'pending',
    customerPhone: serverOrder.customerPhone || apiPayload.customerPhone || '',
    customerWhatsApp: serverOrder.customerWhatsApp || apiPayload.customerWhatsApp || '',
    customerInstagram: serverOrder.customerInstagram || apiPayload.customerInstagram || '',
    customerName: serverOrder.customerName || apiPayload.customerName || '',
    landingPageId: serverOrder.landingPageId || apiPayload.landingPageId || '',
    notes: serverOrder.notes || apiPayload.notes || '',
    createdAt: serverOrder.createdAt || new Date().toISOString(),
    updatedAt: serverOrder.updatedAt || new Date().toISOString(),
  };

  // NOTE: Public checkout writes to localStorage (yovo_orders_cache) are intentionally removed
  // for strict customer privacy and zero unencrypted client-side state pollution.
  // The admin dashboard uses authorized real-time Firestore subscriptions via subscribeOrders().

  return confirmedOrder;
}

/**
 * Real-time subscription to Orders
 */
export function subscribeOrders(
  callback: (orders: Order[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    callback(getLocalOrders());
    const handleStorage = () => callback(getLocalOrders());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }

  const ordersCol = collection(db, 'orders');

  const unsubscribe = onSnapshot(
    ordersCol,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const sellingPrice = Number(d.sellingPrice) || 0;
        const productCost = Number(d.productCost) || 0;
        const adCost = Number(d.adCost) || 0;
        const paymentFee = Number(d.paymentFee) || 0;
        const otherCosts = Number(d.otherCosts) || 0;
        const totalCost = Number(d.totalCost) || (productCost + adCost + paymentFee + otherCosts);
        const profit = Number(d.profit) ?? (sellingPrice - totalCost);

        orders.push({
          id: docSnap.id,
          productId: d.productId || '',
          productName: d.productName || 'منتج',
          planId: d.planId || '',
          planName: d.planName || 'خطة',
          sellingPrice,
          productCost,
          adCost,
          paymentFee,
          otherCosts,
          totalCost,
          profit,
          customerInstagram: d.customerInstagram || '',
          customerName: d.customerName || '',
          customerPhone: d.customerPhone || '',
          notes: d.notes || '',
          status: (d.status as OrderStatus) || 'pending',
          landingPageId: d.landingPageId || '',
          currency: d.currency || 'دج',
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.createdAt || new Date().toISOString()),
          completedAt: d.completedAt?.toDate ? d.completedAt.toDate().toISOString() : d.completedAt,
          cancelledAt: d.cancelledAt?.toDate ? d.cancelledAt.toDate().toISOString() : d.cancelledAt,
          updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate().toISOString() : d.updatedAt,
        });
      });

      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      saveLocalOrders(orders);
      callback(orders);
    },
    (err) => {
      console.warn('Orders subscription error:', err);
      if (onError) onError(err);
      callback(getLocalOrders());
    }
  );

  return unsubscribe;
}

/**
 * Update order status (pending -> completed / cancelled)
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string
): Promise<void> {
  const nowIso = new Date().toISOString();
  const localOrders = getLocalOrders();
  const existingOrder = localOrders.find((ord) => ord.id === orderId);

  const partialUpdate: Record<string, any> = {
    status: newStatus,
    updatedAt: isFirebaseConfigured ? serverTimestamp() : nowIso,
  };

  if (newStatus === 'completed') {
    partialUpdate.completedAt = isFirebaseConfigured ? serverTimestamp() : nowIso;
  } else if (newStatus === 'cancelled') {
    partialUpdate.cancelledAt = isFirebaseConfigured ? serverTimestamp() : nowIso;
  }

  if (notes !== undefined && notes !== null) {
    partialUpdate.notes = notes;
  }

  const sanitizedPartial = sanitizeForFirestore(partialUpdate);

  if (db && isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'orders', orderId), sanitizedPartial);
    } catch (error: any) {
      if (error?.code === 'not-found') {
        try {
          const fullData = sanitizeForFirestore({
            ...(existingOrder || {}),
            id: orderId,
            ...sanitizedPartial,
            createdAt: existingOrder?.createdAt || (isFirebaseConfigured ? serverTimestamp() : nowIso),
          });
          await setDoc(doc(db, 'orders', orderId), fullData, { merge: true });
        } catch (setErr) {
          handleFirestoreError(setErr, OperationType.UPDATE, `orders/${orderId}`);
        }
      } else {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      }
    }
  }

  // Update local
  const local = localOrders.map((ord) => {
    if (ord.id === orderId) {
      return {
        ...ord,
        status: newStatus,
        ...(newStatus === 'completed' ? { completedAt: nowIso } : {}),
        ...(newStatus === 'cancelled' ? { cancelledAt: nowIso } : {}),
        ...(notes !== undefined ? { notes } : {}),
        updatedAt: nowIso,
      };
    }
    return ord;
  });
  saveLocalOrders(local);
}

/**
 * Update full order details (costs, customer info, notes)
 */
export async function updateOrderDetails(
  orderId: string,
  patch: Partial<Order>
): Promise<void> {
  const nowIso = new Date().toISOString();
  const localOrders = getLocalOrders();
  const existingOrder = localOrders.find((ord) => ord.id === orderId);

  const sellingPrice = patch.sellingPrice ?? existingOrder?.sellingPrice ?? 0;
  const productCost = patch.productCost ?? existingOrder?.productCost ?? 0;
  const adCost = patch.adCost ?? existingOrder?.adCost ?? 0;
  const paymentFee = patch.paymentFee ?? existingOrder?.paymentFee ?? 0;
  const otherCosts = patch.otherCosts ?? existingOrder?.otherCosts ?? 0;
  const totalCost = productCost + adCost + paymentFee + otherCosts;
  const profit = sellingPrice - totalCost;

  const patchToApply: Record<string, any> = {
    ...patch,
    totalCost,
    profit,
    updatedAt: isFirebaseConfigured ? serverTimestamp() : nowIso,
  };

  const sanitizedPatch = sanitizeForFirestore(patchToApply);

  if (db && isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'orders', orderId), sanitizedPatch);
    } catch (error: any) {
      if (error?.code === 'not-found') {
        try {
          const fullData = sanitizeForFirestore({
            ...(existingOrder || {}),
            ...sanitizedPatch,
            id: orderId,
            createdAt: existingOrder?.createdAt || (isFirebaseConfigured ? serverTimestamp() : nowIso),
          });
          await setDoc(doc(db, 'orders', orderId), fullData, { merge: true });
        } catch (setErr) {
          handleFirestoreError(setErr, OperationType.UPDATE, `orders/${orderId}`);
        }
      } else {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      }
    }
  }

  const local = localOrders.map((ord) =>
    ord.id === orderId ? { ...ord, ...patch, totalCost, profit, updatedAt: nowIso } : ord
  );
  saveLocalOrders(local);
}

/**
 * Delete order
 */
export async function deleteOrder(orderId: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
    }
  }

  const local = getLocalOrders().filter((ord) => ord.id !== orderId);
  saveLocalOrders(local);
}

// ----------------------------------------------------
// EXPENSES SERVICE
// ----------------------------------------------------

export function subscribeExpenses(
  callback: (expenses: Expense[]) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    callback(getLocalExpenses());
    const handleStorage = () => callback(getLocalExpenses());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }

  const expCol = collection(db, 'expenses');
  const unsubscribe = onSnapshot(
    expCol,
    (snapshot) => {
      const expenses: Expense[] = [];
      snapshot.forEach((snap) => {
        const d = snap.data();
        expenses.push({
          id: snap.id,
          description: d.description || '',
          amount: Number(d.amount) || 0,
          category: d.category || 'other',
          date: d.date || new Date().toISOString().slice(0, 10),
          productId: d.productId || '',
          campaignId: d.campaignId || '',
          notes: d.notes || '',
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.createdAt || new Date().toISOString()),
        });
      });

      expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      saveLocalExpenses(expenses);
      callback(expenses);
    },
    (err) => {
      console.warn('Expenses subscription error:', err);
      callback(getLocalExpenses());
    }
  );

  return unsubscribe;
}

export async function saveExpense(expense: Partial<Expense>): Promise<string> {
  const expenseId = expense.id || `exp_${Date.now()}`;
  const nowIso = new Date().toISOString();

  const data: Expense = {
    id: expenseId,
    description: expense.description || '',
    amount: Number(expense.amount) || 0,
    category: expense.category || 'other',
    date: expense.date || nowIso.slice(0, 10),
    productId: expense.productId || '',
    campaignId: expense.campaignId || '',
    notes: expense.notes || '',
    createdAt: expense.createdAt || nowIso,
  };

  const sanitizedExpense = sanitizeForFirestore({
    ...data,
    createdAt: isFirebaseConfigured ? serverTimestamp() : nowIso,
  });

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'expenses', expenseId), sanitizedExpense, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `expenses/${expenseId}`);
    }
  }

  const local = getLocalExpenses();
  const idx = local.findIndex((e) => e.id === expenseId);
  if (idx >= 0) {
    local[idx] = data;
  } else {
    local.unshift(data);
  }
  saveLocalExpenses(local);

  return expenseId;
}

export async function deleteExpense(expenseId: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `expenses/${expenseId}`);
    }
  }

  const local = getLocalExpenses().filter((e) => e.id !== expenseId);
  saveLocalExpenses(local);
}

// ----------------------------------------------------
// ADVERTISING CAMPAIGNS SERVICE
// ----------------------------------------------------

export function subscribeAdCampaigns(
  callback: (campaigns: AdCampaign[]) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    callback(getLocalCampaigns());
    const handleStorage = () => callback(getLocalCampaigns());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }

  const colRef = collection(db, 'adCampaigns');
  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const campaigns: AdCampaign[] = [];
      snapshot.forEach((snap) => {
        const d = snap.data();
        campaigns.push({
          id: snap.id,
          name: d.name || '',
          platform: d.platform || 'meta_ads',
          productId: d.productId || '',
          amountSpent: Number(d.amountSpent) || 0,
          startDate: d.startDate || new Date().toISOString().slice(0, 10),
          endDate: d.endDate || '',
          notes: d.notes || '',
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.createdAt || new Date().toISOString()),
        });
      });

      campaigns.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      saveLocalCampaigns(campaigns);
      callback(campaigns);
    },
    (err) => {
      console.warn('AdCampaigns subscription error:', err);
      callback(getLocalCampaigns());
    }
  );

  return unsubscribe;
}

export async function saveAdCampaign(campaign: Partial<AdCampaign>): Promise<string> {
  const campaignId = campaign.id || `camp_${Date.now()}`;
  const nowIso = new Date().toISOString();

  const data: AdCampaign = {
    id: campaignId,
    name: campaign.name || '',
    platform: campaign.platform || 'meta_ads',
    productId: campaign.productId || '',
    amountSpent: Number(campaign.amountSpent) || 0,
    startDate: campaign.startDate || nowIso.slice(0, 10),
    endDate: campaign.endDate || '',
    notes: campaign.notes || '',
    createdAt: campaign.createdAt || nowIso,
  };

  const sanitizedCampaign = sanitizeForFirestore({
    ...data,
    createdAt: isFirebaseConfigured ? serverTimestamp() : nowIso,
  });

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'adCampaigns', campaignId), sanitizedCampaign, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `adCampaigns/${campaignId}`);
    }
  }

  const local = getLocalCampaigns();
  const idx = local.findIndex((c) => c.id === campaignId);
  if (idx >= 0) {
    local[idx] = data;
  } else {
    local.unshift(data);
  }
  saveLocalCampaigns(local);

  return campaignId;
}

export async function deleteAdCampaign(campaignId: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'adCampaigns', campaignId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `adCampaigns/${campaignId}`);
    }
  }

  const local = getLocalCampaigns().filter((c) => c.id !== campaignId);
  saveLocalCampaigns(local);
}

// ----------------------------------------------------
// LANDING PAGES SERVICE
// ----------------------------------------------------

export function subscribeLandingPages(
  callback: (pages: LandingPage[]) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    callback(getLocalLandingPages());
    const handleStorage = () => callback(getLocalLandingPages());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }

  const colRef = collection(db, 'landingPages');
  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const pages: LandingPage[] = [];
      snapshot.forEach((snap) => {
        const d = snap.data();
        pages.push({
          id: snap.id,
          name: d.name || '',
          slug: d.slug || snap.id,
          active: d.active !== false,
          productId: d.productId || '',
          planId: d.planId || '',
          heroTitle: d.heroTitle || '',
          heroDescription: d.heroDescription || '',
          badgeText: d.badgeText || '',
          imageUrl: d.imageUrl || '',
          benefits: Array.isArray(d.benefits) ? d.benefits : [],
          features: Array.isArray(d.features) ? d.features : [],
          faq: Array.isArray(d.faq) ? d.faq : [],
          ctaText: d.ctaText || 'اطلب الآن عبر Instagram',
          displayOrder: Number(d.displayOrder) || 1,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.createdAt || new Date().toISOString()),
          updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate().toISOString() : d.updatedAt,
        });
      });

      pages.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
      saveLocalLandingPages(pages);
      callback(pages);
    },
    (err) => {
      console.warn('LandingPages subscription error:', err);
      callback(getLocalLandingPages());
    }
  );

  return unsubscribe;
}

export async function saveLandingPage(page: Partial<LandingPage>): Promise<string> {
  const pageId = page.id || `lp_${Date.now()}`;
  const nowIso = new Date().toISOString();

  // Normalize planId: save if present, or null if intentionally absent
  const planIdNormalized = page.planId && typeof page.planId === 'string' && page.planId.trim()
    ? page.planId.trim()
    : null;

  const rawData: Record<string, any> = {
    ...page,
    id: pageId,
    productId: page.productId || '',
    planId: planIdNormalized,
    slug: (page.slug || page.name || pageId).toLowerCase().trim().replace(/[^a-z0-9\u0621-\u064A]+/g, '-').replace(/^-+|-+$/g, ''),
    updatedAt: isFirebaseConfigured ? serverTimestamp() : nowIso,
  };

  if (!page.id) {
    rawData.createdAt = isFirebaseConfigured ? serverTimestamp() : nowIso;
  }

  const sanitizedData = sanitizeForFirestore(rawData);

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'landingPages', pageId), sanitizedData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `landingPages/${pageId}`);
    }
  }

  const local = getLocalLandingPages();
  const idx = local.findIndex((p) => p.id === pageId);
  const localPage: LandingPage = {
    ...(local[idx] || {}),
    ...(sanitizedData as any),
    planId: planIdNormalized || undefined,
    createdAt: typeof sanitizedData.createdAt === 'string' ? sanitizedData.createdAt : nowIso,
    updatedAt: nowIso,
  };

  if (idx >= 0) {
    local[idx] = localPage;
  } else {
    local.push(localPage);
  }
  saveLocalLandingPages(local);

  return pageId;
}

export async function toggleLandingPageStatus(pageId: string, currentActive: boolean): Promise<void> {
  const newActive = !currentActive;
  if (db && isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'landingPages', pageId), {
        active: newActive,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `landingPages/${pageId}`);
    }
  }

  const local = getLocalLandingPages().map((p) =>
    p.id === pageId ? { ...p, active: newActive } : p
  );
  saveLocalLandingPages(local);
}

export async function deleteLandingPage(pageId: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'landingPages', pageId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `landingPages/${pageId}`);
    }
  }

  const local = getLocalLandingPages().filter((p) => p.id !== pageId);
  saveLocalLandingPages(local);
}

// Subscription & action aliases for intuitive naming
export const subscribeToOrders = subscribeOrders;
export const subscribeToExpenses = subscribeExpenses;
export const subscribeAdCampaignsAlias = subscribeAdCampaigns;
export const subscribeCampaigns = subscribeAdCampaigns;
export const subscribeToCampaigns = subscribeAdCampaigns;
export const subscribeToLandingPages = subscribeLandingPages;
export const saveCampaign = saveAdCampaign;
export const deleteCampaign = deleteAdCampaign;
