import React from 'react';
import { ArrowDown, Sparkles, Zap, ShieldCheck, Smartphone } from 'lucide-react';

interface HeroProps {
  onOpenContact?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#F0FDF4] via-white to-white text-slate-900 py-6 sm:py-10 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Compact Store Badge */}
        <div
          id="hero-badge"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-emerald-200 text-[11px] sm:text-xs font-bold text-slate-800 mb-3.5 shadow-2xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#006633] animate-pulse" />
          <span>متجر Yovo</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-800">اشتراكات رقمية بالدينار الجزائري 🇩🇿</span>
        </div>

        {/* Clean Arabic Headline */}
        <h1
          id="hero-main-headline"
          className="text-2xl sm:text-4xl lg:text-[42px] font-black text-slate-950 tracking-tight leading-[1.25] mb-2.5 sm:mb-3"
        >
          كل اشتراكاتك الرقمية في بلاصة وحدة.
        </h1>

        {/* Clean Subtitle */}
        <p
          id="hero-supporting-text"
          className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto mb-5 sm:mb-6 font-normal"
        >
          Canva، CapCut، ChatGPT والمزيد — أسعار واضحة وطلب سهل.
        </p>

        {/* Single Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <a
            id="hero-primary-cta"
            href="#products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#006633] to-[#008844] hover:opacity-95 shadow-md shadow-[#006633]/25 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#6cff76]" />
            <span>شوف الاشتراكات</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>

        {/* Compact Trust Micro-Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-600 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#006633]" />
            <span>تفعيل فوري</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[#006633]" />
            <span>دفع عبر BaridiMob أو CCP أو فليكسي</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006633]" />
            <span>ضمان كامل ودعم WhatsApp</span>
          </div>
        </div>

      </div>
    </section>
  );
};
