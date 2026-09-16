import React from 'react';
import { ArrowUpLeft, MessageCircle, Send } from 'lucide-react';
import { storeConfig } from '../config';
import { StoreConfig } from '../types';

interface FooterProps {
  settings?: StoreConfig;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentSettings = settings || storeConfig;
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand Column */}
          <div className="md:col-span-6 flex flex-col items-start text-right">
            <a href="#hero" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-brand font-bold text-xl shadow-xs">
                <span className="text-sky-400">Y</span>
                <span>o</span>
              </div>
              <div className="flex flex-col">
                <span className="font-brand font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
                  {currentSettings.brandName}
                </span>
                <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">
                  اشتراكات رقمية
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed mb-6 font-normal">
              {currentSettings.footerText}
            </p>

            <div className="flex items-center gap-3">
              <a
                id="footer-whatsapp-btn"
                href={currentSettings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                id="footer-instagram-btn"
                href={currentSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-slate-500" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a href="#hero" className="hover:text-slate-950 transition-colors inline-block">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-slate-950 transition-colors inline-block">
                  الاشتراكات المتوفرة
                </a>
              </li>
              <li>
                <a href="#why" className="hover:text-slate-950 transition-colors inline-block">
                  علاش Yovo؟
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-slate-950 transition-colors inline-block">
                  كيفاش تطلب؟
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-slate-950 transition-colors inline-block">
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              التواصل والطلب
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              للطلب أو الاستفسار عن أي اشتراك غير معروض، راسلنا عبر قنواتنا الرسمية:
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-700">
                <span className="font-semibold">Instagram:</span>
                <a
                  href={currentSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:underline font-mono text-[11px]"
                >
                  {currentSettings.instagramUsername}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <span className="font-semibold">WhatsApp:</span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {currentSettings.whatsappDisplay}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Independence Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-right">
            <p className="font-medium text-slate-700">
              {currentSettings.independentBrandNotice}
            </p>
          </div>

          <div className="text-slate-400 text-left shrink-0">
            © {currentYear} {currentSettings.brandName}. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
