/**
 * Cloudflare Worker Entry Point for Yovo
 * Deployment: Cloudflare Workers with Static Assets
 * Custom Domain: yovodz.shop
 * Worker Name: yovo
 *
 * Responsibilities:
 * 1. POST /api/orders: Secure server-side order processing and Firestore write
 * 2. Non-POST /api/orders: 405 Method Not Allowed
 * 3. All other routes: Delegated to env.ASSETS for React SPA and static assets
 */

export interface Env {
  ASSETS?: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_CLIENT_EMAIL?: string;
  FIREBASE_PRIVATE_KEY?: string;
  ALLOWED_ORIGINS?: string;
  ENVIRONMENT?: string;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface DecodedFirestoreProduct {
  name: string;
  available: boolean;
  price: number;
  duration?: string;
  currency?: string;
  purchaseCost?: number;
  adCost?: number;
  otherCosts?: number;
  plans?: Array<{
    id: string;
    duration?: string;
    price: number;
    available?: boolean;
    purchaseCost?: number;
    adCost?: number;
    otherCost?: number;
  }>;
}

// In-memory token cache across warm Worker isolate invocations
let cachedOAuthToken: { token: string; expiresAtMs: number } | null = null;

// Constant project identifier fallback from verified config
const DEFAULT_FIREBASE_PROJECT_ID = 'yovo-38d03';

// In-memory sliding window rate limiter per isolate (burst protection)
const ipRateLimitMap = new Map<string, { count: number; resetAtMs: number }>();
const RATE_LIMIT_MAX_REQUESTS = 15; // Max 15 order submissions per 60 seconds per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);
  if (!entry || now > entry.resetAtMs) {
    ipRateLimitMap.set(ip, { count: 1, resetAtMs: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  entry.count++;
  return true;
}

// In-memory idempotency cache across warm Worker isolate invocations
interface IdempotencyRecord {
  status: 'in-flight' | 'completed';
  promise?: Promise<Response>;
  responseBody?: Record<string, any>;
  statusCode?: number;
  createdAtMs: number;
}
const idempotencyCache = new Map<string, IdempotencyRecord>();
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

function cleanIdempotencyCache() {
  const now = Date.now();
  for (const [key, entry] of idempotencyCache.entries()) {
    if (now - entry.createdAtMs > IDEMPOTENCY_TTL_MS) {
      idempotencyCache.delete(key);
    }
  }
}

/**
 * Base64URL string encoder (RFC 4648)
 */
function toBase64Url(bufferOrString: ArrayBuffer | Uint8Array | string): string {
  let binary = '';
  if (typeof bufferOrString === 'string') {
    const bytes = new TextEncoder().encode(bufferOrString);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  } else {
    const bytes = new Uint8Array(bufferOrString);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Converts PEM formatted RSA private key to binary PKCS#8 ArrayBuffer
 */
function pemToArrayBuffer(pemKey: string): ArrayBuffer {
  const cleanPem = pemKey
    .replace(/\\n/g, '\n')
    .replace(/-----BEGIN (?:RSA )?PRIVATE KEY-----/g, '')
    .replace(/-----END (?:RSA )?PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');

  const binaryString = atob(cleanPem);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generates an authoritative Google OAuth2 access token for Firestore REST API
 */
async function getGoogleAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const nowMs = Date.now();
  // Return cached token if valid for at least 5 more minutes
  if (cachedOAuthToken && cachedOAuthToken.expiresAtMs - nowMs > 5 * 60 * 1000) {
    return cachedOAuthToken.token;
  }

  const pkcs8Buffer = pemToArrayBuffer(privateKeyPem);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    pkcs8Buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign']
  );

  const nowSec = Math.floor(nowMs / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: nowSec,
    exp: nowSec + 3600,
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const unsignedAssertion = `${encodedHeader}.${encodedPayload}`;

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedAssertion)
  );

  const signedJwt = `${unsignedAssertion}.${toBase64Url(signature)}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signedJwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('OAuth token exchange failed:', tokenResponse.status, errorText);
    throw new Error('Google OAuth2 authentication failed');
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string; expires_in: number };
  const expiresInMs = (tokenData.expires_in || 3600) * 1000;

  cachedOAuthToken = {
    token: tokenData.access_token,
    expiresAtMs: nowMs + expiresInMs,
  };

  return tokenData.access_token;
}

/**
 * Decodes Firestore REST typed fields into a clean JavaScript object
 */
function decodeFirestoreValue(valueObj: any): any {
  if (!valueObj || typeof valueObj !== 'object') return null;

  if ('stringValue' in valueObj) return valueObj.stringValue;
  if ('integerValue' in valueObj) return parseInt(valueObj.integerValue, 10);
  if ('doubleValue' in valueObj) return parseFloat(valueObj.doubleValue);
  if ('booleanValue' in valueObj) return Boolean(valueObj.booleanValue);
  if ('timestampValue' in valueObj) return valueObj.timestampValue;
  if ('nullValue' in valueObj) return null;

  if ('arrayValue' in valueObj) {
    const values = valueObj.arrayValue?.values || [];
    return values.map((item: any) => decodeFirestoreValue(item));
  }

  if ('mapValue' in valueObj) {
    const fields = valueObj.mapValue?.fields || {};
    const decodedMap: Record<string, any> = {};
    for (const [k, v] of Object.entries(fields)) {
      decodedMap[k] = decodeFirestoreValue(v);
    }
    return decodedMap;
  }

  return null;
}

/**
 * Decodes a Firestore Document REST response into a typed product representation
 */
function parseFirestoreProduct(docData: any): DecodedFirestoreProduct | null {
  if (!docData || !docData.fields) return null;
  const fields = docData.fields;

  const name = decodeFirestoreValue(fields.name) || '';
  const available = decodeFirestoreValue(fields.available) !== false;
  const price = Number(decodeFirestoreValue(fields.price)) || 0;
  const duration = decodeFirestoreValue(fields.duration) || 'شهري';
  const currency = decodeFirestoreValue(fields.currency) || 'دج';
  const purchaseCost = Number(decodeFirestoreValue(fields.purchaseCost)) || 0;
  const adCost = Number(decodeFirestoreValue(fields.adCost)) || 0;
  const otherCosts = Number(decodeFirestoreValue(fields.otherCosts)) || 0;

  const rawPlans = decodeFirestoreValue(fields.plans);
  const plans = Array.isArray(rawPlans)
    ? rawPlans.map((p: any) => ({
        id: String(p.id || ''),
        duration: String(p.duration || ''),
        price: Number(p.price) || 0,
        available: p.available !== false,
        purchaseCost: p.purchaseCost !== undefined ? Number(p.purchaseCost) : undefined,
        adCost: p.adCost !== undefined ? Number(p.adCost) : undefined,
        otherCost: p.otherCost !== undefined ? Number(p.otherCost) : undefined,
      }))
    : [];

  return {
    name,
    available,
    price,
    duration,
    currency,
    purchaseCost,
    adCost,
    otherCosts,
    plans,
  };
}

/**
 * Encodes a JavaScript value into Firestore REST typed field format
 */
function encodeFirestoreValue(val: any): Record<string, any> {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { integerValue: val.toString() };
    }
    return { doubleValue: val };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map((item) => encodeFirestoreValue(item)),
      },
    };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = encodeFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

/**
 * Cryptographically secure order ID generator: ORD-YYMMDD-XXXXXX
 * Uses crypto.getRandomValues to guarantee non-predictable, collision-resistant order IDs.
 */
function generateSecureOrderId(): string {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  // Produce a 6-digit number between 100000 and 999999
  const randomSuffix = 100000 + (bytes[0] % 900000);
  return `ORD-${datePart}-${randomSuffix}`;
}

/**
 * Strictly defined production and trusted development origins
 */
const TRUSTED_ORIGINS = new Set([
  'https://yovodz.shop',
  'https://www.yovodz.shop',
  'https://yovo.to-business04.workers.dev',
  'https://ais-dev-f2wryf2tlacpsrk2mpc5ht-691645680167.europe-west2.run.app',
  'https://ais-pre-f2wryf2tlacpsrk2mpc5ht-691645680167.europe-west2.run.app',
]);

/**
 * Checks whether the incoming Origin is allowed by CORS policy.
 * Wildcard (*) is strictly forbidden for security on order creation.
 */
export function isAllowedOrigin(origin: string | null, env: Env): boolean {
  if (!origin) return false;
  const cleanOrigin = origin.trim().toLowerCase();

  // 1. Production and known development domains
  if (TRUSTED_ORIGINS.has(cleanOrigin)) {
    return true;
  }

  // 2. Explicitly configured development or staging origins from environment
  if (env.ALLOWED_ORIGINS) {
    const list = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().toLowerCase());
    if (list.includes(cleanOrigin)) {
      return true;
    }
  }

  // 3. Google AI Studio preview origins (ais-dev-... and ais-pre-... on run.app)
  if (/^https:\/\/ais-(dev|pre)-[a-z0-9-]+\.[a-z0-9-]+\.run\.app$/.test(cleanOrigin)) {
    return true;
  }

  // 4. Local development origins
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(cleanOrigin)) {
    return true;
  }

  return false;
}

/**
 * Constructs standard CORS headers for an authorized origin
 */
export function getCorsHeaders(origin: string | null, env: Env): Record<string, string> {
  if (!origin || !isAllowedOrigin(origin, env)) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Client-Request-Id, Idempotency-Key',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

/**
 * Standard JSON response helper with security headers
 */
function jsonResponse(
  data: Record<string, any>,
  status: number = 200,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      ...(extraHeaders || {}),
    },
  });
}

/**
 * Secure Order API Handler: POST /api/orders
 */
export async function handleCreateOrder(request: Request, env: Env): Promise<Response> {
  // Validate CORS origin if present
  const origin = request.headers.get('Origin');
  if (origin && !isAllowedOrigin(origin, env)) {
    return jsonResponse(
      { success: false, error: 'غير مصرح بالوصول من هذا المصدر (CORS policy rejection).' },
      403,
      { 'Vary': 'Origin' }
    );
  }

  // 1. IP Rate Limiting (isolate-level burst protection)
  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  if (clientIp !== 'unknown' && !checkRateLimit(clientIp)) {
    return jsonResponse(
      { success: false, error: 'تم تجاوز عدد محاولات الطلب مؤقتاً. يرجى الانتظار دقيقة والمحاولة ثانية.' },
      429,
      { 'Retry-After': '60' }
    );
  }

  // 2. Content-Type and payload size validation
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse(
      { success: false, error: 'نوع المحتوى غير مدعوم. يجب استخدام application/json.' },
      400
    );
  }

  // 3. Parse and validate JSON structure safely
  let rawBody: any;
  try {
    const text = await request.text();
    if (text.length > 16384) {
      // 16 KB max payload limit
      return jsonResponse({ success: false, error: 'حجم الطلب تجاوز الحد المسموح به.' }, 400);
    }
    rawBody = JSON.parse(text);
  } catch {
    return jsonResponse({ success: false, error: 'بيانات الطلب غير صالحة (Invalid JSON).' }, 400);
  }

  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return jsonResponse({ success: false, error: 'هيكل بيانات الطلب غير صالح.' }, 400);
  }

  // 4. Strict allowlist input validation
  const allowedKeys = new Set([
    'productId',
    'planId',
    'customerPhone',
    'customerWhatsApp',
    'customerInstagram',
    'customerName',
    'landingPageId',
    'notes',
    'clientRequestId',
  ]);

  for (const key of Object.keys(rawBody)) {
    if (!allowedKeys.has(key)) {
      // Reject unauthorized field injection
      return jsonResponse(
        { success: false, error: `الحقل المرسل (${key}) غير مصرح به.` },
        400
      );
    }
  }

  const {
    productId,
    planId,
    customerPhone,
    customerWhatsApp,
    customerInstagram,
    customerName,
    landingPageId,
    notes,
  } = rawBody;

  // Validate and sanitize clientRequestId / idempotency key
  let cleanRequestId: string | undefined;
  const headerKey = request.headers.get('idempotency-key') || request.headers.get('x-client-request-id');
  const rawRequestId = headerKey || rawBody.clientRequestId;
  if (typeof rawRequestId === 'string' && rawRequestId.trim()) {
    const trimmed = rawRequestId.trim();
    if (/^[a-zA-Z0-9_-]{8,64}$/.test(trimmed)) {
      cleanRequestId = trimmed;
    }
  }

  // 5. In-memory Idempotency & Concurrent In-Flight Deduplication
  if (cleanRequestId) {
    cleanIdempotencyCache();
    const existing = idempotencyCache.get(cleanRequestId);
    if (existing) {
      if (existing.status === 'in-flight' && existing.promise) {
        return existing.promise;
      }
      if (existing.status === 'completed' && existing.responseBody) {
        return jsonResponse(existing.responseBody, existing.statusCode || 200, {
          'X-Idempotent-Replay': 'true',
        });
      }
    }
  }

  // Helper to execute order processing
  const executeOrderCreation = async (): Promise<Response> => {
    // Validate productId (required string, matching expected slug pattern)
    if (typeof productId !== 'string' || !productId.trim() || productId.length > 100) {
      return jsonResponse({ success: false, error: 'معرّف المنتج مطلوب وغير صالح.' }, 400);
    }
    const cleanProductId = productId.trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanProductId)) {
      return jsonResponse({ success: false, error: 'صيغة معرّف المنتج غير مقبولة.' }, 400);
    }

    // Validate optional planId
    let cleanPlanId: string | undefined;
    if (planId !== undefined && planId !== null) {
      if (typeof planId !== 'string' || planId.length > 100) {
        return jsonResponse({ success: false, error: 'معرّف الخطة غير صالح.' }, 400);
      }
      cleanPlanId = planId.trim() || undefined;
    }

    // Validate and sanitize optional customer metadata
    const sanitizeStr = (val: any, maxLen: number): string => {
      if (typeof val !== 'string') return '';
      return val.trim().slice(0, maxLen);
    };

    const cleanPhone = sanitizeStr(customerPhone, 35);
    const cleanWhatsApp = sanitizeStr(customerWhatsApp || cleanPhone, 35);
    const cleanInstagram = sanitizeStr(customerInstagram, 80);
    const cleanName = sanitizeStr(customerName, 80);
    const cleanLandingPage = sanitizeStr(landingPageId, 80);
    const cleanNotes = sanitizeStr(notes, 500);

    // 6. Verify Server Credentials
    const clientEmail = env.FIREBASE_CLIENT_EMAIL?.trim();
    const privateKey = env.FIREBASE_PRIVATE_KEY?.trim();
    const projectId = env.FIREBASE_PROJECT_ID?.trim() || DEFAULT_FIREBASE_PROJECT_ID;

    if (!clientEmail || !privateKey) {
      console.error('Firebase server credentials (FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY) not configured');
      return jsonResponse(
        { success: false, error: 'خدمة تسجيل الطلبات غير متوفرة حالياً. يرجى المحاولة لاحقاً.' },
        503
      );
    }

    // 7. Authenticate to Firestore via Google OAuth2 Service Account
    let accessToken: string;
    try {
      accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    } catch (authErr) {
      console.error('Failed to obtain Google access token for Firestore:', authErr);
      return jsonResponse(
        { success: false, error: 'تعذر الاتصال بقاعدة البيانات لتسجيل الطلب.' },
        500
      );
    }

    const firestoreBaseUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
      projectId
    )}/databases/(default)/documents`;

    // 8. Server-side Idempotency Check in Firestore (Cross-Isolate Deduplication)
    if (cleanRequestId) {
      try {
        const runQueryUrl = `${firestoreBaseUrl}:runQuery`;
        const queryBody = {
          structuredQuery: {
            from: [{ collectionId: 'orders' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'clientRequestId' },
                op: 'EQUAL',
                value: { stringValue: cleanRequestId },
              },
            },
            limit: 1,
          },
        };

        const queryRes = await fetch(runQueryUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryBody),
        });

        if (queryRes.ok) {
          const queryResults = await queryRes.json();
          if (Array.isArray(queryResults) && queryResults.length > 0 && queryResults[0].document) {
            const existingDoc = queryResults[0].document;
            const fields = existingDoc.fields || {};
            const existingOrderId = decodeFirestoreValue(fields.id) || existingDoc.name.split('/').pop();
            const existingSellingPrice = Number(decodeFirestoreValue(fields.sellingPrice)) || 0;
            const existingCurrency = decodeFirestoreValue(fields.currency) || 'دج';
            const existingProdId = decodeFirestoreValue(fields.productId) || cleanProductId;
            const existingPlanId = decodeFirestoreValue(fields.planId) || 'default';
            const existingProdName = decodeFirestoreValue(fields.productName) || '';
            const existingPlanName = decodeFirestoreValue(fields.planName) || '';

            const replayPayload = {
              success: true,
              orderId: existingOrderId,
              productId: existingProdId,
              productName: existingProdName,
              planId: existingPlanId,
              planName: existingPlanName,
              sellingPrice: existingSellingPrice,
              currency: existingCurrency,
              status: 'pending',
              isDuplicateReplay: true,
            };

            idempotencyCache.set(cleanRequestId, {
              status: 'completed',
              responseBody: replayPayload,
              statusCode: 200,
              createdAtMs: Date.now(),
            });

            return jsonResponse(replayPayload, 200, { 'X-Idempotent-Replay': 'true' });
          }
        }
      } catch (queryErr) {
        console.warn('Idempotency query check encountered non-fatal error:', queryErr);
      }
    }

    // 9. Fetch authoritative product document from Firestore REST API
    const productUrl = `${firestoreBaseUrl}/products/${encodeURIComponent(cleanProductId)}`;

    let productResponse: Response;
    try {
      productResponse = await fetch(productUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (fetchErr) {
      console.error('Failed to query Firestore products collection:', fetchErr);
      return jsonResponse(
        { success: false, error: 'حدث خطأ في الاتصال أثناء التحقق من المنتج.' },
        502
      );
    }

    if (productResponse.status === 404) {
      return jsonResponse({ success: false, error: 'المنتج المطلوب غير موجود.' }, 404);
    }

    if (!productResponse.ok) {
      console.error('Firestore product fetch failed with status:', productResponse.status);
      return jsonResponse(
        { success: false, error: 'تعذر التحقق من بيانات المنتج حالياً.' },
        500
      );
    }

    const productDocData = await productResponse.json();
    const product = parseFirestoreProduct(productDocData);

    if (!product) {
      return jsonResponse({ success: false, error: 'بيانات المنتج غير صالحة في قاعدة البيانات.' }, 500);
    }

    // 10. Verify Product Availability
    if (!product.available) {
      return jsonResponse({ success: false, error: 'هذا الاشتراك غير متوفر حالياً.' }, 400);
    }

    // 11. Resolve Plan and Authoritative Pricing
    let resolvedPlanId = 'default';
    let resolvedPlanName = product.duration || 'شهري';
    let sellingPrice = Number(product.price);
    let productCost = Number(product.purchaseCost || 0);
    let adCost = Number(product.adCost || 0);
    let otherCosts = Number(product.otherCosts || 0);
    const paymentFee = 0; // Standard initial fee

    if (product.plans && product.plans.length > 0) {
      let matchedPlan = product.plans[0];
      if (cleanPlanId) {
        const found = product.plans.find((p) => p.id === cleanPlanId);
        if (!found) {
          return jsonResponse(
            { success: false, error: 'خطة الاشتراك المحددة غير صالحة أو غير موجودة.' },
            400
          );
        }
        matchedPlan = found;
      }

      if (matchedPlan.available === false) {
        return jsonResponse({ success: false, error: 'خطة الاشتراك المحددة غير متوفرة حالياً.' }, 400);
      }

      resolvedPlanId = matchedPlan.id;
      resolvedPlanName = matchedPlan.duration || product.duration || 'اشتراك';
      sellingPrice = Number(matchedPlan.price);

      if (matchedPlan.purchaseCost !== undefined) {
        productCost = Number(matchedPlan.purchaseCost);
      }
      if (matchedPlan.adCost !== undefined) {
        adCost = Number(matchedPlan.adCost);
      }
      if (matchedPlan.otherCost !== undefined) {
        otherCosts = Number(matchedPlan.otherCost);
      }
    }

    // 12. Financial integrity verification
    if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
      console.error('Invalid authoritative selling price found in database for product:', cleanProductId);
      return jsonResponse(
        { success: false, error: 'سعر الاشتراك غير صالح في قاعدة البيانات.' },
        500
      );
    }

    if (!Number.isFinite(productCost) || productCost < 0) productCost = 0;
    if (!Number.isFinite(adCost) || adCost < 0) adCost = 0;
    if (!Number.isFinite(otherCosts) || otherCosts < 0) otherCosts = 0;

    const totalCost = productCost + adCost + paymentFee + otherCosts;
    const profit = sellingPrice - totalCost;

    // 13. Generate Trusted Order Record
    const orderId = generateSecureOrderId();
    const nowIso = new Date().toISOString();
    const currency = product.currency || 'دج';
    const productName = product.name || cleanProductId;

    const orderPayloadFields: Record<string, any> = {
      id: encodeFirestoreValue(orderId),
      productId: encodeFirestoreValue(cleanProductId),
      productName: encodeFirestoreValue(productName),
      planId: encodeFirestoreValue(resolvedPlanId),
      planName: encodeFirestoreValue(resolvedPlanName),
      sellingPrice: encodeFirestoreValue(sellingPrice),
      productCost: encodeFirestoreValue(productCost),
      adCost: encodeFirestoreValue(adCost),
      paymentFee: encodeFirestoreValue(paymentFee),
      otherCosts: encodeFirestoreValue(otherCosts),
      totalCost: encodeFirestoreValue(totalCost),
      profit: encodeFirestoreValue(profit),
      status: encodeFirestoreValue('pending'),
      currency: encodeFirestoreValue(currency),
      customerPhone: encodeFirestoreValue(cleanPhone),
      customerWhatsApp: encodeFirestoreValue(cleanWhatsApp),
      customerInstagram: encodeFirestoreValue(cleanInstagram),
      customerName: encodeFirestoreValue(cleanName),
      landingPageId: encodeFirestoreValue(cleanLandingPage),
      notes: encodeFirestoreValue(cleanNotes),
      createdAt: { timestampValue: nowIso },
      updatedAt: { timestampValue: nowIso },
    };

    if (cleanRequestId) {
      orderPayloadFields.clientRequestId = encodeFirestoreValue(cleanRequestId);
    }

    // 14. Write Order Document to Firestore via REST API
    const writeOrderUrl = `${firestoreBaseUrl}/orders?documentId=${encodeURIComponent(orderId)}`;

    try {
      const writeResponse = await fetch(writeOrderUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: orderPayloadFields }),
      });

      if (!writeResponse.ok) {
        const errText = await writeResponse.text();
        console.error('Failed to create order document in Firestore:', writeResponse.status, errText);
        return jsonResponse(
          { success: false, error: 'تعذر حفظ الطلب في قاعدة البيانات. يرجى المحاولة ثانية.' },
          500
        );
      }
    } catch (writeErr) {
      console.error('Network exception during Firestore order write:', writeErr);
      return jsonResponse(
        { success: false, error: 'حدث انقطاع في الاتصال بقاعدة البيانات.' },
        500
      );
    }

    // 15. Return Safe Successful Response with complete trusted data
    const responseData = {
      success: true,
      orderId,
      productId: cleanProductId,
      productName,
      planId: resolvedPlanId,
      planName: resolvedPlanName,
      sellingPrice,
      currency,
      status: 'pending',
      order: {
        id: orderId,
        productId: cleanProductId,
        productName,
        planId: resolvedPlanId,
        planName: resolvedPlanName,
        sellingPrice,
        productCost,
        adCost,
        paymentFee,
        otherCosts,
        totalCost,
        profit,
        currency,
        status: 'pending',
        customerPhone: cleanPhone,
        customerWhatsApp: cleanWhatsApp,
        customerInstagram: cleanInstagram,
        customerName: cleanName,
        landingPageId: cleanLandingPage,
        notes: cleanNotes,
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    };

    if (cleanRequestId) {
      idempotencyCache.set(cleanRequestId, {
        status: 'completed',
        responseBody: responseData,
        statusCode: 201,
        createdAtMs: Date.now(),
      });
    }

    return jsonResponse(responseData, 201);
  };

  if (cleanRequestId) {
    const creationPromise = executeOrderCreation();
    idempotencyCache.set(cleanRequestId, {
      status: 'in-flight',
      promise: creationPromise,
      createdAtMs: Date.now(),
    });
    return creationPromise;
  }

  return executeOrderCreation();
}

/**
 * Cloudflare Worker Default Export Handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Route API Endpoints
    if (url.pathname === '/api/orders' || url.pathname === '/api/orders/') {
      // 1a. Handle CORS Preflight OPTIONS
      if (request.method === 'OPTIONS') {
        const origin = request.headers.get('Origin');
        if (origin && isAllowedOrigin(origin, env)) {
          return new Response(null, {
            status: 204,
            headers: getCorsHeaders(origin, env),
          });
        }
        return jsonResponse(
          {
            success: false,
            error: 'المصدر غير مصرح به عبر سياسة CORS.',
          },
          403,
          { Vary: 'Origin' }
        );
      }

      // 1b. Handle Order Creation POST
      if (request.method === 'POST') {
        const response = await handleCreateOrder(request, env);
        const origin = request.headers.get('Origin');
        if (origin && isAllowedOrigin(origin, env)) {
          const newHeaders = new Headers(response.headers);
          const corsHeaders = getCorsHeaders(origin, env);
          for (const [headerName, headerValue] of Object.entries(corsHeaders)) {
            newHeaders.set(headerName, headerValue);
          }
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        }
        return response;
      }

      // 1c. Reject unsupported HTTP methods
      const origin = request.headers.get('Origin');
      const corsHeaders = origin && isAllowedOrigin(origin, env) ? getCorsHeaders(origin, env) : {};
      return jsonResponse(
        {
          success: false,
          error: `طريقة الطلب ${request.method} غير مدعومة. يسمح فقط بـ POST.`,
        },
        405,
        {
          Allow: 'POST, OPTIONS',
          ...corsHeaders,
        }
      );
    }

    // 2. Reject unmapped API routes with clean JSON 404 (Never fallback to SPA HTML)
    if (url.pathname.startsWith('/api/')) {
      return jsonResponse(
        {
          success: false,
          error: 'نقطة النهاية المطلوبة غير موجودة.',
        },
        404
      );
    }

    // 3. Static Assets & React SPA Routing
    // env.ASSETS serves ./dist files and automatically provides SPA fallback (index.html)
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    // Fallback if assets binding is not available in mock/test environment
    return new Response('Not Found', { status: 404 });
  },
};
