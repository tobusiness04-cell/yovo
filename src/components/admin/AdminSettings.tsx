import React, { useState } from 'react';
import { StoreConfig, SocialPlatform } from '../../types';
import { Save, Check, Settings, ShieldCheck, FileText, Share2, MessageSquare, Copy, RotateCcw } from 'lucide-react';
import { defaultSocialPlatforms, DEFAULT_ORDER_MESSAGE_TEMPLATE, generateOrderMessage, buildWhatsAppOrderUrl, isWhatsAppPlatform } from '../../config';
import { SocialPlatformsManager } from './SocialPlatformsManager';
import { SocialIcon } from '../common/SocialIcon';

interface AdminSettingsProps {
  settings: StoreConfig;
  onSaveSettings: (settings: Partial<StoreConfig>) => Promise<void>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [brandName, setBrandName] = useState(settings.brandName || 'Yovo');
  const [brandTagline, setBrandTagline] = useState(settings.brandTagline || 'اشتراكات رقمية وخدمات Premium في بلاصة وحدة');
  const [currency, setCurrency] = useState(settings.currency || 'دج');
  const [orderMessageTemplate, setOrderMessageTemplate] = useState(
    settings.orderMessageTemplate || DEFAULT_ORDER_MESSAGE_TEMPLATE
  );
  const [guaranteeGeneralText, setGuaranteeGeneralText] = useState(
    settings.guaranteeGeneralText || 'شروط الضمان تختلف حسب الخدمة والاشتراك، ويتم توضيحها ومتابعتها خطوة بخطوة قبل تأكيد الطلب.'
  );
  const [footerText, setFooterText] = useState(
    settings.footerText || 'اشتراكات رقمية وخدمات Premium في بلاصة وحدة.'
  );
  const [independentBrandNotice, setIndependentBrandNotice] = useState(
    settings.independentBrandNotice ||
      'Yovo علامة مستقلة. جميع أسماء المنتجات والماركات التجارية المذكورة (مثل Canva، CapCut، وغيرها) ملك لأصحابها ولا ندّعي أي شراكة أو تمثيل رسمي.'
  );

  // WhatsApp direct phone state
  const [whatsappPhone, setWhatsappPhone] = useState(() => {
    if (settings.whatsappPhone) return settings.whatsappPhone;
    if (settings.whatsappDisplay && !settings.whatsappDisplay.includes('http')) return settings.whatsappDisplay;
    const wa = (settings.socialPlatforms || []).find((p) => isWhatsAppPlatform(p));
    if (wa?.url) {
      const digits = wa.url.replace(/[^\d]/g, '');
      if (digits.includes('549759489')) return '0549 75 94 89';
    }
    return '0549 75 94 89';
  });

  // Social platforms state
  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>(() => {
    if (Array.isArray(settings.socialPlatforms) && settings.socialPlatforms.length > 0) {
      return settings.socialPlatforms.map((p) => {
        if (isWhatsAppPlatform(p)) {
          return {
            ...p,
            icon: 'whatsapp' as const,
            url: buildWhatsAppOrderUrl(p.url),
            handleOrDisplay: p.handleOrDisplay && !p.handleOrDisplay.startsWith('http') ? p.handleOrDisplay : '0549 75 94 89',
          };
        }
        return p;
      });
    }
    return defaultSocialPlatforms;
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);

      // Clean WhatsApp URL from either direct input or platforms
      const cleanWaUrl = buildWhatsAppOrderUrl(whatsappPhone);
      const cleanWaDisplay = whatsappPhone.trim() || '0549 75 94 89';

      // Normalize social platforms so any WhatsApp entry is 100% valid
      let hasWaPlatform = false;
      const normalizedPlatforms = socialPlatforms.map((p) => {
        if (isWhatsAppPlatform(p)) {
          hasWaPlatform = true;
          return {
            ...p,
            id: p.id || 'whatsapp',
            name: 'WhatsApp',
            icon: 'whatsapp' as const,
            url: cleanWaUrl,
            handleOrDisplay: cleanWaDisplay,
            enabled: true,
          };
        }
        return p;
      });

      if (!hasWaPlatform) {
        normalizedPlatforms.unshift({
          id: 'whatsapp',
          name: 'WhatsApp',
          icon: 'whatsapp',
          url: cleanWaUrl,
          handleOrDisplay: cleanWaDisplay,
          enabled: true,
          isPrimaryOrderPlatform: true,
          displayOrder: 1,
        });
      }

      const primary = normalizedPlatforms.find((p) => p.isPrimaryOrderPlatform && p.enabled) || normalizedPlatforms[0];
      const instaPlatform = normalizedPlatforms.find((p) => p.icon === 'instagram');

      await onSaveSettings({
        brandName,
        brandTagline,
        currency,
        orderMessageTemplate,
        guaranteeGeneralText,
        footerText,
        independentBrandNotice,
        socialPlatforms: normalizedPlatforms,
        whatsappUrl: cleanWaUrl,
        whatsappPhone: cleanWaDisplay,
        whatsappDisplay: cleanWaDisplay,
        instagramUrl: instaPlatform?.url || settings.instagramUrl || 'https://instagram.com/yovodz',
        instagramUsername: instaPlatform?.handleOrDisplay || settings.instagramUsername || '@yovodz',
      });
      showToast('تم حفظ إعدادات المتجر ومنصات التواصل وتحديث رابط WhatsApp بنجاح ✓');
    } catch (e: any) {
      alert('حدث خطأ أثناء حفظ الإعدادات: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl" dir="rtl">
      
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-600" />
            <span>إعدادات المتجر ومنصات التواصل</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدارة حسابات التواصل، منصة استقبال الطلبات، ونصوص وهوية المتجر مع مزامنة فورية في Firestore
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave()}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}</span>
        </button>
      </div>

      {/* Social Platforms Manager Component */}
      <SocialPlatformsManager
        platforms={socialPlatforms}
        onChange={(updated) => setSocialPlatforms(updated)}
      />

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand & Identity */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            معلومات الهوية والعلامة
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم المتجر (Brand Name)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رمز العملة الافتراضي
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="دج"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              شعار المتجر التعريفي (Tagline)
            </label>
            <input
              type="text"
              value={brandTagline}
              onChange={(e) => setBrandTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <SocialIcon icon="whatsapp" className="w-3.5 h-3.5 text-emerald-600" />
                <span>رقم WhatsApp الأساسي لاستقبال الطلبات</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-mono font-medium">
                {buildWhatsAppOrderUrl(whatsappPhone)}
              </span>
            </label>
            <input
              type="text"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              placeholder="05XXXXXXXX أو +213XXXXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/20 text-slate-900 text-xs font-mono focus:border-emerald-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              يمكنك كتابة رقم الهاتف الجزائري مباشرة (مثل 0549759489 أو +213549759489)، وسيقوم المتجر تلقائياً بتوليد رابط المراسلة الصحيح <code className="text-emerald-700 font-mono font-bold">wa.me</code>.
            </p>
          </div>
        </div>

        {/* Order Message Template */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">
                قالب رسالة الطلب التلقائية (Order Message Template)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setOrderMessageTemplate(DEFAULT_ORDER_MESSAGE_TEMPLATE)}
              className="text-[11px] font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>استعادة القالب الافتراضي</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            الرسالة التي يتم إنشاؤها وتعبئتها تلقائياً بالاعتماد على المنتج والخطة المحددة وإرسالها مباشرة عبر WhatsApp مع نسخها لحافظة الزبون.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              نص القالب (يمكنك استخدام المتغيرات التالية بالضغط عليها):
            </label>

            {/* Variable chips */}
            <div className="flex flex-wrap gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => setOrderMessageTemplate((prev) => `${prev} {product}`)}
                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-mono font-medium border border-sky-200/70 transition-colors flex items-center gap-1 cursor-pointer"
                title="اسم المنتج المختار"
              >
                <span>{'{product}'}</span>
                <span className="text-[10px] text-sky-500 font-sans">(اسم المنتج)</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderMessageTemplate((prev) => `${prev} {plan}`)}
                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-mono font-medium border border-sky-200/70 transition-colors flex items-center gap-1 cursor-pointer"
                title="مدة الخطة أو نوعها"
              >
                <span>{'{plan}'}</span>
                <span className="text-[10px] text-sky-500 font-sans">(مدة الخطة)</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderMessageTemplate((prev) => `${prev} {price}`)}
                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-mono font-medium border border-sky-200/70 transition-colors flex items-center gap-1 cursor-pointer"
                title="السعر والعملة"
              >
                <span>{'{price}'}</span>
                <span className="text-[10px] text-sky-500 font-sans">(السعر والعملة)</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={orderMessageTemplate}
              onChange={(e) => setOrderMessageTemplate(e.target.value)}
              placeholder="سلام Yovo 👋 حاب نطلب اشتراك: {product} – {plan} – {price}. من فضلك ابعثلي تفاصيل الدفع والتفعيل."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:border-sky-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Live Dynamic Sample Preview */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px]">
              <Copy className="w-3.5 h-3.5 text-sky-600" />
              <span>معاينة حية للرسالة المنسوخة (مثال لطلب: Canva Pro – 2 Years – 600 دج):</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-[11px] font-mono whitespace-pre-wrap leading-relaxed">
              {generateOrderMessage(
                orderMessageTemplate,
                { name: 'Canva Pro' },
                { duration: '2 Years', price: 600 },
                currency
              )}
            </div>
          </div>
        </div>

        {/* Guarantees & Transparency Text */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>نصوص الضمان والشفافية القانونية</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              النص العام لسياسة الضمان
            </label>
            <textarea
              rows={2}
              value={guaranteeGeneralText}
              onChange={(e) => setGuaranteeGeneralText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>تنويه العلامة المستقلة وإخلاء المسؤولية</span>
            </label>
            <textarea
              rows={2}
              value={independentBrandNotice}
              onChange={(e) => setIndependentBrandNotice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              نص التذييل (Footer Text)
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جارٍ الحفظ في Firestore...' : 'حفظ جميع الإعدادات'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
