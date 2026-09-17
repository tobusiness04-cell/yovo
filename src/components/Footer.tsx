import React from 'react';
import { StoreConfig } from '../types';
import { storeConfig, getEnabledSocialPlatforms, getOrderPlatformUrl } from '../config';
import { ArrowUpLeft, Star } from 'lucide-react';
import { SocialIcon } from './common/SocialIcon';

interface FooterProps {
  settings?: StoreConfig;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentSettings = settings || storeConfig;
  const currentYear = new Date().getFullYear();
  const enabledPlatforms = getEnabledSocialPlatforms(currentSettings);

  return (
    <footer id="footer" className="bg-slate-50 border-t border-slate-200/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-6">
            <a href="#hero" className="flex items-center gap-2.5 mb-4 inline-flex">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-base shadow-xs">
                Y
              </div>
              <div className="flex flex-col">
                <span className="font-brand font-black text-xl text-slate-950 tracking-tight leading-none">
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

            {/* Dynamic Social Platforms Badges */}
            {enabledPlatforms.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                {enabledPlatforms.map((platform) => {
                  const isPrimary = Boolean(platform.isPrimaryOrderPlatform);
                  const targetUrl = getOrderPlatformUrl(platform.url);

                  return (
                    <a
                      key={platform.id}
                      id={`footer-social-${platform.id}`}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isPrimary
                          ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <SocialIcon icon={platform.icon} className="w-3.5 h-3.5" />
                      <span>{platform.name}</span>
                      {isPrimary && <Star className="w-2.5 h-2.5 fill-sky-400 text-sky-400 ml-0.5" />}
                    </a>
                  );
                })}
              </div>
            )}
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

          {/* Contact & Orders Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              التواصل والطلب
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              للطلب أو الاستفسار عن أي اشتراك، راسلنا مباشرة عبر قنواتنا الرسمية:
            </p>
            <ul className="space-y-2 text-xs">
              {enabledPlatforms.map((platform) => (
                <li key={platform.id} className="flex items-center gap-2 text-slate-700">
                  <span className="font-semibold">{platform.name}:</span>
                  <a
                    href={getOrderPlatformUrl(platform.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:underline font-mono text-[11px] inline-flex items-center gap-0.5"
                  >
                    <span>{platform.handleOrDisplay || platform.name}</span>
                    <ArrowUpLeft className="w-2.5 h-2.5" />
                  </a>
                </li>
              ))}
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
