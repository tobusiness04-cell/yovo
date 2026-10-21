import React from 'react';
import { StoreConfig } from '../types';
import { storeConfig, getEnabledSocialPlatforms, getOrderPlatformUrl } from '../config';
import { Smartphone, Building2, Zap } from 'lucide-react';
import { SocialIcon } from './common/SocialIcon';

interface FooterProps {
  settings?: StoreConfig;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentSettings = settings || storeConfig;
  const currentYear = new Date().getFullYear();
  const enabledPlatforms = getEnabledSocialPlatforms(currentSettings);

  return (
    <footer id="footer" className="bg-[#071E12] text-white border-t border-emerald-950 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-emerald-900/50">
          
          {/* Brand & Mini Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <a href="#hero" className="flex items-center gap-2 mb-2 inline-flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#006633] via-[#008040] to-[#6cff76] text-white flex items-center justify-center font-brand font-black text-base shadow-xs">
                Y
              </div>
              <span className="font-brand font-black text-xl text-white tracking-tight uppercase">
                {currentSettings.brandName}
              </span>
            </a>
            <p className="text-xs text-slate-300 font-normal">
              متجر الاشتراكات الرقمية وخدمات Premium بالدينار الجزائري 🇩🇿
            </p>
          </div>

          {/* Payment Methods Badges */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400 font-medium ml-1">طرق الدفع:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-emerald-200 border border-white/10 text-[11px] font-bold">
              <Smartphone className="w-3.5 h-3.5 text-[#6cff76]" />
              BaridiMob
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10 text-[11px] font-bold">
              <Building2 className="w-3.5 h-3.5 text-slate-300" />
              CCP
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-amber-200 border border-white/10 text-[11px] font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              فليكسي
            </span>
          </div>

          {/* Social Platforms Links */}
          {enabledPlatforms.length > 0 && (
            <div className="flex items-center gap-2">
              {enabledPlatforms.map((platform) => {
                const targetUrl = getOrderPlatformUrl(platform.url);
                return (
                  <a
                    key={platform.id}
                    id={`footer-social-${platform.id}`}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-all border border-white/10"
                    aria-label={platform.name}
                  >
                    <SocialIcon icon={platform.icon} className="w-3.5 h-3.5 text-[#6cff76]" />
                    <span>{platform.name}</span>
                  </a>
                );
              })}
            </div>
          )}

        </div>

        {/* Minimal Navigation & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#hero" className="hover:text-white transition-colors">الرئيسية</a>
            <a href="#products" className="hover:text-white transition-colors">الاشتراكات</a>
            <a href="#payment" className="hover:text-white transition-colors">طرق الدفع</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">كيفاش تطلب؟</a>
            <a href="#faq" className="hover:text-white transition-colors">الأسئلة الشائعة</a>
          </nav>

          <div className="text-center sm:text-left">
            <span>© {currentYear} {currentSettings.brandName}. جميع الحقوق محفوظة.</span>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-4 pt-3 border-t border-emerald-950/60 text-center text-[10px] text-slate-500">
          {currentSettings.independentBrandNotice}
        </div>

      </div>
    </footer>
  );
};
