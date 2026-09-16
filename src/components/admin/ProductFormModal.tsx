import React, { useState, useEffect } from 'react';
import { Product, ProductPlan, Category } from '../../types';
import { X, Plus, Trash2, Check, AlertCircle, Image, Sparkles } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => Promise<void>;
  productToEdit?: Product | null;
  categories: Category[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(productToEdit);

  // Form states
  const [name, setName] = useState(productToEdit?.name || '');
  const [slug, setSlug] = useState(productToEdit?.slug || '');
  const [category, setCategory] = useState(productToEdit?.category || (categories[0]?.name || 'تصميم'));
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [imageUrl, setImageUrl] = useState(productToEdit?.imageUrl || productToEdit?.image || '');
  const [price, setPrice] = useState<number | string>(productToEdit?.price ?? 600);
  const [currency, setCurrency] = useState(productToEdit?.currency || 'دج');
  const [duration, setDuration] = useState(productToEdit?.duration || 'شهري');
  const [features, setFeatures] = useState<string[]>(
    productToEdit?.features && productToEdit.features.length > 0
      ? productToEdit.features
      : ['تفعيل فوري وآمن', 'دعم فني وضمان كامل']
  );
  const [newFeatureText, setNewFeatureText] = useState('');
  const [available, setAvailable] = useState<boolean>(productToEdit ? productToEdit.available : true);
  const [popular, setPopular] = useState<boolean>(productToEdit?.popular || false);
  const [displayOrder, setDisplayOrder] = useState<number>(productToEdit?.displayOrder ?? 1);
  const [guarantee, setGuarantee] = useState(productToEdit?.guarantee || 'ضمان استقرار كامل المدة');
  const [activationTime, setActivationTime] = useState(productToEdit?.activationTime || 'خلال 15 - 30 دقيقة');
  const [orderCtaText, setOrderCtaText] = useState(productToEdit?.orderCtaText || 'اطلب الآن');

  // Plans state
  const [plans, setPlans] = useState<ProductPlan[]>(
    productToEdit?.plans && productToEdit.plans.length > 0
      ? productToEdit.plans
      : [
          { id: 'p1', duration: 'شهري', price: 600, available: true, popular: false },
          { id: 'p2', duration: '3 أشهر', price: 1600, available: true, popular: false },
          { id: 'p3', duration: '6 أشهر', price: 2900, available: true, popular: true, note: 'الأكثر طلباً' },
          { id: 'p4', duration: 'عام', price: 4900, available: true, popular: false, note: 'توفير أكبر' },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-generate slug from name if slug is empty
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && (!slug || slug === '')) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-zA-Z0-9\u0621-\u064A]/g, '-')
          .replace(/-+/g, '-')
      );
    }
  };

  // Add Feature
  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Add Plan
  const handleAddPlan = () => {
    const newPlan: ProductPlan = {
      id: `plan_${Date.now()}`,
      duration: 'مدة جديدة',
      price: Number(price) || 500,
      currency,
      available: true,
      popular: false,
    };
    setPlans([...plans, newPlan]);
  };

  // Update Plan
  const handleUpdatePlan = (index: number, field: keyof ProductPlan, value: any) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
  };

  // Remove Plan
  const handleRemovePlan = (index: number) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('اسم الاشتراك مطلوب.');
      return;
    }

    if (plans.length === 0) {
      setFormError('يرجى إضافة خطة اشتراك واحدة على الأقل.');
      return;
    }

    const payload: Partial<Product> = {
      ...(productToEdit?.id ? { id: productToEdit.id } : {}),
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'),
      category,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      image: imageUrl.trim(),
      price: Number(price) || 0,
      currency: currency.trim() || 'دج',
      duration: duration.trim() || 'شهري',
      features,
      available,
      popular,
      displayOrder: Number(displayOrder) || 1,
      guarantee: guarantee.trim(),
      activationTime: activationTime.trim(),
      orderCtaText: orderCtaText.trim() || 'اطلب الآن',
      plans,
    };

    try {
      setSaving(true);
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'حدث خطأ أثناء حفظ الاشتراك.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isEditing ? `تعديل الاشتراك: ${productToEdit?.name}` : 'إضافة اشتراك رقمي جديد'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              سيتم تحديث المتجر فوراً بعد الضغط على حفظ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {formError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Basic Info Section */}
          <div>
            <h4 className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المعلومات الأساسية</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم الاشتراك *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="مثلاً: Canva Pro"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المعرّف (Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="canva-pro"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-hidden dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  التصنيف (Category)
                </label>
                <div className="flex gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-hidden bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ترتيب العرض في الموقع (Display Order)
                </label>
                <input
                  type="number"
                  min="1"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الوصف التسويقي للخدمة
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف مختصر ومقنع لمميزات الحساب وكيفية الاستفادة منه..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Image URL & Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-slate-500" />
              <span>رابط صورة أو شعار الخدمة (Image URL)</span>
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... أو رابط شعار الخدمة"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-hidden dir-ltr text-left"
              />
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                ) : (
                  <Image className="w-5 h-5 text-slate-300" />
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              إذا تركت الحقل فارغاً سيتم استخدام أيقونة افتراضية عصرية خاصة بـ Yovo.
            </p>
          </div>

          {/* Pricing & Duration Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                السعر الافتراضي الأساسي (DA) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm font-bold focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                العملة
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المدة الافتراضية
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="شهري / سنوي"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Multiple Plans Manager */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  خطط ومدد الاشتراك المتعددة (Plans)
                </h4>
                <p className="text-[11px] text-slate-500">
                  يمكن للزبون التبديل بين هذه المدد ورؤية السعر يتغير ديناميكياً
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPlan}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة مدة/خطة</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {plans.map((plan, idx) => (
                <div
                  key={plan.id || idx}
                  className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap sm:flex-nowrap items-center gap-2.5 text-xs shadow-xs"
                >
                  <div className="w-full sm:w-1/4">
                    <label className="text-[10px] text-slate-400 block mb-0.5">المدة</label>
                    <input
                      type="text"
                      value={plan.duration}
                      onChange={(e) => handleUpdatePlan(idx, 'duration', e.target.value)}
                      placeholder="شهري / عام"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div className="w-1/2 sm:w-1/4">
                    <label className="text-[10px] text-slate-400 block mb-0.5">السعر (دج)</label>
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handleUpdatePlan(idx, 'price', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 text-xs font-bold"
                    />
                  </div>

                  <div className="w-1/2 sm:w-1/4">
                    <label className="text-[10px] text-slate-400 block mb-0.5">شارة تمييزية (اختياري)</label>
                    <input
                      type="text"
                      value={plan.note || ''}
                      onChange={(e) => handleUpdatePlan(idx, 'note', e.target.value)}
                      placeholder="الأكثر طلباً / توفير"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-2 sm:mt-4">
                    <label className="flex items-center gap-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={plan.available !== false}
                        onChange={(e) => handleUpdatePlan(idx, 'available', e.target.checked)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-[11px] text-slate-600">متوفر</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemovePlan(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف الخطة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              مميزات الاشتراك (تظهر في البطاقة والنافذة)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="أضف ميزة جديدة واضغط إضافة..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                إضافة
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-slate-400 hover:text-rose-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Guarantees & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نص الضمان الخاص بالمنتج
              </label>
              <input
                type="text"
                value={guarantee}
                onChange={(e) => setGuarantee(e.target.value)}
                placeholder="ضمان استقرار كامل المدة"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                وقت التفعيل المقدر
              </label>
              <input
                type="text"
                value={activationTime}
                onChange={(e) => setActivationTime(e.target.value)}
                placeholder="خلال 15 - 30 دقيقة"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">الاشتراك متوفر للطلب (Active)</span>
                <span className="text-[11px] text-slate-500">
                  إذا تم إلغاؤه، يظهر "غير متوفر حالياً" ويتعطل زر الطلب.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">شارة "الأكثر طلباً" (Popular)</span>
                <span className="text-[11px] text-slate-500">
                  إبراز الاشتراك ببادج خاص في الكتالوج.
                </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'جارٍ الحفظ...' : 'حفظ الاشتراك'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
