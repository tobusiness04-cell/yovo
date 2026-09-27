import React from 'react';
import { ArrowUpLeft, Send, Sparkles, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../lib/formatters';

interface HeroProps {
  onOpenContact: () => void;
  products?: Product[];
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact, products }) => {
  const canvaProduct = products?.find(
    (p) => p.id === 'canva-pro' || p.name.toLowerCase().includes('canva')
  );
  const capcutProduct = products?.find(
    (p) => p.id === 'capcut-pro' || p.name.toLowerCase().includes('capcut')
  );
  const chatgptProduct = products?.find(
    (p) => p.id === 'chatgpt-plus' || p.name.toLowerCase().includes('chatgpt')
  );

  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#F0FDF4] via-white to-[#F8FAFC] text-slate-900 py-8 sm:py-14 overflow-hidden border-b border-slate-200">
      {/* Subtle modern abstract background accents */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-[#6cff76]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#006633]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-10 w-80 h-80 bg-[#6cff76]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Store Badge */}
            <div
              id="hero-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/80 text-[11px] sm:text-xs font-semibold mb-3.5 shadow-2xs backdrop-blur-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#6cff76] animate-pulse" />
              <span className="text-slate-900 font-bold">متجر Yovo</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">اشتراكات رقمية مضمونة 🇩🇿</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-main-headline"
              className="text-2xl sm:text-4xl lg:text-[44px] font-black text-slate-950 tracking-tight leading-[1.25] mb-3 sm:mb-4"
            >
              كل أدواتك الرقمية الأصلية، <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#006633] via-[#008040] to-[#10B981] bg-clip-text text-transparent">
                في مكان واحد موثوق وبسيط.
              </span>
            </h1>

            {/* Supporting Text */}
            <p
              id="hero-supporting-text"
              className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mb-5 sm:mb-6 font-normal"
            >
              احصل على اشتراكات <strong className="text-slate-900 font-bold">Canva Pro</strong>، <strong className="text-slate-900 font-bold">CapCut Pro</strong>، وأحدث أدوات الذكاء الاصطناعي مع تفعيل فوري، دعم متواصل وأسعار واضحة بالدينار الجزائري.
            </p>

            {/* Action Buttons */}
            <div className="w-full sm:w-auto flex flex-row items-center gap-2.5 sm:gap-3.5 mb-6">
              <a
                id="hero-primary-cta"
                href="#products"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-black text-[#003319] bg-[#6cff76] hover:bg-[#5ae664] shadow-md shadow-[#6cff76]/30 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#003319]" />
                <span>اكتشف المنتجات</span>
                <ArrowUpLeft className="w-4 h-4" />
              </a>

              <button
                id="hero-secondary-cta"
                type="button"
                onClick={onOpenContact}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-emerald-50/50 border-2 border-slate-200 hover:border-[#006633] transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                <Send className="w-4 h-4 text-[#006633]" />
                <span>تواصل معنا</span>
              </button>
            </div>

            {/* 4 Pillars Grid (Matching the brand identity pills) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-4 border-t border-slate-200/80 w-full max-w-xl text-right text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                <span className="font-bold text-slate-800">تفعيل سريع</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                <span className="font-bold text-slate-800">أمان وموثوقية</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                <span className="font-bold text-slate-800">دعم مباشر</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span className="font-bold text-slate-800">أسعار مناسبة</span>
              </div>
            </div>

          </div>

          {/* Compact Product Visual Showcase (Desktop & Tablet) */}
          <div className="hidden sm:block lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200/80 relative">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#006633] via-[#008040] to-[#6cff76] text-white flex items-center justify-center font-brand font-black text-sm shadow-xs">
                      Y
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">الاشتراكات الأكثر طلباً</span>
                      <span className="text-[10px] text-slate-400">تفعيل رسمي ومضمون</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    متوفر الآن
                  </span>
                </div>

                {/* Subscriptions Mini List */}
                <div className="space-y-2.5">
                  
                  {/* Canva Pro */}
                  <a
                    href="#products"
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C4CC] via-[#0075FF] to-[#7D2AE8] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                        C
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{canvaProduct?.name || 'Canva Pro'}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#6cff76]/30 text-[#004d26] font-bold">الأكثر طلباً</span>
                        </div>
                        <p className="text-[10px] text-slate-500">تصميم وقوالب بريميوم كاملة</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-black text-slate-900 font-brand block">
                        من {formatPrice(canvaProduct?.price ?? 450, canvaProduct?.currency ?? 'دج')}
                      </span>
                    </div>
                  </a>

                  {/* CapCut Pro */}
                  <a
                    href="#products"
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                        CP
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{capcutProduct?.name || 'CapCut Pro'}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">مونتاج</span>
                        </div>
                        <p className="text-[10px] text-slate-500">تأثيرات حصرية وتصدير 4K</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-black text-slate-900 font-brand block">
                        من {formatPrice(capcutProduct?.price ?? 700, capcutProduct?.currency ?? 'دج')}
                      </span>
                    </div>
                  </a>

                  {/* ChatGPT Plus */}
                  <a
                    href="#products"
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#10A37F] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                        AI
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{chatgptProduct?.name || 'ChatGPT Plus'}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">GPT-4o</span>
                        </div>
                        <p className="text-[10px] text-slate-500">توليد نصوص وصور وتحليل بيانات</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-black text-slate-900 font-brand block">
                        من {formatPrice(chatgptProduct?.price ?? 2800, chatgptProduct?.currency ?? 'دج')}
                      </span>
                    </div>
                  </a>

                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006633]" />
                    طلب وتفعيل فوري
                  </span>
                  <span className="font-bold text-[#006633]">ضمان كامل بالدينار</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
