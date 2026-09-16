import React, { useState } from 'react';
import { Product, Category } from '../../types';
import {
  Package,
  CheckCircle,
  XCircle,
  Layers,
  Sparkles,
  Plus,
  ExternalLink,
  Clock,
  Database,
  RefreshCw,
  Check,
} from 'lucide-react';
import { formatPrice } from '../../lib/formatters';
import { seedInitialData } from '../../services/storeService';

interface AdminDashboardHomeProps {
  products: Product[];
  categories: Category[];
  onNavigateTab: (tab: 'products' | 'categories' | 'settings') => void;
  onOpenAddProduct: () => void;
  onViewStore: () => void;
  isFirebaseConfigured: boolean;
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  products,
  categories,
  onNavigateTab,
  onOpenAddProduct,
  onViewStore,
  isFirebaseConfigured,
}) => {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.available).length;
  const inactiveProducts = totalProducts - activeProducts;
  const totalCategories = categories.length;

  // Recently updated (or created) products
  const recentProducts = [...products]
    .sort((a, b) => {
      const timeA = a.updatedAt || a.createdAt || '';
      const timeB = b.updatedAt || b.createdAt || '';
      return timeB.localeCompare(timeA);
    })
    .slice(0, 5);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await seedInitialData();
      setSeedSuccess(`تم تهيئة ${res.productsCount} اشتراك و ${res.categoriesCount} تصنيف بنجاح.`);
      setTimeout(() => setSeedSuccess(null), 4000);
    } catch (e: any) {
      alert('فشل تهيئة البيانات: ' + e.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Welcome & Quick Actions Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-medium mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>لوحة الإدارة المباشرة — Yovo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              مرحباً بك في لوحة تحكم Yovo
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              تحكم بأسعار الاشتراكات، الخطط، التصنيفات، وروابط التواصل في الوقت الفعلي. التغييرات تظهر في واجهة المتجر فوراً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAddProduct}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة اشتراك</span>
            </button>

            <button
              type="button"
              onClick={onViewStore}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/15 transition-all"
            >
              <span>معاينة المتجر</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Database Setup Callout / Status */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isFirebaseConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {isFirebaseConfigured ? 'قاعدة بيانات Cloud Firestore متصلة ونشطة' : 'متصل بالذاكرة المحلية (Preview Cache)'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isFirebaseConfigured
                ? 'جميع القراءات والتحديثات تتم مباشرة على Cloud Firestore في الوقت الفعلي.'
                : 'يمكنك تهيئة البيانات الافتراضية بضغطة زر وتعديلها محلياً قبل ربط مفاتيح Firebase.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSeed}
          disabled={seeding}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
          <span>{seeding ? 'جارٍ التهيئة...' : 'تهيئة البيانات الافتراضية (Seed Data)'}</span>
        </button>
      </div>

      {seedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{seedSuccess}</span>
        </div>
      )}

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">إجمالي الاشتراكات</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalProducts}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">كل المنتجات المسجلة</span>
        </div>

        {/* Active Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700">اشتراكات مفعلة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{activeProducts}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">متاحة للطلب الآن</span>
        </div>

        {/* Inactive Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">اشتراكات معطلة</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{inactiveProducts}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">غير متوفرة حالياً</span>
        </div>

        {/* Categories */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">التصنيفات</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalCategories}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">تصنيفات نشطة</span>
        </div>

      </div>

      {/* Recently Updated Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">آخر الاشتراكات المحدثة</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('products')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700"
          >
            عرض الكل ({products.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentProducts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              لا توجد اشتراكات مسجلة بعد.
            </div>
          ) : (
            recentProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                    {product.name.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{product.name}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {product.category} • {product.plans?.length || 1} خطط
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <div className="text-xs font-extrabold text-slate-900">
                      {formatPrice(product.price, product.currency)}
                    </div>
                    <span className="text-[10px] text-slate-400">/{product.duration}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      product.available
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {product.available ? 'متوفر' : 'معطل'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
