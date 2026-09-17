import React from 'react';
import { ArrowUpLeft, Send } from 'lucide-react';

interface FinalCTAProps {
  onOpenContact: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenContact }) => {
  return (
    <section id="final-cta" className="py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-14 overflow-hidden text-center shadow-xl">
          
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2
              id="final-cta-headline"
              className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4"
            >
              لقى الاشتراك اللي تحتاجو؟
            </h2>

            <p
              id="final-cta-supporting"
              className="text-xs sm:text-base text-slate-300 leading-relaxed mb-8 font-normal"
            >
              شوف الخدمات المتوفرة وتواصل معنا باش تعرف السعر والمدة والتفاصيل.
              فريقنا جاهز لتفعيل طلبك والإجابة على كل استفساراتك فوراً.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                id="final-cta-explore-btn"
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-md transition-all active:scale-98"
              >
                <span>شوف الاشتراكات</span>
                <ArrowUpLeft className="w-4 h-4 text-slate-950" />
              </a>

              <button
                id="final-cta-contact-btn"
                type="button"
                onClick={onOpenContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-all active:scale-98"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>راسلنا الآن</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
