import React, { useState, useMemo } from 'react';
import { Product, Category, Order, Expense, AdCampaign, OrderStatus } from '../../types';
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  Plus,
  ExternalLink,
  Calendar,
  Database,
  RefreshCw,
  ShoppingBag,
  Target,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { seedInitialData } from '../../services/storeService';

interface AdminDashboardHomeProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  expenses: Expense[];
  campaigns: AdCampaign[];
  onNavigateTab: (tab: any) => void;
  onOpenAddProduct: () => void;
  onViewStore: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  isFirebaseConfigured: boolean;
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  products,
  categories,
  orders,
  expenses,
  campaigns,
  onNavigateTab,
  onOpenAddProduct,
  onViewStore,
  onUpdateOrderStatus,
  isFirebaseConfigured,
}) => {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  // Date Filter: 'today' | '7days' | 'month' | 'custom' | 'all'
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | 'month' | 'custom' | 'all'>('month');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

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

  // Filter Orders by Date
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return orders.filter((o) => {
      const orderTime = new Date(o.createdAt).getTime();

      if (dateFilter === 'today') {
        return orderTime >= startOfToday;
      }
      if (dateFilter === '7days') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return orderTime >= sevenDaysAgo;
      }
      if (dateFilter === 'month') {
        return orderTime >= startOfThisMonth;
      }
      if (dateFilter === 'custom') {
        if (customStart && orderTime < new Date(customStart).getTime()) return false;
        if (customEnd && orderTime > new Date(customEnd).getTime() + 86400000) return false;
        return true;
      }
      return true;
    });
  }, [orders, dateFilter, customStart, customEnd]);

  // Order Counts
  const totalOrdersCount = filteredOrders.length;
  const pendingOrders = useMemo(() => filteredOrders.filter((o) => o.status === 'pending'), [filteredOrders]);
  const completedOrders = useMemo(() => filteredOrders.filter((o) => o.status === 'completed'), [filteredOrders]);
  const cancelledOrders = useMemo(() => filteredOrders.filter((o) => o.status === 'cancelled'), [filteredOrders]);

  // STRICT FINANCIAL RULES:
  // "Only COMPLETED orders should count toward realized revenue and realized profit."
  // "Pending orders should NOT be counted as completed revenue/profit."
  // "Cancelled orders should NOT be counted as revenue/profit."
  const totalRealizedRevenue = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (o.sellingPrice || 0), 0);
  }, [completedOrders]);

  const totalProductCosts = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (o.productCost || 0), 0);
  }, [completedOrders]);

  const totalAdCostAllocation = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (o.adCost || 0), 0);
  }, [completedOrders]);

  const totalOtherCosts = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + ((o.paymentFee || 0) + (o.otherCosts || 0)), 0);
  }, [completedOrders]);

  const totalCompletedOrderCosts = totalProductCosts + totalAdCostAllocation + totalOtherCosts;
  const netRealizedProfit = totalRealizedRevenue - totalCompletedOrderCosts;
  const averageOrderValue = completedOrders.length > 0 ? Math.round(totalRealizedRevenue / completedOrders.length) : 0;

  // Recent 6 orders
  const recentOrders = [...filteredOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Welcome & Quick Actions Hero */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-medium mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نظام إدارة الاشتراكات والمبيعات — Yovo DZ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              لوحة تحكم المتجر والربحية الحقيقية
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              متابعة الطلبات المبدئية عبر WhatsApp ووسائل التواصل، تأكيد التحصيلات، تتبع تكاليف الإعلانات والموردين، وحساب الأرباح المحققة بدقة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>إدارة الطلبات ({pendingOrders.length} معلقة)</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddProduct}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/15 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة اشتراك</span>
            </button>

            <button
              type="button"
              onClick={onViewStore}
              className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-all"
              title="معاينة الواجهة العامة"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-700">تصفية الفترة الزمنية:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === 'today'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            اليوم
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('7days')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === '7days'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            آخر 7 أيام
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('month')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === 'month'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            هذا الشهر
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            كل الفترات
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('custom')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === 'custom'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            فترة مخصصة
          </button>
        </div>

        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2 text-xs pt-2 sm:pt-0">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800"
            />
            <span className="text-slate-400">إلى</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800"
            />
          </div>
        )}
      </div>

      {/* Primary KPI Grid (The 10 Required Store Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500">إجمالي الطلبات</span>
            <ShoppingBag className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalOrdersCount}</div>
            <span className="text-[10px] text-slate-400">كافة الطلبات المسجلة</span>
          </div>
        </div>

        {/* 2. Pending Orders */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col justify-between bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-[11px] font-bold text-amber-800">قيد الانتظار</span>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-700">{pendingOrders.length}</div>
            <span className="text-[10px] text-amber-600 font-medium">بانتظار تأكيد الدفع</span>
          </div>
        </div>

        {/* 3. Completed Orders */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col justify-between bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-[11px] font-bold text-emerald-800">مكتملة ومحققة</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">{completedOrders.length}</div>
            <span className="text-[10px] text-emerald-600 font-medium">مبيعات مدفوعة</span>
          </div>
        </div>

        {/* 4. Cancelled Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500">ملغاة</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600">{cancelledOrders.length}</div>
            <span className="text-[10px] text-slate-400">مستبعدة من الأرباح</span>
          </div>
        </div>

        {/* 5. Total Revenue (Completed Only) */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col justify-between bg-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-bold text-emerald-900">الإيرادات المحققة</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">
              {totalRealizedRevenue.toLocaleString()}{' '}
              <span className="text-xs font-bold">دج</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">الطلبات المكتملة فقط</span>
          </div>
        </div>

        {/* 6. Product Costs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500">تكلفة شراء الاشتراكات</span>
            <Package className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {totalProductCosts.toLocaleString()} <span className="text-xs font-bold">دج</span>
            </div>
            <span className="text-[10px] text-slate-400">للمبيعات المكتملة</span>
          </div>
        </div>

        {/* 7. Advertising Costs Allocation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500">تكاليف الإعلانات</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-xl font-black text-indigo-600">
              {totalAdCostAllocation.toLocaleString()} <span className="text-xs font-bold">دج</span>
            </div>
            <span className="text-[10px] text-slate-400">حصة الحملات التسويقية</span>
          </div>
        </div>

        {/* 8. Total Other Costs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500">رسوم ومصاريف أخرى</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {totalOtherCosts.toLocaleString()} <span className="text-xs font-bold">دج</span>
            </div>
            <span className="text-[10px] text-slate-400">رسوم دفع وتشغيل</span>
          </div>
        </div>

        {/* 9. Net Profit */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-black text-emerald-950">صافي الأرباح الحقيقية</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-2xl font-black ${netRealizedProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {netRealizedProfit.toLocaleString()}{' '}
              <span className="text-xs font-bold">دج</span>
            </div>
            <span className="text-[10px] text-emerald-800 font-bold">
              الهامش:{' '}
              {totalRealizedRevenue > 0
                ? `${((netRealizedProfit / totalRealizedRevenue) * 100).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* 10. Average Order Value (AOV) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500">متوسط قيمة الطلب (AOV)</span>
            <DollarSign className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <div className="text-xl font-black text-sky-600">
              {averageOrderValue.toLocaleString()} <span className="text-xs font-bold">دج</span>
            </div>
            <span className="text-[10px] text-slate-400">لكل طلب مكتمل</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigateTab('calculator')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all text-right shadow-xs group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-slate-900 mb-0.5">حاسبة التسعير الذكي</div>
          <div className="text-[10px] text-slate-400">حساب سعر البيع بمعادلة الهامش</div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('landing_pages')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 transition-all text-right shadow-xs group"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-slate-900 mb-0.5">صفحات الهبوط المخصصة</div>
          <div className="text-[10px] text-slate-400">صفحات مبيعات لكل اشتراك</div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('advertising')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-all text-right shadow-xs group"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Target className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-slate-900 mb-0.5">حملات Meta Ads & CAC</div>
          <div className="text-[10px] text-slate-400">تتبع تكلفة الاستحواذ على الزبون</div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('costs')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 transition-all text-right shadow-xs group"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-slate-900 mb-0.5">المصروفات والتكاليف</div>
          <div className="text-[10px] text-slate-400">تسجيل التكاليف العامة والموردين</div>
        </button>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-900">أحدث الطلبات الواردة</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
          >
            <span>عرض كل الطلبات</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center px-4">
            <p className="text-xs text-slate-400">
              لا توجد طلبات في الفترة المحددة. الطلبات المنشأة عبر إنستغرام ستظهر هنا فورياً.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">رقم الطلب</th>
                  <th className="py-3 px-4">المنتج والخطة</th>
                  <th className="py-3 px-4">سعر البيع</th>
                  <th className="py-3 px-4">الربح المتوقع</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">إجراء سريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{ord.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{ord.productName}</span>{' '}
                      <span className="text-[11px] text-slate-500">({ord.planName})</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {ord.sellingPrice.toLocaleString()} {ord.currency}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[11px] ${
                          ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-400 line-through'
                        }`}
                      >
                        {ord.profit.toLocaleString()} {ord.currency}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {ord.status === 'completed' && (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          مكتمل
                        </span>
                      )}
                      {ord.status === 'pending' && (
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          قيد الانتظار
                        </span>
                      )}
                      {ord.status === 'cancelled' && (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          ملغي
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {ord.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => onUpdateOrderStatus(ord.id, 'completed')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-colors"
                        >
                          تأكيد الدفع
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Database Connection Status Callout */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isFirebaseConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
            }`}
          >
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {isFirebaseConfigured ? 'قاعدة بيانات Cloud Firestore متصلة ونشطة' : 'متصل بالذاكرة المحلية (Preview Cache)'}
            </h4>
            <p className="text-[11px] text-slate-500">
              البيانات تتزامن لحظياً في كل عمليات الإدارة والطلبات.
            </p>
          </div>
        </div>

        {seedSuccess ? (
          <span className="text-xs text-emerald-600 font-bold">{seedSuccess}</span>
        ) : (
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'جارٍ التهيئة...' : 'إعادة تهيئة البيانات الافتراضية'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
