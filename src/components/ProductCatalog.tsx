import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, AlertTriangle, RefreshCw, PackageOpen } from 'lucide-react';
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
    <section id="products" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>كتالوج الاشتراكات</span>
          </div>
          <h2
            id="products-section-title"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            اشتراكاتنا
          </h2>
          <p
            id="products-section-subtitle"
            className="text-base text-slate-500 mt-2 font-normal"
          >
            اختار الخدمة اللي تناسبك، واستمتع بتفعيل سريع وأسعار واضحة
          </p>
        </div>

        {/* Filter Bar & Search Controls */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Dynamic Category Tabs */}
          <div
            id="category-filters-container"
            className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  id={`filter-btn-${category}`}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="product-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اشتراك..."
              className="w-full pl-4 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all placeholder:text-slate-400"
            />
          </div>

        </div>

        {/* Firestore Loading State */}
        {isLoading ? (
          <div
            id="products-loading-skeleton"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between animate-pulse"
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div className="h-5 w-20 bg-slate-200 rounded-md" />
                    <div className="h-5 w-24 bg-slate-100 rounded-full" />
                  </div>
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                      <div className="h-3 bg-slate-100 rounded-md w-full" />
                    </div>
                  </div>
                  <div className="h-14 bg-slate-50 rounded-2xl border border-slate-100 my-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded-md w-5/6" />
                    <div className="h-3 bg-slate-100 rounded-md w-4/6" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-6 pt-2">
                  <div className="h-10 bg-slate-100 rounded-xl" />
                  <div className="h-10 bg-slate-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Firestore Error State */
          <div
            id="products-error-state"
            className="text-center py-14 px-6 bg-rose-50/70 rounded-3xl border border-rose-200 max-w-xl mx-auto"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-rose-900 mb-1">تعذر مزامنة قائمة الاشتراكات</h3>
            <p className="text-xs text-rose-700 mb-4 leading-relaxed">
              {error}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة المحاولة</span>
              </button>
            )}
          </div>
        ) : products.length === 0 ? (
          /* Empty Catalog State (No products in Firestore) */
          <div
            id="products-empty-state"
            className="text-center py-16 px-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <PackageOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">لا توجد اشتراكات مضافة في المتجر حالياً</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              يتم تحديث قائمة الاشتراكات وقواعد البيانات بشكل مباشر. يمكنك تسجيل الدخول إلى لوحة الإدارة لإضافة اشتراكات جديدة أو تهيئة البيانات.
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          /* Normal Products Grid */
          <div
            id="products-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
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
          /* Filter/Search empty results */
          <div className="text-center py-16 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">لا توجد خدمات مطابقة لبحثك</p>
            <p className="text-xs text-slate-500 mt-1">جرب تغيير التصنيف أو البحث بكلمات أخرى، أو تواصل معنا للاستفسار.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('الكل');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
            >
              عرض جميع الاشتراكات
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
