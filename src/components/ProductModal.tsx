import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Clock, ArrowUpLeft, Sparkles, AlertCircle } from 'lucide-react';
import { Product, ProductPlan, StoreConfig } from '../types';
import { storeConfig, getPrimaryOrderPlatform, getEnabledSocialPlatforms, getOrderPlatformUrl } from '../config';
import { formatPrice } from '../lib/formatters';
import { SocialIcon } from './common/SocialIcon';

interface ProductModalProps {
  product: Product | null;
  initialPlan?: ProductPlan;
  settings?: StoreConfig;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  initialPlan,
  settings,
  onClose,
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
        duration: product.duration,
        price: product.price,
        available: product.available,
      };

  const isAvailable = product.available && currentPlan.available !== false;
  const currentPrice = typeof currentPlan.price === 'number' ? currentPlan.price : product.price;
  const currentDuration = currentPlan.duration || product.duration;

  // Resolve dynamic primary order platform
  const primaryPlatform = getPrimaryOrderPlatform(currentSettings);
  const primaryUrl = primaryPlatform?.url ? getOrderPlatformUrl(primaryPlatform.url) : '';
  const primaryName = primaryPlatform?.name || 'Instagram';

  // Other enabled platforms for secondary inquiries
  const otherPlatforms = getEnabledSocialPlatforms(currentSettings).filter(
    (p) => p.id !== primaryPlatform?.id
  );

  return (
    <div
      id="product-details-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-right overflow-hidden transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            {product.category}
          </span>
          {product.popular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
              <Sparkles className="w-3 h-3 text-sky-500" />
              الأكثر طلباً
            </span>
          )}
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          {product.name}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
          {product.description}
        </p>

        {/* Plan Selector */}
        {product.plans && product.plans.length > 0 && (
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-800 block mb-2">
              اختر المدة المناسبة:
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
                    className={`py-2 px-3 text-center rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : isPlanDisabled
                        ? 'bg-slate-50 text-slate-400 border-slate-100 line-through cursor-not-allowed'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>{plan.duration}</div>
                    <div className={`text-[11px] font-normal mt-0.5 ${isSelected ? 'text-sky-300' : 'text-slate-500'}`}>
                      {formatPrice(plan.price, product.currency)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Delivery Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block font-medium">السعر المحدد:</span>
            <span className="text-2xl font-extrabold text-slate-900 font-brand">
              {formatPrice(currentPrice, product.currency)}
            </span>
            <span className="text-xs text-slate-500 mr-1.5">/ {currentDuration}</span>
          </div>

          <div className="text-left">
            <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {product.activationTime || 'تفعيل سريع'}
            </span>
            <span className="block text-[11px] text-emerald-600 font-bold mt-0.5">
              {isAvailable ? 'جاهز للتفعيل' : 'غير متوفر حالياً'}
            </span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            المميزات المضمنة في الاشتراك:
          </h4>
          <div className="space-y-2.5">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                <div className="w-4 h-4 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Specific Guarantee Info */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-900 text-xs flex items-start gap-2 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">معلومات الضمان الخاصة بهذا الاشتراك:</span>
            <span className="text-emerald-800 leading-relaxed">
              {product.guarantee || currentSettings.guaranteeGeneralText}
            </span>
          </div>
        </div>

        {/* Dynamic Conversion Action Buttons */}
        {isAvailable ? (
          <div className="space-y-3">
            {primaryUrl ? (
              <a
                id="product-modal-order-btn"
                href={primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <SocialIcon icon={primaryPlatform?.icon} className="w-4 h-4 text-sky-400" />
                <span>اطلب الآن عبر {primaryName}</span>
                <ArrowUpLeft className="w-4 h-4" />
              </a>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-800 font-medium flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>قناة استقبال الطلبات غير مهيئة حالياً في لوحة الإدارة.</span>
              </div>
            )}

            {/* Other enabled channels (if configured) */}
            {otherPlatforms.length > 0 && (
              <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
                <span>أو تواصل معنا عبر:</span>
                {otherPlatforms.map((p) => (
                  <a
                    key={p.id}
                    href={getOrderPlatformUrl(p.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900 inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <SocialIcon icon={p.icon} className="w-3 h-3 text-slate-600" />
                    <span>{p.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>هذا الاشتراك غير متوفر حالياً. يمكنك الاستفسار عنه عبر الدعم.</span>
          </div>
        )}

      </div>
    </div>
  );
};
