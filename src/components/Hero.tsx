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
    <section id="hero" className="relative bg-[#080B0F] text-white py-6 sm:py-10 overflow-hidden border-b border-gray-800">
      {/* Subtle abstract background accent */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#FF3B30]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-64 h-64 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Main Hero Copy (Compact & Fast) */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Store Badge */}
            <div
              id="hero-badge"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] sm:text-xs font-semibold mb-3 backdrop-blur-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
              <span className="text-white font-bold">متجر Yovo</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300 font-medium">اشتراكات رقمية مضمونة 🇩🇿</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-main-headline"
              className="text-2xl sm:text-3xl lg:text-[40px] font-black text-white tracking-tight leading-[1.25] mb-2 sm:mb-3"
            >
              كل اشتراكاتك الرقمية الأصلية، <br className="hidden sm:block" />
              <span className="text-[#FF3B30] relative inline-block">
                في مكان واحد موثوق.
              </span>
            </h1>

            {/* Supporting Text */}
            <p
              id="hero-supporting-text"
              className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xl mb-4 sm:mb-5 font-normal"
            >
              احصل على اشتراكات <strong className="text-white font-semibold">Canva Pro</strong>، <strong className="text-white font-semibold">CapCut Pro</strong>، وأحدث أدوات الذكاء الاصطناعي مع تفعيل فوري وأسعار واضحة بالدينار الجزائري.
            </p>

            {/* Action Buttons */}
            <div className="w-full sm:w-auto flex flex-row items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <a
                id="hero-primary-cta"
                href="#products"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#FF3B30] hover:bg-[#E02D22] shadow-sm shadow-[#FF3B30]/30 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90" />
                <span>تصفح الكتالوج</span>
                <ArrowUpLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>

              <button
                id="hero-secondary-cta"
                type="button"
                onClick={onOpenContact}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-gray-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-gray-400" />
                <span>تواصل معنا</span>
              </button>
            </div>

            {/* Key Value Micro-Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-800/80 w-full max-w-md text-right text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#FF3B30] shrink-0" />
                <span className="font-semibold text-gray-300">تفعيل فوري</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF3B30] shrink-0" />
                <span className="font-semibold text-gray-300">ضمان معلن</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF3B30] shrink-0" />
                <span className="font-semibold text-gray-300">دفع بريدي موب</span>
              </div>
            </div>

          </div>

          {/* Compact Product Visual Showcase (Desktop & Tablet) */}
          <div className="hidden sm:block lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="bg-[#0e131a] rounded-2xl p-4 shadow-2xl border border-gray-800 relative">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#FF3B30] text-white flex items-center justify-center font-brand font-black text-xs">
                      Y
                    </div>
                    <span className="text-xs font-bold text-white">الاشتراكات الأكثر طلباً</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    متوفر الآن
                  </span>
                </div>

                {/* Subscriptions Mini List */}
                <div className="space-y-2">
                  
                  {/* Canva Pro */}
                  <a
                    href="#products"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-gray-800/80 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C4CC] to-[#7D2AE8] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                        C
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{canvaProduct?.name || 'Canva Pro'}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-[#FF3B30]/20 text-[#FF6B6B] font-bold">شائع</span>
                        </div>
                        <p className="text-[10px] text-gray-400">تصميم وقوالب بريميوم</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-white font-brand block">
                        من {formatPrice(canvaProduct?.price ?? 450, canvaProduct?.currency ?? 'دج')}
                      </span>
                    </div>
                  </a>

                  {/* CapCut Pro */}
                  <a
                    href="#products"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-gray-800/80 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-black text-white font-bold flex items-center justify-center text-xs border border-gray-700 shadow-xs">
                        CP
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{capcutProduct?.name || 'CapCut Pro'}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-gray-800 text-gray-300 font-semibold">مونتاج</span>
                        </div>
                        <p className="text-[10px] text-gray-400">تأثيرات حصرية وبدون علامة</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-white font-brand block">
                        من {formatPrice(capcutProduct?.price ?? 700, capcutProduct?.currency ?? 'دج')}
                      </span>
                    </div>
                  </a>

                  {/* ChatGPT Plus */}
                  <a
                    href="#products"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-gray-800/80 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#10A37F] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                        AI
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{chatgptProduct?.name || 'ChatGPT Plus'}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-teal-500/20 text-teal-300 font-semibold">GPT-4o</span>
                        </div>
                        <p className="text-[10px] text-gray-400">تحليل مستندات وتوليد صور</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-white font-brand block">
                        من {formatPrice(chatgptProduct?.price ?? 2800, chatgptProduct?.currency ?? 'دج')}
                      </span>
                    </div>
                  </a>

                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1 text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                    طلب وتفعيل مباشر
                  </span>
                  <span className="font-semibold text-white">أسعار واضحة بالدينار</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
