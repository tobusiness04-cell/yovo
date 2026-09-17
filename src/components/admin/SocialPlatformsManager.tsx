import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Star,
  ArrowUp,
  ArrowDown,
  Check,
  Globe,
  Share2,
  AlertCircle,
  X,
} from 'lucide-react';
import { SocialPlatform, SocialPlatformIcon } from '../../types';
import { SocialIcon } from '../common/SocialIcon';

interface SocialPlatformsManagerProps {
  platforms: SocialPlatform[];
  onChange: (updated: SocialPlatform[]) => void;
}

interface PlatformPreset {
  id: string;
  name: string;
  icon: SocialPlatformIcon;
  urlPlaceholder: string;
  defaultHandle: string;
}

const PRESETS: PlatformPreset[] = [
  { id: 'instagram', name: 'Instagram', icon: 'instagram', urlPlaceholder: 'https://instagram.com/USERNAME', defaultHandle: '@USERNAME' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', urlPlaceholder: 'https://facebook.com/PAGE', defaultHandle: 'اسم الصفحة' },
  { id: 'telegram', name: 'Telegram', icon: 'telegram', urlPlaceholder: 'https://t.me/USERNAME', defaultHandle: '@USERNAME' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok', urlPlaceholder: 'https://tiktok.com/@USERNAME', defaultHandle: '@USERNAME' },
  { id: 'messenger', name: 'Messenger', icon: 'messenger', urlPlaceholder: 'https://m.me/USERNAME', defaultHandle: 'Messenger' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', urlPlaceholder: 'https://youtube.com/@CHANNEL', defaultHandle: '@CHANNEL' },
  { id: 'x', name: 'X (Twitter)', icon: 'x', urlPlaceholder: 'https://x.com/USERNAME', defaultHandle: '@USERNAME' },
  { id: 'custom', name: 'منصة مخصصة', icon: 'custom', urlPlaceholder: 'https://...', defaultHandle: 'رابط مباشر' },
];

export const SocialPlatformsManager: React.FC<SocialPlatformsManagerProps> = ({
  platforms,
  onChange,
}) => {
  const [editingPlatform, setEditingPlatform] = useState<SocialPlatform | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formHandle, setFormHandle] = useState('');
  const [formIcon, setFormIcon] = useState<SocialPlatformIcon>('instagram');
  const [formEnabled, setFormEnabled] = useState(true);
  const [formIsPrimary, setFormIsPrimary] = useState(false);
  const [formOrder, setFormOrder] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  const openAddModal = (preset?: PlatformPreset) => {
    setValidationError(null);
    const newOrder = platforms.length > 0
      ? Math.max(...platforms.map((p) => p.displayOrder || 0)) + 1
      : 1;

    if (preset) {
      setFormId(`${preset.id}_${Date.now()}`);
      setFormName(preset.name);
      setFormUrl('');
      setFormHandle(preset.defaultHandle);
      setFormIcon(preset.icon);
    } else {
      setFormId(`platform_${Date.now()}`);
      setFormName('');
      setFormUrl('');
      setFormHandle('');
      setFormIcon('custom');
    }
    setFormEnabled(true);
    setFormIsPrimary(platforms.length === 0);
    setFormOrder(newOrder);
    setEditingPlatform(null);
    setIsModalOpen(true);
  };

  const openEditModal = (platform: SocialPlatform) => {
    setValidationError(null);
    setEditingPlatform(platform);
    setFormId(platform.id);
    setFormName(platform.name);
    setFormUrl(platform.url);
    setFormHandle(platform.handleOrDisplay || '');
    setFormIcon((platform.icon as SocialPlatformIcon) || 'custom');
    setFormEnabled(platform.enabled);
    setFormIsPrimary(Boolean(platform.isPrimaryOrderPlatform));
    setFormOrder(platform.displayOrder || 1);
    setIsModalOpen(true);
  };

  const handleApplyPreset = (preset: PlatformPreset) => {
    setFormName(preset.name);
    setFormIcon(preset.icon);
    if (!formHandle || formHandle === '@USERNAME') {
      setFormHandle(preset.defaultHandle);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setValidationError('يرجى كتابة اسم المنصة');
      return;
    }
    if (!formUrl.trim()) {
      setValidationError('يرجى إدخال رابط المنصة');
      return;
    }

    let cleanUrl = formUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    let updated: SocialPlatform[];

    if (editingPlatform) {
      // Editing existing
      updated = platforms.map((p) => {
        if (p.id === editingPlatform.id) {
          return {
            ...p,
            name: formName.trim(),
            url: cleanUrl,
            handleOrDisplay: formHandle.trim(),
            icon: formIcon,
            enabled: formEnabled,
            isPrimaryOrderPlatform: formIsPrimary,
            displayOrder: Number(formOrder) || 1,
          };
        }
        // If this platform was marked primary, unmark others
        if (formIsPrimary) {
          return { ...p, isPrimaryOrderPlatform: false };
        }
        return p;
      });
    } else {
      // Adding new
      const newPlatform: SocialPlatform = {
        id: formId,
        name: formName.trim(),
        url: cleanUrl,
        handleOrDisplay: formHandle.trim(),
        icon: formIcon,
        enabled: formEnabled,
        isPrimaryOrderPlatform: formIsPrimary,
        displayOrder: Number(formOrder) || 1,
      };

      if (formIsPrimary) {
        updated = platforms.map((p) => ({ ...p, isPrimaryOrderPlatform: false }));
        updated.push(newPlatform);
      } else {
        updated = [...platforms, newPlatform];
      }
    }

    // Ensure at least one enabled platform is primary if any exist
    const hasPrimary = updated.some((p) => p.isPrimaryOrderPlatform && p.enabled);
    if (!hasPrimary) {
      const firstEnabledIndex = updated.findIndex((p) => p.enabled);
      if (firstEnabledIndex >= 0) {
        updated[firstEnabledIndex] = { ...updated[firstEnabledIndex], isPrimaryOrderPlatform: true };
      }
    }

    updated.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
    onChange(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const target = platforms.find((p) => p.id === id);
    if (!target) return;
    if (!confirm(`هل أنت متأكد من حذف منصة "${target.name}"؟`)) return;

    let updated = platforms.filter((p) => p.id !== id);

    // If we deleted the primary platform, make another enabled platform primary
    if (target.isPrimaryOrderPlatform && updated.length > 0) {
      const firstEnabledIndex = updated.findIndex((p) => p.enabled);
      if (firstEnabledIndex >= 0) {
        updated[firstEnabledIndex] = { ...updated[firstEnabledIndex], isPrimaryOrderPlatform: true };
      } else if (updated[0]) {
        updated[0] = { ...updated[0], isPrimaryOrderPlatform: true };
      }
    }

    onChange(updated);
  };

  const handleToggleEnabled = (id: string) => {
    const updated = platforms.map((p) => {
      if (p.id === id) {
        const nextEnabled = !p.enabled;
        return {
          ...p,
          enabled: nextEnabled,
          // If disabled, cannot be primary
          isPrimaryOrderPlatform: nextEnabled ? p.isPrimaryOrderPlatform : false,
        };
      }
      return p;
    });

    // Check if we disabled the primary platform
    const hasPrimary = updated.some((p) => p.isPrimaryOrderPlatform && p.enabled);
    if (!hasPrimary) {
      const firstEnabledIndex = updated.findIndex((p) => p.enabled);
      if (firstEnabledIndex >= 0) {
        updated[firstEnabledIndex] = { ...updated[firstEnabledIndex], isPrimaryOrderPlatform: true };
      }
    }

    onChange(updated);
  };

  const handleSetPrimary = (id: string) => {
    const updated = platforms.map((p) => ({
      ...p,
      isPrimaryOrderPlatform: p.id === id,
      enabled: p.id === id ? true : p.enabled, // automatically enable when set to primary
    }));
    onChange(updated);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newPlatforms = [...platforms];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPlatforms.length) return;

    const temp = newPlatforms[index];
    newPlatforms[index] = newPlatforms[targetIndex];
    newPlatforms[targetIndex] = temp;

    // Re-assign displayOrder sequence
    const updated = newPlatforms.map((p, idx) => ({
      ...p,
      displayOrder: idx + 1,
    }));

    onChange(updated);
  };

  const primaryPlatform = platforms.find((p) => p.isPrimaryOrderPlatform);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-sky-600" />
            <span>منصات التواصل وقنوات استقبال الطلبات (Social Media & Order)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            حدد حساباتك في مختلف المنصات، واختر الحساب الأساسي الذي يستقبل طلبات الزبائن (شراء/طلب)
          </p>
        </div>

        <button
          id="add-social-platform-btn"
          type="button"
          onClick={() => openAddModal()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منصة جديدة</span>
        </button>
      </div>

      {/* Primary Order Platform Highlight Selector */}
      <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>المنصة الأساسية للطلبات (Primary Order Platform):</span>
                {primaryPlatform ? (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-sky-300 text-sky-700 font-extrabold text-[11px] inline-flex items-center gap-1">
                    <SocialIcon icon={primaryPlatform.icon} className="w-3 h-3 text-sky-600" />
                    {primaryPlatform.name}
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold text-xs">غير محدد</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                أي ضغطة على زر &quot;اطلب الآن&quot; أو &quot;شراء&quot; في كامل الموقع ستفتح رابط هذه المنصة مباشرة في تبويب جديد.
              </p>
            </div>
          </div>

          {platforms.filter((p) => p.enabled).length > 0 && (
            <div className="shrink-0">
              <select
                id="select-primary-order-platform"
                value={primaryPlatform?.id || ''}
                onChange={(e) => handleSetPrimary(e.target.value)}
                className="px-3 py-1.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-sky-500 shadow-2xs"
              >
                {platforms
                  .filter((p) => p.enabled)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.handleOrDisplay ? `(${p.handleOrDisplay})` : ''}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add from Presets */}
      <div>
        <span className="text-xs font-bold text-slate-600 block mb-2">
          إضافة سريعة لمنصات شائعة:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.slice(0, 7).map((preset) => {
            const alreadyExists = platforms.some((p) => p.icon === preset.icon || p.name.toLowerCase() === preset.name.toLowerCase());
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => openAddModal(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  alreadyExists
                    ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:text-sky-700 shadow-2xs'
                }`}
              >
                <SocialIcon icon={preset.icon} className="w-3.5 h-3.5 text-slate-500" />
                <span>+ {preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Platforms Table / List */}
      <div className="space-y-3">
        {platforms.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Globe className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">لا توجد منصات تواصل مضافة حالياً</p>
            <p className="text-[11px] text-slate-500 mt-1 mb-4">
              أضف حسابك على Instagram لتمكين الزبائن من إرسال الطلبات والاستفسارات
            </p>
            <button
              type="button"
              onClick={() => openAddModal(PRESETS[0])}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              + إضافة حساب Instagram الآن
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            {platforms.map((platform, idx) => {
              const isPrimary = Boolean(platform.isPrimaryOrderPlatform);
              return (
                <div
                  key={platform.id}
                  className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isPrimary
                      ? 'bg-sky-50/40'
                      : !platform.enabled
                      ? 'bg-slate-50/80 opacity-70'
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Left (RTL Start): Icon & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Order buttons */}
                    <div className="flex flex-col gap-0.5 shrink-0 text-slate-400">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveOrder(idx, 'up')}
                        className="p-1 hover:text-slate-700 disabled:opacity-20 transition-colors"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === platforms.length - 1}
                        onClick={() => handleMoveOrder(idx, 'down')}
                        className="p-1 hover:text-slate-700 disabled:opacity-20 transition-colors"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isPrimary
                          ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <SocialIcon icon={platform.icon} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {platform.name}
                        </span>
                        {platform.handleOrDisplay && (
                          <span className="text-[11px] text-slate-500 font-mono">
                            {platform.handleOrDisplay}
                          </span>
                        )}
                        {isPrimary && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-emerald-700" />
                            <span>منصة الطلبات الأساسية</span>
                          </span>
                        )}
                        {!platform.enabled && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold">
                            معطلة
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-sky-600 hover:underline font-mono truncate max-w-[260px] sm:max-w-md inline-flex items-center gap-1 dir-ltr text-left"
                        >
                          <span>{platform.url}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right (RTL End): Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {/* Primary Button */}
                    {!isPrimary && platform.enabled && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(platform.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-sky-700 hover:bg-sky-100 bg-sky-50 border border-sky-200 transition-colors"
                      >
                        تعيين كأساسية
                      </button>
                    )}

                    {/* Enabled / Disabled Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(platform.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                        platform.enabled
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {platform.enabled ? 'مفعلة' : 'معطلة'}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEditModal(platform)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="تعديل"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(platform.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-right overflow-hidden transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <SocialIcon icon={formIcon} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingPlatform ? 'تعديل منصة تواصل' : 'إضافة منصة تواصل جديدة'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  حدد بيانات المنصة لتظهر في واجهة المتجر وتستقبل طلبات العملاء
                </p>
              </div>
            </div>

            {validationError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Preset Chooser if adding */}
              {!editingPlatform && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اختر نوع المنصة:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold border flex flex-col items-center gap-1 transition-all ${
                          formIcon === preset.icon
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <SocialIcon icon={preset.icon} className="w-4 h-4" />
                        <span className="truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المنصة (Display Name) *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: Instagram أو Facebook"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط الحساب / المنصة (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://instagram.com/yovodz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden dir-ltr text-left font-mono"
                />
              </div>

              {/* Handle / display text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المستخدم أو النص التوضيحي
                  </label>
                  <input
                    type="text"
                    value={formHandle}
                    onChange={(e) => setFormHandle(e.target.value)}
                    placeholder="مثال: @yovodz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    أيقونة المنصة (Icon)
                  </label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value as SocialPlatformIcon)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="telegram">Telegram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="messenger">Messenger</option>
                    <option value="youtube">YouTube</option>
                    <option value="x">X (Twitter)</option>
                    <option value="custom">مخصص (Globe/Link)</option>
                  </select>
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ترتيب الظهور في الموقع
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                  className="w-24 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Switches */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formEnabled}
                    onChange={(e) => setFormEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    تفعيل هذه المنصة في الموقع العام
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPrimary}
                    onChange={(e) => {
                      setFormIsPrimary(e.target.checked);
                      if (e.target.checked) setFormEnabled(true);
                    }}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      تعيين كمنصة أساسية لاستقبال الطلبات (Primary Order Platform)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      سيتم توجيه جميع أزرار &quot;اطلب الآن&quot; والشراء في الموقع إلى رابط هذا الحساب
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ المنصة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
