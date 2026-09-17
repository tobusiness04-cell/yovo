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
    (p) => p.id === 'canva-pro' || p.slug === 'canva-pro' || p.name.toLowerCase().includes('canva')
  );
  const capcutProduct = products?.find(
    (p) => p.id === 'capcut-pro' || p.slug === 'capcut-pro' || p.name.toLowerCase().includes('capcut')
  );
  const chatgptProduct = products?.find(
    (p) => p.id === 'chatgpt-plus' || p.slug === 'chatgpt-plus' || p.name.toLowerCase().includes('chatgpt')
  );
  return (
    <section id="hero" className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      {/* Subtle background ambient mesh (no gaudy gradients) */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[500px] h-[350px] bg-slate-200/40 rounded-full blur-3xl opacity-60 transform -translate-y-12"></div>
        <div className="w-[300px] h-[300px] bg-sky-100/50 rounded-full blur-3xl opacity-50 transform translate-x-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Copy (Left side in LTR, Right side in RTL) */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Small Brand Badge */}
            <div
              id="hero-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/5 border border-slate-200/80 text-slate-800 text-xs font-semibold mb-6 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span>Yovo — اشتراكات رقمية</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 font-normal">الجزائر 🇩🇿</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-main-headline"
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.25] sm:leading-[1.2] mb-6"
            >
              كل الاشتراكات اللي تحتاجها، <br />
              <span className="text-slate-900 relative inline-block">
                في بلاصة وحدة.
                <span className="absolute bottom-1 right-0 w-full h-2.5 bg-sky-200/60 -z-10 rounded-sm"></span>
              </span>
            </h1>

            {/* Supporting Text */}
            <p
              id="hero-supporting-text"
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8 font-normal"
            >
              اختار الاشتراك المناسب ليك، شوف السعر والمدة، وتواصل معنا بسهولة باش تكمل الطلب.
              خدمات أصلية، تفعيل سريع، وأسعار واضحة بالدينار الجزائري.
            </p>

            {/* CTA Action Buttons */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <a
                id="hero-primary-cta"
                href="#products"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <span>شوف الاشتراكات</span>
                <ArrowUpLeft className="w-4 h-4 text-sky-400" />
              </a>

              <button
                id="hero-secondary-cta"
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all active:scale-98"
              >
                <Send className="w-4 h-4 text-slate-500" />
                <span>تواصل معنا</span>
              </button>
            </div>

            {/* Key Value Micro-Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 w-full max-w-xl text-right">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">تفعيل سريع</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">ضمان الخدمة</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">أسعار مرنة دج</span>
              </div>
            </div>

          </div>

          {/* Hero Visual: Independent Yovo Digital Multi-Product Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Central Card Container */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 relative overflow-hidden">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-brand font-bold text-sm">
                      Y
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Yovo Store Catalog</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Digital Subscriptions Algeria</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    متوفر للطلب
                  </span>
                </div>

                {/* Subscriptions Multi-Product Mini Stack */}
                <div className="space-y-3">
                  
                  {/* Item 1: Canva Pro */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 font-bold flex items-center justify-center text-xs border border-sky-100">
                        C
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{canvaProduct?.name || 'Canva Pro'}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-sky-100 text-sky-800 font-semibold">{canvaProduct?.category || 'تصميم'}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{canvaProduct?.description || 'قوالب، إزالة خلفية ومميزات Pro'}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-900 font-brand">
                        من {formatPrice(canvaProduct?.price ?? 500, canvaProduct?.currency ?? 'دج')}
                      </span>
                      <p className="text-[10px] text-slate-400">{canvaProduct?.duration || 'شهري / سنوي'}</p>
                    </div>
                  </div>

                  {/* Item 2: CapCut Pro */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        CP
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{capcutProduct?.name || 'CapCut Pro'}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-semibold">{capcutProduct?.category || 'مونتاج'}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{capcutProduct?.description || 'تأثيرات حصرية وترجمة تلقائية'}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-900 font-brand">
                        من {formatPrice(capcutProduct?.price ?? 700, capcutProduct?.currency ?? 'دج')}
                      </span>
                      <p className="text-[10px] text-slate-400">{capcutProduct?.duration || 'شهري / 3 أشهر'}</p>
                    </div>
                  </div>

                  {/* Item 3: ChatGPT Plus */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-100">
                        AI
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">ChatGPT Plus</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-teal-100 text-teal-800 font-semibold">ذكاء اصطناعي</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">GPT-4o، توليد الصور والمستندات</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-900 font-brand">2,800 دج</span>
                      <p className="text-[10px] text-slate-400">شهري</p>
                    </div>
                  </div>

                </div>

                {/* Floating Bottom Trust Chip */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                    دعم سريع عبر Instagram
                  </span>
                  <span className="font-semibold text-slate-900">100% شفافية</span>
                </div>

              </div>

              {/* Floating Feature Pill Left */}
              <div className="hidden sm:flex absolute -bottom-5 -left-4 bg-slate-900 text-white rounded-2xl px-4 py-2.5 shadow-lg items-center gap-2.5 text-xs font-medium border border-slate-700">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>أسعار مرنة ومدد متنوعة</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
