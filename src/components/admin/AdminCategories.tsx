import React, { useState } from 'react';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Tag, Check } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AdminCategoriesProps {
  categories: Category[];
  onSaveCategory: (category: Partial<Category>) => Promise<string>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [available, setAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setCategoryToEdit(null);
    setName('');
    setSlug('');
    setDisplayOrder(categories.length + 1);
    setAvailable(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setCategoryToEdit(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDisplayOrder(cat.displayOrder);
    setAvailable(cat.available);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      const payload: Partial<Category> = {
        ...(categoryToEdit?.id ? { id: categoryToEdit.id } : {}),
        name: name.trim(),
        slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'),
        displayOrder: Number(displayOrder) || 1,
        available,
      };

      await onSaveCategory(payload);
      showToast(categoryToEdit ? 'تم تحديث التصنيف' : 'تم إضافة التصنيف');
      setIsModalOpen(false);
    } catch (e: any) {
      alert('خطأ أثناء حفظ التصنيف: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setSaving(true);
      await onDeleteCategory(categoryToDelete.id);
      showToast('تم حذف التصنيف بنجاح');
      setCategoryToDelete(null);
    } catch (e: any) {
      alert('خطأ أثناء الحذف: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            إدارة تصنيفات الاشتراكات
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تنظيم وفلترة الاشتراكات في الصفحة الرئيسية للمتجر
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تصنيف جديد</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                  <span>#{cat.displayOrder}</span>
                  <span>•</span>
                  <span>{cat.slug}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenEdit(cat)}
                className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                title="تعديل"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCategoryToDelete(cat)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-slate-900 mb-4">
              {categoryToEdit ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم التصنيف *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: ذكاء اصطناعي AI"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المعرّف باللاتينية (Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ai / design / video"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  min="1"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl disabled:opacity-50"
                >
                  {saving ? 'جارٍ الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={Boolean(categoryToDelete)}
        title="هل أنت متأكد من حذف هذا التصنيف؟"
        message={categoryToDelete ? `سيتم حذف تصنيف "${categoryToDelete.name}".` : ''}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={saving}
      />

    </div>
  );
};
