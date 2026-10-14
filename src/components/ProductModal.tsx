import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Clock, ArrowUpLeft, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { Product, ProductPlan, StoreConfig } from '../types';
import { storeConfig, getPrimaryOrderPlatform, getEnabledSocialPlatforms, getOrderPlatformUrl } from '../config';
import { formatPrice } from '../lib/formatters';
import { BrandArtwork } from './common/BrandArtwork';
import { SocialIcon } from './common/SocialIcon';

interface ProductModalProps {
  product: Product | null;
  initialPlan?: ProductPlan;
  settings?: StoreConfig;
  onClose: () => void;
  onOrderNow?: (product: Product, plan?: ProductPlan) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  initialPlan,
  settings,
  onClose,
  onOrderNow,
}) => {
  const currentSettings = settings || storeConfig;
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  useEffect(() => {
    if (product) {
      if (initialPlan) {
        setSelectedPlanId(initialPlan.id);
      } else if (product.plans && product.plans.length > 0) {
        setSelectedPlanId(product.plans[0].id);
      } else {
        setSelectedPlanId('');
      }
    }
  }, [product, initialPlan]);

  if (!product) return null;

  const currentPlan = (product.plans && product.plans.length > 0)
    ? (product.plans.find((p) => p.id === selectedPlanId) || product.plans[0])
    : {
        id: 'base',
        duration: product.duration || 'شهري',
        price: product.price,
        available: product.available,
      };

  const isAvailable = product.available && currentPlan.available !== false;
  const currentPrice = typeof currentPlan.price === 'number' ? currentPlan.price : product.price;
  const currentDuration = currentPlan.duration || product.duration || 'شهري';

  const primaryPlatform = getPrimaryOrderPlatform(currentSettings);
  const platformName = primaryPlatform?.name || 'WhatsApp';
  const orderCtaText = product.orderCtaText || `اطلب الآن عبر ${platformName}`;

  return (
    <div
      id="product-details-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-right transition-all animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-30 p-2 text-white bg-slate-900/60 hover:bg-slate-900 rounded-full transition-colors cursor-pointer backdrop-blur-xs"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Artwork Banner Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-50">
          <BrandArtwork product={product} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Badges on Banner */}
          <div className="absolute bottom-3 right-4 left-4 flex items-center justify-between text-white z-20">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/95 text-slate-800 shadow-2xs backdrop-blur-xs">
              {product.category}
            </span>
            {product.popular && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#6cff76] text-[#003319] text-xs font-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                الأكثر طلباً
              </span>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 text-right">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4 font-normal">
            {product.description}
          </p>

          {/* Plan Selector Buttons (If multiple plans exist) */}
          {product.plans && product.plans.length > 0 && (
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-900 block mb-2">
                اختر خطة الاشتراك المناسبة:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.plans.map((plan) => {
                  const isSelected = plan.id === currentPlan.id;
                  const isPlanDisabled = !product.available || plan.available === false;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      disabled={isPlanDisabled}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-2.5 rounded-xl text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-[#006633] bg-[#006633]/10 text-[#006633] ring-1 ring-[#006633]/30 shadow-xs'
                          : isPlanDisabled
                          ? 'border-slate-200 bg-[#F1F5F9] text-slate-400 line-through cursor-not-allowed opacity-60'
                          : 'border-slate-200 bg-[#F1F5F9] text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      <span className="block text-xs font-bold">{plan.duration}</span>
                      <span
                        className={`block text-[11px] mt-0.5 font-brand ${
                          isSelected ? 'text-[#006633] font-bold' : 'text-slate-500'
                        }`}
                      >
                        {formatPrice(plan.price, product.currency || 'دج')}
                      </span>
                      {plan.note && (
                        <span
                          className={`inline-block text-[9px] px-1 py-0.2 mt-1 rounded-sm ${
                            isSelected
                              ? 'bg-[#6cff76] text-[#003319] font-black'
                              : 'bg-emerald-100 text-[#004d26] font-bold'
                          }`}
                        >
                          {plan.note}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-[#F1F5F9] border border-slate-200 mb-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">السعر المطلوب:</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-slate-950 font-brand tracking-tight">
                  {formatPrice(currentPrice, product.currency || 'دج')}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  / {currentDuration}
                </span>
              </div>
            </div>

            {product.activationTime && (
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-medium">سرعة التفعيل</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#006633]" />
                  {product.activationTime}
                </span>
              </div>
            )}
          </div>

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <div className="mb-5">
              <span className="text-xs font-bold text-slate-900 block mb-2.5">
                مميزات الاشتراك:
              </span>
              <div className="space-y-2">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#006633] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#006633]" />
                    </div>
                    <span className="text-slate-800 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee Box */}
          {product.guarantee && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#006633] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600">
                <strong className="text-slate-900 font-bold block mb-0.5">ضمان Yovo المعتمد:</strong>
                <p className="leading-relaxed">{product.guarantee}</p>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              id="modal-order-btn"
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                if (typeof window.fbq === 'function') {
                  window.fbq('track', 'Contact');
                }
                if (onOrderNow) {
                  onOrderNow(product, currentPlan);
                }
                onClose();
              }}
              className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAvailable
                  ? 'bg-gradient-to-r from-[#006633] to-[#008844] text-white hover:opacity-95 shadow-md shadow-[#006633]/20 active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isAvailable ? (
                <>
                  <SocialIcon icon={primaryPlatform?.icon || 'whatsapp'} className="w-4 h-4 text-white" />
                  <span>{orderCtaText}</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </>
              ) : (
                <span>الاشتراك غير متوفر حالياً</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              متابعة تصفح الاشتراكات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
