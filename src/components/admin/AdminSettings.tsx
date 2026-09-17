import React, { useState } from 'react';
import { StoreConfig, SocialPlatform } from '../../types';
import { Save, Check, Settings, ShieldCheck, FileText, Share2 } from 'lucide-react';
import { defaultSocialPlatforms } from '../../config';
import { SocialPlatformsManager } from './SocialPlatformsManager';

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

  // Social platforms state
  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>(() => {
    if (Array.isArray(settings.socialPlatforms) && settings.socialPlatforms.length > 0) {
      return settings.socialPlatforms;
    }
    if (settings.instagramUrl) {
      return [
        {
          id: 'instagram',
          name: 'Instagram',
          url: settings.instagramUrl,
          handleOrDisplay: settings.instagramUsername || '@yovodz',
          icon: 'instagram',
          enabled: true,
          isPrimaryOrderPlatform: true,
          displayOrder: 1,
        },
      ];
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

      // Find primary platform for backwards-compatible fields
      const primary = socialPlatforms.find((p) => p.isPrimaryOrderPlatform && p.enabled) || socialPlatforms[0];
      const instaPlatform = socialPlatforms.find((p) => p.icon === 'instagram') || primary;

      await onSaveSettings({
        brandName,
        brandTagline,
        currency,
        guaranteeGeneralText,
        footerText,
        independentBrandNotice,
        socialPlatforms,
        instagramUrl: instaPlatform?.url || 'https://instagram.com/yovodz',
        instagramUsername: instaPlatform?.handleOrDisplay || '@yovodz',
      });
      showToast('تم حفظ إعدادات المتجر ومنصات التواصل بنجاح');
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
