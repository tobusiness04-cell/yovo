import React, { useState, useMemo } from 'react';
import { Search, Sparkles, AlertTriangle, RefreshCw, PackageOpen, X, SlidersHorizontal } from 'lucide-react';
import { Product, ProductPlan } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelectProduct: (product: Product, selectedPlan?: ProductPlan) => void;
  onOrderNow: (product: Product, selectedPlan?: ProductPlan) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  isLoading = false,
  error = null,
  onRetry,
  onSelectProduct,
  onOrderNow,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically extract all unique categories from the product catalog
  const categories = useMemo(() => {
    const uniqueCats = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
    return ['الكل', ...uniqueCats];
  }, [products]);

  // Filter products based on selected category & search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'الكل' || product.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="products" className="py-8 sm:py-14 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#080B0F] text-[11px] sm:text-xs font-bold mb-2 border border-[#E5E7EB]">
              <span className="w-2 h-2 rounded-full bg-[#FF3B30]"></span>
              <span>الكتالوج الرقمي</span>
              <span className="text-[#6B7280]">({filteredProducts.length} اشتراك)</span>
            </div>
            <h2
              id="products-section-title"
              className="text-xl sm:text-3xl font-black text-[#080B0F] tracking-tight"
            >
              جميع الاشتراكات المتوفرة
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 font-normal">
              اختر الأداة المناسبة لك مع تفعيل فوري وضمان كامل بالدينار الجزائري
            </p>
          </div>

          {/* Search Bar (Prominent on desktop and mobile) */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-[#6B7280] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="product-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اشتراك (Canva, CapCut, ChatGPT...)"
              className="w-full pl-9 pr-10 py-2.5 text-xs bg-[#F3F4F6] hover:bg-white focus:bg-white text-[#080B0F] border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]/15 transition-all placeholder:text-[#6B7280]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
                aria-label="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Category Navigation Bar */}
        <div className="mb-6 sm:mb-8 -mx-3 px-3 sm:mx-0 sm:px-0">
          <div
            id="category-filters-container"
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  id={`filter-btn-${category}`}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-[#080B0F] text-white shadow-xs'
                      : 'bg-[#F3F4F6] text-[#080B0F] hover:bg-gray-200 border border-[#E5E7EB]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State Skeleton */}
        {isLoading ? (
          <div
            id="products-loading-skeleton"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden flex flex-col justify-between animate-pulse"
              >
                <div className="aspect-[16/11] bg-gray-100" />
                <div className="p-3.5 space-y-2">
                  <div className="h-4 bg-gray-100 rounded-md w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-md w-full" />
                  <div className="h-5 bg-gray-100 rounded-md w-1/2 mt-2" />
                </div>
                <div className="p-3.5 pt-0">
                  <div className="h-8 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div
            id="products-error-state"
            className="text-center py-12 px-6 bg-red-50 rounded-2xl border border-red-100 max-w-xl mx-auto"
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 text-[#FF3B30] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#080B0F] mb-1">تعذر مزامنة قائمة الاشتراكات</h3>
            <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">
              {error}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#FF3B30] hover:bg-[#E02D22] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة المحاولة</span>
              </button>
            )}
          </div>
        ) : products.length === 0 ? (
          /* Empty Catalog State */
          <div
            id="products-empty-state"
            className="text-center py-16 px-6 bg-[#F3F4F6] rounded-2xl border border-dashed border-[#E5E7EB] max-w-lg mx-auto"
          >
            <div className="w-12 h-12 rounded-xl bg-white text-[#080B0F] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <PackageOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#080B0F] mb-1">لا توجد اشتراكات مضافة في المتجر حالياً</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              يتم تحديث قائمة الاشتراكات وقواعد البيانات بشكل مستمر. يرجى التواصل معنا للاستفسار عن أي خدمة.
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          /* 2 COLUMNS ON MOBILE (<640px), 4 COLUMNS ON DESKTOP (>=1024px) */
          <div
            id="products-grid"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onOrderNow={onOrderNow}
              />
            ))}
          </div>
        ) : (
          /* Empty Filter Search Results */
          <div className="text-center py-14 px-4 bg-[#F3F4F6] rounded-2xl border border-dashed border-[#E5E7EB]">
            <SlidersHorizontal className="w-8 h-8 text-[#6B7280] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#080B0F]">لا توجد نتائج مطابقة لـ "{searchQuery}"</p>
            <p className="text-xs text-[#6B7280] mt-1">جرب البحث بكلمة أخرى أو تغيير التصنيف.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('الكل');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#080B0F] hover:bg-black rounded-xl transition-all cursor-pointer"
            >
              عرض جميع الاشتراكات
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
