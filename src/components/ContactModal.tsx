import React from 'react';
import { X, MessageCircle, Send, ArrowUpLeft } from 'lucide-react';
import { storeConfig } from '../config';
import { StoreConfig } from '../types';
import { buildWhatsAppInquiryUrl } from '../lib/formatters';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: StoreConfig;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, settings }) => {
  if (!isOpen) return null;

  const currentSettings = settings || storeConfig;
  const whatsappInquiryLink = buildWhatsAppInquiryUrl(currentSettings.whatsappUrl);

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
          <MessageCircle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1.5">
          تواصل معنا مباشرة
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
          راسلنا عبر قناتك المفضلة للطلب، الاستفسار عن الاشتراكات، أو طلب خدمة غير معروضة في الموقع.
        </p>

        <div className="space-y-3">
          {/* WhatsApp Direct */}
          <a
            id="modal-whatsapp-link"
            href={whatsappInquiryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">المراسلة عبر WhatsApp</h4>
                <p className="text-[11px] text-slate-500">{currentSettings.whatsappDisplay || 'رد سريع ومباشر لتأكيد طلبك'}</p>
              </div>
            </div>
            <ArrowUpLeft className="w-4 h-4 text-emerald-700 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Instagram Direct */}
          <a
            id="modal-instagram-link"
            href={currentSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">المراسلة عبر Instagram</h4>
                <p className="text-[11px] text-slate-500">{currentSettings.instagramUsername}</p>
              </div>
            </div>
            <ArrowUpLeft className="w-4 h-4 text-slate-700 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
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
