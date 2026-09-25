import React, { useState, useMemo } from 'react';
import { AdCampaign, AdPlatform, Product, Order } from '../../types';
import { CampaignFormModal } from './CampaignFormModal';
import {
  Plus,
  Target,
  Search,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';

interface AdminAdvertisingProps {
  campaigns: AdCampaign[];
  products: Product[];
  orders: Order[];
  onSaveCampaign: (campaign: Partial<AdCampaign>) => Promise<string>;
  onDeleteCampaign: (campaignId: string) => Promise<void>;
}

export const AdminAdvertising: React.FC<AdminAdvertisingProps> = ({
  campaigns,
  products,
  orders,
  onSaveCampaign,
  onDeleteCampaign,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<AdCampaign | null>(null);

  const platformLabels: Record<AdPlatform, string> = {
    meta_ads: 'Meta Ads (FB & IG)',
    tiktok_ads: 'TikTok Ads',
    google_ads: 'Google Ads',
    influencer: 'مؤثرين / كولابوراسيون',
    other: 'أخرى',
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(term);
        const matchesNotes = (c.notes || '').toLowerCase().includes(term);
        if (!matchesName && !matchesNotes) return false;
      }
      if (platformFilter !== 'all' && c.platform !== platformFilter) {
        return false;
      }
      return true;
    });
  }, [campaigns, searchTerm, platformFilter]);

  const totalAdSpend = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + (Number(c.amountSpent) || 0), 0);
  }, [campaigns]);

  // Calculate CAC for each campaign
  // Formula: CAC = Amount Spent / Number of Completed Orders attributed to that product/campaign
  const completedOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'completed');
  }, [orders]);

  const handleEdit = (c: AdCampaign) => {
    setCampaignToEdit(c);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCampaignToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            حملات الإعلانات وتكلفة الاستحواذ (CAC)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تتبع ميزانيات إعلانات Meta Ads وحساب تكلفة الحصول على كل زبون مشتري (Customer Acquisition Cost)
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل حملة جديدة</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold block mb-1">إجمالي الصرف الإعلاني</span>
            <span className="text-lg font-black text-indigo-600">
              {totalAdSpend.toLocaleString()} دج
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold block mb-1">عدد الحملات المسجلة</span>
            <span className="text-lg font-black text-slate-900">{campaigns.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold block mb-1">الطلبات المكتملة كلياً</span>
            <span className="text-lg font-black text-emerald-600">
              {completedOrders.length} طلبات
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Attribution & CAC Guide Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-950 text-xs flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block mb-0.5">كيف يتم احتساب تكلفة الاستحواذ (CAC)؟</span>
          <p className="text-[11px] text-indigo-800">
            تُحسب تكلفة الاستحواذ عبر قسمة المبلغ المنفق على عدد الطلبات المكتملة والمؤكدة المرتبطة بالمنتج أو الحملة:{' '}
            <strong className="dir-ltr inline-block font-mono">CAC = ميزانية الحملة ÷ عدد المبيعات المكتملة</strong>.
            إذا لم تسجل مبيعات مكتملة بعد، فإن النظام لا يخترع بيانات وهمية بل يوضح أن البيانات قيد التجميع.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في اسم الحملة أو الملاحظات..."
            className="w-full pr-10 pl-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 focus:bg-white"
          />
        </div>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:border-indigo-500 focus:outline-hidden"
        >
          <option value="all">كل المنصات</option>
          {Object.entries(platformLabels).map(([pKey, label]) => (
            <option key={pKey} value={pKey}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredCampaigns.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-500">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              {campaigns.length === 0 ? 'لا توجد حملات إعلانية مسجلة بعد' : 'لا توجد نتائج مطابقة'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              سجّل حملاتك على Meta Ads (فيسبوك وإنستغرام) لتتبع أثر الإنفاق التسويقي وحساب تكلفة الزبون بدقة.
            </p>
            {campaigns.length === 0 && (
              <button
                type="button"
                onClick={handleAddNew}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                تسجيل أول حملة
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">اسم الحملة</th>
                  <th className="py-3.5 px-4">المنصة</th>
                  <th className="py-3.5 px-4">المبلغ المنفق</th>
                  <th className="py-3.5 px-4">المنتج المرتبط</th>
                  <th className="py-3.5 px-4">المبيعات المكتملة</th>
                  <th className="py-3.5 px-4">تكلفة الاستحواذ (CAC)</th>
                  <th className="py-3.5 px-4">الفترة</th>
                  <th className="py-3.5 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.map((camp) => {
                  const linkedProd = products.find((p) => p.id === camp.productId);
                  
                  // Count completed orders attributed to this product
                  const matchingOrders = completedOrders.filter(
                    (o) => (camp.productId ? o.productId === camp.productId : true)
                  );
                  const completedSalesCount = matchingOrders.length;
                  const cac = completedSalesCount > 0 ? (camp.amountSpent / completedSalesCount).toFixed(0) : null;

                  return (
                    <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{camp.name}</div>
                        {camp.notes && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{camp.notes}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px] border border-indigo-100">
                          {platformLabels[camp.platform] || camp.platform}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                        {Number(camp.amountSpent).toLocaleString()} دج
                      </td>

                      <td className="py-3.5 px-4 text-[11px]">
                        {linkedProd ? (
                          <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100 font-medium">
                            {linkedProd.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">كل المنتجات</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {completedSalesCount} مبيعات
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        {cac !== null ? (
                          <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {Number(cac).toLocaleString()} دج / زبون
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            بانتظار مبيعات مكتملة
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        <div>{camp.startDate}</div>
                        {camp.endDate && <div className="text-slate-400">إلى {camp.endDate}</div>}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(camp)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('هل أنت متأكد من حذف هذه الحملة الإعلانية؟')) {
                                onDeleteCampaign(camp.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CampaignFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveCampaign}
        campaignToEdit={campaignToEdit}
        products={products}
      />
    </div>
  );
};
