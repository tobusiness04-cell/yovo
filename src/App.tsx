import React, { useState, useEffect } from 'react';
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
import { AdminApp } from './components/admin/AdminApp';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { initialProducts } from './data/products';
import { storeConfig as defaultStoreConfig } from './config';
import { Product, ProductPlan, Category, StoreConfig } from './types';
import {
  subscribeProducts,
  subscribeCategories,
  subscribeStoreSettings,
} from './services/storeService';
import { buildWhatsAppOrderUrl } from './lib/formatters';
import { MessageCircle } from 'lucide-react';

function MainStorefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreConfig>(defaultStoreConfig);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ProductPlan | undefined>(undefined);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  // Route state
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

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSettings();
    };
  }, []);

  // When clicking details on product card
  const handleSelectProduct = (product: Product, plan?: ProductPlan) => {
    setSelectedProduct(product);
    setSelectedPlan(plan);
  };

  // When clicking "اطلب الآن" on card
  const handleOrderNow = (product: Product, plan?: ProductPlan) => {
    if (!product.available) return;

    const targetPlan =
      plan || (product.plans && product.plans.length > 0 ? product.plans[0] : undefined);
    const duration = targetPlan ? targetPlan.duration : product.duration;
    const price = targetPlan ? targetPlan.price : product.price;

    const orderUrl = buildWhatsAppOrderUrl(
      settings.whatsappUrl || defaultStoreConfig.whatsappUrl,
      product.name,
      duration,
      price,
      product.currency || settings.currency
    );

    window.open(orderUrl, '_blank', 'noopener,noreferrer');
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900" dir="rtl">
      
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
      />

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
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg text-xs font-bold active:scale-95 transition-all"
            aria-label="تواصل معنا فوراً"
          >
            <MessageCircle className="w-4 h-4" />
            <span>راسلنا الآن</span>
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
