import React from 'react';
import { X, Send, ArrowUpLeft, Star, AlertCircle } from 'lucide-react';
import { storeConfig, getEnabledSocialPlatforms, getOrderPlatformUrl } from '../config';
import { StoreConfig } from '../types';
import { SocialIcon } from './common/SocialIcon';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: StoreConfig;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, settings }) => {
  if (!isOpen) return null;

  const currentSettings = settings || storeConfig;
  const enabledPlatforms = getEnabledSocialPlatforms(currentSettings);

  return (
    <div
      id="contact-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-right overflow-hidden transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-contact-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
          <Send className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1.5">
          تواصل معنا مباشرة
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
          راسلنا عبر قناتنا الرسمية للطلب، الاستفسار عن الاشتراكات، أو طلب خدمة غير معروضة في الموقع.
        </p>

        <div className="space-y-3">
          {enabledPlatforms.length > 0 ? (
            enabledPlatforms.map((platform) => {
              const isPrimary = Boolean(platform.isPrimaryOrderPlatform);
              const targetUrl = getOrderPlatformUrl(platform.url);

              return (
                <a
                  key={platform.id}
                  id={`modal-channel-${platform.id}`}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full p-4 rounded-2xl flex items-center justify-between group transition-all border ${
                    isPrimary
                      ? 'bg-slate-900 text-white hover:bg-slate-850 border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                        isPrimary
                          ? 'bg-slate-800 text-sky-400 border border-slate-700'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <SocialIcon icon={platform.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-sm font-bold ${isPrimary ? 'text-white' : 'text-slate-900'}`}>
                          {platform.name}
                        </h4>
                        {isPrimary && (
                          <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-sky-300" />
                            <span>أساسي للطلبات</span>
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] ${isPrimary ? 'text-slate-300' : 'text-slate-500'} font-mono`}>
                        {platform.handleOrDisplay || platform.url}
                      </p>
                    </div>
                  </div>
                  <ArrowUpLeft
                    className={`w-4 h-4 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${
                      isPrimary ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  />
                </a>
              );
            })
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>لا توجد قنوات تواصل مفعلة حالياً.</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            فريق {currentSettings.brandName} متواجد يومياً لمتابعة طلباتكم واستفساراتكم.
          </p>
        </div>
      </div>
    </div>
  );
};
