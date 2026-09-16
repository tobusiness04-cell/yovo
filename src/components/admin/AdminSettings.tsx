import React, { useState } from 'react';
import { StoreConfig } from '../../types';
import { Save, Check, Settings, MessageCircle, Instagram, ShieldCheck, FileText } from 'lucide-react';

interface AdminSettingsProps {
  settings: StoreConfig;
  onSaveSettings: (settings: Partial<StoreConfig>) => Promise<void>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [brandName, setBrandName] = useState(settings.brandName || 'Yovo');
  const [brandTagline, setBrandTagline] = useState(settings.brandTagline || 'متجر الاشتراكات الرقمية في الجزائر');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || 'https://instagram.com/yovodz');
  const [instagramUsername, setInstagramUsername] = useState(settings.instagramUsername || '@yovodz');
  const [whatsappUrl, setWhatsappUrl] = useState(settings.whatsappUrl || 'https://wa.me/213XXXXXXXXX');
  const [whatsappDisplay, setWhatsappDisplay] = useState(settings.whatsappDisplay || 'WhatsApp مباشر');
  const [currency, setCurrency] = useState(settings.currency || 'دج');
  const [guaranteeGeneralText, setGuaranteeGeneralText] = useState(
    settings.guaranteeGeneralText || 'نوفر ضمان استقرار وتفعيل رسمي لكل خدمة حسب مدتها المحددة.'
  );
  const [footerText, setFooterText] = useState(
    settings.footerText || 'جميع الحقوق محفوظة. Yovo متجر اشتراكات رقمية مستقل يخدم العملاء في الجزائر.'
  );
  const [independentBrandNotice, setIndependentBrandNotice] = useState(
    settings.independentBrandNotice ||
      'Yovo هي علامة تجارية وخدمة وساطة رقمية مستقلة في الجزائر، وغير تابعة أو مدعومة بشكل رسمي من الشركات المذكورة (مثل Canva أو CapCut).'
  );

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSaveSettings({
        brandName,
        brandTagline,
        instagramUrl,
        instagramUsername,
        whatsappUrl,
        whatsappDisplay,
        currency,
        guaranteeGeneralText,
        footerText,
        independentBrandNotice,
      });
      showToast('تم حفظ إعدادات المتجر بنجاح');
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
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-600" />
          <span>إعدادات المتجر والتواصل</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          يتم مزامنة هذه الإعدادات تلقائياً مع واجهة الموقع العامة في الوقت الفعلي
        </p>
      </div>

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

        {/* Channels & Direct Order Links */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            قنوات الطلب والتواصل المباشر
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>رابط WhatsApp للطلبات</span>
              </label>
              <input
                type="text"
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                placeholder="https://wa.me/213XXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نص عرض رقم WhatsApp
              </label>
              <input
                type="text"
                value={whatsappDisplay}
                onChange={(e) => setWhatsappDisplay(e.target.value)}
                placeholder="+213 555 00 00 00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>رابط حساب Instagram</span>
              </label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/yovodz"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم المستخدم على Instagram
              </label>
              <input
                type="text"
                value={instagramUsername}
                onChange={(e) => setInstagramUsername(e.target.value)}
                placeholder="@yovodz"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden dir-ltr text-left"
              />
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
              نص التذييل (Footer Copyright)
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
            <span>{saving ? 'جارٍ الحفظ في Firestore...' : 'حفظ التغييرات'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
