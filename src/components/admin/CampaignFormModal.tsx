import React, { useState } from 'react';
import { AdCampaign, AdPlatform, Product } from '../../types';
import { X, Target, Calendar, DollarSign, AlertCircle } from 'lucide-react';

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Partial<AdCampaign>) => Promise<string>;
  campaignToEdit?: AdCampaign | null;
  products: Product[];
}

export const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  campaignToEdit,
  products,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(campaignToEdit);
  const [name, setName] = useState(campaignToEdit?.name || '');
  const [platform, setPlatform] = useState<AdPlatform>(campaignToEdit?.platform || 'meta_ads');
  const [productId, setProductId] = useState(campaignToEdit?.productId || '');
  const [amountSpent, setAmountSpent] = useState<number | string>(campaignToEdit?.amountSpent ?? '');
  const [startDate, setStartDate] = useState(campaignToEdit?.startDate || new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(campaignToEdit?.endDate || '');
  const [notes, setNotes] = useState(campaignToEdit?.notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platforms: { id: AdPlatform; label: string }[] = [
    { id: 'meta_ads', label: 'Meta Ads (Facebook & Instagram)' },
    { id: 'tiktok_ads', label: 'TikTok Ads' },
    { id: 'google_ads', label: 'Google Ads' },
    { id: 'influencer', label: 'إعلانات المؤثرين / صناع المحتوى' },
    { id: 'other', label: 'منصة تسويقية أخرى' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('يرجى إدخال اسم الحملة الإعلانية.');
      return;
    }

    const numAmount = Number(amountSpent);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('يرجى إدخال ميزانية إعلانية صحيحة أكبر من صفر.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...(campaignToEdit?.id ? { id: campaignToEdit.id } : {}),
        name: name.trim(),
        platform,
        productId: productId || undefined,
        amountSpent: numAmount,
        startDate,
        endDate: endDate || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الحملة الإعلانية.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>{isEditing ? 'تعديل الحملة الإعلانية' : 'تسجيل حملة إعلانية جديدة'}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">اسم الحملة الإعلانية *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: حملة كانفا برو + كاب كات - فيسبوك وإنستغرام"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">المنصة الإعلانية *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as AdPlatform)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:border-sky-500 focus:outline-hidden bg-white"
              >
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">المنتج المستهدف (اختياري)</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 focus:border-sky-500 focus:outline-hidden bg-white"
              >
                <option value="">حملة عامة للمتجر</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">المبلغ المنفق (دج) *</label>
              <input
                type="number"
                min="1"
                value={amountSpent}
                onChange={(e) => setAmountSpent(e.target.value)}
                placeholder="5000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:border-sky-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">تاريخ البدء *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">تاريخ الانتهاء</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">ملاحظات وجمهور الحملة</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: استهداف مصممي الجرافيك والطلاب في الجزائر، ميزانية يومية 1000 دج..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-xs disabled:opacity-50"
            >
              {saving ? 'جارٍ الحفظ...' : isEditing ? 'تحديث الحملة' : 'حفظ الحملة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
