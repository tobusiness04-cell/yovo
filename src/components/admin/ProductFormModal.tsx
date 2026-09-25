import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductPlan, Category } from '../../types';
import { X, Plus, Trash2, Check, AlertCircle, Image as ImageIcon, Sparkles, Upload, RefreshCw, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { compressAndOptimizeImage, formatFileSize } from '../../lib/imageUtils';

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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageUploadInfo, setImageUploadInfo] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processImageFile = async (file: File) => {
    try {
      setIsProcessingImage(true);
      setFormError(null);
      const result = await compressAndOptimizeImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
      });
      setImageUrl(result.dataUrl);
      setImageUploadInfo(`تم تجهيز الصورة بنجاح (${formatFileSize(result.sizeBytes)} • ${result.width}×${result.height}px)`);
    } catch (err: any) {
      setFormError(err.message || 'فشل تحميل الصورة من الجهاز.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };
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
  
  // Cost & Profit Margins
  const [purchaseCost, setPurchaseCost] = useState<number>(productToEdit?.purchaseCost ?? 0);
  const [adCost, setAdCost] = useState<number>(productToEdit?.adCost ?? 0);
  const [otherCosts, setOtherCosts] = useState<number>(productToEdit?.otherCosts ?? 0);
  const [targetMargin, setTargetMargin] = useState<number>(productToEdit?.targetMargin ?? 40);

  // Plans state
  const [plans, setPlans] = useState<ProductPlan[]>(
    productToEdit?.plans && productToEdit.plans.length > 0
      ? productToEdit.plans
      : [
          { id: 'p1', duration: 'شهري', price: 600, available: true, popular: false, purchaseCost: 200 },
          { id: 'p2', duration: '3 أشهر', price: 1600, available: true, popular: false, purchaseCost: 500 },
          { id: 'p3', duration: '6 أشهر', price: 2900, available: true, popular: true, note: 'الأكثر طلباً', purchaseCost: 900 },
          { id: 'p4', duration: 'عام', price: 4900, available: true, popular: false, note: 'توفير أكبر', purchaseCost: 1500 },
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
      purchaseCost: Number(purchaseCost) || 0,
      adCost: Number(adCost) || 0,
      otherCosts: Number(otherCosts) || 0,
      targetMargin: Number(targetMargin) || 40,
      plans: plans.map((p) => ({
        ...p,
        price: Number(p.price) || 0,
        purchaseCost: p.purchaseCost !== undefined ? Number(p.purchaseCost) : undefined,
        adCost: p.adCost !== undefined ? Number(p.adCost) : undefined,
        otherCost: p.otherCost !== undefined ? Number(p.otherCost) : undefined,
      })),
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

          {/* Product Image Section (Upload from Device or URL) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Hidden native file input for mobile and desktop */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-sky-600" />
                <span>صورة أو شعار المنتج</span>
              </label>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{showUrlInput ? 'إخفاء الرابط المباشر' : 'أو استخدام رابط مباشر (URL)'}</span>
              </button>
            </div>

            {/* Active Image Preview Container (if image already exists or uploaded) */}
            {imageUrl ? (
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                {/* Thumbnail Preview */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0 flex items-center justify-center shadow-xs">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                  {isProcessingImage && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Details & Actions */}
                <div className="flex-1 text-center sm:text-right w-full">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 mb-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{imageUrl.startsWith('data:') ? 'صورة مرفوعة من جهازك' : 'صورة مرتبطة'}</span>
                  </div>

                  {imageUploadInfo && (
                    <p className="text-xs text-slate-500 mb-2 font-mono">
                      {imageUploadInfo}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    ستظهر هذه الصورة في واجهة المتجر وبطاقة تفاصيل المنتج لدى الزبائن.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      disabled={isProcessingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>تغيير الصورة من جهازي</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setImageUploadInfo(null);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف الصورة</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Drag & Drop / Click to Upload Box (When no image is set) */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-sky-500 bg-sky-50/80 scale-[1.01]'
                    : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/50'
                }`}
              >
                {isProcessingImage ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mb-2" />
                    <span className="text-xs font-bold text-slate-800">جاري ضغط ومعالجة الصورة من جهازك...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 shadow-2xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 mb-1">
                      اضغط لاختيار صورة من جهازك أو اسحبها إلى هنا
                    </span>
                    <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-3">
                      يدعم صور PNG, JPG, JPEG, WEBP, SVG من الهاتف أو الحاسوب. يتم ضغط الصورة تلقائياً لسرعة التصفح.
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>اختيار ملف من الجهاز</span>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Optional URL Input if toggled */}
            {showUrlInput && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  أو الصق رابط صورة مباشر (URL):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageUploadInfo(null);
                    }}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden dir-ltr text-left bg-white"
                  />
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-400 mt-2 text-right">
              ملاحظة: إذا لم تقم برفع صورة، سيعرض المتجر تلقائياً الأيقونة والشعار الرقمي الرسمي للخدمة.
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

          {/* Default Product Cost & Profit Margin */}
          <div className="border border-emerald-200/80 bg-emerald-50/40 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>التكاليف الافتراضية وهامش الربح المستهدف</span>
                </h4>
                <p className="text-[11px] text-emerald-700/80">
                  تُستخدم لحساب صافي الأرباح تلقائياً عند إنشاء الطلبات وتحديد الأسعار الموصى بها
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  تكلفة الشراء الافتراضية (دج)
                </label>
                <input
                  type="number"
                  min="0"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(Number(e.target.value))}
                  placeholder="مثلاً: 250"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  تكلفة الإعلان التقديرية (دج)
                </label>
                <input
                  type="number"
                  min="0"
                  value={adCost}
                  onChange={(e) => setAdCost(Number(e.target.value))}
                  placeholder="مثلاً: 100"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  تكاليف أخرى تقديرية (دج)
                </label>
                <input
                  type="number"
                  min="0"
                  value={otherCosts}
                  onChange={(e) => setOtherCosts(Number(e.target.value))}
                  placeholder="مثلاً: 20"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  هامش الربح المستهدف (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  placeholder="مثلاً: 40"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Multiple Plans Manager */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  خطط ومدد الاشتراك والتكاليف المخصصة (Plans & Costs)
                </h4>
                <p className="text-[11px] text-slate-500">
                  حدد سعر البيع وتكلفة الشراء لكل مدة لحساب الربحية على مستوى كل خطة
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

            <div className="space-y-3">
              {plans.map((plan, idx) => {
                const planPrice = Number(plan.price) || 0;
                const pCost = plan.purchaseCost !== undefined ? Number(plan.purchaseCost) : purchaseCost;
                const aCost = plan.adCost !== undefined ? Number(plan.adCost) : adCost;
                const oCost = plan.otherCost !== undefined ? Number(plan.otherCost) : otherCosts;
                const planTotalCost = pCost + aCost + oCost;
                const planProfit = planPrice - planTotalCost;
                const planMargin = planPrice > 0 ? ((planProfit / planPrice) * 100).toFixed(0) : '0';

                return (
                  <div
                    key={plan.id || idx}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5 shadow-xs"
                  >
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 text-xs">
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
                        <label className="text-[10px] text-slate-400 block mb-0.5">سعر البيع (دج)</label>
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

                    {/* Plan-level Costs & Margin Preview */}
                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500">تكلفة الشراء:</span>
                          <input
                            type="number"
                            min="0"
                            value={plan.purchaseCost ?? ''}
                            onChange={(e) =>
                              handleUpdatePlan(
                                idx,
                                'purchaseCost',
                                e.target.value === '' ? undefined : Number(e.target.value)
                              )
                            }
                            placeholder={String(purchaseCost)}
                            className="w-20 px-2 py-0.5 text-[11px] rounded border border-slate-200 bg-white"
                          />
                          <span className="text-[10px] text-slate-400">دج</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500">تكلفة الإعلان:</span>
                          <input
                            type="number"
                            min="0"
                            value={plan.adCost ?? ''}
                            onChange={(e) =>
                              handleUpdatePlan(
                                idx,
                                'adCost',
                                e.target.value === '' ? undefined : Number(e.target.value)
                              )
                            }
                            placeholder={String(adCost)}
                            className="w-20 px-2 py-0.5 text-[11px] rounded border border-slate-200 bg-white"
                          />
                          <span className="text-[10px] text-slate-400">دج</span>
                        </div>
                      </div>

                      {/* Profitability Calculation Badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">
                          التكلفة الإجمالية: <strong className="text-slate-800">{planTotalCost.toLocaleString()} دج</strong>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            planProfit >= 0
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          ربح: {planProfit.toLocaleString()} دج ({planMargin}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
