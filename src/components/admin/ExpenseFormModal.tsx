import React, { useState } from 'react';
import { Expense, ExpenseCategory, Product, AdCampaign } from '../../types';
import { X, DollarSign, Calendar, Tag, FileText, Check, AlertCircle } from 'lucide-react';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Partial<Expense>) => Promise<string>;
  expenseToEdit?: Expense | null;
  products: Product[];
  campaigns: AdCampaign[];
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  expenseToEdit,
  products,
  campaigns,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(expenseToEdit);
  const [description, setDescription] = useState(expenseToEdit?.description || '');
  const [amount, setAmount] = useState<number | string>(expenseToEdit?.amount ?? '');
  const [category, setCategory] = useState<ExpenseCategory>(expenseToEdit?.category || 'product_purchase');
  const [date, setDate] = useState(expenseToEdit?.date || new Date().toISOString().slice(0, 10));
  const [productId, setProductId] = useState(expenseToEdit?.productId || '');
  const [campaignId, setCampaignId] = useState(expenseToEdit?.campaignId || '');
  const [notes, setNotes] = useState(expenseToEdit?.notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: { id: ExpenseCategory; label: string }[] = [
    { id: 'product_purchase', label: 'شراء اشتراكات ومنتجات' },
    { id: 'advertising', label: 'إعلانات وحملات تسويقية' },
    { id: 'payment_fees', label: 'رسوم وعمولات دفع' },
    { id: 'domain_hosting', label: 'دومين واستضافة وسيرفرات' },
    { id: 'software', label: 'أدوات وبرمجيات مساعدة' },
    { id: 'other', label: 'مصاريف أخرى عامة' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('يرجى إدخال وصف المصروف.');
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('يرجى إدخال مبلغ صحيح أكبر من صفر.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...(expenseToEdit?.id ? { id: expenseToEdit.id } : {}),
        description: description.trim(),
        amount: numAmount,
        category,
        date,
        productId: productId || undefined,
        campaignId: campaignId || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ المصروف.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-rose-600" />
            <span>{isEditing ? 'تعديل المصروف' : 'تسجيل مصروف جديد'}</span>
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
            <label className="block text-slate-700 font-bold mb-1">وصف المصروف *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثلاً: شراء 10 حسابات Canva سنوية من المورد"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">المبلغ (دج) *</label>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="2500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:border-sky-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">التاريخ *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">تصنيف المصروف *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:border-sky-500 focus:outline-hidden bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                مرتبط بمنتج محدد (اختياري)
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 focus:border-sky-500 focus:outline-hidden bg-white"
              >
                <option value="">مصروف عام (غير مرتبط)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                مرتبط بحملة إعلانية (اختياري)
              </label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 focus:border-sky-500 focus:outline-hidden bg-white"
              >
                <option value="">غير مرتبط بحملة</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">ملاحظات إضافية</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي تفاصيل حول وسيلة الدفع أو المورد..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
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
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-xs disabled:opacity-50"
            >
              {saving ? 'جارٍ الحفظ...' : isEditing ? 'تحديث المصروف' : 'حفظ المصروف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
