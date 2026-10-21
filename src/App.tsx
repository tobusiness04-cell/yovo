import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { PaymentInfo } from './components/PaymentInfo';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { initialProducts } from './data/products';
import {
  storeConfig as defaultStoreConfig,
  getPrimaryOrderPlatform,
  getOrderPlatformUrl,
  generateOrderMessage,
  buildWhatsAppOrderUrl,
  openWhatsAppSafely,
  isWhatsAppPlatform,
} from './config';
import { Product, ProductPlan, Category, StoreConfig, LandingPage, Order } from './types';
import {
  subscribeProducts,
  subscribeCategories,
  subscribeStoreSettings,
  subscribeToLandingPages,
  createPendingOrder,
  defaultCategories,
} from './services/storeService';
import { Send, AlertCircle, X } from 'lucide-react';

// Code-split heavy non-critical and route-specific modules
const QuickOrderModal = React.lazy(() =>
  import('./components/QuickOrderModal').then((m) => ({ default: m.QuickOrderModal }))
);
const ProductModal = React.lazy(() =>
  import('./components/ProductModal').then((m) => ({ default: m.ProductModal }))
);
const ContactModal = React.lazy(() =>
  import('./components/ContactModal').then((m) => ({ default: m.ContactModal }))
);
const PublicLandingPage = React.lazy(() =>
  import('./components/PublicLandingPage').then((m) => ({ default: m.PublicLandingPage }))
);
const AdminApp = React.lazy(() =>
  import('./components/admin/AdminApp').then((m) => ({ default: m.AdminApp }))
);
const AdminAuthProvider = React.lazy(() =>
  import('./context/AdminAuthContext').then((m) => ({ default: m.AdminAuthProvider }))
);

function MainStorefront() {
  // Stale-While-Revalidate: Instant render from cached/initial data to eliminate FCP & LCP delay
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('yovo_products_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return initialProducts;
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('yovo_categories_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return defaultCategories;
  });
  const [settings, setSettings] = useState<StoreConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('yovo_settings_cache');
        if (cached) {
          return { ...defaultStoreConfig, ...JSON.parse(cached) };
        }
      } catch (e) {}
    }
    return defaultStoreConfig;
  });
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ProductPlan | undefined>(undefined);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [quickOrderPlan, setQuickOrderPlan] = useState<ProductPlan | undefined>(undefined);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [orderErrorMessage, setOrderErrorMessage] = useState<string | null>(null);

  // Anti-duplicate click cache for pending orders
  const lastOrderClickRef = useRef<{ [key: string]: number }>({});

  // Route state
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return (
      window.location.pathname === '/admin' ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin=true')
    );
  });

  // Listen to browser navigation / history
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setIsAdminView(
        window.location.pathname === '/admin' ||
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true')
      );
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToStore = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time subscriptions to Firestore (Firestore is the ONLY source of truth)
  useEffect(() => {
    setIsLoadingProducts(true);
    const unsubProducts = subscribeProducts(
      (newProducts) => {
        // Sort products strictly by displayOrder
        const sorted = [...newProducts].sort(
          (a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99)
        );
        setProducts(sorted);
        setIsLoadingProducts(false);
        setProductsError(null);
      },
      (error) => {
        console.error('Failed to load products from Firestore:', error);
        setIsLoadingProducts(false);
        setProductsError('تعذر جلب بيانات المنتجات من قاعدة البيانات. يرجى التحقق من الاتصال.');
      }
    );

    const unsubCategories = subscribeCategories((newCategories) => {
      if (newCategories && newCategories.length > 0) {
        setCategories(newCategories);
      }
    });

    const unsubSettings = subscribeStoreSettings((newSettings) => {
      if (newSettings) {
        setSettings(newSettings);
        if (newSettings.brandName) {
          document.title = `${newSettings.brandName} — متجر الاشتراكات الرقمية في الجزائر`;
        }
      }
    });

    const unsubLandingPages = subscribeToLandingPages((lps) => {
      setLandingPages(lps);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSettings();
      unsubLandingPages();
    };
  }, []);

  // Check if currentPath matches an active custom Landing Page (e.g. /canva-pro)
  const matchedLandingPage = useMemo(() => {
    const cleanSlug = currentPath.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (!cleanSlug || cleanSlug === 'admin') return null;
    return landingPages.find((lp) => lp.active && lp.slug.toLowerCase() === cleanSlug) || null;
  }, [currentPath, landingPages]);

  const matchedLandingProduct = useMemo(() => {
    if (!matchedLandingPage) return null;
    return products.find((p) => p.id === matchedLandingPage.productId) || null;
  }, [matchedLandingPage, products]);

  // When clicking details on product card
  const handleSelectProduct = (product: Product, plan?: ProductPlan) => {
    setSelectedProduct(product);
    setSelectedPlan(plan);
  };

  // When clicking "اطلب الآن" on product card
  const handleOpenQuickOrder = (product: Product, plan?: ProductPlan) => {
    setQuickOrderProduct(product);
    setQuickOrderPlan(plan);
  };

  // Ensure that returning from WhatsApp (via back button, tab switch, or bfcache)
  // always keeps the customer in the clean store state without stuck modals
  useEffect(() => {
    const handleReturnToStore = () => {
      setSelectedProduct(null);
      setSelectedPlan(undefined);
      setQuickOrderProduct(null);
      setQuickOrderPlan(undefined);
      setIsOrdering(false);
      setIsContactOpen(false);
      setOrderErrorMessage(null);
    };

    window.addEventListener('pageshow', handleReturnToStore);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        handleReturnToStore();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('pageshow', handleReturnToStore);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // When clicking "اطلب عبر واتساب" on card, inside quick order, or inside modal
  const handleOrderNow = async (product: Product, plan?: ProductPlan) => {
    if (!product.available) return;

    // Resolve target plan (passed plan or first plan)
    const targetPlan =
      plan || (product.plans && product.plans.length > 0 ? product.plans[0] : undefined);

    // Prevent multiple rapid clicks from creating duplicate orders
    const now = Date.now();
    const orderKey = `${product.id}-${targetPlan?.id || 'default'}`;
    if (
      isOrdering ||
      (lastOrderClickRef.current[orderKey] && now - lastOrderClickRef.current[orderKey] < 2500)
    ) {
      return;
    }
    lastOrderClickRef.current[orderKey] = now;
    setIsOrdering(true);
    setOrderErrorMessage(null);

    // Trigger Meta Pixel Contact Event safely
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Contact');
    }

    // 1. Create a Pending Order via Secure Order API (Server-side price & integrity)
    let createdOrder: Order;
    try {
      createdOrder = await createPendingOrder({
        product,
        plan: targetPlan,
      });
    } catch (err: any) {
      console.error('Real order creation failed via API. Aborting order flow:', err);
      setOrderErrorMessage(
        err?.message || 'تعذر تسجيل الطلب في قاعدة البيانات حالياً. يرجى التحقق من اتصالك والمحاولة مجدداً.'
      );
      setIsOrdering(false);
      return;
    }

    // 2. Generate complete order message based on product, plan & template
    const orderMessage = generateOrderMessage(
      settings.orderMessageTemplate,
      product,
      targetPlan,
      product.currency || settings.currency
    );

    // Resolve WhatsApp order platform from store settings
    const primaryPlatform = getPrimaryOrderPlatform(settings);
    const whatsappTarget = primaryPlatform?.url || settings.whatsappUrl || '213549759489';
    const orderUrl = buildWhatsAppOrderUrl(whatsappTarget, orderMessage);

    // 3. Immediately close modals and reset modal state BEFORE navigating
    // so when returning to website, the customer is immediately back in the clean store
    setSelectedProduct(null);
    setSelectedPlan(undefined);
    setQuickOrderProduct(null);
    setQuickOrderPlan(undefined);
    setIsOrdering(false);

    // 4. Safely open WhatsApp externally without navigating the iframe
    // (Prevents "wa.me refused to connect" and keeps the store ready upon return)
    if (orderUrl) {
      openWhatsAppSafely(orderUrl);
    }
  };

  // Render Admin View if on /admin (Lazy loaded with isolated AdminAuthProvider)
  if (isAdminView) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#071E12] text-white font-sans" dir="rtl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#6cff76] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-emerald-200">جاري تحميل لوحة التحكم...</p>
            </div>
          </div>
        }
      >
        <AdminAuthProvider>
          <AdminApp
            products={products}
            categories={categories}
            settings={settings}
            onViewStore={navigateToStore}
          />
        </AdminAuthProvider>
      </Suspense>
    );
  }

  // Render dynamic Custom Landing Page if URL matches an active Landing Page
  if (matchedLandingPage && matchedLandingProduct) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 font-sans" dir="rtl">
            <div className="w-8 h-8 border-2 border-[#006633] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <PublicLandingPage
          landingPage={matchedLandingPage}
          product={matchedLandingProduct}
          onCreatePendingOrder={async (data) => {
            const ord = await createPendingOrder(data);
            return ord.id;
          }}
          onBackToHome={navigateToStore}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#6cff76]/30 selection:text-[#004d26] font-sans" dir="rtl">
      {/* Sticky Navigation */}
      <Navbar
        settings={settings}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Landing Page Content */}
      <main className="flex-1">
        <Hero onOpenContact={() => setIsContactOpen(true)} />

        <ProductCatalog
          products={products}
          isLoading={isLoadingProducts}
          error={productsError}
          onRetry={() => {
            setIsLoadingProducts(true);
            setProductsError(null);
          }}
          onSelectProduct={handleSelectProduct}
          onOrderNow={handleOpenQuickOrder}
        />

        <PaymentInfo />
        <HowItWorks />
        <FAQ onOpenContact={() => setIsContactOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
      />

      {/* Quick Order Modal - Instant ordering directly from cards */}
      {quickOrderProduct && (
        <Suspense fallback={null}>
          <QuickOrderModal
            product={quickOrderProduct}
            initialPlan={quickOrderPlan}
            settings={settings}
            isOrdering={isOrdering}
            onClose={() => {
              setQuickOrderProduct(null);
              setQuickOrderPlan(undefined);
            }}
            onOrderNow={handleOrderNow}
            onViewDetails={(prod, plan) => {
              setQuickOrderProduct(null);
              setSelectedProduct(prod);
              setSelectedPlan(plan);
            }}
          />
        </Suspense>
      )}

      {/* Product Details & Ordering Modal - Loaded on demand */}
      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductModal
            product={selectedProduct}
            initialPlan={selectedPlan}
            settings={settings}
            isOrdering={isOrdering}
            onClose={() => {
              setSelectedProduct(null);
              setSelectedPlan(undefined);
            }}
            onOrderNow={handleOrderNow}
          />
        </Suspense>
      )}

      {/* Order Creation Failure Toast */}
      {orderErrorMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-[#0F172A]/95 border border-red-500/50 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">
            <span className="font-bold block mb-0.5 text-red-300">خطأ في تسجيل الطلب</span>
            <span className="text-slate-200">{orderErrorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setOrderErrorMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* General Contact Modal - Loaded on demand */}
      {isContactOpen && (
        <Suspense fallback={null}>
          <ContactModal
            isOpen={isContactOpen}
            settings={settings}
            onClose={() => setIsContactOpen(false)}
          />
        </Suspense>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
        {/* Floating Quick Action Button for Mobile Conversion */}
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-[#006633] hover:bg-[#005229] text-white rounded-full shadow-lg shadow-[#006633]/25 border border-emerald-600/50 text-xs font-bold active:scale-95 transition-all"
            aria-label="تواصل معنا فوراً"
          >
            <Send className="w-4 h-4 text-[#6cff76]" />
            <span>تواصل معنا</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <MainStorefront />;
}
