import React, { useState, useMemo } from 'react';
import { LandingPage, Product, ProductPlan } from '../types';
import {
  ShieldCheck,
  Zap,
  CheckCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  Instagram,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock,
  Award,
  AlertCircle,
} from 'lucide-react';

interface PublicLandingPageProps {
  landingPage: LandingPage;
  product: Product;
  onCreatePendingOrder: (data: {
    productId: string;
    productName: string;
    planId: string;
    planName: string;
    sellingPrice: number;
    currency: string;
    productCost?: number;
    adCost?: number;
    otherCosts?: number;
    customerInstagram?: string;
    customerName?: string;
    landingPageId?: string;
  }) => Promise<string>;
  onBackToHome: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  landingPage,
  product,
  onCreatePendingOrder,
  onBackToHome,
}) => {
  // Available plans from product
  const plans: ProductPlan[] = product.plans && product.plans.length > 0
    ? product.plans
    : [{ id: 'p_default', duration: product.duration || 'شهري', price: product.price, available: true }];

  // Initial plan selection
  const initialPlan = plans.find((p) => p.id === landingPage.planId) || plans[0];
  const [selectedPlan, setSelectedPlan] = useState<ProductPlan>(initialPlan);
  const [customerInstagram, setCustomerInstagram] = useState('');

  // Order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string | null>(null);
  const [orderErrorMessage, setOrderErrorMessage] = useState<string | null>(null);

  // Active FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const price = selectedPlan?.price || product.price;
  const currency = product.currency || 'دج';

  // Instagram order message
  const instagramMessage = useMemo(() => {
    return `السلام عليكم، أريد طلب اشتراك:
المنتج: ${product.name}
الخطة: ${selectedPlan.duration}
السعر: ${price.toLocaleString()} ${currency}
${customerInstagram.trim() ? `حساب إنستغرام: @${customerInstagram.replace('@', '')}` : ''}
${generatedOrderId ? `رمز الطلب: ${generatedOrderId}` : ''}

يرجى إرسال معلومات الحساب وتفاصيل الدفع (بريدي موب / CCP). شكراً!`;
  }, [product.name, selectedPlan.duration, price, currency, customerInstagram, generatedOrderId]);

  // Click "اطلب الآن" handler
  const handleOrderClick = async () => {
    // 1. Meta Pixel Contact Event
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Contact');
    }

    setOrderErrorMessage(null);

    // 2. Create Pending Order in Firestore
    try {
      setIsSubmittingOrder(true);
      const planCost = selectedPlan.purchaseCost !== undefined ? selectedPlan.purchaseCost : product.purchaseCost;
      const planAdCost = selectedPlan.adCost !== undefined ? selectedPlan.adCost : product.adCost;
      const planOtherCost = selectedPlan.otherCost !== undefined ? selectedPlan.otherCost : product.otherCosts;

      const orderId = await onCreatePendingOrder({
        productId: product.id,
        productName: product.name,
        planId: selectedPlan.id,
        planName: selectedPlan.duration,
        sellingPrice: price,
        currency,
        productCost: planCost,
        adCost: planAdCost,
        otherCosts: planOtherCost,
        customerInstagram: customerInstagram.trim() || undefined,
        landingPageId: landingPage.slug,
      });

      setGeneratedOrderId(orderId);
      setIsOrderModalOpen(true);
    } catch (err: any) {
      console.error('Failed to create pending order in Firestore:', err);
      // Real order failed: do NOT open modal as if successful
      setOrderErrorMessage(
        'تعذر تسجيل الطلب في النظام حالياً. يرجى التحقق من اتصالك والمحاولة مجدداً.'
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleCopyAndOpenInstagram = () => {
    navigator.clipboard.writeText(instagramMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);

    // Open Instagram direct message or profile
    setTimeout(() => {
      window.open('https://ig.me/m/yovo.dz', '_blank', 'noopener,noreferrer');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#080B0F] text-white flex flex-col font-sans selection:bg-[#FF3B30]/20 selection:text-[#FF3B30]">
      {/* Top Navbar */}
      <header className="border-b border-gray-800 bg-[#080B0F]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>
            <div className="h-4 w-px bg-gray-800" />
            <div className="flex items-center gap-1.5">
              <span className="font-brand font-black text-xl tracking-tight text-white uppercase">
                YOVO
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FF3B30]"></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOrderClick}
              className="px-4 py-2 bg-[#FF3B30] hover:bg-[#E02D22] text-white font-bold text-xs rounded-xl transition-all shadow-sm shadow-[#FF3B30]/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{landingPage.ctaText || 'اطلب الآن'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-5">
          {landingPage.badgeText && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF3B30]"></span>
              <span>{landingPage.badgeText}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
            {landingPage.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            {landingPage.heroDescription}
          </p>
        </section>

        {/* Pricing Card & Plan Selector */}
        <section className="bg-[#0e131a] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3B30]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Product Header inside Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
            <div className="flex items-center gap-4">
              {(landingPage.imageUrl || product.imageUrl || product.image) && (
                <img
                  src={landingPage.imageUrl || product.imageUrl || product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-700 shadow-md shrink-0 bg-gray-900"
                />
              )}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{product.name}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>حساب رسمي 100%</span>
                  </span>
                  <span>•</span>
                  <span>{product.activationTime || 'تفعيل سريع 15 دقيقة'}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Price Display */}
            <div className="text-right sm:text-left">
              <div className="text-xs text-gray-400">السعر الإجمالي</div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-brand">
                {price.toLocaleString()}{' '}
                <span className="text-lg font-bold text-[#FF3B30]">{currency}</span>
              </div>
            </div>
          </div>

          {/* Plan Selector Buttons */}
          <div className="py-6 space-y-3">
            <label className="block text-xs font-bold text-gray-300">
              اختر مدة الاشتراك المناسبة لك:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {plans.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-3.5 rounded-2xl text-right transition-all border relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF3B30]/10 border-[#FF3B30] shadow-sm shadow-[#FF3B30]/20 ring-1 ring-[#FF3B30]'
                        : 'bg-white/[0.04] border-gray-800 hover:border-gray-700 text-gray-300'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FF3B30] text-white">
                        {plan.note || 'الأكثر طلباً'}
                      </span>
                    )}
                    <div>
                      <div className="font-bold text-xs text-white mb-1">{plan.duration}</div>
                      <div className="text-sm font-black text-white font-brand">
                        {plan.price.toLocaleString()} {currency}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Instagram Handle (Optional) */}
          <div className="pb-6">
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              حسابك على إنستغرام (لتسهيل وتسريع التواصل):
            </label>
            <div className="relative max-w-sm">
              <Instagram className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerInstagram}
                onChange={(e) => setCustomerInstagram(e.target.value)}
                placeholder="@username (اختياري)"
                className="w-full pr-10 pl-4 py-2.5 bg-black/60 border border-gray-800 rounded-xl text-white text-xs placeholder:text-gray-600 focus:border-[#FF3B30] focus:outline-hidden dir-ltr text-right"
              />
            </div>
          </div>

          {/* Error Feedback */}
          {orderErrorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{orderErrorMessage}</span>
            </div>
          )}

          {/* Main Action Button */}
          <div>
            <button
              type="button"
              onClick={handleOrderClick}
              disabled={isSubmittingOrder}
              className="w-full py-4 bg-[#FF3B30] hover:bg-[#E02D22] text-white font-black text-base rounded-2xl transition-all shadow-xl shadow-[#FF3B30]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Instagram className="w-5 h-5" />
              <span>{isSubmittingOrder ? 'جارٍ تسجيل الطلب...' : (landingPage.ctaText || 'اطلب الآن عبر Instagram')}</span>
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-2">
              الدفع متاح عبر BaridiMob أو CCP مع ضمان استرداد فوري إن لم تستلم حسابك
            </p>
          </div>
        </section>

        {/* Benefits & Guarantees Grid */}
        {landingPage.benefits && landingPage.benefits.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider text-center">
              لماذا تطلب من متجر YOVO؟
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {landingPage.benefits.map((b, i) => (
                <div
                  key={i}
                  className="bg-[#0e131a] border border-gray-800 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/10">
                    <CheckCircle className="w-4 h-4 text-[#FF3B30]" />
                  </div>
                  <span className="text-xs font-bold text-gray-200">{b}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Product Features List */}
        {product.features && product.features.length > 0 && (
          <section className="bg-[#0e131a] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FF3B30]" />
              <span>ما الذي ستحصل عليه في هذا الاشتراك؟</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-[#FF3B30] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {landingPage.faq && landingPage.faq.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-base font-black text-white text-center flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#FF3B30]" />
              <span>الأسئلة الشائعة</span>
            </h3>

            <div className="space-y-2.5">
              {landingPage.faq.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-right flex items-center justify-between text-xs font-bold text-white hover:bg-slate-800/40 transition-colors"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isOpen ? 'rotate-180 text-[#FF3B30]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-gray-400 leading-relaxed border-t border-gray-800/60 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <section className="text-center py-8 border-t border-gray-800 space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            جاهز لتفعيل اشتراكك الآن؟
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            فريقنا متواجد عبر رسائل إنستغرام لمساعدتك وتفعيل اشتراكك بأقصى سرعة.
          </p>
          <button
            type="button"
            onClick={handleOrderClick}
            className="px-8 py-3.5 bg-[#FF3B30] hover:bg-[#E02D22] text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-[#FF3B30]/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>{landingPage.ctaText || 'اطلب الآن عبر Instagram'}</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} YOVO — متجر الاشتراكات الرقمية الموثوق في الجزائر</p>
      </footer>

      {/* Order Confirmation Modal (Existing Instagram Flow Preserved!) */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-right shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <span>إتمام الطلب عبر Instagram</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                إغلاق
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              تم تجهيز رسالة طلبك مع تفاصيل الاشتراك. انسخ الرسالة وأرسلها لحسابنا الرسمي على إنستغرام لإتمام التفعيل فوراً:
            </p>

            {/* Formatted Message Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4 text-xs font-mono text-slate-200 whitespace-pre-line select-all leading-relaxed">
              {instagramMessage}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCopyAndOpenInstagram}
                className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-90 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {copiedMessage ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    <span>تم النسخ! جارٍ فتح Instagram...</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ الرسالة وفتح Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                العودة للصفحة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
