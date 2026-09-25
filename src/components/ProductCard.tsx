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
      className={`group relative bg-white rounded-2xl border border-[#E5E7EB] transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden yovo-card-hover hover:border-[#080B0F] hover:shadow-xl hover:shadow-black/5 ${
        product.popular ? 'ring-1 ring-[#080B0F]/15' : ''
      } ${!isAvailable ? 'opacity-85' : ''}`}
    >
      {/* Clickable Header & Image Container */}
      <div
        className="cursor-pointer"
        onClick={() => onSelectProduct(product, defaultPlan)}
      >
        {/* Top Product Artwork Container */}
        <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-[#F3F4F6]">
          <BrandArtwork product={product} />

          {/* Badges Overlaid on Artwork */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-20">
            {/* Left: Category Tag */}
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-[#080B0F] shadow-xs backdrop-blur-xs border border-white/50">
              {product.category}
            </span>

            {/* Right: Status or Popular Badge */}
            <div>
              {!isAvailable ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#080B0F]/80 text-white text-[10px] font-bold backdrop-blur-xs">
                  <AlertCircle className="w-3 h-3 text-gray-400" />
                  غير متوفر
                </span>
              ) : product.popular ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF3B30] text-white text-[10px] font-bold shadow-xs">
                  <Sparkles className="w-3 h-3 text-white" />
                  الأكثر طلباً
                </span>
              ) : product.activationTime ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                  <Clock className="w-2.5 h-2.5 text-[#FF3B30]" />
                  سريع
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-3.5 sm:p-4 text-right">
          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-[#080B0F] leading-snug truncate group-hover:text-[#FF3B30] transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-1 line-clamp-1 font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Pricing Block */}
          <div className="mt-2.5 pt-2 border-t border-[#F3F4F6] flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-[#6B7280] font-medium">
                {hasMultiplePlans ? 'من' : ''}
              </span>
              <span className="text-base sm:text-lg font-black text-[#080B0F] font-brand tracking-tight">
                {formatPrice(displayPrice, product.currency || 'دج')}
              </span>
              <span className="text-[10px] sm:text-xs text-[#6B7280] font-medium">
                / {displayDuration}
              </span>
            </div>

            {hasMultiplePlans && (
              <span className="text-[10px] font-semibold text-[#080B0F] bg-[#F3F4F6] px-1.5 py-0.5 rounded-sm">
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
            className="w-full py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold text-[#080B0F] bg-[#F3F4F6] hover:bg-gray-200 transition-colors text-center cursor-pointer border border-[#E5E7EB] active:scale-95 flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3 text-[#6B7280]" />
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
                ? 'bg-[#FF3B30] text-white hover:bg-[#E02D22] shadow-xs shadow-[#FF3B30]/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
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
