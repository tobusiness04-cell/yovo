import React, { useState } from 'react';
import { Check, ArrowUpLeft, Clock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Product, ProductPlan } from '../types';
import { formatPrice } from '../lib/formatters';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product, selectedPlan?: ProductPlan) => void;
  onOrderNow: (product: Product, selectedPlan?: ProductPlan) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onOrderNow,
}) => {
  // Active plan state for this card
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    product.plans && product.plans.length > 0 ? product.plans[0].id : ''
  );

  const activePlan = (product.plans && product.plans.length > 0)
    ? (product.plans.find((p) => p.id === selectedPlanId) || product.plans[0])
    : {
        id: 'default',
        duration: product.duration,
        price: product.price,
        available: product.available,
      };

  const isCurrentPlanAvailable = product.available && (activePlan.available !== false);

  // Derive display price and duration
  const currentPrice = typeof activePlan.price === 'number' ? activePlan.price : product.price;
  const currentDuration = activePlan.duration || product.duration;

  // Custom icon/letter avatar based on brand name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        product.popular
          ? 'border-sky-300 shadow-md hover:shadow-xl ring-1 ring-sky-200/50'
          : 'border-slate-200/90 shadow-xs hover:shadow-lg hover:border-slate-300'
      } ${!product.available ? 'opacity-85 bg-slate-50/70' : ''}`}
    >
      {/* Top Badges Area */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              {product.category}
            </span>
            {product.activationTime && (
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                {product.activationTime}
              </span>
            )}
          </div>

          {/* Popular or Availability Status Badge */}
          <div>
            {!product.available ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[11px] font-semibold">
                <AlertCircle className="w-3 h-3" />
                غير متوفر حالياً
              </span>
            ) : product.popular ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-sky-500" />
                الأكثر طلباً
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Identity Header */}
        <div className="flex items-start gap-3.5 mb-3">
          <div
            className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center font-brand font-bold text-base shadow-2xs border shrink-0 ${
              product.imageUrl || product.image
                ? 'bg-white border-slate-200'
                : product.id.includes('canva')
                ? 'bg-sky-50 text-sky-700 border-sky-100'
                : product.id.includes('capcut')
                ? 'bg-slate-900 text-white border-slate-800'
                : product.id.includes('chatgpt')
                ? 'bg-teal-50 text-teal-700 border-teal-100'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            {product.imageUrl || product.image ? (
              <img
                src={product.imageUrl || product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="font-bold text-slate-700 text-sm">${getInitials(product.name)}</span>`;
                  }
                }}
              />
            ) : (
              getInitials(product.name)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 leading-tight truncate">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Dynamic Plan Selector (If multiple plans exist) */}
        {product.plans && product.plans.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 mb-2 block">
              المدة المتاحة:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.plans.map((plan) => {
                const isSelected = plan.id === activePlan.id;
                const isPlanDisabled = !product.available || plan.available === false;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    disabled={isPlanDisabled}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : isPlanDisabled
                        ? 'bg-slate-100 text-slate-400 line-through cursor-not-allowed'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    {plan.duration}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Price Display */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 font-brand">
              {formatPrice(currentPrice, product.currency)}
            </span>
            <span className="text-xs text-slate-500 mr-1.5 font-medium">
              / {currentDuration}
            </span>
          </div>

          {activePlan.note && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800">
              {activePlan.note}
            </span>
          )}
        </div>

        {/* Features Preview List */}
        <div className="mt-5 space-y-2">
          {product.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
              <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>

        {/* Per-Product Guarantee Badge */}
        {product.guarantee && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.guarantee}</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-6 pt-0 mt-2 grid grid-cols-2 gap-2">
        <button
          id={`view-details-btn-${product.id}`}
          type="button"
          onClick={() => onSelectProduct(product, activePlan)}
          className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
        >
          التفاصيل
        </button>

        <button
          id={`order-now-btn-${product.id}`}
          type="button"
          disabled={!isCurrentPlanAvailable}
          onClick={() => onOrderNow(product, activePlan)}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            isCurrentPlanAvailable
              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-2xs hover:shadow-xs active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isCurrentPlanAvailable ? (
            <>
              <span>اطلب الآن</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </>
          ) : (
            <span>غير متوفر</span>
          )}
        </button>
      </div>
    </div>
  );
};
