import React from 'react';
import { ArrowUpLeft, AlertCircle } from 'lucide-react';
import { Product, ProductPlan } from '../types';
import { formatPrice } from '../lib/formatters';
import { BrandArtwork } from './common/BrandArtwork';
import { SocialIcon } from './common/SocialIcon';

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
  // Determine available plans and starting price
  const availablePlans = (product.plans && product.plans.length > 0)
    ? product.plans.filter((p) => p.available !== false)
    : [];

  const defaultPlan = (product.plans && product.plans.length > 0)
    ? product.plans[0]
    : {
        id: 'default',
        duration: product.duration || 'شهري',
        price: product.price,
        available: product.available,
      };

  const isAvailable = product.available && (availablePlans.length > 0 || (product.plans || []).length === 0);
  const hasMultiplePlans = (product.plans && product.plans.length > 1);

  // Compute lowest starting price
  let minPrice = typeof product.price === 'number' ? product.price : 0;
  if (product.plans && product.plans.length > 0) {
    const prices = product.plans
      .map((p) => (typeof p.price === 'number' ? p.price : null))
      .filter((p): p is number => p !== null);
    if (prices.length > 0) {
      minPrice = Math.min(...prices);
    }
  }

  const currency = product.currency || 'دج';

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group bg-white rounded-2xl border border-slate-200 transition-all duration-200 flex flex-col justify-between overflow-hidden hover:border-[#006633] hover:shadow-lg ${
        !isAvailable ? 'opacity-80' : ''
      }`}
    >
      {/* Clickable Card Upper Area */}
      <div
        className="cursor-pointer"
        onClick={() => onSelectProduct(product, defaultPlan)}
      >
        {/* Product Artwork Container */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-slate-50 border-b border-slate-100">
          <BrandArtwork product={product} />

          {/* Minimal Status or Category Tag */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-800 shadow-2xs backdrop-blur-xs border border-slate-200/80">
              {product.category}
            </span>

            {!isAvailable && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/85 text-white text-[10px] font-bold backdrop-blur-xs">
                <AlertCircle className="w-3 h-3 text-red-400" />
                غير متوفر
              </span>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="p-3.5 sm:p-4 text-right">
          <h3 className="text-sm sm:text-base font-bold text-slate-950 leading-snug truncate group-hover:text-[#006633] transition-colors">
            {product.name}
          </h3>

          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-1 font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Starting Price Display */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              {hasMultiplePlans && (
                <span className="text-[11px] text-slate-500 font-medium">ابتداءً من</span>
              )}
              <span className="text-base sm:text-lg font-black text-slate-950 font-brand tracking-tight">
                {formatPrice(minPrice, currency)}
              </span>
              {!hasMultiplePlans && defaultPlan.duration && (
                <span className="text-[11px] text-slate-500">/ {defaultPlan.duration}</span>
              )}
            </div>

            {hasMultiplePlans && (
              <span className="text-[10px] font-bold text-[#006633] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                {product.plans!.length} خطط
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions: Primary Order Button + Secondary Details Link */}
      <div className="p-3 sm:p-4 pt-0 space-y-1.5">
        {/* 1. Primary Order Button (Most prominent interactive element) */}
        <button
          id={`order-btn-${product.id}`}
          type="button"
          disabled={!isAvailable}
          onClick={() => onOrderNow(product, defaultPlan)}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
            isAvailable
              ? 'bg-gradient-to-r from-[#006633] to-[#008844] text-white hover:opacity-95 shadow-xs shadow-[#006633]/25'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          {isAvailable ? (
            <>
              <SocialIcon icon="whatsapp" className="w-3.5 h-3.5 text-white" />
              <span>اطلب الآن</span>
              <ArrowUpLeft className="w-3 h-3" />
            </>
          ) : (
            <span>نفد حالياً</span>
          )}
        </button>

        {/* 2. Secondary Details Button (Visually secondary) */}
        <button
          id={`view-details-${product.id}`}
          type="button"
          onClick={() => onSelectProduct(product, defaultPlan)}
          className="w-full py-1.5 text-center text-[11px] font-bold text-slate-500 hover:text-[#006633] hover:underline transition-colors cursor-pointer"
        >
          التفاصيل
        </button>
      </div>
    </div>
  );
};
