import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { WhyYovo } from './components/WhyYovo';
import { HowItWorks } from './components/HowItWorks';
import { TrustSection } from './components/TrustSection';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { ContactModal } from './components/ContactModal';
import { PublicLandingPage } from './components/PublicLandingPage';
import { AdminApp } from './components/admin/AdminApp';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { initialProducts } from './data/products';
import {
  storeConfig as defaultStoreConfig,
  getPrimaryOrderPlatform,
  getOrderPlatformUrl,
  generateOrderMessage,
} from './config';
import { Product, ProductPlan, Category, StoreConfig, LandingPage } from './types';
import {
  subscribeProducts,
  subscribeCategories,
  subscribeStoreSettings,
  subscribeToLandingPages,
  createPendingOrder,
} from './services/storeService';
import { copyTextToClipboard } from './lib/clipboard';
import {
  OrderConfirmationToast,
  OrderConfirmationData,
} from './components/common/OrderConfirmationToast';
import { Send, AlertCircle, X } from 'lucide-react';

function MainStorefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreConfig>(defaultStoreConfig);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ProductPlan | undefined>(undefined);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [orderToastData, setOrderToastData] = useState<OrderConfirmationData | null>(null);
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

  // When clicking "اطلب الآن" on card or inside modal
  const handleOrderNow = async (product: Product, plan?: ProductPlan) => {
    if (!product.available) return;

    // Trigger Meta Pixel Contact Event safely
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Contact');
    }

    // Resolve target plan (passed plan or first plan)
    const targetPlan =
      plan || (product.plans && product.plans.length > 0 ? product.plans[0] : undefined);

    setOrderErrorMessage(null);

    // 1. Create a Pending Order in Firestore FIRST (Firestore is source of truth)
    try {
      await createPendingOrder({
        product,
        plan: targetPlan,
      });
    } catch (err: any) {
      console.error('Real order creation failed in Firestore. Aborting order flow:', err);
      setOrderErrorMessage(
        'تعذر تسجيل الطلب في قاعدة البيانات حالياً. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة.'
      );
      // DO NOT open Instagram or pretend order was successfully registered!
      return;
    }

    // 2. Generate complete order message based on product, plan & template
    const orderMessage = generateOrderMessage(
      settings.orderMessageTemplate,
      product,
      targetPlan,
      product.currency || settings.currency
    );

    // Resolve primary order platform dynamically (Instagram or configured primary)
    const primaryPlatform = getPrimaryOrderPlatform(settings);
    const orderUrl = primaryPlatform ? getOrderPlatformUrl(primaryPlatform.url) : '';
    const platformName = primaryPlatform?.name || 'Instagram';
    const platformIcon = primaryPlatform?.icon;

    // 2. Copy the generated message to the user's clipboard FIRST
    // Using Clipboard API directly within the user click gesture
    let copied = false;
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(orderMessage);
        copied = true;
      } else {
        copied = await copyTextToClipboard(orderMessage);
      }
    } catch (err) {
      console.warn('Direct clipboard write failed, trying fallback copy:', err);
      copied = await copyTextToClipboard(orderMessage);
    }

    if (copied) {
      // 3. Show brief success feedback: "تم نسخ رسالة الطلب ✓ سيتم فتح Instagram"
      setOrderToastData({
        productName: product.name,
        orderMessage,
        platformName,
        platformUrl: orderUrl,
        platformIcon: typeof platformIcon === 'string' ? platformIcon : undefined,
        copiedSuccessfully: true,
      });

      // 4. Open the Instagram profile/order destination
      if (orderUrl) {
        window.open(orderUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Graceful fallback: show manual copy modal with clear instructions
      setOrderToastData({
        productName: product.name,
        orderMessage,
        platformName,
        platformUrl: orderUrl,
        platformIcon: typeof platformIcon === 'string' ? platformIcon : undefined,
        copiedSuccessfully: false,
      });
    }
  };

  // Render Admin View if on /admin
  if (isAdminView) {
    return (
      <AdminApp
        products={products}
        categories={categories}
        settings={settings}
        onViewStore={navigateToStore}
      />
    );
  }

  // Render dynamic Custom Landing Page if URL matches an active Landing Page
  if (matchedLandingPage && matchedLandingProduct) {
    return (
      <PublicLandingPage
        landingPage={matchedLandingPage}
        product={matchedLandingProduct}
        onCreatePendingOrder={async (data) => {
          const ord = await createPendingOrder(data);
          return ord.id;
        }}
        onBackToHome={navigateToStore}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#080B0F] selection:bg-[#FF3B30]/15 selection:text-[#FF3B30] font-sans" dir="rtl">
      {/* Sticky Navigation */}
      <Navbar
        settings={settings}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Landing Page Content */}
      <main className="flex-1">
        <Hero onOpenContact={() => setIsContactOpen(true)} products={products} />

        <ProductCatalog
          products={products}
          isLoading={isLoadingProducts}
          error={productsError}
          onRetry={() => {
            setIsLoadingProducts(true);
            setProductsError(null);
          }}
          onSelectProduct={handleSelectProduct}
          onOrderNow={handleOrderNow}
        />

        <WhyYovo />
        <HowItWorks />
        <TrustSection />
        <Testimonials />
        <FAQ onOpenContact={() => setIsContactOpen(true)} />
        <FinalCTA onOpenContact={() => setIsContactOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
      />

      {/* Product Details & Ordering Modal */}
      <ProductModal
        product={selectedProduct}
        initialPlan={selectedPlan}
        settings={settings}
        onClose={() => {
          setSelectedProduct(null);
          setSelectedPlan(undefined);
        }}
        onOrderNow={handleOrderNow}
      />

      {/* Dynamic Order Confirmation Toast */}
      <OrderConfirmationToast
        data={orderToastData}
        onClose={() => setOrderToastData(null)}
      />

      {/* Order Creation Failure Toast */}
      {orderErrorMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-[#080B0F]/95 border border-[#FF3B30]/60 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
          <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">
            <span className="font-bold block mb-0.5 text-[#FF6B6B]">خطأ في تسجيل الطلب</span>
            <span className="text-gray-200">{orderErrorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setOrderErrorMessage(null)}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* General Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        settings={settings}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
        {/* Floating Quick Action Button for Mobile Conversion */}
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-[#080B0F] hover:bg-black text-white rounded-full shadow-lg border border-gray-800 text-xs font-bold active:scale-95 transition-all"
            aria-label="تواصل معنا فوراً"
          >
            <Send className="w-4 h-4 text-[#FF3B30]" />
            <span>تواصل معنا</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <MainStorefront />
    </AdminAuthProvider>
  );
}
