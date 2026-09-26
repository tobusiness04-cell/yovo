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
    <footer id="footer" className="bg-[#0F172A] text-white border-t border-slate-800 pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-6">
            <a href="#hero" className="flex items-center gap-2.5 mb-4 inline-flex group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6] text-white flex items-center justify-center font-brand font-black text-xl shadow-xs group-hover:scale-105 transition-all">
                Y
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-brand font-black text-2xl text-white tracking-tight leading-none uppercase">
                    {currentSettings.brandName}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse"></span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 tracking-wide mt-0.5">
                  متجر اشتراكات رقمية
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed mb-6 font-normal">
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
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isPrimary
                          ? 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white border-transparent hover:opacity-95 shadow-md shadow-blue-500/20'
                          : 'bg-white/10 text-white hover:bg-white/15 border-white/10'
                      }`}
                    >
                      <SocialIcon icon={platform.icon} className="w-3.5 h-3.5" />
                      <span>{platform.name}</span>
                      {isPrimary && <Star className="w-2.5 h-2.5 fill-white text-white ml-0.5" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <a href="#hero" className="hover:text-white transition-colors inline-block font-semibold">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors inline-block font-semibold">
                  الاشتراكات المتوفرة
                </a>
              </li>
              <li>
                <a href="#why" className="hover:text-white transition-colors inline-block font-semibold">
                  علاش Yovo؟
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors inline-block font-semibold">
                  كيفاش تطلب؟
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors inline-block font-semibold">
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Orders Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              التواصل والطلب
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              للطلب أو الاستفسار عن أي اشتراك، راسلنا مباشرة عبر قنواتنا الرسمية:
            </p>
            <ul className="space-y-2 text-xs">
              {enabledPlatforms.map((platform) => (
                <li key={platform.id} className="flex items-center gap-2 text-gray-300">
                  <span className="font-semibold text-gray-400">{platform.name}:</span>
                  <a
                    href={getOrderPlatformUrl(platform.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3B82F6] hover:text-[#22D3EE] hover:underline font-mono text-[11px] inline-flex items-center gap-0.5 font-bold transition-colors"
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
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="text-right">
            <p className="font-normal text-gray-400">
              {currentSettings.independentBrandNotice}
            </p>
          </div>

          <div className="text-gray-400 text-left shrink-0 font-medium">
            © {currentYear} {currentSettings.brandName}. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

