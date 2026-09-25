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
      className="fixed inset-0 z-50 overflow-y-auto bg-[#080B0F]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E5E7EB] text-right overflow-hidden transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-contact-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-[#6B7280] hover:text-[#080B0F] hover:bg-[#F3F4F6] rounded-full transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#080B0F] text-white flex items-center justify-center mb-4 border border-black shadow-xs">
          <Send className="w-5 h-5 text-[#FF3B30]" />
        </div>

        <h3 className="text-xl font-black text-[#080B0F] tracking-tight mb-1.5">
          تواصل مع متجر Yovo
        </h3>

        <p className="text-xs text-[#6B7280] leading-relaxed mb-6 font-normal">
          راسلنا عبر قناتنا الرسمية للطلب المباشر، الاستفسار عن الاشتراكات، أو طلب خدمة غير معروضة في المتجر.
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
                      ? 'bg-[#FF3B30] text-white hover:bg-[#E02D22] border-[#FF3B30] shadow-sm shadow-[#FF3B30]/30'
                      : 'bg-[#F3F4F6] hover:bg-gray-200 text-[#080B0F] border-[#E5E7EB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                        isPrimary
                          ? 'bg-white/15 text-white border border-white/20'
                          : 'bg-white text-[#080B0F] border border-[#E5E7EB]'
                      }`}
                    >
                      <SocialIcon icon={platform.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-sm font-bold ${isPrimary ? 'text-white' : 'text-[#080B0F]'}`}>
                          {platform.name}
                        </h4>
                        {isPrimary && (
                          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-white text-white" />
                            <span>أساسي للطلبات</span>
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] ${isPrimary ? 'text-white/80' : 'text-[#6B7280]'} font-mono`}>
                        {platform.handleOrDisplay || platform.url}
                      </p>
                    </div>
                  </div>
                  <ArrowUpLeft
                    className={`w-4 h-4 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${
                      isPrimary ? 'text-white' : 'text-[#6B7280]'
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

        <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-center">
          <p className="text-[11px] text-[#6B7280]">
            فريق {currentSettings.brandName} متواجد يومياً لمتابعة طلباتكم واستفساراتكم.
          </p>
        </div>
      </div>
    </div>
  );
};

