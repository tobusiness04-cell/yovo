import React, { useState } from 'react';
import { LandingPage, Product } from '../../types';
import { LandingPageFormModal } from './LandingPageFormModal';
import {
  Plus,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface AdminLandingPagesProps {
  landingPages: LandingPage[];
  products: Product[];
  onSaveLandingPage: (page: Partial<LandingPage>) => Promise<string>;
  onDeleteLandingPage: (pageId: string) => Promise<void>;
  onToggleStatus: (pageId: string, currentActive: boolean) => Promise<void>;
}

export const AdminLandingPages: React.FC<AdminLandingPagesProps> = ({
  landingPages,
  products,
  onSaveLandingPage,
  onDeleteLandingPage,
  onToggleStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState<LandingPage | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleOpenPage = (slug: string) => {
    window.location.href = `/${slug}`;
  };

  const handleEdit = (page: LandingPage) => {
    setPageToEdit(page);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setPageToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            صفحات الهبوط المخصصة (Landing Pages)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            إنشاء صفحات هبوط خاصة لكل اشتراك على حدة لربطها بحملات Meta Ads وزيادة معدل التحويل
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء صفحة هبوط جديدة</span>
        </button>
      </div>

      {/* Pages Grid */}
      {landingPages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-sky-600 border border-sky-100">
            <Globe className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            لا توجد صفحات هبوط مخصصة حتى الآن
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
            صفحات الهبوط تساعدك على توجيه إعلانات إنستغرام وفيسبوك مباشرة إلى صفحة بيع مخصصة لكل منتج (مثل: <code className="bg-slate-100 px-1 py-0.5 rounded dir-ltr text-sky-700">/canva-pro</code>) مع تحديث الأسعار ديناميكياً من المخزن.
          </p>
          <button
            type="button"
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            إنشاء أول صفحة هبوط
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {landingPages.map((lp) => {
            const linkedProd = products.find((p) => p.id === lp.productId);

            return (
              <div
                key={lp.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col justify-between hover:border-sky-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lp.active
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {lp.active ? 'نشطة ومباشرة' : 'معطلة'}
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggleStatus(lp.id, lp.active)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title={lp.active ? 'تعطيل الصفحة' : 'تفعيل الصفحة'}
                    >
                      {lp.active ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mb-1">{lp.name}</h3>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-sky-600 bg-sky-50/60 px-2 py-1 rounded-lg border border-sky-100 dir-ltr mb-3">
                    <span className="truncate">/{lp.slug}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(lp.slug)}
                      className="ml-auto text-slate-400 hover:text-sky-600"
                      title="نسخ الرابط"
                    >
                      {copiedSlug === lp.slug ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1 mb-4">
                    <div>
                      المنتج: <strong className="text-slate-800">{linkedProd?.name || 'غير محدد'}</strong>
                    </div>
                    {linkedProd?.price && (
                      <div>
                        السعر الحالي:{' '}
                        <strong className="text-emerald-700">
                          {Number(linkedProd.price).toLocaleString()} {linkedProd.currency}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenPage(lp.slug)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold transition-colors"
                      title="معاينة الصفحة"
                    >
                      <span>زيارة</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(lp)}
                      className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من حذف صفحة الهبوط هذه؟')) {
                          onDeleteLandingPage(lp.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <LandingPageFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveLandingPage}
        pageToEdit={pageToEdit}
        products={products}
      />
    </div>
  );
};
