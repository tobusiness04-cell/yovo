import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, Smartphone, Info } from 'lucide-react';
import { Product, ProductPlan, StoreConfig } from '../types';
import { formatPrice } from '../lib/formatters';
import { BrandArtwork } from './common/BrandArtwork';
import { SocialIcon } from './common/SocialIcon';

interface QuickOrderModalProps {
  product: Product | null;
  initialPlan?: ProductPlan;
  settings?: StoreConfig;
  isOrdering?: boolean;
  onClose: () => void;
  onOrderNow: (product: Product, plan?: ProductPlan) => void;
  onViewDetails: (product: Product, plan?: ProductPlan) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  product,
  initialPlan,
  settings,
  isOrdering = false,
  onClose,
  onOrderNow,
  onViewDetails,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  useEffect(() => {
    if (product) {
      if (initialPlan) {
        setSelectedPlanId(initialPlan.id);
      } else if (product.plans && product.plans.length > 0) {
        setSelectedPlanId(product.plans[0].id);
      } else {
        setSelectedPlanId('default');
      }
    }
  }, [product, initialPlan]);

  if (!product) return null;

  const currentPlan: ProductPlan = (product.plans && product.plans.length > 0)
    ? (product.plans.find((p) => p.id === selectedPlanId) || product.plans[0])
    : {
        id: 'default',
        duration: product.duration || 'شهري',
        price: product.price,
        available: product.available,
      };

  const isAvailable = product.available && currentPlan.available !== false;
  const currentPrice = typeof currentPlan.price === 'number' ? currentPlan.price : product.price;
  const currentDuration = currentPlan.duration || product.duration || 'شهري';
  const hasMultiplePlans = product.plans && product.plans.length > 1;
  const currency = product.currency || 'دج';

  const handleTriggerOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAvailable || isOrdering) return;
    onOrderNow(product, currentPlan);
  };

  return (
    <div
      id="quick-order-modal"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full h-[88vh] sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 text-right transition-all animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* AREA A: FIXED HEADER (Never scrolls)                     */}
        {/* ======================================================== */}
        <div className="shrink-0 bg-white border-b border-slate-200/90 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3">
          {/* Right side: Product Thumbnail & Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
              <BrandArtwork product={product} size="sm" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                  {product.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {product.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                طلب مباشر وسريع عبر واتساب 🇩🇿
              </p>
            </div>
          </div>

          {/* Left side: Close Button */}
          <button
            id="close-quick-order-btn"
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* AREA B: SCROLLABLE CONTENT (Middle area)                 */}
        {/* ======================================================== */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
          
          {/* Product Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              {product.description}
            </p>
          )}

          {/* Subscription Plans Selection */}
          {hasMultiplePlans ? (
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                اختر خطة الاشتراك المناسبة:
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {product.plans!.map((plan) => {
                  const isSelected = plan.id === currentPlan.id;
                  const isPlanDisabled = !product.available || plan.available === false;

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      disabled={isPlanDisabled}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 rounded-xl text-right transition-all cursor-pointer border flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#006633] bg-emerald-50/80 text-[#006633] ring-1.5 ring-[#006633] shadow-xs'
                          : isPlanDisabled
                          ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold">{plan.duration}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#006633]" />}
                      </div>
                      <span className="text-sm font-black font-brand">
                        {formatPrice(plan.price, currency)}
                      </span>
                      {plan.note && (
                        <span className="text-[9px] font-bold mt-1 text-emerald-700">
                          {plan.note}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Single Plan Summary Card */
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="block text-[11px] text-slate-500 font-medium">الخطة المتوفرة:</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">{currentDuration}</span>
              </div>
              <div className="text-left">
                <span className="text-base sm:text-lg font-black text-slate-950 font-brand">
                  {formatPrice(currentPrice, currency)}
                </span>
              </div>
            </div>
          )}

          {/* Selected Plan Details & Price Highlight */}
          <div className="bg-[#006633]/5 border border-[#006633]/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">السعر المحدد:</span>
              <span className="text-[11px] text-slate-500">المدة: {currentDuration}</span>
            </div>
            <div className="flex items-baseline gap-1 text-left">
              <span className="text-lg sm:text-xl font-black text-[#006633] font-brand">
                {formatPrice(currentPrice, currency)}
              </span>
            </div>
          </div>

          {/* Product Features (If available) */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-900 block">
                مميزات الاشتراك:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {product.features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee Note */}
          {product.guarantee && (
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#006633] shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-bold ml-1">ضمان الخدمة:</strong>
                <span>{product.guarantee}</span>
              </div>
            </div>
          )}

          {/* Payment Reassurance Box */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
            <Smartphone className="w-4 h-4 text-[#006633] shrink-0" />
            <span>الدفع بالدينار الجزائري عبر بريدي موب (BaridiMob) أو CCP او فليكسي 🇩🇿</span>
          </div>

          {/* Secondary Details Link */}
          <div className="text-center pt-1 pb-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewDetails(product, currentPlan);
              }}
              className="text-xs font-bold text-slate-500 hover:text-[#006633] transition-colors inline-flex items-center gap-1 cursor-pointer py-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>عرض التفاصيل الكاملة للاشتراك</span>
            </button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* AREA C: FIXED BOTTOM ACTION BAR (Always visible)         */}
        {/* ======================================================== */}
        <div
          className="shrink-0 bg-white border-t border-slate-200 px-4 pt-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          style={{
            paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
          }}
          dir="rtl"
        >
          {/* Selected Total Price Row above button */}
          <div className="flex items-center justify-between pb-2 px-1 text-xs font-bold">
            <span className="text-slate-600">المجموع:</span>
            <span className="text-base sm:text-lg font-black font-brand text-[#006633] tracking-tight">
              {formatPrice(currentPrice, currency)}
            </span>
          </div>

          {/* Prominent Full-Width WhatsApp CTA Button */}
          <button
            id="quick-order-confirm-btn"
            type="button"
            disabled={!isAvailable || isOrdering}
            onClick={() => handleTriggerOrder()}
            className={`w-full min-h-[48px] sm:min-h-[50px] px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-98 cursor-pointer ${
              isAvailable && !isOrdering
                ? 'bg-gradient-to-r from-[#006633] to-[#008844] text-white hover:opacity-95 shadow-[#006633]/25'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
            dir="rtl"
          >
            {isOrdering ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                <span>جاري تسجيل الطلب...</span>
              </>
            ) : isAvailable ? (
              <>
                <SocialIcon icon="whatsapp" className="w-5 h-5 text-white shrink-0" />
                <span>اطلب الآن عبر واتساب</span>
              </>
            ) : (
              <span>الاشتراك غير متوفر حالياً</span>
            )}
          </button>

          {/* Micro Reassurance text */}
          <p className="text-[10px] text-slate-400 text-center mt-1.5 font-normal">
            تفعيل فوري • دفع آمن عبر BaridiMob أو CCP او فليكسي
          </p>
        </div>

      </div>
    </div>
  );
};
