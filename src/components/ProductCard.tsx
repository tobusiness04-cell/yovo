import React, { useState } from 'react';
import { ArrowUpLeft, Clock, ShieldCheck, Sparkles, AlertCircle, ShoppingBag, Eye } from 'lucide-react';
import { Product, ProductPlan } from '../types';
import { formatPrice } from '../lib/formatters';
import { BrandArtwork } from './common/BrandArtwork';

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
  // Primary plan or first plan
  const defaultPlan = (product.plans && product.plans.length > 0)
    ? product.plans[0]
    : {
        id: 'default',
        duration: product.duration || 'شهري',
        price: product.price,
        available: product.available,
      };

  const isAvailable = product.available && defaultPlan.available !== false;
  const displayPrice = typeof defaultPlan.price === 'number' ? defaultPlan.price : product.price;
  const displayDuration = defaultPlan.duration || product.duration || 'شهري';
  const hasMultiplePlans = product.plans && product.plans.length > 1;

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative bg-white rounded-2xl border border-slate-200 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden yovo-card-hover hover:border-[#3B82F6] hover:shadow-xl hover:shadow-blue-500/10 ${
        product.popular ? 'ring-1 ring-[#3B82F6]/20' : ''
      } ${!isAvailable ? 'opacity-85' : ''}`}
    >
      {/* Clickable Header & Image Container */}
      <div
        className="cursor-pointer"
        onClick={() => onSelectProduct(product, defaultPlan)}
      >
        {/* Top Product Artwork Container */}
        <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-slate-50">
          <BrandArtwork product={product} />

          {/* Badges Overlaid on Artwork */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-20">
            {/* Left: Category Tag */}
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-800 shadow-2xs backdrop-blur-xs border border-slate-200/70">
              {product.category}
            </span>

            {/* Right: Status or Popular Badge */}
            <div>
              {!isAvailable ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                  <AlertCircle className="w-3 h-3 text-slate-400" />
                  غير متوفر
                </span>
              ) : product.popular ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FACC15] text-slate-950 text-[10px] font-black shadow-xs">
                  <Sparkles className="w-3 h-3 text-slate-900" />
                  الأكثر طلباً
                </span>
              ) : product.activationTime ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-medium backdrop-blur-xs">
                  <Clock className="w-2.5 h-2.5 text-[#22D3EE]" />
                  سريع
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-3.5 sm:p-4 text-right">
          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug truncate group-hover:text-[#3B82F6] transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-1 font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Pricing Block */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-400 font-medium">
                {hasMultiplePlans ? 'من' : ''}
              </span>
              <span className="text-base sm:text-lg font-black text-slate-950 font-brand tracking-tight">
                {formatPrice(displayPrice, product.currency || 'دج')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                / {displayDuration}
              </span>
            </div>

            {hasMultiplePlans && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                خطط متعددة
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Buttons (Responsive for Mobile & Desktop) */}
      <div className="p-3 sm:p-4 pt-0">
        {/* On Mobile: Dual compact actions or prominent primary CTA */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            id={`view-details-${product.id}`}
            type="button"
            onClick={() => onSelectProduct(product, defaultPlan)}
            className="w-full py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold text-slate-800 bg-[#F1F5F9] hover:bg-slate-200 transition-colors text-center cursor-pointer border border-slate-200 active:scale-95 flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3 text-slate-500" />
            <span>التفاصيل</span>
          </button>

          <button
            id={`order-btn-${product.id}`}
            type="button"
            disabled={!isAvailable}
            onClick={() => {
              if (typeof window.fbq === 'function') {
                window.fbq('track', 'Contact');
              }
              onOrderNow(product, defaultPlan);
            }}
            className={`w-full py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
              isAvailable
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-95 shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            {isAvailable ? (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>اطلب الآن</span>
                <ArrowUpLeft className="w-3 h-3" />
              </>
            ) : (
              <span>نفد</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
