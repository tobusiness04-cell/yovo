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
    <section id="products" className="py-8 sm:py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] text-slate-800 text-[11px] sm:text-xs font-bold mb-2 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#6cff76]"></span>
              <span>الكتالوج الرقمي</span>
              <span className="text-slate-400">({filteredProducts.length} اشتراك)</span>
            </div>
            <h2
              id="products-section-title"
              className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight"
            >
              جميع الاشتراكات المتوفرة
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              اختر الأداة المناسبة لك مع تفعيل فوري وضمان كامل بالدينار الجزائري
            </p>
          </div>

          {/* Search Bar (Prominent on desktop and mobile) */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="product-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اشتراك (Canva, CapCut, ChatGPT...)"
              className="w-full pl-9 pr-10 py-2.5 text-xs bg-[#F1F5F9] hover:bg-white focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#006633] focus:ring-2 focus:ring-[#006633]/20 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
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
                      ? 'bg-gradient-to-r from-[#006633] to-[#008844] text-white shadow-sm shadow-[#006633]/25'
                      : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200 border border-slate-200/80'
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
            <div className="w-12 h-12 rounded-xl bg-red-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">تعذر مزامنة قائمة الاشتراكات</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {error}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#006633] to-[#008844] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
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
            className="text-center py-16 px-6 bg-[#F1F5F9] rounded-2xl border border-dashed border-slate-200 max-w-lg mx-auto"
          >
            <div className="w-12 h-12 rounded-xl bg-white text-slate-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <PackageOpen className="w-6 h-6 text-[#006633]" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">لا توجد اشتراكات مضافة في المتجر حالياً</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
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
          <div className="text-center py-14 px-4 bg-[#F1F5F9] rounded-2xl border border-dashed border-slate-200">
            <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-900">لا توجد نتائج مطابقة لـ "{searchQuery}"</p>
            <p className="text-xs text-slate-500 mt-1">جرب البحث بكلمة أخرى أو تغيير التصنيف.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('الكل');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-950 rounded-xl transition-all cursor-pointer"
            >
              عرض جميع الاشتراكات
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
