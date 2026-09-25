import React, { useMemo, useState } from 'react';
import { Order, Expense, AdCampaign, Product } from '../../types';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Percent,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

interface AdminAnalyticsProps {
  orders: Order[];
  expenses: Expense[];
  campaigns: AdCampaign[];
  products: Product[];
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  orders,
  expenses,
  campaigns,
  products,
}) => {
  const [timeRange, setTimeRange] = useState<'all' | '7days' | '30days'>('all');

  // Filter orders by time range
  const filteredOrders = useMemo(() => {
    const now = Date.now();
    return orders.filter((o) => {
      if (timeRange === 'all') return true;
      const t = new Date(o.createdAt).getTime();
      const days = (now - t) / (1000 * 60 * 60 * 24);
      if (timeRange === '7days') return days <= 7;
      if (timeRange === '30days') return days <= 30;
      return true;
    });
  }, [orders, timeRange]);

  // STRICT BUSINESS RULE:
  // "Only COMPLETED orders count toward realized revenue and profit."
  // "Pending orders should NOT be counted as completed revenue/profit."
  // "Cancelled orders should NOT be counted as revenue/profit."
  const completedOrders = useMemo(() => {
    return filteredOrders.filter((o) => o.status === 'completed');
  }, [filteredOrders]);

  const pendingOrders = useMemo(() => {
    return filteredOrders.filter((o) => o.status === 'pending');
  }, [filteredOrders]);

  const cancelledOrders = useMemo(() => {
    return filteredOrders.filter((o) => o.status === 'cancelled');
  }, [filteredOrders]);

  // Financial aggregates (COMPLETED ORDERS ONLY!)
  const realizedRevenue = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (o.sellingPrice || 0), 0);
  }, [completedOrders]);

  const realizedProductCost = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (o.productCost || 0), 0);
  }, [completedOrders]);

  const realizedAdCost = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (o.adCost || 0), 0);
  }, [completedOrders]);

  const realizedPaymentFees = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (o.paymentFee || 0), 0);
  }, [completedOrders]);

  const realizedOtherCosts = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (o.otherCosts || 0), 0);
  }, [completedOrders]);

  const totalRealizedCost = realizedProductCost + realizedAdCost + realizedPaymentFees + realizedOtherCosts;
  const netRealizedProfit = realizedRevenue - totalRealizedCost;
  const profitMarginPercent = realizedRevenue > 0 ? ((netRealizedProfit / realizedRevenue) * 100).toFixed(1) : '0';
  const averageOrderValue = completedOrders.length > 0 ? Math.round(realizedRevenue / completedOrders.length) : 0;

  // Total advertising recorded
  const totalAdBudget = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + (c.amountSpent || 0), 0);
  }, [campaigns]);

  // ROAS (Return On Ad Spend) = Realized Revenue / Total Ad Spend
  const roas = totalAdBudget > 0 ? (realizedRevenue / totalAdBudget).toFixed(2) : null;

  // Breakdown by Product
  const productPerformance = useMemo(() => {
    return products.map((prod) => {
      const prodCompleted = completedOrders.filter((o) => o.productId === prod.id);
      const prodPending = pendingOrders.filter((o) => o.productId === prod.id);
      const rev = prodCompleted.reduce((s, o) => s + (o.sellingPrice || 0), 0);
      const cost = prodCompleted.reduce((s, o) => s + (o.totalCost || 0), 0);
      const prof = rev - cost;
      const margin = rev > 0 ? ((prof / rev) * 100).toFixed(1) : '0';

      return {
        product: prod,
        completedCount: prodCompleted.length,
        pendingCount: prodPending.length,
        revenue: rev,
        cost,
        profit: prof,
        margin,
      };
    });
  }, [products, completedOrders, pendingOrders]);

  return (
    <div className="space-y-6">
      {/* Top Header & Range Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            تحليلات الأرباح والمبيعات المحققة
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تقارير مالية دقيقة وفق قواعد المحاسبة: الطلبات المكتملة فقط هي التي تحسب في الإيرادات والأرباح
          </p>
        </div>

        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            كل الفترات
          </button>
          <button
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === '30days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            آخر 30 يوماً
          </button>
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === '7days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            آخر 7 أيام
          </button>
        </div>
      </div>

      {/* Main Financial KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Realized Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">
            الإيرادات المحققة (المكتملة)
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {realizedRevenue.toLocaleString()} <span className="text-xs font-bold text-slate-500">دج</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>{completedOrders.length} طلبات مكتملة</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">صافي الأرباح المحققة</span>
          <div className={`text-xl sm:text-2xl font-black ${netRealizedProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {netRealizedProfit.toLocaleString()} <span className="text-xs font-bold text-slate-500">دج</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-bold">
            هامش ربح إجمالي: <strong className="text-slate-900">{profitMarginPercent}%</strong>
          </div>
        </div>

        {/* Total Costs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">إجمالي تكاليف الطلبات</span>
          <div className="text-xl sm:text-2xl font-black text-slate-700">
            {totalRealizedCost.toLocaleString()} <span className="text-xs font-bold text-slate-500">دج</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            شراء: {realizedProductCost.toLocaleString()} | إعلان: {realizedAdCost.toLocaleString()}
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">متوسط قيمة الطلب (AOV)</span>
          <div className="text-xl sm:text-2xl font-black text-sky-600">
            {averageOrderValue.toLocaleString()} <span className="text-xs font-bold text-slate-500">دج</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            {roas ? `عائد الإعلانات ROAS: ${roas}x` : 'الإعلانات: بانتظار مزيد من البيانات'}
          </div>
        </div>
      </div>

      {/* Orders Status Funnel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
          <BarChart3 className="w-4 h-4 text-slate-600" />
          <span>توزيع حالات الطلبات ومعدل الإنجاز</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 block">طلبات مكتملة</span>
              <span className="text-lg font-black text-emerald-700">{completedOrders.length}</span>
            </div>
            <span className="text-xs font-bold text-emerald-800">
              {filteredOrders.length > 0
                ? `${((completedOrders.length / filteredOrders.length) * 100).toFixed(0)}%`
                : '0%'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-800 block">قيد الانتظار</span>
              <span className="text-lg font-black text-amber-700">{pendingOrders.length}</span>
            </div>
            <span className="text-xs font-bold text-amber-800">
              {filteredOrders.length > 0
                ? `${((pendingOrders.length / filteredOrders.length) * 100).toFixed(0)}%`
                : '0%'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-800 block">ملغاة أو مرفوضة</span>
              <span className="text-lg font-black text-rose-700">{cancelledOrders.length}</span>
            </div>
            <span className="text-xs font-bold text-rose-800">
              {filteredOrders.length > 0
                ? `${((cancelledOrders.length / filteredOrders.length) * 100).toFixed(0)}%`
                : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Product-level Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>ربحية كل اشتراك على حدة (Product-Level Profitability)</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            {products.length} اشتراكات مسجلة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">الاشتراك</th>
                <th className="py-3 px-4">المبيعات المكتملة</th>
                <th className="py-3 px-4">قيد الانتظار</th>
                <th className="py-3 px-4">الإيراد المحقق</th>
                <th className="py-3 px-4">التكاليف</th>
                <th className="py-3 px-4">صافي الربح</th>
                <th className="py-3 px-4">هامش الربح %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productPerformance.map((item) => (
                <tr key={item.product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.product.name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    {item.completedCount}
                  </td>
                  <td className="py-3.5 px-4 text-amber-600 font-medium">
                    {item.pendingCount}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.revenue.toLocaleString()} دج
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.cost.toLocaleString()} دج
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                        item.profit >= 0
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.profit.toLocaleString()} دج
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    {item.margin}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
