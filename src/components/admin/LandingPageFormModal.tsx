import React, { useState } from 'react';
import { LandingPage, Product } from '../../types';
import { X, Plus, Trash2, Globe, Sparkles, Check, AlertCircle } from 'lucide-react';

interface LandingPageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (page: Partial<LandingPage>) => Promise<string>;
  pageToEdit?: LandingPage | null;
  products: Product[];
}

export const LandingPageFormModal: React.FC<LandingPageFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pageToEdit,
  products,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(pageToEdit);
  const [name, setName] = useState(pageToEdit?.name || '');
  const [slug, setSlug] = useState(pageToEdit?.slug || '');
  const [active, setActive] = useState<boolean>(pageToEdit ? pageToEdit.active : true);
  const [productId, setProductId] = useState(pageToEdit?.productId || (products[0]?.id || ''));
  const [planId, setPlanId] = useState(pageToEdit?.planId || '');
  const [heroTitle, setHeroTitle] = useState(
    pageToEdit?.heroTitle || 'احصل على اشتراك رسمي ومضمون 100% بأفضل سعر في الجزائر'
  );
  const [heroDescription, setHeroDescription] = useState(
    pageToEdit?.heroDescription || 'تفعيل فوري وسريع على بريدك الإلكتروني الشخصي مع ضمان كامل المدة ودعم فني متواصل عبر إنستغرام.'
  );
  const [badgeText, setBadgeText] = useState(pageToEdit?.badgeText || 'عرض خاص ومحدود');
  const [imageUrl, setImageUrl] = useState(pageToEdit?.imageUrl || '');
  const [ctaText, setCtaText] = useState(pageToEdit?.ctaText || 'اطلب الآن عبر Instagram');
  const [benefits, setBenefits] = useState<string[]>(
    pageToEdit?.benefits && pageToEdit.benefits.length > 0
      ? pageToEdit.benefits
      : ['تفعيل فوري خلال 15 - 30 دقيقة', 'حساب رسمي وخاص بك', 'ضمان استقرار كامل المدة']
  );
  const [newBenefit, setNewBenefit] = useState('');
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>(
    pageToEdit?.faq && pageToEdit.faq.length > 0
      ? pageToEdit.faq
      : [
          { question: 'كيف يتم تفعيل الاشتراك بعد الطلب؟', answer: 'نقوم بتفعيل الاشتراك مباشرة على إيميلك الشخصي بعد إرسال إثبات الدفع عبر رسائل إنستغرام.' },
          { question: 'ما هي طرق الدفع المتاحة؟', answer: 'نقبل الدفع عبر بريدي موب (BaridiMob) والحساب البريدي الجاري (CCP).' },
        ]
  );
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === productId);

  // Auto slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && (!slug || slug === '')) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\u0621-\u064A]/g, '-')
          .replace(/-+/g, '-')
      );
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const handleAddFaq = () => {
    if (newQ.trim() && newA.trim()) {
      setFaq([...faq, { question: newQ.trim(), answer: newA.trim() }]);
      setNewQ('');
      setNewA('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('يرجى إدخال عنوان صفحة الهبوط.');
      return;
    }
    if (!slug.trim()) {
      setError('يرجى تحديد الرابط المختصر (slug).');
      return;
    }
    if (!productId) {
      setError('يرجى اختيار المنتج المرتبط بهذه الصفحة.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...(pageToEdit?.id ? { id: pageToEdit.id } : {}),
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9\-]/g, '-'),
        active,
        productId,
        planId: planId.trim() ? planId.trim() : undefined,
        heroTitle: heroTitle.trim(),
        heroDescription: heroDescription.trim(),
        badgeText: badgeText.trim() || '',
        imageUrl: imageUrl.trim() || '',
        benefits,
        features: selectedProduct?.features || [],
        faq,
        ctaText: ctaText.trim() || 'اطلب الآن عبر Instagram',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ صفحة الهبوط.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-600" />
            <span>{isEditing ? 'تعديل صفحة الهبوط' : 'إنشاء صفحة هبوط مخصصة جديدة'}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">عنوان الصفحة (داخلي) *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="مثلاً: صفحة هبوط Canva Pro"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">الرابط المختصر (Slug) *</label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-sky-500">
                <span className="px-3 text-slate-400 text-[11px] font-mono dir-ltr select-none">
                  /
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, '-'))}
                  placeholder="canva-pro"
                  className="w-full py-2.5 pl-3 text-slate-900 font-mono text-xs bg-transparent focus:outline-hidden dir-ltr"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">المنتج المرتبط *</label>
              <select
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value);
                  setPlanId('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:border-sky-500 focus:outline-hidden bg-white"
                required
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.plans?.length || 0} خطط)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">الخطة الافتراضية المحددة</label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 focus:border-sky-500 focus:outline-hidden bg-white"
              >
                <option value="">أول خطة متوفرة</option>
                {selectedProduct?.plans?.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.duration} — {pl.price} دج
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">الشارة الترويجية (Badge)</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="مثلاً: عرض ترويجي حصري"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">نص زر الطلب (CTA)</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="اطلب الآن عبر Instagram"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">العنوان الرئيسي (Hero Title)</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">الوصف الفرعي (Hero Description)</label>
            <textarea
              rows={2}
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-sky-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">الفوائد والضمانات البارزة</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBenefit();
                  }
                }}
                placeholder="أضف ميزة أو ضمان..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
              >
                إضافة
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {benefits.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] text-slate-800"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{b}</span>
                  <button
                    type="button"
                    onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-rose-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">الأسئلة الشائعة لهذه الصفحة</label>
            <div className="space-y-2 mb-2">
              {faq.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl relative text-[11px]">
                  <div className="font-bold text-slate-900 mb-0.5">س: {item.question}</div>
                  <div className="text-slate-600">ج: {item.answer}</div>
                  <button
                    type="button"
                    onClick={() => setFaq(faq.filter((_, i) => i !== idx))}
                    className="absolute top-2 left-2 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2">
              <input
                type="text"
                value={newQ}
                onChange={(e) => setNewQ(e.target.value)}
                placeholder="السؤال..."
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newA}
                  onChange={(e) => setNewA(e.target.value)}
                  placeholder="الإجابة..."
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeLp"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor="activeLp" className="text-xs font-bold text-slate-700 cursor-pointer">
              الصفحة منشورة ونشطة لاستقبال الزوار والطلبات
            </label>
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
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors shadow-xs disabled:opacity-50"
            >
              {saving ? 'جارٍ الحفظ...' : isEditing ? 'تحديث صفحة الهبوط' : 'نشر صفحة الهبوط'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
